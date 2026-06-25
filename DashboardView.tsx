import React, { useState } from "react";
import { motion } from "motion/react";
import { TrendingUp, Package, Users, DollarSign, Plus, RefreshCw, CheckCircle2, AlertTriangle } from "lucide-react";
import { Product } from "../types";

interface DashboardViewProps {
  products: Product[];
  orders: any[];
  onUpdateStock: (productId: string, newStock: number) => void;
  onUpdatePrice: (productId: string, newPrice: number) => void;
  onAddProduct: (product: Omit<Product, "rating" | "ratingCount">) => void;
}

export default function DashboardView({
  products,
  orders,
  onUpdateStock,
  onUpdatePrice,
  onAddProduct,
}: DashboardViewProps) {
  // Stats definitions
  const totalOrders = 124 + orders.length;
  const initialRevenue = 18450;
  const newOrdersRevenue = orders.reduce((acc, order) => acc + order.total, 0);
  const totalRevenue = initialRevenue + newOrdersRevenue;

  // Local state for adding product
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProd, setNewProd] = useState({
    name: "",
    description: "",
    price: 99,
    category: "Workspace",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=1000",
    stock: 20,
    features: ["Premium quality component", "Designed for maximum utility"],
    colors: "Alabaster White, Charcoal Black",
  });

  const [editStates, setEditStates] = useState<Record<string, { stock: number; price: number }>>({});

  const handleEditChange = (productId: string, field: "stock" | "price", value: number) => {
    setEditStates((prev) => {
      const current = prev[productId] || {
        stock: products.find((p) => p.id === productId)?.stock || 0,
        price: products.find((p) => p.id === productId)?.price || 0,
      };
      return {
        ...prev,
        [productId]: {
          ...current,
          [field]: value,
        },
      };
    });
  };

  const handleSaveEdits = (productId: string) => {
    const edits = editStates[productId];
    if (!edits) return;
    onUpdateStock(productId, edits.stock);
    onUpdatePrice(productId, edits.price);
    alert("Product details updated successfully!");
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProd.name || !newProd.description) return;

    const formattedColors = newProd.colors.split(",").map((c) => c.trim());
    onAddProduct({
      id: `prod-${Date.now()}`,
      name: newProd.name,
      description: newProd.description,
      price: Number(newProd.price),
      category: newProd.category,
      image: newProd.image,
      stock: Number(newProd.stock),
      features: newProd.features,
      specifications: {
        "Casing": "Anodized Finish",
        "Warranty": "1 Year",
      },
      colors: formattedColors,
    });

    setShowAddForm(false);
    setNewProd({
      name: "",
      description: "",
      price: 99,
      category: "Workspace",
      image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=1000",
      stock: 20,
      features: ["Premium quality component", "Designed for maximum utility"],
      colors: "Alabaster White, Charcoal Black",
    });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8" id="merchant-hub-view">
      {/* Title block */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-neutral-100 pb-5">
        <div>
          <h2 className="font-sans text-2xl font-semibold tracking-tight text-neutral-900">Merchant Operations Hub</h2>
          <p className="mt-1 text-sm text-neutral-500">Analyze real-time order streams, adjust item inventories, and audit product margins.</p>
        </div>
        <button
          id="btn-add-product-toggle"
          onClick={() => setShowAddForm(!showAddForm)}
          className="mt-4 md:mt-0 flex items-center space-x-1.5 rounded-xl bg-neutral-900 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-neutral-800 transition-all active:scale-95"
        >
          <Plus className="h-4 w-4" />
          <span>Add Custom Listing</span>
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Rev */}
        <div className="rounded-2xl border border-neutral-100 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-bold uppercase tracking-wider">Gross Revenue</span>
            <DollarSign className="h-5 w-5 text-neutral-950" />
          </div>
          <p className="mt-2.5 font-mono text-2xl font-bold text-neutral-900">${totalRevenue.toLocaleString()}</p>
          <span className="mt-1.5 inline-flex items-center text-[10px] font-semibold text-emerald-600 bg-emerald-50 rounded px-1.5 py-0.5">
            +18.4% this month
          </span>
        </div>

        {/* Orders */}
        <div className="rounded-2xl border border-neutral-100 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-bold uppercase tracking-wider">Orders Audited</span>
            <Package className="h-5 w-5 text-neutral-950" />
          </div>
          <p className="mt-2.5 font-mono text-2xl font-bold text-neutral-900">{totalOrders}</p>
          <span className="mt-1.5 inline-flex items-center text-[10px] font-semibold text-emerald-600 bg-emerald-50 rounded px-1.5 py-0.5">
            +6.2% conversions
          </span>
        </div>

        {/* Avg Value */}
        <div className="rounded-2xl border border-neutral-100 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-bold uppercase tracking-wider">Avg Order Value</span>
            <TrendingUp className="h-5 w-5 text-neutral-950" />
          </div>
          <p className="mt-2.5 font-mono text-2xl font-bold text-neutral-900">${Math.round(totalRevenue / totalOrders)}</p>
          <span className="mt-1.5 inline-flex items-center text-[10px] font-semibold text-neutral-500 bg-neutral-100 rounded px-1.5 py-0.5">
            Steady Basket
          </span>
        </div>

        {/* Stock Alert */}
        <div className="rounded-2xl border border-neutral-100 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-bold uppercase tracking-wider">Low Stock Warnings</span>
            <AlertTriangle className="h-5 w-5 text-amber-500" />
          </div>
          <p className="mt-2.5 font-mono text-2xl font-bold text-neutral-900">
            {products.filter((p) => p.stock <= 10).length}
          </p>
          <span className="mt-1.5 inline-flex items-center text-[10px] font-semibold text-amber-600 bg-amber-50 rounded px-1.5 py-0.5">
            Requires restocking
          </span>
        </div>
      </div>

      {/* Add Product Form Overlay Modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto" id="add-product-modal">
          <div className="fixed inset-0 bg-neutral-900/50 backdrop-blur-xs" onClick={() => setShowAddForm(false)} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative z-10 w-full max-w-lg bg-white rounded-2xl border border-neutral-100 p-6 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <h3 className="font-sans text-lg font-semibold text-neutral-900">Publish New Listing</h3>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400">Product Title</label>
                <input
                  type="text"
                  required
                  value={newProd.name}
                  onChange={(e) => setNewProd({ ...newProd, name: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-neutral-200 p-2 text-sm outline-none bg-neutral-50"
                  placeholder="E.g. Lunar Leather Coaster"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400">Description</label>
                <textarea
                  required
                  rows={3}
                  value={newProd.description}
                  onChange={(e) => setNewProd({ ...newProd, description: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-neutral-200 p-2 text-sm outline-none bg-neutral-50"
                  placeholder="Write an elegant description..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400">Price ($)</label>
                  <input
                    type="number"
                    required
                    value={newProd.price}
                    onChange={(e) => setNewProd({ ...newProd, price: Number(e.target.value) })}
                    className="mt-1 w-full rounded-lg border border-neutral-200 p-2 text-sm outline-none bg-neutral-50"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400">Opening Stock</label>
                  <input
                    type="number"
                    required
                    value={newProd.stock}
                    onChange={(e) => setNewProd({ ...newProd, stock: Number(e.target.value) })}
                    className="mt-1 w-full rounded-lg border border-neutral-200 p-2 text-sm outline-none bg-neutral-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400">Category</label>
                  <select
                    value={newProd.category}
                    onChange={(e) => setNewProd({ ...newProd, category: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-neutral-200 p-2 text-sm outline-none bg-neutral-50"
                  >
                    <option>Workspace</option>
                    <option>Audio</option>
                    <option>Lifestyle</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400">Colors (comma separated)</label>
                  <input
                    type="text"
                    value={newProd.colors}
                    onChange={(e) => setNewProd({ ...newProd, colors: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-neutral-200 p-2 text-sm outline-none bg-neutral-50"
                    placeholder="Alabaster, Charcoal"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400">Image URL</label>
                <input
                  type="text"
                  value={newProd.image}
                  onChange={(e) => setNewProd({ ...newProd, image: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-neutral-200 p-2 text-sm outline-none bg-neutral-50"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="rounded-lg border border-neutral-200 px-4 py-2 text-xs font-semibold text-neutral-600 hover:bg-neutral-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-neutral-900 px-4 py-2 text-xs font-semibold text-white hover:bg-neutral-800"
                >
                  Publish Listing
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Analytics Chart & Inventory Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Custom SVG Analytics Chart */}
        <div className="lg:col-span-4 rounded-2xl border border-neutral-100 bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-sans text-sm font-semibold text-neutral-900 uppercase tracking-wider">Performance Trends</h3>
            <p className="mt-0.5 text-xs text-neutral-400">Monthly gross sales analytics (6 months).</p>
          </div>

          {/* SVG Line & Area Graph */}
          <div className="my-6 relative h-48 w-full flex items-end">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 300 120">
              {/* Horizontal grid lines */}
              <line x1="0" y1="20" x2="300" y2="20" stroke="#f4f4f5" strokeWidth="1" strokeDasharray="3" />
              <line x1="0" y1="60" x2="300" y2="60" stroke="#f4f4f5" strokeWidth="1" strokeDasharray="3" />
              <line x1="0" y1="100" x2="300" y2="100" stroke="#f4f4f5" strokeWidth="1" strokeDasharray="3" />

              {/* Area path */}
              <path
                d="M 10 100 Q 60 70 110 80 T 210 30 T 290 15 L 290 110 L 10 110 Z"
                fill="url(#chartGrad)"
                opacity="0.35"
              />

              {/* Line path */}
              <path
                d="M 10 100 Q 60 70 110 80 T 210 30 T 290 15"
                fill="none"
                stroke="#171717"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Data points */}
              <circle cx="10" cy="100" r="3.5" fill="#171717" />
              <circle cx="110" cy="80" r="3.5" fill="#171717" />
              <circle cx="210" cy="30" r="3.5" fill="#171717" />
              <circle cx="290" cy="15" r="3.5" fill="#171717" />

              {/* Gradients */}
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#171717" />
                  <stop offset="100%" stopColor="#ffffff" />
                </linearGradient>
              </defs>
            </svg>

            {/* Float values */}
            <span className="absolute top-1 right-2 font-mono text-[10px] font-bold text-neutral-800">$24,450 (Current)</span>
            <span className="absolute bottom-1.5 left-2 font-mono text-[10px] text-neutral-400">$10,000 (Jan)</span>
          </div>

          <div className="border-t border-neutral-50 pt-3 flex items-center justify-between text-xs font-semibold text-neutral-700">
            <span>Overall Margin</span>
            <span className="font-mono text-emerald-600">62.8%</span>
          </div>
        </div>

        {/* Right Column: Inventory Management Table */}
        <div className="lg:col-span-8 rounded-2xl border border-neutral-100 bg-white p-6 shadow-xs space-y-4">
          <div>
            <h3 className="font-sans text-sm font-semibold text-neutral-900 uppercase tracking-wider">Live Inventory Controls</h3>
            <p className="mt-0.5 text-xs text-neutral-400">Instantly adjust product retail pricing and replenish stocks dynamically.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-neutral-100 text-[10px] font-bold uppercase tracking-wider text-neutral-400 bg-neutral-50/50">
                  <th className="py-2.5 px-3">Product Name</th>
                  <th className="py-2.5 px-3 text-center">Category</th>
                  <th className="py-2.5 px-3">Stock Level</th>
                  <th className="py-2.5 px-3">Pricing ($)</th>
                  <th className="py-2.5 px-3 text-right">Commit Changes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
                {products.map((p) => {
                  const state = editStates[p.id] || { stock: p.stock, price: p.price };
                  return (
                    <tr key={p.id} className="hover:bg-neutral-50/50">
                      <td className="py-3 px-3 font-medium text-neutral-900">
                        <div className="flex items-center space-x-2">
                          <img src={p.image} alt={p.name} className="h-7 w-7 rounded bg-neutral-50 object-cover" />
                          <span className="truncate max-w-[150px]">{p.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center text-neutral-500 font-mono text-[10px]">{p.category}</td>
                      <td className="py-3 px-3">
                        <input
                          type="number"
                          id={`input-stock-${p.id}`}
                          value={state.stock}
                          onChange={(e) => handleEditChange(p.id, "stock", Number(e.target.value))}
                          className="w-16 rounded border border-neutral-200 px-1.5 py-1 text-center font-mono outline-none focus:border-neutral-950 bg-neutral-50/50"
                        />
                      </td>
                      <td className="py-3 px-3">
                        <input
                          type="number"
                          id={`input-price-${p.id}`}
                          value={state.price}
                          onChange={(e) => handleEditChange(p.id, "price", Number(e.target.value))}
                          className="w-16 rounded border border-neutral-200 px-1.5 py-1 text-center font-mono outline-none focus:border-neutral-950 bg-neutral-50/50"
                        />
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          id={`btn-save-inv-${p.id}`}
                          onClick={() => handleSaveEdits(p.id)}
                          disabled={state.stock === p.stock && state.price === p.price}
                          className={`rounded px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider transition-all border ${
                            state.stock === p.stock && state.price === p.price
                              ? "border-neutral-100 bg-white text-neutral-300 cursor-not-allowed"
                              : "border-neutral-900 bg-neutral-900 text-white hover:bg-neutral-800 active:scale-95 cursor-pointer"
                          }`}
                        >
                          Save
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
