import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Star, Check, ShieldCheck, Truck, RefreshCw } from "lucide-react";
import { Product } from "../types";

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, selectedColor: string, selectedSize?: string) => void;
}

export default function ProductDetailModal({
  product,
  onClose,
  onAddToCart,
}: ProductDetailModalProps) {
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<"features" | "specs">("features");

  if (!product) return null;

  // Initialize selected color once product is available
  if (!selectedColor && product.colors.length > 0) {
    setSelectedColor(product.colors[0]);
  }

  const handleAddToCart = () => {
    onAddToCart(product, quantity, selectedColor, selectedSize || undefined);
    onClose();
    // Reset local state
    setQuantity(1);
    setSelectedColor("");
    setSelectedSize("");
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto" id="product-detail-modal">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-neutral-900/50 backdrop-blur-sm"
        />

        {/* Modal Sheet */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 350 }}
          className="relative z-10 w-full max-w-4xl rounded-2xl border border-neutral-100 bg-white shadow-2xl overflow-hidden"
        >
          {/* Close button */}
          <button
            id="modal-close-btn"
            onClick={onClose}
            className="absolute top-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-neutral-100 bg-white text-neutral-500 shadow-sm transition-colors hover:bg-neutral-50 hover:text-neutral-900"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Left Column: Image */}
            <div className="bg-neutral-50 p-6 flex items-center justify-center min-h-[300px] md:min-h-[450px]">
              <img
                src={product.image}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="max-h-[380px] w-auto object-contain rounded-xl shadow-lg shadow-neutral-200/50"
              />
            </div>

            {/* Right Column: Details */}
            <div className="p-6 sm:p-8 flex flex-col justify-between max-h-[90vh] md:max-h-[600px] overflow-y-auto">
              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-neutral-400">
                  {product.category}
                </span>
                <h2 className="mt-1 font-sans text-2xl font-semibold tracking-tight text-neutral-900">
                  {product.name}
                </h2>

                {/* Ratings */}
                <div className="mt-2.5 flex items-center space-x-1">
                  <div className="flex items-center text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(product.rating) ? "fill-current" : "text-neutral-200"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-mono text-sm font-medium text-neutral-700 ml-1">
                    {product.rating.toFixed(1)}
                  </span>
                  <span className="text-sm text-neutral-400">
                    ({product.ratingCount} detailed verified reviews)
                  </span>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-neutral-600">
                  {product.description}
                </p>

                {/* Color Selector */}
                <div className="mt-6">
                  <h3 className="font-sans text-xs font-semibold uppercase tracking-wider text-neutral-900">
                    Color: <span className="font-medium text-neutral-500">{selectedColor}</span>
                  </h3>
                  <div className="mt-2 flex items-center space-x-3">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        id={`color-swatch-${color.replace(/\s+/g, "-").toLowerCase()}`}
                        onClick={() => setSelectedColor(color)}
                        className={`relative flex h-8 items-center justify-center rounded-full border px-4 text-xs font-medium transition-all ${
                          selectedColor === color
                            ? "border-neutral-900 bg-neutral-900 text-white shadow-sm"
                            : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-400"
                        }`}
                      >
                        <span>{color}</span>
                        {selectedColor === color && (
                          <Check className="ml-1 h-3 w-3" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Features & Specs Tabs */}
                <div className="mt-8 border-b border-neutral-100">
                  <div className="flex space-x-6 text-sm font-medium">
                    <button
                      id="tab-features"
                      onClick={() => setActiveTab("features")}
                      className={`pb-3 transition-colors ${
                        activeTab === "features"
                          ? "border-b-2 border-neutral-900 text-neutral-900"
                          : "text-neutral-400 hover:text-neutral-600"
                      }`}
                    >
                      Key Features
                    </button>
                    <button
                      id="tab-specs"
                      onClick={() => setActiveTab("specs")}
                      className={`pb-3 transition-colors ${
                        activeTab === "specs"
                          ? "border-b-2 border-neutral-900 text-neutral-900"
                          : "text-neutral-400 hover:text-neutral-600"
                      }`}
                    >
                      Specifications
                    </button>
                  </div>
                </div>

                {/* Tab Content */}
                <div className="mt-4 min-h-[120px]">
                  {activeTab === "features" ? (
                    <ul className="space-y-2">
                      {product.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start space-x-2 text-xs text-neutral-600">
                          <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-400" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                      {Object.entries(product.specifications).map(([key, val]) => (
                        <div key={key} className="border-b border-neutral-50 pb-1.5">
                          <dt className="font-medium text-neutral-400 uppercase tracking-wide text-[10px]">{key}</dt>
                          <dd className="mt-0.5 font-medium text-neutral-700">{val}</dd>
                        </div>
                      ))}
                    </dl>
                  )}
                </div>

                {/* Shipping & Returns Guarantee */}
                <div className="mt-6 grid grid-cols-3 gap-2 border-t border-b border-neutral-100 py-3 text-[10px] font-medium text-neutral-500 uppercase tracking-wider">
                  <div className="flex items-center space-x-1.5 justify-center">
                    <Truck className="h-4 w-4 text-neutral-400" />
                    <span>Free Shipping</span>
                  </div>
                  <div className="flex items-center space-x-1.5 justify-center border-l border-r border-neutral-100">
                    <RefreshCw className="h-4 w-4 text-neutral-400" />
                    <span>30-Day Returns</span>
                  </div>
                  <div className="flex items-center space-x-1.5 justify-center">
                    <ShieldCheck className="h-4 w-4 text-neutral-400" />
                    <span>2 Year Warranty</span>
                  </div>
                </div>
              </div>

              {/* Purchase Box */}
              <div className="mt-8 flex items-center justify-between border-t border-neutral-100 pt-4">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Total Price</span>
                  <span className="font-mono text-2xl font-semibold text-neutral-900">
                    ${product.price * quantity}
                  </span>
                </div>

                <div className="flex items-center space-x-3">
                  {/* Quantity adjustment */}
                  <div className="flex items-center rounded-lg border border-neutral-200 bg-neutral-50 p-1">
                    <button
                      id="btn-qty-dec"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="flex h-7 w-7 items-center justify-center rounded-md text-neutral-500 hover:bg-white hover:text-neutral-900 font-mono text-sm"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-mono text-xs font-semibold text-neutral-800">
                      {quantity}
                    </span>
                    <button
                      id="btn-qty-inc"
                      onClick={() => setQuantity(quantity + 1)}
                      className="flex h-7 w-7 items-center justify-center rounded-md text-neutral-500 hover:bg-white hover:text-neutral-900 font-mono text-sm"
                    >
                      +
                    </button>
                  </div>

                  <button
                    id="btn-modal-addcart"
                    onClick={handleAddToCart}
                    className="rounded-xl bg-neutral-900 px-6 py-3 font-sans text-xs font-semibold text-white shadow-sm transition-all hover:bg-neutral-800 hover:shadow-lg active:scale-95"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
