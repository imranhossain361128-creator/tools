# Deploying ToolsBattle (GitHub + Vercel)

This project has **three separate apps** that each deploy differently:

| App | What it is | Best host | Why |
|---|---|---|---|
| `backend/` | Express + MongoDB API | **Render** (or Railway) | Vercel runs code as short-lived serverless functions — a persistent Express server with a live MongoDB connection doesn't fit that model well without extra rework. Render/Railway run it exactly as written. |
| `admin-dashboard/` | React (Vite) | **Vercel** | Static build, deploys perfectly on Vercel. |
| `public-site/` | React (Vite) | **Vercel** | Static build, deploys perfectly on Vercel. |

So: **backend on Render, both frontends on Vercel.** All three talk to each other over plain HTTPS URLs — nothing needs to be in the same repo or host.

If you'd strongly prefer everything on Vercel, there's a note on serverless backend at the bottom — but Render is the simpler, more reliable path for this project as built.

---

## Step 1 — Push the code to GitHub

```bash
cd toolsbattle
git init
git add .
git commit -m "Initial commit"
```

Create a new **empty** repo on GitHub (no README/license, so there's nothing to conflict with), then:

```bash
git remote add origin https://github.com/<your-username>/toolsbattle.git
git branch -M main
git push -u origin main
```

This pushes all three folders (`backend/`, `admin-dashboard/`, `public-site/`) in one repo — that's fine, each host will be told which subfolder to build from.

---

## Step 2 — Create your MongoDB database (Atlas)

1. Go to [mongodb.com/cloud/atlas/register](https://www.mongodb.com/cloud/atlas/register) and create a free account.
2. Create a **free M0 cluster**.
3. Under **Database Access**, add a database user (username + password — save these).
4. Under **Network Access**, add IP address `0.0.0.0/0` (allow from anywhere) — simplest for now; you can restrict it later.
5. Click **Connect → Drivers**, copy the connection string. It looks like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/toolsbattle
   ```
   Replace `<username>`/`<password>` with what you created, and make sure `/toolsbattle` (the database name) is on the end.

Keep this string — you'll paste it into Render in the next step.

---

## Step 3 — Deploy the backend on Render

1. Go to [render.com](https://render.com) and sign up (you can sign in with GitHub).
2. Click **New → Web Service**, connect your GitHub repo.
3. Configure:
   - **Root Directory**: `backend`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance type**: Free is fine to start
4. Under **Environment Variables**, add:
   | Key | Value |
   |---|---|
   | `MONGO_URI` | your Atlas connection string from Step 2 |
   | `JWT_SECRET` | any long random string (e.g. generate one at [1password.com/password-generator](https://1password.com/password-generator/)) |
   | `PORT` | `5000` (Render sets its own `PORT` automatically too — the app already reads `process.env.PORT`, so this is a safe fallback) |
5. Click **Create Web Service**. Render will build and deploy — takes a couple of minutes.
6. Once live, you'll get a URL like `https://toolsbattle-backend.onrender.com`. Test it:
   ```
   https://toolsbattle-backend.onrender.com/api/health
   ```
   should return `{"status":"ok", ...}`.

**Seed the database** (creates the admin login + sample content) — from your own computer, with the deployed `MONGO_URI` in a local `.env`:
```bash
cd backend
echo "MONGO_URI=<your Atlas connection string>" > .env
npm install
npm run seed
```

> Free Render web services "spin down" after inactivity and take ~30–60 seconds to wake up on the next request. Fine for testing; upgrade to a paid instance before real traffic.

---

## Step 4 — Deploy the admin dashboard on Vercel

1. Go to [vercel.com](https://vercel.com), sign in with GitHub.
2. Click **Add New → Project**, import your `toolsbattle` repo.
3. Configure:
   - **Root Directory**: `admin-dashboard`
   - **Framework Preset**: Vite (auto-detected)
4. Under **Environment Variables**, add:
   | Key | Value |
   |---|---|
   | `VITE_API_URL` | `https://toolsbattle-backend.onrender.com/api` (your Render URL + `/api`) |
5. Click **Deploy**. You'll get a URL like `https://toolsbattle-admin.vercel.app`.
6. Log in with the seeded account (`admin@toolsbattle.com` / `ChangeMe123!`) — **change this password immediately** by creating a new admin user and removing the old one, since there's no in-app password-change screen yet.

---

## Step 5 — Deploy the public site on Vercel

Same as Step 4, but:
- **Root Directory**: `public-site`
- Same `VITE_API_URL` env variable, pointing at the same Render backend

You'll get a URL like `https://toolsbattle.vercel.app`.

---

## Step 6 — Connect your real domain (toolsbattle.com)

In Vercel, open the `public-site` project → **Settings → Domains** → add `toolsbattle.com` (and `www.toolsbattle.com`). Vercel will show you the DNS records to add at your domain registrar (usually an `A` record or `CNAME`). Once DNS propagates (a few minutes to a few hours), your real domain serves the new site.

Keep the admin dashboard on its own subdomain, e.g. `admin.toolsbattle.com`, so it's never confused with the public site — add that domain the same way under the `admin-dashboard` Vercel project.

---

## Step 7 — Lock things down before going live

- **Change the seeded admin password** (see Step 4).
- **Restrict CORS**: right now the backend accepts requests from any origin (`app.use(cors())` in `backend/server.js`). Once you know your final domains, tighten it:
  ```js
  app.use(cors({ origin: ['https://toolsbattle.com', 'https://admin.toolsbattle.com'] }));
  ```
- **Restrict MongoDB Atlas network access** from `0.0.0.0/0` to Render's outbound IPs if you want to be stricter (optional — Render's IPs can change on the free tier, so this is a paid-tier refinement).
- Double-check `JWT_SECRET` is a long random value, not the placeholder.

---

## Note: running the backend on Vercel instead of Render

Vercel *can* run Node APIs, but as serverless functions — each request spins up fresh, so a persistent Mongoose connection needs to be cached across invocations, and the whole app needs restructuring into `/api/*.js` serverless function files rather than one long-running `server.js`. It's doable but is a real rewrite of `backend/`, not just a config change. Render (or Railway, Fly.io) runs the Express app exactly as it's already written — that's why it's the recommended path here. If you'd like, I can do the serverless rewrite for Vercel-only hosting as a separate step.
