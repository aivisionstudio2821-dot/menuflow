"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { soundManager } from "@/lib/audio";
import { Lock, Mail, ArrowRight, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("owner@casaverde.in");
  const [password, setPassword] = useState("••••••••••••");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundManager.playClick();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      router.push("/dashboard");
    }, 400);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-sm space-y-6">
        {/* Brand */}
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
            Sign in to Restaurant Portal
          </h2>
          <p className="text-xs text-primary-muted mt-1">
            Access your live kitchen terminal and floor analytics
          </p>
        </div>

        {/* Card */}
        <div className="p-6 rounded-2xl bg-surface border border-border shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-primary-muted mb-1">
                Business Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-muted" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg bg-surface-elevated border border-border pl-9 pr-3 py-2 text-primary focus:outline-none focus:border-accent"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[11px] uppercase tracking-wider text-primary-muted">
                  Password
                </label>
                <a href="#" className="text-[11px] text-accent hover:underline">
                  Forgot?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-muted" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg bg-surface-elevated border border-border pl-9 pr-3 py-2 text-primary focus:outline-none focus:border-accent"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-accent hover:bg-accent-hover text-primary-dark font-semibold text-xs transition-colors flex items-center justify-center gap-2 font-mono tracking-wide shadow-glow"
            >
              <span>{loading ? "AUTHENTICATING..." : "ENTER DASHBOARD"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Quick Demo Credentials hint */}
          <div className="mt-5 pt-4 border-t border-border text-[11px] text-primary-muted/80 bg-surface-elevated/40 p-2.5 rounded-lg border">
            <span className="font-semibold text-accent">Demo Access: </span>
            Preloaded with Casa Verde credentials. Click "Enter Dashboard" to proceed immediately.
          </div>
        </div>

        <div className="text-center text-xs text-primary-muted">
          New restaurant?{" "}
          <Link href="/onboarding" className="text-accent hover:underline font-medium">
            Launch Onboarding
          </Link>
        </div>
      </div>
    </div>
  );
}
