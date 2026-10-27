import test from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from './app.js';

test('token endpoint enforces authentication, room validation and verified identity', async () => {
  const issued = [];
  const app = createApp({
    verifyUser: async token => { if (token !== 'valid') throw new Error('invalid'); return { uid: 'firebase-user', name: 'Tên thật' }; },
    issueToken: async (user, room) => { issued.push({ user, room }); return { token: 'test-only', serverUrl: 'wss://test.invalid' }; },
  });
  const server = app.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  const url = `http://127.0.0.1:${server.address().port}/api/token`;
  async function request(token, room) { return fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: JSON.stringify({ room, name: 'forged' }) }); }
  try {
    assert.equal((await request(null, 'room')).status, 401);
    assert.equal((await request('invalid', 'room')).status, 401);
    assert.equal((await request('valid', '../bad')).status, 400);
    assert.equal((await request('valid', 'a'.repeat(81))).status, 400);
    const response = await request('valid', 'nhom15');
    assert.equal(response.status, 200);
    assert.equal(response.headers.get('cache-control'), 'no-store');
    assert.deepEqual(issued, [{ user: { uid: 'firebase-user', name: 'Tên thật' }, room: 'nhom15' }]);
  } finally { await new Promise(resolve => server.close(resolve)); }
});
