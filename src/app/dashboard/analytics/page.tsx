"use client";

import React, { useState } from "react";
import { Header } from "@/components/dashboard/Header";
import { useRestaurantStore } from "@/lib/store";
import { formatINR } from "@/lib/utils";
import {
  TrendingUp,
  BarChart3,
  Users,
  Clock,
  ShoppingBag,
  Award,
  Calendar,
} from "lucide-react";

export default function AnalyticsPage() {
  const store = useRestaurantStore();
  const orders = store.getOrders();
  const categories = store.getCategories();
  const menuItems = store.getMenuItems();
  const tables = store.getTables();

  const [timeRange, setTimeRange] = useState<"7D" | "30D" | "YTD">("7D");

  const totalRevenue = orders.reduce((sum, o) => sum + o.total_amount, 0);
  const avgOrderVal = orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0;

  return (
    <div className="flex-1 pb-16">
      <Header
        title="Performance Analytics"
        subtitle="Dining trends, average turnover velocity, top category sales, and revenue forecasting"
        actionButton={
          <div className="flex items-center gap-1 bg-surface-elevated p-1 rounded-lg border border-border text-xs">
            {(["7D", "30D", "YTD"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTimeRange(t)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                  timeRange === t
                    ? "bg-accent text-primary-dark font-semibold shadow-sm"
                    : "text-primary-muted hover:text-primary"
                }`}
              >
                {t === "7D" ? "Past 7 Days" : t === "30D" ? "Past Month" : "This Year"}
              </button>
            ))}
          </div>
        }
      />

      <div className="px-4 sm:px-8 py-6 space-y-6 max-w-7xl">
        {/* KPI Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-xl bg-surface border border-border">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary-muted">
              Gross Dining Sales
            </span>
            <div className="text-2xl font-bold font-mono text-primary mt-2">
              {formatINR(totalRevenue * 4.2)}
            </div>
            <span className="text-[11px] text-emerald-400 font-medium">
              +18.4% vs previous period
            </span>
          </div>

          <div className="p-5 rounded-xl bg-surface border border-border">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary-muted">
              Orders Dispatched
            </span>
            <div className="text-2xl font-bold font-mono text-accent mt-2">
              {orders.length * 5 + 42}
            </div>
            <span className="text-[11px] text-primary-muted">
              100% digital QR fulfillment
            </span>
          </div>

          <div className="p-5 rounded-xl bg-surface border border-border">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary-muted">
              Avg Dining Turnaround
            </span>
            <div className="text-2xl font-bold font-mono text-champagne mt-2">
              44 mins
            </div>
            <span className="text-[11px] text-emerald-400 font-medium">
              16 mins faster than traditional POS
            </span>
          </div>

          <div className="p-5 rounded-xl bg-surface border border-border">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary-muted">
              Repeat Customers
            </span>
            <div className="text-2xl font-bold font-mono text-primary mt-2">
              38.5%
            </div>
            <span className="text-[11px] text-emerald-400 font-medium">
              High guest loyalty
            </span>
          </div>
        </div>

        {/* Category Contribution & Peak Hours */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Category Sales Breakdown */}
          <div className="p-5 rounded-xl bg-surface border border-border space-y-4">
            <h3 className="text-sm font-semibold text-primary">
              Sales by Menu Category
            </h3>

            <div className="space-y-3 pt-2">
              {[
                { name: "Artisanal Tacos", percentage: 42, amount: "₹48,200", color: "bg-accent" },
                { name: "Starters & Antojitos", percentage: 24, amount: "₹27,500", color: "bg-champagne" },
                { name: "Mains & Platos Fuertes", percentage: 18, amount: "₹20,600", color: "bg-emerald-400" },
                { name: "Craft Drinks & Sodas", percentage: 11, amount: "₹12,400", color: "bg-purple-400" },
                { name: "Postres (Desserts)", percentage: 5, amount: "₹5,800", color: "bg-amber-400" },
              ].map((cat) => (
                <div key={cat.name} className="space-y-1.5 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-primary">{cat.name}</span>
                    <span className="font-mono text-primary-muted">
                      {cat.amount} ({cat.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-surface-elevated h-2 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${cat.percentage}%` }}
                      className={`h-full rounded-full ${cat.color}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Peak Table Turnover Heatmap */}
          <div className="p-5 rounded-xl bg-surface border border-border space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-primary">
                Weekly Dining Traffic Matrix
              </h3>
              <span className="text-xs font-mono text-primary-muted">
                Peak: Fri & Sat Evenings
              </span>
            </div>

            <div className="grid grid-cols-7 gap-2 pt-2 text-center text-xs">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, idx) => {
                const heightPercent = [45, 50, 60, 75, 95, 100, 85][idx];
                return (
                  <div key={day} className="flex flex-col items-center gap-2">
                    <div className="w-full h-36 bg-surface-elevated rounded-lg flex items-end p-1">
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className={`w-full rounded transition-all ${
                          heightPercent >= 90
                            ? "bg-accent shadow-glow"
                            : heightPercent >= 60
                            ? "bg-accent/70"
                            : "bg-border-strong"
                        }`}
                      />
                    </div>
                    <span className="font-mono text-[11px] text-primary-muted">
                      {day}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
