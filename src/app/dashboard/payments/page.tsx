"use client";

import React, { useState } from "react";
import { Header } from "@/components/dashboard/Header";
import { useRestaurantStore } from "@/lib/store";
import { Order, PaymentStatus } from "@/lib/types";
import { formatINR, formatDateTime, formatTime } from "@/lib/utils";
import { soundManager } from "@/lib/audio";
import {
  CreditCard,
  Printer,
  CheckCircle2,
  Clock,
  ShieldCheck,
  FileText,
  Smartphone,
  Banknote,
  Search,
  ExternalLink,
} from "lucide-react";

export default function PaymentsAndInvoicesPage() {
  const store = useRestaurantStore();
  const restaurant = store.getRestaurant();
  const settings = store.getSettings();
  const orders = store.getOrders();

  const [selectedInvoice, setSelectedInvoice] = useState<Order | null>(null);
  const [filterMode, setFilterMode] = useState<"ALL" | "PAID" | "PENDING">("ALL");

  const totalCollected = orders
    .filter((o) => o.payment_status === "PAID")
    .reduce((sum, o) => sum + o.total_amount, 0);

  const pendingCollection = orders
    .filter((o) => o.payment_status === "PENDING")
    .reduce((sum, o) => sum + o.total_amount, 0);

  const filteredOrders = orders.filter((o) => {
    if (filterMode === "ALL") return true;
    return o.payment_status === filterMode;
  });

  const handleMarkPaid = (orderId: string) => {
    soundManager.playClick();
    store.updatePaymentStatus(orderId, "PAID");
  };

  const handlePrint = (order: Order) => {
    setSelectedInvoice(order);
    setTimeout(() => {
      window.print();
    }, 150);
  };

  return (
    <div className="flex-1 pb-16">
      <Header
        title="Payments & GST Tax Invoices"
        subtitle="Razorpay India gateway transactions, UPI reconciliation, and printable tax receipts"
      />

      <div className="px-4 sm:px-8 py-6 space-y-6 max-w-7xl">
        {/* KPI Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-xl bg-surface border border-border">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              Total Realized Revenue
            </span>
            <div className="text-2xl font-bold font-mono text-primary mt-2">
              {formatINR(totalCollected)}
            </div>
            <p className="text-[11px] text-primary-muted mt-1">
              Settled via UPI, Cards, Netbanking
            </p>
          </div>

          <div className="p-5 rounded-xl bg-surface border border-border">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
              Pending Table Settlements
            </span>
            <div className="text-2xl font-bold font-mono text-amber-400 mt-2">
              {formatINR(pendingCollection)}
            </div>
            <p className="text-[11px] text-primary-muted mt-1">
              Cash on table / awaiting customer UPI
            </p>
          </div>

          <div className="p-5 rounded-xl bg-surface border border-border">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary-muted">
              Gateway Integration
            </span>
            <div className="flex items-center gap-2 mt-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span className="text-base font-semibold text-primary">Razorpay Ready</span>
            </div>
            <p className="text-[11px] text-primary-muted mt-1">
              Test Mode active • Key: {settings.razorpay_key_id}
            </p>
          </div>
        </div>

        {/* Invoices Table */}
        <div className="rounded-xl bg-surface border border-border overflow-hidden">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h3 className="text-sm font-semibold text-primary">
              Transactions & Invoices Log
            </h3>

            <div className="flex items-center gap-2">
              {(["ALL", "PAID", "PENDING"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setFilterMode(mode)}
                  className={`px-3 py-1 rounded-md text-xs font-mono font-medium transition-all ${
                    filterMode === mode
                      ? "bg-accent text-primary-dark font-semibold"
                      : "text-primary-muted hover:text-primary"
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-elevated text-primary-muted uppercase tracking-wider text-[11px] font-mono border-b border-border">
                <tr>
                  <th className="py-3 px-4">Invoice / Order</th>
                  <th className="py-3 px-4">Table & Guest</th>
                  <th className="py-3 px-4">Payment Method</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Total Amount</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredOrders.map((order) => {
                  const isPaid = order.payment_status === "PAID";

                  return (
                    <tr key={order.id} className="hover:bg-surface-elevated/50 transition-colors">
                      <td className="py-3.5 px-4 font-mono">
                        <span className="font-bold text-primary block">
                          {order.order_number}
                        </span>
                        <span className="text-[11px] text-primary-muted">
                          {formatDateTime(order.created_at)}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-primary block">
                          {order.table_number}
                        </span>
                        <span className="text-[11px] text-primary-muted">
                          {order.customer_name || "Guest"}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 font-mono">
                          {order.payment_method === "UPI" ? (
                            <Smartphone className="w-3.5 h-3.5 text-accent" />
                          ) : order.payment_method === "CARDS" ? (
                            <CreditCard className="w-3.5 h-3.5 text-primary" />
                          ) : (
                            <Banknote className="w-3.5 h-3.5 text-amber-400" />
                          )}
                          <span>{order.payment_method}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                            isPaid
                              ? "bg-emerald-950/60 text-emerald-400 border border-emerald-500/30"
                              : "bg-amber-950/60 text-amber-300 border border-amber-500/30 animate-pulse"
                          }`}
                        >
                          {order.payment_status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono font-bold text-primary">
                        {formatINR(order.total_amount)}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {!isPaid && (
                            <button
                              type="button"
                              onClick={() => handleMarkPaid(order.id)}
                              className="px-2.5 py-1 rounded bg-emerald-500 hover:bg-emerald-400 text-primary-dark font-mono font-bold text-[10px] transition-colors"
                            >
                              Collect
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handlePrint(order)}
                            className="p-1.5 rounded bg-surface-elevated hover:bg-surface-hover text-primary-muted hover:text-accent border border-border transition-colors"
                            title="Print GST Invoice"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Printable GST Tax Invoice Template */}
      {selectedInvoice && (
        <div className="hidden print:block fixed inset-0 bg-white text-black p-8 font-mono text-xs">
          <div className="text-center pb-3 border-b-2 border-black">
            <h1 className="text-lg font-bold uppercase">{restaurant.name}</h1>
            <p className="text-xs">{restaurant.address}, {restaurant.city} - {restaurant.postal_code}</p>
            <p className="text-xs">GSTIN: 29AAAAA0000A1Z5 • FSSAI: 11223344556677</p>
            <h2 className="text-sm font-bold mt-2">TAX INVOICE / BILL OF SUPPLY</h2>
          </div>

          <div className="py-3 flex justify-between border-b border-black text-xs">
            <div>
              <p>Invoice: INV-{selectedInvoice.order_number}</p>
              <p>Table: {selectedInvoice.table_number}</p>
              <p>Guest: {selectedInvoice.customer_name || "Guest"}</p>
            </div>
            <div className="text-right">
              <p>Date: {formatDateTime(selectedInvoice.created_at)}</p>
              <p>Payment: {selectedInvoice.payment_method} ({selectedInvoice.payment_status})</p>
            </div>
          </div>

          <div className="py-4 space-y-2 border-b border-black">
            {selectedInvoice.items.map((item, idx) => (
              <div key={idx} className="flex justify-between">
                <span>{item.quantity}x {item.item_name}</span>
                <span>{formatINR(item.total_price)}</span>
              </div>
            ))}
          </div>

          <div className="py-3 space-y-1 text-right text-xs">
            <p>Item Subtotal: {formatINR(selectedInvoice.subtotal)}</p>
            {selectedInvoice.discount_amount > 0 && (
              <p>Special Discount: -{formatINR(selectedInvoice.discount_amount)}</p>
            )}
            <p>CGST @ 2.5%: {formatINR(selectedInvoice.tax_amount / 2)}</p>
            <p>SGST @ 2.5%: {formatINR(selectedInvoice.tax_amount / 2)}</p>
            <p>Service Fee: {formatINR(selectedInvoice.service_charge)}</p>
            <p className="text-sm font-bold pt-1 border-t border-black">
              GRAND TOTAL: {formatINR(selectedInvoice.total_amount)}
            </p>
          </div>

          <div className="text-center pt-6 text-[11px]">
            <p>Thank you for dining with {restaurant.name}!</p>
            <p>Powered by MenuFlow Digital Dining Platform</p>
          </div>
        </div>
      )}
    </div>
  );
}
