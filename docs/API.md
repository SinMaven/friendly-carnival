# CTF Platform - API Documentation

## Overview

This document describes all API endpoints, Server Actions, and integration points for the CTF platform. The API is built using Next.js App Router features including Server Actions and API Routes.

**API Architecture:**
- **Server Actions**: Form mutations and data operations
- **API Routes**: Webhooks and external integrations
- **Authentication**: Supabase Auth with session cookies
- **Authorization**: Row Level Security (RLS) policies

---

## Server Actions

Server Actions are defined with the `'use server'` directive and handle form submissions and data mutations. They run on the server and can be called directly from Client Components.

### Authentication Actions

#### `signup()`

Registers a new user account with email verification and CAPTCHA protection.

**File:** `app/signup/actions.ts`

```typescript
export async function signup(
    _prevState: unknown,
    formData: FormData
): Promise<{ error: string | null; success: boolean; email: string | null; }>
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `email` | string | Yes | User's email address |
| `password` | string | Yes | User's password (min 8 characters) |
| `captchaToken` | string | Yes | Turnstile verification token |

**Returns:**

| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | Whether signup succeeded |
| `email` | string \| null | Email on success, null on error |
| `error` | string \| null | Error message if failed |

**Example Usage:**

```typescript
'use client'
import { useActionState } from 'react'
import { signup } from './actions'

function SignupForm() {
    const [state, formAction, pending] = useActionState(signup, {
        error: null,
        success: false,
        email: null
    })

    return (
        <form action={formAction}>
            <input name="email" type="email" required />
            <input name="password" type="password" required />
            <Turnstile onVerify={(token) => {
                document.getElementById('captchaToken').value = token
            }} />
            <input type="hidden" name="captchaToken" id="captchaToken" />
            <button type="submit" disabled={pending}>
                {pending ? 'Creating account...' : 'Sign up'}
            </button>
            {state.error && <p className="error">{state.error}</p>}
            {state.success && <p>Check your email to confirm!</p>}
        </form>
    )
}
```

**Errors:**
- `"Email and password are required"` - Missing fields
- `"This email is already registered"` - Duplicate account
- Captcha verification failures

---

### MFA (Multi-Factor Authentication) Actions

#### `enrollMFA()`

Initiates MFA enrollment for the current user using TOTP.

**File:** `features/account/actions/mfa.ts`

```typescript
export async function enrollMFA(): Promise<{ 
    error?: string; 
    data?: { 
        id: string; 
        type: 'totp';
        totp: { 
            uri: string; 
            secret: string; 
        }; 
    } 
}>
```

**Returns:**
- `data.totp.uri` - TOTP URI for QR code generation
- `data.totp.secret` - Secret key for manual entry
- `data.id` - Factor ID for verification

**Example Usage:**

```typescript
const result = await enrollMFA()
if (result.data) {
    // Display QR code using result.data.totp.uri
    // Show secret for manual entry: result.data.totp.secret
}
```

---

#### `verifyMFA(factorId, code)`

Verifies and activates an MFA factor after user has set up their authenticator.

```typescript
export async function verifyMFA(
    factorId: string, 
    code: string
): Promise<{ error?: string; success?: boolean }>
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `factorId` | string | Factor ID from `enrollMFA()` |
| `code` | string | 6-digit TOTP code from authenticator |

---

#### `unenrollMFA(factorId)`

Removes an MFA factor from the user's account.

```typescript
export async function unenrollMFA(
    factorId: string
): Promise<{ error?: string; success?: boolean }>
```

---

#### `getMFAFactors()`

Lists all MFA factors for the current user.

```typescript
export async function getMFAFactors(): Promise<{
    error?: string;
    data?: {
        all: Factor[];
        totp: Factor[];
    }
}>
```

---

### Challenge Actions

#### `submitFlag(challengeId, flag)`

Submits a flag for verification and awards points if correct.

**File:** `features/challenges/actions/submit-flag.ts`

