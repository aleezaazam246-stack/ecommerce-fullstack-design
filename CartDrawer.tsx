import { motion, AnimatePresence } from "motion/react";
import { X, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import { CartItem } from "../types";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number, color: string, size?: string) => void;
  onRemoveItem: (productId: string, color: string, size?: string) => void;
  onCheckout: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}: CartDrawerProps) {
  // Price computations
  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const shippingThreshold = 150;
  const shipping = subtotal === 0 ? 0 : subtotal >= shippingThreshold ? 0 : 15;
  const tax = Math.round(subtotal * 0.08 * 100) / 100;
  const total = subtotal + shipping + tax;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden" id="cart-drawer-container">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-neutral-900/40 backdrop-blur-xs"
          />

          <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
            {/* Slide-out Sheet */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between"
            >
              {/* Header */}
              <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
                <div className="flex items-center space-x-2">
                  <ShoppingBag className="h-5 w-5 text-neutral-800" />
                  <span className="font-sans text-base font-semibold text-neutral-900">Your Cart</span>
                  <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-neutral-200 text-neutral-700 font-bold">
                    {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                  </span>
                </div>
                <button
                  id="close-cart-btn"
                  onClick={onClose}
                  className="p-1.5 rounded-full border border-neutral-200 bg-white text-neutral-500 hover:text-neutral-900 shadow-sm"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {cartItems.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-50 text-neutral-400">
                      <ShoppingBag className="h-8 w-8" />
                    </div>
                    <div>
                      <h3 className="font-sans text-sm font-semibold text-neutral-800">Your cart is empty</h3>
                      <p className="mt-1 text-xs text-neutral-400 max-w-[200px] mx-auto">
                        Explore our boutique listings and add items to begin crafting your lifestyle.
                      </p>
                    </div>
                  </div>
                ) : (
                  cartItems.map((item, idx) => (
                    <div
                      key={`${item.product.id}-${item.selectedColor}-${item.selectedSize || ""}`}
                      className="flex space-x-3.5 border-b border-neutral-50 pb-4 last:border-0 last:pb-0"
                    >
                      {/* Thumbnail */}
                      <div className="h-18 w-18 shrink-0 overflow-hidden rounded-lg border border-neutral-100 bg-neutral-50">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          referrerPolicy="no-referrer"
                          className="h-full w-full object-cover"
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between">
                            <h4 className="font-sans text-xs font-medium text-neutral-800 line-clamp-1">
                              {item.product.name}
                            </h4>
                            <span className="font-mono text-xs font-semibold text-neutral-950 ml-2">
                              ${item.product.price * item.quantity}
                            </span>
                          </div>

                          <div className="mt-1 flex flex-wrap gap-1 text-[10px] font-medium text-neutral-400 uppercase tracking-wide">
                            <span>Color: {item.selectedColor}</span>
                            {item.selectedSize && (
                              <>
                                <span className="text-neutral-200">|</span>
                                <span>Size: {item.selectedSize}</span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Controls Row */}
                        <div className="mt-2.5 flex items-center justify-between">
                          {/* Quantity selector */}
                          <div className="flex items-center border border-neutral-200 rounded p-0.5 bg-neutral-50">
                            <button
                              onClick={() =>
                                onUpdateQuantity(
                                  item.product.id,
                                  Math.max(1, item.quantity - 1),
                                  item.selectedColor,
                                  item.selectedSize || undefined
                                )
                              }
                              className="h-5 w-5 flex items-center justify-center rounded text-neutral-500 hover:bg-white text-xs font-bold"
                            >
                              -
                            </button>
                            <span className="w-6 text-center font-mono text-[11px] font-bold text-neutral-700">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                onUpdateQuantity(
                                  item.product.id,
                                  item.quantity + 1,
                                  item.selectedColor,
                                  item.selectedSize || undefined
                                )
                              }
                              className="h-5 w-5 flex items-center justify-center rounded text-neutral-500 hover:bg-white text-xs font-bold"
                            >
                              +
                            </button>
                          </div>

                          {/* Trash button */}
                          <button
                            onClick={() =>
                              onRemoveItem(
                                item.product.id,
                                item.selectedColor,
                                item.selectedSize || undefined
                              )
                            }
                            className="text-neutral-400 hover:text-rose-500 p-1 rounded-md transition-colors"
                            title="Remove item"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer Summary */}
              {cartItems.length > 0 && (
                <div className="border-t border-neutral-100 bg-neutral-50/50 p-5 space-y-4">
                  {/* Pricing lines */}
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between text-neutral-500">
                      <span>Subtotal</span>
                      <span className="font-mono">${subtotal}</span>
                    </div>
                    <div className="flex justify-between text-neutral-500">
                      <span>Shipping</span>
                      <span className="font-mono">
                        {shipping === 0 ? "FREE" : `$${shipping}`}
                      </span>
                    </div>
                    {shipping > 0 && (
                      <p className="text-[10px] text-neutral-400 text-right">
                        Add <strong className="text-neutral-600">${shippingThreshold - subtotal}</strong> more for free shipping
                      </p>
                    )}
                    <div className="flex justify-between text-neutral-500">
                      <span>Estimated Sales Tax (8%)</span>
                      <span className="font-mono">${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between border-t border-neutral-100 pt-2 text-sm font-semibold text-neutral-900">
                      <span>Total</span>
                      <span className="font-mono text-base">${total.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Checkout CTA */}
                  <button
                    id="checkout-cta-btn"
                    onClick={() => {
                      onCheckout();
                      onClose();
                    }}
                    className="w-full rounded-xl bg-neutral-900 py-3.5 flex items-center justify-center space-x-2 text-xs font-semibold text-white shadow-md transition-all hover:bg-neutral-800 hover:shadow-lg active:scale-98"
                  >
                    <span>Proceed to Secure Checkout</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
