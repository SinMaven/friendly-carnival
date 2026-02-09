-- Seed Products and Prices with Polar Metadata
-- Using DO block to handle upserts and references

DO $$
DECLARE
  v_prod_free TEXT := 'prod_free';
  v_prod_pro TEXT := 'prod_pro';
  v_prod_elite TEXT := 'prod_elite';
BEGIN
  -- 1. Products
  INSERT INTO public.products (id, active, name, description, image, metadata)
  VALUES 
  (v_prod_free, true, 'Free Tier', 'Access to basic challenges', NULL, '{"polar_product_id": "f6b753d5-942f-43be-973f-1a85de0f31e0"}'::jsonb),
  (v_prod_pro, true, 'Pro Tier', 'Access to all challenges and premium features', NULL, '{"polar_product_id": "af313f2d-e84e-4141-80ac-8ee93db480c2"}'::jsonb),
  (v_prod_elite, true, 'Elite Tier', 'Priority support, dedicated instances, and more', NULL, '{"polar_product_id": "e1c95e50-35ed-4f77-8681-58c550b7885f"}'::jsonb)
  ON CONFLICT (id) DO UPDATE SET 
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    metadata = EXCLUDED.metadata;

  -- 2. Prices
  INSERT INTO public.prices (id, product_id, active, description, unit_amount, currency, type, interval, metadata)
  VALUES 
  ('price_free', v_prod_free, true, 'Free forever', 0, 'usd', 'recurring', 'month', NULL),
  ('price_pro_monthly', v_prod_pro, true, 'Pro Monthly', 1900, 'usd', 'recurring', 'month', NULL),
  ('price_elite_monthly', v_prod_elite, true, 'Elite Monthly', 4900, 'usd', 'recurring', 'month', NULL)
  ON CONFLICT (id) DO UPDATE SET 
    unit_amount = EXCLUDED.unit_amount,
    active = EXCLUDED.active;

END $$;
