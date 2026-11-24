# Sales Soccer: Product Microsite

**Dribble. Goal. Lead.**

This is a single-page promotional microsite for **Sales Soccer**, digiLATERAL's football-style sales tournament platform for pharma brand drives. The repository is split into two parts:

| Folder | Stack | Purpose |
| --- | --- | --- |
| `frontend/` | React 18, Vite, Tailwind CSS 3, Framer Motion, Lucide | The responsive microsite |
| `backend/` | Node.js 20+, Express 5, MongoDB, Mongoose | The "Request a Demo" lead-capture API |

> The marketing site only showcases Sales Soccer. It does not run any tournament or game functions, and it has no admin area. The Sales Soccer **HO Admin Portal** is a separate product.

---

## 1. Quick start (local)

### Prerequisites
- Node.js **20 or newer** (`node -v`)
- MongoDB, either a local instance (`mongodb://127.0.0.1:27017`) or a MongoDB Atlas cluster

### Backend
```bash
cd backend
cp .env.example .env        # then edit MONGODB_URI and CORS_ORIGINS
npm install
npm run dev                 # http://localhost:5000  (GET /api/health to check)
```

### Frontend
```bash
cd frontend
cp .env.example .env        # VITE_API_URL can stay empty for local dev
npm install
npm run dev                 # http://localhost:5173
```
During development, Vite proxies `/api/*` to `http://localhost:5000`, so the demo form works without any extra setup.

### Tests
```bash
cd backend && npm test      # validation, honeypot, CORS, rate limiting, error handling
```

---

## 2. Project structure

```
sales-soccer-microsite/
├── frontend/
│   ├── public/
│   │   ├── assets/
│   │   │   ├── screens/          ← ORIGINAL app screenshots (unaltered, see §4)
│   │   │   ├── brand/            ← Official Sales Soccer logo (+ a margin-trimmed copy)
│   │   │   └── visuals/          ← Stadium and turf backgrounds, player silhouette
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx, Hero.jsx, GameExperience.jsx, TournamentExperience.jsx
│   │   │   ├── AppShowcase.jsx, IPhoneMockup.jsx, LandscapeIPhoneMockup.jsx
│   │   │   ├── HODashboard.jsx, Benefits.jsx, DemoForm.jsx
│   │   │   ├── Artwork.jsx (SVG trophy, football, kickoff scene)
│   │   │   ├── Modal.jsx, Footer.jsx, Logo.jsx
│   │   ├── data/content.js       ← All copy, screen list, benefits, legal links
│   │   ├── lib/                  ← Client-side validation, icon map
│   │   ├── App.jsx, main.jsx, index.css
│   ├── tailwind.config.js, vite.config.js, .env.example
└── backend/
    ├── src/
    │   ├── app.js                ← Express app (helmet, CORS, rate limit, routes)
    │   ├── server.js             ← Boots DB connection and HTTP server
    │   ├── config/ (env.js, db.js)
    │   ├── models/Lead.js
    │   ├── routes/leads.js
    │   ├── validators/lead.js
    │   └── middleware/errors.js
    ├── test/leads.test.js
    └── .env.example
```

---

## 3. Website sections

0. **Launch intro** (`IntroSplash.jsx`): on page load the Sales Soccer logo fills a white screen, then glides into the header as the screen collapses into the top bar (about 2.5 s; click or press any key to skip; skipped for reduced-motion users)
1. **Hero**: logo on a white header bar, tagline, headline, Request a Demo and Explore the App CTAs, and an angled iPhone showing `Home.png`
2. **The Game Experience**: Dribbles and Goals, plus an animated pitch where our player (red) dribbles from Defense → Midfield → Attack, dodges two defenders (purple-blue) and scores. Player poses are in `assets/visuals/players/`: cut out from the Sales Soccer artwork, with the opponents recoloured
3. **The Tournament Experience**: an illustrative League → Quarterfinals → Semifinals → Finals bracket ending in an original SVG trophy (stacked vertically on mobile)
4. **Explore the App**: an interactive showcase of all seven real screenshots. It supports tabs, arrows, dots, keyboard arrows and swipe, and shows the Playground in a landscape device
5. **Command Centre (HO Portal)**: a *conceptual* laptop dashboard, clearly labelled as illustrative, with no figures
6. **Built for Pharma Brand Managers**: five benefit cards
7. **Request a Demo**: a validated form posting to `POST /api/leads`, with success and error states, beside an original kickoff illustration
8. **Footer**: logo, tagline, digiLATERAL credit, ©, Privacy Policy and Contact / demo CTA

Accessibility and UX details:
- Respects `prefers-reduced-motion`
- Includes a skip link, focus styles, and accessible tabs and dialogs (Esc, focus trap, focus return)
- Shows a sticky "Request a Demo" bar on mobile, which hides when the form is on screen

---

