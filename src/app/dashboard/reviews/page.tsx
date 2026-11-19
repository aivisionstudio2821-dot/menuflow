"use client";

import React from "react";
import { Header } from "@/components/dashboard/Header";
import { useRestaurantStore } from "@/lib/store";
import { formatDate } from "@/lib/utils";
import { Star, MessageSquare, ThumbsUp, Sparkles } from "lucide-react";

export default function ReviewsManagementPage() {
  const store = useRestaurantStore();
  const reviews = store.getReviews();

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : "5.0";

  const fiveStars = reviews.filter((r) => r.rating === 5).length;
  const fourStars = reviews.filter((r) => r.rating === 4).length;

  return (
    <div className="flex-1 pb-16">
      <Header
        title="Customer Ratings & Feedback"
        subtitle="Verified table dining reviews, kitchen ratings, and hospitality sentiment"
      />

      <div className="px-4 sm:px-8 py-6 space-y-6 max-w-5xl">
        {/* Rating KPI Top Card */}
        <div className="p-6 rounded-2xl bg-surface border border-border flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="text-center sm:text-left">
              <span className="text-4xl sm:text-5xl font-black font-mono text-champagne">
                {avgRating}
              </span>
              <div className="flex items-center gap-1 mt-1 justify-center sm:justify-start">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-4 h-4 fill-champagne text-champagne" />
                ))}
              </div>
              <span className="text-xs text-primary-muted block mt-1">
                Based on {reviews.length} authentic dining reviews
              </span>
            </div>
          </div>

          <div className="flex-1 max-w-xs space-y-1.5 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-12 text-primary-muted font-mono">5 Stars</span>
              <div className="flex-1 bg-surface-elevated h-2 rounded-full overflow-hidden">
                <div
                  style={{ width: `${(fiveStars / (reviews.length || 1)) * 100}%` }}
                  className="bg-champagne h-full rounded-full"
                />
              </div>
              <span className="w-6 text-right font-mono text-primary">{fiveStars}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-12 text-primary-muted font-mono">4 Stars</span>
              <div className="flex-1 bg-surface-elevated h-2 rounded-full overflow-hidden">
                <div
                  style={{ width: `${(fourStars / (reviews.length || 1)) * 100}%` }}
                  className="bg-champagne/70 h-full rounded-full"
                />
              </div>
              <span className="w-6 text-right font-mono text-primary">{fourStars}</span>
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-primary-muted">
            Recent Feedback Stream
          </h3>

          <div className="space-y-3">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="p-5 rounded-xl bg-surface border border-border hover:border-border-strong transition-all space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-surface-elevated border border-border flex items-center justify-center font-bold text-xs text-accent font-mono">
                      {rev.customer_name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-primary">
                        {rev.customer_name}
                      </h4>
                      <span className="text-[11px] text-primary-muted font-mono">
                        {rev.table_number || "Table Guest"} • {formatDate(rev.created_at)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((st) => (
                      <Star
                        key={st}
                        className={`w-3.5 h-3.5 ${
                          rev.rating >= st
                            ? "fill-champagne text-champagne"
                            : "text-border"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-primary leading-relaxed">
                  "{rev.comment}"
                </p>

                {(rev.food_rating || rev.service_rating) && (
                  <div className="flex items-center gap-3 pt-2 text-[11px] text-primary-muted font-mono border-t border-border/60">
                    {rev.food_rating && (
                      <span>Food Quality: <span className="text-accent font-bold">{rev.food_rating}/5</span></span>
                    )}
                    {rev.service_rating && (
                      <span>Speed: <span className="text-accent font-bold">{rev.service_rating}/5</span></span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
