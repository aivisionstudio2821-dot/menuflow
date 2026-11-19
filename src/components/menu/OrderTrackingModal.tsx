"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Order, OrderStatus } from "@/lib/types";
import { formatINR, formatTime } from "@/lib/utils";
import {
  X,
  CheckCircle2,
  Clock,
  ChefHat,
  BellRing,
  Utensils,
  Receipt,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { soundManager } from "@/lib/audio";

interface OrderTrackingModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenReview?: () => void;
}

const TIMELINE_STEPS: { status: OrderStatus; label: string; desc: string; icon: React.ElementType }[] = [
  { status: "NEW", label: "Order Received", desc: "Sent straight to kitchen terminal", icon: Clock },
  { status: "CONFIRMED", label: "Kitchen Confirmed", desc: "Head chef accepted ticket", icon: CheckCircle2 },
  { status: "PREPARING", label: "Preparing in Hearth", desc: "Cooking freshly with authentic spices", icon: ChefHat },
  { status: "READY", label: "Plated & Ready", desc: "Runner dispatched to your table", icon: BellRing },
  { status: "SERVED", label: "Delivered to Table", desc: "Dishes placed at your table", icon: Utensils },
  { status: "COMPLETED", label: "Completed", desc: "Hope you enjoyed the dining experience!", icon: Sparkles },
];

export function OrderTrackingModal({
  order,
  isOpen,
  onClose,
  onOpenReview,
}: OrderTrackingModalProps) {
  const [showReceipt, setShowReceipt] = useState(false);

  if (!order) return null;

  const currentIdx = TIMELINE_STEPS.findIndex((s) => s.status === order.status);
  const activeStep = currentIdx >= 0 ? currentIdx : 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/85 backdrop-blur-md">
          {/* Backdrop */}
          <div className="absolute inset-0" onClick={onClose} />

          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 280 }}
            className="relative w-full max-w-lg max-h-[92vh] flex flex-col bg-surface border border-border rounded-t-2xl sm:rounded-2xl overflow-hidden shadow-2xl z-10"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-surface-elevated">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-accent animate-ping" />
                <h2 className="font-semibold text-base text-primary">Live Order Status</h2>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-surface hover:bg-surface-elevated text-primary-muted hover:text-primary flex items-center justify-center border border-border transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto flex-1 no-scrollbar p-5 space-y-6">
              {/* Top Banner */}
              <div className="rounded-xl bg-gradient-to-br from-surface-elevated to-surface border border-border p-4 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-mono text-primary-muted uppercase tracking-wider">
                    Order Ref
                  </span>
                  <div className="text-xl font-bold font-mono text-accent">
                    {order.order_number}
                  </div>
                  <div className="text-xs text-primary-muted mt-0.5">
                    {order.table_number} • Placed at {formatTime(order.created_at)}
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] font-mono text-primary-muted uppercase tracking-wider">
                    Amount
                  </span>
                  <div className="text-lg font-bold font-mono text-primary">
                    {formatINR(order.total_amount)}
                  </div>
                  <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded bg-accent-subtle text-accent border border-accent/20 uppercase mt-0.5">
                    {order.payment_method} • {order.payment_status}
                  </span>
                </div>
              </div>

              {/* Animated Timeline */}
              <div className="space-y-4 px-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-primary-muted">
                  Kitchen Progress
                </h3>

                <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
                  {TIMELINE_STEPS.map((step, idx) => {
                    const isDone = idx < activeStep;
                    const isCurrent = idx === activeStep;
                    const isPending = idx > activeStep;
                    const Icon = step.icon;

                    return (
                      <div key={step.status} className="relative flex items-start gap-3.5">
                        {/* Dot / Indicator */}
                        <div
                          className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full flex items-center justify-center border transition-all ${
                            isDone
                              ? "bg-accent border-accent text-primary-dark"
                              : isCurrent
                              ? "bg-accent border-accent text-primary-dark ring-4 ring-accent/20 animate-pulse"
                              : "bg-surface-elevated border-border text-primary-muted/40"
                          }`}
                        >
                          {isDone ? (
                            <CheckCircle2 className="w-3 h-3 stroke-[3]" />
                          ) : (
                            <span className="w-1.5 h-1.5 rounded-full bg-current" />
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-sm font-semibold transition-colors ${
                                isCurrent
                                  ? "text-accent"
                                  : isDone
                                  ? "text-primary"
                                  : "text-primary-muted/50"
                              }`}
                            >
                              {step.label}
                            </span>
                            {isCurrent && (
                              <span className="text-[10px] font-mono font-medium px-1.5 py-0.2 rounded bg-accent/20 text-accent uppercase">
                                In Progress
                              </span>
                            )}
                          </div>
                          <p
                            className={`text-xs mt-0.5 transition-colors ${
                              isCurrent || isDone
                                ? "text-primary-muted"
                                : "text-primary-muted/40"
                            }`}
                          >
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Items Summary Accordion / Card */}
              <div className="rounded-xl bg-surface-elevated border border-border overflow-hidden">
                <button
                  type="button"
                  onClick={() => setShowReceipt(!showReceipt)}
                  className="w-full flex items-center justify-between p-4 text-xs font-semibold uppercase tracking-wider text-primary hover:bg-surface-hover transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Receipt className="w-4 h-4 text-accent" />
                    Digital Tax Receipt & Items ({order.items.length})
                  </span>
                  <span className="text-accent underline text-xs font-normal">
                    {showReceipt ? "Hide" : "View"}
                  </span>
                </button>

                {showReceipt && (
                  <div className="p-4 border-t border-border space-y-3 text-xs">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between items-start">
                        <div>
                          <span className="text-primary font-medium">
                            {item.quantity}x {item.item_name}
                          </span>
                          {item.variant_name && (
                            <span className="text-primary-muted text-[11px] block">
                              ({item.variant_name})
                            </span>
                          )}
                        </div>
                        <span className="font-mono text-primary font-medium">
                          {formatINR(item.total_price)}
                        </span>
                      </div>
                    ))}

                    <div className="border-t border-border pt-2 space-y-1 text-primary-muted text-[11px]">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span className="font-mono">{formatINR(order.subtotal)}</span>
                      </div>
                      {order.discount_amount > 0 && (
                        <div className="flex justify-between text-accent">
                          <span>Discount Applied</span>
                          <span className="font-mono">-{formatINR(order.discount_amount)}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>GST Tax (5%)</span>
                        <span className="font-mono">{formatINR(order.tax_amount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Service Charge</span>
                        <span className="font-mono">{formatINR(order.service_charge)}</span>
                      </div>
                      <div className="border-t border-border pt-1 flex justify-between text-xs font-bold text-primary">
                        <span>Total Paid</span>
                        <span className="font-mono text-accent">{formatINR(order.total_amount)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Review prompt when order is served/completed */}
              {["SERVED", "COMPLETED"].includes(order.status) && onOpenReview && (
                <div className="p-4 rounded-xl bg-champagne-subtle border border-champagne/30 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-semibold text-champagne">
                      How was your dining experience?
                    </h4>
                    <p className="text-[11px] text-primary-muted mt-0.5">
                      Share your rating with the chef & management.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      soundManager.playClick();
                      onOpenReview();
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-champagne hover:bg-champagne-hover text-primary-dark font-semibold text-xs transition-colors"
                  >
                    <span>Rate Dining</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="p-4 bg-surface border-t border-border flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 rounded-xl bg-surface-elevated hover:bg-surface-hover border border-border text-primary text-xs font-medium transition-colors"
              >
                Back to Menu
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
