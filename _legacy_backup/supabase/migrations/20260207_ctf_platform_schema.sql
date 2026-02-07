-- ==========================================
-- DUCKURITY CTF PLATFORM - COMPLETE DATABASE SCHEMA
-- Module 1-6 Implementation
-- ==========================================

-- ENUMS
DO $$ BEGIN
    CREATE TYPE challenge_difficulty AS ENUM ('easy', 'medium', 'hard', 'insane');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE challenge_state AS ENUM ('draft', 'published', 'deprecated');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE decay_function AS ENUM ('logarithmic', 'linear');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('owner', 'admin', 'member');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE audit_action AS ENUM ('create', 'update', 'delete', 'login', 'other');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ==========================================
-- MODULE 1: IAM & DEVELOPER ACCESS
-- ==========================================

-- 1. Users (Extended Profile)
-- Maps to 'Users' in spec
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  username VARCHAR(50) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  avatar_url TEXT,
  bio TEXT,
  website VARCHAR(255),
  github_handle VARCHAR(50),
  
  -- Security & Preferences
  mfa_enabled BOOLEAN DEFAULT FALSE,
  theme_preference VARCHAR(20) DEFAULT 'dark',
  
  -- Gamification Stats (Preserved from existing schema)
  total_points INT DEFAULT 0,
  total_solves INT DEFAULT 0,
  rank INT,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 2. API Tokens
CREATE TABLE IF NOT EXISTS public.api_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL, -- e.g. CI/CD Runner
  token_hash VARCHAR(64) UNIQUE NOT NULL, -- sha256
  last_used_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  scopes JSONB DEFAULT '[]'::jsonb, -- ["read:challenges", "write:submit"]
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.api_tokens ENABLE ROW LEVEL SECURITY;

-- 3. Teams
CREATE TABLE IF NOT EXISTS public.teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  avatar_url TEXT,
  captain_id UUID REFERENCES public.profiles(id),
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;

-- 4. Team Members
CREATE TABLE IF NOT EXISTS public.team_members (
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  role user_role DEFAULT 'member',
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (team_id, user_id)
);

ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- MODULE 2: ADVANCED CHALLENGE ENGINE
-- ==========================================

-- 5. Tags (Categories)
CREATE TABLE IF NOT EXISTS public.tags (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  slug VARCHAR(50) UNIQUE NOT NULL,
  color_hex VARCHAR(7) DEFAULT '#6366f1',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;

-- 6. Challenges
CREATE TABLE IF NOT EXISTS public.challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(100) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description_markdown TEXT NOT NULL,
  difficulty challenge_difficulty NOT NULL DEFAULT 'easy',
  state challenge_state NOT NULL DEFAULT 'draft',
  author_id UUID REFERENCES public.profiles(id),
  
  -- Dynamic Scoring
  is_dynamic_scoring BOOLEAN DEFAULT TRUE,
  initial_points INT DEFAULT 500,
  min_points INT DEFAULT 100,
  decay_function decay_function DEFAULT 'logarithmic',
  current_points INT DEFAULT 500,
  
  -- Ops & Infrastructure
  requires_container BOOLEAN DEFAULT FALSE,
  container_image_ref VARCHAR(255), -- e.g. registry.duckurity.com/pwn/heap-overflow:latest
  
  -- Metadata
  solve_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;

-- 7. Challenge Tags (Junction)
CREATE TABLE IF NOT EXISTS public.challenge_tags (
  challenge_id UUID REFERENCES public.challenges(id) ON DELETE CASCADE,
  tag_id INT REFERENCES public.tags(id) ON DELETE CASCADE,
  PRIMARY KEY (challenge_id, tag_id)
);

ALTER TABLE public.challenge_tags ENABLE ROW LEVEL SECURITY;

-- 8. Challenge Flags
CREATE TABLE IF NOT EXISTS public.challenge_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID REFERENCES public.challenges(id) ON DELETE CASCADE NOT NULL,
  flag_hash VARCHAR(128) NOT NULL,
  flag_format VARCHAR(20) DEFAULT 'static', -- static, regex
  is_case_sensitive BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.challenge_flags ENABLE ROW LEVEL SECURITY;
-- RLS Policy: No public read access ever. Only server-side via RPC.

-- 9. Challenge Assets
CREATE TABLE IF NOT EXISTS public.challenge_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID REFERENCES public.challenges(id) ON DELETE CASCADE NOT NULL,
  storage_path TEXT NOT NULL,
  filename VARCHAR(255) NOT NULL,
  file_hash VARCHAR(64), -- MD5/SHA256
  file_size_bytes BIGINT,
  download_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.challenge_assets ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- MODULE 3: PERFORMANCE GAMIFICATION
-- ==========================================

-- 10. Submissions (Audit Trail of Attempts)
CREATE TABLE IF NOT EXISTS public.submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE, -- Optional team submission
  challenge_id UUID REFERENCES public.challenges(id) ON DELETE CASCADE NOT NULL,
  input_payload TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  ip_address INET,
  user_agent TEXT,
  execution_time_ms INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Partitioning would ideally happen here for scale, but keeping it simple for now within Supabase limitations.
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- 11. Solves (Leaderboard Optimized)
CREATE TABLE IF NOT EXISTS public.solves (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
  challenge_id UUID REFERENCES public.challenges(id) ON DELETE CASCADE NOT NULL,
  points_awarded INT NOT NULL, -- Snapshotted at moment of solve
  is_first_blood BOOLEAN DEFAULT FALSE,
  solved_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, challenge_id)
);

