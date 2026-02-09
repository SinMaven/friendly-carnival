# CTF Platform - Database Architecture

## Overview

The CTF platform uses **PostgreSQL** via **Supabase** as its primary data store. The database is designed with security, scalability, and auditability in mind, featuring 19 interconnected tables covering user management, challenges, teams, submissions, and billing.

**Key Features:**
- Row Level Security (RLS) on all tables
- Database functions for business logic
- Triggers for automated scoring updates
- Comprehensive audit logging
- Soft delete patterns
- Dynamic scoring algorithms

---

## Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              ENTITY RELATIONSHIPS                                │
└─────────────────────────────────────────────────────────────────────────────────┘

    ┌─────────────┐         ┌─────────────────┐         ┌─────────────┐
    │   auth.users│◀────────│    profiles     │────────▶│  api_tokens │
    │  (Supabase) │    1:1  │   (Extended)    │    1:N  │             │
    └─────────────┘         └────────┬────────┘         └─────────────┘
                                     │
                    ┌────────────────┼────────────────┐
                    │                │                │
                    ▼                ▼                ▼
            ┌─────────────┐   ┌─────────────┐   ┌─────────────┐
            │   teams     │   │   solves    │   │subscriptions│
            │  (captain)  │   │  (points)   │   │  (billing)  │
            └──────┬──────┘   └──────┬──────┘   └──────┬──────┘
                   │                 │                 │
                   ▼                 ▼                 ▼
            ┌─────────────┐   ┌─────────────┐   ┌─────────────┐
            │team_members │   │ submissions │   │   prices    │
            │   (role)    │   │  (attempts) │   │             │
            └─────────────┘   └─────────────┘   └──────┬──────┘
                                                       │
                                              ┌────────┴────────┐
                                              │    products     │
                                              │   (metadata)    │
                                              └─────────────────┘

    ┌────────────────────────────────────────────────────────────────┐
    │                        CHALLENGES                               │
    ├────────────────────────────────────────────────────────────────┤
    │                                                                 │
    │   ┌─────────────┐      ┌─────────────┐      ┌─────────────┐   │
    │   │  challenges │◀────▶│challenge_tags│◀────▶│    tags     │   │
    │   │  (scoring)  │      │  (junction) │      │  (category) │   │
    │   └──────┬──────┘      └─────────────┘      └─────────────┘   │
    │          │                                                     │
    │          ├──▶ challenge_flags (hashed flags)                   │
    │          ├──▶ challenge_assets (files)                         │
    │          └──▶ container_instances (runtime)                    │
    │                                                                 │
    └────────────────────────────────────────────────────────────────┘

    ┌─────────────┐         ┌─────────────┐         ┌─────────────┐
    │   teams     │◀────────│ team_invites│         │ audit_logs  │
    │             │         │   (codes)   │         │  (history)  │
    └─────────────┘         └─────────────┘         └─────────────┘

    ┌─────────────┐         ┌─────────────┐
    │   licenses  │         │  customers  │
    │  (enterprise)│        │  (billing)  │
    └─────────────┘         └─────────────┘
