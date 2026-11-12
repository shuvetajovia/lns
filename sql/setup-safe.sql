-- Fresh databases only: creates missing business tables, without deleting data or granting public access.
-- Then run query 2.sql followed by query 3.sql. Add your real products through the admin.
BEGIN;
CREATE TABLE IF NOT EXISTS public.products (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    tamil_name TEXT,
    sanskrit_name TEXT,
    slug TEXT,
    price NUMERIC(10, 2) NOT NULL DEFAULT 0,
    old_price NUMERIC(10, 2) DEFAULT 0,
    category TEXT NOT NULL,
    category_id TEXT NOT NULL,
    image TEXT NOT NULL,
    gallery JSONB DEFAULT '[]'::jsonb,
    rating NUMERIC(3, 2) DEFAULT 4.9,
    reviews_count INTEGER DEFAULT 0,
    weight TEXT DEFAULT '500g',
    is_best_seller BOOLEAN DEFAULT FALSE,
    is_new_arrival BOOLEAN DEFAULT FALSE,
    badge TEXT,
    dosha TEXT,
    short_desc TEXT,
    description TEXT,
    ayurvedic_properties JSONB DEFAULT '{}'::jsonb,
    ingredients TEXT,
    how_to_use TEXT,
    sourcing_info TEXT,
    variants JSONB DEFAULT '[]'::jsonb,
    stock INTEGER NOT NULL DEFAULT 25,
    is_out_of_stock BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Indexing for fast search and category filtering
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_stock ON public.products(stock);
CREATE INDEX IF NOT EXISTS idx_products_out_of_stock ON public.products(is_out_of_stock);

-- 3. CREATE ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_email TEXT,
    door_no TEXT,
    building_no TEXT,
    street_name TEXT,
    landmark TEXT,
    district TEXT,
    pincode TEXT,
    items JSONB DEFAULT '[]'::jsonb,
    subtotal NUMERIC(10, 2) DEFAULT 0,
    delivery_fee NUMERIC(10, 2) DEFAULT 0,
    discount NUMERIC(10, 2) DEFAULT 0,
    total NUMERIC(10, 2) NOT NULL DEFAULT 0,
    payment_method TEXT DEFAULT 'Online (Razorpay)',
    payment_id TEXT,
    status TEXT DEFAULT 'Pending',
    date TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_phone ON public.orders(customer_phone);

-- 4. CREATE DELIVERY AREAS TABLE
CREATE TABLE IF NOT EXISTS public.areas (
    id BIGSERIAL PRIMARY KEY,
    district TEXT UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. CREATE CUSTOMER REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.reviews (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    location TEXT,
    avatar TEXT,
    rating INTEGER DEFAULT 5,
    verified BOOLEAN DEFAULT TRUE,
    product TEXT,
    title TEXT,
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);


COMMIT;
