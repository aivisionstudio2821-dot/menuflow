"use client";

import { useState, useEffect } from "react";
import {
  Restaurant,
  RestaurantSettings,
  Category,
  MenuItem,
  RestaurantTable,
  Order,
  OrderStatus,
  ServiceRequest,
  ServiceRequestStatus,
  ServiceRequestType,
  Offer,
  Review,
  CartItem,
  PaymentStatus,
  PaymentMethod,
} from "./types";
import {
  INITIAL_RESTAURANT,
  INITIAL_SETTINGS,
  INITIAL_CATEGORIES,
  INITIAL_MENU_ITEMS,
  INITIAL_TABLES,
  INITIAL_OFFERS,
  INITIAL_REVIEWS,
  INITIAL_ORDERS,
  INITIAL_SERVICE_REQUESTS,
} from "./seed-data";
import { soundManager } from "./audio";

const STORAGE_KEYS = {
  RESTAURANT: "menuflow_restaurant",
  SETTINGS: "menuflow_settings",
  CATEGORIES: "menuflow_categories",
  MENU_ITEMS: "menuflow_menu_items",
  TABLES: "menuflow_tables",
  ORDERS: "menuflow_orders",
  SERVICE_REQUESTS: "menuflow_service_requests",
  OFFERS: "menuflow_offers",
  REVIEWS: "menuflow_reviews",
  CART_PREFIX: "menuflow_cart_",
};

type Listener = () => void;
const listeners: Set<Listener> = new Set();

function notifyListeners() {
  listeners.forEach((listener) => listener());
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("menuflow_store_updated"));
  }
}

class RestaurantStore {
  private isBrowser = typeof window !== "undefined";

  private getStorage<T>(key: string, defaultValue: T): T {
    if (!this.isBrowser) return defaultValue;
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  private setStorage<T>(key: string, value: T) {
    if (!this.isBrowser) return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
      notifyListeners();
    } catch (e) {
      console.warn("Could not save to localStorage", e);
    }
  }

  // RESTAURANT
  getRestaurant(): Restaurant {
    return this.getStorage(STORAGE_KEYS.RESTAURANT, INITIAL_RESTAURANT);
  }

  updateRestaurant(updates: Partial<Restaurant>) {
    const current = this.getRestaurant();
    const updated = { ...current, ...updates, updated_at: new Date().toISOString() };
    this.setStorage(STORAGE_KEYS.RESTAURANT, updated);
    return updated;
  }

