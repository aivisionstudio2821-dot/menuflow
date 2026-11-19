export type OrderStatus =
  | "NEW"
  | "CONFIRMED"
  | "PREPARING"
  | "READY"
  | "SERVED"
  | "COMPLETED"
  | "CANCELLED";

export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

export type PaymentMethod = "UPI" | "CARDS" | "NETBANKING" | "CASH";

export type ServiceRequestType =
  | "CALL_STAFF"
  | "WATER"
  | "BILL"
  | "ASSISTANCE"
  | "CLEANING";

export type ServiceRequestStatus = "PENDING" | "ACKNOWLEDGED" | "COMPLETED";

export interface Restaurant {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  logo_url: string;
  cover_url: string;
  cuisine_type: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  currency: string;
  currency_symbol: string;
  opening_hours: Record<string, { open: string; close: string }>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface RestaurantSettings {
  id: string;
  restaurant_id: string;
  tax_rate: number;
  service_charge_rate: number;
  is_tax_inclusive: boolean;
  allow_ordering: boolean;
  allow_waiter_call: boolean;
  sound_notifications: boolean;
  razorpay_enabled: boolean;
  razorpay_key_id?: string;
}

export interface Category {
  id: string;
  restaurant_id: string;
  name: string;
  description?: string;
  icon?: string;
  image_url?: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MenuItemVariant {
  id: string;
  menu_item_id: string;
  name: string;
  price_adjustment: number;
  is_default: boolean;
  sort_order: number;
}

export interface MenuItemAddon {
  id: string;
  menu_item_id: string;
  name: string;
  price: number;
  is_available: boolean;
  sort_order: number;
}

export interface MenuItem {
  id: string;
  restaurant_id: string;
  category_id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  is_vegetarian: boolean;
  is_vegan: boolean;
  is_spicy: boolean;
  spice_level: number;
  is_bestseller: boolean;
  is_available: boolean;
  preparation_time_mins: number;
  calories?: number;
  allergens?: string[];
  sort_order: number;
  variants?: MenuItemVariant[];
  addons?: MenuItemAddon[];
  created_at: string;
  updated_at: string;
}

export interface RestaurantTable {
  id: string;
  restaurant_id: string;
  table_number: string;
  capacity: number;
  location: string;
  status: "available" | "occupied" | "ordering" | "bill_requested";
  current_session_id?: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface QRCodeRecord {
  id: string;
  restaurant_id: string;
  table_id: string;
  code_url: string;
  scans_count: number;
  last_scanned_at?: string;
  created_at: string;
}

export interface OrderItemAddon {
  name: string;
  price: number;
}

export interface OrderItem {
  id: string;
  order_id: string;
  menu_item_id: string;
  item_name: string;
  variant_name?: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  special_notes?: string;
  addons?: OrderItemAddon[];
}

export interface Order {
  id: string;
  order_number: string;
  restaurant_id: string;
  table_id: string;
  table_number: string;
  customer_name?: string;
  customer_phone?: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  payment_method: PaymentMethod;
  subtotal: number;
  tax_amount: number;
  service_charge: number;
  discount_amount: number;
  total_amount: number;
  special_instructions?: string;
  items: OrderItem[];
  created_at: string;
  updated_at: string;
}

export interface ServiceRequest {
  id: string;
  restaurant_id: string;
  table_id: string;
  table_number: string;
  request_type: ServiceRequestType;
  status: ServiceRequestStatus;
  note?: string;
  created_at: string;
  updated_at: string;
}

export interface Offer {
  id: string;
  restaurant_id: string;
  code: string;
  title: string;
  description: string;
  discount_type: "PERCENTAGE" | "FLAT" | "BOGO";
  discount_value: number;
  minimum_order_amount: number;
  max_discount_amount?: number;
  is_active: boolean;
  start_date: string;
  end_date?: string;
}

export interface Review {
  id: string;
  restaurant_id: string;
  order_id?: string;
  customer_name: string;
  table_number?: string;
  rating: number; // 1 to 5
  comment: string;
  food_rating?: number;
  service_rating?: number;
  ambience_rating?: number;
  is_featured?: boolean;
  created_at: string;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  restaurant_id: string;
  order_id: string;
  order_number: string;
  table_number: string;
  customer_name?: string;
  subtotal: number;
  tax_amount: number;
  service_charge: number;
  discount_amount: number;
  total_amount: number;
  payment_status: PaymentStatus;
  payment_method: PaymentMethod;
  items: OrderItem[];
  issued_at: string;
}

export interface CartItem {
  id: string; // generated unique id for cart instance
  menuItem: MenuItem;
  selectedVariant?: MenuItemVariant;
  selectedAddons: MenuItemAddon[];
  quantity: number;
  specialInstructions?: string;
  unitPrice: number;
  totalPrice: number;
}
