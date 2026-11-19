"use client";

import React, { useState } from "react";
import { Header } from "@/components/dashboard/Header";
import { useRestaurantStore } from "@/lib/store";
import { ServiceRequest, ServiceRequestStatus } from "@/lib/types";
import { formatTime } from "@/lib/utils";
import { soundManager } from "@/lib/audio";
import {
  Bell,
  CheckCircle2,
  Clock,
  GlassWater,
  UserCheck,
  Receipt,
  HelpCircle,
  Volume2,
} from "lucide-react";

export default function ServiceRequestsPage() {
  const store = useRestaurantStore();
  const requests = store.getServiceRequests();

  const [filterStatus, setFilterStatus] = useState<"ALL" | "PENDING" | "COMPLETED">("PENDING");

  const filtered = requests.filter((r) => {
    if (filterStatus === "ALL") return true;
    if (filterStatus === "PENDING") return ["PENDING", "ACKNOWLEDGED"].includes(r.status);
    if (filterStatus === "COMPLETED") return r.status === "COMPLETED";
    return true;
  });

  const handleUpdateStatus = (id: string, status: ServiceRequestStatus) => {
    soundManager.playClick();
    store.updateServiceRequestStatus(id, status);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "WATER":
        return <GlassWater className="w-4 h-4 text-accent" />;
      case "BILL":
        return <Receipt className="w-4 h-4 text-champagne" />;
      case "CALL_STAFF":
        return <UserCheck className="w-4 h-4 text-emerald-400" />;
      default:
        return <HelpCircle className="w-4 h-4 text-primary-muted" />;
    }
  };

  return (
    <div className="flex-1 pb-16">
      <Header
        title="Live Service & Table Requests"
        subtitle="Floor call logs, waiter requests, water calls, and bill dispatches"
        actionButton={
          <button
            onClick={() => soundManager.playServiceBell()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-elevated hover:bg-surface-hover border border-border text-xs text-primary transition-colors"
          >
            <Volume2 className="w-3.5 h-3.5 text-accent" />
            <span>Test Bell Chime</span>
          </button>
        }
      />

      <div className="px-4 sm:px-8 py-6 space-y-6 max-w-5xl">
        {/* Status Filter */}
        <div className="flex items-center gap-2 border-b border-border pb-3">
          {[
            { id: "PENDING", label: "Active Attention Needed", count: requests.filter((r) => r.status !== "COMPLETED").length },
            { id: "ALL", label: "All Calls", count: requests.length },
            { id: "COMPLETED", label: "Resolved", count: requests.filter((r) => r.status === "COMPLETED").length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id as typeof filterStatus)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filterStatus === tab.id
                  ? "bg-accent text-primary-dark font-semibold shadow-sm"
                  : "bg-surface-elevated text-primary-muted hover:text-primary border border-border"
              }`}
            >
              <span>{tab.label}</span>
              <span className="font-mono text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-surface">
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Requests List */}
        {filtered.length === 0 ? (
          <div className="py-20 text-center text-primary-muted bg-surface rounded-2xl border border-border">
            <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-400/50" />
            <p className="text-sm">All floor service calls are resolved.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((req) => {
              const isPending = req.status === "PENDING";
              const isAck = req.status === "ACKNOWLEDGED";

              return (
                <div
                  key={req.id}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border transition-all ${
                    isPending
                      ? "bg-danger/10 border-danger/40 shadow-card animate-pulse"
                      : isAck
                      ? "bg-accent/10 border-accent/40"
                      : "bg-surface border-border text-primary-muted"
                  }`}
                >
                  <div className="flex items-start gap-3.5 mb-3 sm:mb-0">
                    <div className="w-10 h-10 rounded-xl bg-surface border border-border flex items-center justify-center flex-shrink-0">
                      {getIcon(req.request_type)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-primary">
                          {req.table_number}
                        </span>
                        <span className="text-xs font-semibold uppercase tracking-wider text-accent font-mono">
                          {req.request_type.replace("_", " ")}
                        </span>
                        <span className="text-[11px] text-primary-muted font-mono">
                          • {formatTime(req.created_at)}
                        </span>
                      </div>
                      <p className="text-xs text-primary-muted mt-0.5">
                        {req.note || "Guest tapped table assistance from digital menu"}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {isPending && (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(req.id, "ACKNOWLEDGED")}
                        className="px-3 py-1.5 rounded-lg bg-surface-elevated hover:bg-surface-hover border border-border text-xs text-primary font-medium transition-colors font-mono"
                      >
                        Acknowledge
                      </button>
                    )}

                    {req.status !== "COMPLETED" && (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(req.id, "COMPLETED")}
                        className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-primary-dark font-semibold text-xs transition-colors font-mono"
                      >
                        Mark Resolved
                      </button>
                    )}

                    {req.status === "COMPLETED" && (
                      <span className="text-xs font-mono text-emerald-400 flex items-center gap-1 font-semibold">
                        <CheckCircle2 className="w-4 h-4" />
                        Completed
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
