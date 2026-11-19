-- ====================================================================
-- MENUFLOW PRODUCTION SEED DATA
-- Demo Restaurant: Casa Verde (Mexican / Modern Casual)
-- Location: Indiranagar, Bengaluru, India
-- ====================================================================

-- 1. SEED RESTAURANT
INSERT INTO public.restaurants (
    id, slug, name, tagline, description, logo_url, cover_url,
    cuisine_type, phone, email, address, city, state, postal_code,
    country, currency, currency_symbol, is_active
) VALUES (
    'a1b2c3d4-e5f6-4a5b-8c7d-9e0f1a2b3c4d',
    'casa-verde',
    'Casa Verde',
    'Contemporary Mexican Cocina & Cantina',
    'Experience artisanal wood-fired Mexican culinary traditions reimagined with locally-sourced organic ingredients and heritage agave spirits in Indiranagar.',
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&auto=format&fit=crop&q=80',
    'Mexican / Modern Casual',
    '+91 98450 12345',
    'hola@casaverde.in',
    '108, 12th Main Rd, HAL 2nd Stage, Indiranagar',
    'Bengaluru',
    'Karnataka',
    '560038',
    'India',
    'INR',
    '₹',
    TRUE
) ON CONFLICT (slug) DO NOTHING;

-- 2. RESTAURANT SETTINGS
INSERT INTO public.restaurant_settings (
    restaurant_id, tax_rate, service_charge_rate, is_tax_inclusive,
    allow_ordering, allow_waiter_call, sound_notifications, razorpay_enabled
) VALUES (
    'a1b2c3d4-e5f6-4a5b-8c7d-9e0f1a2b3c4d',
    5.00,
    5.00,
    FALSE,
    TRUE,
    TRUE,
    TRUE,
    TRUE
) ON CONFLICT (restaurant_id) DO NOTHING;

-- 3. CATEGORIES
INSERT INTO public.categories (id, restaurant_id, name, description, icon, sort_order, is_active) VALUES
('b1000000-0000-0000-0000-000000000001', 'a1b2c3d4-e5f6-4a5b-8c7d-9e0f1a2b3c4d', 'Starters & Antojitos', 'Crispy chips, hand-pounded guacamole and street-style bites', 'UtensilsCrossed', 1, TRUE),
('b1000000-0000-0000-0000-000000000002', 'a1b2c3d4-e5f6-4a5b-8c7d-9e0f1a2b3c4d', 'Artisanal Tacos', 'Hand-pressed heirloom corn tortillas with smoky fillings', 'Flame', 2, TRUE),
('b1000000-0000-0000-0000-000000000003', 'a1b2c3d4-e5f6-4a5b-8c7d-9e0f1a2b3c4d', 'Fiesta Bowls', 'Nutrient-rich bowls loaded with cilantro rice and black beans', 'Salad', 3, TRUE),
('b1000000-0000-0000-0000-000000000004', 'a1b2c3d4-e5f6-4a5b-8c7d-9e0f1a2b3c4d', 'Mains & Platos Fuertes', 'Hearty Mexican specialties from our charcoal hearth', 'ChefHat', 4, TRUE),
('b1000000-0000-0000-0000-000000000005', 'a1b2c3d4-e5f6-4a5b-8c7d-9e0f1a2b3c4d', 'Craft Drinks & Mocktails', 'Agave refreshments, Mexican sodas and cold brews', 'Wine', 5, TRUE),
('b1000000-0000-0000-0000-000000000006', 'a1b2c3d4-e5f6-4a5b-8c7d-9e0f1a2b3c4d', 'Postres (Desserts)', 'Cinnamon churros and artisanal Oaxaca chocolate indulgence', 'IceCream', 6, TRUE)
ON CONFLICT (id) DO NOTHING;

