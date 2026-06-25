import { ShoppingBag, Sparkles, LayoutDashboard, Heart, History, Store, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  cartCount: number;
  wishlistCount: number;
  openCart: () => void;
}

export default function Header({
  activeTab,
  setActiveTab,
  cartCount,
  wishlistCount,
  openCart,
}: HeaderProps) {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div 
          className="flex cursor-pointer items-center space-x-2"
          onClick={() => setActiveTab("shop")}
          id="brand-logo"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-900 text-white font-mono text-lg font-bold tracking-wider">
            A
          </div>
          <span className="font-sans text-xl font-semibold tracking-wider text-neutral-900 uppercase">
            Aura
          </span>
        </div>

        {/* Main Navigation */}
        <nav className="hidden md:flex space-x-1" id="main-nav">
          <button
            id="nav-shop"
            onClick={() => setActiveTab("shop")}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              activeTab === "shop"
                ? "bg-neutral-900 text-white shadow-sm"
                : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50"
            }`}
          >
            <Store className="h-4 w-4" />
            <span>Curated Shop</span>
          </button>

          <button
            id="nav-ai"
            onClick={() => setActiveTab("ai")}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              activeTab === "ai"
                ? "bg-neutral-900 text-white shadow-sm"
                : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50"
            }`}
          >
            <Sparkles className="h-4 w-4 text-amber-500 fill-amber-500/10" />
            <span>AI Concierge</span>
          </button>

          <button
            id="nav-orders"
            onClick={() => setActiveTab("orders")}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              activeTab === "orders"
                ? "bg-neutral-900 text-white shadow-sm"
                : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50"
            }`}
          >
            <History className="h-4 w-4" />
            <span>Order History</span>
          </button>

          <button
            id="nav-dashboard"
            onClick={() => setActiveTab("dashboard")}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              activeTab === "dashboard"
                ? "bg-neutral-900 text-white shadow-sm"
                : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50"
            }`}
          >
            <LayoutDashboard className="h-4 w-4" />
            <span>Merchant Hub</span>
          </button>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center space-x-4" id="header-actions">
          {/* Wishlist Indicator */}
          <button
            id="btn-wishlist"
            onClick={() => setActiveTab("shop")} // Scroll or direct to shop
            className="relative p-2 text-neutral-600 transition-colors hover:text-neutral-900"
            title="Wishlist"
          >
            <Heart className="h-5.5 w-5.5" />
            {wishlistCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Cart Toggle */}
          <button
            id="btn-cart"
            onClick={openCart}
            className="relative flex items-center space-x-2 rounded-full border border-neutral-200 bg-neutral-50 px-3.5 py-1.5 text-neutral-800 transition-all hover:bg-neutral-100 hover:border-neutral-300"
            title="Cart"
          >
            <ShoppingBag className="h-4 w-4" />
            <span className="text-sm font-semibold">{cartCount}</span>
          </button>

          {user && (
            <button
              id="btn-logout"
              onClick={() => {
                logout();
                setActiveTab("shop");
              }}
              className="flex items-center space-x-1 rounded-full border border-red-200 bg-red-50 px-3.5 py-1.5 text-xs font-semibold text-red-700 transition-all hover:bg-red-100 cursor-pointer"
              title="Logout"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline ml-1">Sign Out</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Navigation Bar */}
      <div className="flex border-t border-neutral-100 md:hidden bg-white justify-around py-2" id="mobile-nav">
        <button
          id="mob-nav-shop"
          onClick={() => setActiveTab("shop")}
          className={`flex flex-col items-center space-y-1 text-xs font-medium ${
            activeTab === "shop" ? "text-neutral-900" : "text-neutral-400"
          }`}
        >
          <Store className="h-5 w-5" />
          <span>Shop</span>
        </button>
        <button
          id="mob-nav-ai"
          onClick={() => setActiveTab("ai")}
          className={`flex flex-col items-center space-y-1 text-xs font-medium ${
            activeTab === "ai" ? "text-neutral-900" : "text-neutral-400"
          }`}
        >
          <Sparkles className="h-5 w-5 text-amber-500" />
          <span>AI Stylist</span>
        </button>
        <button
          id="mob-nav-orders"
          onClick={() => setActiveTab("orders")}
          className={`flex flex-col items-center space-y-1 text-xs font-medium ${
            activeTab === "orders" ? "text-neutral-900" : "text-neutral-400"
          }`}
        >
          <History className="h-5 w-5" />
          <span>Orders</span>
        </button>
        <button
          id="mob-nav-dashboard"
          onClick={() => setActiveTab("dashboard")}
          className={`flex flex-col items-center space-y-1 text-xs font-medium ${
            activeTab === "dashboard" ? "text-neutral-900" : "text-neutral-400"
          }`}
        >
          <LayoutDashboard className="h-5 w-5" />
          <span>Merchant</span>
        </button>
      </div>
    </header>
  );
}
