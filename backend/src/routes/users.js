import { Router } from 'express';
import mongoose from 'mongoose';
import Movie from '../models/Movie.js';
import { authenticate } from '../middleware/auth.js';
const router = Router();
router.use(authenticate);
router.get('/watchlist', async (req, res, next) => {
  try {
    const user = await req.user.populate({ path: 'watchlist', match: { status: 'published' }, select: '-streamUrl' });
    res.json({ movies: user.watchlist || [] });
  } catch (error) { next(error); }
});
router.post('/watchlist/:movieId', async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.movieId)) return res.status(400).json({ message: 'Invalid title ID.' });
    const movie = await Movie.findOne({ _id: req.params.movieId, status: 'published' });
    if (!movie) return res.status(404).json({ message: 'Title not found.' });
    await req.user.updateOne({ $addToSet: { watchlist: movie._id } });
    res.json({ message: 'Added to My List.' });
  } catch (error) { next(error); }
});
router.delete('/watchlist/:movieId', async (req, res, next) => {
  try {
    await req.user.updateOne({ $pull: { watchlist: req.params.movieId } });
    res.json({ message: 'Removed from My List.' });
  } catch (error) { next(error); }
});
export default router;