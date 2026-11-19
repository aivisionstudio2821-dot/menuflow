"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { soundManager } from "@/lib/audio";
import { Lock, Mail, ArrowRight, User, Building } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [restaurantName, setRestaurantName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundManager.playClick();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      router.push("/onboarding");
    }, 400);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-3">
            <div className="w-9 h-9 rounded-xl bg-surface-elevated border border-accent/40 flex items-center justify-center font-bold text-accent font-mono shadow-glow text-lg">
              MF
            </div>
            <span className="font-bold text-xl tracking-tight text-primary">
              MenuFlow
            </span>
          </Link>
          <h2 className="text-lg font-semibold text-primary">
            Start Your Digital Dining Journey
          </h2>
          <p className="text-xs text-primary-muted mt-1">
            Setup your digital QR menu in under 3 minutes
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-surface border border-border shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-primary-muted mb-1">
                Your Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-muted" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Chef Sanjeev Kapoor"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg bg-surface-elevated border border-border pl-9 pr-3 py-2 text-primary focus:outline-none focus:border-accent"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-primary-muted mb-1">
                Restaurant Name
              </label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-muted" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Copper Chimney"
                  value={restaurantName}
                  onChange={(e) => setRestaurantName(e.target.value)}
                  className="w-full rounded-lg bg-surface-elevated border border-border pl-9 pr-3 py-2 text-primary focus:outline-none focus:border-accent"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-primary-muted mb-1">
                Business Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-muted" />
                <input
                  type="email"
                  required
                  placeholder="owner@restaurant.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg bg-surface-elevated border border-border pl-9 pr-3 py-2 text-primary focus:outline-none focus:border-accent"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-primary-muted mb-1">
                Create Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-muted" />
                <input
                  type="password"
                  required
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg bg-surface-elevated border border-border pl-9 pr-3 py-2 text-primary focus:outline-none focus:border-accent"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-accent hover:bg-accent-hover text-primary-dark font-semibold text-xs transition-colors flex items-center justify-center gap-2 font-mono tracking-wide shadow-glow mt-4"
            >
              <span>{loading ? "CREATING WORKSPACE..." : "START ONBOARDING"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        <div className="text-center text-xs text-primary-muted">
          Already registered?{" "}
          <Link href="/login" className="text-accent hover:underline font-medium">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
