import { Router } from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import multer from 'multer';
import mongoose from 'mongoose';
import Movie from '../models/Movie.js';
import User from '../models/User.js';
const router = Router();
const uploadDir = path.resolve(process.env.UPLOAD_DIR || 'uploads');
fs.mkdirSync(uploadDir, { recursive: true });
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => cb(null, randomUUID() + path.extname(file.originalname).toLowerCase())
});
const upload = multer({
  storage, limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, cb) => {
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/avif'].includes(file.mimetype)) return cb(new Error('Only JPG, PNG, WEBP or AVIF images are allowed.'));
    cb(null, true);
  }
});
function slugify(value) {
  return String(value || '').toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 150);
}
function validUrl(value, fieldName) {
  if (!value) return;
  try { const parsed = new URL(value); if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error(); }
  catch { throw new Error(fieldName + ' must be a valid HTTP or HTTPS URL.'); }
}
function normalizePayload(body) {
  const title = String(body.title || '').trim();
  const description = String(body.description || '').trim();
  if (title.length < 1 || title.length > 160) throw new Error('Title is required and must be under 160 characters.');
  if (!description || description.length > 3000) throw new Error('Description is required and must be under 3000 characters.');
  const authorizedMedia = body.authorizedMedia === true || body.authorizedMedia === 'true';
  const streamUrl = String(body.streamUrl || '').trim();
  if (streamUrl) validUrl(streamUrl, 'Stream URL');
  if (authorizedMedia && !streamUrl) throw new Error('Add a stream URL when authorized media is enabled.');
  const list = value => Array.isArray(value) ? value : String(value || '').split(',');
  return {
    title, description, slug: slugify(body.slug || title),
    year: Number(body.year) || undefined, genres: list(body.genres).map(v => String(v).trim()).filter(Boolean),
    languages: list(body.languages).map(v => String(v).trim()).filter(Boolean),
    runtime: Number(body.runtime) || undefined, maturityRating: String(body.maturityRating || 'U').slice(0, 12),
    contentType: body.contentType === 'series' ? 'series' : 'movie',
    posterUrl: String(body.posterUrl || '').trim(), backdropUrl: String(body.backdropUrl || '').trim(),
    trailerUrl: String(body.trailerUrl || '').trim(), streamUrl, authorizedMedia,
    subtitles: Array.isArray(body.subtitles) ? body.subtitles : [],
    cast: list(body.cast).map(v => String(v).trim()).filter(Boolean), director: String(body.director || '').trim(),
    isFeatured: body.isFeatured === true || body.isFeatured === 'true',
    collections: list(body.collections).map(v => String(v).trim()).filter(Boolean),
    status: body.status === 'draft' ? 'draft' : 'published'
  };
}
router.get('/analytics', async (_req, res, next) => {
  try {
    const [titles, published, users, admins] = await Promise.all([
      Movie.countDocuments(), Movie.countDocuments({ status: 'published' }),
      User.countDocuments(), User.countDocuments({ role: 'admin' })
    ]);
    res.json({ analytics: { titles, published, users, admins } });
  } catch (error) { next(error); }
});
router.get('/users', async (_req, res, next) => {
  try {
    const users = await User.find().select('name email role createdAt').sort({ createdAt: -1 }).limit(200).lean();
    res.json({ users });
  } catch (error) { next(error); }
});
router.get('/movies', async (_req, res, next) => {
  try {
    const movies = await Movie.find().select('+streamUrl').sort({ updatedAt: -1 }).limit(200).lean();
    res.json({ movies });
  } catch (error) { next(error); }
});
router.post('/upload', (req, res, next) => {
  upload.single('file')(req, res, error => {
    if (error) return res.status(400).json({ message: error.message });
    if (!req.file) return res.status(400).json({ message: 'Choose an image to upload.' });
    const baseUrl = process.env.PUBLIC_API_URL || req.protocol + '://' + req.get('host');
    res.status(201).json({ url: baseUrl.replace(/\/$/, '') + '/uploads/' + req.file.filename });
  });
});
router.post('/movies', async (req, res) => {
  try {
    const payload = normalizePayload(req.body);
    validUrl(payload.posterUrl, 'Poster URL'); validUrl(payload.backdropUrl, 'Backdrop URL'); validUrl(payload.trailerUrl, 'Trailer URL');
    if (await Movie.exists({ slug: payload.slug })) payload.slug += '-' + randomUUID().slice(0, 6);
    const movie = await Movie.create(payload);
    res.status(201).json({ movie });
  } catch (error) { res.status(400).json({ message: error.message }); }
});
router.patch('/movies/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid title ID.' });
    const payload = normalizePayload(req.body);
    validUrl(payload.posterUrl, 'Poster URL'); validUrl(payload.backdropUrl, 'Backdrop URL'); validUrl(payload.trailerUrl, 'Trailer URL');
    if (await Movie.exists({ slug: payload.slug, _id: { $ne: req.params.id } })) return res.status(409).json({ message: 'That title slug is already in use.' });
    const movie = await Movie.findByIdAndUpdate(req.params.id, payload, { new: true, runValidators: true }).select('+streamUrl');
    if (!movie) return res.status(404).json({ message: 'Title not found.' });
    res.json({ movie });
  } catch (error) { res.status(400).json({ message: error.message }); }
});
router.delete('/movies/:id', async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid title ID.' });
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) return res.status(404).json({ message: 'Title not found.' });
    await User.updateMany({ watchlist: movie._id }, { $pull: { watchlist: movie._id } });
    res.json({ message: 'Title deleted.' });
  } catch (error) { next(error); }
});
export default router;