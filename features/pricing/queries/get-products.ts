import { createSupabaseServerClient } from '@/lib/supabase/server';

import { ProductWithPrices } from '../types';

export async function getProducts() {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('active', true)
    // .eq('prices.active', true) // Cannot filter by joined table if join is removed
    .order('metadata->index');
  // .order('unit_amount', { referencedTable: 'prices' });

  if (error) {
    console.error(error.message);
  }

  if (data) {
    const { data: prices } = await supabase
      .from('prices')
      .select('*')
      .eq('active', true)
      .in(
        'product_id',
        data.map((p) => p.id)
      );

    if (prices) {
      data.forEach((p) => {
        // @ts-ignore
        p.prices = prices.filter((price) => price.product_id === p.id);
      });
    }
  }

  return (data as unknown as ProductWithPrices[]) ?? [];
}
