"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/dashboard/Header";
import { useRestaurantStore } from "@/lib/store";
import { RestaurantTable } from "@/lib/types";
import { soundManager } from "@/lib/audio";
import {
  Plus,
  Users,
  QrCode,
  ExternalLink,
  RotateCcw,
  Check,
  X,
  CreditCard,
  Utensils,
} from "lucide-react";

export default function TablesManagementPage() {
  const store = useRestaurantStore();
  const tables = store.getTables();
  const orders = store.getOrders();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tableNum, setTableNum] = useState("");
  const [capacity, setCapacity] = useState(4);
  const [location, setLocation] = useState("Main Dining");

  const handleAddTable = (e: React.FormEvent) => {
    e.preventDefault();
    soundManager.playClick();

    const formatted = tableNum.toLowerCase().startsWith("table")
      ? tableNum
      : `Table ${tableNum}`;

    store.addTable({
      restaurant_id: store.getRestaurant().id,
      table_number: formatted,
      capacity: Number(capacity),
      location,
      status: "available",
      sort_order: tables.length + 1,
    });

    setIsModalOpen(false);
    setTableNum("");
  };

  const handleUpdateStatus = (
    tableId: string,
    status: "available" | "occupied" | "ordering" | "bill_requested"
  ) => {
    soundManager.playClick();
    store.updateTableStatus(tableId, status);
  };

  return (
    <div className="flex-1 pb-16">
      <Header
        title="Table Floor Architecture"
        subtitle="Manage floor layouts, dining capacities, real-time table occupancy, and quick turnover"
        actionButton={
          <button
            onClick={() => {
              setTableNum(`Table ${tables.length + 1 < 10 ? "0" + (tables.length + 1) : tables.length + 1}`);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-accent hover:bg-accent-hover text-primary-dark font-semibold text-xs transition-colors shadow-glow"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Table</span>
          </button>
        }
      />

      <div className="px-4 sm:px-8 py-6 space-y-6 max-w-7xl">
        {/* Floor summary stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 rounded-xl bg-surface border border-border">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-primary-muted">
              Total Tables
            </span>
            <div className="text-xl font-bold font-mono text-primary mt-1">
              {tables.length}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-surface border border-border">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
              Available
            </span>
            <div className="text-xl font-bold font-mono text-emerald-400 mt-1">
              {tables.filter((t) => t.status === "available").length}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-surface border border-border">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-accent">
              Active Dining
            </span>
            <div className="text-xl font-bold font-mono text-accent mt-1">
              {tables.filter((t) => ["occupied", "ordering"].includes(t.status)).length}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-surface border border-border">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-400">
              Bill Requested
            </span>
            <div className="text-xl font-bold font-mono text-amber-400 mt-1">
              {tables.filter((t) => t.status === "bill_requested").length}
            </div>
          </div>
        </div>

        {/* Tables Grid (3D Perspective tilt feel) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 perspective-1000">
          {tables.map((table) => {
            const isAvailable = table.status === "available";
            const isBillRequested = table.status === "bill_requested";
            const isOrdering = table.status === "ordering";
            const tableOrders = orders.filter(
              (o) =>
                o.table_number.toLowerCase() === table.table_number.toLowerCase() &&
                !["COMPLETED", "CANCELLED"].includes(o.status)
            );

            const slugNumber = table.table_number.toLowerCase().replace(/\s+/g, "-");

            return (
              <div
                key={table.id}
                className={`relative flex flex-col justify-between rounded-xl p-4 border transition-all duration-300 hover:-translate-y-1 hover:shadow-card ${
                  isBillRequested
                    ? "bg-amber-950/20 border-amber-500/50 shadow-glow-gold"
                    : isOrdering
                    ? "bg-accent/10 border-accent/50 shadow-glow"
                    : isAvailable
                    ? "bg-surface border-border hover:border-border-strong"
                    : "bg-surface-elevated border-border-strong"
                }`}
              >
                <div>
                  {/* Top: Table Title & Capacity */}
                  <div className="flex items-center justify-between pb-2 border-b border-border">
                    <div>
                      <h3 className="font-mono font-bold text-base text-primary">
                        {table.table_number}
                      </h3>
                      <span className="text-[11px] text-primary-muted block">
                        {table.location}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-xs font-mono text-primary-muted bg-surface-elevated px-2 py-1 rounded border border-border">
                      <Users className="w-3 h-3" />
                      <span>{table.capacity}</span>
                    </div>
                  </div>

                  {/* Status Indicator */}
                  <div className="py-3 flex items-center justify-between">
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs font-mono font-semibold uppercase px-2 py-0.5 rounded ${
                        isAvailable
                          ? "bg-emerald-950/60 text-emerald-400 border border-emerald-500/30"
                          : isBillRequested
                          ? "bg-amber-950/80 text-amber-300 border border-amber-500/40 animate-pulse"
                          : "bg-accent/15 text-accent border border-accent/30"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isAvailable ? "bg-emerald-400" : isBillRequested ? "bg-amber-400" : "bg-accent"
                        }`}
                      />
                      {table.status.replace("_", " ")}
                    </span>

                    {tableOrders.length > 0 && (
                      <span className="text-xs font-mono font-bold text-accent">
                        {tableOrders.length} order active
                      </span>
                    )}
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-3 border-t border-border space-y-2">
                  {/* Change Status Fast Buttons */}
                  <div className="grid grid-cols-2 gap-1.5 text-[11px] font-mono">
                    {isAvailable ? (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(table.id, "occupied")}
                        className="w-full py-1.5 rounded bg-surface-elevated hover:bg-surface-hover border border-border text-primary text-center font-medium transition-colors"
                      >
                        Seat Guests
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(table.id, "available")}
                        className="w-full py-1.5 rounded bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-500/30 text-emerald-300 text-center font-medium transition-colors"
                      >
                        Release Table
                      </button>
                    )}

                    <Link
                      href={`/menu/casa-verde/${slugNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-1.5 rounded bg-surface-elevated hover:bg-surface-hover border border-border text-primary-muted hover:text-accent flex items-center justify-center gap-1 transition-colors"
                    >
                      <span>Menu</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Table Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-surface border border-border rounded-2xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-surface-elevated">
              <h3 className="font-semibold text-sm text-primary">Add Restaurant Table</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-7 h-7 rounded-full bg-surface hover:bg-surface-elevated text-primary-muted hover:text-primary flex items-center justify-center border border-border"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddTable} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-primary-muted mb-1">
                  Table Number / Name
                </label>
                <input
                  type="text"
                  required
                  value={tableNum}
                  onChange={(e) => setTableNum(e.target.value)}
                  placeholder="e.g. Table 11, Patio 02..."
                  className="w-full rounded-lg bg-surface-elevated border border-border px-3 py-2 text-primary focus:outline-none focus:border-accent font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-primary-muted mb-1">
                  Seating Capacity
                </label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  required
                  value={capacity}
                  onChange={(e) => setCapacity(Number(e.target.value))}
                  className="w-full rounded-lg bg-surface-elevated border border-border px-3 py-2 text-primary focus:outline-none focus:border-accent font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-primary-muted mb-1">
                  Floor Section / Location
                </label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full rounded-lg bg-surface-elevated border border-border px-3 py-2 text-primary focus:outline-none focus:border-accent"
                >
                  <option value="Main Courtyard">Main Courtyard</option>
                  <option value="Garden Patio">Garden Patio</option>
                  <option value="Mezzanine Lounge">Mezzanine Lounge</option>
                  <option value="Private Dining Room">Private Dining Room</option>
                  <option value="Bar High-Top">Bar High-Top</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-surface-elevated text-primary-muted hover:text-primary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-accent hover:bg-accent-hover text-primary-dark font-semibold font-mono"
                >
                  CONFIRM TABLE
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
