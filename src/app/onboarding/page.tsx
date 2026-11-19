"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useRestaurantStore } from "@/lib/store";
import { soundManager } from "@/lib/audio";
import {
  Building,
  Image as ImageIcon,
  Utensils,
  MapPin,
  Phone,
  Clock,
  Layers,
  Sparkles,
  Users,
  QrCode,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";

const ONBOARDING_STEPS = [
  { id: 1, title: "Restaurant Name", subtitle: "What is your dining establishment called?", icon: Building },
  { id: 2, title: "Brand Logo & Cover", subtitle: "Provide image URLs for your branding", icon: ImageIcon },
  { id: 3, title: "Cuisine Specialty", subtitle: "What culinary style do you prepare?", icon: Utensils },
  { id: 4, title: "Address & City", subtitle: "Where can customers find your restaurant?", icon: MapPin },
  { id: 5, title: "Contact Information", subtitle: "Phone and business email for notifications", icon: Phone },
  { id: 6, title: "Operating Hours", subtitle: "When are your kitchen and cantina open?", icon: Clock },
  { id: 7, title: "First Menu Category", subtitle: "Create your primary course or starter section", icon: Layers },
  { id: 8, title: "First Signature Dish", subtitle: "Add your headline specialty dish", icon: Sparkles },
  { id: 9, title: "Dining Tables Setup", subtitle: "Configure how many tables are on your floor", icon: Users },
  { id: 10, title: "Generate QR Codes", subtitle: "Generate digital menu QR links for tables", icon: QrCode },
];

export default function OnboardingWizardPage() {
  const router = useRouter();
  const store = useRestaurantStore();

  const [currentStep, setCurrentStep] = useState(1);

  // Form states
  const [name, setName] = useState("Casa Verde");
  const [logoUrl, setLogoUrl] = useState("https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&auto=format&fit=crop&q=80");
  const [cuisine, setCuisine] = useState("Mexican / Modern Casual");
  const [address, setAddress] = useState("108, 12th Main Rd, Indiranagar, Bengaluru");
  const [phone, setPhone] = useState("+91 98450 12345");
  const [email, setEmail] = useState("hola@casaverde.in");
  const [hours, setHours] = useState("12:00 PM – 11:30 PM (Daily)");
  const [categoryName, setCategoryName] = useState("Artisanal Tacos");
  const [dishName, setDishName] = useState("Smoked Jackfruit Birria Tacos");
  const [dishPrice, setDishPrice] = useState(425);
  const [tablesCount, setTablesCount] = useState(10);

  const handleNext = () => {
    soundManager.playClick();
    if (currentStep < 10) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding
      store.updateRestaurant({
        name,
        logo_url: logoUrl,
        cuisine_type: cuisine,
        address,
        phone,
        email,
      });
      router.push("/dashboard");
    }
  };

  const handleBack = () => {
    soundManager.playClick();
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const activeStepMeta = ONBOARDING_STEPS[currentStep - 1];
  const Icon = activeStepMeta.icon;

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between p-4 sm:p-8">
      {/* Top Header */}
      <div className="max-w-2xl w-full mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-surface-elevated border border-accent/40 flex items-center justify-center font-bold text-accent font-mono text-sm">
            MF
          </div>
          <span className="font-bold text-sm tracking-tight text-primary">
            MenuFlow Setup
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-primary-muted">
          <span>Step {currentStep} of 10</span>
          <div className="w-24 bg-surface-elevated h-1.5 rounded-full overflow-hidden border border-border">
            <div
              style={{ width: `${(currentStep / 10) * 100}%` }}
              className="bg-accent h-full transition-all duration-300"
            />
          </div>
        </div>
      </div>

      {/* Center Step Box */}
      <div className="max-w-lg w-full mx-auto my-8">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="p-6 sm:p-8 rounded-2xl bg-surface border border-border shadow-2xl space-y-6"
        >
          {/* Step Heading */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent-subtle text-accent flex items-center justify-center flex-shrink-0 border border-accent/20">
              <Icon className="w-6 h-6 stroke-[2]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-primary">
                {activeStepMeta.title}
              </h2>
              <p className="text-xs text-primary-muted mt-1">
                {activeStepMeta.subtitle}
              </p>
            </div>
          </div>

          {/* Form Step Body */}
          <div className="pt-2 text-xs">
            {currentStep === 1 && (
              <div className="space-y-2">
                <label className="text-[11px] uppercase tracking-wider text-primary-muted block">
                  Restaurant Trading Name
                </label>
                <input
                  type="text"
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl bg-surface-elevated border border-border px-4 py-3 text-sm text-primary focus:outline-none focus:border-accent"
                />
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-2">
                <label className="text-[11px] uppercase tracking-wider text-primary-muted block">
                  Logo URL
                </label>
                <input
                  type="url"
                  autoFocus
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  className="w-full rounded-xl bg-surface-elevated border border-border px-4 py-3 text-xs text-primary focus:outline-none focus:border-accent font-mono"
                />
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-2">
                <label className="text-[11px] uppercase tracking-wider text-primary-muted block">
                  Cuisine Classification
                </label>
                <input
                  type="text"
                  autoFocus
                  value={cuisine}
                  onChange={(e) => setCuisine(e.target.value)}
                  className="w-full rounded-xl bg-surface-elevated border border-border px-4 py-3 text-sm text-primary focus:outline-none focus:border-accent"
                />
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-2">
                <label className="text-[11px] uppercase tracking-wider text-primary-muted block">
                  Physical Address
                </label>
                <input
                  type="text"
                  autoFocus
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full rounded-xl bg-surface-elevated border border-border px-4 py-3 text-sm text-primary focus:outline-none focus:border-accent"
                />
              </div>
            )}

            {currentStep === 5 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-primary-muted block mb-1">
                    Phone
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-xl bg-surface-elevated border border-border px-3 py-2 text-primary focus:outline-none focus:border-accent font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-primary-muted block mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl bg-surface-elevated border border-border px-3 py-2 text-primary focus:outline-none focus:border-accent"
                  />
                </div>
              </div>
            )}

            {currentStep === 6 && (
              <div className="space-y-2">
                <label className="text-[11px] uppercase tracking-wider text-primary-muted block">
                  Kitchen Hours
                </label>
                <input
                  type="text"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  className="w-full rounded-xl bg-surface-elevated border border-border px-4 py-3 text-sm text-primary focus:outline-none focus:border-accent font-mono"
                />
              </div>
            )}

            {currentStep === 7 && (
              <div className="space-y-2">
                <label className="text-[11px] uppercase tracking-wider text-primary-muted block">
                  Category Name
                </label>
                <input
                  type="text"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  className="w-full rounded-xl bg-surface-elevated border border-border px-4 py-3 text-sm text-primary focus:outline-none focus:border-accent"
                />
              </div>
            )}

            {currentStep === 8 && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-primary-muted block mb-1">
                    Dish Name
                  </label>
                  <input
                    type="text"
                    value={dishName}
                    onChange={(e) => setDishName(e.target.value)}
                    className="w-full rounded-xl bg-surface-elevated border border-border px-3 py-2 text-primary focus:outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-primary-muted block mb-1">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    value={dishPrice}
                    onChange={(e) => setDishPrice(Number(e.target.value))}
                    className="w-full rounded-xl bg-surface-elevated border border-border px-3 py-2 text-primary focus:outline-none focus:border-accent font-mono"
                  />
                </div>
              </div>
            )}

            {currentStep === 9 && (
              <div className="space-y-2">
                <label className="text-[11px] uppercase tracking-wider text-primary-muted block">
                  Number of Tables to Generate
                </label>
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={tablesCount}
                  onChange={(e) => setTablesCount(Number(e.target.value))}
                  className="w-full rounded-xl bg-surface-elevated border border-border px-4 py-3 text-sm text-primary focus:outline-none focus:border-accent font-mono"
                />
                <span className="text-[11px] text-primary-muted block mt-1">
                  Table 01 through Table {tablesCount < 10 ? "0" + tablesCount : tablesCount} will be provisioned.
                </span>
              </div>
            )}

            {currentStep === 10 && (
              <div className="py-4 text-center space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-accent/15 border border-accent/40 text-accent mx-auto flex items-center justify-center animate-bounce">
                  <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
                </div>
                <h3 className="text-base font-semibold text-primary">
                  Ready to Launch Digital Ordering!
                </h3>
                <p className="text-xs text-primary-muted max-w-sm mx-auto">
                  Your digital menu for {name} has been configured with {tablesCount} tables, QR codes, and instant kitchen transmission.
                </p>
              </div>
            )}
          </div>

          {/* Action Navigation */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <button
              type="button"
              onClick={handleBack}
              disabled={currentStep === 1}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-surface-elevated text-primary-muted hover:text-primary disabled:opacity-40 text-xs font-medium transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-primary-dark font-semibold text-xs transition-colors shadow-glow font-mono tracking-wide"
            >
              <span>{currentStep === 10 ? "LAUNCH DASHBOARD" : "CONTINUE"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      </div>

      <div className="text-center text-[11px] text-primary-muted/60 font-mono">
        MenuFlow Architecture • Powered by Supabase & Next.js
      </div>
    </div>
  );
}
