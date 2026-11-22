import mongoose from 'mongoose';
const subtitleSchema = new mongoose.Schema({
  language: { type: String, trim: true, maxlength: 40 },
  label: { type: String, trim: true, maxlength: 60 },
  url: { type: String, trim: true }
}, { _id: false });
const movieSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 160 },
  slug: { type: String, required: true, unique: true, lowercase: true, index: true },
  description: { type: String, required: true, maxlength: 3000 },
  year: { type: Number, min: 1888, max: 2100 },
  genres: [{ type: String, trim: true }],
  languages: [{ type: String, trim: true }],
  runtime: { type: Number, min: 1, max: 1000 },
  maturityRating: { type: String, default: 'U', maxlength: 12 },
  contentType: { type: String, enum: ['movie', 'series'], default: 'movie' },
  posterUrl: { type: String, trim: true },
  backdropUrl: { type: String, trim: true },
  trailerUrl: { type: String, trim: true },
  streamUrl: { type: String, trim: true, select: false },
  authorizedMedia: { type: Boolean, default: false },
  subtitles: [subtitleSchema],
  cast: [{ type: String, trim: true }],
  director: { type: String, trim: true },
  isFeatured: { type: Boolean, default: false },
  collections: [{ type: String, trim: true }],
  status: { type: String, enum: ['draft', 'published'], default: 'published' }
}, { timestamps: true });
movieSchema.index({ title: 'text', description: 'text', genres: 'text' });
export default mongoose.model('Movie', movieSchema);