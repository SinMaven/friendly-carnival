import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function getSession() {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase.auth.getUser();

  if (error) {
    console.error(error);
    return null;
  }

  return { user: data.user };
}
