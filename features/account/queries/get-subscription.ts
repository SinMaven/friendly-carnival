import { createSupabaseServerClient } from '@/lib/supabase/server';

import { SubscriptionWithProduct } from '../../pricing/types';

export async function getSubscription() {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('status', 'active')
    .maybeSingle();

  if (error) {
    console.error(error);
  }

  if (data && data.price_id) {
    const { data: priceData } = await supabase
      .from('prices')
      .select('*, products(*)')
      .eq('id', data.price_id)
      .maybeSingle();

    if (priceData) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (data as any).prices = priceData;
    }
  }

  return data as unknown as SubscriptionWithProduct;
}
