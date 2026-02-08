-- Create avatars bucket if it doesn't exist
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- Fix Foreign Key Constraints for Deleting Users
-- We need to ensure that when a user is deleted from auth.users, their data in public tables is also deleted.

-- public.profiles
alter table public.profiles
drop constraint if exists profiles_id_fkey,
add constraint profiles_id_fkey
foreign key (id)
references auth.users (id)
on delete cascade;

-- public.solves (assuming user_id references profiles.id or auth.users.id)
-- If solves references profiles(id), the cascade on profiles will handle it if solves has cascade on profiles
-- Let's check if we can safely alter it.
-- We'll try to drop and recreate potential user_id FKs.

-- public.team_members
alter table public.team_members
drop constraint if exists team_members_user_id_fkey,
add constraint team_members_user_id_fkey
foreign key (user_id)
references auth.users (id)
on delete cascade;

-- public.subscriptions
alter table public.subscriptions
drop constraint if exists subscriptions_user_id_fkey,
add constraint subscriptions_user_id_fkey
foreign key (user_id)
references auth.users (id)
on delete cascade;

-- public.customers (if exists often used with stripe)
alter table if exists public.customers
drop constraint if exists customers_id_fkey,
add constraint customers_id_fkey
foreign key (id)
references auth.users (id)
on delete cascade;

-- public.users (if there's a users table proxying auth.users, though usually it's profiles)
-- public.api_keys or similar?

-- Handle team ownership transfer on delete?
-- If a team captain is deleted, the team might be deleted or ownership transferred.
-- If we want to delete the team when captain is deleted:
alter table public.teams
drop constraint if exists teams_captain_id_fkey,
add constraint teams_captain_id_fkey
foreign key (captain_id)
references auth.users (id)
on delete cascade;