ALTER TABLE public.solves ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- MODULE 4: INFRASTRUCTURE & ORCHESTRATION
-- ==========================================

-- 12. Container Instances
CREATE TABLE IF NOT EXISTS public.container_instances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  challenge_id UUID REFERENCES public.challenges(id) ON DELETE CASCADE NOT NULL,
  provider_task_id VARCHAR(255), -- e.g. AWS ECS Task ARN or K8s Pod Name
  status VARCHAR(50) DEFAULT 'provisioning', -- provisioning, running, stopped, failed
  connection_info JSONB, -- {ssh_cmd: "ssh user@host -p 2222", http_url: "..."}
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.container_instances ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- MODULE 5: AUDIT & COMPLIANCE
-- ==========================================

-- 13. Audit Logs
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES public.profiles(id),
  event_type VARCHAR(100) NOT NULL, -- auth.login, system.config_change, etc.
  target_resource_id UUID,
  payload_diff JSONB,
  ip_address INET,
  severity VARCHAR(20) DEFAULT 'info', -- info, warning, critical
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- MODULE 6: COMMERCE
-- ==========================================

-- 13. Customers (Stripe Mapping)
CREATE TABLE IF NOT EXISTS public.customers (
  id UUID REFERENCES public.profiles(id) PRIMARY KEY,
  stripe_customer_id TEXT
);
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

-- 14. Subscriptions
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  provider_id VARCHAR(255), -- stripe_sub_...
  status VARCHAR(50), -- active, trialing, past_due, canceled
  metadata JSONB,
  price_id TEXT REFERENCES public.prices(id),
  quantity INT,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- 15. Licenses
CREATE TABLE IF NOT EXISTS public.licenses (
  key_hash VARCHAR(64) PRIMARY KEY,
  owner_org_id UUID REFERENCES public.teams(id),
  max_seats INT DEFAULT 5,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.licenses ENABLE ROW LEVEL SECURITY;


-- ==========================================
-- RLS POLICIES (Basic Implementation)
-- ==========================================

-- Profiles
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Challenges
CREATE POLICY "Published challenges are viewable by everyone" ON public.challenges FOR SELECT USING (state = 'published');

-- Submissions
CREATE POLICY "Users can view their own submissions" ON public.submissions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Server can insert submissions" ON public.submissions FOR INSERT WITH CHECK (true); -- Ideally restricted to service role

-- Solves
CREATE POLICY "Solves are public" ON public.solves FOR SELECT USING (true);

-- Container Instances
CREATE POLICY "Users can view their own instances" ON public.container_instances FOR SELECT USING (auth.uid() = user_id);

-- Audit Logs
CREATE POLICY "Admins can view audit logs" ON public.audit_logs FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND (SELECT role FROM public.team_members WHERE user_id = auth.uid() LIMIT 1) = 'owner')
);


