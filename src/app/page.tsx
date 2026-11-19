"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Hero3DCard } from "@/components/landing/Hero3DCard";
import { InteractiveDemo } from "@/components/landing/InteractiveDemo";
import { RoiCalculator } from "@/components/landing/RoiCalculator";
import { formatINR } from "@/lib/utils";
import { soundManager } from "@/lib/audio";
import {
  QrCode,
  Smartphone,
  ChefHat,
  CreditCard,
  BarChart3,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
  Users,
  UtensilsCrossed,
  Bell,
  ChevronDown,
  Layers,
  ExternalLink,
} from "lucide-react";

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    soundManager.playClick();
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <div className="min-h-screen bg-background text-primary selection:bg-accent/25">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-background/85 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-surface-elevated border border-accent/40 flex items-center justify-center font-bold text-accent font-mono shadow-glow text-base">
              MF
            </div>
            <span className="font-bold text-lg tracking-tight text-primary">
              MenuFlow
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6 text-xs text-primary-muted font-medium">
            <a href="#how-it-works" className="hover:text-primary transition-colors">
              How It Works
            </a>
            <a href="#demo" className="hover:text-primary transition-colors">
              Live Demo
            </a>
            <a href="#features" className="hover:text-primary transition-colors">
              Features
            </a>
            <a href="#roi" className="hover:text-primary transition-colors">
              ROI Calculator
            </a>
            <a href="#pricing" className="hover:text-primary transition-colors">
              Pricing
            </a>
            <a href="#faq" className="hover:text-primary transition-colors">
              FAQ
            </a>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-xs text-primary-muted hover:text-primary transition-colors px-3 py-1.5"
            >
              Log in
            </Link>
            <Link
              href="/onboarding"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent hover:bg-accent-hover text-primary-dark font-semibold text-xs transition-colors shadow-glow font-mono"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-16 sm:pt-24 pb-16 px-4 sm:px-8 max-w-7xl mx-auto overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Copy */}
          <div className="space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-border text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-primary-muted">
                Next-Gen Dining Operating System
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-primary leading-[1.1]">
              Your restaurant. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-[#5EEAD4] to-champagne">
                One smarter menu.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-primary-muted max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Digital menus, QR ordering, table management, and restaurant analytics — all in one simple, blazingly fast platform built for modern dining.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <Link
                href="/onboarding"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-accent hover:bg-accent-hover text-primary-dark font-bold text-sm transition-all shadow-glow font-mono tracking-wide"
              >
                <span>CREATE YOUR RESTAURANT</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </Link>

              <Link
                href="/menu/casa-verde/table-4"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-surface-elevated hover:bg-surface-hover border border-border-strong text-primary font-medium text-sm transition-all"
              >
                <span>View Guest Demo</span>
                <ExternalLink className="w-4 h-4 text-primary-muted" />
              </Link>
            </div>

            {/* Trust points */}
            <div className="pt-4 flex items-center justify-center lg:justify-start gap-6 text-xs text-primary-muted font-mono">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-accent" />
                <span>Zero app install</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-accent" />
                <span>UPI & Cards ready</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-accent" />
                <span>Live Supabase sync</span>
              </div>
            </div>
          </div>

          {/* Right: 3D QR Card Hero */}
          <div className="flex justify-center">
            <Hero3DCard />
          </div>
        </div>
      </section>

      {/* Social Proof Bar */}
      <section className="border-y border-border py-8 bg-background-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 text-center space-y-4">
          <p className="text-xs uppercase tracking-widest font-mono text-primary-muted font-semibold">
            Empowering premier dining spaces across Bengaluru, Mumbai, Delhi NCR & Goa
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 text-sm font-mono font-bold text-primary-muted/60 tracking-wider">
            <span>CASA VERDE</span>
            <span>THE BOMBAY CANTEEN</span>
            <span>TOIT BREWPUB</span>
            <span>BURMA BURMA</span>
            <span>ROSE & AGAVE</span>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-accent font-semibold px-3 py-1 rounded-full bg-accent-subtle border border-accent/20">
            Frictionless Ordering
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-primary mt-3">
            How MenuFlow Works
          </h2>
          <p className="text-sm text-primary-muted mt-2">
            Eliminate 20+ minutes of awkward waiter waving and order errors per table.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              step: "01",
              title: "Scan Table QR",
              desc: "Guests point any phone camera at the table tent. The restaurant menu opens instantly without downloading any app.",
              icon: QrCode,
            },
            {
              step: "02",
              title: "Explore & Customize",
              desc: "High-definition photography, spice levels, dietary badges, add-ons, and chef cooking notes.",
              icon: UtensilsCrossed,
            },
            {
              step: "03",
              title: "Transmit to Kitchen",
              desc: "Orders instantly dispatch to the kitchen order ticket (KOT) terminal with zero waiter transcription errors.",
              icon: ChefHat,
            },
            {
              step: "04",
              title: "Pay via UPI or Cash",
              desc: "Razorpay-backed instant UPI QR, debit/credit cards, or traditional pay-at-table cash settlements.",
              icon: CreditCard,
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="p-6 rounded-2xl bg-surface border border-border hover:border-border-strong transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-2xl font-black text-accent">
                      {item.step}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-surface-elevated border border-border flex items-center justify-center text-primary-muted">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="text-base font-semibold text-primary">{item.title}</h3>
                  <p className="text-xs text-primary-muted mt-2 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section id="demo" className="py-16 px-4 sm:px-8 bg-background-secondary border-y border-border">
        <InteractiveDemo />
      </section>

      {/* Core Features Grid */}
      <section id="features" className="py-20 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-champagne font-semibold px-3 py-1 rounded-full bg-champagne-subtle border border-champagne/20">
            Engineered for Operations
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-primary mt-3">
            Everything Your Restaurant Needs
          </h2>
          <p className="text-sm text-primary-muted mt-2">
            A cohesive suite designed from the ground up for hospitality staff, floor managers, and guests.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Live Kitchen Control Center",
              desc: "Kanban status pipeline from NEW to CONFIRMED, PREPARING, READY, and SERVED with sound chime notifications.",
              icon: ChefHat,
            },
            {
              title: "Instant Staff Calls",
              desc: "One-tap guest buttons for water refills, bill requests, and waiter assistance with floor notifications.",
              icon: Bell,
            },
            {
              title: "Real Vector QR Generation",
              desc: "Download print-ready PNG and vector QR stands specifically encoded per dining table.",
              icon: QrCode,
            },
            {
              title: "Menu Items & Addons Studio",
              desc: "Custom variants, side add-ons, price modifiers, vegetarian indicators, and bestseller tags.",
              icon: Layers,
            },
            {
              title: "Razorpay UPI Payments",
              desc: "Production-ready payment abstraction supporting PhonePe, Google Pay, Cards, and Cash reconciliations.",
              icon: CreditCard,
            },
            {
              title: "GST Tax Invoices",
              desc: "Compliant 5% restaurant GST itemization with printable bill of supply and customer receipts.",
              icon: ShieldCheck,
            },
            {
              title: "Table Turnover Analytics",
              desc: "Track average dining velocity, peak service hours, high-margin dishes, and repeat guest loyalty.",
              icon: BarChart3,
            },
            {
              title: "Promotions & Happy Hours",
              desc: "Launch percentage discounts, flat bill deductions, and minimum order qualifiers in seconds.",
              icon: Sparkles,
            },
            {
              title: "Anonymous Guest Sessions",
              desc: "Zero mandatory account creation or phone spam for customers. Pure, elegant dining frictionlessness.",
              icon: Users,
            },
          ].map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className="p-6 rounded-2xl bg-surface border border-border hover:border-accent/30 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-surface-elevated border border-border flex items-center justify-center text-accent mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-semibold text-primary">{f.title}</h3>
                  <p className="text-xs text-primary-muted mt-2 leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ROI Calculator Section */}
      <section id="roi" className="py-16 px-4 sm:px-8 bg-background-secondary border-y border-border">
        <RoiCalculator />
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-accent font-semibold px-3 py-1 rounded-full bg-accent-subtle border border-accent/20">
            Transparent Pricing
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-primary mt-3">
            Simple Investment. Massive Turnover.
          </h2>
          <p className="text-sm text-primary-muted mt-2">
            No hidden setup fees. Start free and scale as your dining traffic surges.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Starter */}
          <div className="p-6 rounded-2xl bg-surface border border-border flex flex-col justify-between">
            <div>
              <span className="font-mono text-xs uppercase text-primary-muted">Café & Bistro</span>
              <h3 className="text-xl font-bold text-primary mt-1">Starter</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-3xl font-black font-mono text-primary">₹1,499</span>
                <span className="text-xs text-primary-muted">/ month</span>
              </div>
              <p className="text-xs text-primary-muted mt-2">
                Ideal for boutique cafés and small bistros up to 12 tables.
              </p>

              <div className="mt-6 space-y-2.5 text-xs text-primary-muted">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent" />
                  <span>Up to 15 Dining Tables</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent" />
                  <span>Unlimited QR scans</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent" />
                  <span>Realtime Kitchen KOT Terminal</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent" />
                  <span>Razorpay UPI checkout</span>
                </div>
              </div>
            </div>

            <Link
              href="/onboarding"
              className="mt-8 w-full py-2.5 rounded-xl bg-surface-elevated hover:bg-surface-hover border border-border text-primary text-center font-mono font-semibold text-xs block transition-colors"
            >
              Choose Starter
            </Link>
          </div>

          {/* Growth (Recommended) */}
          <div className="relative p-6 rounded-2xl bg-surface border-2 border-accent shadow-glow flex flex-col justify-between">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-accent text-primary-dark font-mono text-[10px] font-black uppercase tracking-wider">
              Most Popular
            </div>

            <div>
              <span className="font-mono text-xs uppercase text-accent font-semibold">Fine Dining & Bars</span>
              <h3 className="text-xl font-bold text-primary mt-1">Growth Pro</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-3xl font-black font-mono text-accent">₹2,999</span>
                <span className="text-xs text-primary-muted">/ month</span>
              </div>
              <p className="text-xs text-primary-muted mt-2">
                Full operating power for bustling restaurants, lounges, and multi-floor venues.
              </p>

              <div className="mt-6 space-y-2.5 text-xs text-primary">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent" />
                  <span>Up to 50 Dining Tables</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent" />
                  <span>Waiter & Floor Call Requests</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent" />
                  <span>Promotions & Coupon Studio</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent" />
                  <span>GST Tax Invoicing & Print Engine</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent" />
                  <span>Priority Audio Alerts & Multi-device Sync</span>
                </div>
              </div>
            </div>

            <Link
              href="/onboarding"
              className="mt-8 w-full py-3 rounded-xl bg-accent hover:bg-accent-hover text-primary-dark text-center font-mono font-bold text-xs uppercase block transition-colors shadow-glow"
            >
              Start 14-Day Free Trial
            </Link>
          </div>

          {/* Enterprise */}
          <div className="p-6 rounded-2xl bg-surface border border-border flex flex-col justify-between">
            <div>
              <span className="font-mono text-xs uppercase text-primary-muted">Restaurant Chains</span>
              <h3 className="text-xl font-bold text-primary mt-1">Enterprise</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-3xl font-black font-mono text-primary">Custom</span>
              </div>
              <p className="text-xs text-primary-muted mt-2">
                Dedicated POS integration, multi-branch analytics, and custom domain setup.
              </p>

              <div className="mt-6 space-y-2.5 text-xs text-primary-muted">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent" />
                  <span>Unlimited Tables & Outlets</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent" />
                  <span>Legacy POS API Integration</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent" />
                  <span>Custom Restaurant Subdomain</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent" />
                  <span>Dedicated Hospitality Account Manager</span>
                </div>
              </div>
            </div>

            <a
              href="mailto:partners@menuflow.in"
              className="mt-8 w-full py-2.5 rounded-xl bg-surface-elevated hover:bg-surface-hover border border-border text-primary text-center font-mono font-semibold text-xs block transition-colors"
            >
              Contact Sales
            </a>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-4 sm:px-8 bg-background-secondary border-t border-border">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center">
            <span className="text-xs font-mono uppercase tracking-widest text-primary-muted font-semibold">
              Frequently Answered
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-primary mt-2">
              Common Questions from Restaurateurs
            </h2>
          </div>

          <div className="space-y-3">
            {[
              {
                q: "Do guests need to download an application to order?",
                a: "Never. Guests simply open their iPhone or Android camera, point at the table tent, and the high-speed MenuFlow web app opens immediately in their default browser in under 800 milliseconds.",
              },
              {
                q: "How does payment settlement work with Razorpay in India?",
                a: "MenuFlow routes payments directly through your own Razorpay merchant account into your bank account. Guests can pay using Google Pay, PhonePe, Paytm, BHIM UPI, credit/debit cards, or opt for traditional cash at table.",
              },
              {
                q: "Can staff still take manual orders or adjust items?",
                a: "Yes. Floor servers and bartenders can access the MenuFlow orders control center on any tablet, phone, or laptop to adjust orders, add complimentary items, or change ticket statuses in realtime.",
              },
              {
                q: "What hardware is required to run MenuFlow?",
                a: "Any modern device with a web browser — iPads, Android tablets, kitchen touchscreen PCs, or existing billing counter monitors. You do not need proprietary or locked-down POS terminals.",
              },
              {
                q: "Can I manage different menus for Lunch, Dinner, or Happy Hours?",
                a: "Yes. MenuFlow includes instant item availability toggles, happy hour promotional rules, and scheduled discount campaigns with one-click activation.",
              },
            ].map((faq, idx) => (
              <div
                key={idx}
                className="rounded-xl bg-surface border border-border overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-4 text-left flex items-center justify-between text-xs sm:text-sm font-semibold text-primary hover:bg-surface-elevated transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-primary-muted transition-transform ${
                      openFaq === idx ? "rotate-180 text-accent" : ""
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-4 pb-4 pt-1 text-xs text-primary-muted leading-relaxed border-t border-border/50">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-20 px-4 sm:px-8 max-w-5xl mx-auto text-center space-y-6">
        <div className="w-12 h-12 rounded-2xl bg-accent-subtle text-accent border border-accent/30 mx-auto flex items-center justify-center shadow-glow">
          <Sparkles className="w-6 h-6" />
        </div>

        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-primary">
          Turn Every Table Into a Digital Experience Today
        </h2>

        <p className="text-sm text-primary-muted max-w-xl mx-auto leading-relaxed">
          Join restaurants accelerating table turnover, increasing ticket sizes, and delighting modern diners across India.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/onboarding"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-accent hover:bg-accent-hover text-primary-dark font-bold text-sm transition-all shadow-glow font-mono tracking-wide"
          >
            CREATE RESTAURANT NOW
          </Link>
          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-surface-elevated hover:bg-surface-hover border border-border text-primary font-medium text-sm transition-all"
          >
            Explore Casa Verde Dashboard
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4 sm:px-8 bg-background-secondary text-xs text-primary-muted">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-surface-elevated border border-accent/40 flex items-center justify-center font-bold text-accent font-mono text-xs">
              MF
            </div>
            <span className="font-bold text-primary text-sm">MenuFlow</span>
            <span className="text-[11px] text-primary-muted">
              • The Restaurant Operating Platform
            </span>
          </div>

          <div className="flex items-center gap-6 font-mono text-[11px]">
            <Link href="/menu/casa-verde/table-4" className="hover:text-primary transition-colors">
              Live Guest Demo
            </Link>
            <Link href="/dashboard" className="hover:text-primary transition-colors">
              Admin Portal
            </Link>
            <Link href="/onboarding" className="hover:text-primary transition-colors">
              Onboarding
            </Link>
          </div>

          <div className="text-[11px] font-mono text-primary-muted/60">
            © {new Date().getFullYear()} MenuFlow Inc. Built for modern dining.
          </div>
        </div>
      </footer>
    </div>
  );
}