  // SETTINGS
  getSettings(): RestaurantSettings {
    return this.getStorage(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
  }

  updateSettings(updates: Partial<RestaurantSettings>) {
    const current = this.getSettings();
    const updated = { ...current, ...updates };
    this.setStorage(STORAGE_KEYS.SETTINGS, updated);
    return updated;
  }

  // CATEGORIES
  getCategories(): Category[] {
    return this.getStorage(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
  }

  addCategory(category: Omit<Category, "id" | "created_at" | "updated_at">): Category {
    const categories = this.getCategories();
    const newCategory: Category = {
      ...category,
      id: "cat-" + Date.now(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.setStorage(STORAGE_KEYS.CATEGORIES, [...categories, newCategory]);
    return newCategory;
  }

  updateCategory(id: string, updates: Partial<Category>): Category | null {
    const categories = this.getCategories();
    const idx = categories.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    const updated = { ...categories[idx], ...updates, updated_at: new Date().toISOString() };
    categories[idx] = updated;
    this.setStorage(STORAGE_KEYS.CATEGORIES, categories);
    return updated;
  }

  deleteCategory(id: string): boolean {
    const categories = this.getCategories();
    const filtered = categories.filter((c) => c.id !== id);
    if (filtered.length === categories.length) return false;
    this.setStorage(STORAGE_KEYS.CATEGORIES, filtered);
    return true;
  }

  // MENU ITEMS
  getMenuItems(): MenuItem[] {
    return this.getStorage(STORAGE_KEYS.MENU_ITEMS, INITIAL_MENU_ITEMS);
  }

  getMenuItemById(id: string): MenuItem | undefined {
    return this.getMenuItems().find((m) => m.id === id);
  }

  addMenuItem(item: Omit<MenuItem, "id" | "created_at" | "updated_at">): MenuItem {
    const items = this.getMenuItems();
    const newItem: MenuItem = {
      ...item,
      id: "dish-" + Date.now(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.setStorage(STORAGE_KEYS.MENU_ITEMS, [newItem, ...items]);
    return newItem;
  }

  updateMenuItem(id: string, updates: Partial<MenuItem>): MenuItem | null {
    const items = this.getMenuItems();
    const idx = items.findIndex((i) => i.id === id);
    if (idx === -1) return null;
    const updated = { ...items[idx], ...updates, updated_at: new Date().toISOString() };
    items[idx] = updated;
    this.setStorage(STORAGE_KEYS.MENU_ITEMS, items);
    return updated;
  }

  deleteMenuItem(id: string): boolean {
    const items = this.getMenuItems();
    const filtered = items.filter((i) => i.id !== id);
    if (filtered.length === items.length) return false;
    this.setStorage(STORAGE_KEYS.MENU_ITEMS, filtered);
    return true;
  }

  // TABLES
  getTables(): RestaurantTable[] {
    return this.getStorage(STORAGE_KEYS.TABLES, INITIAL_TABLES);
  }

  getTableByNumber(tableNumber: string): RestaurantTable | undefined {
    const normalized = tableNumber.replace("-", " ").toLowerCase();
    return this.getTables().find((t) => t.table_number.toLowerCase() === normalized || t.table_number.toLowerCase().replace(" ", "-") === tableNumber.toLowerCase());
  }

  addTable(table: Omit<RestaurantTable, "id" | "created_at" | "updated_at">): RestaurantTable {
    const tables = this.getTables();
    const newTable: RestaurantTable = {
      ...table,
      id: "tbl-" + (tables.length + 1),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.setStorage(STORAGE_KEYS.TABLES, [...tables, newTable]);
    return newTable;
  }

  updateTableStatus(
    id: string,
    status: "available" | "occupied" | "ordering" | "bill_requested"
  ): RestaurantTable | null {
    const tables = this.getTables();
    const idx = tables.findIndex((t) => t.id === id);
    if (idx === -1) return null;
    tables[idx] = { ...tables[idx], status, updated_at: new Date().toISOString() };
    this.setStorage(STORAGE_KEYS.TABLES, tables);
    return tables[idx];
  }

  // ORDERS
  getOrders(): Order[] {
    return this.getStorage(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
  }

  getOrderById(id: string): Order | undefined {
    return this.getOrders().find((o) => o.id === id);
  }

  getOrdersByTable(tableNumber: string): Order[] {
    const normalized = tableNumber.replace("-", " ").toLowerCase();
    return this.getOrders().filter(
      (o) =>
        o.table_number.toLowerCase() === normalized ||
        o.table_number.toLowerCase().replace(" ", "-") === tableNumber.toLowerCase()
    );
  }

  placeOrder(
    tableNumber: string,
    cartItems: CartItem[],
    customerInfo: { name?: string; phone?: string; notes?: string },
    appliedOffer?: Offer | null,
    paymentMethod: PaymentMethod = "UPI"
  ): Order {
    const orders = this.getOrders();
    const settings = this.getSettings();

    const subtotal = cartItems.reduce((acc, item) => acc + item.totalPrice, 0);

    let discountAmount = 0;
    if (appliedOffer && subtotal >= appliedOffer.minimum_order_amount) {
      if (appliedOffer.discount_type === "PERCENTAGE") {
        discountAmount = Math.round((subtotal * appliedOffer.discount_value) / 100);
        if (appliedOffer.max_discount_amount) {
          discountAmount = Math.min(discountAmount, appliedOffer.max_discount_amount);
        }
      } else if (appliedOffer.discount_type === "FLAT") {
        discountAmount = appliedOffer.discount_value;
      }
    }

    const discountedSubtotal = Math.max(0, subtotal - discountAmount);
    const taxAmount = Math.round((discountedSubtotal * settings.tax_rate) / 100);
    const serviceCharge = Math.round((discountedSubtotal * settings.service_charge_rate) / 100);
    const totalAmount = discountedSubtotal + taxAmount + serviceCharge;

    const orderNumber = `MF-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrderId = "ord-" + Date.now();

    const orderItems = cartItems.map((c, idx) => ({
      id: `item-${newOrderId}-${idx}`,
      order_id: newOrderId,
      menu_item_id: c.menuItem.id,
      item_name: c.menuItem.name,
      variant_name: c.selectedVariant?.name,
      quantity: c.quantity,
      unit_price: c.unitPrice,
      total_price: c.totalPrice,
      special_notes: c.specialInstructions,
      addons: c.selectedAddons.map((a) => ({ name: a.name, price: a.price })),
    }));

    const newOrder: Order = {
      id: newOrderId,
      order_number: orderNumber,
      restaurant_id: INITIAL_RESTAURANT.id,
      table_id: "tbl-" + tableNumber,
      table_number: tableNumber,
      customer_name: customerInfo.name || "Guest",
      customer_phone: customerInfo.phone || "",
      status: "NEW",
      payment_status: paymentMethod === "CASH" ? "PENDING" : "PAID",
      payment_method: paymentMethod,
      subtotal,
      tax_amount: taxAmount,
      service_charge: serviceCharge,
      discount_amount: discountAmount,
      total_amount: totalAmount,
      special_instructions: customerInfo.notes,
      items: orderItems,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    this.setStorage(STORAGE_KEYS.ORDERS, [newOrder, ...orders]);

    // Update table status to occupied
    const table = this.getTableByNumber(tableNumber);
    if (table) {
      this.updateTableStatus(table.id, "occupied");
    }

    // Play chime sound for restaurant staff alert
    soundManager.playOrderChime();

    return newOrder;
  }

  updateOrderStatus(orderId: string, status: OrderStatus): Order | null {
    const orders = this.getOrders();
    const idx = orders.findIndex((o) => o.id === orderId);
    if (idx === -1) return null;

    const updated = {
      ...orders[idx],
      status,
      updated_at: new Date().toISOString(),
    };
    orders[idx] = updated;
    this.setStorage(STORAGE_KEYS.ORDERS, orders);

    // If completed or cancelled, optionally release table if no other active orders
    if (status === "COMPLETED") {
      const activeOrders = orders.filter(
        (o) =>
          o.table_number === updated.table_number &&
          o.id !== orderId &&
          !["COMPLETED", "CANCELLED"].includes(o.status)
      );
      if (activeOrders.length === 0) {
        const table = this.getTableByNumber(updated.table_number);
        if (table) {
          this.updateTableStatus(table.id, "available");
        }
      }
    }

    return updated;
  }

  updatePaymentStatus(orderId: string, payment_status: PaymentStatus): Order | null {
    const orders = this.getOrders();
    const idx = orders.findIndex((o) => o.id === orderId);
    if (idx === -1) return null;
    orders[idx] = { ...orders[idx], payment_status, updated_at: new Date().toISOString() };
    this.setStorage(STORAGE_KEYS.ORDERS, orders);
    return orders[idx];
  }

  // SERVICE REQUESTS
  getServiceRequests(): ServiceRequest[] {
    return this.getStorage(STORAGE_KEYS.SERVICE_REQUESTS, INITIAL_SERVICE_REQUESTS);
  }

  createServiceRequest(
    tableNumber: string,
    request_type: ServiceRequestType,
    note?: string
  ): ServiceRequest {
    const requests = this.getServiceRequests();
    const table = this.getTableByNumber(tableNumber);

    const newRequest: ServiceRequest = {
      id: "req-" + Date.now(),
      restaurant_id: INITIAL_RESTAURANT.id,
      table_id: table ? table.id : "tbl-" + tableNumber,
      table_number: tableNumber,
      request_type,
      status: "PENDING",
      note,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    this.setStorage(STORAGE_KEYS.SERVICE_REQUESTS, [newRequest, ...requests]);

    if (request_type === "BILL" && table) {
      this.updateTableStatus(table.id, "bill_requested");
    }

    soundManager.playServiceBell();
    return newRequest;
  }

  updateServiceRequestStatus(
    id: string,
    status: ServiceRequestStatus
  ): ServiceRequest | null {
    const requests = this.getServiceRequests();
    const idx = requests.findIndex((r) => r.id === id);
    if (idx === -1) return null;
    const updated = {
      ...requests[idx],
      status,
      updated_at: new Date().toISOString(),
    };
    requests[idx] = updated;
    this.setStorage(STORAGE_KEYS.SERVICE_REQUESTS, requests);
    return updated;
  }

  // OFFERS
  getOffers(): Offer[] {
    return this.getStorage(STORAGE_KEYS.OFFERS, INITIAL_OFFERS);
  }

  addOffer(offer: Omit<Offer, "id">): Offer {
    const offers = this.getOffers();
    const newOffer: Offer = { ...offer, id: "off-" + Date.now() };
    this.setStorage(STORAGE_KEYS.OFFERS, [newOffer, ...offers]);
    return newOffer;
  }

  toggleOfferActive(id: string): Offer | null {
    const offers = this.getOffers();
    const idx = offers.findIndex((o) => o.id === id);
    if (idx === -1) return null;
    offers[idx] = { ...offers[idx], is_active: !offers[idx].is_active };
    this.setStorage(STORAGE_KEYS.OFFERS, offers);
    return offers[idx];
  }

  // REVIEWS
  getReviews(): Review[] {
    return this.getStorage(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
  }

  addReview(review: Omit<Review, "id" | "created_at">): Review {
    const reviews = this.getReviews();
    const newReview: Review = {
      ...review,
      id: "rev-" + Date.now(),
      created_at: new Date().toISOString(),
    };
    this.setStorage(STORAGE_KEYS.REVIEWS, [newReview, ...reviews]);
    return newReview;
  }

  // CART (per table)
  getCart(tableNumber: string): CartItem[] {
    return this.getStorage<CartItem[]>(STORAGE_KEYS.CART_PREFIX + tableNumber, []);
  }

  saveCart(tableNumber: string, items: CartItem[]) {
    this.setStorage(STORAGE_KEYS.CART_PREFIX + tableNumber, items);
  }

  clearCart(tableNumber: string) {
    if (!this.isBrowser) return;
    localStorage.removeItem(STORAGE_KEYS.CART_PREFIX + tableNumber);
    notifyListeners();
  }

  // RESET TO DEFAULT SEED DATA
  resetToSeed() {
    if (!this.isBrowser) return;
    localStorage.removeItem(STORAGE_KEYS.RESTAURANT);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
    localStorage.removeItem(STORAGE_KEYS.MENU_ITEMS);
    localStorage.removeItem(STORAGE_KEYS.TABLES);
    localStorage.removeItem(STORAGE_KEYS.ORDERS);
    localStorage.removeItem(STORAGE_KEYS.SERVICE_REQUESTS);
    localStorage.removeItem(STORAGE_KEYS.OFFERS);
    localStorage.removeItem(STORAGE_KEYS.REVIEWS);
    notifyListeners();
  }
}

export const restaurantStore = new RestaurantStore();

// React Hook for subscribing to Store updates reactively
export function useRestaurantStore() {
  const [, setTick] = useState(0);

  useEffect(() => {
    const handleUpdate = () => setTick((t) => t + 1);
    listeners.add(handleUpdate);

    window.addEventListener("storage", handleUpdate);
    window.addEventListener("menuflow_store_updated", handleUpdate);

    return () => {
      listeners.delete(handleUpdate);
      window.removeEventListener("storage", handleUpdate);
      window.removeEventListener("menuflow_store_updated", handleUpdate);
    };
  }, []);

  return restaurantStore;
}
