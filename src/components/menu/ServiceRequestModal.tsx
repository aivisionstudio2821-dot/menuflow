"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ServiceRequestType } from "@/lib/types";
import { useRestaurantStore } from "@/lib/store";
import { soundManager } from "@/lib/audio";
import {
  X,
  UserCheck,
  GlassWater,
  Receipt,
  HelpCircle,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

interface ServiceRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  tableNumber: string;
}

const REQUEST_OPTIONS: {
  type: ServiceRequestType;
  title: string;
  desc: string;
  icon: React.ElementType;
}[] = [
  {
    type: "WATER",
    title: "Request Fresh Water",
    desc: "Bottled mineral or regular drinking water",
    icon: GlassWater,
  },
  {
    type: "CALL_STAFF",
    title: "Call Waiter / Staff",
    desc: "Ask our floor captain to attend your table",
    icon: UserCheck,
  },
  {
    type: "BILL",
    title: "Request Final Bill",
    desc: "Prepare checkout invoice and payment terminal",
    icon: Receipt,
  },
  {
    type: "ASSISTANCE",
    title: "Special Assistance",
    desc: "Cutlery, condiments, high chair, or dietary queries",
    icon: HelpCircle,
  },
];

export function ServiceRequestModal({
  isOpen,
  onClose,
  tableNumber,
}: ServiceRequestModalProps) {
  const store = useRestaurantStore();
  const [selectedType, setSelectedType] = useState<ServiceRequestType | null>(null);
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (type: ServiceRequestType) => {
    soundManager.playServiceBell();
    store.createServiceRequest(tableNumber, type, note.trim() || undefined);
    setSubmitted(true);

    setTimeout(() => {
      setSubmitted(false);
      setSelectedType(null);
      setNote("");
      onClose();
    }, 1800);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm">
          {/* Backdrop */}
          <div className="absolute inset-0" onClick={onClose} />

          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 280 }}
            className="relative w-full max-w-md flex flex-col bg-surface border border-border rounded-t-2xl sm:rounded-2xl overflow-hidden shadow-2xl z-10"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-surface-elevated">
              <div>
                <h3 className="font-semibold text-sm text-primary">Table Assistance</h3>
                <p className="text-[11px] text-primary-muted">{tableNumber}</p>
              </div>
              <button
                onClick={onClose}
                className="w-7 h-7 rounded-full bg-surface hover:bg-surface-elevated text-primary-muted hover:text-primary flex items-center justify-center border border-border transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5">
              {submitted ? (
                <div className="py-8 flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-accent/15 border border-accent/30 text-accent flex items-center justify-center mb-3">
                    <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
                  </div>
                  <h4 className="text-base font-semibold text-primary">
                    Request Transmitted!
                  </h4>
                  <p className="text-xs text-primary-muted mt-1 max-w-xs">
                    Our floor team has been alerted for {tableNumber}. A server will attend to you shortly.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  <p className="text-xs text-primary-muted mb-2">
                    Select a service request below for instant staff notification:
                  </p>

                  {REQUEST_OPTIONS.map((opt) => {
                    const Icon = opt.icon;
                    return (
                      <button
                        key={opt.type}
                        type="button"
                        onClick={() => handleSubmit(opt.type)}
                        className="w-full flex items-center gap-3.5 p-3.5 rounded-xl bg-surface-elevated hover:bg-surface-hover border border-border hover:border-accent/50 text-left transition-all group"
                      >
                        <div className="w-9 h-9 rounded-lg bg-surface border border-border group-hover:border-accent/40 text-primary-muted group-hover:text-accent flex items-center justify-center transition-colors">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-xs font-semibold text-primary group-hover:text-accent transition-colors">
                            {opt.title}
                          </h4>
                          <p className="text-[11px] text-primary-muted mt-0.5">
                            {opt.desc}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
