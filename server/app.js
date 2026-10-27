import express from 'express';
import rateLimit from 'express-rate-limit';
import { getApps, initializeApp, applicationDefault, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { AccessToken } from 'livekit-server-sdk';

export function createApp({ verifyUser, issueToken } = {}) {
  const app = express();
  app.disable('x-powered-by');
  app.use(express.json({ limit: '2kb' }));
  app.post('/api/token', rateLimit({ windowMs: 60000, limit: 20 }), async (req, res) => {
    res.set('Cache-Control', 'no-store');
    const bearer = /^Bearer (\S+)$/.exec(req.headers.authorization || '');
    if (!bearer) return res.status(401).json({ error: 'Vui lòng đăng nhập để vào phòng.' });
    const room = req.body?.room;
    if (typeof room !== 'string' || !/^[a-zA-Z0-9_-]{1,80}$/.test(room)) return res.status(400).json({ error: 'Tên phòng gồm 1–80 chữ không dấu, số, dấu gạch ngang hoặc gạch dưới.' });
    let user;
    try {
      if (verifyUser) user = await verifyUser(bearer[1]);
      else {
        if (!process.env.FIREBASE_PROJECT_ID) return res.status(503).json({ error: 'Backend chưa cấu hình Firebase Admin.' });
        if (!getApps().length) initializeApp({ projectId: process.env.FIREBASE_PROJECT_ID, credential: process.env.FIREBASE_SERVICE_ACCOUNT_JSON ? cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON)) : applicationDefault() });
        user = await getAuth().verifyIdToken(bearer[1], true);
      }
    } catch (error) {
      const sessionErrors = ['auth/id-token-expired', 'auth/id-token-revoked', 'auth/argument-error', 'auth/invalid-id-token', 'auth/user-disabled', 'auth/user-not-found'];
      if (sessionErrors.includes(error.code)) return res.status(401).json({ error: 'Phiên đăng nhập không hợp lệ hoặc đã hết hạn. Vui lòng đăng xuất và đăng nhập lại.' });
      if (verifyUser) return res.status(401).json({ error: 'Không thể xác thực phiên đăng nhập.' });
      return res.status(503).json({ error: 'Backend không thể xác thực với Firebase Admin. Kiểm tra kết nối mạng và cấu hình khóa dịch vụ trên máy chủ.' });
    }
    try {
      if (issueToken) return res.json(await issueToken(user, room));
      const { LIVEKIT_URL, LIVEKIT_API_KEY, LIVEKIT_API_SECRET } = process.env;
      if (!LIVEKIT_URL?.startsWith('wss://') || !LIVEKIT_API_KEY || !LIVEKIT_API_SECRET) return res.status(503).json({ error: 'Backend chưa cấu hình LiveKit URL, API key và secret.' });
      const token = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, {
        identity: user.uid, name: user.name || user.email?.split('@')[0] || 'Người dùng', ttl: '10m',
        metadata: JSON.stringify({ photoURL: user.picture || '' }),
      });
      token.addGrant({ roomJoin: true, room, canPublish: true, canSubscribe: true, canPublishData: true });
      return res.json({ token: await token.toJwt(), serverUrl: LIVEKIT_URL });
    } catch { return res.status(503).json({ error: 'Chưa thể cấp token cuộc gọi. Kiểm tra cấu hình backend.' }); }
  });
  app.use((error, req, res, next) => { if (res.headersSent) return next(error); res.status(400).json({ error: 'Yêu cầu không hợp lệ.' }); });
  return app;
}