```typescript
export type SubmitFlagResult = {
    success: boolean;
    message: string;
    points_awarded?: number;
    is_first_blood?: boolean;
    already_solved?: boolean;
};

export async function submitFlag(
    challengeId: string,
    flag: string
): Promise<SubmitFlagResult>
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `challengeId` | string | UUID of the challenge |
| `flag` | string | Submitted flag value |

**Rate Limiting:**
- Maximum 10 submissions per minute per challenge
- Returns `"Too many attempts. Please wait a minute before trying again."`

**Returns:**

| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | Whether flag was correct |
| `message` | string | User-facing result message |
| `points_awarded` | number | Points earned (if correct) |
| `is_first_blood` | boolean | First solver achievement |
| `already_solved` | boolean | User previously solved this |

**Example Usage:**

```typescript
'use client'
import { submitFlag } from '@/features/challenges/actions/submit-flag'

function FlagSubmitForm({ challengeId }: { challengeId: string }) {
    const [result, setResult] = useState<SubmitFlagResult | null>(null)

    async function handleSubmit(formData: FormData) {
        const flag = formData.get('flag') as string
        const result = await submitFlag(challengeId, flag)
        setResult(result)
    }

    return (
        <form action={handleSubmit}>
            <input name="flag" placeholder="CTF{...}" required />
            <button type="submit">Submit Flag</button>
            {result && (
                <div className={result.success ? 'success' : 'error'}>
                    {result.message}
                    {result.is_first_blood && '🩸 FIRST BLOOD!'}
                </div>
            )}
        </form>
    )
}
```

---

#### `startInstance(challengeId)`

Provisions a container instance for a challenge.

**File:** `features/challenges/actions/start-instance.ts`

```typescript
export async function startInstance(
    challengeId: string
): Promise<{
    success: boolean;
    message: string;
    instance?: {
        id: string;
        status: string;
        connection_info: {
            host: string;
            port: number;
        };
        expires_at: string;
    }
}>
```

---

#### `stopInstance(instanceId)`

Terminates a running container instance.

```typescript
export async function stopInstance(
    instanceId: string
): Promise<{
    success: boolean;
    message: string;
}>
```

---

### Team Management Actions

#### `createTeam(name)`

Creates a new team with the current user as captain.

**File:** `features/teams/actions/team-management.ts`

```typescript
export type TeamActionResult<T = unknown> = {
    success: boolean;
    message: string;
    data?: T;
};

