"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { QrCode, Sparkles, Star, ChevronRight, ShieldCheck, Flame } from "lucide-react";
import { formatINR } from "@/lib/utils";

export function Hero3DCard() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(6);
  const [rotateY, setRotateY] = useState(-12);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rX = ((y - centerY) / centerY) * -12;
    const rY = ((x - centerX) / centerX) * 14;

    setRotateX(rX);
    setRotateY(rY);
  };

  const handleMouseLeave = () => {
    setRotateX(6);
    setRotateY(-12);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full max-w-md mx-auto perspective-1000 py-6"
    >
      {/* 3D Container */}
      <div
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transition: "transform 0.15s ease-out",
        }}
        className="preserve-3d relative rounded-3xl bg-gradient-to-b from-surface-elevated via-surface to-background border border-border-strong p-6 shadow-2xl glow-teal-subtle"
      >
        {/* Floating Table Stand Badge */}
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse" />
            <span className="font-mono font-bold text-xs uppercase tracking-wider text-accent">
              Table 04 • Live Session
            </span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-champagne-subtle text-champagne border border-champagne/30 uppercase font-semibold">
            Casa Verde Cocina
          </span>
        </div>

        {/* Centerpiece: Real QR Code + Food Preview */}
        <div className="my-6 flex items-center gap-5">
          {/* QR Stand Card */}
          <div className="p-3 bg-white rounded-2xl shadow-xl border border-white/20 flex flex-col items-center flex-shrink-0">
            <div className="w-28 h-28 relative flex items-center justify-center">
              {/* High-fidelity vector-like QR Pattern */}
              <div className="w-full h-full bg-[#080A0C] p-2 rounded-lg flex items-center justify-center">
                <QrCode className="w-24 h-24 text-white stroke-[2.2]" />
              </div>
            </div>
            <span className="text-[9px] font-mono font-black uppercase text-black tracking-widest mt-1.5">
              SCAN TO ORDER
            </span>
          </div>

          {/* Active Dish Floating Pill */}
          <div className="flex-1 space-y-2.5">
            <div className="p-3 rounded-xl bg-surface-elevated border border-border shadow-md">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="w-3.5 h-3.5 rounded-sm border border-emerald-500 flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                </span>
                <span className="text-[11px] font-semibold text-primary">Birria Tacos</span>
              </div>
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-accent font-bold">₹425</span>
                <span className="text-[10px] text-emerald-400 font-semibold">In Kitchen</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-surface-elevated border border-border shadow-md">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="w-3.5 h-3.5 rounded-sm border border-emerald-500 flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                </span>
                <span className="text-[11px] font-semibold text-primary">Molcajete Guac</span>
              </div>
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-accent font-bold">₹345</span>
                <span className="text-[10px] text-accent font-semibold">Plated</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Metrics */}
        <div className="pt-4 border-t border-border flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-1.5 text-primary-muted">
            <ShieldCheck className="w-4 h-4 text-accent" />
            <span className="text-[11px]">Instant UPI • 0% wait time</span>
          </div>

          <Link
            href="/menu/casa-verde/table-4"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-accent font-semibold hover:underline text-[11px]"
          >
            <span>Scan simulator</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
