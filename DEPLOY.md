# Deployment Guide

This app deploys as **two services + a database**, all on free tiers:

- **Database** — MongoDB Atlas (free M0 cluster)
- **Backend API** — Render (free web service) — serves `/api/*`
- **Frontend** — Vercel (static Vite build)

The code is already environment-driven: the API URL, CORS origin, DB URI, port,
and JWT secret are all read from env vars, so deploying is configuration, not code
changes. Deploy in the order below — the backend must exist before the frontend
(the frontend needs the API URL), and the backend's `CLIENT_URL` is updated last.

> Steps that create accounts, sign in, grant GitHub access, or enter secrets must
> be done by you — Claude cannot create accounts or type your credentials.

---

## 0. Prerequisite — push a clean repo to GitHub

Render and Vercel deploy *from the GitHub repo*, so the reconciled, clean `main`
must be pushed first (handled separately before deployment).

---

## 1. MongoDB Atlas (database)

1. Create a free account at <https://www.mongodb.com/cloud/atlas> and create a
   **free M0 cluster**.
2. **Database Access** → add a database user (username + password). Save these.
3. **Network Access** → **Add IP Address** → **Allow access from anywhere**
   (`0.0.0.0/0`). Render's free tier uses dynamic IPs, so a fixed allowlist won't work.
4. **Connect** → **Drivers** → copy the connection string. It looks like:
   ```
   mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/ecommerce?retryWrites=true&w=majority
   ```
   Replace `<user>`/`<password>` with the DB user from step 2, and make sure the
   database name (`/ecommerce`) is present before the `?`.
   **This string contains a password — keep it to yourself; paste it only into
   host dashboards, never share it in chat.**

---

## 2. Seed the Atlas catalog (one time)

From your machine, point the seed script at Atlas and run it once:

```bash
cd server
MONGODB_URI="<your-atlas-connection-string>" npm run seed
```

You should see the product catalog inserted. (This does not need Render — it runs
locally against Atlas.)

---

## 3. Render (backend API)

1. Create an account at <https://render.com> and connect your GitHub.
2. **New** → **Web Service** → pick the `CodeAlpha_ECommerceStore` repo.
3. Settings:
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** Free
4. **Environment variables** (Add each):
   | Key | Value |
   |-----|-------|
   | `MONGODB_URI` | your Atlas connection string |
   | `JWT_SECRET` | the 96-char secret Claude generated for you |
   | `JWT_EXPIRES_IN` | `7d` |
   | `NODE_ENV` | `production` |
   | `CLIENT_URL` | `http://localhost:5173` *(placeholder — updated in step 5)* |
5. Deploy. When it's live, copy the service URL, e.g.
   `https://codealpha-ecommerce-server.onrender.com`.
   Verify: opening `<API-URL>/api/health` returns `{"success":true,"status":"ok"}`.
   > First request after ~15 min idle cold-starts (~50s). That's normal on free tier.

---

## 4. Vercel (frontend)

1. Create an account at <https://vercel.com> and connect your GitHub.
2. **Add New** → **Project** → import the same repo.
3. Settings:
   - **Root Directory:** `client`
   - **Framework Preset:** Vite (auto-detected)
   - **Build Command:** `npm run build` · **Output Directory:** `dist` (defaults)
4. **Environment variable:**
   | Key | Value |
   |-----|-------|
   | `VITE_API_URL` | `<your-Render-API-URL>/api` |

   (e.g. `https://codealpha-ecommerce-server.onrender.com/api`) — note the trailing
   `/api`. Vite bakes this in at **build time**, so it must be set before/at deploy.
5. Deploy. Copy the site URL, e.g. `https://codealpha-ecommerce-store.vercel.app`.
   `vercel.json` already handles SPA deep-link rewrites (no 404 on refresh).

---

## 5. Wire CORS back to the frontend

1. In **Render → your service → Environment**, change `CLIENT_URL` to the Vercel
   site URL (e.g. `https://codealpha-ecommerce-store.vercel.app`, no trailing slash).
2. Save — Render redeploys automatically. This lets the browser call the API
   without CORS errors.

---

## 6. Verify the live golden path

On the Vercel URL: register → browse/search catalog → open a product → add to cart
→ checkout (creates an order, decrements stock) → view order history → refresh a
deep link (e.g. `/orders`) to confirm the SPA rewrite works.

---

## Environment variable reference

**Backend (Render):** `MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN=7d`,
`NODE_ENV=production`, `CLIENT_URL=<Vercel URL>`, (`PORT` is injected by Render).

**Frontend (Vercel):** `VITE_API_URL=<Render URL>/api`.
