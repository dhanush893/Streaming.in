import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import path from 'node:path';
import { connectDatabase } from './config/db.js';
import User from './models/User.js';
import { authenticate, requireAdmin } from './middleware/auth.js';
import authRoutes from './routes/auth.js';
import movieRoutes from './routes/movies.js';
import userRoutes from './routes/users.js';
import adminRoutes from './routes/admin.js';
const app = express();
const port = Number(process.env.PORT) || 5000;
const frontendOrigins = (process.env.CLIENT_URL || 'http://localhost:5173').split(',').map(v => v.trim()).filter(Boolean);
app.disable('x-powered-by');
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({
  origin(origin, callback) {
    if (!origin || frontendOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('This origin is not allowed by CORS.'));
  }, credentials: true
}));
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());
const uploadDir = path.resolve(process.env.UPLOAD_DIR || 'uploads');
app.use('/uploads', express.static(uploadDir, { fallthrough: false, maxAge: '7d', immutable: true }));
app.get('/api/health', (_req, res) => res.json({ status: 'ok', service: 'DHANU MOVIE ADDA STREAM API' }));
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', authenticate, requireAdmin, adminRoutes);
app.use((req, res) => res.status(404).json({ message: 'API route not found.' }));
app.use((error, _req, res, _next) => {
  console.error(error.message);
  const status = error.status || 500;
  res.status(status).json({ message: status === 500 ? 'Something went wrong. Please try again.' : error.message });
});
async function bootstrapAdmin() {
  const email = String(process.env.ADMIN_EMAIL || '').trim().toLowerCase();
  const password = String(process.env.ADMIN_PASSWORD || '');
  if (!email || !password) return;
  if (password.length < 12) { console.warn('ADMIN_PASSWORD must be at least 12 characters; bootstrap administrator skipped.'); return; }
  const existing = await User.findOne({ email });
  if (!existing) {
    await User.create({ name: 'Platform Admin', email, password, role: 'admin' });
    console.log('Bootstrap administrator created.');
  } else console.log('Bootstrap administrator already exists; credentials were not changed.');
}
await connectDatabase();
await bootstrapAdmin();
app.listen(port, () => console.log('DHANU MOVIE ADDA STREAM API listening on port ' + port));