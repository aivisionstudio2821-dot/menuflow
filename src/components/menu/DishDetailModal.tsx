"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { MenuItem, MenuItemVariant, MenuItemAddon, CartItem } from "@/lib/types";
import { formatINR } from "@/lib/utils";
import { X, Flame, Star, Plus, Minus, Check, Clock } from "lucide-react";
import { soundManager } from "@/lib/audio";

interface DishDetailModalProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (cartItem: CartItem) => void;
}

export function DishDetailModal({
  item,
  isOpen,
  onClose,
  onAddToCart,
}: DishDetailModalProps) {
  if (!item) return null;

  // Selected variant state
  const defaultVariant = item.variants?.find((v) => v.is_default) || item.variants?.[0];
  const [selectedVariant, setSelectedVariant] = useState<MenuItemVariant | undefined>(defaultVariant);

  // Selected addons state
  const [selectedAddons, setSelectedAddons] = useState<MenuItemAddon[]>([]);

  // Quantity
  const [quantity, setQuantity] = useState(1);

  // Special notes
  const [specialInstructions, setSpecialInstructions] = useState("");

  const toggleAddon = (addon: MenuItemAddon) => {
    soundManager.playClick();
    if (selectedAddons.some((a) => a.id === addon.id)) {
      setSelectedAddons(selectedAddons.filter((a) => a.id !== addon.id));
    } else {
      setSelectedAddons([...selectedAddons, addon]);
    }
  };

  // Calculate current unit price
  const variantAdj = selectedVariant ? Number(selectedVariant.price_adjustment) : 0;
  const addonsTotal = selectedAddons.reduce((sum, a) => sum + Number(a.price), 0);
  const unitPrice = Number(item.price) + variantAdj + addonsTotal;
  const totalPrice = unitPrice * quantity;

  const handleAdd = () => {
    soundManager.playClick();
    const cartItem: CartItem = {
      id: `${item.id}-${selectedVariant?.id || "base"}-${selectedAddons.map((a) => a.id).sort().join("-")}-${Date.now()}`,
      menuItem: item,
      selectedVariant,
      selectedAddons,
      quantity,
      specialInstructions: specialInstructions.trim() || undefined,
      unitPrice,
      totalPrice,
    };
    onAddToCart(cartItem);
    onClose();
    // Reset state
    setQuantity(1);
    setSelectedAddons([]);
    setSpecialInstructions("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-sm">
          {/* Backdrop click */}
          <div className="absolute inset-0" onClick={onClose} />

          {/* Modal Content */}
          <motion.div
            initial={{ y: "100%", opacity: 0.5 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 280 }}
            className="relative w-full max-w-lg max-h-[90vh] flex flex-col bg-surface border border-border rounded-t-2xl sm:rounded-2xl overflow-hidden shadow-2xl z-10"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-primary flex items-center justify-center border border-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Scrollable Container */}
            <div className="overflow-y-auto flex-1 no-scrollbar pb-24">
              {/* Hero Image */}
              <div className="relative w-full h-56 sm:h-64 bg-surface-elevated">
                <Image
                  src={item.image_url}
                  alt={item.name}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-black/30" />
              </div>

              {/* Main Info */}
              <div className="px-5 pt-3">
                {/* Badges */}
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  {item.is_vegetarian ? (
                    <span className="flex items-center gap-1 text-xs font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      Vegetarian
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs font-medium text-rose-400 bg-rose-950/60 border border-rose-500/30 px-2 py-0.5 rounded">
                      <span className="w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-b-[6px] border-b-rose-500" />
                      Non-Veg
                    </span>
                  )}

                  {item.is_bestseller && (
                    <span className="flex items-center gap-1 text-xs font-medium text-champagne bg-champagne-subtle border border-champagne/25 px-2 py-0.5 rounded">
                      <Star className="w-3 h-3 fill-champagne" />
                      Bestseller
                    </span>
                  )}

                  {item.is_spicy && (
                    <span className="flex items-center gap-1 text-xs font-medium text-danger bg-danger-subtle border border-danger/25 px-2 py-0.5 rounded">
                      <Flame className="w-3 h-3" />
                      {item.spice_level === 3 ? "Extra Hot" : "Spicy"}
                    </span>
                  )}

                  {item.preparation_time_mins && (
                    <span className="flex items-center gap-1 text-xs text-primary-muted bg-surface-elevated px-2 py-0.5 rounded border border-border">
                      <Clock className="w-3 h-3" />
                      {item.preparation_time_mins} mins
                    </span>
                  )}
                </div>

                {/* Name & Base Price */}
                <h2 className="text-xl font-semibold text-primary">{item.name}</h2>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-lg font-bold text-accent font-mono">
                    {formatINR(item.price)}
                  </span>
                  {item.calories && (
                    <span className="text-xs text-primary-muted">
                      ({item.calories} kcal)
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-sm text-primary-muted mt-2 leading-relaxed">
                  {item.description}
                </p>

                {/* Allergens warning if any */}
                {item.allergens && item.allergens.length > 0 && item.allergens[0] !== "None" && (
                  <div className="mt-3 text-xs text-primary-muted/80 bg-surface-elevated/70 p-2.5 rounded-lg border border-border">
                    <span className="text-champagne font-medium">Allergen Notice: </span>
                    Contains {item.allergens.join(", ")}
                  </div>
                )}

                {/* Variants (e.g. Tortilla choice) */}
                {item.variants && item.variants.length > 0 && (
                  <div className="mt-5 border-t border-border pt-4">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-primary-muted mb-2.5">
                      Select Preparation / Option
                    </h3>
                    <div className="space-y-2">
                      {item.variants.map((v) => {
                        const isSelected = selectedVariant?.id === v.id;
                        return (
                          <button
                            key={v.id}
                            type="button"
                            onClick={() => {
                              soundManager.playClick();
                              setSelectedVariant(v);
                            }}
                            className={`w-full flex items-center justify-between p-3 rounded-lg border text-sm transition-all ${
                              isSelected
                                ? "bg-accent/10 border-accent text-primary"
                                : "bg-surface-elevated/60 border-border text-primary-muted hover:border-border-strong"
                            }`}
                          >
                            <span className="font-medium">{v.name}</span>
                            <div className="flex items-center gap-2">
                              {Number(v.price_adjustment) > 0 && (
                                <span className="text-xs text-accent font-mono">
                                  +{formatINR(v.price_adjustment)}
                                </span>
                              )}
                              <div
                                className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                  isSelected
                                    ? "border-accent bg-accent text-primary-dark"
                                    : "border-primary-muted/40"
                                }`}
                              >
                                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-primary-dark" />}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Add-ons */}
                {item.addons && item.addons.length > 0 && (
                  <div className="mt-5 border-t border-border pt-4">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-primary-muted mb-2.5">
                      Extra Add-ons
                    </h3>
                    <div className="space-y-2">
                      {item.addons.map((addon) => {
                        const isChecked = selectedAddons.some((a) => a.id === addon.id);
                        return (
                          <button
                            key={addon.id}
                            type="button"
                            onClick={() => toggleAddon(addon)}
                            className={`w-full flex items-center justify-between p-3 rounded-lg border text-sm transition-all ${
                              isChecked
                                ? "bg-accent/10 border-accent/70 text-primary"
                                : "bg-surface-elevated/60 border-border text-primary-muted hover:border-border-strong"
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <div
                                className={`w-4 h-4 rounded border flex items-center justify-center ${
                                  isChecked
                                    ? "bg-accent border-accent text-primary-dark"
                                    : "border-primary-muted/40"
                                }`}
                              >
                                {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                              </div>
                              <span className="font-medium text-left">{addon.name}</span>
                            </div>
                            <span className="text-xs text-accent font-mono">
                              +{formatINR(addon.price)}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Special Instructions */}
                <div className="mt-5 border-t border-border pt-4">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-primary-muted mb-2">
                    Cooking / Chef Notes (Optional)
                  </label>
                  <textarea
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    placeholder="e.g. Less spicy, dressing on the side, extra lime..."
                    rows={2}
                    className="w-full rounded-lg bg-surface-elevated border border-border px-3 py-2 text-xs text-primary placeholder:text-primary-muted/50 focus:outline-none focus:border-accent resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Sticky Action Bar */}
            <div className="absolute bottom-0 inset-x-0 p-3 sm:p-4 bg-surface/95 backdrop-blur border-t border-border flex items-center gap-3">
              {/* Stepper */}
              <div className="flex items-center bg-surface-elevated border border-border rounded-lg p-1">
                <button
                  type="button"
                  onClick={() => {
                    soundManager.playClick();
                    setQuantity(Math.max(1, quantity - 1));
                  }}
                  className="w-8 h-8 rounded flex items-center justify-center text-primary-muted hover:text-primary hover:bg-surface transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-mono font-semibold text-primary text-sm">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    soundManager.playClick();
                    setQuantity(quantity + 1);
                  }}
                  className="w-8 h-8 rounded flex items-center justify-center text-primary-muted hover:text-primary hover:bg-surface transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Add CTA */}
              <button
                type="button"
                onClick={handleAdd}
                className="flex-1 flex items-center justify-between px-5 py-3 rounded-lg bg-accent hover:bg-accent-hover text-primary-dark font-medium transition-all shadow-glow font-mono text-sm tracking-wide"
              >
                <span>ADD TO ORDER</span>
                <span className="font-bold">{formatINR(totalPrice)}</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
