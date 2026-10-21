-- ============================================================
--  MOTHER NATURE STORE — SUPABASE AUTH SETUP (FIXED)
--  Run in: Dashboard → SQL Editor → New Query → Paste → Run
-- ============================================================


-- ════════════════════════════════════════════════════════════
--  STEP 1: CREATE ADMIN USER (via direct INSERT)
--  ⚠ Run this ONLY if the admin account doesn't exist yet.
--  This uses pgcrypto to hash the password correctly.
-- ════════════════════════════════════════════════════════════

INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_user_meta_data,
  raw_app_meta_data,
  is_super_admin,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
)
VALUES (
  '00000000-0000-0000-0000-000000000000',   -- instance_id (always this value)
  gen_random_uuid(),                         -- auto-generate user id
  'authenticated',
  'authenticated',
  'admin@mothernature.in',                   -- ← CHANGE: your admin email
  crypt('Admin@2025#MN', gen_salt('bf')),   -- ← CHANGE: your admin password
  NOW(),                                     -- marks email as confirmed
  '{"role": "admin", "full_name": "Mother Nature Admin"}'::jsonb,
  '{"provider": "email", "providers": ["email"]}'::jsonb,
  FALSE,
  NOW(),
  NOW(),
  '', '', '', ''
)
ON CONFLICT (email) DO NOTHING;  -- safe to re-run


-- ════════════════════════════════════════════════════════════
--  STEP 2: MARK AN EXISTING USER AS ADMIN
--  ✅ Use this if the admin already signed up via the website
--     OR after creating via the Supabase Dashboard UI.
--
--  Dashboard method (easiest):
--    1. Go to Authentication → Users
--    2. Click "Add user" → enter email + password
--    3. Then run only this STEP 2 query below
-- ════════════════════════════════════════════════════════════

UPDATE auth.users
SET
  raw_user_meta_data = raw_user_meta_data
    || '{"role": "admin", "full_name": "Mother Nature Admin"}'::jsonb,
  email_confirmed_at = COALESCE(email_confirmed_at, NOW()),
  updated_at = NOW()
WHERE email = 'admin@mothernature.in';   -- ← CHANGE: your admin email


-- ════════════════════════════════════════════════════════════
--  STEP 3: CREATE PROFILES TABLE
--  Stores app-level user data (name, phone, address, role).
-- ════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name   TEXT,
  phone       TEXT,
  role        TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  address     JSONB DEFAULT '{}'::jsonb,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);


-- ════════════════════════════════════════════════════════════
--  STEP 4: AUTO-CREATE PROFILE ON SIGNUP (Trigger)
-- ════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'customer')
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    phone     = EXCLUDED.phone,
    role      = EXCLUDED.role,
    updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ════════════════════════════════════════════════════════════
--  STEP 5: SYNC EXISTING ADMIN USER INTO PROFILES TABLE
--  Run after Step 1 or Step 2 to make sure profile row exists.
-- ════════════════════════════════════════════════════════════

INSERT INTO public.profiles (id, full_name, phone, role)
SELECT
  id,
  COALESCE(raw_user_meta_data->>'full_name', 'Admin'),
  COALESCE(raw_user_meta_data->>'phone', ''),
  'admin'
FROM auth.users
WHERE email = 'admin@mothernature.in'   -- ← CHANGE: your admin email
ON CONFLICT (id) DO UPDATE SET
  role       = 'admin',
  updated_at = NOW();


-- ════════════════════════════════════════════════════════════
--  STEP 6: ROW LEVEL SECURITY (RLS)
-- ════════════════════════════════════════════════════════════

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Users can view their own profile
DROP POLICY IF EXISTS "Users can view own profile"   ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR ALL
  USING (
    (SELECT raw_user_meta_data->>'role'
     FROM auth.users WHERE id = auth.uid()) = 'admin'
  );


-- ════════════════════════════════════════════════════════════
--  STEP 7: VERIFY — Run this to confirm setup is correct
-- ════════════════════════════════════════════════════════════

SELECT
  u.id,
  u.email,
  u.raw_user_meta_data->>'role'      AS role,
  u.raw_user_meta_data->>'full_name' AS full_name,
  u.email_confirmed_at IS NOT NULL    AS email_verified,
  p.role                              AS profile_role,
  u.created_at
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
ORDER BY u.created_at DESC;


-- ════════════════════════════════════════════════════════════
--  QUICK REFERENCE
-- ════════════════════════════════════════════════════════════
--
--  Customer Login:  http://localhost:5173/login
--  Admin Login:     http://localhost:5173/admin/login
--
--  To add more admins later — just run Step 2 with their email.
--
--  Also add their email to ADMIN_EMAILS in:
--    src/context/AuthContext.jsx  (line ~12)
--
-- ════════════════════════════════════════════════════════════
