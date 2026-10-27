import 'dotenv/config';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { createApp } from './app.js';
const app = createApp();
const dist = fileURLToPath(new URL('../dist/', import.meta.url));
app.use(express.static(dist));
app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.listen(process.env.PORT || 3001, () => console.log('ConnectUs backend đã khởi động.'));