-- 4. MENU ITEMS (16 Items)
INSERT INTO public.menu_items (
    id, restaurant_id, category_id, name, description, price,
    image_url, is_vegetarian, is_vegan, is_spicy, spice_level,
    is_bestseller, is_available, preparation_time_mins, calories, allergens, sort_order
) VALUES
-- Starters
(
    'c1000000-0000-0000-0000-000000000001',
    'a1b2c3d4-e5f6-4a5b-8c7d-9e0f1a2b3c4d',
    'b1000000-0000-0000-0000-000000000001',
    'Molcajete Guacamole & Totopos',
    'Hass avocado hand-crushed at table order with charred jalapeño, lime, cilantro, pomegranate arils, and warm stone-ground tortilla chips.',
    345.00,
    'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80',
    TRUE, TRUE, TRUE, 1, TRUE, TRUE, 10, 320, ARRAY['None'], 1
),
(
    'c1000000-0000-0000-0000-000000000002',
    'a1b2c3d4-e5f6-4a5b-8c7d-9e0f1a2b3c4d',
    'b1000000-0000-0000-0000-000000000001',
    'Queso Fundido Con Champiñones',
    'Sizzling skillet of melted Oaxaca cheese, spiced shiitake mushrooms, roasted poblano peppers, served with fresh flour tortillas.',
    395.00,
    'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=600&auto=format&fit=crop&q=80',
    TRUE, FALSE, FALSE, 0, FALSE, TRUE, 12, 450, ARRAY['Dairy', 'Gluten'], 2
),
(
    'c1000000-0000-0000-0000-000000000003',
    'a1b2c3d4-e5f6-4a5b-8c7d-9e0f1a2b3c4d',
    'b1000000-0000-0000-0000-000000000001',
    'Street-Style Charred Elote',
    'Grilled sweet corn ribbed with chipotle crema, cotija cheese crumbles, smoked paprika, and micro cilantro.',
    285.00,
    'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&auto=format&fit=crop&q=80',
    TRUE, FALSE, TRUE, 1, TRUE, TRUE, 10, 240, ARRAY['Dairy'], 3
),

-- Tacos
(
    'c1000000-0000-0000-0000-000000000004',
    'a1b2c3d4-e5f6-4a5b-8c7d-9e0f1a2b3c4d',
    'b1000000-0000-0000-0000-000000000002',
    'Smoked Pulled Jackfruit Birria Tacos (3 pcs)',
    'Slow-braised young jackfruit in ancho-guajillo chili broth, crisped on the plancha with vegan cheese, diced onion, cilantro, and warm dipping consommé.',
    425.00,
    'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&auto=format&fit=crop&q=80',
    TRUE, TRUE, TRUE, 2, TRUE, TRUE, 15, 380, ARRAY['None'], 1
),
(
    'c1000000-0000-0000-0000-000000000005',
    'a1b2c3d4-e5f6-4a5b-8c7d-9e0f1a2b3c4d',
    'b1000000-0000-0000-0000-000000000002',
    'Chipotle Pollo Asado Tacos (3 pcs)',
    'Charcoal grilled free-range chicken thigh in adobo glaze, charred pineapple salsa, pickled red onion, salsa verde on blue corn tortillas.',
    475.00,
    'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=600&auto=format&fit=crop&q=80',
    FALSE, FALSE, TRUE, 2, TRUE, TRUE, 14, 460, ARRAY['None'], 2
),
(
    'c1000000-0000-0000-0000-000000000006',
    'a1b2c3d4-e5f6-4a5b-8c7d-9e0f1a2b3c4d',
    'b1000000-0000-0000-0000-000000000002',
    'Baja Crispy Avocado Tacos (3 pcs)',
    'Beer-battered Hass avocado slices, purple cabbage slaw, chipotle aioli, pico de gallo, fresh lime wedge.',
    410.00,
    'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&auto=format&fit=crop&q=80',
    TRUE, FALSE, TRUE, 1, FALSE, TRUE, 12, 410, ARRAY['Gluten'], 3
),

-- Bowls
(
    'c1000000-0000-0000-0000-000000000007',
    'a1b2c3d4-e5f6-4a5b-8c7d-9e0f1a2b3c4d',
    'b1000000-0000-0000-0000-000000000003',
    'Casa Verde Harvest Power Bowl',
    'Herb cilantro-lime brown rice, spiced pinto beans, roasted corn salsa, charred zucchini, creamy guacamole, cotija cheese, pumpkin seeds.',
    445.00,
    'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=600&auto=format&fit=crop&q=80',
    TRUE, FALSE, FALSE, 0, TRUE, TRUE, 12, 510, ARRAY['Dairy'], 1
),
(
    'c1000000-0000-0000-0000-000000000008',
    'a1b2c3d4-e5f6-4a5b-8c7d-9e0f1a2b3c4d',
    'b1000000-0000-0000-0000-000000000003',
    'Smoked Barbeque Chicken Burrito Bowl',
    'Achiote smoked chicken breast strips, organic black beans, red pepper sofrito, aged cheddar blend, roasted salsa macha, tortilla crisp.',
    495.00,
    'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop&q=80',
    FALSE, FALSE, TRUE, 2, FALSE, TRUE, 14, 590, ARRAY['Dairy'], 2
),

