"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRestaurantStore } from "@/lib/store";
import { soundManager } from "@/lib/audio";
import { X, Star, CheckCircle2 } from "lucide-react";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  tableNumber: string;
  orderId?: string;
}

export function ReviewModal({
  isOpen,
  onClose,
  tableNumber,
  orderId,
}: ReviewModalProps) {
  const store = useRestaurantStore();
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [foodRating, setFoodRating] = useState(5);
  const [serviceRating, setServiceRating] = useState(5);
  const [customerName, setCustomerName] = useState("");
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundManager.playClick();

    store.addReview({
      restaurant_id: store.getRestaurant().id,
      order_id: orderId,
      customer_name: customerName.trim() || "Table Guest",
      table_number: tableNumber,
      rating,
      comment: comment.trim(),
      food_rating: foodRating,
      service_rating: serviceRating,
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1800);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="absolute inset-0" onClick={onClose} />

          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 280 }}
            className="relative w-full max-w-md flex flex-col bg-surface border border-border rounded-t-2xl sm:rounded-2xl overflow-hidden shadow-2xl z-10"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-surface-elevated">
              <div>
                <h3 className="font-semibold text-sm text-primary">Rate Your Experience</h3>
                <p className="text-[11px] text-primary-muted">{tableNumber}</p>
              </div>
              <button
                onClick={onClose}
                className="w-7 h-7 rounded-full bg-surface hover:bg-surface-elevated text-primary-muted hover:text-primary flex items-center justify-center border border-border transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5">
              {submitted ? (
                <div className="py-8 flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-champagne-subtle border border-champagne/30 text-champagne flex items-center justify-center mb-3">
                    <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
                  </div>
                  <h4 className="text-base font-semibold text-primary">Muchas Gracias!</h4>
                  <p className="text-xs text-primary-muted mt-1 max-w-xs">
                    Your feedback helps Casa Verde maintain culinary excellence.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Overall Star Rating */}
                  <div className="flex flex-col items-center justify-center py-2">
                    <span className="text-xs text-primary-muted mb-2">Overall Dining Experience</span>
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => {
                            soundManager.playClick();
                            setRating(star);
                          }}
                          className="p-1 text-2xl transition-transform hover:scale-110 focus:outline-none"
                        >
                          <Star
                            className={`w-7 h-7 ${
                              (hoverRating || rating) >= star
                                ? "text-champagne fill-champagne"
                                : "text-border fill-transparent"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sub ratings */}
                  <div className="grid grid-cols-2 gap-3 bg-surface-elevated p-3 rounded-lg border border-border text-xs">
                    <div>
                      <span className="text-primary-muted block mb-1">Food Quality</span>
                      <select
                        value={foodRating}
                        onChange={(e) => setFoodRating(Number(e.target.value))}
                        className="w-full bg-surface border border-border rounded px-2 py-1 text-primary focus:outline-none"
                      >
                        <option value={5}>⭐⭐⭐⭐⭐ (5/5)</option>
                        <option value={4}>⭐⭐⭐⭐ (4/5)</option>
                        <option value={3}>⭐⭐⭐ (3/5)</option>
                        <option value={2}>⭐⭐ (2/5)</option>
                        <option value={1}>⭐ (1/5)</option>
                      </select>
                    </div>

                    <div>
                      <span className="text-primary-muted block mb-1">Service Speed</span>
                      <select
                        value={serviceRating}
                        onChange={(e) => setServiceRating(Number(e.target.value))}
                        className="w-full bg-surface border border-border rounded px-2 py-1 text-primary focus:outline-none"
                      >
                        <option value={5}>⭐⭐⭐⭐⭐ (5/5)</option>
                        <option value={4}>⭐⭐⭐⭐ (4/5)</option>
                        <option value={3}>⭐⭐⭐ (3/5)</option>
                        <option value={2}>⭐⭐ (2/5)</option>
                        <option value={1}>⭐ (1/5)</option>
                      </select>
                    </div>
                  </div>

                  {/* Name */}
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-primary-muted mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Priya Sharma"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full rounded-lg bg-surface-elevated border border-border px-3 py-2 text-xs text-primary focus:outline-none focus:border-accent"
                    />
                  </div>

                  {/* Comment */}
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-primary-muted mb-1">
                      Tell us what you loved
                    </label>
                    <textarea
                      required
                      placeholder="Favorite dish, beverage notes, or comments for the chef..."
                      rows={3}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full rounded-lg bg-surface-elevated border border-border px-3 py-2 text-xs text-primary focus:outline-none focus:border-accent resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-champagne hover:bg-champagne-hover text-primary-dark font-semibold text-xs transition-colors font-mono tracking-wide shadow-glow-gold"
                  >
                    SUBMIT REVIEW
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
