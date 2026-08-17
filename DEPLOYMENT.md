# Deploying to Render

This repo has two deployable pieces: the NestJS **backend** (Render Web Service)
and the Vite/React **frontend** (Render Static Site). MongoDB is not hosted by
Render — use a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
cluster.

## 1. MongoDB Atlas

1. Create a free cluster.
2. Database Access → add a user with a password.
3. Network Access → allow `0.0.0.0/0` (or Render's outbound IPs once you have them).
4. Get the connection string, e.g.
   `mongodb+srv://user:password@cluster0.xxxxx.mongodb.net/madamsaab`

## 2. Backend — Render Web Service

- **Root directory:** `backend`
- **Build command:** `npm install --include=dev && npm run build`
  (`--include=dev` is required — with `NODE_ENV=production` set, plain
  `npm install` skips devDependencies, which breaks `nest build` since
  `@nestjs/cli` lives there.)
- **Start command:** `npm run start:prod`
- **Environment variables:**

  | Key | Value |
  |---|---|
  | `NODE_ENV` | `production` |
  | `MONGODB_URI` | your Atlas connection string |
  | `JWT_ACCESS_SECRET` | random string (Render can auto-generate) |
  | `JWT_REFRESH_SECRET` | random string (Render can auto-generate) |
  | `WHATSAPP_NUMBER` | your business WhatsApp number, digits only with country code |
  | `FRONTEND_URL` | your frontend's Render URL once deployed, e.g. `https://madamsaab.onrender.com` (comma-separate multiple origins if needed) |
  | `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | leave as placeholders for now — image uploads will return a clear error until you set real values, nothing else breaks |

  Render sets `PORT` automatically; the app already reads `process.env.PORT`.

- After the first deploy, open the Render **Shell** for this service and run:
  ```bash
  npm run seed
  ```
  This seeds services, packages, settings, CMS content, and the admin user
  (`admin@madamsaab.com` / `Admin@123` — **change this password after first login**).

## 3. Frontend — Render Static Site

- **Root directory:** `frontend`
- **Build command:** `npm install --include=dev && npm run build`
  (same devDependencies reasoning — `tsc` and `vite` are dev deps)
- **Publish directory:** `dist`
- **Environment variables:**

  | Key | Value |
  |---|---|
  | `VITE_API_URL` | your backend's Render URL + `/api/v1`, e.g. `https://madamsaab-api.onrender.com/api/v1` |

- **Rewrite rule** (required for client-side routing): add a rewrite
  `/*` → `/index.html`, otherwise refreshing on any route other than `/`
  will 404.

## 4. Wire the two together

1. Deploy the backend first, copy its `https://*.onrender.com` URL.
2. Set that as `VITE_API_URL` (with `/api/v1` appended) on the frontend service and deploy it.
3. Copy the frontend's URL, set it as `FRONTEND_URL` on the backend service, and redeploy the backend so CORS allows it.

## Notes

- Render's free tier spins services down after inactivity — the first request after idle will be slow (cold start), including the backend waking up MongoDB Atlas's connection.
- Cloudinary is intentionally left unconfigured — the upload endpoint already fails gracefully with a clear message ("Cloudinary is not configured") rather than crashing. Add real credentials to the backend env vars whenever you're ready; no code changes needed.
- If you later add a custom domain, add it to `FRONTEND_URL` (comma-separated) so CORS keeps working.
