"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CartItem, Offer, PaymentMethod, Order } from "@/lib/types";
import { formatINR } from "@/lib/utils";
import {
  X,
  Plus,
  Minus,
  Trash2,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  Banknote,
  Smartphone,
  ShieldCheck,
} from "lucide-react";
import confetti from "canvas-confetti";
import { soundManager } from "@/lib/audio";
import { useRestaurantStore } from "@/lib/store";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  tableNumber: string;
  cartItems: CartItem[];
  onUpdateQty: (cartItemId: string, delta: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onClearCart: () => void;
  onOrderSuccess: (order: Order) => void;
}

export function CartDrawer({
  isOpen,
  onClose,
  tableNumber,
  cartItems,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
  onOrderSuccess,
}: CartDrawerProps) {
  const store = useRestaurantStore();
  const settings = store.getSettings();
  const offers = store.getOffers().filter((o) => o.is_active);

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [kitchenNotes, setKitchenNotes] = useState("");
  const [promoCodeInput, setPromoCodeInput] = useState("");
  const [appliedOffer, setAppliedOffer] = useState<Offer | null>(null);
  const [offerError, setOfferError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("UPI");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculations
  const subtotal = cartItems.reduce((acc, item) => acc + item.totalPrice, 0);

  // Calculate discount
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

  const handleApplyOffer = (offer: Offer) => {
    soundManager.playClick();
    if (subtotal < offer.minimum_order_amount) {
      setOfferError(`Minimum order of ${formatINR(offer.minimum_order_amount)} required`);
      return;
    }
    setAppliedOffer(offer);
    setOfferError("");
  };

  const handleApplyPromoCode = (e: React.FormEvent) => {
    e.preventDefault();
    const code = promoCodeInput.trim().toUpperCase();
    const match = offers.find((o) => o.code.toUpperCase() === code);
    if (!match) {
      setOfferError("Invalid promo code");
      return;
    }
    handleApplyOffer(match);
  };

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0 || isSubmitting) return;

    setIsSubmitting(true);
    soundManager.playClick();

    try {
      // Simulate brief network latency for realism
      await new Promise((resolve) => setTimeout(resolve, 400));

      const newOrder = store.placeOrder(
        tableNumber,
        cartItems,
        {
          name: customerName.trim() || undefined,
          phone: customerPhone.trim() || undefined,
          notes: kitchenNotes.trim() || undefined,
        },
        appliedOffer,
        paymentMethod
      );

      // Trigger celebratory confetti
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
        colors: ["#2DD4BF", "#E7C77A", "#34D399", "#FFFFFF"],
      });

      onClearCart();
      onOrderSuccess(newOrder);
      onClose();
    } catch (e) {
      console.error("Order submission error:", e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm">
          {/* Backdrop */}
          <div className="absolute inset-0" onClick={onClose} />

          {/* Drawer / Modal Container */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 280 }}
            className="relative w-full max-w-lg max-h-[92vh] flex flex-col bg-surface border border-border rounded-t-2xl sm:rounded-2xl overflow-hidden shadow-2xl z-10"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-surface-elevated">
              <div className="flex items-center gap-2">
                <h2 className="font-semibold text-base text-primary">Your Table Order</h2>
                <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-accent-subtle text-accent border border-accent/20">
                  {tableNumber.toUpperCase()}
                </span>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-surface hover:bg-surface-elevated text-primary-muted hover:text-primary flex items-center justify-center border border-border transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="overflow-y-auto flex-1 no-scrollbar p-5 space-y-5">
              {cartItems.length === 0 ? (
                <div className="py-12 text-center text-primary-muted">
                  <p className="text-sm">Your order is empty.</p>
                  <button
                    onClick={onClose}
                    className="mt-3 text-xs text-accent underline underline-offset-4"
                  >
                    Browse Menu
                  </button>
                </div>
              ) : (
                <>
                  {/* Item List */}
                  <div className="space-y-3">
                    {cartItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-start justify-between p-3 rounded-lg bg-surface-elevated border border-border"
                      >
                        <div className="flex-1 pr-3">
                          <h4 className="text-sm font-medium text-primary">
                            {item.menuItem.name}
                          </h4>
                          {item.selectedVariant && (
                            <p className="text-[11px] text-accent font-medium mt-0.5">
                              {item.selectedVariant.name}
                            </p>
                          )}
                          {item.selectedAddons.length > 0 && (
                            <p className="text-[11px] text-primary-muted mt-0.5">
                              + {item.selectedAddons.map((a) => a.name).join(", ")}
                            </p>
                          )}
                          {item.specialInstructions && (
                            <p className="text-[11px] italic text-primary-muted/80 mt-1">
                              Note: {item.specialInstructions}
                            </p>
                          )}
                          <div className="text-xs font-mono font-semibold text-primary mt-1.5">
                            {formatINR(item.totalPrice)}
                          </div>
                        </div>

                        {/* Quantity Controls & Delete */}
                        <div className="flex items-center gap-2">
                          <div className="flex items-center bg-surface border border-border rounded-md">
                            <button
                              type="button"
                              onClick={() => onUpdateQty(item.id, -1)}
                              className="w-6 h-6 flex items-center justify-center text-primary-muted hover:text-primary"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-6 text-center text-xs font-mono font-semibold text-primary">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => onUpdateQty(item.id, 1)}
                              className="w-6 h-6 flex items-center justify-center text-primary-muted hover:text-primary"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => onRemoveItem(item.id)}
                            className="p-1 text-primary-muted hover:text-danger transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Offers & Promo Section */}
                  <div className="rounded-lg bg-surface-elevated/70 border border-border p-3.5 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
                        <Sparkles className="w-3.5 h-3.5 text-champagne" />
                        Offers & Discounts
                      </span>
                      {appliedOffer && (
                        <button
                          onClick={() => setAppliedOffer(null)}
                          className="text-[11px] text-danger hover:underline"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    {appliedOffer ? (
                      <div className="flex items-center justify-between p-2 rounded bg-accent-subtle border border-accent/30 text-xs">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-accent" />
                          <span className="font-semibold text-accent font-mono">
                            {appliedOffer.code} applied!
                          </span>
                        </div>
                        <span className="font-mono font-semibold text-accent">
                          -{formatINR(discountAmount)}
                        </span>
                      </div>
                    ) : (
                      <>
                        {/* Quick offer chips */}
                        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                          {offers.map((offer) => (
                            <button
                              key={offer.id}
                              type="button"
                              onClick={() => handleApplyOffer(offer)}
                              className="flex-shrink-0 flex items-center gap-1 px-2.5 py-1 rounded bg-surface hover:bg-champagne-subtle border border-border hover:border-champagne/40 text-xs text-primary transition-all font-mono"
                            >
                              <span className="font-bold text-champagne">{offer.code}</span>
                              <span className="text-[10px] text-primary-muted">
                                ({offer.discount_type === "PERCENTAGE" ? `${offer.discount_value}%` : `₹${offer.discount_value}`} off)
                              </span>
                            </button>
                          ))}
                        </div>

                        {/* Input custom promo */}
                        <form onSubmit={handleApplyPromoCode} className="flex gap-2 mt-2">
                          <input
                            type="text"
                            placeholder="Enter coupon code"
                            value={promoCodeInput}
                            onChange={(e) => {
                              setPromoCodeInput(e.target.value);
                              setOfferError("");
                            }}
                            className="flex-1 rounded-md bg-surface border border-border px-3 py-1.5 text-xs text-primary uppercase placeholder:normal-case focus:outline-none focus:border-accent font-mono"
                          />
                          <button
                            type="submit"
                            className="px-3 py-1.5 rounded-md bg-surface-elevated hover:bg-accent hover:text-primary-dark border border-border text-xs font-medium text-accent transition-colors"
                          >
                            Apply
                          </button>
                        </form>
                        {offerError && <p className="text-[11px] text-danger">{offerError}</p>}
                      </>
                    )}
                  </div>

                  {/* Customer Information (Optional for anonymous table dining) */}
                  <div className="space-y-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-primary-muted">
                      Guest Details (Optional)
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Your Name"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="rounded-lg bg-surface-elevated border border-border px-3 py-2 text-xs text-primary placeholder:text-primary-muted/50 focus:outline-none focus:border-accent"
                      />
                      <input
                        type="tel"
                        placeholder="Mobile (for SMS update)"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="rounded-lg bg-surface-elevated border border-border px-3 py-2 text-xs text-primary placeholder:text-primary-muted/50 focus:outline-none focus:border-accent"
                      />
                    </div>
                  </div>

                  {/* Payment Method Selector */}
                  <div className="space-y-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-primary-muted">
                      Select Payment Mode
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          soundManager.playClick();
                          setPaymentMethod("UPI");
                        }}
                        className={`flex flex-col items-center justify-center p-2.5 rounded-lg border text-xs transition-all ${
                          paymentMethod === "UPI"
                            ? "bg-accent/10 border-accent text-accent font-semibold"
                            : "bg-surface-elevated border-border text-primary-muted hover:border-border-strong"
                        }`}
                      >
                        <Smartphone className="w-4 h-4 mb-1" />
                        <span>UPI / QR</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          soundManager.playClick();
                          setPaymentMethod("CARDS");
                        }}
                        className={`flex flex-col items-center justify-center p-2.5 rounded-lg border text-xs transition-all ${
                          paymentMethod === "CARDS"
                            ? "bg-accent/10 border-accent text-accent font-semibold"
                            : "bg-surface-elevated border-border text-primary-muted hover:border-border-strong"
                        }`}
                      >
                        <CreditCard className="w-4 h-4 mb-1" />
                        <span>Cards</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          soundManager.playClick();
                          setPaymentMethod("CASH");
                        }}
                        className={`flex flex-col items-center justify-center p-2.5 rounded-lg border text-xs transition-all ${
                          paymentMethod === "CASH"
                            ? "bg-accent/10 border-accent text-accent font-semibold"
                            : "bg-surface-elevated border-border text-primary-muted hover:border-border-strong"
                        }`}
                      >
                        <Banknote className="w-4 h-4 mb-1" />
                        <span>Pay at Table</span>
                      </button>
                    </div>
                  </div>

                  {/* Special instructions */}
                  <div>
                    <input
                      type="text"
                      placeholder="Add kitchen note (e.g. bring food together)..."
                      value={kitchenNotes}
                      onChange={(e) => setKitchenNotes(e.target.value)}
                      className="w-full rounded-lg bg-surface-elevated border border-border px-3 py-2 text-xs text-primary placeholder:text-primary-muted/50 focus:outline-none focus:border-accent"
                    />
                  </div>

                  {/* Bill Summary */}
                  <div className="rounded-lg bg-surface-elevated/80 border border-border p-3.5 space-y-2 text-xs">
                    <div className="flex justify-between text-primary-muted">
                      <span>Item Subtotal</span>
                      <span className="font-mono">{formatINR(subtotal)}</span>
                    </div>

                    {discountAmount > 0 && (
                      <div className="flex justify-between text-accent font-medium">
                        <span>Special Discount</span>
                        <span className="font-mono">-{formatINR(discountAmount)}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-primary-muted">
                      <span>GST ({settings.tax_rate}%)</span>
                      <span className="font-mono">{formatINR(taxAmount)}</span>
                    </div>

                    {settings.service_charge_rate > 0 && (
                      <div className="flex justify-between text-primary-muted">
                        <span>Staff Service Fee ({settings.service_charge_rate}%)</span>
                        <span className="font-mono">{formatINR(serviceCharge)}</span>
                      </div>
                    )}

                    <div className="border-t border-border pt-2 flex justify-between text-sm font-semibold text-primary">
                      <span>Grand Total</span>
                      <span className="font-mono text-accent text-base">
                        {formatINR(totalAmount)}
                      </span>
                    </div>
                  </div>

                  {/* Security notice */}
                  <div className="flex items-center justify-center gap-1.5 text-[11px] text-primary-muted/70 pb-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-accent" />
                    <span>Razorpay 256-bit encrypted checkout</span>
                  </div>
                </>
              )}
            </div>

            {/* Bottom Sticky Action Bar */}
            {cartItems.length > 0 && (
              <div className="p-4 bg-surface border-t border-border">
                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-between px-5 py-3.5 rounded-xl bg-accent hover:bg-accent-hover text-primary-dark font-semibold transition-all shadow-glow font-mono text-sm tracking-wide disabled:opacity-50"
                >
                  <span>{isSubmitting ? "TRANSMITTING TO KITCHEN..." : "CONFIRM & PLACE ORDER"}</span>
                  <div className="flex items-center gap-1">
                    <span>{formatINR(totalAmount)}</span>
                    <ChevronRight className="w-4 h-4 stroke-[3]" />
                  </div>
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
