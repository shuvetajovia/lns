-- Run ONCE in this project's Supabase SQL Editor after creating the business tables.
-- Uses the existing admin account. No passwords are created or changed.
-- Safe to rerun; run this AFTER query1.sql (which recreates permissive policies).
BEGIN;

CREATE TABLE IF NOT EXISTS public.store_admin (
  singleton boolean PRIMARY KEY DEFAULT true CHECK (singleton),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE RESTRICT
);
ALTER TABLE public.store_admin ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.store_admin FROM anon, authenticated;

DO $$
DECLARE admin_id uuid;
BEGIN
  SELECT id INTO admin_id FROM auth.users WHERE lower(email) = 'admin@mothernature.in';
  IF admin_id IS NULL THEN
    RAISE EXCEPTION 'Create admin@mothernature.in in Authentication > Users first.';
  END IF;
  INSERT INTO public.store_admin (singleton, user_id) VALUES (true, admin_id)
    ON CONFLICT (singleton) DO UPDATE SET user_id = EXCLUDED.user_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.is_store_admin()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = ''
AS $$ SELECT EXISTS (SELECT 1 FROM public.store_admin WHERE user_id = (SELECT auth.uid())); $$;
REVOKE ALL ON FUNCTION public.is_store_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_store_admin() TO authenticated;

CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text, phone text,
  role text DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  address jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(), updated_at timestamptz DEFAULT now()
);
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone, role)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''), 'customer')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
INSERT INTO public.profiles (id, full_name, phone, role)
SELECT id, COALESCE(raw_user_meta_data->>'full_name', ''), COALESCE(raw_user_meta_data->>'phone', ''),
  CASE WHEN id = (SELECT user_id FROM public.store_admin) THEN 'admin' ELSE 'customer' END
FROM auth.users
ON CONFLICT (id) DO UPDATE SET role = EXCLUDED.role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Replace existing policies, including the original public-write policies.
DO $$
DECLARE policy_record record;
BEGIN
  FOR policy_record IN SELECT schemaname, tablename, policyname FROM pg_policies
    WHERE schemaname = 'public' AND tablename IN ('profiles', 'products', 'orders', 'areas', 'reviews')
  LOOP
    EXECUTE format('DROP POLICY %I ON %I.%I', policy_record.policyname, policy_record.schemaname, policy_record.tablename);
  END LOOP;
END;
$$;
REVOKE ALL ON public.profiles FROM anon, authenticated;
GRANT SELECT ON public.profiles TO authenticated;
GRANT UPDATE (full_name, phone, address) ON public.profiles TO authenticated;
CREATE POLICY "Account profile read" ON public.profiles FOR SELECT TO authenticated
  USING (id = (SELECT auth.uid()) OR (SELECT public.is_store_admin()));
CREATE POLICY "Account profile update" ON public.profiles FOR UPDATE TO authenticated
  USING (id = (SELECT auth.uid())) WITH CHECK (id = (SELECT auth.uid()));

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.products, public.areas, public.orders, public.reviews FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.products, public.areas, public.orders, public.reviews TO authenticated;
CREATE POLICY "Signed in catalog" ON public.products FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin catalog management" ON public.products FOR ALL TO authenticated
  USING ((SELECT public.is_store_admin())) WITH CHECK ((SELECT public.is_store_admin()));
CREATE POLICY "Signed in delivery zones" ON public.areas FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin delivery management" ON public.areas FOR ALL TO authenticated
  USING ((SELECT public.is_store_admin())) WITH CHECK ((SELECT public.is_store_admin()));

ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);
ALTER TABLE public.orders ALTER COLUMN user_id SET DEFAULT auth.uid();
CREATE INDEX IF NOT EXISTS orders_user_id_idx ON public.orders(user_id);
CREATE POLICY "Customer order read" ON public.orders FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()) OR (SELECT public.is_store_admin()));
CREATE POLICY "Customer order creation" ON public.orders FOR INSERT TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));
CREATE POLICY "Admin order management" ON public.orders FOR ALL TO authenticated
  USING ((SELECT public.is_store_admin())) WITH CHECK ((SELECT public.is_store_admin()));

-- Customers cannot update the catalog. Decrement inventory atomically on order creation.
CREATE OR REPLACE FUNCTION public.reserve_order_inventory()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE line jsonb; quantity integer;
BEGIN
  IF jsonb_typeof(NEW.items) <> 'array' OR jsonb_array_length(NEW.items) = 0 THEN
    RAISE EXCEPTION 'An order must contain products';
  END IF;
  FOR line IN SELECT value FROM jsonb_array_elements(NEW.items) ORDER BY (value->>'id')::bigint
  LOOP
    quantity := (line->>'qty')::integer;
    IF quantity IS NULL OR quantity <= 0 THEN RAISE EXCEPTION 'Invalid product quantity'; END IF;
    UPDATE public.products SET stock = stock - quantity, is_out_of_stock = (stock - quantity = 0)
      WHERE id = (line->>'id')::bigint AND stock >= quantity AND NOT is_out_of_stock;
    IF NOT FOUND THEN RAISE EXCEPTION 'Product unavailable or insufficient stock'; END IF;
  END LOOP;
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.reserve_order_inventory() FROM PUBLIC, anon, authenticated;
DROP TRIGGER IF EXISTS reserve_order_inventory ON public.orders;
CREATE TRIGGER reserve_order_inventory AFTER INSERT ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.reserve_order_inventory();
CREATE POLICY "Signed in reviews" ON public.reviews FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin review management" ON public.reviews FOR ALL TO authenticated
  USING ((SELECT public.is_store_admin())) WITH CHECK ((SELECT public.is_store_admin()));
COMMIT;
-- Verify the singleton assignment without exposing credentials.
SELECT u.email FROM public.store_admin s JOIN auth.users u ON u.id = s.user_id;
