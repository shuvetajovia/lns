-- Run after query 3.sql in Supabase SQL Editor.
-- Indian mobile numbers are stored as +91 followed by ten digits.
-- Existing missing numbers remain NULL until supplied. Invalid or duplicate
-- existing numbers abort the entire migration for manual correction.
BEGIN;
LOCK TABLE public.profiles IN ACCESS EXCLUSIVE MODE;

CREATE OR REPLACE FUNCTION public.normalize_mobile(value text)
RETURNS text LANGUAGE plpgsql IMMUTABLE SET search_path='' AS $$
DECLARE digits text;
BEGIN
  digits := regexp_replace(btrim(coalesce(value,'')), '[ ()-]', '', 'g');
  IF left(digits,3) = '+91' THEN digits := substr(digits,4); END IF;
  IF digits !~ '^[6-9][0-9]{9}$' THEN
    RAISE EXCEPTION 'Enter a valid 10-digit Indian mobile number, optionally starting with +91.'
      USING ERRCODE='23514';
  END IF;
  RETURN '+91' || digits;
END $$;

-- Diagnose invalid existing values before normalizing.
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM public.profiles
    WHERE nullif(btrim(phone),'') IS NOT NULL
      AND regexp_replace(btrim(phone),'[ ()-]','','g') !~ '^(\+91)?[6-9][0-9]{9}$'
  ) THEN
    RAISE EXCEPTION 'Some existing profiles have invalid mobile numbers. Correct them before rerunning query 4.sql.';
  END IF;
  IF EXISTS (
    SELECT public.normalize_mobile(phone) FROM public.profiles
    WHERE nullif(btrim(phone),'') IS NOT NULL
    GROUP BY public.normalize_mobile(phone) HAVING count(*) > 1
  ) THEN
    RAISE EXCEPTION 'Existing accounts share a mobile number. Resolve duplicates before rerunning query 4.sql.';
  END IF;
END $$;

DROP TRIGGER IF EXISTS enforce_profile_mobile ON public.profiles;
UPDATE public.profiles SET phone = CASE
  WHEN nullif(btrim(phone),'') IS NULL THEN NULL
  ELSE public.normalize_mobile(phone) END;

CREATE UNIQUE INDEX IF NOT EXISTS profiles_mobile_unique ON public.profiles(phone);

CREATE OR REPLACE FUNCTION public.enforce_profile_mobile()
RETURNS trigger LANGUAGE plpgsql SET search_path='' AS $$
BEGIN
  NEW.phone := public.normalize_mobile(NEW.phone);
  RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS enforce_profile_mobile ON public.profiles;
CREATE TRIGGER enforce_profile_mobile BEFORE INSERT OR UPDATE OF phone ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.enforce_profile_mobile();

-- Auth signup and its profile insert succeed or fail in one transaction.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
BEGIN
  INSERT INTO public.profiles(id,full_name,phone,role)
  VALUES(NEW.id,left(coalesce(NEW.raw_user_meta_data->>'full_name',''),100),
    public.normalize_mobile(NEW.raw_user_meta_data->>'phone'),'customer');
  RETURN NEW;
END $$;
COMMIT;
