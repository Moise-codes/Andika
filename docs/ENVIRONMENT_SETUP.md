# Environment Configuration Setup Guide

This guide walks you through setting up all environment variables for the ANDIKA application, including Supabase, Prisma, and Google OAuth.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Supabase Setup](#supabase-setup)
3. [Backend Environment Setup](#backend-environment-setup)
4. [Frontend Environment Setup](#frontend-environment-setup)
5. [Google OAuth Configuration](#google-oauth-configuration)
6. [Testing Your Setup](#testing-your-setup)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

- A Supabase account (free tier works)
- Node.js 18+ installed
- Git

---

## Supabase Setup

### 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up / Sign in
3. Click "New Project"
4. Fill in the project details:
   - **Name**: andika (or your preferred name)
   - **Database Password**: Generate a strong password (save this!)
   - **Region**: Choose a region close to your users
   - **Pricing Plan**: Free tier is fine for development

### 2. Get Your Supabase Credentials

Once your project is created (takes 1-2 minutes):

1. Go to **Project Settings** → **API**
2. Copy the following values:
   - **Project URL** (e.g., `https://xxxxxxxx.supabase.co`)
   - **anon public key** (also called `anon key`)
   - **service_role key** (keep this secret!)

### 3. Get Database Connection Strings

1. In the same **API** settings page, scroll down to **Connection String**
2. Copy the **URI** format (for `DATABASE_URL`)
3. Copy the **Connection pooling** URI format (for `DIRECT_URL`)

The formats should look like:
- **DATABASE_URL**: `postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`
- **DIRECT_URL**: `postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres`

### 4. Run Database Migrations

After setting up your `.env` file (see below), run:

```bash
cd backend
npm run prisma:migrate
npm run prisma:generate
```

---

## Backend Environment Setup

### 1. Create the .env file

```bash
cd backend
cp .env.example .env
```

### 2. Fill in the values

Edit `backend/.env` with your actual values:

```env
# Server Configuration
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Supabase Configuration
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Database Configuration
DATABASE_URL=postgresql://postgres:your-password@db.your-project-ref.supabase.co:5432/postgres
DIRECT_URL=postgresql://postgres.your-project-ref:your-password@aws-0-us-east-1.pooler.supabase.com:6543/postgres

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=noreply@andika.app
```

### 3. Important Notes

- **DATABASE_URL vs DIRECT_URL**: 
  - `DATABASE_URL` uses the connection pooler (good for production)
  - `DIRECT_URL` bypasses the pooler (required for migrations)
  - Both are required for Prisma to work correctly with Supabase

- **SUPABASE_SERVICE_ROLE_KEY**: 
  - This gives admin privileges
  - Never expose this in frontend code
  - Only use on the backend

---

## Frontend Environment Setup

### 1. Create the .env file

```bash
cd frontend
cp .env.example .env
```

### 2. Fill in the values

Edit `frontend/.env` with your actual values:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Backend API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001

# Application Configuration
NEXT_PUBLIC_APP_NAME=ANDIKA
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Important Notes

- **NEXT_PUBLIC_ prefix**: Variables with this prefix are exposed to the browser
- **NEXT_PUBLIC_SUPABASE_ANON_KEY**: This is safe to expose (it's designed for client-side use)
- **NEXT_PUBLIC_API_URL**: Should point to your backend API (without `/api/v1`)

---

## Google OAuth Configuration

Google OAuth is configured entirely in Supabase. No additional environment variables are needed.

### Step 1: Create a Google OAuth App

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. Configure the consent screen if prompted:
   - Choose **External** user type
   - Fill in required fields (app name, email, etc.)
   - Add your email as a test user
6. Create the OAuth client ID:
   - **Application type**: Web application
   - **Name**: ANDIKA
   - **Authorized redirect URIs**: Add your Supabase callback URL:
     - Development: `http://localhost:3000/auth/callback`
     - Production: `https://your-domain.com/auth/callback`
7. Copy the **Client ID** and **Client Secret**

### Step 2: Configure Google OAuth in Supabase

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** → **Providers**
3. Enable **Google** provider
4. Fill in the Google OAuth credentials:
   - **Client ID**: Paste from Google Cloud Console
   - **Client Secret**: Paste from Google Cloud Console
5. Click **Save**

### Step 3: Configure Redirect URLs in Supabase

1. In Supabase, go to **Authentication** → **URL Configuration**
2. Add your site URL:
   - Development: `http://localhost:3000`
   - Production: `https://your-domain.com`
3. Add redirect URLs:
   - `http://localhost:3000/auth/callback`
   - `https://your-domain.com/auth/callback`

### Step 4: Test Google OAuth

1. Start your frontend: `cd frontend && npm run dev`
2. Navigate to `http://localhost:3000/login`
3. Click "Continue with Google"
4. You should be redirected to Google's sign-in page

---

## Testing Your Setup

### Test Backend Connection

```bash
cd backend
npm run start:dev
```

Check that:
- Server starts on port 3001
- No Supabase connection errors in logs
- Swagger docs available at `http://localhost:3001/api/docs`

### Test Frontend Connection

```bash
cd frontend
npm run dev
```

Check that:
- Frontend starts on port 3000
- No Supabase configuration errors
- Can navigate to login/signup pages

### Test Database Connection

```bash
cd backend
npx prisma studio
```

This opens Prisma Studio, which should connect to your Supabase database if everything is configured correctly.

---

## Troubleshooting

### Issue: "Supabase is not configured"

**Cause**: Missing or incorrect `NEXT_PUBLIC_SUPABASE_URL` or `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**Solution**:
1. Check `frontend/.env` exists and has correct values
2. Ensure variables have `NEXT_PUBLIC_` prefix
3. Restart the dev server after changing `.env`

### Issue: Prisma connection fails

**Cause**: Incorrect `DATABASE_URL` or `DIRECT_URL`

**Solution**:
1. Verify connection strings from Supabase dashboard
2. Ensure password is URL-encoded (replace special characters)
3. Check that `DIRECT_URL` uses the pooler format (port 6543)
4. Run `npx prisma generate` after changing `.env`

### Issue: Google OAuth redirect error

**Cause**: Redirect URL not configured in Google Cloud Console or Supabase

**Solution**:
1. Verify redirect URL in Google Cloud Console matches your domain
2. Check Supabase Authentication → URL Configuration
3. Ensure callback URL includes `/auth/callback`

### Issue: CORS errors

**Cause**: `FRONTEND_URL` not set correctly in backend

**Solution**:
1. Check `backend/.env` has correct `FRONTEND_URL`
2. For multiple origins, separate with commas: `http://localhost:3000,https://your-domain.com`
3. Restart backend after changing `.env`

### Issue: Migration fails with DIRECT_URL

**Cause**: `DIRECT_URL` not set or incorrect format

**Solution**:
1. Ensure `DIRECT_URL` uses pooler format (port 6543)
2. Format should be: `postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres`
3. Note the `postgres.[PROJECT-REF]` format (not just `postgres`)

---

## Production Deployment

For production deployment, update your environment variables:

### Backend (.env)

```env
NODE_ENV=production
FRONTEND_URL=https://your-domain.com
DATABASE_URL=postgresql://postgres:prod-password@db.your-project-ref.supabase.co:5432/postgres
DIRECT_URL=postgresql://postgres.your-project-ref:prod-password@aws-0-region.pooler.supabase.com:6543/postgres
```

### Frontend (.env)

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_API_URL=https://your-backend-domain.com
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### Google OAuth Production Setup

1. Add production redirect URL to Google Cloud Console
2. Add production site URL to Supabase Authentication settings
3. Update authorized redirect URIs in both places

---

## Security Best Practices

1. **Never commit `.env` files** - They're in `.gitignore`
2. **Rotate secrets regularly** - Especially service role keys
3. **Use different passwords** for development and production
4. **Limit service role key usage** - Only on backend, never frontend
5. **Enable RLS (Row Level Security)** in Supabase for additional security
6. **Use environment-specific configs** - Separate dev/staging/prod

---

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Google OAuth Guide](https://support.google.com/cloud/answer/6151604)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
