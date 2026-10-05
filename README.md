# ANDIKA - Learn. Practice. Master Typing.

A modern typing-learning and typing-performance platform built with Next.js, NestJS, and Supabase.

## Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Auth**: Supabase Auth

### Backend
- **Framework**: NestJS
- **Language**: TypeScript
- **ORM**: Prisma
- **Database**: Supabase PostgreSQL
- **Auth**: Supabase Auth + JWT
- **API**: REST
- **Real-time**: WebSockets (Socket.IO)

## Project Structure

```
Andika/
├── frontend/                 # Next.js frontend application
│   ├── src/
│   │   ├── app/             # App Router pages
│   │   │   ├── (marketing)/ # Landing page
│   │   │   ├── (auth)/      # Login/Signup
│   │   │   └── (app)/       # Application pages
│   │   ├── components/
│   │   │   ├── ui/          # shadcn/ui components
│   │   │   └── domain/      # Domain-specific components
│   │   └── lib/             # Utilities
│   └── package.json
├── backend/                  # NestJS backend application
│   ├── src/
│   │   ├── modules/         # Feature modules
│   │   │   ├── auth/
│   │   │   ├── users/
│   │   │   ├── typing/
│   │   │   └── analytics/
│   │   ├── common/          # Shared utilities
│   │   │   ├── guards/
│   │   │   ├── decorators/
│   │   │   └── prisma/
│   │   ├── main.ts
│   │   └── app.module.ts
│   ├── prisma/
│   │   └── schema.prisma    # Database schema
│   └── package.json
└── docs/                     # Documentation
    └── ARCHITECTURE-SUMMARY.md
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your Supabase credentials:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/andika"
SUPABASE_URL="your-supabase-project-url"
SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"
JWT_SECRET="your-jwt-secret-key"
PORT=3001
FRONTEND_URL="http://localhost:3000"
```

4. Configure Google OAuth in Supabase:
   - Go to your Supabase project dashboard
   - Navigate to Authentication > Providers > Google
   - Enable Google provider
   - Add your Google OAuth client ID and secret
   - Set redirect URL: `http://localhost:3000/auth/callback` (development)
   - Set redirect URL: `https://yourdomain.com/auth/callback` (production)

5. Generate Prisma client:
```bash
npx prisma generate
```

6. Run database migrations:
```bash
npx prisma migrate dev
```

7. Start the backend server:
```bash
npm run start:dev
```

The backend will run on `http://localhost:3001`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create `.env.local` (this file is gitignored):
```env
NEXT_PUBLIC_SUPABASE_URL="your-supabase-project-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
NEXT_PUBLIC_API_URL="http://localhost:3001"
```

4. Start the frontend development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

6. Start the backend server:
```bash
npm run start:dev
```

The backend will run on `http://localhost:3001`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create `.env.local` (this file is gitignored):
```env
NEXT_PUBLIC_SUPABASE_URL="your-supabase-project-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
NEXT_PUBLIC_API_URL="http://localhost:3001"
```

4. Start the frontend development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## Features Implemented

### Phase 1: Documentation ✅
- Product Requirements Document
- Functional Requirements Document
- Non-functional Requirements Document
- User Personas
- User Journeys
- Architecture Summary

### Phase 2A: Frontend (In Progress)
- ✅ Next.js project setup
- ✅ Brand colors and design system
- ✅ Landing page
- ✅ Authentication UI (login/signup)
- ✅ Application navigation
- ✅ Dashboard
- ✅ Typing engine component
- ✅ Typing test UI
- ✅ Results analysis
- ✅ Analytics dashboard
- ✅ Learning UI (courses)
- ✅ Practice UI
- ✅ Programming typing UI

### Phase 2B: Backend (In Progress)
- ✅ NestJS project setup
- ✅ Prisma schema
- ✅ Auth module (Supabase integration)
- ✅ Users module
- ✅ Typing module with validation
- ✅ Analytics module
- ✅ Health check endpoint

## API Endpoints

### Health
- `GET /api/v1/health` - Health check
- `GET /api/v1/health/live` - Liveness probe
- `GET /api/v1/health/ready` - Readiness probe

### Auth
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/refresh` - Refresh token
- `GET /api/v1/auth/me` - Get current user
- `POST /api/v1/auth/logout` - Logout

### Users
- `GET /api/v1/users/me` - Get profile
- `PATCH /api/v1/users/me` - Update profile

### Typing
- `POST /api/v1/typing/sessions` - Create typing session
- `GET /api/v1/typing/sessions` - Get sessions
- `POST /api/v1/typing/sessions/:id/complete` - Complete session
- `GET /api/v1/typing/results/:id` - Get result
- `GET /api/v1/typing/results/:id/analysis` - Get result analysis

### Analytics
- `GET /api/v1/analytics/overview` - Get overview stats
- `GET /api/v1/analytics/performance` - Get performance data
- `GET /api/v1/analytics/weak-keys` - Get weak keys analysis

## Database Schema

The database includes the following main entities:
- Profile (user profiles)
- Course, Module, Lesson (learning content)
- TypingSession, TypingError, KeyMetric (typing data)
- PracticeSession (practice data)
- Achievement, UserAchievement (achievements)
- Streak (streak tracking)
- Competition, CompetitionParticipant (competitions)
- TypingContent, ProgrammingContent (content library)
- TypingSettings (user preferences)

See `backend/prisma/schema.prisma` for the full schema.

## Development

### Running Tests

Backend:
```bash
cd backend
npm run test
```

### Building for Production

Frontend:
```bash
cd frontend
npm run build
npm run start
```

Backend:
```bash
cd backend
npm run build
npm run start:prod
```

## Architecture Decisions

- **Typing Engine**: Client-side only for real-time performance, server validates results
- **WPM Calculation**: characters / 5 / minutes
- **Session Management**: Supabase handles auth, NestJS validates with JWT
- **RLS**: Row Level Security on all user data (to be implemented)
- **WebSockets**: For competitions only (to be implemented)
- **ORM**: Prisma selected over Drizzle

## Future Work

### Frontend
- Theme system (Ivory, Midnight themes)
- Keyboard layout support (AZERTY, QWERTZ, Dvorak, Colemak)
- Achievements and streaks UI
- Leaderboards UI
- Competition UI with WebSockets
- Profile page
- Settings page
- Accessibility features

### Backend
- Row Level Security policies
- Courses and Lessons modules
- Practice module
- Achievements module
- Streaks module
- Leaderboard module
- Competition WebSocket module
- Content module
- Security (rate limiting, validation)
- Docker configuration

## License

Proprietary - All rights reserved

## Support

For questions or issues, please refer to the documentation in the `docs/` directory.
# Andika
