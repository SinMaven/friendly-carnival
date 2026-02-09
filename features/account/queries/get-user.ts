import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function getUser() {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase.from('profiles').select('*').maybeSingle();

  if (error) {
    console.error(error);
  }

  return data;
}
