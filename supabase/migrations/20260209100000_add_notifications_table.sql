-- Migration: Add Notifications System
-- Created: 2026-02-09

-- Create notification types enum
DO $$ BEGIN
    CREATE TYPE notification_type AS ENUM (
        'first_blood',
        'challenge_solved',
        'achievement_unlocked',
        'team_invite',
        'team_joined',
        'system_announcement',
        'level_up',
        'streak_milestone'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    type notification_type NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    
    -- Related entities (all optional, depending on notification type)
    challenge_id UUID REFERENCES public.challenges(id) ON DELETE CASCADE,
    team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
    achievement_id UUID,
    actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL, -- Who triggered the notification
    
    -- Additional data as JSON
    data JSONB DEFAULT '{}'::jsonb,
    
    -- Read status
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMPTZ,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ, -- Optional expiration
    
    -- For ordering and deduplication
    priority INT DEFAULT 0, -- Higher = more important
    dedup_key VARCHAR(255) -- For grouping similar notifications
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_notifications_user_read 
ON public.notifications(user_id, is_read, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_notifications_user_created 
ON public.notifications(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_notifications_type 
ON public.notifications(type, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_notifications_unread 
ON public.notifications(user_id, is_read) 
WHERE is_read = false;

CREATE INDEX IF NOT EXISTS idx_notifications_dedup 
ON public.notifications(user_id, dedup_key, created_at DESC);

-- RLS Policies

-- Users can only view their own notifications
CREATE POLICY "Users can view own notifications" 
ON public.notifications 
FOR SELECT 
USING (auth.uid() = user_id);

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update own notifications" 
ON public.notifications 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Users can delete their own notifications
CREATE POLICY "Users can delete own notifications" 
ON public.notifications 
FOR DELETE 
USING (auth.uid() = user_id);

-- Server can insert notifications for any user
CREATE POLICY "Server can insert notifications" 
ON public.notifications 
FOR INSERT 
WITH CHECK (true);

-- Function to mark notifications as read
CREATE OR REPLACE FUNCTION mark_notifications_as_read(
    p_user_id UUID,
    p_notification_ids UUID[] DEFAULT NULL
) RETURNS INT AS $$
DECLARE
    v_updated INT;
BEGIN
    IF p_notification_ids IS NOT NULL AND array_length(p_notification_ids, 1) > 0 THEN
        -- Mark specific notifications as read
        UPDATE public.notifications
        SET is_read = true, read_at = NOW()
        WHERE user_id = p_user_id 
        AND id = ANY(p_notification_ids)
        AND is_read = false;
    ELSE
        -- Mark all unread notifications as read
        UPDATE public.notifications
        SET is_read = true, read_at = NOW()
        WHERE user_id = p_user_id 
        AND is_read = false;
    END IF;
    
    GET DIAGNOSTICS v_updated = ROW_COUNT;
    RETURN v_updated;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get unread notification count
CREATE OR REPLACE FUNCTION get_unread_notification_count(p_user_id UUID)
RETURNS INT AS $$
DECLARE
    v_count INT;
BEGIN
    SELECT COUNT(*) INTO v_count
    FROM public.notifications
    WHERE user_id = p_user_id 
    AND is_read = false
    AND (expires_at IS NULL OR expires_at > NOW());
    
    RETURN v_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create notification
CREATE OR REPLACE FUNCTION create_notification(
    p_user_id UUID,
    p_type notification_type,
    p_title VARCHAR,
    p_message TEXT,
    p_challenge_id UUID DEFAULT NULL,
    p_team_id UUID DEFAULT NULL,
    p_actor_id UUID DEFAULT NULL,
    p_data JSONB DEFAULT '{}'::jsonb,
    p_priority INT DEFAULT 0,
    p_dedup_key VARCHAR DEFAULT NULL,
    p_expires_at TIMESTAMPTZ DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
    v_notification_id UUID;
BEGIN
    -- If dedup_key provided, check for recent similar notification
    IF p_dedup_key IS NOT NULL THEN
        UPDATE public.notifications
        SET 
            message = p_message,
            data = p_data,
            created_at = NOW(),
            is_read = false,
            read_at = NULL
        WHERE user_id = p_user_id 
        AND dedup_key = p_dedup_key
        AND created_at > NOW() - INTERVAL '1 hour';
        
        IF FOUND THEN
            RETURN NULL; -- Updated existing, no new notification
        END IF;
    END IF;
    
    INSERT INTO public.notifications (
        user_id, type, title, message,
        challenge_id, team_id, actor_id,
        data, priority, dedup_key, expires_at
    ) VALUES (
        p_user_id, p_type, p_title, p_message,
        p_challenge_id, p_team_id, p_actor_id,
        p_data, p_priority, p_dedup_key, p_expires_at
    )
    RETURNING id INTO v_notification_id;
    
    RETURN v_notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to clean up old notifications
CREATE OR REPLACE FUNCTION cleanup_old_notifications() RETURNS void AS $$
BEGIN
    -- Delete expired notifications
    DELETE FROM public.notifications 
    WHERE expires_at IS NOT NULL 
    AND expires_at < NOW();
    
    -- Delete read notifications older than 30 days
    DELETE FROM public.notifications 
    WHERE is_read = true 
    AND read_at < NOW() - INTERVAL '30 days';
    
    -- Keep only last 100 unread notifications per user (delete oldest)
    DELETE FROM public.notifications n
    WHERE n.id IN (
        SELECT id FROM (
            SELECT id, ROW_NUMBER() OVER (
                PARTITION BY user_id 
                ORDER BY created_at DESC
            ) as rn
            FROM public.notifications
            WHERE is_read = false
        ) sub
        WHERE rn > 100
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION mark_notifications_as_read(UUID, UUID[]) TO authenticated;
GRANT EXECUTE ON FUNCTION get_unread_notification_count(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION create_notification TO service_role;

-- Update profiles table with notification preferences
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS notification_preferences JSONB DEFAULT '{
  "email_on_first_blood": true,
  "email_on_team_invite": true,
  "email_on_achievement": true,
  "email_weekly_digest": false,
  "push_enabled": true,
  "browser_notifications": false
}'::jsonb;
