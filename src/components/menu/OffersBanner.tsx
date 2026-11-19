"use client";

import React from "react";
import { Offer } from "@/lib/types";
import { Sparkles, Tag } from "lucide-react";
import { formatINR } from "@/lib/utils";

interface OffersBannerProps {
  offers: Offer[];
  onSelectOffer?: (offer: Offer) => void;
}

export function OffersBanner({ offers, onSelectOffer }: OffersBannerProps) {
  const activeOffers = offers.filter((o) => o.is_active);

  if (activeOffers.length === 0) return null;

  return (
    <div className="flex gap-2.5 overflow-x-auto py-2 px-4 no-scrollbar">
      {activeOffers.map((offer) => (
        <div
          key={offer.id}
          onClick={() => onSelectOffer?.(offer)}
          className="flex-shrink-0 flex items-center gap-2.5 px-3 py-2 rounded-xl bg-surface-elevated/90 border border-champagne/30 hover:border-champagne text-xs cursor-pointer transition-all shadow-sm"
        >
          <div className="w-6 h-6 rounded-md bg-champagne-subtle text-champagne flex items-center justify-center flex-shrink-0">
            <Tag className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-champagne font-mono tracking-wide">
                {offer.code}
              </span>
              <span className="text-[10px] text-primary-muted font-normal">
                • Min {formatINR(offer.minimum_order_amount)}
              </span>
            </div>
            <p className="text-[11px] text-primary font-medium line-clamp-1">
              {offer.title}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
