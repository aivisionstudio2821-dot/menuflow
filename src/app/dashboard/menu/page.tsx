"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { Header } from "@/components/dashboard/Header";
import { useRestaurantStore } from "@/lib/store";
import { MenuItem, MenuItemVariant, MenuItemAddon, Category } from "@/lib/types";
import { formatINR } from "@/lib/utils";
import { soundManager } from "@/lib/audio";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Star,
  Flame,
  Clock,
  Eye,
  EyeOff,
  Check,
  X,
  Upload,
} from "lucide-react";

export default function MenuManagementPage() {
  const store = useRestaurantStore();
  const categories = store.getCategories();
  const menuItems = store.getMenuItems();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCatId, setSelectedCatId] = useState<string>("ALL");
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [formName, setFormName] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formPrice, setFormPrice] = useState(250);
  const [formCategoryId, setFormCategoryId] = useState(categories[0]?.id || "");
  const [formImageUrl, setFormImageUrl] = useState("");
  const [formIsVeg, setFormIsVeg] = useState(true);
  const [formIsSpicy, setFormIsSpicy] = useState(false);
  const [formIsBestseller, setFormIsBestseller] = useState(false);
  const [formPrepTime, setFormPrepTime] = useState(12);

  const openCreateModal = () => {
    setEditingItem(null);
    setFormName("");
    setFormDesc("");
    setFormPrice(295);
    setFormCategoryId(categories[0]?.id || "");
    setFormImageUrl("https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&auto=format&fit=crop&q=80");
    setFormIsVeg(true);
    setFormIsSpicy(false);
    setFormIsBestseller(false);
    setFormPrepTime(12);
    setIsModalOpen(true);
  };

  const openEditModal = (item: MenuItem) => {
    setEditingItem(item);
    setFormName(item.name);
    setFormDesc(item.description);
    setFormPrice(item.price);
    setFormCategoryId(item.category_id);
    setFormImageUrl(item.image_url);
    setFormIsVeg(item.is_vegetarian);
    setFormIsSpicy(item.is_spicy);
    setFormIsBestseller(item.is_bestseller);
    setFormPrepTime(item.preparation_time_mins || 12);
    setIsModalOpen(true);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    soundManager.playClick();

    if (editingItem) {
      store.updateMenuItem(editingItem.id, {
        name: formName,
        description: formDesc,
        price: Number(formPrice),
        category_id: formCategoryId,
        image_url: formImageUrl,
        is_vegetarian: formIsVeg,
        is_spicy: formIsSpicy,
        is_bestseller: formIsBestseller,
        preparation_time_mins: Number(formPrepTime),
      });
    } else {
      store.addMenuItem({
        restaurant_id: store.getRestaurant().id,
        category_id: formCategoryId,
        name: formName,
        description: formDesc,
        price: Number(formPrice),
        image_url: formImageUrl,
        is_vegetarian: formIsVeg,
        is_vegan: false,
        is_spicy: formIsSpicy,
        spice_level: formIsSpicy ? 2 : 0,
        is_bestseller: formIsBestseller,
        is_available: true,
        preparation_time_mins: Number(formPrepTime),
        sort_order: menuItems.length + 1,
      });
    }

    setIsModalOpen(false);
  };

  const handleToggleAvailable = (item: MenuItem) => {
    soundManager.playClick();
    store.updateMenuItem(item.id, { is_available: !item.is_available });
  };

  const handleDeleteItem = (id: string) => {
    if (confirm("Delete this menu item?")) {
      soundManager.playClick();
      store.deleteMenuItem(id);
    }
  };

  // Filtered items
  const filteredItems = useMemo(() => {
    return menuItems.filter((i) => {
      if (selectedCatId !== "ALL" && i.category_id !== selectedCatId) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return i.name.toLowerCase().includes(q) || i.description.toLowerCase().includes(q);
      }
      return true;
    });
  }, [menuItems, selectedCatId, searchQuery]);

  return (
    <div className="flex-1 pb-16">
      <Header
        title="Menu Items Studio"
        subtitle="Manage dishes, variants, pricing, dietary flags, and kitchen inventory"
        actionButton={
          <button
            onClick={openCreateModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-accent hover:bg-accent-hover text-primary-dark font-semibold text-xs transition-colors shadow-glow"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add New Dish</span>
          </button>
        }
      />

      <div className="px-4 sm:px-8 py-6 space-y-6 max-w-7xl">
        {/* Search & Category Filter */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-muted" />
            <input
              type="text"
              placeholder="Search dishes by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface border border-border rounded-xl pl-9 pr-4 py-2 text-xs text-primary placeholder:text-primary-muted/60 focus:outline-none focus:border-accent"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            <button
              onClick={() => setSelectedCatId("ALL")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedCatId === "ALL"
                  ? "bg-accent text-primary-dark font-semibold shadow-sm"
                  : "bg-surface-elevated text-primary-muted hover:text-primary border border-border"
              }`}
            >
              All ({menuItems.length})
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCatId(c.id)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedCatId === c.id
                    ? "bg-accent text-primary-dark font-semibold shadow-sm"
                    : "bg-surface-elevated text-primary-muted hover:text-primary border border-border"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Items Table / Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => {
            const category = categories.find((c) => c.id === item.category_id);

            return (
              <div
                key={item.id}
                className={`relative flex flex-col justify-between rounded-xl bg-surface border p-4 transition-all duration-200 ${
                  !item.is_available ? "opacity-60 border-dashed" : "border-border hover:border-border-strong"
                }`}
              >
                <div>
                  <div className="flex gap-3">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-surface-elevated border border-border flex-shrink-0">
                      <Image
                        src={item.image_url}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-1">
                        {item.is_vegetarian ? (
                          <span className="w-3.5 h-3.5 rounded-sm border border-emerald-500 flex items-center justify-center p-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          </span>
                        ) : (
                          <span className="w-3.5 h-3.5 rounded-sm border border-rose-500 flex items-center justify-center p-0.5">
                            <span className="w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-b-[5px] border-b-rose-500" />
                          </span>
                        )}

                        {item.is_bestseller && (
                          <span className="text-[10px] text-champagne bg-champagne-subtle px-1.5 py-0.2 rounded font-medium border border-champagne/20">
                            Star
                          </span>
                        )}

                        {item.is_spicy && (
                          <span className="text-[10px] text-danger bg-danger-subtle px-1.5 py-0.2 rounded font-medium border border-danger/20">
                            Spicy
                          </span>
                        )}
                      </div>

                      <h4 className="text-sm font-semibold text-primary truncate">
                        {item.name}
                      </h4>
                      <span className="text-[11px] text-primary-muted block truncate">
                        {category?.name || "General"}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-primary-muted mt-2.5 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="flex items-center justify-between mt-3 text-xs">
                    <span className="font-mono font-bold text-accent text-sm">
                      {formatINR(item.price)}
                    </span>
                    <span className="text-primary-muted flex items-center gap-1 text-[11px]">
                      <Clock className="w-3 h-3" />
                      {item.preparation_time_mins}m
                    </span>
                  </div>
                </div>

                {/* Card footer controls */}
                <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs">
                  {/* Availability Toggle */}
                  <button
                    type="button"
                    onClick={() => handleToggleAvailable(item)}
                    className={`flex items-center gap-1 text-[11px] font-mono px-2 py-1 rounded transition-colors ${
                      item.is_available
                        ? "bg-emerald-950/60 text-emerald-400 border border-emerald-500/30"
                        : "bg-surface text-primary-muted border border-border"
                    }`}
                  >
                    {item.is_available ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    <span>{item.is_available ? "In Stock" : "Sold Out"}</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => openEditModal(item)}
                      className="p-1.5 rounded-lg bg-surface-elevated hover:bg-surface-hover text-primary-muted hover:text-accent border border-border transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteItem(item.id)}
                      className="p-1.5 rounded-lg bg-surface-elevated hover:bg-surface-hover text-primary-muted hover:text-danger border border-border transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-surface border border-border rounded-2xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-surface-elevated">
              <h3 className="font-semibold text-sm text-primary">
                {editingItem ? "Edit Dish" : "Create New Dish"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-7 h-7 rounded-full bg-surface hover:bg-surface-elevated text-primary-muted hover:text-primary flex items-center justify-center border border-border"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto no-scrollbar text-xs">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-primary-muted mb-1">
                  Dish Name
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Birria Tacos Con Consomé"
                  className="w-full rounded-lg bg-surface-elevated border border-border px-3 py-2 text-primary focus:outline-none focus:border-accent"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-primary-muted mb-1">
                    Price (₹ INR)
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="w-full rounded-lg bg-surface-elevated border border-border px-3 py-2 text-primary focus:outline-none focus:border-accent font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-primary-muted mb-1">
                    Category
                  </label>
                  <select
                    value={formCategoryId}
                    onChange={(e) => setFormCategoryId(e.target.value)}
                    className="w-full rounded-lg bg-surface-elevated border border-border px-3 py-2 text-primary focus:outline-none focus:border-accent"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-primary-muted mb-1">
                  Description
                </label>
                <textarea
                  required
                  rows={2}
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Appetizing description of ingredients and culinary preparation..."
                  className="w-full rounded-lg bg-surface-elevated border border-border px-3 py-2 text-primary focus:outline-none focus:border-accent resize-none"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-primary-muted mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  required
                  value={formImageUrl}
                  onChange={(e) => setFormImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full rounded-lg bg-surface-elevated border border-border px-3 py-2 text-primary focus:outline-none focus:border-accent font-mono text-[11px]"
                />
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-3 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setFormIsVeg(!formIsVeg)}
                  className={`p-2.5 rounded-lg border text-center transition-all ${
                    formIsVeg
                      ? "bg-emerald-950/50 border-emerald-500/50 text-emerald-400 font-semibold"
                      : "bg-rose-950/50 border-rose-500/50 text-rose-400 font-semibold"
                  }`}
                >
                  {formIsVeg ? "Vegetarian" : "Non-Veg"}
                </button>

                <button
                  type="button"
                  onClick={() => setFormIsSpicy(!formIsSpicy)}
                  className={`p-2.5 rounded-lg border text-center transition-all ${
                    formIsSpicy
                      ? "bg-danger/15 border-danger/50 text-danger font-semibold"
                      : "bg-surface-elevated border-border text-primary-muted"
                  }`}
                >
                  {formIsSpicy ? "🔥 Spicy" : "Mild"}
                </button>

                <button
                  type="button"
                  onClick={() => setFormIsBestseller(!formIsBestseller)}
                  className={`p-2.5 rounded-lg border text-center transition-all ${
                    formIsBestseller
                      ? "bg-champagne/15 border-champagne/50 text-champagne font-semibold"
                      : "bg-surface-elevated border-border text-primary-muted"
                  }`}
                >
                  {formIsBestseller ? "⭐ Bestseller" : "Standard"}
                </button>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-surface-elevated text-primary-muted hover:text-primary transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-accent hover:bg-accent-hover text-primary-dark font-semibold transition-colors font-mono"
                >
                  SAVE DISH
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
