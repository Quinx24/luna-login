import { createApp } from '../server/app.js';

// Vercel Node function: reuse the authenticated token endpoint without listen().
const app = createApp();
export default function handler(req, res) {
  return app(req, res);
}