-- ==========================================
-- FUNCTIONS & TRIGGERS
-- ==========================================

-- 1. Calculate Dynamic Points
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
    -- Logarithmic decay formula
    v_points := GREATEST(
      p_min_points,
      p_initial_points - (LN(p_solve_count + 1) / LN(2) * 50)::INT
    );
  ELSE
    -- Linear decay
    v_points := GREATEST(
      p_min_points,
      p_initial_points - (p_solve_count * ((p_initial_points - p_min_points) / 50))
    );
  END IF;
  return v_points;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 2. Update Challenge Points Trigger
CREATE OR REPLACE FUNCTION update_challenge_on_solve()
RETURNS TRIGGER AS $$
BEGIN
  -- Increment solve count and update points
  UPDATE public.challenges 
  SET 
    solve_count = solve_count + 1,
    current_points = calculate_challenge_points(
      initial_points, min_points, solve_count + 1, decay_function
    ),
    updated_at = NOW()
  WHERE id = NEW.challenge_id;
  
  -- Update user stats
  UPDATE public.profiles
  SET 
    total_points = total_points + NEW.points_awarded,
    total_solves = total_solves + 1,
    updated_at = NOW()
  WHERE id = NEW.user_id;

  -- Update team stats (if applicable)
  IF NEW.team_id IS NOT NULL THEN
     -- Placeholder for team stat update logic
     NULL;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_solve_created ON public.solves;
CREATE TRIGGER on_solve_created
  AFTER INSERT ON public.solves
  FOR EACH ROW EXECUTE FUNCTION update_challenge_on_solve();


-- 3. Profile Creation Handler
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

-- Trigger is usually on auth.users which we can't always define in migration depending on permissions
-- Assuming this runs with sufficient privileges:
DROP TRIGGER IF EXISTS on_auth_user_created_profile ON auth.users;
CREATE TRIGGER on_auth_user_created_profile
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_profile();

-- Seed Data (Keep existing minimal seeds)
INSERT INTO public.tags (name, slug, color_hex) VALUES 
('Web', 'web', '#3b82f6'), ('Crypto', 'crypto', '#8b5cf6')

-- 4. Verify Flag RPC (Secure)
CREATE OR REPLACE FUNCTION verify_flag(
  p_challenge_id UUID,
  p_flag_hash VARCHAR
) RETURNS BOOLEAN AS $$
DECLARE
  v_exists BOOLEAN;
BEGIN
  -- Check if challenge is published (optional, but good practice)
  PERFORM 1 FROM public.challenges WHERE id = p_challenge_id AND state = 'published';
  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;

  -- Check exact hash match
  SELECT TRUE INTO v_exists
  FROM public.challenge_flags
  WHERE challenge_id = p_challenge_id
  AND flag_hash = p_flag_hash;
  
  RETURN COALESCE(v_exists, FALSE);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- MODULE 7: COMMERCE (STRIPE INTEGRATION)
-- ==========================================

-- 16. Products (Synced from Stripe)
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  active BOOLEAN,
  name TEXT,
  description TEXT,
  image TEXT,
  metadata JSONB
);
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read-only access." ON public.products FOR SELECT USING (true);

-- 17. Prices (Synced from Stripe)
CREATE TABLE IF NOT EXISTS public.prices (
  id TEXT PRIMARY KEY,
  product_id TEXT REFERENCES public.products,
  active BOOLEAN,
  description TEXT,
  unit_amount BIGINT,
  currency TEXT,
  type TEXT, -- 'one_time' or 'recurring'
  interval TEXT, -- 'day', 'week', 'month', 'year'
  interval_count INT,
  trial_period_days INT,
  metadata JSONB
);
ALTER TABLE public.prices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read-only access." ON public.prices FOR SELECT USING (true);


