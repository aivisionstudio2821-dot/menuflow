-- ====================================================================
-- MENUFLOW PRODUCTION DATABASE SCHEMA
-- PostgreSQL / Supabase
-- ====================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. RESTAURANTS
CREATE TABLE IF NOT EXISTS public.restaurants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    tagline VARCHAR(255),
    description TEXT,
    logo_url TEXT,
    cover_url TEXT,
    cuisine_type VARCHAR(100),
    phone VARCHAR(30),
    email VARCHAR(255),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100) DEFAULT 'India',
    currency VARCHAR(10) DEFAULT 'INR',
    currency_symbol VARCHAR(5) DEFAULT '₹',
    opening_hours JSONB DEFAULT '{"monday": {"open": "11:00", "close": "23:00"}, "tuesday": {"open": "11:00", "close": "23:00"}, "wednesday": {"open": "11:00", "close": "23:00"}, "thursday": {"open": "11:00", "close": "23:00"}, "friday": {"open": "11:00", "close": "23:30"}, "saturday": {"open": "11:00", "close": "23:30"}, "sunday": {"open": "11:00", "close": "23:00"}}'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. RESTAURANT SETTINGS
CREATE TABLE IF NOT EXISTS public.restaurant_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID UNIQUE NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    tax_rate NUMERIC(5, 2) DEFAULT 5.00, -- GST in India (5% standard restaurant)
    service_charge_rate NUMERIC(5, 2) DEFAULT 0.00,
    is_tax_inclusive BOOLEAN DEFAULT FALSE,
    allow_ordering BOOLEAN DEFAULT TRUE,
    allow_waiter_call BOOLEAN DEFAULT TRUE,
    sound_notifications BOOLEAN DEFAULT TRUE,
    razorpay_enabled BOOLEAN DEFAULT FALSE,
    razorpay_key_id VARCHAR(255),
    theme_config JSONB DEFAULT '{"primaryColor": "#2DD4BF", "accentColor": "#E7C77A", "mode": "dark"}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. RESTAURANT MEMBERS (STAFF & ADMIN)
CREATE TABLE IF NOT EXISTS public.restaurant_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    user_id UUID NOT NULL, -- references auth.users(id)
    role VARCHAR(50) DEFAULT 'admin' CHECK (role IN ('owner', 'admin', 'manager', 'waiter', 'kitchen')),
    full_name VARCHAR(255),
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(30),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(restaurant_id, email)
);

