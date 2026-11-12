-- Apply after query 2.sql. Non-destructive: preserves users, products, and orders.
-- Online checkout remains closed until server-verified payments are implemented.
BEGIN;
DO $$ BEGIN
  IF to_regprocedure('public.is_store_admin()') IS NULL THEN
    RAISE EXCEPTION 'Run query 2.sql first';
  END IF;
END $$;

ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_status text NOT NULL DEFAULT 'unverified';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS refund_status text NOT NULL DEFAULT 'none';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS cancellation_requested_at timestamptz;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS cancellation_reason text;
-- Historical orders cannot safely be assumed to have reserved stock. Reconcile them manually.
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS inventory_reserved boolean NOT NULL DEFAULT false;

-- Reserve and mark stock in the same transaction; cancellation restores it once.
CREATE OR REPLACE FUNCTION public.reserve_order_inventory()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE line jsonb; quantity integer;
BEGIN
  IF NEW.items IS NULL OR jsonb_typeof(NEW.items)<>'array' OR jsonb_array_length(NEW.items)=0 THEN
    RAISE EXCEPTION 'An order must contain products';
  END IF;
  FOR line IN SELECT value FROM jsonb_array_elements(NEW.items) ORDER BY (value->>'id')::bigint LOOP
    quantity := (line->>'qty')::integer;
    IF quantity IS NULL OR quantity<=0 THEN RAISE EXCEPTION 'Invalid product quantity'; END IF;
    UPDATE public.products SET stock=stock-quantity,is_out_of_stock=(stock-quantity=0)
      WHERE id=(line->>'id')::bigint AND stock>=quantity AND NOT is_out_of_stock;
    IF NOT FOUND THEN RAISE EXCEPTION 'Product unavailable or insufficient stock'; END IF;
  END LOOP;
  NEW.inventory_reserved := true;
  RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS reserve_order_inventory ON public.orders;
CREATE TRIGGER reserve_order_inventory BEFORE INSERT ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.reserve_order_inventory();

-- Close the old browser insert path, even if earlier migrations left permissive policies.
DO $$ DECLARE p record; BEGIN
  FOR p IN SELECT tablename, policyname FROM pg_policies WHERE schemaname='public'
    AND tablename IN ('orders','products','areas','reviews','profiles') LOOP
    EXECUTE format('DROP POLICY %I ON public.%I', p.policyname, p.tablename);
  END LOOP;
END $$;
REVOKE ALL ON public.orders, public.products, public.areas, public.reviews, public.profiles FROM anon, authenticated;
GRANT SELECT ON public.orders, public.products, public.areas, public.reviews, public.profiles TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.products, public.areas, public.reviews TO authenticated;
GRANT UPDATE (full_name, phone, address) ON public.profiles TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE public.products_id_seq, public.areas_id_seq, public.reviews_id_seq TO authenticated;
CREATE POLICY "Read own orders" ON public.orders FOR SELECT TO authenticated
  USING (user_id=auth.uid() OR public.is_store_admin());
CREATE POLICY "Read catalog" ON public.products FOR SELECT TO authenticated USING (true);
CREATE POLICY "Manage catalog" ON public.products FOR ALL TO authenticated
  USING (public.is_store_admin()) WITH CHECK (public.is_store_admin());
CREATE POLICY "Read delivery zones" ON public.areas FOR SELECT TO authenticated USING (true);
CREATE POLICY "Manage delivery zones" ON public.areas FOR ALL TO authenticated
  USING (public.is_store_admin()) WITH CHECK (public.is_store_admin());
CREATE POLICY "Read reviews" ON public.reviews FOR SELECT TO authenticated USING (true);
CREATE POLICY "Manage reviews" ON public.reviews FOR ALL TO authenticated
  USING (public.is_store_admin()) WITH CHECK (public.is_store_admin());
CREATE POLICY "Read own profile" ON public.profiles FOR SELECT TO authenticated
  USING (id=auth.uid() OR public.is_store_admin());
CREATE POLICY "Update own profile" ON public.profiles FOR UPDATE TO authenticated
  USING (id=auth.uid()) WITH CHECK (id=auth.uid());

-- Column grants alone do not protect privileged SECURITY DEFINER paths: the function
-- always creates customers and never consumes metadata roles.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
BEGIN
  INSERT INTO public.profiles(id,full_name,phone,role)
  VALUES(NEW.id,left(coalesce(NEW.raw_user_meta_data->>'full_name',''),100),
    left(coalesce(NEW.raw_user_meta_data->>'phone',''),20),'customer') ON CONFLICT(id) DO NOTHING;
  RETURN NEW;
END $$;

