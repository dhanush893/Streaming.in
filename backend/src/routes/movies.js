import { Router } from 'express';
import Movie from '../models/Movie.js';
const router = Router();
function safeRegex(value) { return String(value || '').replace(/[^a-z0-9 ]/gi, '').slice(0, 80); }
router.get('/', async (req, res, next) => {
  try {
    const filter = { status: 'published' };
    if (req.query.type && ['movie', 'series'].includes(req.query.type)) filter.contentType = req.query.type;
    if (req.query.genre) filter.genres = { $in: [new RegExp('^' + safeRegex(req.query.genre) + '$', 'i')] };
    if (req.query.language) filter.languages = { $in: [new RegExp('^' + safeRegex(req.query.language) + '$', 'i')] };
    if (req.query.year && /^\d{4}$/.test(String(req.query.year))) filter.year = Number(req.query.year);
    if (req.query.q) {
      const term = new RegExp(safeRegex(req.query.q), 'i');
      filter.$or = [{ title: term }, { description: term }, { genres: term }, { cast: term }];
    }
    const sortMap = { newest: { year: -1, createdAt: -1 }, oldest: { year: 1 }, title: { title: 1 }, rating: { createdAt: -1 } };
    const limit = Math.min(Math.max(Number(req.query.limit) || 60, 1), 100);
    const movies = await Movie.find(filter).select('+streamUrl').sort(sortMap[req.query.sort] || { isFeatured: -1, createdAt: -1 }).limit(limit).lean();
    for (const movie of movies) if (!movie.authorizedMedia) delete movie.streamUrl;
    res.json({ movies });
  } catch (error) { next(error); }
});
router.get('/:slug', async (req, res, next) => {
  try {
    const movie = await Movie.findOne({ slug: req.params.slug, status: 'published' }).select('+streamUrl').lean();
    if (!movie) return res.status(404).json({ message: 'Title not found.' });
    if (!movie.authorizedMedia) delete movie.streamUrl;
    const similar = await Movie.find({ _id: { $ne: movie._id }, status: 'published', genres: { $in: movie.genres || [] } }).select('-streamUrl').limit(8).lean();
    res.json({ movie, similar });
  } catch (error) { next(error); }
});
export default router;