import React, { useState, useEffect, useTransition } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, SlidersHorizontal, ArrowUpDown, Sparkles, AlertCircle, RefreshCw } from "lucide-react";

import { Product, CartItem, Order, ChatMessage, OrderStatus } from "./types";
import { PRODUCTS } from "./data/products";

// Components
import Header from "./components/Header";
import ProductCard from "./components/ProductCard";
import ProductDetailModal from "./components/ProductDetailModal";
import CartDrawer from "./components/CartDrawer";
import CheckoutView from "./components/CheckoutView";
import DashboardView from "./components/DashboardView";
import AIStylistView from "./components/AIStylistView";
import OrderHistoryView from "./components/OrderHistoryView";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  // Centralized inventories & user selections
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [productsError, setProductsError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products");
      if (!response.ok) throw new Error("Failed to load products");
      const data = await response.json();
      setProducts(data);
      setProductsError(null);
    } catch (error) {
      console.error("Fetch products error:", error);
      setProductsError("Could not synchronize with the live catalogue. Operating in offline fallback mode.");
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/orders");
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error("Fetch orders error:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  // Navigation & panels
  const [activeTab, setActiveTab] = useState<string>("shop");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Search & Filtering controls
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("featured");

  // AI Stylist messaging core
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Core Shopping Operations
  const handleAddToCart = (
    product: Product,
    quantity = 1,
    selectedColor: string,
    selectedSize?: string
  ) => {
    // If color isn't provided, default to first available
    const color = selectedColor || product.colors[0];

    setCart((prev) => {
      const exists = prev.find(
        (item) =>
          item.product.id === product.id &&
          item.selectedColor === color &&
          item.selectedSize === selectedSize
      );

      if (exists) {
        return prev.map((item) =>
          item.product.id === product.id &&
          item.selectedColor === color &&
          item.selectedSize === selectedSize
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [...prev, { product, quantity, selectedColor: color, selectedSize }];
    });

    setIsCartOpen(true);
  };

  const handleUpdateCartQuantity = (
    productId: string,
    quantity: number,
    color: string,
    size?: string
  ) => {
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId &&
        item.selectedColor === color &&
        item.selectedSize === size
          ? { ...item, quantity }
          : item
      )
    );
  };

  const handleRemoveCartItem = (productId: string, color: string, size?: string) => {
    setCart((prev) =>
      prev.filter(
        (item) =>
          !(
            item.product.id === productId &&
            item.selectedColor === color &&
            item.selectedSize === size
          )
      )
    );
  };

  const handleToggleWishlist = (product: Product) => {
    setWishlist((prev) =>
      prev.includes(product.id)
        ? prev.filter((id) => id !== product.id)
        : [...prev, product.id]
    );
  };

  const handleOrderPlaced = async (newOrder: Order) => {
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newOrder)
      });
      if (response.ok) {
        const savedOrder = await response.json();
        setOrders((prev) => [savedOrder, ...prev]);
        fetchProducts(); // Synchronize stock quantities on successful purchase
      } else {
        // Local in-memory fallback
        setOrders((prev) => [newOrder, ...prev]);
        setProducts((prevProds) =>
          prevProds.map((p) => {
            const orderedItem = newOrder.items.find((item) => item.product.id === p.id);
            if (orderedItem) {
              return { ...p, stock: Math.max(0, p.stock - orderedItem.quantity) };
            }
            return p;
          })
        );
      }
    } catch (err) {
      console.error("Order sync error:", err);
      // Local in-memory fallback
      setOrders((prev) => [newOrder, ...prev]);
    }
    setCart([]); // Reset Cart
  };

  // Merchant operations
  const handleUpdateStock = async (productId: string, newStock: number) => {
    try {
      const token = localStorage.getItem("aura_admin_token");
      const response = await fetch(`/api/products/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ stock: newStock })
      });
      if (response.ok) {
        fetchProducts();
      } else {
        // Fallback
        setProducts((prev) =>
          prev.map((p) => (p.id === productId ? { ...p, stock: newStock } : p))
        );
      }
    } catch (err) {
      console.error("Update stock API error:", err);
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, stock: newStock } : p))
      );
    }
  };

  const handleUpdatePrice = async (productId: string, newPrice: number) => {
    try {
      const token = localStorage.getItem("aura_admin_token");
      const response = await fetch(`/api/products/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ price: newPrice })
      });
      if (response.ok) {
        fetchProducts();
      } else {
        // Fallback
        setProducts((prev) =>
          prev.map((p) => (p.id === productId ? { ...p, price: newPrice } : p))
        );
      }
    } catch (err) {
      console.error("Update price API error:", err);
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, price: newPrice } : p))
      );
    }
  };

  const handleAddProduct = async (newProduct: Omit<Product, "rating" | "ratingCount">) => {
    try {
      const token = localStorage.getItem("aura_admin_token");
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(newProduct)
      });
      if (response.ok) {
        fetchProducts();
      } else {
        // Fallback
        setProducts((prev) => [
          {
            ...newProduct,
            rating: 5.0,
            ratingCount: 1,
          } as Product,
          ...prev,
        ]);
      }
    } catch (err) {
      console.error("Add product API error:", err);
      setProducts((prev) => [
        {
          ...newProduct,
          rating: 5.0,
          ratingCount: 1,
        } as Product,
        ...prev,
      ]);
    }
  };

  // Chat server proxy
  const handleSendMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      role: "user",
      text,
      timestamp: new Date().toLocaleTimeString(),
    };

    setChatHistory((prev) => [...prev, userMsg]);
    setIsGenerating(true);

    try {
      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: chatHistory.map((m) => ({ role: m.role, text: m.text })),
        }),
      });

      const data = await response.json();
      
      const botMsg: ChatMessage = {
        id: `msg-${Date.now()}-bot`,
        role: "model",
        text: data.text || "I apologize, something went wrong with my retrieval systems.",
        timestamp: new Date().toLocaleTimeString(),
      };

      setChatHistory((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error("Failed to connect with Gemini Stylist:", error);
      const errMsg: ChatMessage = {
        id: `msg-${Date.now()}-err`,
        role: "model",
        text: "I was unable to connect with the Aura AI Core server. Please ensure the server is online and try asking again.",
        timestamp: new Date().toLocaleTimeString(),
      };
      setChatHistory((prev) => [...prev, errMsg]);
    } finally {
      setIsGenerating(false);
    }
  };

  // Store lists filtered / sorted
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-low-high") return a.price - b.price;
    if (sortBy === "price-high-low") return b.price - a.price;
    if (sortBy === "rating") return b.rating - a.rating;
    return 0; // Default Featured
  });

  const categories = ["All", "Workspace", "Audio", "Lifestyle"];

  return (
    <div className="min-h-screen bg-neutral-50/50 font-sans text-neutral-800 flex flex-col justify-between" id="app-root">
      {/* Header component */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={cart.reduce((acc, item) => acc + item.quantity, 0)}
        wishlistCount={wishlist.length}
        openCart={() => setIsCartOpen(true)}
      />

      <main className="flex-grow">
        <AnimatePresence mode="wait">
          {activeTab === "shop" && (
            <motion.div
              key="shop"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8"
              id="shop-view"
            >
              {/* Minimalist Hero Section */}
              <div className="relative overflow-hidden rounded-3xl bg-neutral-900 px-6 py-12 sm:px-12 sm:py-16 text-white shadow-xl">
                <div className="relative z-10 max-w-xl space-y-4">
                  <span className="inline-flex items-center space-x-1 text-xs font-semibold uppercase tracking-widest text-amber-400">
                    <Sparkles className="h-3.5 w-3.5 fill-amber-400/20" />
                    <span>Aura Curated Space</span>
                  </span>
                  <h1 className="font-sans text-3xl sm:text-4xl font-extrabold tracking-tight">
                    Refined Essentials. Crafted for Life.
                  </h1>
                  <p className="text-sm text-neutral-300 leading-relaxed max-w-md">
                    Explore boutique workstation, lifestyle, and sensory design pieces engineered for structural precision and aesthetic focus.
                  </p>
                  <button
                    id="btn-hero-ai-trigger"
                    onClick={() => setActiveTab("ai")}
                    className="mt-4 flex items-center space-x-1.5 rounded-xl bg-white px-4 py-2.5 text-xs font-semibold text-neutral-950 shadow-md hover:bg-neutral-100 transition-all active:scale-95"
                  >
                    <span>Consult AI Personal Stylist</span>
                    <Sparkles className="h-4 w-4 text-amber-500 fill-amber-500/10" />
                  </button>
                </div>

                {/* Ambient backdrop glow */}
                <div className="absolute top-0 right-0 h-full w-1/3 bg-radial from-neutral-800/80 to-transparent pointer-events-none" />
              </div>

              {/* Filtering Controls Row */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-neutral-100 pb-5" id="storefront-filters">
                {/* Category selectors */}
                <div className="flex flex-wrap items-center gap-1.5">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      id={`cat-filter-${cat.toLowerCase()}`}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                        selectedCategory === cat
                          ? "bg-neutral-900 text-white shadow-sm"
                          : "bg-white text-neutral-500 border border-neutral-200 hover:border-neutral-400 hover:text-neutral-900"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Inputs & Sorting */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  {/* Search */}
                  <div className="relative flex items-center bg-white rounded-xl border border-neutral-200 px-3 py-1.5 focus-within:border-neutral-950 transition-colors w-full sm:w-60">
                    <Search className="h-4 w-4 text-neutral-400 shrink-0" />
                    <input
                      type="text"
                      id="search-input"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search listings..."
                      className="ml-2 w-full text-xs text-neutral-700 outline-none bg-transparent"
                    />
                  </div>

                  {/* Sorter */}
                  <div className="relative flex items-center bg-white rounded-xl border border-neutral-200 px-3 py-1.5 focus-within:border-neutral-950 transition-colors shrink-0">
                    <ArrowUpDown className="h-4 w-4 text-neutral-400 shrink-0" />
                    <select
                      id="sort-select"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="ml-2 text-xs font-semibold text-neutral-700 outline-none bg-transparent border-0 pr-6 cursor-pointer"
                    >
                      <option value="featured">Featured Listings</option>
                      <option value="price-low-high">Price: Low to High</option>
                      <option value="price-high-low">Price: High to Low</option>
                      <option value="rating">Top Rated</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Listings Grid */}
              {sortedProducts.length === 0 ? (
                <div className="text-center py-12 rounded-2xl bg-white border border-neutral-100 p-6 space-y-2">
                  <AlertCircle className="h-10 w-10 text-neutral-400 mx-auto" />
                  <h3 className="font-sans text-sm font-semibold text-neutral-800">No Listings Match Filters</h3>
                  <p className="text-xs text-neutral-400">Try loosening your search terms or choosing a different category.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" id="products-grid">
                  {sortedProducts.map((p) => (
                    <ProductCard
                      key={p.id}
                      product={p}
                      onViewDetails={setSelectedProduct}
                      onAddToCart={(prod) => handleAddToCart(prod, 1, prod.colors[0])}
                      isWishlisted={wishlist.includes(p.id)}
                      onToggleWishlist={handleToggleWishlist}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "ai" && (
            <motion.div
              key="ai"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="h-full"
            >
              <AIStylistView
                chatHistory={chatHistory}
                onSendMessage={handleSendMessage}
                isGenerating={isGenerating}
              />
            </motion.div>
          )}

          {activeTab === "orders" && (
            <motion.div
              key="orders"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <OrderHistoryView
                orders={orders}
                onBackToShop={() => setActiveTab("shop")}
              />
            </motion.div>
          )}

          {activeTab === "dashboard" && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <ProtectedRoute>
                <DashboardView
                  products={products}
                  orders={orders}
                  onUpdateStock={handleUpdateStock}
                  onUpdatePrice={handleUpdatePrice}
                  onAddProduct={handleAddProduct}
                />
              </ProtectedRoute>
            </motion.div>
          )}

          {activeTab === "checkout" && (
            <motion.div
              key="checkout"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <CheckoutView
                cartItems={cart}
                onBackToShop={() => setActiveTab("shop")}
                onOrderPlaced={handleOrderPlaced}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Cart Drawer sliding sidebar */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onCheckout={() => setActiveTab("checkout")}
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Premium Minimalist Footer */}
      <footer className="bg-white border-t border-neutral-100 py-6 text-center mt-12 text-[10px] uppercase tracking-widest text-neutral-400 font-mono">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>© {new Date().getFullYear()} Aura Essentials. All Rights Reserved.</span>
          <span className="flex items-center gap-4">
            <a href="#" className="hover:text-neutral-900">Privacy Policy</a>
            <span>•</span>
            <a href="#" className="hover:text-neutral-900">Terms of Service</a>
          </span>
        </div>
      </footer>
    </div>
  );
}