```

---

## Table Descriptions

### 1. `profiles` - User Profiles

Extends Supabase `auth.users` with application-specific user data.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key, references `auth.users(id)` |
| `username` | VARCHAR(50) | Unique username, required |
| `full_name` | VARCHAR(255) | Display name |
| `avatar_url` | TEXT | Profile picture URL (Supabase Storage) |
| `bio` | TEXT | User biography |
| `website` | VARCHAR(255) | Personal website |
| `github_handle` | VARCHAR(50) | GitHub username |
| `mfa_enabled` | BOOLEAN | Whether MFA is enrolled |
| `theme_preference` | VARCHAR(20) | UI theme preference |
| `total_points` | INT | Cumulative points earned |
| `total_solves` | INT | Total challenges solved |
| `rank` | INT | Global leaderboard position |
| `last_solve_at` | TIMESTAMPTZ | Timestamp of most recent solve |
| `created_at` | TIMESTAMPTZ | Account creation time |
| `updated_at` | TIMESTAMPTZ | Last profile update |
| `deleted_at` | TIMESTAMPTZ | Soft delete timestamp |

**Indexes:**
- Primary: `id`
- Unique: `username`
- Performance: `total_points DESC, last_solve_at ASC` (for leaderboards)

---

### 2. `api_tokens` - API Authentication Tokens

Stores hashed API tokens for programmatic access.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `user_id` | UUID | Token owner |
| `name` | VARCHAR(100) | Human-readable token name |
| `token_hash` | VARCHAR(64) | SHA-256 hash of the token |
| `scopes` | JSONB | Permission scopes (array) |
| `last_used_at` | TIMESTAMPTZ | Last API usage |
| `expires_at` | TIMESTAMPTZ | Token expiration |
| `created_at` | TIMESTAMPTZ | Token creation |

**Indexes:**
- Primary: `id`
- Unique: `token_hash`
- Foreign Key: `user_id` → `profiles(id)`

---

### 3. `teams` - Competition Teams

Team entity for collaborative competition.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `name` | VARCHAR(100) | Team name |
| `slug` | VARCHAR(100) | URL-friendly identifier |
| `avatar_url` | TEXT | Team logo URL |
| `captain_id` | UUID | Team owner/captain |
| `is_verified` | BOOLEAN | Verified team badge |
| `created_at` | TIMESTAMPTZ | Team creation |
| `updated_at` | TIMESTAMPTZ | Last update |

**Indexes:**
- Primary: `id`
- Unique: `slug`
- Foreign Key: `captain_id` → `profiles(id)`

---

### 4. `team_members` - Team Membership

Junction table linking users to teams with roles.

| Column | Type | Description |
|--------|------|-------------|
| `team_id` | UUID | Team reference |
| `user_id` | UUID | Member reference |
| `role` | user_role | Enum: `owner`, `admin`, `member` |
| `joined_at` | TIMESTAMPTZ | Membership start |

**Indexes:**
- Primary: `(team_id, user_id)`
- Foreign Keys: `team_id` → `teams(id)`, `user_id` → `profiles(id)`

---

### 5. `team_invitations` - Team Invite Codes

Manages team invitation tokens.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `team_id` | UUID | Inviting team |
| `email` | TEXT | Invited email (optional) |
| `role` | user_role | Role to assign on join |
| `token` | TEXT | Unique invitation token |
| `created_at` | TIMESTAMPTZ | Invitation creation |
| `expires_at` | TIMESTAMPTZ | Token expiration |

**Indexes:**
- Primary: `id`
- Unique: `token`
- Foreign Key: `team_id` → `teams(id)`

---

### 6. `tags` - Challenge Categories

Categorization labels for challenges.

| Column | Type | Description |
|--------|------|-------------|
| `id` | SERIAL | Auto-increment primary key |
| `name` | VARCHAR(50) | Display name |
| `slug` | VARCHAR(50) | URL-friendly identifier |
| `color_hex` | VARCHAR(7) | Category color (e.g., `#3b82f6`) |
| `created_at` | TIMESTAMPTZ | Creation timestamp |

**Indexes:**
- Primary: `id`
- Unique: `name`, `slug`

---

### 7. `challenges` - CTF Challenges

