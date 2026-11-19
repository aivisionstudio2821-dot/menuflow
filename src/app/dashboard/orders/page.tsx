"use client";

import React, { useState } from "react";
import { Header } from "@/components/dashboard/Header";
import { useRestaurantStore } from "@/lib/store";
import { Order, OrderStatus } from "@/lib/types";
import { formatINR, formatTime } from "@/lib/utils";
import { soundManager } from "@/lib/audio";
import {
  SquareCheck,
  Clock,
  Printer,
  ChevronRight,
  Filter,
  Check,
  XCircle,
  Volume2,
  VolumeX,
  BellRing,
  ChefHat,
  Utensils,
  Sparkles,
} from "lucide-react";

const STATUS_OPTIONS: OrderStatus[] = [
  "NEW",
  "CONFIRMED",
  "PREPARING",
  "READY",
  "SERVED",
  "COMPLETED",
  "CANCELLED",
];

export default function OrdersManagementPage() {
  const store = useRestaurantStore();
  const orders = store.getOrders();
  const settings = store.getSettings();

  const [activeTab, setActiveTab] = useState<"ALL" | "NEW" | "KITCHEN" | "READY" | "SERVED" | "COMPLETED">("ALL");
  const [selectedOrderForPrint, setSelectedOrderForPrint] = useState<Order | null>(null);

  // Filter orders by tab
  const filteredOrders = orders.filter((order) => {
    if (activeTab === "ALL") return true;
    if (activeTab === "NEW") return order.status === "NEW";
    if (activeTab === "KITCHEN") return ["CONFIRMED", "PREPARING"].includes(order.status);
    if (activeTab === "READY") return order.status === "READY";
    if (activeTab === "SERVED") return order.status === "SERVED";
    if (activeTab === "COMPLETED") return ["COMPLETED", "CANCELLED"].includes(order.status);
    return true;
  });

  const handleStatusChange = (orderId: string, nextStatus: OrderStatus) => {
    soundManager.playClick();
    store.updateOrderStatus(orderId, nextStatus);
  };

  const handlePrintKOT = (order: Order) => {
    setSelectedOrderForPrint(order);
    setTimeout(() => {
      window.print();
    }, 100);
  };

  return (
    <div className="flex-1 pb-16">
      <Header
        title="Orders Control Center"
        subtitle="Live kitchen terminal, status progression, and KOT dispatch"
        actionButton={
          <div className="flex items-center gap-2">
            <button
              onClick={() => soundManager.playOrderChime()}
              title="Test Order Chime"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-elevated hover:bg-surface-hover border border-border text-xs text-primary transition-colors"
            >
              <Volume2 className="w-3.5 h-3.5 text-accent" />
              <span>Test Chime</span>
            </button>
          </div>
        }
      />

      <div className="px-4 sm:px-8 py-6 space-y-6 max-w-7xl">
        {/* Status Filter Tabs */}
        <div className="flex items-center justify-between border-b border-border pb-3 overflow-x-auto no-scrollbar gap-2">
          <div className="flex items-center gap-2">
            {[
              { id: "ALL", label: "All Active", count: orders.length },
              { id: "NEW", label: "New Incoming", count: orders.filter((o) => o.status === "NEW").length },
              { id: "KITCHEN", label: "In Kitchen", count: orders.filter((o) => ["CONFIRMED", "PREPARING"].includes(o.status)).length },
              { id: "READY", label: "Plated & Ready", count: orders.filter((o) => o.status === "READY").length },
              { id: "SERVED", label: "Served", count: orders.filter((o) => o.status === "SERVED").length },
              { id: "COMPLETED", label: "History", count: orders.filter((o) => ["COMPLETED", "CANCELLED"].includes(o.status)).length },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? "bg-accent text-primary-dark font-semibold shadow-sm"
                      : "bg-surface-elevated text-primary-muted hover:text-primary border border-border"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                      isActive ? "bg-primary-dark text-accent" : "bg-surface text-primary-muted"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Orders Grid */}
        {filteredOrders.length === 0 ? (
          <div className="py-20 text-center text-primary-muted bg-surface rounded-2xl border border-border">
            <Clock className="w-8 h-8 mx-auto mb-2 text-primary-muted/40" />
            <p className="text-sm">No orders matching this status.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredOrders.map((order) => {
              const isNew = order.status === "NEW";
              const isPreparing = order.status === "PREPARING";
              const isReady = order.status === "READY";

              return (
                <div
                  key={order.id}
                  className={`relative flex flex-col justify-between rounded-xl bg-surface border p-4 transition-all duration-200 ${
                    isNew
                      ? "border-accent/60 shadow-glow"
                      : isPreparing
                      ? "border-amber-500/40"
                      : isReady
                      ? "border-emerald-500/40"
                      : "border-border"
                  }`}
                >
                  {/* Card Header */}
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-border">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-primary">
                          {order.order_number}
                        </span>
                        <span className="text-[11px] font-mono text-primary-muted">
                          {formatTime(order.created_at)}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handlePrintKOT(order)}
                          title="Print Kitchen Ticket (KOT)"
                          className="p-1 rounded bg-surface-elevated hover:bg-surface-hover text-primary-muted hover:text-accent border border-border transition-colors"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-accent-subtle text-accent border border-accent/25">
                          {order.table_number}
                        </span>
                      </div>
                    </div>

                    {/* Customer info */}
                    <div className="py-2 flex items-center justify-between text-xs text-primary-muted">
                      <span>{order.customer_name || "Guest Customer"}</span>
                      <span className="font-mono text-accent font-medium">
                        {order.payment_method} • {order.payment_status}
                      </span>
                    </div>

                    {/* Order items list */}
                    <div className="py-2 space-y-2 border-t border-border/60">
                      {order.items.map((item) => (
                        <div key={item.id} className="text-xs">
                          <div className="flex items-start justify-between font-medium text-primary">
                            <span className="flex-1">
                              <span className="font-mono font-bold text-accent mr-1.5">
                                {item.quantity}x
                              </span>
                              {item.item_name}
                            </span>
                            <span className="font-mono text-primary-muted ml-2">
                              {formatINR(item.total_price)}
                            </span>
                          </div>
                          {item.variant_name && (
                            <p className="text-[11px] text-accent pl-5">
                              • {item.variant_name}
                            </p>
                          )}
                          {item.addons && item.addons.length > 0 && (
                            <p className="text-[11px] text-primary-muted pl-5">
                              + {item.addons.map((a) => a.name).join(", ")}
                            </p>
                          )}
                          {item.special_notes && (
                            <p className="text-[11px] text-champagne/90 italic pl-5">
                              Note: {item.special_notes}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Kitchen Instructions if any */}
                    {order.special_instructions && (
                      <div className="mt-2 p-2 rounded bg-champagne-subtle/40 border border-champagne/20 text-[11px] text-champagne">
                        <span className="font-semibold">Special: </span>
                        {order.special_instructions}
                      </div>
                    )}
                  </div>

                  {/* Card Bottom / Actions */}
                  <div className="mt-4 pt-3 border-t border-border space-y-2.5">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-primary-muted">Total Bill</span>
                      <span className="font-bold text-sm text-primary">
                        {formatINR(order.total_amount)}
                      </span>
                    </div>

                    {/* Status Changer Buttons */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {order.status === "NEW" && (
                        <button
                          type="button"
                          onClick={() => handleStatusChange(order.id, "CONFIRMED")}
                          className="flex-1 py-1.5 rounded-lg bg-accent hover:bg-accent-hover text-primary-dark font-semibold text-xs transition-colors flex items-center justify-center gap-1 font-mono uppercase"
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                          Accept Ticket
                        </button>
                      )}

                      {order.status === "CONFIRMED" && (
                        <button
                          type="button"
                          onClick={() => handleStatusChange(order.id, "PREPARING")}
                          className="flex-1 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-primary-dark font-semibold text-xs transition-colors flex items-center justify-center gap-1 font-mono uppercase"
                        >
                          <ChefHat className="w-3.5 h-3.5" />
                          Start Cooking
                        </button>
                      )}

                      {order.status === "PREPARING" && (
                        <button
                          type="button"
                          onClick={() => handleStatusChange(order.id, "READY")}
                          className="flex-1 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-primary-dark font-semibold text-xs transition-colors flex items-center justify-center gap-1 font-mono uppercase"
                        >
                          <BellRing className="w-3.5 h-3.5" />
                          Mark Plated
                        </button>
                      )}

                      {order.status === "READY" && (
                        <button
                          type="button"
                          onClick={() => handleStatusChange(order.id, "SERVED")}
                          className="flex-1 py-1.5 rounded-lg bg-accent hover:bg-accent-hover text-primary-dark font-semibold text-xs transition-colors flex items-center justify-center gap-1 font-mono uppercase"
                        >
                          <Utensils className="w-3.5 h-3.5" />
                          Mark Delivered
                        </button>
                      )}

                      {order.status === "SERVED" && (
                        <button
                          type="button"
                          onClick={() => handleStatusChange(order.id, "COMPLETED")}
                          className="flex-1 py-1.5 rounded-lg bg-surface-elevated hover:bg-surface-hover border border-border text-primary font-semibold text-xs transition-colors flex items-center justify-center gap-1 font-mono uppercase"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-champagne" />
                          Complete Session
                        </button>
                      )}

                      {/* Dropdown status selector */}
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                        className="bg-surface-elevated border border-border rounded-lg px-2 py-1.5 text-xs text-primary-muted font-mono focus:outline-none"
                      >
                        {STATUS_OPTIONS.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Hidden Printable Kitchen Order Ticket (KOT) */}
      {selectedOrderForPrint && (
        <div className="hidden print:block fixed inset-0 bg-white text-black p-8 font-mono text-xs">
          <div className="text-center pb-2 border-b-2 border-black">
            <h1 className="text-base font-bold">KITCHEN ORDER TICKET (KOT)</h1>
            <p className="font-bold text-lg mt-1">{selectedOrderForPrint.table_number.toUpperCase()}</p>
            <p>Ticket: {selectedOrderForPrint.order_number} • Time: {formatTime(selectedOrderForPrint.created_at)}</p>
          </div>
          <div className="py-4 space-y-2">
            {selectedOrderForPrint.items.map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <span>{item.quantity}x {item.item_name} {item.variant_name ? `(${item.variant_name})` : ""}</span>
              </div>
            ))}
          </div>
          {selectedOrderForPrint.special_instructions && (
            <div className="border-t border-black pt-2 font-bold">
              Notes: {selectedOrderForPrint.special_instructions}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