-- Mains
(
    'c1000000-0000-0000-0000-000000000009',
    'a1b2c3d4-e5f6-4a5b-8c7d-9e0f1a2b3c4d',
    'b1000000-0000-0000-0000-000000000004',
    'Enchiladas Suizas Gratinadas',
    'Corn tortillas stuffed with slow-roasted vegetables and cheese, blanketed in creamy roasted tomatillo-serrano sauce and melted Monterey Jack.',
    525.00,
    'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=600&auto=format&fit=crop&q=80',
    TRUE, FALSE, TRUE, 2, TRUE, TRUE, 18, 620, ARRAY['Dairy'], 1
),
(
    'c1000000-0000-0000-0000-000000000010',
    'a1b2c3d4-e5f6-4a5b-8c7d-9e0f1a2b3c4d',
    'b1000000-0000-0000-0000-000000000004',
    'Sizzling Fajitas Mixtas',
    'Iron skillet sizzling bell peppers, Spanish onions, tender grilled paneer or chicken, served with pico, crema, guac and 3 warm tortillas.',
    595.00,
    'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=600&auto=format&fit=crop&q=80',
    TRUE, FALSE, TRUE, 1, FALSE, TRUE, 20, 680, ARRAY['Dairy', 'Gluten'], 2
),
(
    'c1000000-0000-0000-0000-000000000011',
    'a1b2c3d4-e5f6-4a5b-8c7d-9e0f1a2b3c4d',
    'b1000000-0000-0000-0000-000000000004',
    'Oaxacan Black Mole Roasted Veggies',
    'Charred cauliflower florets and tender baby carrots slow cooked in rich 24-ingredient cacao-chili mole negro, toasted sesame, warm corn cakes.',
    565.00,
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
    TRUE, TRUE, TRUE, 1, FALSE, TRUE, 16, 480, ARRAY['Sesame'], 3
),

-- Drinks
(
    'c1000000-0000-0000-0000-000000000012',
    'a1b2c3d4-e5f6-4a5b-8c7d-9e0f1a2b3c4d',
    'b1000000-0000-0000-0000-000000000005',
    'Hibiscus Agua de Jamaica',
    'Cold steeped organic Mexican hibiscus flowers, cinnamon quill, touch of raw agave nectar, served over hand-cut ice with mint.',
    220.00,
    'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop&q=80',
    TRUE, TRUE, FALSE, 0, TRUE, TRUE, 5, 90, ARRAY['None'], 1
),
(
    'c1000000-0000-0000-0000-000000000013',
    'a1b2c3d4-e5f6-4a5b-8c7d-9e0f1a2b3c4d',
    'b1000000-0000-0000-0000-000000000005',
    'Smoky Jalapeño Paloma Mocktail',
    'Fresh pink grapefruit juice, smoked jalapeño syrup, Mexican sparkling mineral water, volcanic black salt rim.',
    260.00,
    'https://images.unsplash.com/photo-1536935338788-846bb9981813?w=600&auto=format&fit=crop&q=80',
    TRUE, TRUE, TRUE, 1, TRUE, TRUE, 5, 110, ARRAY['None'], 2
),
(
    'c1000000-0000-0000-0000-000000000014',
    'a1b2c3d4-e5f6-4a5b-8c7d-9e0f1a2b3c4d',
    'b1000000-0000-0000-0000-000000000005',
    'Horchata Tradicional Casera',
    'Stone-ground rice milk infusion, toasted Sri Lankan cinnamon, Madagascar vanilla, crushed almond cream.',
    240.00,
    'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?w=600&auto=format&fit=crop&q=80',
    TRUE, FALSE, FALSE, 0, FALSE, TRUE, 5, 180, ARRAY['Tree Nuts'], 3
),

-- Desserts
(
    'c1000000-0000-0000-0000-000000000015',
    'a1b2c3d4-e5f6-4a5b-8c7d-9e0f1a2b3c4d',
    'b1000000-0000-0000-0000-000000000006',
    'Artisanal Churros Con Chocolate',
    'Crisp golden churros dusted in organic Ceylon cinnamon sugar, served with warm 70% dark Oaxaca dipping chocolate and dulce de leche.',
    320.00,
    'https://images.unsplash.com/photo-1624300629298-e9de39c13be5?w=600&auto=format&fit=crop&q=80',
    TRUE, FALSE, FALSE, 0, TRUE, TRUE, 10, 390, ARRAY['Gluten', 'Dairy'], 1
),
(
    'c1000000-0000-0000-0000-000000000016',
    'a1b2c3d4-e5f6-4a5b-8c7d-9e0f1a2b3c4d',
    'b1000000-0000-0000-0000-000000000006',
    'Tres Leches Cake with Mango & Agave',
    'Delicate sponge soaked in three milks infused with cardamom, finished with fresh Alphonso mango carpaccio and whipped mascarpone.',
    360.00,
    'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=600&auto=format&fit=crop&q=80',
    TRUE, FALSE, FALSE, 0, FALSE, TRUE, 8, 420, ARRAY['Dairy', 'Eggs', 'Gluten'], 2
)
ON CONFLICT (id) DO NOTHING;