## 4. Asset rules (important)

- `frontend/public/assets/screens/` holds the **original PNG screenshots, byte-for-byte unchanged**:
  `Home.png`, `Upload.png`, `Approval Status.png`, `Leaderboard.png`, `Compare Player.png`, `Notification.png`, `Play Ground.png`.
  They are displayed with `<img>` at their native aspect ratio (1206×2622 and 2622×1206). Nothing is redrawn and nothing is overlaid on their content. The iPhone frame adds a Dynamic Island in the empty centre of each screenshot's own status bar, plus a faint glass sheen.
- **Do not** replace, re-export or edit these files. If you optimise images for production, exclude this folder or use a strictly lossless optimiser.
- `assets/brand/sales-soccer-logo.png` is the official logo. `sales-soccer-logo-trimmed.png` is the same file with only its transparent margin cropped. The header is a white bar so the purple logo sits on white; in the footer the logo is shown on a white badge.
- `assets/visuals/` holds the stadium and turf backgrounds (cropped from text-free areas of digiLATERAL's own Sales Soccer artwork) and a white player silhouette. The trophy, football and kickoff scene are original SVG artwork in `Artwork.jsx`.
- The app demo video is intentionally not used on the site.
- The product presentation PDF is **not** included in the site or in this repository.
- No scoring rules, conversion logic or weightages appear anywhere in the code, copy, comments or data.

---

## 5. API

### `POST /api/leads`
Request body (JSON):
```json
{
  "name": "Full name",
  "company": "Company",
  "designation": "Designation",
  "email": "name@company.com",
  "mobile": "+91 ...",
  "message": "optional, up to 1000 chars"
}
```
| Status | Meaning |
| --- | --- |
| `201` | `{ success: true, message, id }`: lead stored |
| `400` | `{ success: false, message, errors: { field: "..." } }`: validation failed |
| `403` | Origin not allowed (CORS) |
| `429` | Rate limit exceeded (default: 5 requests per 15 minutes per IP) |
| `503` | Database not connected |

Stored document (`leads` collection): `name, company, designation, workEmail, mobileNumber, message, submittedAt, source, status, createdAt, updatedAt`.

To view the leads, use MongoDB Compass or Atlas, or run `mongosh` → `use sales_soccer_microsite` → `db.leads.find().sort({submittedAt:-1})`.

### `GET /api/health`
Returns `{ status: "ok", database: "connected" | "disconnected" }`.

Security measures:
- `helmet` security headers, with a strict CSP when serving the frontend
- CORS allow-list from `CORS_ORIGINS`, with same-origin requests always allowed
- 10 kb JSON limit
- Per-IP rate limit
- Server-side validation and sanitisation
- A honeypot field to catch spam bots
- No stack traces in responses
- Secrets only in `.env`, never in the frontend

---

## 6. Deployment

### Option A: single service (simplest)
Express serves the built site and the API from one origin.
```bash
cd frontend && npm ci && npm run build
cd ../backend && npm ci --omit=dev
# .env: NODE_ENV=production, MONGODB_URI=..., SERVE_FRONTEND=true, TRUST_PROXY=1, CORS_ORIGINS=https://your-domain
npm start
```
Run the server behind Nginx or a platform load balancer with HTTPS, and keep it alive with PM2 (`pm2 start src/server.js --name sales-soccer-api`) or a systemd service.

Sample Nginx block:
```nginx
server {
  server_name salessoccer.example.com;
  location / { proxy_pass http://127.0.0.1:5000; proxy_set_header Host $host;
               proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
               proxy_set_header X-Forwarded-Proto $scheme; }
  client_max_body_size 1m;
}
```

### Option B: static frontend + separate API
- **Frontend:** build with `VITE_API_URL=https://api.your-domain.com npm run build` and deploy `frontend/dist/` to Netlify, Vercel, S3 + CloudFront, or any static host.
- **Backend:** deploy `backend/` to Render, Railway, a VM or a container. Set `CORS_ORIGINS=https://your-site-domain` and `TRUST_PROXY=1`.

### Production checklist
- [ ] `MONGODB_URI` points to a secured database (Atlas IP allow-list / authentication)
- [ ] `CORS_ORIGINS` contains only your real domain(s)
- [ ] HTTPS is enabled
- [ ] `LEGAL_LINKS.privacyPolicy` is set in `frontend/src/data/content.js` (it shows a placeholder dialog until then)
- [ ] Sales contact details are added if desired (none were invented)

---

## 7. Editing content

All copy lives in `frontend/src/data/content.js`, including screen titles and descriptions, benefits, HO capabilities, the illustrative bracket team names, ticker items and legal links. Colours and fonts are defined in `tailwind.config.js`. The fonts are self-hosted via Fontsource, so there are no third-party font requests.

© digiLATERAL. Sales Soccer is a product of digiLATERAL.
