# CTF Platform - System Architecture Document

## Executive Summary

This document describes the architecture of a modern Capture The Flag (CTF) cybersecurity training platform. The platform enables users to practice cybersecurity skills through realistic challenges, compete on leaderboards, and collaborate in teams. Built with a focus on security, scalability, and developer experience, the platform leverages modern web technologies and best practices.

**Key Capabilities:**
- User authentication with MFA support
- Challenge management with dynamic scoring
- Real-time containerized challenge instances
- Team collaboration and competition
- Subscription-based access tiers
- Comprehensive audit logging

---

## System Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT LAYER                                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐ │
│  │   Browser    │  │   Browser    │  │   Browser    │  │  Mobile/Tablet   │ │
│  │  (Next.js)   │  │  (Next.js)   │  │  (Next.js)   │  │   (Responsive)   │ │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └────────┬─────────┘ │
└─────────┼─────────────────┼─────────────────┼───────────────────┼───────────┘
          │                 │                 │                   │
          └─────────────────┴────────┬────────┴───────────────────┘
                                     │
┌────────────────────────────────────┴────────────────────────────────────────┐
│                           EDGE/CDN LAYER                                    │
│                     (Vercel Edge Network)                                   │
│         ┌─────────────────┐    ┌─────────────────┐                         │
│         │  Static Assets  │    │   API Routes    │                         │
│         │  (/_next/static)│    │  (Serverless)   │                         │
│         └─────────────────┘    └─────────────────┘                         │
└─────────────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         APPLICATION LAYER                                  │
│                         (Next.js 16 App Router)                            │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    Server Components                                 │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌───────────────┐ │   │
│  │  │   Pages     │ │   Layouts   │ │    Data     │ │     Auth      │ │   │
│  │  │  (RSC)      │ │   (RSC)     │ │   Fetching  │ │   (Middleware)│ │   │
│  │  └─────────────┘ └─────────────┘ └─────────────┘ └───────────────┘ │   │
│  ├─────────────────────────────────────────────────────────────────────┤   │
│  │                    Server Actions                                    │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌───────────────┐ │   │
│  │  │ submitFlag  │ │  Team Mgmt  │ │    MFA      │ │   Payments    │ │   │
│  │  │ startInstance│ │   createTeam │ │  enrollMFA  │ │   checkout    │ │   │
│  │  └─────────────┘ └─────────────┘ └─────────────┘ └───────────────┘ │   │
│  ├─────────────────────────────────────────────────────────────────────┤   │
│  │                    API Routes                                        │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐                   │   │
│  │  │  /checkout  │ │ /webhooks/* │ │/customer-portal                 │   │
│  │  └─────────────┘ └─────────────┘ └─────────────┘                   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                            DATA LAYER                                       │
│                         (Supabase Platform)                                │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    PostgreSQL Database                               │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ │   │
│  │  │ profiles │ │challenges│ │  solves  │ │   teams  │ │subscriptions│ │   │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘ │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ │   │
│  │  │submissions│ │container_│ │audit_logs│ │  tags    │ │ api_tokens│ │   │
│  │  └──────────┘ │instances │ └──────────┘ └──────────┘ └──────────┘ │   │
│  │               └──────────┘                                         │   │
│  ├─────────────────────────────────────────────────────────────────────┤   │
│  │                    Auth & Security                                   │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐                   │   │
│  │  │   GoTrue    │ │     RLS     │ │    MFA      │                   │   │
│  │  │  (Auth)     │ │  Policies   │ │   (TOTP)    │                   │   │
│  │  └─────────────┘ └─────────────┘ └─────────────┘                   │   │
│  ├─────────────────────────────────────────────────────────────────────┤   │
│  │                    Storage                                          │   │
│  │  ┌─────────────┐ ┌─────────────┐                                   │   │
│  │  │   Avatars   │ │  Challenge  │                                   │   │
│  │  │   Bucket    │ │   Assets    │                                   │   │
│  │  └─────────────┘ └─────────────┘                                   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         EXTERNAL SERVICES                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │   Polar.sh   │  │   Resend     │  │  Cloudflare  │  │   (Future)   │    │
│  │  (Payments)  │  │   (Email)    │  │  Turnstile   │  │  Container   │    │
│  │              │  │              │  │   (Captcha)  │  │   Provider   │    │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Architecture Layers

### 1. Presentation Layer

**Technology Stack:**
- **Next.js 16** - React framework with App Router
- **React 19** - UI library with Server Components
- **Tailwind CSS v4** - Utility-first CSS framework
- **Radix UI / Base UI** - Headless UI primitives
- **Lucide React** - Icon library

**Key Characteristics:**

| Feature | Implementation | Purpose |
|---------|---------------|---------|
| Server Components | React Server Components (RSC) | Reduce client-side JavaScript, improve initial load |
| Client Components | `'use client'` directives | Interactivity where needed (forms, animations) |
| Streaming | Next.js Streaming SSR | Progressive page rendering |
| Styling | Tailwind CSS v4 + CSS Variables | Consistent theming, dark mode support |
| UI Components | Custom + shadcn/ui pattern | Accessible, composable components |

**Component Architecture:**
```
app/
├── layout.tsx              # Root layout (Server Component)
├── page.tsx                # Home page (Server Component)
├── login/
│   └── page.tsx            # Login page (Server Component)
├── signup/
│   ├── page.tsx            # Signup page (Server Component)
│   └── actions.ts          # Server Actions for signup
└── dashboard/
    ├── layout.tsx          # Dashboard layout with auth
    ├── page.tsx            # Dashboard overview
    ├── challenges/
    │   ├── page.tsx        # Challenge list
    │   └── [slug]/
    │       └── page.tsx    # Challenge detail
    └── teams/
        └── page.tsx        # Team management

components/
├── ui/                     # Base UI components
├── challenges/             # Challenge-specific components
├── teams/                  # Team management components
└── account/                # Account settings components
```

### 2. Application/Logic Layer

**Technology Stack:**
- **Next.js App Router** - File-based routing and API handlers
- **Server Actions** - Form handling and mutations
- **API Routes** - RESTful endpoints for webhooks and external integrations
- **Zod** - Schema validation

**Server Actions Architecture:**

| Action | File | Purpose |
|--------|------|---------|
| `signup` | `app/signup/actions.ts` | User registration with captcha |
| `submitFlag` | `features/challenges/actions/submit-flag.ts` | Flag verification and scoring |
| `startInstance` | `features/challenges/actions/start-instance.ts` | Container provisioning |
| `createTeam` | `features/teams/actions/team-management.ts` | Team creation and management |
| `enrollMFA` | `features/account/actions/mfa.ts` | MFA enrollment (TOTP) |
| `updateProfile` | `features/account/actions/update-profile.ts` | Profile updates |

**API Routes:**

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/checkout` | GET | Initiates Polar.sh checkout session |
| `/api/customer-portal` | GET | Redirects to customer billing portal |
| `/api/webhooks/polar` | POST | Handles Polar.sh webhook events |

### 3. Data Layer

**Technology Stack:**
- **Supabase** - Backend-as-a-Service platform
- **PostgreSQL** - Primary database
- **Row Level Security (RLS)** - Fine-grained access control
- **Database Functions** - Business logic in SQL

**Database Architecture:**
- 19 tables covering users, challenges, teams, submissions, and billing
- Comprehensive RLS policies for security
- Database triggers for automated scoring updates
- Audit logging for compliance

**Key Design Patterns:**
- **Soft Deletes** - `deleted_at` timestamps for data preservation
- **Immutable Audit Logs** - Append-only audit trail
- **Dynamic Scoring** - Automatic point adjustment based on solve count
- **Metadata Flexibility** - JSONB columns for extensible data

### 4. External Services

#### 4.1 Polar.sh (Payments)
- **Purpose**: Subscription management and billing
- **Integration**: Webhook-based synchronization
- **Features**: Checkout sessions, customer portal, subscription lifecycle

#### 4.2 Resend (Email)
- **Purpose**: Transactional email delivery
- **Usage**: Welcome emails, password resets, notifications
- **Integration**: React Email components for templating

#### 4.3 Cloudflare Turnstile (CAPTCHA)
- **Purpose**: Bot protection during signup
- **Integration**: Client-side widget + server verification
- **Mode**: Managed (automatic difficulty adjustment)

---

## Data Flow Diagrams

### User Registration Flow

```
┌─────────┐     ┌──────────────┐     ┌────────────────┐     ┌──────────────┐
│  User   │────▶│ Signup Form  │────▶│ Turnstile      │────▶│ Server Action│
│         │     │ (Client)     │     │ Verification   │     │ (signup)     │
└─────────┘     └──────────────┘     └────────────────┘     └──────┬───────┘
                                                                   │
                                                                   ▼
┌──────────────┐     ┌────────────────┐     ┌────────────────┐   ┌──────────┐
│   Profile    │◀────│  Database      │◀────│   Supabase     │◀──│   Auth   │
│   Created    │     │  (Trigger)     │     │   Auth         │   │  SignUp  │
└──────────────┘     └────────────────┘     └────────────────┘   └──────────┘
```

### Challenge Submission Flow

```
┌─────────┐     ┌─────────────┐     ┌─────────────────┐     ┌──────────────┐
│  User   │────▶│ Flag Submit │────▶│  Rate Limit     │────▶│   SHA-256    │
│         │     │   Form      │     │  Check (10/min) │     │   Hashing    │
└─────────┘     └─────────────┘     └─────────────────┘     └──────┬───────┘
                                                                   │
                                                                   ▼
┌──────────────┐     ┌────────────────┐     ┌────────────────┐   ┌──────────┐
│   Points     │◀────│    SOLVES      │◀────│  verify_flag   │◀──│  Hash    │
│  Awarded     │     │   Recorded     │     │  (RPC Function)│   │ Compare  │
└──────────────┘     └────────────────┘     └────────────────┘   └──────────┘
       │
       ▼
┌──────────────┐     ┌────────────────┐
│   Profile    │     │   Submission   │
│   Updated    │     │   Logged       │
└──────────────┘     └────────────────┘
```

### Payment Flow

```
┌─────────┐     ┌──────────────┐     ┌────────────────┐     ┌──────────────┐
│  User   │────▶│ Pricing Page │────▶│  Checkout API  │────▶│  Polar.sh    │
│         │     │              │     │  (with user_id)│     │  Checkout    │
└─────────┘     └──────────────┘     └────────────────┘     └──────┬───────┘
                                                                   │
                                                                   ▼
┌──────────────┐     ┌────────────────┐     ┌────────────────┐   ┌──────────┐
│ Subscription │◀────│   Webhook      │◀────│   Payment      │   │ Success  │
│   Updated    │     │  (/webhooks/   │     │   Completed    │   │ Redirect │
│              │     │   polar)       │     │                │   │          │
└──────────────┘     └────────────────┘     └────────────────┘   └──────────┘
```

---

## Authentication Flow

### Multi-Factor Authentication (MFA)

The platform implements MFA using TOTP (Time-based One-Time Password) via authenticator apps.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           MFA ENROLLMENT FLOW                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │  User    │───▶│  Enroll MFA  │───▶│  Generate    │───▶│  Display QR  │  │
│  │ Request  │    │  (Server)    │    │  TOTP Secret │    │  Code        │  │
│  └──────────┘    └──────────────┘    └──────────────┘    └──────────────┘  │
│                                                                │            │
│                                                                ▼            │
│  ┌──────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │   MFA    │◀───│  Activate    │◀───│  Verify Code │◀───│  Scan with   │  │
│  │ Enabled  │    │  Factor      │    │  (Server)    │    │  Authenticator│ │
│  └──────────┘    └──────────────┘    └──────────────┘    └──────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Session Management

| Aspect | Implementation |
|--------|---------------|
| Session Storage | HTTP-only cookies (Supabase SSR) |
| Session Duration | 30 days with refresh |
| AAL Levels | AAL1 (password), AAL2 (MFA) |
| Session Refresh | Automatic via middleware |
| Concurrent Sessions | Supported (per-device) |

### Authentication Assurance Levels

| Level | Requirements | Access |
|-------|-------------|--------|
| AAL1 | Email + Password | Public challenges, basic features |
| AAL2 | AAL1 + MFA TOTP | All challenges, team features, billing |

---

## Payment Flow

### Subscription Lifecycle

```
                    ┌─────────────┐
                    │   Created   │
                    └──────┬──────┘
                           │
           ┌───────────────┼───────────────┐
           │               │               │
           ▼               ▼               ▼
    ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
    │   Active    │ │   Canceled  │ │   Revoked   │
    │             │ │  (by user)  │ │(payment fail)│
    └──────┬──────┘ └─────────────┘ └─────────────┘
           │
           │ Period End
           ▼
    ┌─────────────┐
    │   Expired   │
    └─────────────┘
```

### Webhook Event Handling

| Event | Action | Database Update |
|-------|--------|----------------|
| `subscription.created` | Create subscription record | `INSERT INTO subscriptions` |
| `subscription.active` | Activate subscription | `status = 'active'` |
| `subscription.updated` | Update plan/period | `price_id`, `current_period_end` |
| `subscription.canceled` | Mark as canceled | `status = 'canceled'` |
| `subscription.revoked` | Revoke access | `status = 'revoked'` |
| `order.paid` | Handle one-time purchase | Custom logic per product |

---

## Security Architecture

### Defense in Depth

```
Layer 1: Edge Protection
├── Cloudflare Turnstile (Bot protection)
├── DDoS protection (Vercel Edge)
└── Rate limiting (API routes)

Layer 2: Application Security
├── Input validation (Zod schemas)
├── XSS protection (React escaping)
├── CSRF protection (SameSite cookies)
└── Security headers (CSP, HSTS)

Layer 3: Data Security
├── Row Level Security (RLS)
├── Encrypted connections (TLS 1.3)
├── Password hashing (bcrypt via Supabase)
└── Flag hashing (SHA-256, server-side)

Layer 4: Infrastructure
├── Database encryption at rest
├── Audit logging
├── Principle of least privilege
└── Environment isolation
```

### Security Headers

```http
Content-Security-Policy: default-src 'self'; 
  script-src 'self' 'unsafe-eval' 'unsafe-inline' https://challenges.cloudflare.com;
  connect-src 'self' https://*.supabase.co wss://*.supabase.co;
  frame-src https://challenges.cloudflare.com;
  img-src 'self' blob: data: https://*.supabase.co;
  style-src 'self' 'unsafe-inline';
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
```

---

## Scalability Considerations

### Horizontal Scaling

| Component | Scaling Strategy |
|-----------|-----------------|
| Next.js Application | Vercel serverless functions (auto-scale) |
| Database | Supabase read replicas + connection pooling |
| Static Assets | Vercel Edge Network (CDN) |
| File Storage | Supabase Storage (S3-compatible) |

### Performance Optimizations

1. **Database**
   - Strategic indexes on frequently queried columns
   - Database functions for complex calculations
   - Row-level security avoids unnecessary data transfer

2. **Caching**
   - Next.js ISR for challenge pages
   - React Server Components reduce client JS
   - Supabase Realtime for live leaderboard updates

3. **Container Orchestration** (Future)
   - Kubernetes for challenge instances
   - Auto-scaling based on active users
   - Resource quotas per challenge

### Resource Limits

| Resource | Limit | Notes |
|----------|-------|-------|
| Submissions/minute | 10 per challenge | Rate limiting |
| Container instances | Per-user limits | Prevents resource exhaustion |
| File uploads | 5MB per file | Storage constraints |
| API requests | Vercel limits | Serverless function quotas |

---

## Technology Stack Justification

### Frontend

| Technology | Justification |
|------------|--------------|
| **Next.js 16** | App Router enables Server Components, reducing client JS. Built-in optimizations (images, fonts). |
| **React 19** | Latest features, improved performance, better Server Components support. |
| **Tailwind CSS v4** | Utility-first approach enables rapid UI development. v4 offers improved performance. |
| **TypeScript** | Type safety across the entire stack. Catches errors at compile time. |

### Backend

| Technology | Justification |
|------------|--------------|
| **Supabase** | Open-source Firebase alternative. PostgreSQL + Auth + Storage in one platform. |
| **PostgreSQL** | Robust, ACID-compliant relational database. Excellent JSONB support. |
| **Row Level Security** | Fine-grained access control at the database level. Security closer to data. |
| **Server Actions** | Co-locate mutations with components. Progressive enhancement support. |

### External Services

| Service | Justification |
|---------|--------------|
| **Polar.sh** | Developer-friendly payment platform. Simple integration, webhook support. |
| **Resend** | Modern email API with React Email support. Excellent deliverability. |
| **Cloudflare Turnstile** | Privacy-focused CAPTCHA. No visual challenge for most users. |
| **Vercel** | Optimal Next.js hosting. Edge network, serverless functions, analytics. |

### Security

| Technology | Justification |
|------------|--------------|
| **SHA-256** | Industry-standard hashing for flag verification. Fast, collision-resistant. |
| **bcrypt** | Password hashing via Supabase Auth. Adaptive cost factor. |
| **TOTP MFA** | Industry standard for MFA. Works with authenticator apps. |

---

## Future Architecture Considerations

### Planned Enhancements

1. **Container Orchestration**
   - Integration with Kubernetes or AWS ECS
   - Per-challenge Docker image support
   - Auto-scaling container instances

2. **Real-time Features**
   - WebSocket-based live leaderboard
   - Real-time team collaboration
   - Challenge instance status updates

3. **Advanced Analytics**
   - Challenge difficulty analysis
   - User progress tracking
   - Learning path recommendations

4. **Enterprise Features**
   - SAML/SSO integration
   - Organization-level access control
   - Advanced audit reporting

---

## Appendix

### Related Documentation

- [DATABASE.md](./DATABASE.md) - Database schema and RLS policies
- [API.md](./API.md) - API endpoints and Server Actions
- [SECURITY.md](./SECURITY.md) - Security implementation details
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment and operations guide
