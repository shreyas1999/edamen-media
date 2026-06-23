# Edamen Media — Product Requirements Document

## Original Problem Statement
Design and build the website for EDAMEN MEDIA — a premium, monochrome, internet-native media-company site inspired by Apple, Linear, Atomik Growth, modern VC sites, editorial magazine layouts and Swiss minimalism. The site must communicate the brand philosophy "Attention → Leverage" and embody the Edamen Leverage Framework™ (Content → Distribution → Trust → Opportunities → Partnerships → Leverage → Compounding → Attention).

## User Personas
1. **The Founder / Operator** — needs to build a category-defining voice; lands on Home or /brand-building; converts via Work With Us / Strategy Call.
2. **The Creator / Personality** — wants representation and partnership opportunities; lands on /creator-representation; converts via Apply for Representation.
3. **The Edamen Admin (Founder team)** — manages applications via /admin; needs status pipeline + notes + (optional) Google Sheet sync.

## Core Requirements (static)
- Monochrome aesthetic on #090909 / #181818 surfaces with sparing #2563EB / #F59E0B accents.
- SF Pro Display / Neue Montreal for display; Inter for body.
- Animated proprietary "Edamen Leverage Framework™" circular visual.
- 7 marketing pages + 1 application page + admin login + admin dashboard.
- Multi-step partnership application form persisted in MongoDB.
- JWT-authenticated admin dashboard with full pipeline management.
- Optional Google Sheets sync via service account (no-op when env vars unset).

## What's been implemented (as of 2026-02-23)
### Backend (`/app/backend`)
- FastAPI app with `/api` prefix.
- `auth.py` — bcrypt + PyJWT, `require_admin` dependency.
- `models.py` — Application (with social_profiles list), ContactMessage, AdminLogin, StatusUpdate.
- `sheets.py` — service-account Google Sheets append (silent no-op when env vars empty).
- `server.py` — admin seed on startup, full CRUD for applications, contact, stats, config, health.
- Endpoints: `/api/health`, `/api/config`, `/api/auth/login`, `/api/auth/me`, `/api/applications` (POST public; GET/PATCH/DELETE admin), `/api/applications/stats`, `/api/contact`.

### Frontend (`/app/frontend`)
- Routes: `/`, `/framework`, `/brand-building`, `/creator-representation`, `/work`, `/about`, `/contact`, `/apply`, `/admin/login`, `/admin`.
- Components: `Nav`, `Footer`, `LeverageFramework` (animated SVG + framer-motion rotation ring), `HeroBackdrop`, `Reveal`.
- Multi-step Apply form (6 steps): Basics → Social Profiles → Audience → Content → Business → Fit.
- Admin dashboard: stats grid, search, status filter pills, table view, detail drawer with status buttons + notes + delete.
- Theme: Tailwind tokens for dark monochrome, custom utilities (`hero-grad`, `surface`, `glass`, `grain`, `btn-primary`, `btn-ghost`, `marquee-track`).

### Tests (`/app/backend/tests/test_edamen_api.py`)
- 23 pytest tests covering auth, applications CRUD, stats, contact, unauthorized access — all passing.
- Playwright E2E coverage of public routes, contact, apply (all 6 steps), admin login+dashboard — all passing.

## Prioritized Backlog
### P0 (deferred, ready to enable)
- Connect Google Sheets sync — set `GOOGLE_SHEET_ID` and `GOOGLE_SERVICE_ACCOUNT_JSON` in `/app/backend/.env`, share the sheet (Editor) with the service-account email.
- Provide real Calendly URL (replace `CALENDLY_URL` in `/app/backend/.env`).

### P1
- Slack / Zapier notifications on new applications (per user, future via Zapier or Slack webhook).
- Real case-study pages under `/work/[slug]`.
- Object-storage upload for media kits / analytics (in case Drive links aren't acceptable).
- Email notifications for new applications (Resend / SendGrid).

### P2
- CMS-driven case studies and About content.
- Public press / journal page.
- SEO / OG image generation.
- Per-admin user management (multi-admin).

## Next Tasks
1. Hand off `ADMIN_EMAIL` / `ADMIN_PASSWORD` to the team and have them change the seed password on first login (currently fixed via .env — adding a "change password" endpoint is a future task).
2. Provide Google Service Account JSON + Sheet ID to enable live sheet sync.
3. Replace placeholder Calendly URL.
4. Replace placeholder case-study metrics on `/work` with real client data once available.
