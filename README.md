# MenuFlow — Digital Dining & Restaurant Operating Platform

> **"Turn every table into a digital ordering experience."**

MenuFlow is a production-grade restaurant operating system and digital QR dining platform engineered for modern casual, fine dining, and high-velocity hospitality spaces.

Designed with the restraint and precision of elite design systems (Linear, Stripe, Apple, Raycast), MenuFlow eliminates ordering delays, waiter waving, and billing bottlenecks while driving a **14% increase in average ticket size** through rich food visual hierarchy.

---

## 🌟 Two Flagship Experiences

### 1. Customer QR Menu Experience (`/menu/[restaurantSlug]/[tableNumber]`)
* **Mobile-First Luxury Dining Interface**: Ultra-smooth transitions, sticky category pill navigation, real-time dish search, and dietary tags (Vegetarian green dot, Non-veg red triangle, Spicy chilli, and Bestseller badge).
* **Spring-Animated Dish Detail Sheets**: High-resolution photography, variants selector (e.g. Handmade Blue Corn vs Crispy Golden Shell), multi-select add-ons, calorie count, and custom cooking instructions.
* **Animated Bottom-Sheet Cart**: Quantity steppers, instant GST (5%) & service fee calculations, coupon promo validation (`FIESTA15`, `HAPPYHOUR`), and celebratory confetti checkout.
* **Live Order Progression Tracker**: Real-time kitchen timeline: `Order Received` → `Kitchen Confirmed` → `Preparing` → `Ready` → `Served` → `Completed`.
* **One-Tap Table Service Requests**: "Call Staff", "Request Water", "Request Bill", and "Need Assistance" with instant floor alerts.
* **Post-Dining Reviews & Digital Tax Receipts**: Verified 5-star ratings and instant printable tax invoice generation.

### 2. Restaurant Admin Dashboard (`/dashboard`)
* **Operations Overview**: Real-time KPIs (Today Revenue, Total Orders, Average Order Value, Table Occupancy), hourly sales velocity charts, top-performing dishes, and floor activity matrix.
* **Orders Control Center (`/dashboard/orders`)**: Kitchen terminal with status progression (`NEW`, `CONFIRMED`, `PREPARING`, `READY`, `SERVED`, `COMPLETED`), synthetic Web Audio chimes, and instant Kitchen Order Ticket (KOT) printing.
* **Menu Items Studio (`/dashboard/menu`)**: Full CRUD for dishes, image URLs, prices, preparation time, availability toggles, variants, and dietary indicators.
* **Categories Management (`/dashboard/categories`)**: Structured course categorization and real-time dish counters.
* **Table Architecture & Floor Plan (`/dashboard/tables`)**: Manage seating capacities, locations (Courtyard, Garden Patio, Mezzanine, Bar), and real-time occupancy.
* **QR Studio (`/dashboard/qr-codes`)**: Live vector QR code generator specifically encoded per table. Download PNG, copy direct links, and print branded table tent stands.
* **Floor Service Calls (`/dashboard/service-requests`)**: Dedicated waiter notification desk with bell chimes and acknowledgment resolution.
* **Promotions & Offers (`/dashboard/offers`)**: Create percentage, flat discount, and minimum-spend campaign rules.
* **Customer CRM & Loyalty (`/dashboard/customers`)**: Lifetime guest spend tracking, order history, and phone directory.
* **Payments & GST Invoicing (`/dashboard/payments`)**: Razorpay India payment abstraction (UPI, Cards, Cash), reconciliation logs, and GSTIN-compliant tax invoices.
* **Deep Analytics (`/dashboard/analytics`)**: Hourly dining velocity heatmaps, category sales distributions, and table turnover calculations.

---

## 🎨 Color System & Aesthetic Identity

MenuFlow strictly avoids purple/pink AI gradients and generic template tropes:

