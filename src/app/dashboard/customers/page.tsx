"use client";

import React, { useState } from "react";
import { Header } from "@/components/dashboard/Header";
import { useRestaurantStore } from "@/lib/store";
import { formatINR, formatDateTime } from "@/lib/utils";
import { Users, Search, ShoppingBag, Star, Phone, Mail } from "lucide-react";

export default function CustomersDirectoryPage() {
  const store = useRestaurantStore();
  const orders = store.getOrders();

  const [search, setSearch] = useState("");

  // Aggregate unique customers from orders
  const customerMap = new Map<string, { name: string; phone: string; ordersCount: number; totalSpend: number; lastVisit: string }>();

  orders.forEach((o) => {
    const key = o.customer_name || "Guest at " + o.table_number;
    const current = customerMap.get(key) || {
      name: key,
      phone: o.customer_phone || "+91 98450 XXXXX",
      ordersCount: 0,
      totalSpend: 0,
      lastVisit: o.created_at,
    };

    current.ordersCount += 1;
    current.totalSpend += o.total_amount;
    customerMap.set(key, current);
  });

  const customerList = Array.from(customerMap.values()).filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-1 pb-16">
      <Header
        title="Guest CRM & Loyalty"
        subtitle="Customer dining frequency, lifetime spend, and table preferences"
      />

      <div className="px-4 sm:px-8 py-6 space-y-6 max-w-6xl">
        <div className="flex items-center justify-between">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-muted" />
            <input
              type="text"
              placeholder="Search guests by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-surface border border-border rounded-xl pl-9 pr-4 py-2 text-xs text-primary focus:outline-none focus:border-accent"
            />
          </div>

          <span className="text-xs font-mono text-primary-muted">
            {customerList.length} Guests Logged
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {customerList.map((cust, i) => (
            <div
              key={i}
              className="p-4 rounded-xl bg-surface border border-border hover:border-border-strong transition-all flex flex-col justify-between space-y-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-surface-elevated border border-accent/30 text-accent flex items-center justify-center font-bold text-sm font-mono">
                  {cust.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-primary">{cust.name}</h4>
                  <span className="text-xs text-primary-muted font-mono">{cust.phone}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-border grid grid-cols-2 gap-2 text-xs font-mono">
                <div>
                  <span className="text-primary-muted text-[10px] uppercase block">Orders</span>
                  <span className="font-bold text-accent">{cust.ordersCount} Visits</span>
                </div>
                <div className="text-right">
                  <span className="text-primary-muted text-[10px] uppercase block">Total Spend</span>
                  <span className="font-bold text-primary">{formatINR(cust.totalSpend)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
