-- Solves
-- (Already handled in 00 policies, but this ensures 'insert own' is specific if needed. 
-- However, 00 has 'Solves are public' for SELECT. It does lack INSERT. So we keep this.)
CREATE POLICY "Users can insert their own solves" ON public.solves FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Note: Policies for Teams and Team Members are already defined in 20260209000005_fix_schema_issues.sql
-- We remove them here to avoid conflicts.
