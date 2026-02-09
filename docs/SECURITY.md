# CTF Platform - Security Documentation

## Overview

This document outlines the security architecture, practices, and policies for the CTF platform. Security is a core design principle, implemented through defense-in-depth strategies across all layers of the application.

**Security Certifications & Compliance:**
- SOC 2 Type II (via Supabase)
- GDPR compliant data handling
- CCPA compliant privacy practices

---

## Authentication Mechanisms

### Password Authentication

**Storage:**
- Passwords are never stored in plaintext
- Supabase Auth uses bcrypt with adaptive cost factor (10+)
- Salt is unique per user and randomly generated

**Requirements:**
- Minimum 8 characters
- No complexity requirements (entropy-based strength encouraged)
- Common password checking against breach databases

**Brute Force Protection:**
- 5 failed attempts triggers temporary lockout
- Progressive delays between attempts
- IP-based rate limiting

### Multi-Factor Authentication (MFA)

**Implementation:**
- TOTP (Time-based One-Time Password) via authenticator apps
- RFC 6238 compliant
- Supports Google Authenticator, Authy, 1Password, etc.

**Enrollment Flow:**
1. User initiates enrollment
2. Server generates TOTP secret (160-bit)
3. QR code displayed for scanning
4. User provides verification code
5. Factor activated and marked as `verified`

**AAL Levels:**

| Level | Methods | Use Case |
|-------|---------|----------|
| AAL1 | Password only | Public browsing, viewing challenges |
| AAL2 | Password + TOTP | Flag submission, team management, billing |

### OAuth Providers

**Supported Providers:**
- GitHub
- Google

**Security Features:**
- PKCE (Proof Key for Code Exchange) flow
- State parameter validation
- CSRF protection
- Email verification required

### Session Management

**Session Storage:**
- HTTP-only cookies (no JavaScript access)
- Secure flag (HTTPS only)
- SameSite=Lax (CSRF protection)
- 30-day expiration with automatic refresh

**Session Refresh:**
```
Access Token: 1 hour TTL
Refresh Token: 30 days TTL
Auto-refresh: 5 minutes before expiry
```

**Concurrent Sessions:**
- Multiple sessions allowed per user
- Session listing and revocation available
- Device fingerprinting for anomaly detection

---

## Authorization (Row Level Security)

### RLS Policy Architecture

All database tables have Row Level Security enabled with principle of least privilege:

```sql
-- Example: Profiles table policies
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE USING (auth.uid() = id);
```

### Policy Categories

#### 1. Public Read Access

**Tables:** `profiles`, `challenges`, `solves`, `products`, `prices`

```sql
-- Challenges: Only published challenges visible
CREATE POLICY "Published challenges are viewable by everyone" 
ON public.challenges FOR SELECT USING (state = 'published');
```

#### 2. Owner-Only Access

**Tables:** `api_tokens`, `submissions`, `container_instances`

```sql
-- Submissions: Users only see their own
CREATE POLICY "Users can view their own submissions" 
ON public.submissions FOR SELECT USING (auth.uid() = user_id);
```

#### 3. Team-Based Access

**Tables:** `team_members`, `team_invitations`

```sql
-- Team members visible to team members
CREATE POLICY "Team members visible to team" 
ON public.team_members FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.team_members tm 
        WHERE tm.team_id = team_members.team_id 
        AND tm.user_id = auth.uid()
    )
);
```

#### 4. Role-Based Access

**Tables:** `teams` (modification)

Implemented via application logic with RLS:
- Only `captain` can modify team settings
- Only `captain` can generate invite codes
- Only `captain` can remove members

### Bypass Patterns

**Admin Operations:**
```typescript
// Use service role key for admin operations
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
)

// Bypasses RLS for trusted operations
await supabaseAdmin.from('teams').update({ ... })
```

**Security Definer Functions:**
```sql
-- Functions run with definer privileges
CREATE FUNCTION verify_flag(...) 
RETURNS BOOLEAN 
LANGUAGE plpgsql 
SECURITY DEFINER;  -- Runs as table owner
```

---

## Data Encryption

### At Rest

**Database:**
- AES-256 encryption for database storage
- Automated backups encrypted
- Snapshots encrypted

**File Storage:**
- Supabase Storage uses AES-256
- Object-level encryption keys
- Encrypted at rest in S3-compatible storage

### In Transit

**TLS Configuration:**
- TLS 1.3 preferred, TLS 1.2 minimum
- HSTS (HTTP Strict Transport Security)
- Certificate pinning for API calls

**Headers:**
```http
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
```

### Field-Level Encryption

**Sensitive Fields:**

| Field | Encryption | Method |
|-------|------------|--------|
| `api_tokens.token_hash` | SHA-256 | One-way hash |
| `challenge_flags.flag_hash` | SHA-256 | One-way hash |
| `submissions.input_payload` | Plaintext/Redacted | Redacted if incorrect |
| `licenses.key_hash` | SHA-256 | One-way hash |

