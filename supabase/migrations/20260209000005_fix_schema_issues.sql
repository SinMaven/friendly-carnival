-- Add notification columns to profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS notification_email BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS notification_solves BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS notification_leaderboard BOOLEAN DEFAULT false;

-- RLS for Teams
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Teams are viewable by everyone" 
ON public.teams FOR SELECT 
USING (true);

CREATE POLICY "Users can create teams" 
ON public.teams FOR INSERT 
WITH CHECK (auth.uid() = captain_id);

CREATE POLICY "Captains can update their teams" 
ON public.teams FOR UPDATE 
USING (auth.uid() = captain_id);

CREATE POLICY "Captains can delete their teams" 
ON public.teams FOR DELETE 
USING (auth.uid() = captain_id);

-- RLS for Team Members
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Team members are viewable by everyone" 
ON public.team_members FOR SELECT 
USING (true);

CREATE POLICY "Users can join teams" 
ON public.team_members FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Captains can update team members" 
ON public.team_members FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.teams 
    WHERE id = team_members.team_id 
    AND captain_id = auth.uid()
  )
);

CREATE POLICY "Captains can remove members" 
ON public.team_members FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.teams 
    WHERE id = team_members.team_id 
    AND captain_id = auth.uid()
  )
);

CREATE POLICY "Members can leave teams" 
ON public.team_members FOR DELETE 
USING (auth.uid() = user_id);

-- RLS for Team Invites
CREATE TABLE IF NOT EXISTS public.team_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
  code VARCHAR(50) UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  max_uses INT,
  uses INT DEFAULT 0
);

ALTER TABLE public.team_invites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view valid invites" 
ON public.team_invites FOR SELECT 
USING (true);

CREATE POLICY "Captains can create invites" 
ON public.team_invites FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.teams 
    WHERE id = team_invites.team_id 
    AND captain_id = auth.uid()
  )
);

CREATE POLICY "Captains can update invites" 
ON public.team_invites FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.teams 
    WHERE id = team_invites.team_id 
    AND captain_id = auth.uid()
  )
);