Core challenge entity with dynamic scoring.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `slug` | VARCHAR(100) | URL-friendly identifier |
| `title` | VARCHAR(255) | Challenge name |
| `description_markdown` | TEXT | Challenge description (Markdown) |
| `difficulty` | challenge_difficulty | Enum: `easy`, `medium`, `hard`, `insane` |
| `state` | challenge_state | Enum: `draft`, `published`, `deprecated` |
| `tier` | VARCHAR(20) | Access tier: `free`, `pro`, `elite` |
| `author_id` | UUID | Challenge creator |
| `is_dynamic_scoring` | BOOLEAN | Enable point decay |
| `initial_points` | INT | Starting point value |
| `min_points` | INT | Minimum point floor |
| `decay_function` | decay_function | Enum: `logarithmic`, `linear` |
| `current_points` | INT | Current point value (auto-updated) |
| `requires_container` | BOOLEAN | Needs container instance |
| `container_image_ref` | VARCHAR(255) | Docker image reference |
| `solve_count` | INT | Total solves |
| `created_at` | TIMESTAMPTZ | Creation time |
| `updated_at` | TIMESTAMPTZ | Last update |

**Indexes:**
- Primary: `id`
- Unique: `slug`
- Foreign Key: `author_id` → `profiles(id)`
- Performance: `state`, `difficulty`, `tier`

---

### 8. `challenge_tags` - Challenge Categorization

Many-to-many junction for challenges and tags.

| Column | Type | Description |
|--------|------|-------------|
| `challenge_id` | UUID | Challenge reference |
| `tag_id` | INT | Tag reference |

**Indexes:**
- Primary: `(challenge_id, tag_id)`
- Foreign Keys: `challenge_id` → `challenges(id)`, `tag_id` → `tags(id)`

---

### 9. `challenge_flags` - Flag Storage

Securely stores challenge flags (hashed).

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `challenge_id` | UUID | Challenge reference |
| `flag_hash` | VARCHAR(128) | SHA-256 hash of the flag |
| `flag_format` | VARCHAR(20) | Format hint (e.g., `CTF{...}`) |
| `is_case_sensitive` | BOOLEAN | Case sensitivity for matching |
| `created_at` | TIMESTAMPTZ | Creation time |

**Indexes:**
- Primary: `id`
- Foreign Key: `challenge_id` → `challenges(id)`
- Performance: `challenge_id, flag_hash` (composite for verification)

---

### 10. `challenge_assets` - Challenge Files

Downloadable files associated with challenges.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `challenge_id` | UUID | Challenge reference |
| `storage_path` | TEXT | Supabase Storage path |
| `filename` | VARCHAR(255) | Original filename |
| `file_hash` | VARCHAR(64) | SHA-256 for integrity |
| `file_size_bytes` | BIGINT | File size |
| `download_count` | INT | Download counter |
| `created_at` | TIMESTAMPTZ | Upload time |

**Indexes:**
- Primary: `id`
- Foreign Key: `challenge_id` → `challenges(id)`

---

### 11. `submissions` - Flag Submission Attempts

Audit trail of all submission attempts.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `user_id` | UUID | Submitting user |
| `team_id` | UUID | Team context (optional) |
| `challenge_id` | UUID | Target challenge |
| `input_payload` | TEXT | Submitted flag (redacted if wrong) |
| `is_correct` | BOOLEAN | Whether flag was correct |
| `ip_address` | INET | Submitting IP |
| `user_agent` | TEXT | Client user agent |
| `execution_time_ms` | INT | Processing time |
| `created_at` | TIMESTAMPTZ | Submission time |

**Indexes:**
- Primary: `id`
- Foreign Keys: `user_id` → `profiles(id)`, `team_id` → `teams(id)`, `challenge_id` → `challenges(id)`
- Performance: `user_id, challenge_id, created_at` (for rate limiting)

---

### 12. `solves` - Successful Solves

Records of correctly solved challenges with points awarded.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `user_id` | UUID | Solver |
| `team_id` | UUID | Team context (optional) |
| `challenge_id` | UUID | Solved challenge |
| `points_awarded` | INT | Points at solve time |
| `is_first_blood` | BOOLEAN | First solver bonus |
| `solved_at` | TIMESTAMPTZ | Solve timestamp |

**Indexes:**
- Primary: `id`
- Unique: `(user_id, challenge_id)` - Prevents duplicate solves
- Foreign Keys: `user_id` → `profiles(id)`, `team_id` → `teams(id)`, `challenge_id` → `challenges(id)`

