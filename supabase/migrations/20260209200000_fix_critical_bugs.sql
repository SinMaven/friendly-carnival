-- Migration to apply critical fixes for existing deployments
-- This ensures fixes are applied even if previous migrations are already marked as run.

-- 1. Fix user profile creation trigger (Robust against username collisions)
CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
RETURNS TRIGGER AS $$
DECLARE
  v_username TEXT;
  v_counter INT := 0;
BEGIN
  v_username := COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || SUBSTR(NEW.id::TEXT, 1, 8));
  
  -- Simple loop to find unique username if collision occurs (unlikely but possible)
  LOOP
    BEGIN
      INSERT INTO public.profiles (id, username, full_name, avatar_url)
      VALUES (
        NEW.id,
        CASE WHEN v_counter = 0 THEN v_username ELSE v_username || '_' || v_counter END,
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'avatar_url'
      )
      ON CONFLICT (id) DO NOTHING; -- Handle ID conflict (idempotency)
      
      EXIT; -- Success
    EXCEPTION WHEN unique_violation THEN
      -- If username collision, increment and retry
      v_counter := v_counter + 1;
      IF v_counter > 10 THEN
         -- Fallback to random suffix if we fail too many times
         INSERT INTO public.profiles (id, username, full_name, avatar_url)
         VALUES (
           NEW.id,
           'user_' || SUBSTR(GEN_RANDOM_UUID()::TEXT, 1, 12),
           NEW.raw_user_meta_data->>'full_name',
           NEW.raw_user_meta_data->>'avatar_url'
         )
         ON CONFLICT (id) DO NOTHING;
         EXIT;
      END IF;
    END;
  END LOOP;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Fix Teams RLS Policies (Tighten security)
-- Drop existing potential weak/duplicate policies
DROP POLICY IF EXISTS "Authenticated users can create teams" ON public.teams;
DROP POLICY IF EXISTS "Users can create teams" ON public.teams;

-- Create the strict policy
CREATE POLICY "Users can create teams" 
ON public.teams FOR INSERT 
WITH CHECK (auth.uid() = captain_id);

-- 3. Fix Team Members RLS Policies (Remove duplicates if present)
DROP POLICY IF EXISTS "Captains can remove members" ON public.team_members;

-- Re-create only if needed (05 has this, but 07 might have duplicated it. 
-- We ensure the cleaner one from 05 is the authority. 
-- If 05 ran, we are good. If 07 ran, we might have had two.
-- Safest is to ensure we have one valid one.
CREATE POLICY "Captains can remove members" 
ON public.team_members FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.teams 
    WHERE id = team_members.team_id 
    AND captain_id = auth.uid()
  )
);
