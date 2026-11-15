-- Apply after query 3.sql (and query 4.sql, if used). Run this migration last.
-- Reviews remain disabled until an order-linked review workflow is implemented.
BEGIN;

-- Preserve old testimonials and rating metadata in a non-public archive.
CREATE SCHEMA IF NOT EXISTS review_cleanup_archive;
REVOKE ALL ON SCHEMA review_cleanup_archive FROM PUBLIC, anon, authenticated;
CREATE TABLE IF NOT EXISTS review_cleanup_archive.reviews (
  id bigint PRIMARY KEY, snapshot jsonb NOT NULL
);
CREATE TABLE IF NOT EXISTS review_cleanup_archive.product_ratings (
  id bigint PRIMARY KEY, snapshot jsonb NOT NULL
);
REVOKE ALL ON ALL TABLES IN SCHEMA review_cleanup_archive FROM PUBLIC, anon, authenticated;
INSERT INTO review_cleanup_archive.reviews
  SELECT id, to_jsonb(r) FROM public.reviews r ON CONFLICT (id) DO NOTHING;
INSERT INTO review_cleanup_archive.product_ratings
  SELECT id, jsonb_build_object('rating', rating, 'reviews_count', reviews_count)
  FROM public.products ON CONFLICT (id) DO NOTHING;

DELETE FROM public.reviews;
UPDATE public.products SET rating = NULL, reviews_count = 0;
ALTER TABLE public.products ALTER COLUMN rating DROP DEFAULT;
ALTER TABLE public.products ALTER COLUMN reviews_count SET DEFAULT 0;
ALTER TABLE public.products DROP CONSTRAINT IF EXISTS product_reviews_disabled;
ALTER TABLE public.products ADD CONSTRAINT product_reviews_disabled
  CHECK (rating IS NULL AND reviews_count IS NOT NULL AND reviews_count = 0);
ALTER TABLE public.reviews ALTER COLUMN rating DROP DEFAULT;
ALTER TABLE public.reviews ALTER COLUMN verified SET DEFAULT FALSE;

-- Remove legacy policies that allowed seeded testimonials to be shown to customers.
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
DO $$ DECLARE p record; BEGIN
  FOR p IN SELECT policyname FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'reviews' LOOP
    EXECUTE format('DROP POLICY %I ON public.reviews', p.policyname);
  END LOOP;
END $$;
REVOKE ALL ON public.reviews FROM PUBLIC, anon, authenticated;
GRANT SELECT, DELETE ON public.reviews TO authenticated;
CREATE POLICY "Owner review inspection" ON public.reviews FOR SELECT TO authenticated
  USING (public.is_store_admin());
CREATE POLICY "Owner review removal" ON public.reviews FOR DELETE TO authenticated
  USING (public.is_store_admin());

COMMIT;
