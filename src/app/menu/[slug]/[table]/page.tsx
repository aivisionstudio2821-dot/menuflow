"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useRestaurantStore } from "@/lib/store";
import { MenuItem, CartItem, Order, Category } from "@/lib/types";
import { DishCard } from "@/components/menu/DishCard";
import { DishDetailModal } from "@/components/menu/DishDetailModal";
import { CartDrawer } from "@/components/menu/CartDrawer";
import { OrderTrackingModal } from "@/components/menu/OrderTrackingModal";
import { ServiceRequestModal } from "@/components/menu/ServiceRequestModal";
import { ReviewModal } from "@/components/menu/ReviewModal";
import { OffersBanner } from "@/components/menu/OffersBanner";
import { formatINR } from "@/lib/utils";
import {
  Search,
  ShoppingBag,
  Bell,
  Sparkles,
  Info,
  Clock,
  MapPin,
  UtensilsCrossed,
  Filter,
  Check,
} from "lucide-react";
import { soundManager } from "@/lib/audio";

export default function CustomerMenuPage() {
  const params = useParams();
  const slug = (params?.slug as string) || "casa-verde";
  const rawTable = (params?.table as string) || "table-4";

  // Normalize table string: "table-4" -> "Table 04"
  const formattedTableNumber = useMemo(() => {
    const match = rawTable.match(/\d+/);
    if (match) {
      const num = parseInt(match[0], 10);
      return `Table ${num < 10 ? "0" + num : num}`;
    }
    return rawTable.replace("-", " ").toUpperCase();
  }, [rawTable]);

  const store = useRestaurantStore();
  const restaurant = store.getRestaurant();
  const categories = store.getCategories().filter((c) => c.is_active);
  const menuItems = store.getMenuItems().filter((i) => i.is_available);
  const offers = store.getOffers();

  // Local state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [dietaryFilter, setDietaryFilter] = useState<"ALL" | "VEG" | "NON_VEG" | "BESTSELLER">("ALL");

  // Cart state persisted per table
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Modals state
  const [detailItem, setDetailItem] = useState<MenuItem | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isServiceOpen, setIsServiceOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  // Active / Tracking Order
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);

  // Load cart from store for this table
  useEffect(() => {
    const saved = store.getCart(formattedTableNumber);
    setCartItems(saved);

    // Check if there are active orders for this table
    const tableOrders = store.getOrdersByTable(formattedTableNumber);
    if (tableOrders.length > 0) {
      const latest = tableOrders[0];
      if (!["CANCELLED"].includes(latest.status)) {
        setActiveOrder(latest);
      }
    }
  }, [formattedTableNumber, store]);

  // Save cart changes
  const updateCart = (newCart: CartItem[]) => {
    setCartItems(newCart);
    store.saveCart(formattedTableNumber, newCart);
  };

  const handleQuickAdd = (item: MenuItem) => {
    const existingIdx = cartItems.findIndex(
      (c) => c.menuItem.id === item.id && !c.selectedVariant && c.selectedAddons.length === 0
    );

    if (existingIdx !== -1) {
      const updated = [...cartItems];
      updated[existingIdx].quantity += 1;
      updated[existingIdx].totalPrice = updated[existingIdx].unitPrice * updated[existingIdx].quantity;
      updateCart(updated);
    } else {
      const newCartItem: CartItem = {
        id: `${item.id}-base-${Date.now()}`,
        menuItem: item,
        selectedAddons: [],
        quantity: 1,
        unitPrice: Number(item.price),
        totalPrice: Number(item.price),
      };
      updateCart([...cartItems, newCartItem]);
    }
  };

  const handleUpdateCartQty = (cartItemId: string, delta: number) => {
    const updated = cartItems
      .map((item) => {
        if (item.id === cartItemId) {
          const newQty = item.quantity + delta;
          if (newQty <= 0) return null;
          return {
            ...item,
            quantity: newQty,
            totalPrice: item.unitPrice * newQty,
          };
        }
        return item;
      })
      .filter(Boolean) as CartItem[];

    updateCart(updated);
  };

  const handleRemoveCartItem = (cartItemId: string) => {
    soundManager.playClick();
    const updated = cartItems.filter((i) => i.id !== cartItemId);
    updateCart(updated);
  };

  const handleClearCart = () => {
    setCartItems([]);
    store.clearCart(formattedTableNumber);
  };

  const handleOrderSuccess = (placedOrder: Order) => {
    setActiveOrder(placedOrder);
    setIsTrackingOpen(true);
  };

  // Filter menu items
  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = item.name.toLowerCase().includes(q);
        const matchDesc = item.description.toLowerCase().includes(q);
        if (!matchName && !matchDesc) return false;
      }

      // Category
      if (selectedCategory !== "ALL" && item.category_id !== selectedCategory) {
        return false;
      }

      // Dietary
      if (dietaryFilter === "VEG" && !item.is_vegetarian) return false;
      if (dietaryFilter === "NON_VEG" && item.is_vegetarian) return false;
      if (dietaryFilter === "BESTSELLER" && !item.is_bestseller) return false;

      return true;
    });
  }, [menuItems, searchQuery, selectedCategory, dietaryFilter]);

  // Group items by category for structured reading
  const groupedCategories = useMemo(() => {
    if (selectedCategory !== "ALL") {
      const cat = categories.find((c) => c.id === selectedCategory);
      return cat ? [{ category: cat, items: filteredItems }] : [];
    }

    return categories
      .map((cat) => ({
        category: cat,
        items: filteredItems.filter((item) => item.category_id === cat.id),
      }))
      .filter((group) => group.items.length > 0);
  }, [categories, filteredItems, selectedCategory]);

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalCartAmount = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);

  return (
    <div className="min-h-screen bg-background text-primary pb-28">
      {/* Top Navigation & Status Bar */}
      <header className="sticky top-0 z-30 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="relative w-8 h-8 rounded-full overflow-hidden border border-border">
              <Image
                src={restaurant.logo_url}
                alt={restaurant.name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-primary flex items-center gap-1.5">
                {restaurant.name}
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              </h1>
              <span className="text-[11px] font-mono text-accent">
                {formattedTableNumber}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Service Button */}
            <button
              onClick={() => {
                soundManager.playClick();
                setIsServiceOpen(true);
              }}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-surface-elevated hover:bg-surface-hover border border-border text-xs text-primary transition-colors"
            >
              <Bell className="w-3.5 h-3.5 text-accent" />
              <span>Service</span>
            </button>

            {/* Tracking Button if there's an active order */}
            {activeOrder && (
              <button
                onClick={() => {
                  soundManager.playClick();
                  setIsTrackingOpen(true);
                }}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-accent/15 border border-accent/40 text-xs text-accent font-medium animate-pulse"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Status</span>
              </button>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto px-4 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-muted" />
            <input
              type="text"
              placeholder="Search dishes, tacos, mocktails, guacamole..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface border border-border rounded-xl pl-9 pr-4 py-2 text-xs text-primary placeholder:text-primary-muted/60 focus:outline-none focus:border-accent"
            />
          </div>
        </div>

        {/* Category Sticky Pills */}
        <div className="max-w-2xl mx-auto px-4 pb-2.5 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              setSelectedCategory("ALL");
            }}
            className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              selectedCategory === "ALL"
                ? "bg-accent text-primary-dark font-semibold shadow-sm"
                : "bg-surface-elevated text-primary-muted hover:text-primary border border-border"
            }`}
          >
            All Items
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                soundManager.playClick();
                setSelectedCategory(cat.id);
              }}
              className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedCategory === cat.id
                  ? "bg-accent text-primary-dark font-semibold shadow-sm"
                  : "bg-surface-elevated text-primary-muted hover:text-primary border border-border"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-2xl mx-auto">
        {/* Promotional Banner */}
        <OffersBanner
          offers={offers}
          onSelectOffer={(off) => {
            setIsCartOpen(true);
          }}
        />

        {/* Dietary Filters Bar */}
        <div className="px-4 py-2.5 flex items-center justify-between border-b border-border/50 text-xs">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={() => setDietaryFilter("ALL")}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                dietaryFilter === "ALL"
                  ? "bg-surface-elevated text-primary border border-border-strong"
                  : "text-primary-muted hover:text-primary"
              }`}
            >
              All Diets
            </button>

            <button
              type="button"
              onClick={() => setDietaryFilter("VEG")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                dietaryFilter === "VEG"
                  ? "bg-emerald-950/80 text-emerald-400 border border-emerald-500/40"
                  : "text-primary-muted hover:text-emerald-400"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Veg Only
            </button>

            <button
              type="button"
              onClick={() => setDietaryFilter("NON_VEG")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                dietaryFilter === "NON_VEG"
                  ? "bg-rose-950/80 text-rose-400 border border-rose-500/40"
                  : "text-primary-muted hover:text-rose-400"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              Non-Veg
            </button>

            <button
              type="button"
              onClick={() => setDietaryFilter("BESTSELLER")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                dietaryFilter === "BESTSELLER"
                  ? "bg-champagne-subtle text-champagne border border-champagne/40"
                  : "text-primary-muted hover:text-champagne"
              }`}
            >
              <Sparkles className="w-3 h-3 text-champagne" />
              Bestsellers
            </button>
          </div>

          <span className="text-[11px] text-primary-muted font-mono flex-shrink-0">
            {filteredItems.length} dishes
          </span>
        </div>

        {/* Grouped Category Sections */}
        <div className="px-4 py-4 space-y-8">
          {groupedCategories.length === 0 ? (
            <div className="py-16 text-center text-primary-muted">
              <UtensilsCrossed className="w-8 h-8 mx-auto mb-2 text-primary-muted/40" />
              <p className="text-sm">No dishes match your selection.</p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("ALL");
                  setDietaryFilter("ALL");
                }}
                className="mt-2 text-xs text-accent underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            groupedCategories.map((group) => (
              <section key={group.category.id} className="space-y-3">
                <div>
                  <h2 className="text-base font-semibold text-primary tracking-tight">
                    {group.category.name}
                  </h2>
                  {group.category.description && (
                    <p className="text-xs text-primary-muted mt-0.5">
                      {group.category.description}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {group.items.map((item) => (
                    <DishCard
                      key={item.id}
                      item={item}
                      cartItems={cartItems}
                      onOpenDetail={(it) => {
                        soundManager.playClick();
                        setDetailItem(it);
                        setIsDetailOpen(true);
                      }}
                      onQuickAdd={handleQuickAdd}
                      onUpdateCartQty={handleUpdateCartQty}
                    />
                  ))}
                </div>
              </section>
            ))
          )}
        </div>
      </main>

      {/* Floating Bottom Cart Action Bar */}
      {totalCartCount > 0 && (
        <div className="fixed bottom-3 inset-x-4 max-w-lg mx-auto z-40">
          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              setIsCartOpen(true);
            }}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-accent hover:bg-accent-hover text-primary-dark shadow-2xl font-semibold transition-all shadow-glow"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-primary-dark/20 flex items-center justify-center">
                <ShoppingBag className="w-4 h-4 text-primary-dark" />
              </div>
              <div className="text-left">
                <span className="text-xs font-mono font-bold block uppercase tracking-wider">
                  {totalCartCount} {totalCartCount === 1 ? "Item" : "Items"} in Cart
                </span>
                <span className="text-[11px] font-normal opacity-85">
                  Tap to review & order
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-mono text-base font-bold">
                {formatINR(totalCartAmount)}
              </span>
              <span className="text-xs font-bold uppercase tracking-wider bg-primary-dark text-accent px-2.5 py-1 rounded-lg">
                View Order
              </span>
            </div>
          </button>
        </div>
      )}

      {/* Modals */}
      <DishDetailModal
        item={detailItem}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onAddToCart={(cartItem) => {
          updateCart([...cartItems, cartItem]);
        }}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        tableNumber={formattedTableNumber}
        cartItems={cartItems}
        onUpdateQty={handleUpdateCartQty}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        onOrderSuccess={handleOrderSuccess}
      />

      <OrderTrackingModal
        order={activeOrder}
        isOpen={isTrackingOpen}
        onClose={() => setIsTrackingOpen(false)}
        onOpenReview={() => {
          setIsTrackingOpen(false);
          setIsReviewOpen(true);
        }}
      />

      <ServiceRequestModal
        isOpen={isServiceOpen}
        onClose={() => setIsServiceOpen(false)}
        tableNumber={formattedTableNumber}
      />

      <ReviewModal
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        tableNumber={formattedTableNumber}
        orderId={activeOrder?.id}
      />
    </div>
  );
}
