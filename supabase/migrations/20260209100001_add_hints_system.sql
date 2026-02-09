-- Migration: Add Challenge Hints System
-- Created: 2026-02-09

-- Create hints table
CREATE TABLE IF NOT EXISTS public.challenge_hints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    challenge_id UUID REFERENCES public.challenges(id) ON DELETE CASCADE NOT NULL,
    
    -- Hint content (can be encrypted/rot13 in application layer)
    content TEXT NOT NULL,
    
    -- Cost to unlock this hint
    cost_points INT NOT NULL DEFAULT 50,
    
    -- Display order (1 = first hint, 2 = second, etc.)
    order_index INT NOT NULL DEFAULT 1,
    
    -- Optional: delay before hint becomes available (minutes after challenge start)
    unlock_after_minutes INT,
    
    -- Is this hint active
    is_active BOOLEAN DEFAULT true,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Ensure unique order per challenge
    UNIQUE(challenge_id, order_index)
);

-- Create user hints unlocks table (tracks which users have unlocked which hints)
CREATE TABLE IF NOT EXISTS public.user_hint_unlocks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    hint_id UUID REFERENCES public.challenge_hints(id) ON DELETE CASCADE NOT NULL,
    challenge_id UUID REFERENCES public.challenges(id) ON DELETE CASCADE NOT NULL,
    
    -- Points deducted for this hint
    points_deducted INT NOT NULL,
    
    unlocked_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Ensure user can only unlock each hint once
    UNIQUE(user_id, hint_id)
);

-- Enable RLS
ALTER TABLE public.challenge_hints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_hint_unlocks ENABLE ROW LEVEL SECURITY;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_hints_challenge ON public.challenge_hints(challenge_id, order_index);
CREATE INDEX IF NOT EXISTS idx_hints_active ON public.challenge_hints(challenge_id) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_user_hints_user ON public.user_hint_unlocks(user_id, challenge_id);
CREATE INDEX IF NOT EXISTS idx_user_hints_challenge ON public.user_hint_unlocks(challenge_id);

-- RLS Policies

-- Anyone can view active hints for published challenges (content hidden until unlocked)
CREATE POLICY "Users can view hint metadata" 
ON public.challenge_hints 
FOR SELECT 
USING (
    is_active = true AND 
    EXISTS (
        SELECT 1 FROM public.challenges 
        WHERE id = challenge_hints.challenge_id 
        AND state = 'published'
    )
);

-- Users can view their own unlocked hints
CREATE POLICY "Users can view unlocked hints" 
ON public.challenge_hints 
FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.user_hint_unlocks 
        WHERE hint_id = challenge_hints.id 
        AND user_id = auth.uid()
    )
);

-- Admins can manage hints
CREATE POLICY "Admins can manage hints" 
ON public.challenge_hints 
FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() 
        AND (
            -- Check if user has admin role (you may need to add this to profiles)
            id IN (SELECT author_id FROM public.challenges WHERE id = challenge_hints.challenge_id)
        )
    )
);

-- Users can view their own hint unlocks
CREATE POLICY "Users can view own hint unlocks" 
ON public.user_hint_unlocks 
FOR SELECT 
USING (auth.uid() = user_id);

-- Server can insert hint unlocks
CREATE POLICY "Server can insert hint unlocks" 
ON public.user_hint_unlocks 
FOR INSERT 
WITH CHECK (true);

-- Function to unlock a hint
CREATE OR REPLACE FUNCTION unlock_hint(
    p_user_id UUID,
    p_hint_id UUID
) RETURNS TABLE (
    success BOOLEAN,
    message TEXT,
    content TEXT,
    points_deducted INT
) AS $$
DECLARE
    v_hint RECORD;
    v_challenge_id UUID;
    v_user_points INT;
    v_already_unlocked BOOLEAN;
    v_solved BOOLEAN;
