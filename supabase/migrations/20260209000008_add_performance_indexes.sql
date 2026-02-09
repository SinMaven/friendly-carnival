-- Performance Indexes Migration
-- Adds indexes for common query patterns to improve performance

-- Index for leaderboard queries (sorted by points)
CREATE INDEX IF NOT EXISTS idx_profiles_leaderboard 
ON profiles(total_points DESC, total_solves DESC) 
WHERE deleted_at IS NULL;

-- Index for challenge filtering
CREATE INDEX IF NOT EXISTS idx_challenges_state_difficulty 
ON challenges(state, difficulty) 
WHERE state = 'published';

-- Index for challenge tags lookup
CREATE INDEX IF NOT EXISTS idx_challenge_tags_challenge 
ON challenge_tags(challenge_id);

CREATE INDEX IF NOT EXISTS idx_challenge_tags_tag 
ON challenge_tags(tag_id);

-- Index for submissions (rate limiting queries)
CREATE INDEX IF NOT EXISTS idx_submissions_rate_limit 
ON submissions(user_id, challenge_id, created_at DESC);

-- Index for solves lookup
CREATE INDEX IF NOT EXISTS idx_solves_user_challenge 
ON solves(user_id, challenge_id);

CREATE INDEX IF NOT EXISTS idx_solves_challenge 
ON solves(challenge_id);

-- Index for audit logs (time-based queries)
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at 
ON audit_logs(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_audit_logs_actor 
ON audit_logs(actor_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_audit_logs_severity 
ON audit_logs(severity, created_at DESC);

-- Index for team membership lookups
CREATE INDEX IF NOT EXISTS idx_team_members_user 
ON team_members(user_id);

CREATE INDEX IF NOT EXISTS idx_team_members_team 
ON team_members(team_id);

-- Index for container instances
CREATE INDEX IF NOT EXISTS idx_container_instances_user 
ON container_instances(user_id, status);

CREATE INDEX IF NOT EXISTS idx_container_instances_expires 
ON container_instances(expires_at) 
WHERE expires_at IS NOT NULL;

-- Index for subscriptions
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_status 
ON subscriptions(user_id, status);

-- Index for invites
CREATE INDEX IF NOT EXISTS idx_team_invites_code 
ON team_invites(code);

-- Index for challenge solves count optimization
CREATE INDEX IF NOT EXISTS idx_solves_challenge_first_blood 
ON solves(challenge_id, is_first_blood) 
WHERE is_first_blood = true;

-- Partial index for active challenges only (commonly queried)
CREATE INDEX IF NOT EXISTS idx_challenges_active 
ON challenges(created_at DESC) 
WHERE state = 'published';

-- Add updated_at trigger for profiles if not exists
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to profiles
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Apply updated_at trigger to challenges
DROP TRIGGER IF EXISTS update_challenges_updated_at ON challenges;
CREATE TRIGGER update_challenges_updated_at
    BEFORE UPDATE ON challenges
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Apply updated_at trigger to teams
DROP TRIGGER IF EXISTS update_teams_updated_at ON teams;
CREATE TRIGGER update_teams_updated_at
    BEFORE UPDATE ON teams
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Comment explaining the indexes
COMMENT ON INDEX idx_profiles_leaderboard IS 'Optimizes leaderboard queries';
COMMENT ON INDEX idx_challenges_state_difficulty IS 'Optimizes challenge filtering by state and difficulty';
COMMENT ON INDEX idx_submissions_rate_limit IS 'Optimizes rate limiting checks';
COMMENT ON INDEX idx_audit_logs_created_at IS 'Optimizes audit log time-range queries';