**Flag Security:**
```typescript
// Flags are never stored in plaintext
async function sha256(message: string): Promise<string> {
    const msgBuffer = new TextEncoder().encode(message)
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}
```

---

## Input Validation and Sanitization

### Server-Side Validation

**Framework:** Zod schema validation

```typescript
import { z } from 'zod'

const challengeSchema = z.object({
    title: z.string().min(1).max(255),
    description: z.string().max(10000),
    difficulty: z.enum(['easy', 'medium', 'hard', 'insane']),
    initial_points: z.number().int().min(10).max(10000)
})

// Validation
const result = challengeSchema.safeParse(input)
if (!result.success) {
    return { error: 'Invalid input', details: result.error.issues }
}
```

### XSS Prevention

**React Protection:**
- Automatic escaping of JSX content
- DangerouslySetInnerHTML only used with DOMPurify

**Markdown Rendering:**
```typescript
import rehypeSanitize from 'rehype-sanitize'
import ReactMarkdown from 'react-markdown'

<ReactMarkdown rehypePlugins={[rehypeSanitize]}>
    {challenge.description_markdown}
</ReactMarkdown>
```

**Content Security Policy:**
```http
Content-Security-Policy: 
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline' https://challenges.cloudflare.com;
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: https://*.supabase.co;
    connect-src 'self' https://*.supabase.co wss://*.supabase.co;
    frame-src https://challenges.cloudflare.com;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
```

### SQL Injection Prevention

**Parameterized Queries:**
```typescript
// Safe - uses parameterized query
const { data } = await supabase
    .from('challenges')
    .select('*')
    .eq('id', challengeId)  // Parameterized

// Never do this
const { data } = await supabase
    .rpc('unsafe_query', { sql: `SELECT * FROM challenges WHERE id = ${userInput}` })
```

**RLS as Defense:**
- Even if injection occurs, RLS limits data exposure
- Database functions use SECURITY DEFINER carefully

---

## CSRF Protection

### Cookie Security

```http
Set-Cookie: sb-access-token=xxx; 
    HttpOnly; 
    Secure; 
    SameSite=Lax; 
    Path=/; 
    Max-Age=3600
```

### Double Submit Cookie Pattern

Supabase Auth implements CSRF protection via:
1. State parameter in OAuth flows
2. PKCE code verifier
3. Session cookie binding

### Server Actions Protection

Next.js Server Actions include automatic CSRF protection:
- Origin validation
- Header checking
- Secure cookie requirements

---

## Security Headers

### Implemented Headers

| Header | Value | Purpose |
|--------|-------|---------|
| `Content-Security-Policy` | See above | XSS mitigation |
| `X-Frame-Options` | `DENY` | Clickjacking prevention |
| `X-Content-Type-Options` | `nosniff` | MIME sniffing protection |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Privacy protection |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` | Feature restriction |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains` | HTTPS enforcement |

### Next.js Configuration

```typescript
// next.config.ts
const nextConfig = {
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'Content-Security-Policy',
                        value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://challenges.cloudflare.com; ..."
                    },
                    { key: 'X-Frame-Options', value: 'DENY' },
                    { key: 'X-Content-Type-Options', value: 'nosniff' },
                    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
                    { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' }
                ]
            }
        ]
    }
}
```

---

## Rate Limiting

### Implementation

**Flag Submissions:**
```typescript
// Max 10 attempts per minute per challenge
const oneMinuteAgo = new Date(Date.now() - 60 * 1000).toISOString()
const { count } = await supabase
    .from('submissions')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('challenge_id', challengeId)
    .gte('created_at', oneMinuteAgo)

if (count && count >= 10) {
    return { error: 'Rate limit exceeded' }
}
```

**API Rate Limits:**

| Endpoint | Limit | Window |
|----------|-------|--------|
| Flag submission | 10 req | 1 minute |
| Login | 5 req | 15 minutes |
| Signup | 3 req | 1 hour |
| Password reset | 3 req | 1 hour |
| Team creation | 5 req | 1 hour |

### DDoS Protection

**Cloudflare (if using custom domain):**
- Automatic DDoS mitigation
- Rate limiting at edge
- Bot management

**Vercel (if deployed there):**
- Built-in DDoS protection
- Automatic traffic shaping
- Geographic distribution

---

## Audit Logging

### Logged Events

| Event Type | Data Captured | Severity |
|------------|---------------|----------|
| `user.login` | IP, user agent, method | info |
| `user.login_failed` | IP, reason | warning |
| `user.password_changed` | Actor ID | info |
| `user.mfa_enrolled` | Factor type | info |
| `challenge.solved` | Challenge ID, points | info |
| `flag.submitted` | Challenge ID, result | info |
| `team.created` | Team ID, name | info |
| `subscription.created` | Product ID | info |
| `subscription.canceled` | Reason | warning |
| `admin.user_deleted` | Target user | critical |

### Audit Log Schema