BEGIN
    -- Get hint details
    SELECT h.*, c.id as challenge_id, c.title as challenge_title
    INTO v_hint
    FROM public.challenge_hints h
    JOIN public.challenges c ON c.id = h.challenge_id
    WHERE h.id = p_hint_id AND h.is_active = true;
    
    IF v_hint IS NULL THEN
        RETURN QUERY SELECT false, 'Hint not found or inactive'::TEXT, NULL::TEXT, 0;
        RETURN;
    END IF;
    
    -- Check if user already unlocked this hint
    SELECT EXISTS(
        SELECT 1 FROM public.user_hint_unlocks 
        WHERE user_id = p_user_id AND hint_id = p_hint_id
    ) INTO v_already_unlocked;
    
    IF v_already_unlocked THEN
        -- Return the hint content if already unlocked
        SELECT content INTO v_hint.content
        FROM public.challenge_hints WHERE id = p_hint_id;
        
        RETURN QUERY SELECT true, 'Already unlocked'::TEXT, v_hint.content, 0;
        RETURN;
    END IF;
    
    -- Check if user already solved this challenge
    SELECT EXISTS(
        SELECT 1 FROM public.solves 
        WHERE user_id = p_user_id AND challenge_id = v_hint.challenge_id
    ) INTO v_solved;
    
    -- Get user's current points
    SELECT total_points INTO v_user_points
    FROM public.profiles WHERE id = p_user_id;
    
    IF v_user_points < v_hint.cost_points THEN
        RETURN QUERY SELECT false, format('Insufficient points. You need %s points, but have %s.', v_hint.cost_points, v_user_points)::TEXT, NULL::TEXT, 0;
        RETURN;
    END IF;
    
    -- Check if hint has time delay
    IF v_hint.unlock_after_minutes IS NOT NULL THEN
        -- This would require tracking when user started the challenge
        -- For now, skip this check or implement challenge start tracking
        NULL;
    END IF;
    
    -- Deduct points and unlock hint
    UPDATE public.profiles 
    SET total_points = total_points - v_hint.cost_points 
    WHERE id = p_user_id;
    
    INSERT INTO public.user_hint_unlocks (user_id, hint_id, challenge_id, points_deducted)
    VALUES (p_user_id, p_hint_id, v_hint.challenge_id, v_hint.cost_points);
    
    -- Log the hint unlock
    INSERT INTO public.audit_logs (actor_id, event_type, target_resource_id, payload_diff, severity)
    VALUES (p_user_id, 'hint.unlocked', v_hint.challenge_id, jsonb_build_object(
        'hint_id', p_hint_id,
        'cost_points', v_hint.cost_points,
        'challenge_id', v_hint.challenge_id
    ), 'info');
    
    RETURN QUERY SELECT true, 'Hint unlocked successfully'::TEXT, v_hint.content, v_hint.cost_points;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get hints for a challenge (for a specific user)
CREATE OR REPLACE FUNCTION get_challenge_hints(
    p_user_id UUID,
    p_challenge_id UUID
) RETURNS TABLE (
    id UUID,
    order_index INT,
    cost_points INT,
    is_unlocked BOOLEAN,
    content TEXT,
    unlocked_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        h.id,
        h.order_index,
        h.cost_points,
        EXISTS(
            SELECT 1 FROM public.user_hint_unlocks u 
            WHERE u.hint_id = h.id AND u.user_id = p_user_id
        ) as is_unlocked,
        CASE 
            WHEN EXISTS(
                SELECT 1 FROM public.user_hint_unlocks u 
                WHERE u.hint_id = h.id AND u.user_id = p_user_id
            ) THEN h.content
            ELSE NULL
        END as content,
        (
            SELECT unlocked_at FROM public.user_hint_unlocks u 
            WHERE u.hint_id = h.id AND u.user_id = p_user_id
        ) as unlocked_at
    FROM public.challenge_hints h
    WHERE h.challenge_id = p_challenge_id AND h.is_active = true
    ORDER BY h.order_index;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION unlock_hint(UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_challenge_hints(UUID, UUID) TO authenticated;

-- Add hint summary to challenges
ALTER TABLE public.challenges 
ADD COLUMN IF NOT EXISTS hints_count INT DEFAULT 0;

-- Add hint penalty tracking to solves
ALTER TABLE public.solves 
ADD COLUMN IF NOT EXISTS hints_used_count INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS points_deducted_for_hints INT DEFAULT 0;

-- Create function to update challenge hints count
CREATE OR REPLACE FUNCTION update_challenge_hints_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.challenges 
        SET hints_count = hints_count + 1 
        WHERE id = NEW.challenge_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.challenges 
        SET hints_count = GREATEST(0, hints_count - 1) 
        WHERE id = OLD.challenge_id;
    ELSIF TG_OP = 'UPDATE' AND OLD.challenge_id != NEW.challenge_id THEN
        UPDATE public.challenges SET hints_count = hints_count - 1 WHERE id = OLD.challenge_id;
        UPDATE public.challenges SET hints_count = hints_count + 1 WHERE id = NEW.challenge_id;
    END IF;
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_hint_change
    AFTER INSERT OR DELETE OR UPDATE ON public.challenge_hints
    FOR EACH ROW EXECUTE FUNCTION update_challenge_hints_count();
