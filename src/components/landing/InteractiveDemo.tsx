"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRestaurantStore } from "@/lib/store";
import { formatINR } from "@/lib/utils";
import { soundManager } from "@/lib/audio";
import {
  QrCode,
  Smartphone,
  ShoppingBag,
  Plus,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import confetti from "canvas-confetti";

export function InteractiveDemo() {
  const store = useRestaurantStore();
  const menuItems = store.getMenuItems().slice(0, 4);

  const [activeTab, setActiveTab] = useState<"SCAN" | "MENU" | "CART" | "TRACK">("SCAN");
  const [demoCart, setDemoCart] = useState<{ id: string; name: string; price: number; qty: number }[]>([
    { id: "dish-4", name: "Birria Tacos (3 pcs)", price: 425, qty: 1 },
  ]);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const subtotal = demoCart.reduce((sum, i) => sum + i.price * i.qty, 0);

  const handleScan = () => {
    soundManager.playClick();
    setActiveTab("MENU");
  };

  const handleAddToCart = (item: (typeof menuItems)[0]) => {
    soundManager.playClick();
    const existing = demoCart.find((d) => d.id === item.id);
    if (existing) {
      setDemoCart(
        demoCart.map((d) => (d.id === item.id ? { ...d, qty: d.qty + 1 } : d))
      );
    } else {
      setDemoCart([...demoCart, { id: item.id, name: item.name, price: item.price, qty: 1 }]);
    }
  };

  const handlePlaceOrder = () => {
    soundManager.playOrderChime();
    confetti({
      particleCount: 50,
      spread: 50,
      origin: { y: 0.8 },
      colors: ["#2DD4BF", "#E7C77A"],
    });
    setOrderPlaced(true);
    setActiveTab("TRACK");
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 sm:p-8 rounded-3xl bg-surface border border-border">
      <div className="text-center max-w-xl mx-auto mb-8">
        <span className="text-[11px] font-mono uppercase tracking-widest text-accent font-semibold px-3 py-1 rounded-full bg-accent-subtle border border-accent/20">
          Live Interactive Simulator
        </span>
        <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-primary mt-3">
          Test the Guest Dining Flow
        </h3>
        <p className="text-xs sm:text-sm text-primary-muted mt-2">
          Experience what a customer sees when seated at Table 04 at Casa Verde. Zero friction, instant ordering.
        </p>
      </div>

      {/* Simulator Device Frame */}
      <div className="max-w-md mx-auto rounded-3xl bg-[#0D1115] border-2 border-border-strong p-4 shadow-2xl overflow-hidden">
        {/* Phone Speaker & Notch */}
        <div className="w-24 h-4 bg-surface-elevated mx-auto rounded-full mb-3 flex items-center justify-center">
          <div className="w-10 h-1 bg-border rounded-full" />
        </div>

        {/* Step Tabs Bar inside Simulator */}
        <div className="flex items-center justify-between bg-surface p-1 rounded-xl border border-border text-[11px] mb-4 font-mono">
          <button
            onClick={() => setActiveTab("SCAN")}
            className={`flex-1 py-1 rounded-lg text-center font-semibold transition-all ${
              activeTab === "SCAN" ? "bg-accent text-primary-dark" : "text-primary-muted"
            }`}
          >
            1. Scan QR
          </button>
          <button
            onClick={() => setActiveTab("MENU")}
            className={`flex-1 py-1 rounded-lg text-center font-semibold transition-all ${
              activeTab === "MENU" ? "bg-accent text-primary-dark" : "text-primary-muted"
            }`}
          >
            2. Menu
          </button>
          <button
            onClick={() => setActiveTab("CART")}
            className={`flex-1 py-1 rounded-lg text-center font-semibold transition-all ${
              activeTab === "CART" ? "bg-accent text-primary-dark" : "text-primary-muted"
            }`}
          >
            3. Cart ({demoCart.length})
          </button>
          <button
            onClick={() => setActiveTab("TRACK")}
            className={`flex-1 py-1 rounded-lg text-center font-semibold transition-all ${
              activeTab === "TRACK" ? "bg-accent text-primary-dark" : "text-primary-muted"
            }`}
          >
            4. Tracking
          </button>
        </div>

        {/* Simulator Screen Content */}
        <div className="min-h-[360px] flex flex-col justify-between">
          {activeTab === "SCAN" && (
            <div className="py-8 flex flex-col items-center text-center space-y-4">
              <div className="w-32 h-32 p-3 bg-white rounded-2xl shadow-xl border border-white/20 flex items-center justify-center">
                <QrCode className="w-24 h-24 text-black" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-primary">
                  Scan Table QR Code
                </h4>
                <p className="text-xs text-primary-muted mt-1 max-w-xs">
                  In a real restaurant, pointing phone camera automatically opens table 04.
                </p>
              </div>
              <button
                type="button"
                onClick={handleScan}
                className="px-6 py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-primary-dark font-mono font-semibold text-xs tracking-wider transition-colors shadow-glow"
              >
                SIMULATE CAMERA SCAN →
              </button>
            </div>
          )}

          {activeTab === "MENU" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-border text-xs">
                <div>
                  <h4 className="font-semibold text-primary">Casa Verde</h4>
                  <span className="text-[11px] font-mono text-accent">Table 04</span>
                </div>
                <button
                  onClick={() => setActiveTab("CART")}
                  className="px-2.5 py-1 rounded-md bg-surface-elevated text-xs font-mono text-primary flex items-center gap-1.5 border border-border"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-accent" />
                  <span>Cart ({demoCart.length})</span>
                </button>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto no-scrollbar">
                {menuItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-surface border border-border"
                  >
                    <div className="flex-1 pr-2">
                      <h5 className="text-xs font-medium text-primary line-clamp-1">
                        {item.name}
                      </h5>
                      <span className="text-xs font-mono font-semibold text-accent mt-0.5 block">
                        {formatINR(item.price)}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleAddToCart(item)}
                      className="px-2.5 py-1 rounded-md bg-accent text-primary-dark text-xs font-mono font-bold flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      ADD
                    </button>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setActiveTab("CART")}
                className="w-full py-2.5 rounded-xl bg-accent text-primary-dark font-mono font-bold text-xs uppercase"
              >
                Proceed to Cart ({formatINR(subtotal)})
              </button>
            </div>
          )}

          {activeTab === "CART" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-border text-xs">
                <h4 className="font-semibold text-primary">Table 04 Order</h4>
                <span className="font-mono text-accent">{demoCart.length} Items</span>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto no-scrollbar">
                {demoCart.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center p-2 rounded-lg bg-surface border border-border text-xs"
                  >
                    <span>
                      <span className="text-accent font-mono font-bold">{item.qty}x</span>{" "}
                      {item.name}
                    </span>
                    <span className="font-mono text-primary font-medium">
                      {formatINR(item.price * item.qty)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-lg bg-surface border border-border space-y-1 text-xs font-mono">
                <div className="flex justify-between text-primary-muted">
                  <span>Subtotal</span>
                  <span>{formatINR(subtotal)}</span>
                </div>
                <div className="flex justify-between text-primary-muted">
                  <span>GST (5%)</span>
                  <span>{formatINR(Math.round(subtotal * 0.05))}</span>
                </div>
                <div className="flex justify-between text-primary font-bold border-t border-border pt-1">
                  <span>Total</span>
                  <span className="text-accent">
                    {formatINR(subtotal + Math.round(subtotal * 0.05))}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handlePlaceOrder}
                className="w-full py-2.5 rounded-xl bg-accent text-primary-dark font-mono font-bold text-xs uppercase shadow-glow"
              >
                Confirm & Transmit to Kitchen
              </button>
            </div>
          )}

          {activeTab === "TRACK" && (
            <div className="py-4 space-y-4 text-center">
              <div className="w-12 h-12 rounded-full bg-accent/20 border border-accent/40 text-accent mx-auto flex items-center justify-center animate-pulse">
                <Clock className="w-6 h-6 stroke-[2.5]" />
              </div>

              <div>
                <span className="text-[10px] font-mono text-accent font-bold uppercase tracking-widest">
                  Live Ticket MF-4819
                </span>
                <h4 className="text-sm font-semibold text-primary mt-1">
                  Kitchen Accepted Ticket
                </h4>
                <p className="text-xs text-primary-muted mt-1 max-w-xs mx-auto">
                  Chef is preparing dishes fresh at Casa Verde hearth. Average delivery: 12 mins.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-surface border border-border text-left text-xs space-y-2">
                <div className="flex items-center gap-2 text-accent font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Order Transmitted to Kitchen</span>
                </div>
                <div className="flex items-center gap-2 text-primary font-medium">
                  <span className="w-3.5 h-3.5 rounded-full border border-accent bg-accent/40 flex items-center justify-center text-[9px] font-bold">2</span>
                  <span>Cooking on Grill</span>
                </div>
                <div className="flex items-center gap-2 text-primary-muted">
                  <span className="w-3.5 h-3.5 rounded-full border border-border flex items-center justify-center text-[9px]">3</span>
                  <span>Dispatched to Table 04</span>
                </div>
              </div>

              <Link
                href="/menu/casa-verde/table-4"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-accent underline underline-offset-4 font-mono font-semibold"
              >
                <span>Open Fullscreen Guest Menu</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
