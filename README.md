# DHANU MOVIE ADDA STREAM.IN

**YOUR CINEMATIC WORLD, ALL IN ONE PLACE.**

A responsive OTT-style discovery and authorized-media streaming platform built with React, Vite, Tailwind CSS, Express and MongoDB.

> **Content rights:** Use only videos, trailers, artwork and subtitles that you own, have licensed, or are otherwise authorized to use. The bundled catalogue is illustrative demo metadata. Its one playable sample is the MDN CC0 flower clip used to test the HTML media player; replace it with your own authorized media before production.

## Features
- Responsive cinematic homepage, navigation, details, categories, search and filters
- Movie / series listings, My List, continue-watching progress and featured collections
- HTML5 playback with HLS.js, subtitles, browser controls and HLS quality selection when levels are available
- User accounts with HTTP-only JWT cookies and password hashing
- Admin-only title management, artwork uploads, authorized media sources, user list and analytics
- MongoDB-backed API, rate-limited sign-in and role-based admin access
- Demo catalogue fallback when the backend is not configured

## Structure
\`\`\`
frontend/       React + Vite application
backend/        Express API + MongoDB models and routes
render.yaml     Render API service blueprint
package.json    Root development scripts
\`\`\`

## Local setup
Requirements: Node.js 20+ and MongoDB (local or Atlas).
\`\`\`bash
npm install
npm run install:all
\`\`\`
Copy \`backend/.env.example\` to \`backend/.env\` and configure MongoDB, JWT secret and frontend origin. Then run:
\`\`\`bash
npm run dev
\`\`\`
Open the Vite URL (normally \`http://localhost:5173\`). API health check: \`http://localhost:5000/api/health\`. The demo catalogue works without MongoDB, but accounts, watchlists and admin features require the API and database.

## Environment variables
See [backend/.env.example](backend/.env.example).
- \`MONGODB_URI\`: MongoDB Atlas or local database URL.
- \`JWT_SECRET\`: unique random secret; never commit it.
- \`CLIENT_URL\`: exact frontend origin (comma-separated origins are supported).
- \`ADMIN_EMAIL\` and \`ADMIN_PASSWORD\`: optional bootstrap administrator; password must be at least 12 characters. Existing accounts are never overwritten.
- \`UPLOAD_DIR\`: optional writable location for uploaded artwork.
- \`VITE_API_URL\`: frontend API base URL; use your Render API origin ending in \`/api\` for production.

## First administrator
Set \`ADMIN_EMAIL\` and \`ADMIN_PASSWORD\` in the backend environment before starting the API. Sign in with those credentials, then open **Admin dashboard** from the profile menu. No public admin-registration endpoint exists.

## Deploy
### Render API
Connect the repository to Render. Set **Root Directory** to \`backend\`, **Build Command** to \`npm install\`, and **Start Command** to \`npm start\`. Add \`MONGODB_URI\`, \`JWT_SECRET\`, \`CLIENT_URL\`, \`ADMIN_EMAIL\`, \`ADMIN_PASSWORD\` and \`NODE_ENV=production\`. The included \`render.yaml\` is a starter blueprint.

### Vercel frontend
Import the repository into Vercel and set **Root Directory** to \`frontend\`. Add \`VITE_API_URL\` with your public Render API URL ending in \`/api\`, then deploy. Client-side route fallback is configured in \`frontend/vercel.json\`.

### MongoDB Atlas
Create a database user with a strong password, restrict network access to the required deployment hosts, and set the connection string in Render's \`MONGODB_URI\`. Never put MongoDB credentials in Vite variables.

## API routes
- \`GET /api/health\`
- \`GET /api/movies\`, \`GET /api/movies/:slug\`
- \`POST /api/auth/register\`, \`POST /api/auth/login\`, \`POST /api/auth/logout\`, \`GET /api/auth/me\`
- \`GET /api/users/watchlist\`, \`POST /api/users/watchlist/:movieId\`, \`DELETE /api/users/watchlist/:movieId\`
- \`GET /api/admin/analytics\`, \`GET /api/admin/users\`, \`GET /api/admin/movies\`
- \`POST /api/admin/movies\`, \`PATCH /api/admin/movies/:id\`, \`DELETE /api/admin/movies/:id\`
- \`POST /api/admin/upload\`

## Media notes
A title is playable only when an administrator enables \`authorizedMedia\` and supplies a valid HTTP(S) \`streamUrl\`. The public catalogue omits private stream URLs for titles not marked as authorized. Use sources you control or are licensed to stream. HLS quality choices are shown when a manifest exposes multiple levels; subtitles use WebVTT tracks.

Artwork uploads use a local disk folder and a 5 MB image limit. Many managed hosts have ephemeral filesystems; configure persistent storage or replace the upload adapter with Cloudinary, S3 or another object-storage provider before relying on uploads in production. For production media libraries, consider signed CDN URLs, audit logs and a dedicated media pipeline. DRM is not included.

## Before public launch
- Rotate example secrets and use a restricted MongoDB account.
- Set exact HTTPS CORS origins and review cookie settings for your hostnames.
- Configure persistent object storage and backups.
- Add account verification, password reset, audit logging and monitoring if needed.
- Review privacy, cookie and media licensing obligations for your audience.

The repository retains its existing GNU GPL-3.0 license. Review included and dependency licenses before redistribution.
