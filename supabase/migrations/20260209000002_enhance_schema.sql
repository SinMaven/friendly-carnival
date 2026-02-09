-- Add Polar Columns to Subscriptions
ALTER TABLE public.subscriptions 
ADD COLUMN IF NOT EXISTS polar_subscription_id TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS polar_product_id TEXT,
ADD COLUMN IF NOT EXISTS polar_customer_id TEXT;

-- Index for faster lookups by polar_subscription_id
CREATE INDEX IF NOT EXISTS idx_subscriptions_polar_id ON public.subscriptions(polar_subscription_id);

-- Optimize Leaderboard: Add last_solve_at to profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS last_solve_at TIMESTAMPTZ;

-- Update trigger to set last_solve_at
CREATE OR REPLACE FUNCTION update_challenge_on_solve()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.challenges 
  SET 
    solve_count = solve_count + 1,
    current_points = calculate_challenge_points(
      initial_points, min_points, solve_count + 1, decay_function
    ),
    updated_at = NOW()
  WHERE id = NEW.challenge_id;
  
  UPDATE public.profiles
  SET 
    total_points = total_points + NEW.points_awarded,
    total_solves = total_solves + 1,
    last_solve_at = NOW(), -- New field
    updated_at = NOW()
  WHERE id = NEW.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
