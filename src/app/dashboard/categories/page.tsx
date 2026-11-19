"use client";

import React, { useState } from "react";
import { Header } from "@/components/dashboard/Header";
import { useRestaurantStore } from "@/lib/store";
import { Category } from "@/lib/types";
import { soundManager } from "@/lib/audio";
import {
  Plus,
  Edit2,
  Trash2,
  Layers,
  ArrowUp,
  ArrowDown,
  X,
  Check,
} from "lucide-react";

export default function CategoriesPage() {
  const store = useRestaurantStore();
  const categories = store.getCategories();
  const menuItems = store.getMenuItems();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");

  const openCreate = () => {
    setEditingCat(null);
    setName("");
    setDesc("");
    setIsModalOpen(true);
  };

  const openEdit = (cat: Category) => {
    setEditingCat(cat);
    setName(cat.name);
    setDesc(cat.description || "");
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    soundManager.playClick();

    if (editingCat) {
      store.updateCategory(editingCat.id, { name, description: desc });
    } else {
      store.addCategory({
        restaurant_id: store.getRestaurant().id,
        name,
        description: desc,
        sort_order: categories.length + 1,
        is_active: true,
      });
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this category? Items in this category will remain.")) {
      soundManager.playClick();
      store.deleteCategory(id);
    }
  };

  return (
    <div className="flex-1 pb-16">
      <Header
        title="Category Architecture"
        subtitle="Organize your menu navigation, courses, and visual flow"
        actionButton={
          <button
            onClick={openCreate}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-accent hover:bg-accent-hover text-primary-dark font-semibold text-xs transition-colors shadow-glow"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Category</span>
          </button>
        }
      />

      <div className="px-4 sm:px-8 py-6 space-y-4 max-w-4xl">
        <div className="space-y-3">
          {categories.map((cat, idx) => {
            const count = menuItems.filter((i) => i.category_id === cat.id).length;

            return (
              <div
                key={cat.id}
                className="flex items-center justify-between p-4 rounded-xl bg-surface border border-border hover:border-border-strong transition-all"
              >
                <div className="flex items-center gap-3.5">
                  <span className="w-6 text-center font-mono text-xs font-bold text-accent">
                    {idx + 1}
                  </span>
                  <div className="w-9 h-9 rounded-lg bg-surface-elevated border border-border flex items-center justify-center text-primary-muted">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-primary">{cat.name}</h4>
                    {cat.description && (
                      <p className="text-xs text-primary-muted mt-0.5">{cat.description}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-xs font-mono text-primary-muted bg-surface-elevated px-2.5 py-1 rounded-md border border-border">
                    {count} {count === 1 ? "dish" : "dishes"}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => openEdit(cat)}
                      className="p-1.5 rounded-lg bg-surface-elevated hover:bg-surface-hover text-primary-muted hover:text-accent border border-border transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(cat.id)}
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

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-surface border border-border rounded-2xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-surface-elevated">
              <h3 className="font-semibold text-sm text-primary">
                {editingCat ? "Edit Category" : "Add Category"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-7 h-7 rounded-full bg-surface hover:bg-surface-elevated text-primary-muted hover:text-primary flex items-center justify-center border border-border"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-primary-muted mb-1">
                  Category Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Artisanal Tacos, Wood-Fired Pizzas..."
                  className="w-full rounded-lg bg-surface-elevated border border-border px-3 py-2 text-primary focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-primary-muted mb-1">
                  Tagline / Description (Optional)
                </label>
                <input
                  type="text"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="e.g. Slow cooked meats & handcrafted heirloom masa"
                  className="w-full rounded-lg bg-surface-elevated border border-border px-3 py-2 text-primary focus:outline-none focus:border-accent"
                />
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
                  SAVE CATEGORY
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
