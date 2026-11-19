"use client";

import React from "react";
import Image from "next/image";
import { MenuItem, CartItem } from "@/lib/types";
import { formatINR } from "@/lib/utils";
import { Flame, Star, Plus, Minus, Clock } from "lucide-react";
import { soundManager } from "@/lib/audio";

interface DishCardProps {
  item: MenuItem;
  cartItems: CartItem[];
  onOpenDetail: (item: MenuItem) => void;
  onQuickAdd: (item: MenuItem) => void;
  onUpdateCartQty: (itemId: string, delta: number) => void;
}

export function DishCard({
  item,
  cartItems,
  onOpenDetail,
  onQuickAdd,
  onUpdateCartQty,
}: DishCardProps) {
  // Check if item is already in cart
  const itemInCart = cartItems.find((c) => c.menuItem.id === item.id);
  const totalQty = itemInCart ? itemInCart.quantity : 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundManager.playClick();
    // If it has variants or required addons, open detail modal instead of direct adding
    if (item.variants && item.variants.length > 0) {
      onOpenDetail(item);
    } else {
      onQuickAdd(item);
    }
  };

  const handleQtyChange = (e: React.MouseEvent, delta: number) => {
    e.stopPropagation();
    soundManager.playClick();
    if (itemInCart) {
      onUpdateCartQty(itemInCart.id, delta);
    }
  };

  return (
    <div
      onClick={() => onOpenDetail(item)}
      className="group relative flex flex-col justify-between rounded-xl bg-surface border border-border p-3.5 transition-all duration-200 hover:border-border-strong hover:bg-surface-elevated cursor-pointer"
    >
      <div className="flex gap-3.5">
        {/* Left: Info */}
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            {/* Dietary dot & badges */}
            <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
              {/* Veg / Non-Veg Standard Restaurant Symbol */}
              {item.is_vegetarian ? (
                <span
                  title="Vegetarian"
                  className="flex items-center justify-center w-4 h-4 rounded-sm border border-emerald-500/80 p-0.5"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                </span>
              ) : (
                <span
                  title="Non-Vegetarian"
                  className="flex items-center justify-center w-4 h-4 rounded-sm border border-rose-500/80 p-0.5"
                >
                  <span className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[7px] border-b-rose-500" />
                </span>
              )}

              {item.is_bestseller && (
                <span className="inline-flex items-center gap-0.5 text-[10px] font-medium tracking-wide uppercase px-1.5 py-0.5 rounded bg-champagne-subtle text-champagne border border-champagne/20">
                  <Star className="w-2.5 h-2.5 fill-champagne" />
                  Bestseller
                </span>
              )}

              {item.is_spicy && (
                <span className="inline-flex items-center gap-0.5 text-[10px] font-medium px-1.5 py-0.5 rounded bg-danger-subtle text-danger border border-danger/20">
                  <Flame className="w-2.5 h-2.5" />
                  {item.spice_level === 3 ? "Extra Hot" : "Spicy"}
                </span>
              )}
            </div>

            {/* Title */}
            <h3 className="font-medium text-sm text-primary group-hover:text-accent transition-colors line-clamp-1">
              {item.name}
            </h3>

            {/* Description */}
            <p className="text-xs text-primary-muted line-clamp-2 mt-1 leading-relaxed">
              {item.description}
            </p>
          </div>

          {/* Price & Prep time */}
          <div className="flex items-center gap-2 mt-2.5">
            <span className="text-sm font-semibold text-primary font-mono">
              {formatINR(item.price)}
            </span>
            {item.preparation_time_mins && (
              <span className="flex items-center gap-1 text-[11px] text-primary-muted/70">
                <Clock className="w-3 h-3" />
                {item.preparation_time_mins}m
              </span>
            )}
          </div>
        </div>

        {/* Right: Dish Photo & Add Button */}
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0">
          <div className="w-full h-full rounded-lg overflow-hidden bg-surface-elevated border border-border relative">
            <Image
              src={item.image_url}
              alt={item.name}
              fill
              sizes="(max-width: 640px) 100px, 120px"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>

          {/* Quick Add / Quantity Stepper pill */}
          <div className="absolute -bottom-2 inset-x-2 flex justify-center">
            {totalQty > 0 ? (
              <div
                onClick={(e) => e.stopPropagation()}
                className="flex items-center justify-between w-full bg-surface-elevated border border-accent/40 rounded-md shadow-lg px-1.5 py-1 text-xs text-accent font-medium backdrop-blur"
              >
                <button
                  type="button"
                  onClick={(e) => handleQtyChange(e, -1)}
                  className="w-5 h-5 flex items-center justify-center rounded hover:bg-accent/15 transition-colors"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="font-mono font-semibold text-primary px-1">{totalQty}</span>
                <button
                  type="button"
                  onClick={(e) => handleQtyChange(e, 1)}
                  className="w-5 h-5 flex items-center justify-center rounded hover:bg-accent/15 transition-colors"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleQuickAdd}
                className="flex items-center gap-1 px-3 py-1 bg-surface-elevated hover:bg-accent hover:text-primary-dark border border-border-strong hover:border-accent rounded-md shadow-md text-xs font-medium text-accent transition-all duration-150 uppercase tracking-wider"
              >
                <Plus className="w-3 h-3" />
                ADD
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
