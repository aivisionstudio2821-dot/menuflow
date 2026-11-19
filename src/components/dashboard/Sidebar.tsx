"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRestaurantStore } from "@/lib/store";
import {
  LayoutDashboard,
  UtensilsCrossed,
  Layers,
  SquareCheck,
  QrCode,
  Users,
  Tag,
  Star,
  BarChart3,
  CreditCard,
  Settings,
  Bell,
  ExternalLink,
  Volume2,
  VolumeX,
} from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();
  const store = useRestaurantStore();
  const restaurant = store.getRestaurant();
  const settings = store.getSettings();

  const pendingOrders = store.getOrders().filter((o) => ["NEW", "PREPARING"].includes(o.status));
  const pendingRequests = store.getServiceRequests().filter((r) => r.status === "PENDING");

  const navLinks = [
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
    {
      label: "Live Orders",
      href: "/dashboard/orders",
      icon: SquareCheck,
      badge: pendingOrders.length > 0 ? pendingOrders.length : undefined,
      badgeColor: "bg-accent text-primary-dark",
    },
    { label: "Menu Items", href: "/dashboard/menu", icon: UtensilsCrossed },
    { label: "Categories", href: "/dashboard/categories", icon: Layers },
    { label: "Tables", href: "/dashboard/tables", icon: Users },
    { label: "QR Studio", href: "/dashboard/qr-codes", icon: QrCode },
    {
      label: "Service Calls",
      href: "/dashboard/service-requests",
      icon: Bell,
      badge: pendingRequests.length > 0 ? pendingRequests.length : undefined,
      badgeColor: "bg-danger text-white animate-pulse",
    },
    { label: "Customers", href: "/dashboard/customers", icon: Users },
    { label: "Offers & Deals", href: "/dashboard/offers", icon: Tag },
    { label: "Reviews", href: "/dashboard/reviews", icon: Star },
    { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
    { label: "Payments & Invoices", href: "/dashboard/payments", icon: CreditCard },
    { label: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <aside className="w-64 flex-shrink-0 bg-background-secondary border-r border-border hidden md:flex flex-col h-screen sticky top-0">
      {/* Brand & Restaurant Profile */}
      <div className="p-5 border-b border-border">
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-surface-elevated border border-accent/40 flex items-center justify-center font-bold text-accent font-mono shadow-glow text-base">
            MF
          </div>
          <div>
            <span className="font-bold text-base tracking-tight text-primary flex items-center gap-1.5">
              MenuFlow
              <span className="text-[10px] font-mono font-medium px-1.5 py-0.2 rounded bg-champagne-subtle text-champagne border border-champagne/20">
                PRO
              </span>
            </span>
            <span className="text-xs text-primary-muted block truncate max-w-[150px]">
              {restaurant.name} • Indiranagar
            </span>
          </div>
        </Link>
      </div>

      {/* Nav List */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 no-scrollbar">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? "bg-accent/10 text-accent font-semibold border border-accent/30"
                  : "text-primary-muted hover:text-primary hover:bg-surface-elevated"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? "text-accent" : "text-primary-muted"}`} />
                <span>{link.label}</span>
              </div>

              {link.badge !== undefined && (
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                    link.badgeColor || "bg-accent text-primary-dark"
                  }`}
                >
                  {link.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer Utility Actions */}
      <div className="p-3 border-t border-border space-y-2 bg-surface">
        {/* Quick Menu Link Preview */}
        <Link
          href="/menu/casa-verde/table-4"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between px-3 py-2 rounded-lg bg-surface-elevated hover:bg-surface-hover border border-border text-xs text-primary transition-all group"
        >
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-medium text-xs">Customer QR Menu</span>
          </span>
          <ExternalLink className="w-3.5 h-3.5 text-primary-muted group-hover:text-accent transition-colors" />
        </Link>

        {/* Audio Toggle */}
        <button
          type="button"
          onClick={() => {
            store.updateSettings({ sound_notifications: !settings.sound_notifications });
          }}
          className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-[11px] text-primary-muted hover:text-primary hover:bg-surface-elevated transition-colors"
        >
          <span className="flex items-center gap-1.5">
            {settings.sound_notifications ? (
              <Volume2 className="w-3.5 h-3.5 text-accent" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-danger" />
            )}
            Sound Alerts
          </span>
          <span className="font-mono text-[10px]">
            {settings.sound_notifications ? "ON" : "OFF"}
          </span>
        </button>
      </div>
    </aside>
  );
}