-- 5. MENU ITEM VARIANTS
INSERT INTO public.menu_item_variants (id, menu_item_id, name, price_adjustment, is_default, sort_order) VALUES
('d1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000004', 'Soft Blue Corn Tortilla', 0.00, TRUE, 1),
('d1000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000004', 'Crispy Golden Shell', 30.00, FALSE, 2),
('d1000000-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000005', 'Medium Adobo Spice', 0.00, TRUE, 1),
('d1000000-0000-0000-0000-000000000004', 'c1000000-0000-0000-0000-000000000005', 'Habanero Fire (Extra Spicy)', 25.00, FALSE, 2),
('d1000000-0000-0000-0000-000000000005', 'c1000000-0000-0000-0000-000000000010', 'Grilled Cottage Cheese (Paneer)', 0.00, TRUE, 1),
('d1000000-0000-0000-0000-000000000006', 'c1000000-0000-0000-0000-000000000010', 'Charred Chicken Breast', 75.00, FALSE, 2)
ON CONFLICT (id) DO NOTHING;

-- 6. MENU ITEM ADDONS
INSERT INTO public.menu_item_addons (id, menu_item_id, name, price, is_available) VALUES
('e1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', 'Extra Warm Totopos Basket', 95.00, TRUE),
('e1000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000001', 'Chipotle Queso Dip (50g)', 85.00, TRUE),
('e1000000-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000004', 'Side Fresh Guacamole', 110.00, TRUE),
('e1000000-0000-0000-0000-000000000004', 'c1000000-0000-0000-0000-000000000004', 'House Pickled Habanero & Red Onion', 45.00, TRUE),
('e1000000-0000-0000-0000-000000000005', 'c1000000-0000-0000-0000-000000000007', 'Extra Smashed Avocado Scoop', 80.00, TRUE),
('e1000000-0000-0000-0000-000000000006', 'c1000000-0000-0000-0000-000000000015', 'Single Scoop Mexican Vanilla Gelato', 90.00, TRUE)
ON CONFLICT (id) DO NOTHING;

-- 7. TABLES (10 Tables)
INSERT INTO public.tables (id, restaurant_id, table_number, capacity, location, status, sort_order) VALUES
('f1000000-0000-0000-0000-000000000001', 'a1b2c3d4-e5f6-4a5b-8c7d-9e0f1a2b3c4d', 'Table 01', 2, 'Main Courtyard', 'available', 1),
('f1000000-0000-0000-0000-000000000002', 'a1b2c3d4-e5f6-4a5b-8c7d-9e0f1a2b3c4d', 'Table 02', 2, 'Main Courtyard', 'occupied', 2),
('f1000000-0000-0000-0000-000000000003', 'a1b2c3d4-e5f6-4a5b-8c7d-9e0f1a2b3c4d', 'Table 03', 4, 'Main Courtyard', 'available', 3),
('f1000000-0000-0000-0000-000000000004', 'a1b2c3d4-e5f6-4a5b-8c7d-9e0f1a2b3c4d', 'Table 04', 4, 'Garden Patio', 'ordering', 4),
('f1000000-0000-0000-0000-000000000005', 'a1b2c3d4-e5f6-4a5b-8c7d-9e0f1a2b3c4d', 'Table 05', 6, 'Garden Patio', 'occupied', 5),
('f1000000-0000-0000-0000-000000000006', 'a1b2c3d4-e5f6-4a5b-8c7d-9e0f1a2b3c4d', 'Table 06', 4, 'Garden Patio', 'bill_requested', 6),
('f1000000-0000-0000-0000-000000000007', 'a1b2c3d4-e5f6-4a5b-8c7d-9e0f1a2b3c4d', 'Table 07', 2, 'Mezzanine Lounge', 'available', 7),
('f1000000-0000-0000-0000-000000000008', 'a1b2c3d4-e5f6-4a5b-8c7d-9e0f1a2b3c4d', 'Table 08', 4, 'Mezzanine Lounge', 'available', 8),
('f1000000-0000-0000-0000-000000000009', 'a1b2c3d4-e5f6-4a5b-8c7d-9e0f1a2b3c4d', 'Table 09', 8, 'Private Dining Room', 'available', 9),
('f1000000-0000-0000-0000-000000000010', 'a1b2c3d4-e5f6-4a5b-8c7d-9e0f1a2b3c4d', 'Table 10', 4, 'Bar High-Top', 'available', 10)
ON CONFLICT (id) DO NOTHING;

