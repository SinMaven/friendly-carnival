-- Solves
CREATE POLICY "Users can insert their own solves" ON public.solves FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Teams
CREATE POLICY "Teams are viewable by everyone" ON public.teams FOR SELECT USING (true);
CREATE POLICY "Users can create teams" ON public.teams FOR INSERT WITH CHECK (auth.uid() = captain_id);
CREATE POLICY "Captains can update their team" ON public.teams FOR UPDATE USING (auth.uid() = captain_id);
CREATE POLICY "Captains can delete their team" ON public.teams FOR DELETE USING (auth.uid() = captain_id);

-- Team Members
CREATE POLICY "Team members are viewable by everyone" ON public.team_members FOR SELECT USING (true);
CREATE POLICY "Users can join teams" ON public.team_members FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave teams" ON public.team_members FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Captains can remove members" ON public.team_members FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM public.teams 
    WHERE id = team_members.team_id 
    AND captain_id = auth.uid()
  )
);