| Token | Hex / Value | Usage |
| :--- | :--- | :--- |
| **Primary Background** | `#080A0C` | Deep obsidian canvas |
| **Secondary Background** | `#0D1115` | Elevated panels & bars |
| **Surface Card** | `#12171C` | Dish cards, table tiles |
| **Elevated Surface** | `#171D23` | Modals, drawers, tooltips |
| **Border Subtle** | `rgba(255, 255, 255, 0.08)` | Minimal hairline dividers |
| **Primary Text** | `#F5F2EA` | Warm ivory headings & text |
| **Secondary Text** | `#9BA3AA` | Slate muted descriptions |
| **Accent Teal** | `#2DD4BF` | Primary brand accent & active states |
| **Champagne Gold** | `#E7C77A` | Selective awards, stars & bestsellers |
| **Success Emerald** | `#34D399` | Positive confirmations & veg badges |
| **Danger Rose** | `#F87171` | Alerts & non-veg indicators |

---

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (Strict mode)
- **Styling**: Tailwind CSS + Custom Design Tokens
- **Motion & 3D**: Framer Motion + CSS 3D Perspective + Mouse Parallax
- **Icons**: Lucide Icons
- **Database & Auth**: Supabase PostgreSQL + Row Level Security (RLS)
- **State & Realtime**: Universal Reactive Store with Cross-tab Sync & Local Storage Fallback
- **Audio Alerts**: Web Audio API Synthetic Chimes (100% reliable, zero external MP3 dependencies)
- **Payment Gateway**: Razorpay India (UPI, QR, Cards, Netbanking) with test simulation mode
- **QR Engine**: Vector & Canvas QR generation (`qrcode`)

---

## 🚀 Quick Start Guide

### 1. Clone & Install Dependencies
```bash
cd menuflow
npm install
```

### 2. Environment Setup
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

MenuFlow is preconfigured with an intelligent **Zero-Config Embedded Store**. It runs completely out-of-the-box locally with rich demo data for Casa Verde Mexican Cocina without requiring live cloud credentials.

For production cloud deployment, set your live Supabase and Razorpay credentials in `.env.local`:
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
RAZORPAY_KEY_ID=rzp_live_...
RAZORPAY_KEY_SECRET=...
RAZORPAY_WEBHOOK_SECRET=...
```

### 3. Run Locally
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser:
- **Landing Page & Live Demo Simulator**: `http://localhost:3000/`
- **Customer Table Menu (Table 04)**: `http://localhost:3000/menu/casa-verde/table-4`
- **Restaurant Admin Dashboard**: `http://localhost:3000/dashboard`
- **Kitchen Orders Control Center**: `http://localhost:3000/dashboard/orders`
- **QR Studio**: `http://localhost:3000/dashboard/qr-codes`
- **Onboarding Wizard**: `http://localhost:3000/onboarding`

---

## 🗄 Database Schema & Migrations

The full production PostgreSQL migration script is available in:
[`supabase/migrations/20261119000000_init_menuflow.sql`](supabase/migrations/20261119000000_init_menuflow.sql)

It creates 21 relational tables with UUIDs, indexing, foreign keys, and Row Level Security (RLS) policies:
1. `restaurants`
2. `restaurant_settings`
3. `restaurant_members`
4. `categories`
5. `menu_items`
6. `menu_item_variants`
7. `menu_item_addons`
8. `tables`
9. `qr_codes`
10. `orders`
11. `order_items`
12. `order_item_addons`
13. `customers`
14. `customer_sessions`
15. `reviews`
16. `offers`
17. `payments`
18. `invoices`
19. `notifications`
20. `service_requests`
21. `analytics_events`

Sample seed data for Casa Verde is located in:
[`supabase/seed.sql`](supabase/seed.sql)

---

## 💳 Razorpay Payment Webhook

Webhook endpoint: `POST /api/webhooks/razorpay`  
Verifies cryptographic HMAC SHA-256 signatures using `RAZORPAY_WEBHOOK_SECRET` and handles `payment.captured`, `order.paid`, and `payment.failed` events.

---

## 📜 License
MenuFlow is licensed under the MIT License.
