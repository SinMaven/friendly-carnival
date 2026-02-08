-- Fix Team Schema

-- 1. Fix user_role enum
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'captain';

-- 2. Replace team_invitations with team_invites matching the code
DROP TABLE IF EXISTS public.team_invitations CASCADE;

CREATE TABLE IF NOT EXISTS public.team_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE NOT NULL,
  code VARCHAR(50) UNIQUE NOT NULL,
  uses INT DEFAULT 0,
  max_uses INT,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.team_invites ENABLE ROW LEVEL SECURITY;

-- Policies for team_invites
CREATE POLICY "Authenticated users can read invites" 
ON public.team_invites FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Team captains can create invites" 
ON public.team_invites FOR INSERT 
TO authenticated 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.teams 
    WHERE id = team_id 
    AND captain_id = auth.uid()
  )
);

CREATE POLICY "Authenticated users can update invites (usage)" 
ON public.team_invites FOR UPDATE 
TO authenticated 
USING (true); 
