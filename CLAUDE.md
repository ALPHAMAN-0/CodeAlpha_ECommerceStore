# CodeAlpha_ECommerceStore

## Commands (client/, from client/package.json)
- Dev: `npm run dev` (vite)
- Build: `npm run build` (vite build)
- Lint: `npm run lint` (oxlint)
- Preview: `npm run preview` (vite preview)

## Commands (server/, from server/package.json)
- Start: `npm start` (node server.js)
- Dev: `npm run dev` (nodemon server.js)
- Seed DB: `npm run seed` (node seed.js)
- No test script defined in either package.json.

## Rules (observed)
- Both packages are `"type": "module"` — use ES `import`/`export`, not CommonJS `require`.
- In server/server.js, `import 'dotenv/config'` must stay the first import — a code comment states this is required so `process.env` is populated before server/app.js reads env vars at module-evaluation time.

## Read first
- README.md
- server/app.js
- client/src/App.jsx

Architecture: see ARCHITECTURE.md — read before structural changes
