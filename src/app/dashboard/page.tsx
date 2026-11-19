"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Header } from "@/components/dashboard/Header";
import { useRestaurantStore } from "@/lib/store";
import { formatINR, formatTime } from "@/lib/utils";
import {
  TrendingUp,
  ShoppingBag,
  IndianRupee,
  Clock,
  Users,
  Star,
  ArrowUpRight,
  ChevronRight,
  Flame,
  CheckCircle2,
  Calendar,
} from "lucide-react";

export default function DashboardOverviewPage() {
  const store = useRestaurantStore();
  const orders = store.getOrders();
  const menuItems = store.getMenuItems();
  const tables = store.getTables();
  const reviews = store.getReviews();

  const [dateRange, setDateRange] = useState<"TODAY" | "7D" | "30D" | "ALL">("TODAY");

  // Calculations
  const totalRevenue = orders.reduce((sum, o) => sum + (o.payment_status === "PAID" ? o.total_amount : 0), 0);
  const completedOrders = orders.filter((o) => ["SERVED", "COMPLETED"].includes(o.status));
  const pendingOrders = orders.filter((o) => ["NEW", "PREPARING", "READY"].includes(o.status));
  const avgOrderValue = orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0;
  const occupiedTables = tables.filter((t) => t.status !== "available");

  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : "5.0";

  // Top popular dishes
  const popularDishes = useMemo(() => {
    return menuItems.filter((i) => i.is_bestseller).slice(0, 5);
  }, [menuItems]);

  return (
    <div className="flex-1 pb-16">
      <Header
        title="Dashboard Overview"
        subtitle="Live restaurant operations, revenue metrics, and dining activity"
        actionButton={
          <div className="flex items-center gap-1.5 bg-surface-elevated p-1 rounded-lg border border-border text-xs">
            {(["TODAY", "7D", "30D", "ALL"] as const).map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                  dateRange === range
                    ? "bg-accent text-primary-dark font-semibold shadow-sm"
                    : "text-primary-muted hover:text-primary"
                }`}
              >
                {range === "TODAY" ? "Today" : range === "7D" ? "7 Days" : range === "30D" ? "30 Days" : "Custom"}
              </button>
            ))}
          </div>
        }
      />

      <div className="px-4 sm:px-8 py-6 space-y-6 max-w-7xl">
        {/* KPI Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Revenue */}
          <div className="p-4 sm:p-5 rounded-xl bg-surface border border-border">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary-muted">
                Today Revenue
              </span>
              <div className="w-7 h-7 rounded-lg bg-accent-subtle text-accent flex items-center justify-center">
                <IndianRupee className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-bold font-mono text-primary">
                {formatINR(totalRevenue)}
              </span>
              <span className="text-[11px] text-emerald-400 flex items-center font-medium">
                +14.8%
              </span>
            </div>
            <p className="text-[11px] text-primary-muted mt-1">
              Razorpay UPI + Cards + Cash
            </p>
          </div>

          {/* Orders */}
          <div className="p-4 sm:p-5 rounded-xl bg-surface border border-border">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary-muted">
                Total Orders
              </span>
              <div className="w-7 h-7 rounded-lg bg-surface-elevated text-primary flex items-center justify-center border border-border">
                <ShoppingBag className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-bold font-mono text-primary">
                {orders.length}
              </span>
              <span className="text-xs text-accent font-medium font-mono">
                {pendingOrders.length} active
              </span>
            </div>
            <p className="text-[11px] text-primary-muted mt-1">
              {completedOrders.length} fulfilled today
            </p>
          </div>

          {/* Average Order Value */}
          <div className="p-4 sm:p-5 rounded-xl bg-surface border border-border">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary-muted">
                Avg Order Value
              </span>
              <div className="w-7 h-7 rounded-lg bg-champagne-subtle text-champagne flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-bold font-mono text-primary">
                {formatINR(avgOrderValue)}
              </span>
              <span className="text-[11px] text-emerald-400 font-medium">
                +8.2%
              </span>
            </div>
            <p className="text-[11px] text-primary-muted mt-1">
              Per table session
            </p>
          </div>

          {/* Active Tables & Ratings */}
          <div className="p-4 sm:p-5 rounded-xl bg-surface border border-border">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary-muted">
                Table Occupancy
              </span>
              <div className="w-7 h-7 rounded-lg bg-surface-elevated text-primary flex items-center justify-center border border-border">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-bold font-mono text-accent">
                {occupiedTables.length} / {tables.length}
              </span>
              <span className="text-xs font-mono text-champagne flex items-center gap-0.5 font-bold">
                <Star className="w-3 h-3 fill-champagne" />
                {averageRating}
              </span>
            </div>
            <p className="text-[11px] text-primary-muted mt-1">
              {reviews.length} customer reviews logged
            </p>
          </div>
        </div>

        {/* Small Data Visualization & Peak Dining Heat */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Hourly Order Velocity */}
          <div className="lg:col-span-2 p-5 rounded-xl bg-surface border border-border space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-primary">
                  Today's Dining Velocity & Revenue
                </h3>
                <p className="text-xs text-primary-muted mt-0.5">
                  Real-time hourly table order traffic
                </p>
              </div>
              <span className="text-xs font-mono text-accent font-semibold">
                Peak: 8:00 PM – 10:30 PM
              </span>
            </div>

            {/* Custom SVG Mini Bar Chart */}
            <div className="h-44 flex items-end gap-2 pt-4 border-b border-border">
              {[
                { time: "12 PM", val: 30, amount: "₹1,240" },
                { time: "1 PM", val: 65, amount: "₹4,890" },
                { time: "2 PM", val: 80, amount: "₹6,150" },
                { time: "3 PM", val: 40, amount: "₹2,300" },
                { time: "4 PM", val: 25, amount: "₹1,400" },
                { time: "5 PM", val: 35, amount: "₹2,800" },
                { time: "6 PM", val: 50, amount: "₹4,100" },
                { time: "7 PM", val: 85, amount: "₹8,450" },
                { time: "8 PM", val: 95, amount: "₹11,200" },
                { time: "9 PM", val: 100, amount: "₹12,890" },
                { time: "10 PM", val: 70, amount: "₹7,650" },
                { time: "11 PM", val: 30, amount: "₹2,100" },
              ].map((bar, i) => (
                <div
                  key={i}
                  className="flex-1 flex flex-col items-center gap-1.5 group relative"
                >
                  {/* Tooltip */}
                  <div className="absolute -top-8 hidden group-hover:flex px-2 py-1 bg-surface-elevated border border-border text-[10px] font-mono text-accent rounded whitespace-nowrap z-10 shadow-lg">
                    {bar.amount}
                  </div>
                  <div className="w-full bg-surface-elevated rounded-t group-hover:bg-accent/40 transition-colors h-36 flex items-end">
                    <div
                      style={{ height: `${bar.val}%` }}
                      className={`w-full rounded-t transition-all ${
                        bar.val > 80
                          ? "bg-accent shadow-glow"
                          : bar.val > 50
                          ? "bg-accent/70"
                          : "bg-border-strong"
                      }`}
                    />
                  </div>
                  <span className="text-[10px] font-mono text-primary-muted group-hover:text-primary">
                    {bar.time.split(" ")[0]}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between text-xs text-primary-muted pt-1">
              <span>Lunch Rush (12:30 PM - 2:30 PM)</span>
              <span>Dinner Service (7:30 PM - 11:00 PM)</span>
            </div>
          </div>

          {/* Popular Dishes / Best Sellers */}
          <div className="p-5 rounded-xl bg-surface border border-border space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-primary">
                Top Performing Dishes
              </h3>
              <Link
                href="/dashboard/menu"
                className="text-xs text-accent hover:underline flex items-center"
              >
                Menu <ArrowUpRight className="w-3 h-3 ml-0.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {popularDishes.map((dish, idx) => (
                <div
                  key={dish.id}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-surface-elevated border border-border"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 text-center font-mono text-xs font-bold text-accent">
                      #{idx + 1}
                    </span>
                    <div>
                      <h4 className="text-xs font-semibold text-primary line-clamp-1">
                        {dish.name}
                      </h4>
                      <span className="text-[11px] text-primary-muted font-mono">
                        {formatINR(dish.price)}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-champagne-subtle text-champagne border border-champagne/20">
                    High Demand
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live Active Orders & Table Control preview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Orders List */}
          <div className="lg:col-span-2 p-5 rounded-xl bg-surface border border-border space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-primary">
                  Live Orders Stream
                </h3>
                <p className="text-xs text-primary-muted mt-0.5">
                  Realtime kitchen progression
                </p>
              </div>
              <Link
                href="/dashboard/orders"
                className="text-xs text-accent hover:underline font-medium"
              >
                Open Kitchen Control ({orders.length}) →
              </Link>
            </div>

            <div className="space-y-2.5">
              {orders.slice(0, 4).map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-surface-elevated border border-border hover:border-border-strong transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-surface border border-border flex flex-col items-center justify-center font-mono">
                      <span className="text-[9px] text-primary-muted uppercase">Tbl</span>
                      <span className="text-xs font-bold text-accent">
                        {order.table_number.replace(/\D/g, "") || "4"}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-primary">
                          {order.order_number}
                        </span>
                        <span className="text-[10px] text-primary-muted font-mono">
                          {formatTime(order.created_at)}
                        </span>
                      </div>
                      <p className="text-xs text-primary-muted mt-0.5 line-clamp-1">
                        {order.items.map((i) => `${i.quantity}x ${i.item_name}`).join(", ")}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-mono font-semibold text-xs text-primary">
                      {formatINR(order.total_amount)}
                    </div>
                    <span
                      className={`inline-block text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded mt-1 ${
                        order.status === "NEW"
                          ? "bg-accent/20 text-accent border border-accent/30 animate-pulse"
                          : order.status === "PREPARING"
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                          : order.status === "READY"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : "bg-surface text-primary-muted border border-border"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Table Activity Matrix */}
          <div className="p-5 rounded-xl bg-surface border border-border space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-primary">
                Floor Plan Status
              </h3>
              <Link
                href="/dashboard/tables"
                className="text-xs text-accent hover:underline flex items-center"
              >
                Manage <ArrowUpRight className="w-3 h-3 ml-0.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {tables.slice(0, 8).map((tbl) => (
                <div
                  key={tbl.id}
                  className={`p-3 rounded-lg border text-xs flex flex-col justify-between transition-colors ${
                    tbl.status === "available"
                      ? "bg-surface-elevated/40 border-border text-primary-muted"
                      : tbl.status === "bill_requested"
                      ? "bg-amber-950/40 border-amber-500/40 text-amber-300"
                      : tbl.status === "ordering"
                      ? "bg-accent/15 border-accent/40 text-accent font-medium"
                      : "bg-surface-elevated border-border-strong text-primary"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs">{tbl.table_number}</span>
                    <span
                      className={`w-2 h-2 rounded-full ${
                        tbl.status === "available"
                          ? "bg-emerald-500"
                          : tbl.status === "bill_requested"
                          ? "bg-amber-400 animate-ping"
                          : "bg-accent"
                      }`}
                    />
                  </div>
                  <span className="text-[10px] capitalize mt-2 opacity-80">
                    {tbl.status.replace("_", " ")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