export async function createTeam(
    name: string
): Promise<TeamActionResult>
```

**Validation:**
- User must not already be in a team
- Team name must be unique
- Slug auto-generated from name

---

#### `joinTeam(inviteCode)`

Joins a team using an invite code.

```typescript
export async function joinTeam(
    inviteCode: string
): Promise<TeamActionResult>
```

**Invite Code Validation:**
- Code must exist and not be expired
- Must not exceed max uses
- User must not already be in a team

---

#### `leaveTeam()`

Removes the current user from their team.

```typescript
export async function leaveTeam(): Promise<TeamActionResult>
```

**Restrictions:**
- Team captains cannot leave (must transfer ownership first)

---

#### `generateInviteCode(teamId, options?)`

Generates a new invite code for the team.

```typescript
export async function generateInviteCode(
    teamId: string,
    options?: { 
        expiresInHours?: number; 
        maxUses?: number 
    }
): Promise<TeamActionResult<{ code: string }>>
```

**Permissions:**
- Only team captain can generate invite codes

---

#### `updateTeamName(teamId, name)`

Updates the team's display name.

```typescript
export async function updateTeamName(
    teamId: string, 
    name: string
): Promise<TeamActionResult>
```

---

#### `deleteTeam(teamId)`

Permanently deletes a team and all associated data.

```typescript
export async function deleteTeam(
    teamId: string
): Promise<TeamActionResult>
```

**Permissions:**
- Only team captain can delete
- Cascades to members and invitations

---

#### `removeMember(memberId, teamId)`

Removes a member from the team.

```typescript
export async function removeMember(
    memberId: string, 
    teamId: string
): Promise<TeamActionResult>
```

**Restrictions:**
- Cannot remove the captain
- Only captain can remove members

---

#### `transferOwnership(memberId, teamId)`

Transfers team captaincy to another member.

```typescript
export async function transferOwnership(
    memberId: string, 
    teamId: string
): Promise<TeamActionResult>
```

**Process:**
1. Verify current user is captain
2. Verify target member exists in team
3. Update `teams.captain_id`
4. Update roles in `team_members`

---

### Account Management Actions

#### `updateProfile(formData)`

Updates the current user's profile information.

**File:** `features/account/actions/update-profile.ts`

```typescript
export async function updateProfile(
    formData: FormData
): Promise<{ success: boolean; error?: string }>
```

**Fields:**
- `username` - Unique username
- `full_name` - Display name
- `bio` - Biography text
- `website` - Personal website URL
- `github_handle` - GitHub username

---

#### `updateSettings(formData)`

Updates user preferences.

**File:** `features/account/actions/update-settings.ts`

```typescript
export async function updateSettings(
    formData: FormData
): Promise<{ success: boolean; error?: string }>
```

**Fields:**
- `theme_preference` - `light`, `dark`, or `system`
- `email_notifications` - Boolean

---

#### `changePassword(formData)`

Changes the user's password.

**File:** `features/account/actions/change-password.ts`

```typescript
export async function changePassword(
    formData: FormData
): Promise<{ success: boolean; error?: string }>
```

**Fields:**
- `current_password` - Current password for verification
- `new_password` - New password (min 8 characters)
- `confirm_password` - Must match new password

---

#### `deleteAccount()`

Permanently deletes the user's account and all data.

**File:** `features/account/actions/delete-account.ts`

```typescript
export async function deleteAccount(): Promise<{
    success: boolean;
    error?: string;
}>
```

**Safety Measures:**
- Requires re-authentication
- Soft delete initially (30-day grace period)
- Cascades to all user data

---

#### `uploadAvatar(formData)`

Uploads a new avatar image.

**File:** `features/account/actions/upload-avatar.ts`

```typescript
export async function uploadAvatar(
    formData: FormData
): Promise<{
    success: boolean;
    avatarUrl?: string;
    error?: string;
}>
```

**Validation:**
- Max file size: 5MB
- Allowed types: `image/jpeg`, `image/png`, `image/webp`
- Auto-resized to 400x400px

---

### Audit Logging

#### `logAuditEvent(event)`

Records an audit event to the database.

**File:** `lib/audit.ts`

```typescript
export async function logAuditEvent(event: {
    event_type: string;
    actor_id?: string;
    target_resource_id?: string;
    payload_diff?: any;
    severity?: 'info' | 'warning' | 'critical';
    ip_address?: string;
}): Promise<void>
```

**Usage:**
```typescript
await logAuditEvent({
    event_type: 'user.password_changed',
    actor_id: userId,
    severity: 'info',
    ip_address: requestIp
})
```

---

## API Routes

### Checkout Endpoints

#### `GET /api/checkout`

Initiates a Polar.sh checkout session for subscription purchase.

**File:** `app/api/checkout/route.ts`

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `products` | string | Yes | Product ID from Polar |
| `customerEmail` | string | No | Pre-fill customer email |
| `customerName` | string | No | Pre-fill customer name |
| `metadata` | JSON | No | Additional metadata (auto-injected with `user_id`) |

**Behavior:**
- If user is logged in, `user_id` is injected into metadata
- Redirects to Polar.sh hosted checkout
- On success, redirects to `/dashboard/subscription?success=true`
- On cancel, redirects to `/pricing`

**Example:**
```bash
curl "https://yourdomain.com/api/checkout?products=prod_xxx&customerEmail=user@example.com"
```

---

#### `GET /api/customer-portal`

Redirects to Polar.sh customer portal for subscription management.

**File:** `app/api/customer-portal/route.ts`

**Behavior:**
- Requires authenticated user
- Looks up user's `polar_customer_id`
- Generates portal session URL
- Redirects to Polar customer portal

---

### Webhook Endpoints

#### `POST /api/webhooks/polar`

Handles Polar.sh webhook events for subscription lifecycle.

**File:** `app/api/webhooks/polar/route.ts`

**Security:**
- Validates webhook signature using `POLAR_WEBHOOK_SECRET`
- Returns 401 for invalid signatures
- Returns 200 for successful processing

**Handled Events:**

| Event | Action |
|-------|--------|
| `subscription.created` | Creates subscription record |
| `subscription.active` | Activates subscription |
| `subscription.updated` | Updates plan/period/status |
| `subscription.canceled` | Marks subscription canceled |
| `subscription.revoked` | Marks subscription revoked |
| `order.paid` | Handles one-time purchases |

**Payload Structure:**
```typescript
interface WebhookPayload {
    type: string;
    data: {
        id: string;
        productId: string;
        customerId: string;
        status: string;
        currentPeriodStart: string;
        currentPeriodEnd: string;
        metadata?: {
            user_id?: string;
        };
    };
}
```

---

### Authentication Routes

#### `GET /auth/callback`

Handles OAuth callbacks and email confirmation redirects.

**File:** `app/auth/callback/route.ts`

**Supported Flows:**
- Email confirmation
- OAuth sign-in (GitHub, Google, etc.)
- Password reset completion

**Query Parameters:**
- `code` - Authorization code
- `next` - Redirect path after success

---

#### `GET /auth/signout`

Signs out the current user and clears session.

**File:** `app/auth/signout/route.ts`

**Behavior:**
- Calls `supabase.auth.signOut()`
- Clears session cookies
- Redirects to `/login`

---

## Error Handling

### Error Response Format

All Server Actions return a consistent error format:

```typescript
interface ActionError {
    error: string;        // Human-readable error message
    success: false;       // Always false on error
}
```

### Common Error Codes

| Error | Description | Resolution |
|-------|-------------|------------|
| `Unauthorized` | User not authenticated | Sign in and retry |
| `Forbidden` | Insufficient permissions | Check role/ownership |
| `Not Found` | Resource doesn't exist | Verify ID/identifier |
| `Conflict` | Resource already exists | Use unique values |
| `Rate Limited` | Too many requests | Wait before retrying |
| `Validation Error` | Invalid input data | Check field requirements |

### Error Handling Pattern

```typescript
'use client'
import { useActionState } from 'react'

