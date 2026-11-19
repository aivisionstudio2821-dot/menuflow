"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRestaurantStore } from "@/lib/store";
import {
  Bell,
  Search,
  ExternalLink,
  Menu,
  X,
  Volume2,
  VolumeX,
  CheckCircle2,
  Clock,
  Sparkles,
} from "lucide-react";
import { formatTime } from "@/lib/utils";

interface HeaderProps {
  title: string;
  subtitle?: string;
  actionButton?: React.ReactNode;
}

export function Header({ title, subtitle, actionButton }: HeaderProps) {
  const store = useRestaurantStore();
  const tables = store.getTables();
  const orders = store.getOrders();
  const requests = store.getServiceRequests();

  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const occupiedCount = tables.filter((t) => t.status !== "available").length;
  const pendingRequests = requests.filter((r) => r.status === "PENDING");
  const newOrders = orders.filter((o) => o.status === "NEW");

  return (
    <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-border px-4 sm:px-8 py-3.5 flex items-center justify-between">
      {/* Title & Subtitle */}
      <div>
        <h1 className="text-lg font-semibold text-primary tracking-tight flex items-center gap-2">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs text-primary-muted hidden sm:block mt-0.5">
            {subtitle}
          </p>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Table Occupancy Status Pill */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-elevated border border-border text-xs">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="text-primary-muted">Active Tables:</span>
          <span className="font-mono font-semibold text-primary">
            {occupiedCount} / {tables.length}
          </span>
        </div>

        {/* Live Customer Menu Pill */}
        <Link
          href="/menu/casa-verde/table-4"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface hover:bg-surface-elevated border border-border text-xs text-primary transition-colors"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>Open Guest Menu</span>
          <ExternalLink className="w-3 h-3 text-primary-muted ml-0.5" />
        </Link>

        {/* Action Button passed by parent */}
        {actionButton}

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative w-9 h-9 rounded-lg bg-surface-elevated hover:bg-surface-hover border border-border flex items-center justify-center text-primary-muted hover:text-primary transition-colors"
          >
            <Bell className="w-4 h-4" />
            {(pendingRequests.length > 0 || newOrders.length > 0) && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-danger text-white text-[9px] font-mono font-bold flex items-center justify-center animate-pulse">
                {pendingRequests.length + newOrders.length}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-surface border border-border rounded-xl shadow-2xl overflow-hidden z-50">
              <div className="p-3 bg-surface-elevated border-b border-border flex items-center justify-between">
                <span className="text-xs font-semibold text-primary">Live Activity Feeds</span>
                <span className="text-[10px] text-primary-muted font-mono">Realtime</span>
              </div>

              <div className="max-h-72 overflow-y-auto p-2 space-y-1.5 no-scrollbar text-xs">
                {pendingRequests.length === 0 && newOrders.length === 0 ? (
                  <div className="py-6 text-center text-primary-muted text-xs">
                    No pending alerts at the moment.
                  </div>
                ) : (
                  <>
                    {pendingRequests.map((req) => (
                      <Link
                        key={req.id}
                        href="/dashboard/service-requests"
                        onClick={() => setShowNotifications(false)}
                        className="flex items-start gap-2.5 p-2 rounded-lg bg-danger/10 border border-danger/20 hover:bg-danger/15 transition-colors"
                      >
                        <Bell className="w-3.5 h-3.5 text-danger mt-0.5" />
                        <div>
                          <p className="font-semibold text-primary text-xs">
                            {req.table_number}: {req.request_type}
                          </p>
                          <p className="text-[11px] text-primary-muted">
                            {req.note || "Staff attention required"}
                          </p>
                        </div>
                      </Link>
                    ))}

                    {newOrders.map((ord) => (
                      <Link
                        key={ord.id}
                        href="/dashboard/orders"
                        onClick={() => setShowNotifications(false)}
                        className="flex items-start gap-2.5 p-2 rounded-lg bg-accent/10 border border-accent/20 hover:bg-accent/15 transition-colors"
                      >
                        <Clock className="w-3.5 h-3.5 text-accent mt-0.5" />
                        <div>
                          <p className="font-semibold text-primary text-xs">
                            New Order {ord.order_number} ({ord.table_number})
                          </p>
                          <p className="text-[11px] text-primary-muted">
                            {ord.items.length} items • {ord.payment_method}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
