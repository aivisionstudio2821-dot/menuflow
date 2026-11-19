"use client";

import React, { useState } from "react";
import { formatINR } from "@/lib/utils";
import { TrendingUp, Clock, IndianRupee, Sparkles } from "lucide-react";

export function RoiCalculator() {
  const [tables, setTables] = useState(20);
  const [aov, setAov] = useState(900);
  const [turns, setTurns] = useState(3.5);

  // Revenue estimation
  // Faster turnover adds ~0.6 extra table turns/day
  // Upselling adds ~12% higher ticket size
  const currentMonthly = tables * turns * aov * 30;
  const enhancedAov = aov * 1.12;
  const enhancedTurns = turns + 0.6;
  const newMonthly = tables * enhancedTurns * enhancedAov * 30;
  const extraRevenue = Math.round(newMonthly - currentMonthly);

  return (
    <div className="w-full max-w-4xl mx-auto p-6 sm:p-8 rounded-3xl bg-surface border border-border">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-border">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-champagne font-semibold px-2.5 py-0.5 rounded bg-champagne-subtle border border-champagne/20">
            Restaurant Growth Model
          </span>
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-primary mt-2">
            Calculate Your Table Turnover ROI
          </h3>
          <p className="text-xs text-primary-muted mt-1">
            Visual QR menus eliminate waiter delays and encourage beverage & dessert add-ons.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-surface-elevated border border-accent/30 text-right w-full md:w-auto">
          <span className="text-[11px] font-mono text-primary-muted uppercase tracking-wider block">
            Estimated Extra Monthly Revenue
          </span>
          <span className="text-2xl sm:text-3xl font-black font-mono text-accent">
            +{formatINR(extraRevenue)}
          </span>
          <span className="text-[10px] text-emerald-400 block mt-0.5">
            / month in incremental food & beverage sales
          </span>
        </div>
      </div>

      {/* Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 text-xs">
        {/* Tables */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-primary">Dining Tables</span>
            <span className="font-mono text-accent font-bold">{tables} Tables</span>
          </div>
          <input
            type="range"
            min={4}
            max={60}
            step={1}
            value={tables}
            onChange={(e) => setTables(Number(e.target.value))}
            className="w-full accent-[#2DD4BF] bg-surface-elevated"
          />
        </div>

        {/* Average Order Value */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-primary">Average Ticket Size</span>
            <span className="font-mono text-accent font-bold">{formatINR(aov)}</span>
          </div>
          <input
            type="range"
            min={300}
            max={2500}
            step={50}
            value={aov}
            onChange={(e) => setAov(Number(e.target.value))}
            className="w-full accent-[#2DD4BF] bg-surface-elevated"
          />
        </div>

        {/* Table Turns per day */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-primary">Daily Seatings / Table</span>
            <span className="font-mono text-accent font-bold">{turns} Turns</span>
          </div>
          <input
            type="range"
            min={1.5}
            max={6}
            step={0.5}
            value={turns}
            onChange={(e) => setTurns(Number(e.target.value))}
            className="w-full accent-[#2DD4BF] bg-surface-elevated"
          />
        </div>
      </div>
    </div>
  );
}