function MyForm() {
    const [state, formAction, pending] = useActionState(myAction, {
        error: null,
        success: false
    })

    return (
        <form action={formAction}>
            {/* form fields */}
            {state.error && (
                <div className="error" role="alert">
                    {state.error}
                </div>
            )}
            {state.success && (
                <div className="success" role="status">
                    Success!
                </div>
            )}
        </form>
    )
}
```

---

## Rate Limiting

### Implemented Limits

| Action | Limit | Window |
|--------|-------|--------|
| Flag submissions | 10 attempts | 1 minute per challenge |
| Login attempts | 5 attempts | 15 minutes (Supabase) |
| Signup attempts | 3 attempts | 1 hour per IP |
| API token requests | 100 requests | 1 minute |

### Rate Limit Response

```typescript
{
    success: false,
    message: 'Too many attempts. Please wait a minute before trying again.'
}
```

---

## Authentication

### Session Management

Sessions are managed via HTTP-only cookies set by Supabase SSR:

```typescript
// Server-side session check
import { createSupabaseServerClient } from '@/lib/supabase/server'

const supabase = await createSupabaseServerClient()
const { data: { user } } = await supabase.auth.getUser()

if (!user) {
    return { error: 'Unauthorized' }
}
```

### Protected Actions

All sensitive actions should verify authentication:

```typescript
'use server'

export async function protectedAction() {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
        return { error: 'Unauthorized', success: false }
    }
    
    // Proceed with action...
}
```

### MFA Requirements

For actions requiring MFA (AAL2):

```typescript
const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()