CREATE TABLE IF NOT EXISTS public.newsletter_subscriptions (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL, active boolean NOT NULL DEFAULT true,
  subscribed_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.newsletter_subscriptions ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.newsletter_subscriptions FROM anon, authenticated;
GRANT SELECT ON public.newsletter_subscriptions TO authenticated;
DROP POLICY IF EXISTS "Read subscriptions" ON public.newsletter_subscriptions;
CREATE POLICY "Read subscriptions" ON public.newsletter_subscriptions FOR SELECT TO authenticated
  USING (user_id=auth.uid() OR public.is_store_admin());
CREATE OR REPLACE FUNCTION public.subscribe_store_newsletter(subscriber_email text)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE account_email text;
BEGIN
  SELECT email INTO account_email FROM auth.users WHERE id=auth.uid() AND email_confirmed_at IS NOT NULL;
  IF account_email IS NULL OR lower(trim(subscriber_email))<>lower(account_email) THEN
    RAISE EXCEPTION 'Use your verified account email to subscribe';
  END IF;
  INSERT INTO public.newsletter_subscriptions(user_id,email,active) VALUES(auth.uid(),account_email,true)
    ON CONFLICT(user_id) DO UPDATE SET active=true,email=EXCLUDED.email,subscribed_at=now();
END $$;
CREATE OR REPLACE FUNCTION public.unsubscribe_store_newsletter()
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
BEGIN UPDATE public.newsletter_subscriptions SET active=false WHERE user_id=auth.uid(); END $$;

CREATE OR REPLACE FUNCTION public.request_order_cancellation(order_id text, reason text)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE target public.orders;
BEGIN
  SELECT * INTO target FROM public.orders WHERE id=order_id FOR UPDATE;
  IF NOT FOUND OR target.user_id IS DISTINCT FROM auth.uid() THEN RAISE EXCEPTION 'Order unavailable'; END IF;
  IF target.status IS NULL OR target.status NOT IN ('Pending','Processing') THEN RAISE EXCEPTION 'Only unshipped orders can be requested for cancellation'; END IF;
  IF length(trim(reason))<3 OR length(reason)>500 THEN RAISE EXCEPTION 'Enter a cancellation reason (3-500 characters)'; END IF;
  UPDATE public.orders SET cancellation_requested_at=coalesce(cancellation_requested_at,now()),
    cancellation_reason=trim(reason) WHERE id=order_id;
END $$;

CREATE OR REPLACE FUNCTION public.update_store_order_status(order_id text,new_status text)
RETURNS public.orders LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE target public.orders; line jsonb;
BEGIN
  IF NOT public.is_store_admin() THEN RAISE EXCEPTION 'Admin access required'; END IF;
  SELECT * INTO target FROM public.orders WHERE id=order_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Order not found'; END IF;
  IF target.status IS NULL OR new_status IS NULL OR new_status NOT IN ('Pending','Processing','Shipped','Delivered','Cancelled') THEN RAISE EXCEPTION 'Invalid order status transition'; END IF;
  IF target.status=new_status THEN RETURN target; END IF;
  IF NOT ((target.status='Pending' AND new_status IN ('Processing','Cancelled'))
    OR (target.status='Processing' AND new_status IN ('Shipped','Cancelled'))
    OR (target.status='Shipped' AND new_status='Delivered')) THEN RAISE EXCEPTION 'Invalid order status transition'; END IF;
  IF new_status='Cancelled' AND target.payment_status='paid' AND target.refund_status<>'refunded' THEN
    RAISE EXCEPTION 'Record and verify the provider refund before cancelling this paid order';
  END IF;
  IF new_status='Cancelled' AND target.inventory_reserved THEN
    FOR line IN SELECT value FROM jsonb_array_elements(target.items) ORDER BY (value->>'id')::bigint LOOP
      UPDATE public.products SET stock=stock+(line->>'qty')::integer,is_out_of_stock=false WHERE id=(line->>'id')::bigint;
    END LOOP;
  END IF;
  UPDATE public.orders SET status=new_status,inventory_reserved=CASE WHEN new_status='Cancelled' THEN false ELSE inventory_reserved END
    WHERE id=order_id RETURNING * INTO target;
  RETURN target;
END $$;
REVOKE ALL ON FUNCTION public.subscribe_store_newsletter(text),public.unsubscribe_store_newsletter(),
  public.request_order_cancellation(text,text),public.update_store_order_status(text,text) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.subscribe_store_newsletter(text),public.unsubscribe_store_newsletter(),
  public.request_order_cancellation(text,text),public.update_store_order_status(text,text) TO authenticated;
COMMIT;
