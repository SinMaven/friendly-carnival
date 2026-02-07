import { createSupabaseServerClient } from '@/libs/supabase/supabase-server-client';

import { SubscriptionWithProduct } from '../../pricing/types';

export async function getSubscription() {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .in('status', ['trialing', 'active'])
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
      // @ts-ignore
      data.prices = priceData;
    }
  }

  return data as unknown as SubscriptionWithProduct;
}