-- 4. CATEGORIES
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    image_url TEXT,
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. MENU ITEMS
CREATE TABLE IF NOT EXISTS public.menu_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL,
    image_url TEXT,
    is_vegetarian BOOLEAN DEFAULT FALSE,
    is_vegan BOOLEAN DEFAULT FALSE,
    is_spicy BOOLEAN DEFAULT FALSE,
    spice_level INT DEFAULT 0 CHECK (spice_level BETWEEN 0 AND 3),
    is_bestseller BOOLEAN DEFAULT FALSE,
    is_available BOOLEAN DEFAULT TRUE,
    preparation_time_mins INT DEFAULT 15,
    calories INT,
    allergens TEXT[],
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. MENU ITEM VARIANTS (e.g. Size: Regular, Large; Shell: Crispy, Soft)
CREATE TABLE IF NOT EXISTS public.menu_item_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    menu_item_id UUID NOT NULL REFERENCES public.menu_items(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    price_adjustment NUMERIC(10, 2) DEFAULT 0.00,
    is_default BOOLEAN DEFAULT FALSE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. MENU ITEM ADDONS (e.g. Extra Cheese, Guacamole, Jalapenos)
CREATE TABLE IF NOT EXISTS public.menu_item_addons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    menu_item_id UUID NOT NULL REFERENCES public.menu_items(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    price NUMERIC(10, 2) DEFAULT 0.00,
    is_available BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. TABLES
CREATE TABLE IF NOT EXISTS public.tables (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    table_number VARCHAR(50) NOT NULL,
    capacity INT DEFAULT 4,
    location VARCHAR(100) DEFAULT 'Main Dining',
    status VARCHAR(50) DEFAULT 'available' CHECK (status IN ('available', 'occupied', 'ordering', 'bill_requested')),
    current_session_id UUID,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(restaurant_id, table_number)
);

-- 9. QR CODES
CREATE TABLE IF NOT EXISTS public.qr_codes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    table_id UUID UNIQUE NOT NULL REFERENCES public.tables(id) ON DELETE CASCADE,
    code_url TEXT NOT NULL,
    scans_count INT DEFAULT 0,
    last_scanned_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. CUSTOMERS
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    name VARCHAR(255),
    phone VARCHAR(30),
    email VARCHAR(255),
    total_orders INT DEFAULT 0,
    total_spend NUMERIC(12, 2) DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. CUSTOMER SESSIONS (Anonymous or Identified Guest per Table)
CREATE TABLE IF NOT EXISTS public.customer_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    table_id UUID NOT NULL REFERENCES public.tables(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
    guest_name VARCHAR(100),
    guest_phone VARCHAR(30),
    is_active BOOLEAN DEFAULT TRUE,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    ended_at TIMESTAMPTZ
);

-- 12. ORDERS
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(50) NOT NULL,
    restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    table_id UUID NOT NULL REFERENCES public.tables(id) ON DELETE CASCADE,
    customer_session_id UUID REFERENCES public.customer_sessions(id) ON DELETE SET NULL,
    customer_name VARCHAR(150),
    customer_phone VARCHAR(30),
    status VARCHAR(50) DEFAULT 'NEW' CHECK (status IN ('NEW', 'CONFIRMED', 'PREPARING', 'READY', 'SERVED', 'COMPLETED', 'CANCELLED')),
    payment_status VARCHAR(50) DEFAULT 'PENDING' CHECK (payment_status IN ('PENDING', 'PAID', 'FAILED', 'REFUNDED')),
    payment_method VARCHAR(50) DEFAULT 'CASH' CHECK (payment_method IN ('UPI', 'CARDS', 'NETBANKING', 'CASH')),
    subtotal NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    tax_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    service_charge NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    discount_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    total_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    special_instructions TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. ORDER ITEMS
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    menu_item_id UUID NOT NULL REFERENCES public.menu_items(id),
    item_name VARCHAR(255) NOT NULL,
    variant_name VARCHAR(100),
    quantity INT NOT NULL DEFAULT 1,
    unit_price NUMERIC(10, 2) NOT NULL,
    total_price NUMERIC(10, 2) NOT NULL,
    special_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. ORDER ITEM ADDONS
CREATE TABLE IF NOT EXISTS public.order_item_addons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_item_id UUID NOT NULL REFERENCES public.order_items(id) ON DELETE CASCADE,
    addon_name VARCHAR(100) NOT NULL,
    price NUMERIC(10, 2) NOT NULL DEFAULT 0.00
);

-- 15. SERVICE REQUESTS (Call Staff, Water, Bill, etc.)
CREATE TABLE IF NOT EXISTS public.service_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    table_id UUID NOT NULL REFERENCES public.tables(id) ON DELETE CASCADE,
    table_number VARCHAR(50) NOT NULL,
    request_type VARCHAR(50) NOT NULL CHECK (request_type IN ('CALL_STAFF', 'WATER', 'BILL', 'ASSISTANCE', 'CLEANING')),
    status VARCHAR(50) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ACKNOWLEDGED', 'COMPLETED')),
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. OFFERS & PROMOTIONS
CREATE TABLE IF NOT EXISTS public.offers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    code VARCHAR(50),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    discount_type VARCHAR(20) DEFAULT 'PERCENTAGE' CHECK (discount_type IN ('PERCENTAGE', 'FLAT', 'BOGO')),
    discount_value NUMERIC(10, 2) NOT NULL,
    minimum_order_amount NUMERIC(10, 2) DEFAULT 0.00,
    max_discount_amount NUMERIC(10, 2),
    is_active BOOLEAN DEFAULT TRUE,
    start_date TIMESTAMPTZ DEFAULT NOW(),
    end_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. REVIEWS
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
    customer_name VARCHAR(150) DEFAULT 'Guest',
    table_number VARCHAR(50),
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    food_rating INT CHECK (food_rating BETWEEN 1 AND 5),
    service_rating INT CHECK (service_rating BETWEEN 1 AND 5),
    ambience_rating INT CHECK (ambience_rating BETWEEN 1 AND 5),
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 18. PAYMENTS
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'INR',
    gateway VARCHAR(50) DEFAULT 'RAZORPAY',
    gateway_order_id VARCHAR(255),
    gateway_payment_id VARCHAR(255),
    status VARCHAR(50) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PAID', 'FAILED', 'REFUNDED')),
    payment_method VARCHAR(50),
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 19. INVOICES
CREATE TABLE IF NOT EXISTS public.invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_number VARCHAR(100) UNIQUE NOT NULL,
    restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    order_id UUID UNIQUE NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    customer_name VARCHAR(150),
    subtotal NUMERIC(10, 2) NOT NULL,
    tax_amount NUMERIC(10, 2) NOT NULL,
    service_charge NUMERIC(10, 2) NOT NULL,
    discount_amount NUMERIC(10, 2) NOT NULL,
    total_amount NUMERIC(10, 2) NOT NULL,
    payment_status VARCHAR(50) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    issued_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 20. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT FALSE,
    link_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 21. ANALYTICS EVENTS
CREATE TABLE IF NOT EXISTS public.analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    event_type VARCHAR(100) NOT NULL, -- 'menu_view', 'item_click', 'add_to_cart', 'order_placed', 'bill_requested'
    table_id UUID REFERENCES public.tables(id) ON DELETE SET NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- INDEXES FOR MAXIMUM QUERY PERFORMANCE
-- ====================================================================
CREATE INDEX IF NOT EXISTS idx_restaurants_slug ON public.restaurants(slug);
CREATE INDEX IF NOT EXISTS idx_categories_restaurant_order ON public.categories(restaurant_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_menu_items_restaurant_cat ON public.menu_items(restaurant_id, category_id);
CREATE INDEX IF NOT EXISTS idx_tables_restaurant ON public.tables(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_orders_restaurant_status ON public.orders(restaurant_id, status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_service_requests_restaurant_status ON public.service_requests(restaurant_id, status);
CREATE INDEX IF NOT EXISTS idx_analytics_restaurant_event ON public.analytics_events(restaurant_id, event_type, created_at);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================
ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurant_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurant_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_item_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_item_addons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qr_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_item_addons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Public customer reads: Active menus, items, categories, active offers, tables
CREATE POLICY "Public can view active restaurants" ON public.restaurants FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view categories" ON public.categories FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view menu items" ON public.menu_items FOR SELECT USING (is_available = true);
CREATE POLICY "Public can view variants" ON public.menu_item_variants FOR SELECT USING (true);
CREATE POLICY "Public can view addons" ON public.menu_item_addons FOR SELECT USING (true);
CREATE POLICY "Public can view tables" ON public.tables FOR SELECT USING (true);
CREATE POLICY "Public can view offers" ON public.offers FOR SELECT USING (is_active = true);
CREATE POLICY "Public can create service requests" ON public.service_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can create orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can view their table orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Public can create reviews" ON public.reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can log analytics" ON public.analytics_events FOR INSERT WITH CHECK (true);

-- Restaurant staff / authenticated user policies
CREATE POLICY "Staff can view own restaurant" ON public.restaurants FOR ALL
USING (
    id IN (SELECT restaurant_id FROM public.restaurant_members WHERE user_id = auth.uid())
);

CREATE POLICY "Staff can manage categories" ON public.categories FOR ALL
USING (
    restaurant_id IN (SELECT restaurant_id FROM public.restaurant_members WHERE user_id = auth.uid())
);

CREATE POLICY "Staff can manage menu items" ON public.menu_items FOR ALL
USING (
    restaurant_id IN (SELECT restaurant_id FROM public.restaurant_members WHERE user_id = auth.uid())
);

CREATE POLICY "Staff can manage tables" ON public.tables FOR ALL
USING (
    restaurant_id IN (SELECT restaurant_id FROM public.restaurant_members WHERE user_id = auth.uid())
);

CREATE POLICY "Staff can manage orders" ON public.orders FOR ALL
USING (
    restaurant_id IN (SELECT restaurant_id FROM public.restaurant_members WHERE user_id = auth.uid())
);

CREATE POLICY "Staff can manage service requests" ON public.service_requests FOR ALL
USING (
    restaurant_id IN (SELECT restaurant_id FROM public.restaurant_members WHERE user_id = auth.uid())
);

CREATE POLICY "Staff can manage offers" ON public.offers FOR ALL
USING (
    restaurant_id IN (SELECT restaurant_id FROM public.restaurant_members WHERE user_id = auth.uid())
);

CREATE POLICY "Staff can view reviews" ON public.reviews FOR ALL
USING (
    restaurant_id IN (SELECT restaurant_id FROM public.restaurant_members WHERE user_id = auth.uid())
);
