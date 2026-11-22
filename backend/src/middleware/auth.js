import jwt from 'jsonwebtoken';
import User from '../models/User.js';
export async function authenticate(req, res, next) {
  try {
    const token = req.cookies?.token || (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
    if (!token) return res.status(401).json({ message: 'Please sign in to continue.' });
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.sub).select('name email role watchlist');
    if (!user) return res.status(401).json({ message: 'Your session is no longer valid.' });
    req.user = user; next();
  } catch {
    return res.status(401).json({ message: 'Your session is invalid or has expired.' });
  }
}
export function requireAdmin(req, res, next) {
  if (req.user?.role !== 'admin') return res.status(403).json({ message: 'Administrator access is required.' });
  next();
}