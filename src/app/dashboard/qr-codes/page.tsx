"use client";

import React, { useState, useEffect } from "react";
import QRCode from "qrcode";
import { Header } from "@/components/dashboard/Header";
import { useRestaurantStore } from "@/lib/store";
import { RestaurantTable } from "@/lib/types";
import {
  Download,
  Printer,
  Copy,
  ExternalLink,
  Check,
  Sparkles,
  QrCode as QrIcon,
} from "lucide-react";
import { soundManager } from "@/lib/audio";

export default function QrCodesStudioPage() {
  const store = useRestaurantStore();
  const tables = store.getTables();
  const restaurant = store.getRestaurant();

  const [origin, setOrigin] = useState("http://localhost:3000");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [qrDataUrls, setQrDataUrls] = useState<Record<string, string>>({});
  const [selectedTableForPrint, setSelectedTableForPrint] = useState<RestaurantTable | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  // Generate real QR code image data for each table
  useEffect(() => {
    async function generateAllQrs() {
      const urls: Record<string, string> = {};
      for (const table of tables) {
        const slug = table.table_number.toLowerCase().replace(/\s+/g, "-");
        const fullUrl = `${origin}/menu/${restaurant.slug}/${slug}`;
        try {
          const dataUrl = await QRCode.toDataURL(fullUrl, {
            width: 320,
            margin: 2,
            color: {
              dark: "#080A0C",
              light: "#FFFFFF",
            },
          });
          urls[table.id] = dataUrl;
        } catch (e) {
          console.error("QR Generation error:", e);
        }
      }
      setQrDataUrls(urls);
    }

    generateAllQrs();
  }, [tables, origin, restaurant.slug]);

  const handleCopyLink = (table: RestaurantTable) => {
    soundManager.playClick();
    const slug = table.table_number.toLowerCase().replace(/\s+/g, "-");
    const fullUrl = `${origin}/menu/${restaurant.slug}/${slug}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(table.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadQr = (table: RestaurantTable) => {
    soundManager.playClick();
    const dataUrl = qrDataUrls[table.id];
    if (!dataUrl) return;

    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `${restaurant.slug}-${table.table_number.replace(/\s+/g, "_")}-QR.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handlePrintCard = (table: RestaurantTable) => {
    setSelectedTableForPrint(table);
    setTimeout(() => {
      window.print();
    }, 150);
  };

  return (
    <div className="flex-1 pb-16">
      <Header
        title="QR Dining Studio"
        subtitle="Generate vector QR codes, table tents, and direct customer menu links"
        actionButton={
          <button
            onClick={() => {
              setSelectedTableForPrint(null);
              setTimeout(() => window.print(), 100);
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-surface-elevated hover:bg-surface-hover border border-border text-primary text-xs font-medium transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-accent" />
            <span>Print All Table Cards</span>
          </button>
        }
      />

      <div className="px-4 sm:px-8 py-6 space-y-6 max-w-7xl">
        {/* Banner Info */}
        <div className="p-4 rounded-xl bg-surface border border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-accent-subtle text-accent flex items-center justify-center">
              <QrIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-semibold text-primary">
                Instant Table Recognition
              </h3>
              <p className="text-[11px] text-primary-muted mt-0.5">
                Every table code opens the guest menu with table context pre-attached. No app install needed.
              </p>
            </div>
          </div>
          <span className="text-xs font-mono text-accent hidden sm:block">
            {tables.length} Active Codes
          </span>
        </div>

        {/* QR Table Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 perspective-1000">
          {tables.map((table) => {
            const qrImage = qrDataUrls[table.id];
            const slug = table.table_number.toLowerCase().replace(/\s+/g, "-");
            const targetUrl = `${origin}/menu/${restaurant.slug}/${slug}`;
            const isCopied = copiedId === table.id;

            return (
              <div
                key={table.id}
                className="group relative flex flex-col items-center rounded-2xl bg-surface border border-border p-5 text-center transition-all duration-300 hover:border-accent/40 hover:-translate-y-1 hover:shadow-card"
              >
                {/* Header Badge */}
                <div className="w-full flex items-center justify-between text-xs pb-3 border-b border-border">
                  <span className="font-mono font-bold text-sm text-primary">
                    {table.table_number}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-accent px-2 py-0.5 rounded bg-accent-subtle border border-accent/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                    QR ACTIVE
                  </span>
                </div>

                {/* QR Canvas Box (Light aesthetic container for scannability) */}
                <div className="my-5 p-3 rounded-xl bg-white shadow-xl relative border border-white/20 transition-transform group-hover:scale-105 duration-200">
                  {qrImage ? (
                    <img
                      src={qrImage}
                      alt={`QR Code for ${table.table_number}`}
                      className="w-36 h-36 object-contain"
                    />
                  ) : (
                    <div className="w-36 h-36 flex items-center justify-center text-black/50 text-xs font-mono">
                      Generating...
                    </div>
                  )}

                  {/* Center Brand Pill */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="px-2 py-0.5 rounded bg-surface border border-accent text-[9px] font-mono font-bold text-accent shadow-md">
                      MF
                    </span>
                  </div>
                </div>

                {/* Subtitle */}
                <p className="text-[11px] text-primary-muted font-mono truncate w-full mb-4">
                  {slug} • {table.location}
                </p>

                {/* Action Controls */}
                <div className="w-full grid grid-cols-3 gap-1.5 pt-3 border-t border-border text-xs">
                  <button
                    type="button"
                    onClick={() => handleDownloadQr(table)}
                    title="Download PNG"
                    className="flex flex-col items-center justify-center p-2 rounded-lg bg-surface-elevated hover:bg-surface-hover text-primary-muted hover:text-accent border border-border transition-colors text-[10px]"
                  >
                    <Download className="w-3.5 h-3.5 mb-1" />
                    <span>Download</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handlePrintCard(table)}
                    title="Print Table Tent"
                    className="flex flex-col items-center justify-center p-2 rounded-lg bg-surface-elevated hover:bg-surface-hover text-primary-muted hover:text-accent border border-border transition-colors text-[10px]"
                  >
                    <Printer className="w-3.5 h-3.5 mb-1" />
                    <span>Print Stand</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleCopyLink(table)}
                    title="Copy URL"
                    className="flex flex-col items-center justify-center p-2 rounded-lg bg-surface-elevated hover:bg-surface-hover text-primary-muted hover:text-accent border border-border transition-colors text-[10px]"
                  >
                    {isCopied ? (
                      <Check className="w-3.5 h-3.5 mb-1 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 mb-1" />
                    )}
                    <span>{isCopied ? "Copied" : "Copy Link"}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Printable Table Tent Cards for Physical Restaurant Display */}
      <div className="hidden print:block fixed inset-0 bg-white text-black p-8 font-sans">
        {(selectedTableForPrint ? [selectedTableForPrint] : tables).map((tbl) => (
          <div
            key={tbl.id}
            className="w-full max-w-sm mx-auto p-8 border-4 border-black text-center mb-8 break-inside-avoid page-break"
          >
            <h1 className="text-xl font-bold tracking-wider uppercase mb-1">
              {restaurant.name}
            </h1>
            <p className="text-xs text-gray-600 mb-4">{restaurant.tagline}</p>

            <div className="w-48 h-48 mx-auto p-2 border-2 border-black mb-4">
              {qrDataUrls[tbl.id] && (
                <img
                  src={qrDataUrls[tbl.id]}
                  alt="QR Code"
                  className="w-full h-full object-contain"
                />
              )}
            </div>

            <div className="text-2xl font-black font-mono tracking-widest uppercase mb-1">
              {tbl.table_number}
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-800">
              Scan with your phone camera to browse & order
            </p>
            <div className="text-[10px] text-gray-500 mt-4 border-t pt-2 font-mono">
              Powered by MenuFlow Digital Dining
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
