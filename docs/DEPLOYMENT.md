# CTF Platform - Deployment Guide

## Overview

This guide covers the complete deployment process for the CTF platform, including environment setup, external service configuration, and production deployment options.

**Deployment Methods:**
- Vercel (recommended for Next.js)
- Docker (self-hosted)
- Manual server deployment

---

## Prerequisites

### Required Accounts

| Service | Purpose | Sign Up |
|---------|---------|---------|
| Supabase | Database, Auth, Storage | [supabase.com](https://supabase.com) |
| Polar.sh | Payments & Billing | [polar.sh](https://polar.sh) |
| Resend | Email delivery | [resend.com](https://resend.com) |
| Cloudflare | Turnstile CAPTCHA | [cloudflare.com](https://cloudflare.com) |
| Vercel | Hosting (optional) | [vercel.com](https://vercel.com) |
| GitHub | Source control | [github.com](https://github.com) |

### Development Tools

```bash
# Required
Node.js 20+      # JavaScript runtime
npm 10+          # Package manager (or pnpm/yarn)
Git              # Version control

# Recommended
VS Code          # IDE with extensions
Supabase CLI     # Database management
Vercel CLI       # Deployment management
```

---

## Environment Setup

### 1. Clone Repository

```bash
# Clone the repository
git clone https://github.com/your-org/ctf-platform.git
cd ctf-platform

# Install dependencies
npm install
# or
pnpm install
```

### 2. Environment Variables

Create a `.env.local` file in the project root:

```bash
# Copy example environment file
cp .env.example .env.local
```

### 3. Environment Variables Reference

```env
# ============================================
# SUPABASE CONFIGURATION
# ============================================

# Project URL (required)
# Get from: Supabase Dashboard > Settings > API > Project URL
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co

# NEW API Key System (recommended)
# Get from: Settings > API > API Keys
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxx
SUPABASE_SECRET_KEY=sb_secret_xxx

# LEGACY API Keys (still supported)
# NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
# SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Database password (for CLI/migrations)
SUPABASE_DB_PASSWORD=your-db-password

# ============================================
# POLAR.SH CONFIGURATION
# ============================================

# Access Token for API calls
# Get from: Polar Dashboard > Settings > Access Tokens
POLAR_ACCESS_TOKEN=polar_oat_xxx

# Organization ID
# Get from: Polar Dashboard > Settings > Organization
POLAR_ORGANIZATION_ID=your-org-id

# Webhook Secret
# Get from: Polar Dashboard > Settings > Webhooks
POLAR_WEBHOOK_SECRET=polar_whs_xxx

# Server environment (sandbox for testing, production for live)
POLAR_SERVER=production

# ============================================
# EMAIL CONFIGURATION (Resend)
# ============================================

# API Key for sending emails
# Get from: Resend Dashboard > API Keys
RESEND_API_KEY=re_xxx

# From email address (must be verified in Resend)
RESEND_FROM_EMAIL=noreply@yourdomain.com

# ============================================
# CLOUDFLARE TURNSTILE
# ============================================

# Site Key (public)
# Get from: Cloudflare Dashboard > Turnstile
NEXT_PUBLIC_TURNSTILE_SITE_KEY=0x4AAAAAAxxx

# Secret Key (server-side verification)
# Get from: Same Turnstile widget settings
TURNSTILE_SECRET_KEY=0x4AAAAAAxxx

# ============================================
# APPLICATION CONFIGURATION
# ============================================

# Public site URL (production)
NEXT_PUBLIC_SITE_URL=https://yourdomain.com

# App URL (for Polar callbacks)
NEXT_PUBLIC_APP_URL=https://yourdomain.com

# ============================================
# OPTIONAL: MONITORING & ANALYTICS
# ============================================

# Sentry DSN (error tracking)
# SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx

# PostHog API Key (analytics)
# NEXT_PUBLIC_POSTHOG_KEY=phc_xxx
```

---

## Supabase Setup

### 1. Create Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose organization and project name
4. Select region closest to your users
5. Set database password (save this!)
6. Wait for project initialization

### 2. Configure Authentication

Navigate to **Authentication > Settings**:

**Site URL & Redirects:**
```
Site URL: https://yourdomain.com
Redirect URLs: https://yourdomain.com/auth/callback
```

**Email Templates:**
- Customize confirmation email template
- Set sender name and email

**Security Settings:**
- Enable "Confirm email" (recommended)
- Set "Max login attempts": 5
- Enable "Enable MFA" (for TOTP)

### 3. Configure External Providers (Optional)

Navigate to **Authentication > Providers**:

**GitHub OAuth:**
1. Go to GitHub > Settings > Developer settings > OAuth Apps
2. Create new OAuth App
3. Set Authorization callback URL: `https://your-project.supabase.co/auth/v1/callback`
4. Copy Client ID and Secret to Supabase

**Google OAuth:**
1. Go to Google Cloud Console > Credentials
2. Create OAuth 2.0 Client ID
3. Add authorized redirect: `https://your-project.supabase.co/auth/v1/callback`
4. Copy credentials to Supabase

### 4. Database Migrations

```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push

# Or apply SQL migrations directly via Dashboard
# Go to: SQL Editor > New query > Paste migration contents
```

### 5. Configure Storage Buckets

Navigate to **Storage > New bucket**:

**avatars bucket:**
- Name: `avatars`
- Public: Yes
- Allowed MIME types: `image/*`
- Max file size: 5MB

**challenge-assets bucket:**
- Name: `challenge-assets`
- Public: Yes (for downloads)
- Allowed MIME types: `*/*`
- Max file size: 50MB

**Storage Policies:**
```sql
-- Avatars bucket policies
CREATE POLICY "Avatar images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);
```

---

## Polar.sh Configuration

### 1. Create Organization

1. Sign up at [polar.sh](https://polar.sh)
2. Complete onboarding and create organization
3. Verify your domain (for branded checkout)

### 2. Create Products

Navigate to **Products > New Product**:

**Example: Pro Subscription**
```
Name: CTF Pro
Description: Unlock all challenges and premium features
Pricing: 
  - Monthly: $9.99/month
  - Yearly: $99.99/year (17% savings)
Metadata:
  - polar_product_id: (auto-generated, copy this)
  - tier: pro
```

**Example: Elite Subscription**
```
Name: CTF Elite
Description: Enterprise access with team features
Pricing:
  - Monthly: $29.99/month
  - Yearly: $299.99/year
Metadata:
  - polar_product_id: (auto-generated, copy this)
  - tier: elite
```

### 3. Configure Webhooks

Navigate to **Settings > Webhooks > New webhook**:

```
URL: https://yourdomain.com/api/webhooks/polar
Secret: (generate a random string, save to POLAR_WEBHOOK_SECRET)
Events:
  - subscription.created
  - subscription.active
  - subscription.updated
  - subscription.canceled
  - subscription.revoked
  - order.paid
```

### 4. Get API Credentials

Navigate to **Settings > Access Tokens**:
1. Create new access token
2. Copy token to `POLAR_ACCESS_TOKEN`

Navigate to **Settings > Organization**:
1. Copy Organization ID to `POLAR_ORGANIZATION_ID`

### 5. Sync Products to Database

```sql
-- Insert products after creating in Polar
INSERT INTO public.products (id, active, name, description, metadata)
VALUES (
  'your-product-id',
  true,
  'CTF Pro',
  'Unlock all challenges',
  '{"polar_product_id": "your-polar-product-id", "tier": "pro"}'::jsonb
);

-- Insert corresponding prices
INSERT INTO public.prices (id, product_id, active, unit_amount, currency, type, interval)
VALUES (
  'your-price-id',
  'your-product-id',
  true,
  999,  -- $9.99 in cents
  'usd',
  'recurring',
  'month'
);
```

---

## Cloudflare Turnstile Setup

### 1. Create Widget

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **Turnstile > Add Widget**
3. Configure widget:

```
Widget Name: CTF Platform Signup
Hostname: yourdomain.com
Mode: Managed (recommended)
```

### 2. Get Credentials

After creating the widget:
- **Site Key**: Copy to `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
- **Secret Key**: Copy to `TURNSTILE_SECRET_KEY`

### 3. Test Mode

For development, use test keys:
```
Site Key: 1x00000000000000000000AA
Secret Key: 1x0000000000000000000000000000000AA
```

These always pass verification without actual CAPTCHA.

---

## Resend Email Setup

### 1. Create Account

1. Sign up at [resend.com](https://resend.com)
2. Complete email verification

### 2. Verify Domain

Navigate to **Domains > Add Domain**:
1. Enter your domain (e.g., `yourdomain.com`)
2. Add DNS records as instructed
3. Wait for verification (can take up to 24 hours)

### 3. Get API Key

Navigate to **API Keys > Create API Key**:
- Name: "Production"
- Permissions: "Sending access"
- Copy key to `RESEND_API_KEY`

### 4. Configure From Address

```env
RESEND_FROM_EMAIL=noreply@yourdomain.com
```

---

## Local Development

### Start Development Server

```bash
# Run Next.js dev server
npm run dev

# Server will start at http://localhost:3000
```

### Run Database Migrations Locally

```bash
# Start local Supabase
supabase start

# Apply migrations
supabase db reset

# Generate types from database
supabase gen types typescript --local > lib/supabase/types.ts
```

### Testing Webhooks Locally

Use ngrok to expose local server:

```bash
# Install ngrok
npm install -g ngrok

# Expose local server
ngrok http 3000

# Copy HTTPS URL and configure in Polar:
# Webhook URL: https://your-ngrok-url.ngrok.io/api/webhooks/polar
```

---

## Production Deployment

### Deploy to Vercel (Recommended)

#### Option 1: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

#### Option 2: Git Integration

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import project from GitHub
4. Configure environment variables in Vercel dashboard
5. Deploy

#### Vercel Configuration

Create `vercel.json`:

```json
{
  "framework": "nextjs",
  "buildCommand": "next build",
  "devCommand": "next dev",
  "installCommand": "npm install",
  "regions": ["iad1"],
  "env": {
    "NEXT_PUBLIC_SITE_URL": "https://yourdomain.com"
  }
}
```

### Environment Variables in Vercel

Navigate to **Project Settings > Environment Variables**:

Add all variables from `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SECRET_KEY`
- `POLAR_ACCESS_TOKEN`
- `POLAR_ORGANIZATION_ID`
- `POLAR_WEBHOOK_SECRET`
- `RESEND_API_KEY`
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
- `TURNSTILE_SECRET_KEY`
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_APP_URL`

### Custom Domain

1. In Vercel dashboard, go to **Domains**
2. Add your domain
3. Follow DNS configuration instructions
4. Wait for SSL certificate provisioning

---

## Docker Deployment

### Build Docker Image

```dockerfile
# Dockerfile
FROM node:20-alpine AS base

# Install dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Build application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### Build and Run

```bash
# Build image
docker build -t ctf-platform .

# Run container
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL=... \
  -e NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=... \
  -e SUPABASE_SECRET_KEY=... \
  -e POLAR_ACCESS_TOKEN=... \
  -e POLAR_WEBHOOK_SECRET=... \
  -e RESEND_API_KEY=... \
  -e NEXT_PUBLIC_TURNSTILE_SITE_KEY=... \
  -e TURNSTILE_SECRET_KEY=... \
  -e NEXT_PUBLIC_SITE_URL=https://yourdomain.com \
  ctf-platform
```

### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
      - NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=${NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY}
      - SUPABASE_SECRET_KEY=${SUPABASE_SECRET_KEY}
      - POLAR_ACCESS_TOKEN=${POLAR_ACCESS_TOKEN}
      - POLAR_ORGANIZATION_ID=${POLAR_ORGANIZATION_ID}
      - POLAR_WEBHOOK_SECRET=${POLAR_WEBHOOK_SECRET}
      - RESEND_API_KEY=${RESEND_API_KEY}
      - NEXT_PUBLIC_TURNSTILE_SITE_KEY=${NEXT_PUBLIC_TURNSTILE_SITE_KEY}
      - TURNSTILE_SECRET_KEY=${TURNSTILE_SECRET_KEY}
      - NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}
      - NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL}
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

Deploy with:
```bash
docker-compose up -d
```

---

## Production Checklist

### Pre-Deployment

- [ ] All environment variables set in production
- [ ] Database migrations applied
- [ ] Storage buckets created and configured
- [ ] Polar.sh webhooks configured with production URL
- [ ] Email domain verified in Resend
- [ ] Turnstile widget configured for production domain
- [ ] OAuth apps configured with production callbacks

### Security

- [ ] `SUPABASE_SECRET_KEY` never exposed to client
- [ ] `POLAR_WEBHOOK_SECRET` is strong and random
- [ ] `TURNSTILE_SECRET_KEY` never exposed to client
- [ ] CORS properly configured
- [ ] Content Security Policy headers set
- [ ] HTTPS enforced

### Performance

- [ ] Next.js build output analyzed (`npm run build`)
- [ ] Large dependencies optimized
- [ ] Images optimized and using Next.js Image component
- [ ] Database indexes created

### Monitoring

- [ ] Error tracking configured (Sentry recommended)
- [ ] Analytics configured (optional)
- [ ] Database monitoring enabled in Supabase
- [ ] Vercel Analytics enabled (if using Vercel)

### Backup & Recovery

- [ ] Supabase backups verified
- [ ] Database backup schedule confirmed
- [ ] Disaster recovery procedure documented

---

## Monitoring and Logging

### Application Monitoring

#### Vercel Analytics

Enable in Vercel Dashboard:
1. Go to **Analytics**
2. Enable Web Analytics
3. Script is auto-injected for Next.js projects

#### Sentry Integration

```bash
# Install Sentry SDK
npm install @sentry/nextjs

# Configure in next.config.js
const { withSentryConfig } = require('@sentry/nextjs');

module.exports = withSentryConfig(nextConfig, {
  org: "your-org",
  project: "ctf-platform",
});
```

### Database Monitoring

**Supabase Dashboard:**
- Go to **Database > Health**
- Monitor connection pool usage
- Check slow query logs
- Review RLS policy performance

**Key Metrics:**
- Active connections
- Query latency
- Storage usage
- Auth rate limits

### Log Aggregation

**Vercel Logs:**
```bash
# View logs via CLI
vercel logs --json

# Filter by function
vercel logs --all --query="/api/webhooks/polar"
```

**Supabase Logs:**
Navigate to **Logs > API/Auth/Postgres** in Supabase Dashboard

### Alerting

Configure alerts in:
- **Vercel**: Deployment failures, error rate spikes
- **Supabase**: Connection limits, storage capacity
- **Polar.sh**: Failed payments, webhook errors
- **Sentry**: New issues, error rate thresholds

---

## Troubleshooting

### Common Issues

#### Build Failures

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

#### Database Connection Issues

```bash
# Test Supabase connection
npx supabase status

# Verify environment variables
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
```

#### Webhook Failures

1. Check Vercel logs for webhook endpoint
2. Verify `POLAR_WEBHOOK_SECRET` matches
3. Test webhook signature validation
4. Ensure endpoint is publicly accessible

#### Email Delivery Issues

1. Verify domain verification in Resend
2. Check `RESEND_FROM_EMAIL` matches verified domain
3. Review Resend dashboard for delivery status
4. Check spam folders

### Debug Mode

Enable debug logging:

```env
# .env.local
DEBUG=true
NEXT_PUBLIC_DEBUG=true
```

---

## Related Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture overview
- [DATABASE.md](./DATABASE.md) - Database schema and operations
- [API.md](./API.md) - API documentation
- [SECURITY.md](./SECURITY.md) - Security practices
