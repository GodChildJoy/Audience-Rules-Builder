# Deploy: Vercel (frontend) + Railway (API)

The Angular UI talks to a separate REST API (`/rules`, `/evaluate`). Run the **browser** build on **Vercel** and the **Node API** in `api/` on **Railway**.

## 1. Railway — Audience Rules API

1. Create a [Railway](https://railway.app) project and **Deploy from GitHub** (this repo).
2. Add a **new service** → **Empty service** → set **Root Directory** to `api`.
3. Railway detects `api/package.json` and runs `npm install` + `npm start` (`node server.mjs`).
4. In the service **Variables** tab, set:
   - `CORS_ORIGIN` — your Vercel production URL, e.g. `https://your-app.vercel.app`  
     (comma-separate multiple origins if you use preview URLs too.)
5. Open **Settings → Networking → Generate Domain** and copy the public URL (e.g. `https://audience-rules-api-production.up.railway.app`).  
   No trailing slash.

The API exposes:

- `GET /rules` — list saved rules  
- `POST /rules` — create rule  
- `DELETE /rules/:id` — delete  
- `POST /evaluate` — demo sample matches (swap for real logic as needed)  
- `GET /health` — health check  

Data is **in-memory**; redeploys clear it. Persist to a database when you outgrow the demo.

## 2. Vercel — Angular app (static SPA)

1. Import the repo in [Vercel](https://vercel.com).
2. Leave **Root Directory** as the repository root (not `api`).
3. Vercel reads `vercel.json`: install with `npm ci`, build with `npm run build:vercel`, output `dist/Audience-Rules-Builder/browser`.
4. In **Project → Settings → Environment Variables**, add:
   - **`AUDIENCE_RULES_API_URL`** — the Railway public API origin only, e.g. `https://audience-rules-api-production.up.railway.app`  
     Apply to **Production** (and **Preview** if previews should hit a shared API; you can use a second Railway env later).

The build script `scripts/vercel-build.mjs` passes that value into Angular’s `--define` so `HttpClient` calls the correct host.

5. Redeploy after changing `AUDIENCE_RULES_API_URL` (the URL is baked in at build time).

### SPA routing

`vercel.json` rewrites extension-less paths to `index.html` so the Angular router (including `/404` style paths) works. Static assets under `/` are still served as files.

## 3. Local development

- UI: `npm start` → [http://localhost:4200](http://localhost:4200)
- API: `cd api && npm install && npm start` → [http://localhost:3000](http://localhost:3000)

With an empty build define, the app defaults to `http://localhost:3000` for the API.

To test a production build locally against a specific API:

```bash
AUDIENCE_RULES_API_URL=https://your-api.up.railway.app npm run build:vercel
npx http-server dist/Audience-Rules-Builder/browser -p 8080
```

## 4. CORS checklist

If the browser shows CORS errors:

- Railway **`CORS_ORIGIN`** must include the exact Vercel origin (`https://…`), scheme + host, no path.
- After changing Railway env vars, redeploy or restart the service.

## 5. Optional: SSR on Vercel

This repo builds the **browser** bundle for Vercel. The Express SSR entry in `src/server.ts` is not used by the provided `vercel.json`. To run full SSR on Vercel you would need a different adapter/output; the static SPA + Railway API is the supported path here.
