# ANDIKA Authentication & Database Setup

ANDIKA uses **one Supabase project** for everything: the Postgres database
(accessed through Prisma) and authentication (email/password **and** Google).
This removes the previous split between a local Postgres container and Supabase.

```
Browser ──(Supabase JS / cookies)──► Supabase Auth ──► Postgres (same project)
   │                                                      ▲
   └──(Bearer access token)──► NestJS API ──(Prisma)──────┘
```

## 1. Create the Supabase project

1. Create a project at [supabase.com/dashboard](https://supabase.com/dashboard).
2. From **Project Settings → Database → Connection string**, copy:
   - **Transaction pooler** (port `6543`) → `DATABASE_URL`
   - **Session/Direct** (port `5432`) → `DIRECT_URL`
3. From **Project Settings → API**, copy:
   - `Project URL` → `SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `SUPABASE_ANON_KEY` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (**backend only — never ship to the browser**)

## 2. Environment variables

Copy the templates and fill them in:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

That is the only configuration the code needs. No `JWT_SECRET` is required —
the backend validates the access tokens that Supabase issues.

## 3. Enable Google sign-in

1. In [Google Cloud Console](https://console.cloud.google.com/apis/credentials),
   create an **OAuth client ID** of type **Web application**.
2. Add an authorised redirect URI:
   `https://<project-ref>.supabase.co/auth/v1/callback`
3. In the Supabase dashboard go to **Authentication → Providers → Google**,
   enable it, and paste the Google **Client ID** and **Client Secret**.

## 4. Configure email (OTP + reset links)

Supabase sends the signup OTP and password-reset emails.

- **Production:** set your own SMTP under
  **Authentication → Emails → SMTP Settings** (use the same credentials as the
  backend `SMTP_*` variables). This is required — the built-in sender is
  rate-limited and intended for development only.
- Confirm **Authentication → Providers → Email → Confirm email** is **enabled**
  so new accounts must verify with the 6-digit code.

The backend `SMTP_*` variables are used for the welcome email `EmailService`.

## 5. Redirect URLs

In **Authentication → URL Configuration**:

- **Site URL:** `http://localhost:3000` (or your production domain)
- **Redirect URLs:** add
  - `http://localhost:3000/auth/callback`
  - `https://your-domain.com/auth/callback`

## 6. Apply the database schema

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate deploy   # uses DIRECT_URL for migrations
```

For local iteration you can use `npx prisma migrate dev` instead.

## Auth flows implemented

| Flow | Where | Notes |
| --- | --- | --- |
| Sign up (email + password) | `/signup` | Supabase emails a 6-digit OTP |
| Verify OTP | `/verify-email` | `verifyOtp({ type: 'signup' })`, resend with cooldown |
| Sign in (email + password) | `/login` | `signInWithPassword` |
| Sign in / up (Google) | `/login`, `/signup` | `signInWithOAuth`, redirects through `/auth/callback` |
| Forgot password | `/forgot-password` | Sends a Supabase recovery link |
| Reset password | `/reset-password` | `updateUser({ password })` on the recovered session |
| Set password on Google account | API `POST /auth/password` | Lets Google-only users add an email credential |

### Account linking (Google ↔ email)

Supabase automatically links identities that share the same **verified** email
into a single user, so a person can sign up with email and later use Google (or
the reverse) and land on the same account. If someone tries to **sign up** with
email/password for an address that already exists, the `/signup` page calls
`GET /auth/email-status` and tells them precisely how to continue (e.g. "this
email is registered with Google — use Continue with Google") instead of failing
silently.

## Backend auth endpoints

| Method | Path | Auth | Purpose |
| --- | --- | --- | --- |
| `GET` | `/api/v1/auth/me` | Bearer | Current profile (creates it on first call) |
| `POST` | `/api/v1/auth/sync` | Bearer | Bootstrap profile after sign-in |
| `GET` | `/api/v1/auth/email-status?email=` | public | Provider lookup for signup guidance |
| `POST` | `/api/v1/auth/password` | Bearer | Set/change password |

All other API routes are protected by the same Supabase bearer-token guard.
