-- ==============================================================================
-- Mother Nature — Supabase Database Setup & Schema
-- File: sql/query1.sql
-- Description:
--   Complete database initialization script for Mother Nature Ayurveda Store.
--   Run this in your Supabase SQL Editor:
--   https://supabase.com/dashboard/project/xdppczyeztarvralihtt/sql/new
--
-- Features included:
--   1. Products table with dynamic stock, out_of_stock flags, and variants (JSONB)
--   2. Orders table for tracking live customer orders, status, and deliveries
--   3. Delivery Areas (Zones) table for district and pincode availability
--   4. Customer Reviews & Ratings table
--   5. Full Row Level Security (RLS) policies allowing public browsing & admin mutations
--   6. Complete seed dataset for all 16 Heritage Ayurveda products
--   7. Sample delivery districts and verified customer reviews
-- ==============================================================================

-- 1. DROP EXISTING TABLES IF NEEDED (Clean slate for query1)
DROP TABLE IF EXISTS public.reviews CASCADE;
DROP TABLE IF EXISTS public.areas CASCADE;
DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;

-- 2. CREATE PRODUCTS TABLE
CREATE TABLE public.products (
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
CREATE TABLE public.orders (
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
CREATE TABLE public.areas (
    id BIGSERIAL PRIMARY KEY,
    district TEXT UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. CREATE CUSTOMER REVIEWS TABLE
CREATE TABLE public.reviews (
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

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Configured to allow seamless storefront browsing and admin CRUD actions
-- ==============================================================================

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Products Policies
CREATE POLICY "Public Read Products" 
    ON public.products FOR SELECT 
    USING (true);

CREATE POLICY "Public Insert Products" 
    ON public.products FOR INSERT 
    WITH CHECK (true);

CREATE POLICY "Public Update Products" 
    ON public.products FOR UPDATE 
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Public Delete Products" 
    ON public.products FOR DELETE 
    USING (true);

-- Orders Policies
CREATE POLICY "Public Read Orders" 
    ON public.orders FOR SELECT 
    USING (true);

CREATE POLICY "Public Insert Orders" 
    ON public.orders FOR INSERT 
    WITH CHECK (true);

CREATE POLICY "Public Update Orders" 
    ON public.orders FOR UPDATE 
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Public Delete Orders" 
    ON public.orders FOR DELETE 
    USING (true);

-- Areas Policies
CREATE POLICY "Public Read Areas" 
    ON public.areas FOR SELECT 
    USING (true);

CREATE POLICY "Public Insert Areas" 
    ON public.areas FOR INSERT 
    WITH CHECK (true);

CREATE POLICY "Public Update Areas" 
    ON public.areas FOR UPDATE 
    USING (true);

CREATE POLICY "Public Delete Areas" 
    ON public.areas FOR DELETE 
    USING (true);

-- Reviews Policies
CREATE POLICY "Public Read Reviews" 
    ON public.reviews FOR SELECT 
    USING (true);

CREATE POLICY "Public Insert Reviews" 
    ON public.reviews FOR INSERT 
    WITH CHECK (true);

CREATE POLICY "Public Delete Reviews" 
    ON public.reviews FOR DELETE 
    USING (true);

-- ==============================================================================
-- AUTOMATIC TRIGGER: UPDATE updated_at ON PRODUCTS
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    -- Automatically flag as out of stock if stock reaches 0 or below
    IF NEW.stock <= 0 THEN
        NEW.is_out_of_stock = TRUE;
        NEW.stock = 0;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_products_updated_at ON public.products;
CREATE TRIGGER trigger_products_updated_at
    BEFORE UPDATE ON public.products
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- ==============================================================================
-- INITIAL SEED DATA: 16 HERITAGE AYURVEDA PRODUCTS
-- ==============================================================================
INSERT INTO public.products (
    id, name, tamil_name, sanskrit_name, slug, price, old_price, 
    category, category_id, image, gallery, rating, reviews_count, weight, 
    is_best_seller, is_new_arrival, badge, dosha, short_desc, description, 
    ayurvedic_properties, ingredients, how_to_use, sourcing_info, variants, stock, is_out_of_stock
) VALUES
(
    1,
    'Karuppu Kavuni Royal Black Rice',
    'கருப்பு கவுனி அரிசி',
    'Krishna Dhanya',
    'karuppu-kavuni-rice',
    210.00,
    250.00,
    'Heritage Rice',
    'heritage-rice',
    'https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?auto=format&fit=crop&q=80&w=800',
    '["https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?auto=format&fit=crop&q=80&w=800", "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=800"]'::jsonb,
    4.9,
    148,
    '500g',
    TRUE,
    FALSE,
    'ROYAL HARVEST',
    'Balances Vata & Pitta',
    'Ancient royal heirloom black rice with dense anthocyanin antioxidants and ancestral longevity nourishment.',
    'Sourced from chemical-free organic heritage fields of Tamil Nadu, Karuppu Kavuni was historically patronized by the royal Chola and Pandyan dynasties for strength and vitality. Rich in anthocyanins, its whole unpolished grain retains 100% natural fiber and minerals.',
    '{"rasa": "Madhura (Sweet), Kashaya (Astringent)", "virya": "Sheeta (Cooling)", "vipaka": "Madhura (Sweet)", "doshaEffect": "Pacifies Vata & Pitta gently"}'::jsonb,
    '100% Single-Origin Heirloom Karuppu Kavuni Paddy, traditionally dehusked with whole bran intact.',
    'Soak for 4-6 hours. Boil with 1:3 water in a clay pot or pressure cooker for 4 whistles. Ideal for rejuvenating Kavuni Kanji, sweet payasam, or daily nutritious meals.',
    'Directly farm-sourced from smallholder organic farmers in Kanchipuram & Thanjavur, Tamil Nadu.',
    '[{"weight": "500g", "price": 210, "oldPrice": 250}, {"weight": "1kg", "price": 399, "oldPrice": 480}, {"weight": "2kg", "price": 760, "oldPrice": 920}]'::jsonb,
    25,
    FALSE
),
(
    2,
    'Bamboo Rice (Moongil Arisi)',
    'மூங்கில் அரிசி',
    'Venu Yava',
    'bamboo-rice',
    420.00,
    480.00,
    'Heritage Rice',
    'heritage-rice',
    'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=800',
    '["https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=800"]'::jsonb,
    4.8,
    90,
    '250g',
    FALSE,
    TRUE,
    'RARE BOTANICAL',
    'Asthi Strengthening',
    'Rare seeds harvested from dying flowering bamboo once in 40-50 years; exceptional calcium for bones and joints.',
    'Documented in classical botanical Nighantus as Venu Yava, this rare harvest is an extraordinary source of plant-based calcium, protein, and silicon that nourishes bone marrow and joint flexibility.',
    '{"rasa": "Kashaya, Madhura", "virya": "Sheeta", "vipaka": "Katu", "doshaEffect": "Strengthens bones, calms joint inflammation"}'::jsonb,
    '100% Wild Forest Foraged Bamboo Seeds.',
    'Soak for 6 hours. Pressure cook 1:2.5 water for 5 whistles. Delicious as nutritious breakfast kheer or therapeutic kanji.',
    'Wild-foraged sustainably by tribal communities in Western Ghats.',
    '[{"weight": "250g", "price": 420, "oldPrice": 480}, {"weight": "500g", "price": 790, "oldPrice": 920}]'::jsonb,
    14,
    FALSE
),
(
    3,
    'Nava Rice Heritage 9-Grain Blend',
    'நவ அரிசி',
    'Nava Dhanya',
    'nava-rice',
    180.00,
    220.00,
    'Heritage Rice',
    'heritage-rice',
    'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800',
    '["https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800"]'::jsonb,
    4.9,
    116,
    '500g',
    TRUE,
    FALSE,
    'ANCESTRAL BLEND',
    'Tridoshic',
    'A master blend of 9 traditional heritage Tamil rice varieties for comprehensive daily vitality.',
    'Combines Karuppu Kavuni, Mappillai Samba, Poongar, Kaatuyanam, and Kullakar. Each variety brings unique phytonutrients, trace minerals, and vitamins for holistic body rejuvenation.',
    '{"rasa": "Madhura, Kashaya", "virya": "Sheeta", "vipaka": "Madhura", "doshaEffect": "Balanced multi-spectrum nourishment"}'::jsonb,
    '100% Blend of 9 Unpolished Heritage Rice Varieties.',
    'Soak for 3-4 hours. Cook 1:3 water ratio for 4 whistles.',
    'Grown in Kanchipuram and Cauvery delta organic farms.',
    '[{"weight": "500g", "price": 180, "oldPrice": 220}, {"weight": "1kg", "price": 340, "oldPrice": 410}]'::jsonb,
    30,
    FALSE
),
(
    4,
    'Mappillai Samba Heritage Stamina Grain',
    'மாப்பிள்ளை சம்பா அரிசி',
    'Balya Rakta Dhanya',
    'mappillai-samba-rice',
    195.00,
    230.00,
    'Heritage Rice',
    'heritage-rice',
    'https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?auto=format&fit=crop&q=80&w=800',
    '["https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?auto=format&fit=crop&q=80&w=800"]'::jsonb,
    4.9,
    138,
    '500g',
    TRUE,
    FALSE,
    'BALYA RASAYANA',
    'Vata & Pitta Friendly',
    'Legendary red heritage grain traditionally fed to newly married bridegrooms for physical endurance.',
    'A rich red rice packed with natural iron, zinc, and bioflavonoids. Fortifies physical stamina, calms gastric ulcer irritation, and restores endurance after physical exhaustion.',
    '{"rasa": "Madhura, Kashaya", "virya": "Sheeta", "vipaka": "Madhura", "doshaEffect": "Enhances Ojas, builds bodily strength (Bala)"}'::jsonb,
    '100% Unpolished Red Mappillai Samba Rice.',
    'Soak for 4 hours. Cook with 1:3 water.',
    'Organically grown by heirloom seed conservators in Tamil Nadu.',
    '[{"weight": "500g", "price": 195, "oldPrice": 230}, {"weight": "1kg", "price": 370, "oldPrice": 440}]'::jsonb,
    45,
    FALSE
),
(
    5,
    'Kullakar Organic Red Rice',
    'குள்ளக்கார் அரிசி',
    'Kullakar Red Paddy',
    'kullakar-rice',
    205.00,
    240.00,
    'Heritage Rice',
    'heritage-rice',
    'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=800',
    '["https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=800"]'::jsonb,
    4.8,
    42,
    '500g',
    FALSE,
    FALSE,
    'RED GRAIN',
    'Immunity Fortifier',
    'Ancient indigenous short-duration red rice, rich in zinc and protective flavonoids.',
    'Kullakar is one of South India''s oldest native paddy varieties. It contains significant amounts of bio-active zinc, iron, and flavonoids in its red outer bran coat.',
    '{"rasa": "Madhura, Kashaya", "virya": "Sheeta", "vipaka": "Madhura", "doshaEffect": "Rebuilds natural metabolic vitality"}'::jsonb,
    '100% Unpolished Kullakar Red Rice.',
    'Soak for 4 hours. Pressure cook 1:3 water for 4 whistles.',
    'Cultivated in Kanchipuram heritage farmland.',
    '[{"weight": "500g", "price": 205, "oldPrice": 240}, {"weight": "1kg", "price": 390, "oldPrice": 460}]'::jsonb,
    20,
    FALSE
),
(
    6,
    'Organic Thinai (Foxtail Millet)',
    'தினை',
    'Kangani Seed',
    'thinai-foxtail-millet',
    115.00,
    140.00,
    'Ancient Millets',
    'ancient-millets',
    'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=800',
    '["https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=800"]'::jsonb,
    4.8,
    75,
    '500g',
    TRUE,
    FALSE,
    'VITALITY SEED',
    'Tridosha Balancing',
    'Ancient Sangam grain celebrated as the food of Murugan; rich in natural Vitamin B12 and fiber.',
    'Mentioned in Sangam literature, Thinai is an ancient wonder seed. Free from synthetic chemicals, it is rich in Vitamin B12, heart-friendly magnesium, and dietary fiber that supports active metabolic health.',
    '{"rasa": "Madhura, Kashaya", "virya": "Sheeta", "vipaka": "Madhura", "doshaEffect": "Balances Tridosha, strengthens nerves"}'::jsonb,
    '100% Pure Organic Unpolished Foxtail Millet.',
    'Soak 30 mins. Cook 1:2.5 water for 15 mins for pongal or upma.',
    'Direct from rainfed organic farming clusters.',
    '[{"weight": "500g", "price": 115, "oldPrice": 140}, {"weight": "1kg", "price": 215, "oldPrice": 260}]'::jsonb,
    40,
    FALSE
),
(
    7,
    'Organic Kuthiraivali (Barnyard Millet)',
    'குதிரைவாலி',
    'Shyamaka Grain',
    'kuthiraivali-barnyard-millet',
    135.00,
    160.00,
    'Ancient Millets',
    'ancient-millets',
    'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800',
    '["https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800"]'::jsonb,
    4.8,
    63,
    '500g',
    FALSE,
    FALSE,
    'FIBER RICH',
    'Kapha Pacifying',
    'Highest dietary fiber among millets; low glycemic index for easy weight control and gut health.',
    'Barnyard millet is celebrated for having 6 times more fiber than wheat and white rice. Promotes lasting satiety and assists healthy cholesterol management.',
    '{"rasa": "Madhura, Kashaya", "virya": "Sheeta", "vipaka": "Katu", "doshaEffect": "Alleviates excess Kapha and Medas"}'::jsonb,
    '100% Single-Origin Organic Barnyard Millet.',
    'Soak 30 mins. Cook 1:2.5 water for 12 mins.',
    'Sourced from traditional dryland farmers.',
    '[{"weight": "500g", "price": 135, "oldPrice": 160}, {"weight": "1kg", "price": 250, "oldPrice": 300}]'::jsonb,
    35,
    FALSE
),
(
    8,
    'Organic Samai (Little Millet)',
    'சாமை',
    'Kuttu Grain',
    'samai-little-millet',
    125.00,
    150.00,
    'Ancient Millets',
    'ancient-millets',
    'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=800',
    '["https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=800"]'::jsonb,
    4.7,
    51,
    '500g',
    FALSE,
    FALSE,
    'LIGHT & NOURISHING',
    'Easy on Agni',
    'Delicate small grain packed with iron and bio-flavonoids; perfect for infant and family nutrition.',
    'Revered in native kitchen traditions for its light, quick-cooking nature and high iron profile that rejuvenates energy levels naturally.',
    '{"rasa": "Madhura", "virya": "Sheeta", "vipaka": "Madhura", "doshaEffect": "Gentle on digestive Agni"}'::jsonb,
    '100% Organic Little Millet.',
    'Cook with 1:2 water for 10-12 minutes.',
    'Naturally stone-cleaned in Tamil Nadu.',
    '[{"weight": "500g", "price": 125, "oldPrice": 150}, {"weight": "1kg", "price": 235, "oldPrice": 280}]'::jsonb,
    28,
    FALSE
),
(
    9,
    'Organic Varagu (Kodo Millet)',
    'வரகு',
    'Kodrava Grain',
    'varagu-kodo-millet',
    130.00,
    160.00,
    'Ancient Millets',
    'ancient-millets',
    'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=800',
    '["https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=800"]'::jsonb,
    4.8,
    68,
    '500g',
    FALSE,
    FALSE,
    'ANTIOXIDANT',
    'Pitta & Kapha Balance',
    'Rich in protective polyphenols and lecithin; supports nervous system and cardiovascular health.',
    'Varagu was the ancestral staple of drought-prone regions. Delivers profound antioxidant activity and contains polyphenols that scavenge free radicals.',
    '{"rasa": "Kashaya, Madhura", "virya": "Sheeta", "vipaka": "Katu", "doshaEffect": "Reduces fat and detoxifies Rakta"}'::jsonb,
    '100% Organic Kodo Millet.',
    'Soak 1 hour. Pressure cook 1:3 water for 3 whistles.',
    'Direct from traditional millets growers.',
    '[{"weight": "500g", "price": 130, "oldPrice": 160}, {"weight": "1kg", "price": 245, "oldPrice": 300}]'::jsonb,
    32,
    FALSE
),
(
    10,
    'Pure Palm Jaggery (Karupatti)',
    'பனைவெல்லம்',
    'Tala Guda',
    'palm-jaggery',
    340.00,
    400.00,
    'Native Sweeteners',
    'native-sweeteners',
    'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=800',
    '["https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=800"]'::jsonb,
    4.9,
    168,
    '500g',
    TRUE,
    FALSE,
    'MINERAL RICH',
    'Tridoshic',
    'Authentic dark palmyra nectar boiled over wood fires. Packed with natural non-heme iron and minerals.',
    'Handcrafted from unfermented palmyra sap without sulphur, chemical lime, or artificial clarifiers. An unrefined ancestral sweetener that supports hemoglobin formation and purifies blood channels.',
    '{"rasa": "Madhura", "virya": "Sheeta", "vipaka": "Madhura", "doshaEffect": "Rejuvenates Rakta Dhatu and respiratory prana"}'::jsonb,
    '100% Pure Organic Palmyra Palm Nectar.',
    'Add to herbal teas, Sukku Malli coffee, or use as a mineral-dense natural alternative.',
    'Direct from traditional palmyra tappers of Tuticorin, Tamil Nadu.',
    '[{"weight": "500g", "price": 340, "oldPrice": 400}, {"weight": "1kg", "price": 650, "oldPrice": 780}]'::jsonb,
    28,
    FALSE
),
(
    11,
    'Pure Palm Candy (Panangarkandu)',
    'பனங்கற்கண்டு',
    'Tala Sharkara',
    'palm-candy',
    380.00,
    450.00,
    'Native Sweeteners',
    'native-sweeteners',
    'https://images.unsplash.com/photo-1587132137056-bfbf0166836e?auto=format&fit=crop&q=80&w=800',
    '["https://images.unsplash.com/photo-1587132137056-bfbf0166836e?auto=format&fit=crop&q=80&w=800"]'::jsonb,
    5.0,
    105,
    '200g',
    TRUE,
    FALSE,
    'SOOTHING SWEET',
    'Pitta Pacifier',
    'Crystallized palm nectar; time-tested Ayurvedic remedy for clearing throat irritation and building Ojas.',
    'Naturally crystallized from palmyra sap without sulphur bleaching. Renowned across South Indian homes for soothing persistent dry cough, soothing sore vocal cords, and cooling tropical summer body heat.',
    '{"rasa": "Madhura", "virya": "Sheeta", "vipaka": "Madhura", "doshaEffect": "Alleviates throat Pitta and excessive dryness"}'::jsonb,
    '100% Unrefined Palmyra Palm Crystal Sugar.',
    'Simmer with warm turmeric milk and crushed black pepper before bed.',
    'Naturally crystal-harvested in Tamil Nadu palm groves.',
    '[{"weight": "200g", "price": 380, "oldPrice": 450}, {"weight": "500g", "price": 890, "oldPrice": 1050}]'::jsonb,
    22,
    FALSE
),
(
    12,
    'Organic Country Sugar (Nattu Sakkarai)',
    'நாட்டு சர்க்கரை',
    'Ikshu Sharkara',
    'organic-country-sugar',
    95.00,
    120.00,
    'Native Sweeteners',
    'native-sweeteners',
    'https://images.unsplash.com/photo-1581441363689-1f3c3c414635?auto=format&fit=crop&q=80&w=800',
    '["https://images.unsplash.com/photo-1581441363689-1f3c3c414635?auto=format&fit=crop&q=80&w=800"]'::jsonb,
    4.8,
    112,
    '500g',
    FALSE,
    FALSE,
    'EVERYDAY SWEET',
    'Gentle on Gut',
    'Unrefined golden cane sugar retaining natural molasses and micro-minerals.',
    'Produced using non-GMO organic sugarcane juice boiled with herbal clarifying agents (okra stem extract). Free from sulphur and bleaching agents.',
    '{"rasa": "Madhura", "virya": "Sheeta", "vipaka": "Madhura", "doshaEffect": "Natural substitute for bleached white sugar"}'::jsonb,
    '100% Unrefined Organic Sugarcane Sugar.',
    'Use 1:1 in place of white sugar in teas, coffee, porridge, and baking.',
    'Direct from organic sugarcane jaggery units in Tamil Nadu.',
    '[{"weight": "500g", "price": 95, "oldPrice": 120}, {"weight": "1kg", "price": 180, "oldPrice": 230}]'::jsonb,
    50,
    FALSE
),
(
    13,
    'Saindhava Lavana (Pink Himalayan Rock Salt)',
    'இந்து உப்பு',
    'Saindhava Lavana',
    'himalayan-rock-salt',
    85.00,
    110.00,
    'Essential Minerals',
    'essential-minerals',
    'https://images.unsplash.com/photo-1610450531586-4ef35ef50ae3?auto=format&fit=crop&q=80&w=800',
    '["https://images.unsplash.com/photo-1610450531586-4ef35ef50ae3?auto=format&fit=crop&q=80&w=800"]'::jsonb,
    4.9,
    92,
    '500g',
    FALSE,
    TRUE,
    'SUPREME SALT',
    'Hridya (Heart Friendly)',
    'The only salt celebrated in Ayurvedic treatises as Hridya (gentle on the heart) and Chakshushya (beneficial for vision).',
    'Unlike commercial refined iodized table salts loaded with synthetic anti-caking chemicals, Saindhava Lavana contains 84 trace ionic minerals and does not aggravate Pitta or create heavy water retention.',
    '{"rasa": "Lavana (Salty), slightly sweet post-digestive", "virya": "Sheeta (Uniquely cooling unlike sea salt)", "vipaka": "Madhura", "doshaEffect": "Balances all three doshas without burning Agni"}'::jsonb,
    '100% Pristine Himalayan Mineral Rock Salt Crystals.',
    'Use in daily cooking, Ayurvedic Pachana tonics, warm salt water gargles, or Neti pot rituals.',
    'Mined from ancient unpolluted sea deposits.',
    '[{"weight": "500g", "price": 85, "oldPrice": 110}, {"weight": "1kg", "price": 160, "oldPrice": 200}]'::jsonb,
    60,
    FALSE
),
(
    14,
    'Pure Wild Forest Honey (Madhu)',
    'சுத்த மலைத்தேன்',
    'Aranya Madhu',
    'wild-forest-honey',
    450.00,
    550.00,
    'Forest Harvest',
    'forest-harvest',
    'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=800',
    '["https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=800"]'::jsonb,
    5.0,
    194,
    '500g',
    TRUE,
    FALSE,
    'YOGAVAHI',
    'Balances Kapha & Pitta',
    'Raw, unheated multifloral forest honey gathered ethically by indigenous honey hunters from deep floral reserves.',
    'In classical Ayurveda, raw honey is designated as Yogavahi—a sublime substance that penetrates deep micro-channels (Srotas) to carry therapeutic herbs without losing its own innate healing virtue. Unheated and unfiltered.',
    '{"rasa": "Madhura, Kashaya", "virya": "Ushna (Mild warming)", "vipaka": "Katu (Pungent)", "doshaEffect": "Reduces Kapha and Meda (fat), pacifies Vata"}'::jsonb,
    '100% Raw Wild Honey from natural forest bee hives in Eastern Ghats.',
    'Take 1 teaspoon in lukewarm water (never boiling) in the morning with lemon, or mix with herbal powders as an Anupana.',
    'Sustainably hand-harvested by indigenous tribal collectives with fair compensation.',
    '[{"weight": "250g", "price": 240, "oldPrice": 290}, {"weight": "500g", "price": 450, "oldPrice": 550}, {"weight": "1kg", "price": 850, "oldPrice": 1050}]'::jsonb,
    35,
    FALSE
),
(
    15,
    'Wood-Pressed Black Sesame Oil (Mara Chekku)',
    'மரச்செக்கு நல்லெண்ணெய்',
    'Tila Taila',
    'wood-pressed-sesame-oil',
    240.00,
    280.00,
    'Cold Pressed Oils',
    'cold-pressed-oils',
    'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=800',
    '["https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=800"]'::jsonb,
    4.8,
    96,
    '500ml',
    TRUE,
    FALSE,
    'VATA SHAMAKA',
    'Premier Vata Pacifier',
    'Traditional Vaagai-wood cold pressed black sesame oil. The supreme Ayurvedic oil for daily body massage and cooking.',
    'Ayurveda designates pure Tila Taila as the greatest among all vegetable oils for relieving Vata afflictions, joint stiffness, and dryness. Pressed in authentic wooden churners (Mara Chekku) with pure palm jaggery, retaining all natural lignans.',
    '{"rasa": "Madhura, Tikta, Kashaya", "virya": "Ushna (Warming)", "vipaka": "Madhura", "doshaEffect": "Supreme Vata healer, strengthens Asthi Dhatu"}'::jsonb,
    '100% Native Black Sesame Seeds, Palm Jaggery.',
    'Warm slightly and perform full-body self-massage (Abhyanga), or use in traditional tempering and cooking.',
    'Cold-crushed in Kanchipuram artisan wooden ghani.',
    '[{"weight": "500ml", "price": 240, "oldPrice": 280}, {"weight": "1 Litre", "price": 460, "oldPrice": 540}]'::jsonb,
    50,
    FALSE
),
(
    16,
    'Virgin Wood-Pressed Coconut Oil (Mara Chekku)',
    'மரச்செக்கு தேங்காய் எண்ணெய்',
    'Narikela Taila',
    'wood-pressed-coconut-oil',
    260.00,
    310.00,
    'Cold Pressed Oils',
    'cold-pressed-oils',
    'https://images.unsplash.com/photo-1608248597359-25255476a6d6?auto=format&fit=crop&q=80&w=800',
    '["https://images.unsplash.com/photo-1608248597359-25255476a6d6?auto=format&fit=crop&q=80&w=800"]'::jsonb,
    4.9,
    120,
    '500ml',
    TRUE,
    FALSE,
    'COOLING PITTA',
    'Cooling Pitta Healer',
    'Cold-extracted from sun-dried sulfur-free copra in Vaagai wood churners. Unrefined and naturally fragrant.',
    'Pure virgin wood-pressed coconut oil retains all natural lauric acid, vitamin E, and antimicrobial fatty acids. Perfect for deep scalp nourishment, infant massage, and light culinary use.',
    '{"rasa": "Madhura", "virya": "Sheeta (Deep Cooling)", "vipaka": "Madhura", "doshaEffect": "Pacifies severe Pitta and skin heat"}'::jsonb,
    '100% Native Sulfur-Free Dried Coconut Copra.',
    'Apply to scalp before bathing or use for gentle baby massage.',
    'Direct from certified coconut groves in Pollachi, Tamil Nadu.',
    '[{"weight": "500ml", "price": 260, "oldPrice": 310}, {"weight": "1 Litre", "price": 490, "oldPrice": 590}]'::jsonb,
    40,
    FALSE
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    price = EXCLUDED.price,
    stock = EXCLUDED.stock,
    is_out_of_stock = EXCLUDED.is_out_of_stock;

-- Adjust sequence for products table so new products start after 16
SELECT setval('products_id_seq', (SELECT MAX(id) FROM public.products));

-- ==============================================================================
-- INITIAL SEED DATA: DELIVERY DISTRICTS
-- ==============================================================================
INSERT INTO public.areas (district, is_active) VALUES
('Chennai', TRUE),
('Kanchipuram', TRUE),
('Coimbatore', TRUE),
('Madurai', TRUE),
('Tiruchirappalli', TRUE),
('Salem', TRUE),
('Thiruvallur', TRUE),
('Chengalpattu', TRUE),
('Tirunelveli', TRUE),
('Erode', TRUE),
('Vellore', TRUE),
('Thanjavur', TRUE)
ON CONFLICT (district) DO NOTHING;

-- ==============================================================================
-- INITIAL SEED DATA: CUSTOMER REVIEWS
-- ==============================================================================
INSERT INTO public.reviews (name, location, avatar, rating, verified, product, title, comment) VALUES
(
    'Rukmini Vasanth',
    'Kotturpuram, Chennai',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150',
    5,
    TRUE,
    'Karuppu Kavuni Rice & Palm Jaggery',
    'Feels like stepping into an ancient royal apothecary',
    'The Karuppu Kavuni has an authentic aroma when cooked in our clay pot that reminds me of my grandmother''s village kitchen in Kumbakonam. And the Palm Jaggery is deeply dark, earthy, and mineral-dense.'
),
(
    'Dr. Arvind Vaidyanathan (BAMS)',
    'Malleshwaram, Bengaluru',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    5,
    TRUE,
    'Wood-Pressed Sesame Oil & Thinai',
    'Genuine classical preparation without cutting corners',
    'As an Ayurvedic practitioner, finding truly wood-pressed tailams and unpolished native millets with intact bran is rare today. Mother Nature''s transparency and quality control are deeply commendable.'
),
(
    'Meenakshi Sundaram',
    'Race Course, Coimbatore',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    5,
    TRUE,
    'Pure Wild Forest Honey & Saindhava Salt',
    'Pure ingredients without white sugar or chemicals',
    'Most commercial honey is sugar-syrup fed, but Mother Nature''s wild honey is raw, deeply aromatic, and therapeutic. Our entire family is now free from refined sugar and processed salts.'
)
ON CONFLICT DO NOTHING;

-- Success verification
SELECT COUNT(*) AS total_products FROM public.products;