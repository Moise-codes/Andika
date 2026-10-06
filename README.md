# ANDIKA — Learn. Practice. Master Typing.

A modern typing-learning and typing-performance platform with a Next.js frontend
and a NestJS API. Authentication (email/password **and** Google) and the database
are provided by a **single Supabase project**.

## Tech Stack

### Frontend
- **Framework:** Next.js 16 (App Router, Turbopack)
- **Language:** TypeScript
- **Styling:** Tailwind CSS, shadcn/ui-style components
- **Icons:** Lucide / Phosphor
- **Charts:** Recharts
- **Auth:** Supabase Auth via `@supabase/ssr` (cookie-based sessions)

### Backend
- **Framework:** NestJS 10
- **Language:** TypeScript
- **ORM:** Prisma
- **Database:** Supabase Postgres (single source of truth)
- **Auth:** Supabase-issued access tokens, validated per request
- **API:** REST + Swagger, Socket.IO for competitions

## Architecture

One Supabase project serves as both the database and the identity provider:

```
Browser ──(Supabase JS / cookies)──► Supabase Auth ──► Postgres (same project)
   │                                                      ▲
   └──(Bearer access token)──► NestJS API ──(Prisma)──────┘
```

- The browser signs users in with Supabase and stores the session in cookies.
- Every API call sends the Supabase access token; the NestJS guard verifies it
  and attaches the user to the request.
- The backend owns application data (profiles, sessions, analytics) via Prisma.

See [`docs/AUTH-SETUP.md`](docs/AUTH-SETUP.md) for the full auth/DB setup and the
signup-OTP, Google, and account-linking flows.

## Getting Started

### Prerequisites
- Node.js 18+
- A Supabase project (free tier is fine)

### Step 1 — Environment variables

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

Fill in your Supabase connection strings and API keys (see
[`docs/AUTH-SETUP.md`](docs/AUTH-SETUP.md)). Enable Google in the Supabase
dashboard and — for production — configure SMTP there too.

### Step 2 — Backend

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate deploy      # or: npx prisma migrate dev
npm run start:dev              # http://localhost:3001  (docs at /api/docs)
```

### Step 3 — Frontend

```bash
cd frontend
npm install
npm run dev                    # http://localhost:3000
```

### Docker

With `backend/.env` and `frontend/.env.local` in place:

```bash
docker compose up --build
```

The database stays on Supabase, so there is no local Postgres container.

## Features

- Multiple typing modes (time, words, quotes, programming)
- Real-time WPM / accuracy / consistency analytics and weak-key analysis
- Structured courses & lessons with progress tracking
- Achievements, streaks, and global leaderboards
- Real-time competitions over WebSockets
- Account management: email/password, Google, password reset, profile & settings

## API Endpoints

Base URL: `http://localhost:3001/api/v1`

### Health
- `GET /health`, `GET /health/live`, `GET /health/ready`

### Auth
- `GET  /auth/me` — current profile (creates it on first call) · Bearer
- `POST /auth/sync` — bootstrap profile after sign-in · Bearer
- `GET  /auth/email-status?email=` — provider lookup for signup guidance · public
- `POST /auth/password` — set/change password · Bearer

### Users
- `GET  /users/me`, `PATCH /users/me`
- `GET  /users/me/settings`, `PATCH /users/me/settings`

### Typing / Analytics / Learning / Social
- `POST /typing/sessions`, `GET /typing/sessions`, `GET /typing/sessions/recent`, `GET /typing/results/:id`
- `GET  /analytics/overview`, `GET /analytics/performance`, `GET /analytics/weak-keys`
- `/courses`, `/lessons`, `/practice`, `/content`
- `/achievements`, `/streaks`, `/leaderboards`
- WebSocket: competitions

All routes except health and `auth/email-status` require
`Authorization: Bearer <supabase-access-token>`.

## Database Schema

Main entities (see `backend/prisma/schema.prisma`): `Profile`, `TypingSettings`,
`Streak`, `TypingSession`/`TypingError`/`KeyMetric`, `PracticeSession`,
`Course`/`Module`/`Lesson`/`LessonProgress`, `Achievement`/`UserAchievement`,
`Competition`/`CompetitionParticipant`, `TypingContent`, `ProgrammingContent`,
`Notification`, `AuditLog`.

## Development

```bash
# Backend
cd backend && npm run lint && npm run test && npm run build

# Frontend
cd frontend && npm run lint && npm run build
```

## License

Proprietary — All rights reserved.
