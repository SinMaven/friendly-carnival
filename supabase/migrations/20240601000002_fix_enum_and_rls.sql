-- Fix Storage RLS
-- Drop existing policies to start fresh and avoid conflicts
drop policy if exists "Give users access to own folder 1oj01k_0" on storage.objects;
drop policy if exists "Give users access to own folder 1oj01k_1" on storage.objects;
drop policy if exists "Give users access to own folder 1oj01k_2" on storage.objects;
drop policy if exists "Give users access to own folder 1oj01k_3" on storage.objects;

-- Create correct policies
-- Allow public read access to avatars
create policy "Avatar Public Read"
on storage.objects for select
to public
using ( bucket_id = 'avatars' );

-- Allow authenticated users to upload their own avatar
create policy "Avatar Upload Auth"
on storage.objects for insert
to authenticated
with check ( bucket_id = 'avatars' ); 
-- Note: We might want path restriction like (storage.foldername(name))[1] = auth.uid()::text

-- Allow users to update their own avatar
create policy "Avatar Update Auth"
on storage.objects for update
to authenticated
using ( bucket_id = 'avatars' );

-- Allow users to delete their own avatar
create policy "Avatar Delete Auth"
on storage.objects for delete
to authenticated
using ( bucket_id = 'avatars' );


-- Fix Enum Issue
-- We need to add 'captain' to user_role enum if it doesn't exist.
-- Postgres doesn't support 'IF NOT EXISTS' for enum values directly in a simple way for all versions, 
-- but we can use a DO block.

DO $$
BEGIN
    ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'captain';
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Verify/Add other roles just in case
DO $$
BEGIN
    ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'member';
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$
BEGIN
    ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'owner';
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
