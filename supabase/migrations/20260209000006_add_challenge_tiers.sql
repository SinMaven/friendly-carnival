-- Add tier enum and column to challenges
BEGIN;

-- Create challenge_tier enum if it doesn't exist
DO $$ BEGIN
    CREATE TYPE challenge_tier AS ENUM ('free', 'pro', 'elite');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Add tier column to challenges table
ALTER TABLE public.challenges 
ADD COLUMN IF NOT EXISTS tier challenge_tier NOT NULL DEFAULT 'free';

-- Add total_points to teams for leaderboard
ALTER TABLE public.teams
ADD COLUMN IF NOT EXISTS total_points INT DEFAULT 0;


-- Update RLS policies (optional, but good for security)
-- check if policy exists first or just drop and recreate
DROP POLICY IF EXISTS "Published challenges are viewable by everyone" ON public.challenges;

-- Allow everyone to see challenges (so they show up in the list), 
-- but we will restrict sensitive fields (like assets/connection_info) in the application layer
-- or strict RLS. For now, public view is fine, we just "lock" the UI.
CREATE POLICY "Published challenges are viewable by everyone" 
ON public.challenges FOR SELECT USING (state = 'published');

-- Update the solve trigger to also update team points
CREATE OR REPLACE FUNCTION update_challenge_on_solve()
RETURNS TRIGGER AS $$
BEGIN
  -- Update Challenge Stats
  UPDATE public.challenges 
  SET 
    solve_count = solve_count + 1,
    current_points = calculate_challenge_points(
      initial_points, min_points, solve_count + 1, decay_function
    ),
    updated_at = NOW()
  WHERE id = NEW.challenge_id;
  
  -- Update User Stats
  UPDATE public.profiles
  SET 
    total_points = total_points + NEW.points_awarded,
    total_solves = total_solves + 1,
    updated_at = NOW()
  WHERE id = NEW.user_id;

  -- Update Team Stats (if user is in a team)
  IF NEW.team_id IS NOT NULL THEN
    UPDATE public.teams
    SET 
      total_points = total_points + NEW.points_awarded,
      updated_at = NOW()
    WHERE id = NEW.team_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMIT;