if (aal?.currentLevel !== 'aal2') {
    return { error: 'MFA required', requiresMFA: true }
}
```

---

## Type Definitions

### Core Types

```typescript
// Enums
export type ChallengeDifficulty = 'easy' | 'medium' | 'hard' | 'insane'
export type ChallengeState = 'draft' | 'published' | 'deprecated'
export type DecayFunction = 'logarithmic' | 'linear'
export type UserRole = 'owner' | 'admin' | 'member'
export type SubscriptionStatus = 'active' | 'canceled' | 'revoked' | 'expired'

// Challenge
export interface Challenge {
    id: string
    slug: string
    title: string
    description_markdown: string
    difficulty: ChallengeDifficulty
    state: ChallengeState
    tier: 'free' | 'pro' | 'elite'
    current_points: number
    initial_points: number
    min_points: number
    solve_count: number
    requires_container: boolean
    tags: Tag[]
    assets: ChallengeAsset[]
}

// User Profile
export interface Profile {
    id: string
    username: string
    full_name: string | null
    avatar_url: string | null
    bio: string | null
    total_points: number
    total_solves: number
    rank: number | null
    mfa_enabled: boolean
}

// Team
export interface Team {
    id: string
    name: string
    slug: string
    captain_id: string
    is_verified: boolean
    members: TeamMember[]
}

export interface TeamMember {
    user_id: string
    role: UserRole
    joined_at: string
    profile: Profile
}

// Solve
export interface Solve {
    id: string
    challenge_id: string
    user_id: string
    points_awarded: number
    is_first_blood: boolean
    solved_at: string
    challenge: Challenge
}

// Subscription
export interface Subscription {
    id: string
    status: SubscriptionStatus
    current_period_end: string
    cancel_at_period_end: boolean
    price: Price
    product: Product
}
```

---

## Webhook Integration Guide

### Receiving Webhooks

1. Configure webhook URL in external service dashboard
2. Verify webhook signatures
3. Process events idempotently
4. Return 200 for success, 4xx/5xx for errors

### Idempotency

All webhook handlers should be idempotent:

```typescript
// Check if already processed
const { data: existing } = await supabase
    .from('subscriptions')
    .select('id')
    .eq('polar_subscription_id', payload.data.id)
    .maybeSingle()

if (existing) {
    // Update instead of insert
    await supabase
        .from('subscriptions')
        .update({ ... })
        .eq('id', existing.id)
} else {
    // Insert new record
    await supabase
        .from('subscriptions')
        .insert({ ... })
}
```

### Webhook Security

```typescript
import { Webhooks } from '@polar-sh/supabase'

export const POST = Webhooks({
    webhookSecret: process.env.POLAR_WEBHOOK_SECRET!,
    onSubscriptionCreated: async (payload) => {
        // Validate payload
        if (!payload.data.customer?.email) {
            console.error('Missing customer email')
            return
        }
        // Process event...
    }
})
```

---

## Best Practices

### Server Actions

1. **Always validate input** using Zod or similar
2. **Check authentication** before processing
3. **Return clear error messages**
4. **Use transactions** for multi-step operations
5. **Revalidate cache** after mutations

```typescript
'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const schema = z.object({
    name: z.string().min(1).max(100)
})

export async function createTeam(formData: FormData) {
    // 1. Validate
    const data = schema.parse({
        name: formData.get('name')
    })
    
    // 2. Auth check
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }
    
    // 3. Execute
    const { error } = await supabase
        .from('teams')
        .insert({ name: data.name, captain_id: user.id })
    
    if (error) return { error: error.message }
    
    // 4. Revalidate
    revalidatePath('/dashboard/teams')
    
    return { success: true }
}
```

### API Routes

1. **Validate method** (GET/POST/etc.)
2. **Parse and validate body/query**
3. **Handle errors gracefully**
4. **Return appropriate status codes**
5. **Add CORS headers** if needed

---

## Related Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture
- [DATABASE.md](./DATABASE.md) - Database schema
- [SECURITY.md](./SECURITY.md) - Security practices
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment guide
