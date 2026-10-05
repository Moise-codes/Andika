# ANDIKA - Architecture Summary (Phase 1)

**Quick Reference for Implementation**

---

## Tech Stack

**Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS, shadcn/ui, Phosphor Icons, Motion  
**Backend**: NestJS, TypeScript, Prisma ORM  
**Database**: Supabase PostgreSQL  
**Auth**: Supabase Auth  
**Real-time**: WebSockets (NestJS Gateway)  
**Deployment**: Vercel (frontend), AWS ECS/Fargate (backend)

---

## Core Database Schema (Prisma)

```prisma
// Main entities
Profile, Course, Module, Lesson, LessonExercise, LessonProgress
TypingSession, TypingResult, TypingError, KeyMetric, KeyTransitionMetric
PracticeSession, Achievement, UserAchievement, Streak
Competition, BattleRoom, CompetitionParticipant
TypingContent, ProgrammingContent
Settings, TypingSettings, Notification, AuditLog
```

---

## API Structure (Base: /api/v1)

**Auth**: POST /auth/signup, /auth/login, /auth/logout, /auth/refresh, /auth/forgot-password  
**Users**: GET /users/me, PATCH /users/me, DELETE /users/me  
**Courses**: GET /courses, GET /courses/:id, GET /courses/:id/modules  
**Lessons**: GET /lessons/:id, GET /lessons/:id/progress, POST /lessons/:id/progress  
**Typing**: POST /typing/sessions, GET /typing/sessions, POST /typing/sessions/:id/complete  
**Results**: GET /typing/results/:id, GET /typing/results/:id/analysis  
**Practice**: POST /practice/sessions, GET /practice/recommendations  
**Analytics**: GET /analytics/overview, /analytics/performance, /analytics/weak-keys  
**Achievements**: GET /achievements, GET /achievements/me  
**Leaderboard**: GET /leaderboards/global, /country, /weekly, /monthly, /all-time  
**Competition**: POST /competitions, GET /competitions, POST /competitions/:id/join  
**Profile**: GET /profiles/:username  
**Health**: GET /health, /health/live, /health/ready

---

## Backend Modules (NestJS Modular Monolith)

Auth, Users, Profiles, Courses, Lessons, Typing, Practice, Analytics, Achievements, Streaks, Leaderboard, Competition, Battle, Content, Notifications, Admin, Health

---

## Frontend Structure (Next.js App Router)

```
/app
  /(marketing)
    /page.tsx (landing)
  /(auth)
    /login/page.tsx
    /signup/page.tsx
  /(app)
    /dashboard/page.tsx
    /learn/page.tsx
    /practice/page.tsx
    /test/page.tsx
    /analytics/page.tsx
    /leaderboard/page.tsx
    /competition/page.tsx
    /programming/page.tsx
    /achievements/page.tsx
    /profile/[username]/page.tsx
    /settings/page.tsx
  /api (API routes if needed)
/components
  /ui (shadcn components)
  /domain (TypingEditor, TypingStats, etc.)
/lib (utilities, API clients)
```

---

## Brand Colors

**Forest**: #415239, #34442F, #29372A  
**Ivory**: #FAF8F5, #F4F0E7  
**Neutral**: #E8E5DD  
**Text**: #30302E, #696A64  
**Border**: #D9D7CF

---

## MVP Features Priority

1. Authentication (Supabase)
2. Typing Engine (client-side, no network per keystroke)
3. Basic Tests (time/word based)
4. Results & Basic Analysis
5. Learning System (courses/lessons)
6. Dashboard
7. Themes (Forest, Ivory, Midnight)
8. Keyboard Layouts (QWERTY, AZERTY, QWERTZ)
9. Basic Analytics

---

## Key Architecture Decisions

- **Typing Engine**: Client-side only, server validates results
- **WPM Calculation**: characters / 5 / minutes
- **Session Management**: Supabase handles auth, NestJS validates
- **RLS**: Row Level Security on all user data
- **WebSockets**: For competitions only, minimal data transfer
- **ORM**: Prisma (selected over Drizzle)
- **State**: React Context + Server Components where possible

---

## Environment Variables

**Frontend**:
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_API_URL

**Backend**:
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
DATABASE_URL
JWT_SECRET
PORT

---

## Next Steps

1. Initialize Next.js project
2. Setup shadcn/ui
3. Create brand assets
4. Build landing page
5. Build auth UI
6. Build typing engine
7. Initialize NestJS backend
8. Setup Prisma
9. Build core API endpoints
