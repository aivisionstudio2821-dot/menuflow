"use client";

import React, { useState } from "react";
import { Header } from "@/components/dashboard/Header";
import { useRestaurantStore } from "@/lib/store";
import { soundManager } from "@/lib/audio";
import {
  Save,
  RotateCcw,
  Building,
  CreditCard,
  Percent,
  Check,
  ShieldAlert,
} from "lucide-react";

export default function RestaurantSettingsPage() {
  const store = useRestaurantStore();
  const restaurant = store.getRestaurant();
  const settings = store.getSettings();

  // Form states
  const [name, setName] = useState(restaurant.name);
  const [tagline, setTagline] = useState(restaurant.tagline);
  const [cuisine, setCuisine] = useState(restaurant.cuisine_type);
  const [phone, setPhone] = useState(restaurant.phone);
  const [email, setEmail] = useState(restaurant.email);
  const [address, setAddress] = useState(restaurant.address);
  const [city, setCity] = useState(restaurant.city);
  const [taxRate, setTaxRate] = useState(settings.tax_rate);
  const [serviceRate, setServiceRate] = useState(settings.service_charge_rate);
  const [soundEnabled, setSoundEnabled] = useState(settings.sound_notifications);
  const [razorpayKey, setRazorpayKey] = useState(settings.razorpay_key_id || "");
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();
    soundManager.playClick();

    store.updateRestaurant({
      name,
      tagline,
      cuisine_type: cuisine,
      phone,
      email,
      address,
      city,
    });

    store.updateSettings({
      tax_rate: Number(taxRate),
      service_charge_rate: Number(serviceRate),
      sound_notifications: soundEnabled,
      razorpay_key_id: razorpayKey.trim() || undefined,
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleResetSeed = () => {
    if (confirm("Reset MenuFlow to fresh factory demo state? This will restore Casa Verde dishes, 10 tables, and initial orders.")) {
      soundManager.playClick();
      store.resetToSeed();
      window.location.reload();
    }
  };

  return (
    <div className="flex-1 pb-16">
      <Header
        title="Restaurant Settings & Configuration"
        subtitle="Manage business identity, GST taxation, payment gateway keys, and operational defaults"
        actionButton={
          <button
            onClick={handleSaveAll}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-accent hover:bg-accent-hover text-primary-dark font-semibold text-xs transition-colors shadow-glow font-mono"
          >
            {savedSuccess ? <Check className="w-4 h-4 stroke-[3]" /> : <Save className="w-4 h-4" />}
            <span>{savedSuccess ? "SAVED SUCCESSFULLY" : "SAVE CONFIGURATION"}</span>
          </button>
        }
      />

      <div className="px-4 sm:px-8 py-6 space-y-6 max-w-4xl">
        <form onSubmit={handleSaveAll} className="space-y-6">
          {/* Restaurant Profile */}
          <div className="p-6 rounded-2xl bg-surface border border-border space-y-4">
            <div className="flex items-center gap-2.5 pb-2 border-b border-border">
              <Building className="w-4 h-4 text-accent" />
              <h3 className="text-sm font-semibold text-primary">
                Restaurant Identity & Location
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-primary-muted mb-1">
                  Restaurant Legal Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg bg-surface-elevated border border-border px-3 py-2 text-primary focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-primary-muted mb-1">
                  Tagline
                </label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full rounded-lg bg-surface-elevated border border-border px-3 py-2 text-primary focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-primary-muted mb-1">
                  Cuisine Classification
                </label>
                <input
                  type="text"
                  value={cuisine}
                  onChange={(e) => setCuisine(e.target.value)}
                  className="w-full rounded-lg bg-surface-elevated border border-border px-3 py-2 text-primary focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-primary-muted mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-lg bg-surface-elevated border border-border px-3 py-2 text-primary focus:outline-none focus:border-accent font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] uppercase tracking-wider text-primary-muted mb-1">
                  Full Street Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full rounded-lg bg-surface-elevated border border-border px-3 py-2 text-primary focus:outline-none focus:border-accent"
                />
              </div>
            </div>
          </div>

          {/* Taxes & Bill Configuration */}
          <div className="p-6 rounded-2xl bg-surface border border-border space-y-4">
            <div className="flex items-center gap-2.5 pb-2 border-b border-border">
              <Percent className="w-4 h-4 text-champagne" />
              <h3 className="text-sm font-semibold text-primary">
                Taxation & Bill Surcharges
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-primary-muted mb-1">
                  GST Tax Rate (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="28"
                  value={taxRate}
                  onChange={(e) => setTaxRate(Number(e.target.value))}
                  className="w-full rounded-lg bg-surface-elevated border border-border px-3 py-2 text-primary focus:outline-none focus:border-accent font-mono"
                />
                <span className="text-[10px] text-primary-muted mt-1 block">
                  Standard 5% GST for restaurants in India (2.5% CGST + 2.5% SGST)
                </span>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-primary-muted mb-1">
                  Discretionary Service Fee (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="15"
                  value={serviceRate}
                  onChange={(e) => setServiceRate(Number(e.target.value))}
                  className="w-full rounded-lg bg-surface-elevated border border-border px-3 py-2 text-primary focus:outline-none focus:border-accent font-mono"
                />
                <span className="text-[10px] text-primary-muted mt-1 block">
                  Distributed across floor waiters & culinary team
                </span>
              </div>
            </div>
          </div>

          {/* Razorpay Integration */}
          <div className="p-6 rounded-2xl bg-surface border border-border space-y-4">
            <div className="flex items-center gap-2.5 pb-2 border-b border-border">
              <CreditCard className="w-4 h-4 text-accent" />
              <h3 className="text-sm font-semibold text-primary">
                Razorpay Payment Gateway (India)
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-primary-muted mb-1">
                  Razorpay Key ID
                </label>
                <input
                  type="text"
                  value={razorpayKey}
                  onChange={(e) => setRazorpayKey(e.target.value)}
                  placeholder="rzp_test_..."
                  className="w-full rounded-lg bg-surface-elevated border border-border px-3 py-2 text-primary focus:outline-none focus:border-accent font-mono"
                />
                <span className="text-[10px] text-primary-muted mt-1 block">
                  Supports Google Pay, PhonePe, Paytm, RuPay, Visa, Mastercard, and Netbanking.
                </span>
              </div>
            </div>
          </div>

          {/* Danger Zone: Factory Reset */}
          <div className="p-6 rounded-2xl bg-surface border border-danger/30 space-y-4">
            <div className="flex items-center gap-2.5 pb-2 border-b border-danger/20 text-danger">
              <ShieldAlert className="w-4 h-4" />
              <h3 className="text-sm font-semibold">Development & Seed Reset</h3>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-semibold text-primary">
                  Restore Factory Demo Dataset
                </h4>
                <p className="text-[11px] text-primary-muted mt-0.5">
                  Restores 16 Casa Verde Mexican dishes, 10 floor tables, and sample orders.
                </p>
              </div>

              <button
                type="button"
                onClick={handleResetSeed}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-danger/15 hover:bg-danger/25 border border-danger/40 text-danger text-xs font-semibold transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Store</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