---

### 13. `container_instances` - Active Challenge Containers

Tracks running container instances for dynamic challenges.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `user_id` | UUID | Instance owner |
| `challenge_id` | UUID | Challenge reference |
| `provider_task_id` | VARCHAR(255) | External orchestrator ID |
| `status` | VARCHAR(50) | `provisioning`, `running`, `stopped`, `error` |
| `connection_info` | JSONB | Host, port, credentials |
| `expires_at` | TIMESTAMPTZ | Auto-termination time |
| `created_at` | TIMESTAMPTZ | Creation time |

**Indexes:**
- Primary: `id`
- Foreign Keys: `user_id` → `profiles(id)`, `challenge_id` → `challenges(id)`
- Performance: `user_id` (list user's instances), `expires_at` (cleanup jobs)

---

### 14. `audit_logs` - Security Audit Trail

Comprehensive audit logging for compliance.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `actor_id` | UUID | User who performed action |
| `event_type` | VARCHAR(100) | Event classification |
| `target_resource_id` | UUID | Affected resource |
| `payload_diff` | JSONB | Before/after values |
| `ip_address` | INET | Source IP |
| `severity` | VARCHAR(20) | `info`, `warning`, `critical` |
| `created_at` | TIMESTAMPTZ | Event timestamp |

**Indexes:**
- Primary: `id`
- Foreign Key: `actor_id` → `profiles(id)`
- Performance: `event_type`, `created_at`, `severity`

---

### 15. `customers` - Billing Customers

Links users to payment provider customer records.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key, references `profiles(id)` |
| `stripe_customer_id` | TEXT | Legacy Stripe ID (if migrated) |

**Indexes:**
- Primary: `id`
- Foreign Key: `id` → `profiles(id)`

---

### 16. `products` - Subscription Products

Product catalog synced from Polar.sh.

| Column | Type | Description |
|--------|------|-------------|
| `id` | TEXT | Primary key (Polar product ID) |
| `active` | BOOLEAN | Whether product is available |
| `name` | TEXT | Product name |
| `description` | TEXT | Product description |
| `image` | TEXT | Product image URL |
| `metadata` | JSONB | Extended data (includes `polar_product_id`) |

**Indexes:**
- Primary: `id`

---

### 17. `prices` - Product Pricing Tiers

Pricing tiers for subscription products.

| Column | Type | Description |
|--------|------|-------------|
| `id` | TEXT | Primary key (Polar price ID) |
| `product_id` | TEXT | Parent product |
| `active` | BOOLEAN | Whether price is active |
| `description` | TEXT | Price description |
| `unit_amount` | BIGINT | Price in cents |
| `currency` | TEXT | ISO currency code |
| `type` | TEXT | `one_time` or `recurring` |
| `interval` | TEXT | `month`, `year` for recurring |
| `interval_count` | INT | Billing interval multiplier |
| `trial_period_days` | INT | Trial duration |
| `metadata` | JSONB | Extended data |

**Indexes:**
- Primary: `id`
- Foreign Key: `product_id` → `products(id)`

---

### 18. `subscriptions` - User Subscriptions

Active and historical subscription records.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `user_id` | UUID | Subscriber |
| `provider_id` | VARCHAR(255) | Legacy provider ID |
| `polar_subscription_id` | TEXT | Polar subscription ID |
| `polar_product_id` | TEXT | Polar product reference |
| `polar_customer_id` | TEXT | Polar customer reference |
| `status` | VARCHAR(50) | `active`, `canceled`, `revoked`, `expired` |
| `price_id` | TEXT | Reference to local price |
| `quantity` | INT | Seat count |
| `cancel_at_period_end` | BOOLEAN | Cancellation pending |
| `current_period_end` | TIMESTAMPTZ | Subscription renewal date |
| `created_at` | TIMESTAMPTZ | Subscription start |
| `updated_at` | TIMESTAMPTZ | Last update |

**Indexes:**
- Primary: `id`
- Unique: `polar_subscription_id`
- Foreign Keys: `user_id` → `profiles(id)`, `price_id` → `prices(id)`
- Performance: `user_id` (lookup user's subscription)

---

### 19. `licenses` - Enterprise License Keys

License key management for enterprise/organization access.

| Column | Type | Description |
|--------|------|-------------|
| `key_hash` | VARCHAR(64) | Primary key (SHA-256 of license key) |
| `owner_org_id` | UUID | Owning organization |
| `max_seats` | INT | Maximum users allowed |
| `expires_at` | TIMESTAMPTZ | License expiration |
| `created_at` | TIMESTAMPTZ | Creation time |

**Indexes:**
- Primary: `key_hash`
- Foreign Key: `owner_org_id` → `teams(id)`

---

## Relationships Summary

### One-to-One Relationships

| Parent | Child | Description |
|--------|-------|-------------|
| `auth.users` | `profiles` | Each auth user has one profile |
| `profiles` | `customers` | Each user has one customer record |
| `profiles` | `subscriptions` | One active subscription per user (enforced by app logic) |

### One-to-Many Relationships

| Parent | Child | Description |
|--------|-------|-------------|
| `profiles` | `api_tokens` | User can have multiple API tokens |
| `profiles` | `solves` | User can solve many challenges |
| `profiles` | `submissions` | User can make many submission attempts |
| `profiles` | `container_instances` | User can start multiple containers |
| `profiles` | `audit_logs` | User actions generate many audit entries |
| `teams` | `team_members` | Team can have multiple members |
| `teams` | `team_invitations` | Team can have multiple pending invites |
| `teams` | `solves` | Team can have many collective solves |
| `teams` | `submissions` | Team can have many collective submissions |
| `teams` | `licenses` | Team can have multiple licenses |
| `challenges` | `challenge_flags` | Challenge can have multiple flags |
| `challenges` | `challenge_assets` | Challenge can have multiple files |
| `challenges` | `solves` | Challenge can be solved many times |
| `challenges` | `submissions` | Challenge can have many attempts |
| `challenges` | `container_instances` | Challenge can have many running instances |
| `products` | `prices` | Product can have multiple pricing tiers |
| `products` | `subscriptions` | Product can have many subscribers |

### Many-to-Many Relationships

| Table A | Junction | Table B | Description |
|---------|----------|---------|-------------|
| `challenges` | `challenge_tags` | `tags` | Challenges can have multiple tags |
| `teams` | `team_members` | `profiles` | Users can be in multiple teams (though app enforces one) |

---

## Indexes and Performance

### Strategic Indexes

| Table | Index | Purpose |
|-------|-------|---------|
| `profiles` | `total_points DESC, last_solve_at ASC` | Leaderboard ranking (tie-breaker) |
| `profiles` | `username` | Fast username lookup |
| `challenges` | `state, difficulty, tier` | Filtered challenge browsing |
| `challenges` | `solve_count` | Dynamic scoring calculations |
| `solves` | `user_id, challenge_id` | Duplicate solve prevention |
| `solves` | `challenge_id, solved_at` | First blood detection |
| `submissions` | `user_id, challenge_id, created_at` | Rate limiting checks |
| `subscriptions` | `polar_subscription_id` | Webhook lookup |
| `subscriptions` | `user_id` | User subscription lookup |
| `container_instances` | `user_id` | List user's instances |
| `container_instances` | `expires_at` | Cleanup expired instances |
| `audit_logs` | `created_at` | Time-based audit queries |
| `audit_logs` | `event_type` | Event category queries |

### Query Optimization Examples

**Leaderboard Query:**
```sql
SELECT username, total_points, total_solves, avatar_url
FROM profiles
WHERE deleted_at IS NULL
ORDER BY total_points DESC, last_solve_at ASC
LIMIT 100;
```

**User's Solved Challenges:**
```sql
SELECT c.*, s.points_awarded, s.solved_at, s.is_first_blood
FROM solves s
JOIN challenges c ON s.challenge_id = c.id
WHERE s.user_id = $1
ORDER BY s.solved_at DESC;
```

**Challenge Statistics:**
```sql
SELECT 
    COUNT(*) FILTER (WHERE is_correct) as correct_count,
    COUNT(*) FILTER (WHERE NOT is_correct) as wrong_count
FROM submissions
WHERE challenge_id = $1
AND created_at > NOW() - INTERVAL '24 hours';
```

---

## Row Level Security (RLS) Policies

### Profiles Table

```sql
-- Anyone can view public profiles
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles FOR SELECT USING (true);

-- Users can only update their own profile
CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE USING (auth.uid() = id);
```

### Challenges Table

```sql
-- Only published challenges are visible
CREATE POLICY "Published challenges are viewable by everyone" 
ON public.challenges FOR SELECT USING (state = 'published');
```

### Submissions Table

```sql
-- Users can only view their own submissions
CREATE POLICY "Users can view their own submissions" 
ON public.submissions FOR SELECT USING (auth.uid() = user_id);

-- Server can insert submissions (bypass for flag submission logic)
CREATE POLICY "Server can insert submissions" 
ON public.submissions FOR INSERT WITH CHECK (true);
```

### Solves Table

```sql
-- All solves are public (for leaderboards)
CREATE POLICY "Solves are public" 
ON public.solves FOR SELECT USING (true);
```

### Container Instances Table

```sql
-- Users can only see their own instances
CREATE POLICY "Users can view their own instances" 
ON public.container_instances FOR SELECT USING (auth.uid() = user_id);
```

### Products and Prices

```sql
-- Public read access for pricing information
CREATE POLICY "Allow public read-only access." 
ON public.products FOR SELECT USING (true);

CREATE POLICY "Allow public read-only access." 
ON public.prices FOR SELECT USING (true);
```

---

## Database Functions and Triggers

### 1. `calculate_challenge_points()` - Dynamic Scoring

Calculates current point value based on solve count and decay function.

```sql
CREATE OR REPLACE FUNCTION calculate_challenge_points(
  p_initial_points INT,
  p_min_points INT,
  p_solve_count INT,
  p_decay_function decay_function
) RETURNS INT AS $$
DECLARE
  v_points INT;
BEGIN
  IF p_decay_function = 'logarithmic' THEN
    v_points := GREATEST(
      p_min_points,
      p_initial_points - (LN(p_solve_count + 1) / LN(2) * 50)::INT
    );
  ELSE
    v_points := GREATEST(
      p_min_points,
      p_initial_points - (p_solve_count * ((p_initial_points - p_min_points) / 50))
    );
  END IF;
  return v_points;
END;
$$ LANGUAGE plpgsql IMMUTABLE;
```

**Algorithm:**
- **Logarithmic**: Gradual decay using natural log
- **Linear**: Steady point reduction per solve
- **Floor**: Points never go below `min_points`

### 2. `update_challenge_on_solve()` - Post-Solve Updates

Trigger function that updates challenge and profile after a solve.

```sql
CREATE OR REPLACE FUNCTION update_challenge_on_solve()
RETURNS TRIGGER AS $$
BEGIN
  -- Update challenge: increment solve count, recalculate points
  UPDATE public.challenges 
  SET 
    solve_count = solve_count + 1,
    current_points = calculate_challenge_points(
      initial_points, min_points, solve_count + 1, decay_function
    ),
    updated_at = NOW()
  WHERE id = NEW.challenge_id;
  
  -- Update profile: add points and increment solve count
  UPDATE public.profiles
  SET 
    total_points = total_points + NEW.points_awarded,
    total_solves = total_solves + 1,
    last_solve_at = NOW(),
    updated_at = NOW()
  WHERE id = NEW.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger binding
CREATE TRIGGER on_solve_created
  AFTER INSERT ON public.solves
  FOR EACH ROW EXECUTE FUNCTION update_challenge_on_solve();
```

### 3. `handle_new_user_profile()` - Profile Auto-Creation

Automatically creates a profile when a new user signs up.

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || SUBSTR(NEW.id::TEXT, 1, 8)),
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users
CREATE TRIGGER on_auth_user_created_profile
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_profile();
```

### 4. `verify_flag()` - Secure Flag Verification

Validates submitted flags without exposing flag data.

```sql
CREATE OR REPLACE FUNCTION verify_flag(
  p_challenge_id UUID,
  p_flag_hash VARCHAR
) RETURNS BOOLEAN AS $$
DECLARE
  v_exists BOOLEAN;
BEGIN
  -- Verify challenge exists and is published
  PERFORM 1 FROM public.challenges 
  WHERE id = p_challenge_id AND state = 'published';
  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;

  -- Check if hash matches any flag for this challenge
  SELECT TRUE INTO v_exists
  FROM public.challenge_flags
  WHERE challenge_id = p_challenge_id
  AND flag_hash = p_flag_hash;
  
  RETURN COALESCE(v_exists, FALSE);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## Database Enums

### `challenge_difficulty`
```sql
CREATE TYPE challenge_difficulty AS ENUM ('easy', 'medium', 'hard', 'insane');
```

### `challenge_state`
```sql
CREATE TYPE challenge_state AS ENUM ('draft', 'published', 'deprecated');
```

### `decay_function`
```sql
CREATE TYPE decay_function AS ENUM ('logarithmic', 'linear');
```

### `user_role`
```sql
CREATE TYPE user_role AS ENUM ('owner', 'admin', 'member');
```

### `audit_action`
```sql
CREATE TYPE audit_action AS ENUM ('create', 'update', 'delete', 'login', 'other');
```

---

## Backup and Recovery Strategy

### Automated Backups (Supabase)

| Backup Type | Frequency | Retention |
|-------------|-----------|-----------|
| Daily snapshots | Daily | 7 days |
| Point-in-time recovery | Continuous | 7 days |
| Manual backups | On-demand | User-defined |

### Recovery Procedures

#### Point-in-Time Recovery
```bash
# Via Supabase Dashboard
1. Navigate to Database > Backups
2. Select "Point-in-Time Recovery"
3. Choose target timestamp
4. Confirm restoration
```

#### Manual Backup (pg_dump)
```bash
# Create backup
pg_dump \
  --host $SUPABASE_HOST \
  --username postgres \
  --dbname postgres \
  --file backup_$(date +%Y%m%d).sql

# Restore from backup
psql \
  --host $SUPABASE_HOST \
  --username postgres \
  --dbname postgres \
  --file backup_20240101.sql
```

### Disaster Recovery Plan

1. **Detection**: Monitor via Supabase Dashboard alerts
2. **Assessment**: Determine scope of data loss/corruption
3. **Recovery**:
   - For recent issues: Use Point-in-Time Recovery
   - For major corruption: Restore from daily snapshot
4. **Verification**: Validate data integrity post-recovery
5. **Communication**: Notify users if downtime occurred

---

## Data Retention Policies

| Data Type | Retention | Action |
|-----------|-----------|--------|
| Audit logs | 1 year | Archive to cold storage |
| Submissions | 90 days | Aggregate statistics, then purge |
| Container instances | 7 days | Auto-delete stopped instances |
| API tokens (expired) | 30 days | Soft delete, then purge |
| User accounts (deleted) | 30 days | Soft delete for recovery, then purge |

---

## Related Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture overview
- [API.md](./API.md) - API and Server Actions documentation
- [SECURITY.md](./SECURITY.md) - Security policies and practices
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment and operations
