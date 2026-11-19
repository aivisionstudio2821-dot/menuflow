"use client";

import React, { useState } from "react";
import { Header } from "@/components/dashboard/Header";
import { useRestaurantStore } from "@/lib/store";
import { Offer } from "@/lib/types";
import { formatINR } from "@/lib/utils";
import { soundManager } from "@/lib/audio";
import { Plus, Tag, Check, X, Sparkles, Percent, IndianRupee } from "lucide-react";

export default function OffersManagementPage() {
  const store = useRestaurantStore();
  const offers = store.getOffers();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [code, setCode] = useState("");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [discountType, setDiscountType] = useState<"PERCENTAGE" | "FLAT">("PERCENTAGE");
  const [discountValue, setDiscountValue] = useState(15);
  const [minOrder, setMinOrder] = useState(500);

  const handleCreateOffer = (e: React.FormEvent) => {
    e.preventDefault();
    soundManager.playClick();

    store.addOffer({
      restaurant_id: store.getRestaurant().id,
      code: code.trim().toUpperCase(),
      title,
      description: desc,
      discount_type: discountType,
      discount_value: Number(discountValue),
      minimum_order_amount: Number(minOrder),
      is_active: true,
      start_date: new Date().toISOString(),
    });

    setIsModalOpen(false);
    setCode("");
    setTitle("");
    setDesc("");
  };

  const handleToggle = (id: string) => {
    soundManager.playClick();
    store.toggleOfferActive(id);
  };

  return (
    <div className="flex-1 pb-16">
      <Header
        title="Promotions & Offers Studio"
        subtitle="Create dynamic dining discounts, happy hour specials, and bill deductions"
        actionButton={
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-champagne hover:bg-champagne-hover text-primary-dark font-semibold text-xs transition-colors shadow-glow-gold"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Create Promo Offer</span>
          </button>
        }
      />

      <div className="px-4 sm:px-8 py-6 space-y-6 max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {offers.map((offer) => {
            return (
              <div
                key={offer.id}
                className={`flex flex-col justify-between p-5 rounded-xl border transition-all ${
                  offer.is_active
                    ? "bg-surface border-champagne/30 shadow-card"
                    : "bg-surface/50 border-border opacity-60"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-border">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-champagne-subtle text-champagne flex items-center justify-center font-bold">
                        <Tag className="w-4 h-4" />
                      </div>
                      <span className="font-mono font-bold text-sm text-champagne tracking-wider">
                        {offer.code}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggle(offer.id)}
                      className={`text-[11px] font-mono px-2.5 py-0.5 rounded-full font-semibold transition-colors ${
                        offer.is_active
                          ? "bg-emerald-950/80 text-emerald-300 border border-emerald-500/30"
                          : "bg-surface text-primary-muted border border-border"
                      }`}
                    >
                      {offer.is_active ? "ACTIVE" : "DISABLED"}
                    </button>
                  </div>

                  <h4 className="text-sm font-semibold text-primary mt-3">
                    {offer.title}
                  </h4>
                  <p className="text-xs text-primary-muted mt-1 leading-relaxed">
                    {offer.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs font-mono">
                  <span className="text-accent font-semibold">
                    {offer.discount_type === "PERCENTAGE"
                      ? `${offer.discount_value}% Discount`
                      : `${formatINR(offer.discount_value)} Flat Off`}
                  </span>
                  <span className="text-primary-muted">
                    Min Order: {formatINR(offer.minimum_order_amount)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-surface border border-border rounded-2xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-surface-elevated">
              <h3 className="font-semibold text-sm text-primary">Create Dining Offer</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-7 h-7 rounded-full bg-surface hover:bg-surface-elevated text-primary-muted hover:text-primary flex items-center justify-center border border-border"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateOffer} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-primary-muted mb-1">
                  Coupon Code
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. FIESTA20"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="w-full rounded-lg bg-surface-elevated border border-border px-3 py-2 text-primary focus:outline-none focus:border-accent font-mono uppercase"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-primary-muted mb-1">
                  Offer Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 20% Off Culinary Platter"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-lg bg-surface-elevated border border-border px-3 py-2 text-primary focus:outline-none focus:border-accent"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-primary-muted mb-1">
                    Discount Type
                  </label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as "PERCENTAGE" | "FLAT")}
                    className="w-full rounded-lg bg-surface-elevated border border-border px-3 py-2 text-primary focus:outline-none focus:border-accent"
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FLAT">Flat ₹ (INR)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-primary-muted mb-1">
                    Discount Value
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    className="w-full rounded-lg bg-surface-elevated border border-border px-3 py-2 text-primary focus:outline-none focus:border-accent font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-primary-muted mb-1">
                  Minimum Order (₹ INR)
                </label>
                <input
                  type="number"
                  required
                  min={0}
                  value={minOrder}
                  onChange={(e) => setMinOrder(Number(e.target.value))}
                  className="w-full rounded-lg bg-surface-elevated border border-border px-3 py-2 text-primary focus:outline-none focus:border-accent font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-primary-muted mb-1">
                  Customer Description
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="Brief explanation of offer terms..."
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  className="w-full rounded-lg bg-surface-elevated border border-border px-3 py-2 text-primary focus:outline-none focus:border-accent resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-surface-elevated text-primary-muted hover:text-primary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-champagne hover:bg-champagne-hover text-primary-dark font-semibold font-mono"
                >
                  ACTIVATE OFFER
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