-- 8. QR CODES
INSERT INTO public.qr_codes (restaurant_id, table_id, code_url, scans_count) VALUES
('a1b2c3d4-e5f6-4a5b-8c7d-9e0f1a2b3c4d', 'f1000000-0000-0000-0000-000000000001', '/menu/casa-verde/table-1', 42),
('a1b2c3d4-e5f6-4a5b-8c7d-9e0f1a2b3c4d', 'f1000000-0000-0000-0000-000000000002', '/menu/casa-verde/table-2', 68),
('a1b2c3d4-e5f6-4a5b-8c7d-9e0f1a2b3c4d', 'f1000000-0000-0000-0000-000000000003', '/menu/casa-verde/table-3', 51),
('a1b2c3d4-e5f6-4a5b-8c7d-9e0f1a2b3c4d', 'f1000000-0000-0000-0000-000000000004', '/menu/casa-verde/table-4', 112),
('a1b2c3d4-e5f6-4a5b-8c7d-9e0f1a2b3c4d', 'f1000000-0000-0000-0000-000000000005', '/menu/casa-verde/table-5', 94),
('a1b2c3d4-e5f6-4a5b-8c7d-9e0f1a2b3c4d', 'f1000000-0000-0000-0000-000000000006', '/menu/casa-verde/table-6', 77),
('a1b2c3d4-e5f6-4a5b-8c7d-9e0f1a2b3c4d', 'f1000000-0000-0000-0000-000000000007', '/menu/casa-verde/table-7', 35),
('a1b2c3d4-e5f6-4a5b-8c7d-9e0f1a2b3c4d', 'f1000000-0000-0000-0000-000000000008', '/menu/casa-verde/table-8', 49),
('a1b2c3d4-e5f6-4a5b-8c7d-9e0f1a2b3c4d', 'f1000000-0000-0000-0000-000000000009', '/menu/casa-verde/table-9', 28),
('a1b2c3d4-e5f6-4a5b-8c7d-9e0f1a2b3c4d', 'f1000000-0000-0000-0000-000000000010', '/menu/casa-verde/table-10', 63)
ON CONFLICT (table_id) DO NOTHING;

-- 9. OFFERS
INSERT INTO public.offers (
    restaurant_id, code, title, description,
    discount_type, discount_value, minimum_order_amount, is_active
) VALUES
(
    'a1b2c3d4-e5f6-4a5b-8c7d-9e0f1a2b3c4d',
    'FIESTA15',
    '15% Off Your Entire Fiesta',
    'Enjoy 15% instant savings on culinary orders above ₹500 across tacos and bowls.',
    'PERCENTAGE',
    15.00,
    500.00,
    TRUE
),
(
    'a1b2c3d4-e5f6-4a5b-8c7d-9e0f1a2b3c4d',
    'HAPPYHOUR',
    'Happy Hour Margarita & Antojitos',
    'Flat ₹100 discount during afternoon cantina hours (4 PM - 7 PM).',
    'FLAT',
    100.00,
    600.00,
    TRUE
)
ON CONFLICT DO NOTHING;

-- 10. REVIEWS
INSERT INTO public.reviews (restaurant_id, customer_name, table_number, rating, comment, food_rating, service_rating) VALUES
('a1b2c3d4-e5f6-4a5b-8c7d-9e0f1a2b3c4d', 'Aarav Sharma', 'Table 04', 5, 'The Birria jackfruit tacos and Molcajete guacamole were unreal! Ordering through the QR code was lightning fast without waiting for a waiter.', 5, 5),
('a1b2c3d4-e5f6-4a5b-8c7d-9e0f1a2b3c4d', 'Priya Kulkarni', 'Table 02', 5, 'Best Mexican food in Bangalore. The Agua de Jamaica and churros were freshly made. Beautiful interface on phone!', 5, 5),
('a1b2c3d4-e5f6-4a5b-8c7d-9e0f1a2b3c4d', 'Rohan Mehta', 'Table 05', 4, 'Really smooth ordering workflow. Requested extra water through the app and it arrived within 60 seconds.', 4, 5)
ON CONFLICT DO NOTHING;