```typescript
interface AuditLog {
    id: string
    actor_id: string | null        // Who performed the action
    event_type: string             // Classification
    target_resource_id: string | null  // What was affected
    payload_diff: Json | null      // Before/after values
    ip_address: string | null      // Source IP
    severity: 'info' | 'warning' | 'critical'
    created_at: string
}
```

### Retention

- Active logs: 90 days in database
- Archived logs: 1 year in cold storage
- Critical events: 7 years (compliance)

---

## Secure Development Practices

### Code Review Checklist

- [ ] No secrets in code (use environment variables)
- [ ] Input validation on all user inputs
- [ ] Output encoding for dynamic content
- [ ] Proper error handling (no stack traces to users)
- [ ] RLS policies for new tables
- [ ] Rate limiting for new endpoints
- [ ] Audit logging for sensitive operations

### Dependency Management

```bash
# Check for vulnerabilities
npm audit

# Update dependencies
npm update

# Check outdated packages
npm outdated
```

**Security Scanning:**
- GitHub Dependabot alerts
- Snyk integration
- Weekly dependency reviews

### Secrets Management

**Environment Variables:**
```bash
# .env.local - Never commit!
SUPABASE_SECRET_KEY=sb_secret_xxx
POLAR_WEBHOOK_SECRET=polar_whs_xxx
TURNSTILE_SECRET_KEY=0x4xxx
```

**Rotation Schedule:**

| Secret | Rotation Frequency |
|--------|-------------------|
| API keys | Every 90 days |
| Webhook secrets | Every 180 days |
| Database password | Every 365 days |

---

## Vulnerability Disclosure

### Reporting Process

**Contact:** security@yourdomain.com

**Please include:**
1. Description of vulnerability
2. Steps to reproduce
3. Potential impact
4. Suggested fix (if known)

### Response Timeline

| Phase | Timeline | Action |
|-------|----------|--------|
| Acknowledgment | 24 hours | Confirm receipt |
| Assessment | 72 hours | Validate and prioritize |
| Fix Development | 1-4 weeks | Develop and test patch |
| Disclosure | Coordinated | Public announcement |

### Bug Bounty Program

**Scope:**
- Web application (ctf.yourdomain.com)
- API endpoints
- Authentication flows

**Out of Scope:**
- Third-party services (Supabase, Polar, etc.)
- Social engineering
- Physical attacks
- DDoS testing

**Rewards:**
| Severity | Bounty |
|----------|--------|
| Critical | $1,000+ |
| High | $500 |
| Medium | $200 |
| Low | $100 |

---

## Security Incident Response

### Severity Levels

| Level | Criteria | Examples |
|-------|----------|----------|
| P1 (Critical) | Data breach, system compromise | Unauthorized admin access, flag exposure |
| P2 (High) | Service degradation, partial breach | Rate limit bypass, privilege escalation |
| P3 (Medium) | Vulnerability with limited impact | XSS, CSRF |
| P4 (Low) | Minor issues | Information disclosure, best practice violations |

### Response Playbook

**1. Detection**
- Monitor: Sentry alerts, Supabase logs, user reports
- Verify: Confirm validity of report
- Classify: Assign severity level

**2. Containment**
- P1: Immediate service pause if needed
- P2: Disable affected feature
- P3/P4: Schedule fix

**3. Investigation**
- Identify root cause
- Determine scope of impact
- Preserve evidence

**4. Remediation**
- Develop fix
- Test fix
- Deploy to production

**5. Post-Incident**
- Document lessons learned
- Update security measures
- Public disclosure (if required)

---

## Compliance

### GDPR

**Data Subject Rights:**
- **Right to access**: Export user data endpoint
- **Right to erasure**: Account deletion feature
- **Right to portability**: Data export in JSON format
- **Right to rectification**: Profile update functionality

**Data Processing:**
- Lawful basis: Legitimate interest + Consent
- DPA with Supabase in place
- Data retention policies enforced

### CCPA

**Consumer Rights:**
- Disclosure of data collection
- Opt-out of sale (not applicable - no data selling)
- Deletion requests
- Non-discrimination

**Privacy Policy:**
- Clear data usage explanation
- Third-party service disclosure
- Cookie usage details

---

## Security Testing

### Automated Testing

**SAST (Static Analysis):**
```bash
# ESLint security plugin
npm install eslint-plugin-security

# Configuration
{
    "plugins": ["security"],
    "extends": ["plugin:security/recommended"]
}
```

**Dependency Scanning:**
- GitHub Dependabot
- `npm audit` in CI/CD

### Penetration Testing

**Schedule:**
- Annual third-party penetration test
- Quarterly internal security review
- Continuous automated scanning

**Scope:**
- Authentication mechanisms
- Authorization controls
- Input validation
- Session management
- API security

---

## Related Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture
- [DATABASE.md](./DATABASE.md) - Database security policies
- [API.md](./API.md) - API security and authentication
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Secure deployment practices
