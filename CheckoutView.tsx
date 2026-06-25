import React, { useState } from "react";
import { motion } from "motion/react";
import { ShieldCheck, CreditCard, Lock, ArrowLeft, CheckCircle2, ShoppingBag } from "lucide-react";
import { CartItem, Order, OrderStatus } from "../types";

interface CheckoutViewProps {
  cartItems: CartItem[];
  onBackToShop: () => void;
  onOrderPlaced: (order: Order) => void;
}

export default function CheckoutView({
  cartItems,
  onBackToShop,
  onOrderPlaced,
}: CheckoutViewProps) {
  // Local state
  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    zipCode: "",
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    expiry: "",
    cvc: "",
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  // Computations
  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const shipping = subtotal >= 150 ? 0 : 15;
  const tax = Math.round(subtotal * 0.08 * 100) / 100;
  const total = subtotal + shipping + tax;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaymentInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shippingInfo.name || !shippingInfo.email || !shippingInfo.address || !paymentInfo.cardNumber) {
      alert("Please fill in all required fields.");
      return;
    }

    setIsProcessing(true);

    // Simulate standard credit card authorization latency
    setTimeout(() => {
      const orderId = `AURA-${Math.floor(100000 + Math.random() * 900000)}`;
      const newOrder: Order = {
        id: orderId,
        items: [...cartItems],
        date: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        total: total,
        status: OrderStatus.PROCESSING,
        shippingAddress: { ...shippingInfo },
      };

      setCompletedOrder(newOrder);
      onOrderPlaced(newOrder);
      setIsProcessing(false);
    }, 2500);
  };

  if (completedOrder) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 text-center" id="checkout-success-view">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-2xl border border-neutral-100 bg-white p-8 shadow-xl"
        >
          <div className="flex justify-center">
            <CheckCircle2 className="h-16 w-16 text-emerald-500 fill-emerald-50" />
          </div>
          <h2 className="mt-5 font-sans text-2xl font-semibold tracking-tight text-neutral-900">
            Order Confirmed!
          </h2>
          <p className="mt-2 text-sm text-neutral-500">
            Thank you for shopping with Aura. Your elegant selection is being prepared.
          </p>

          <div className="mt-8 border-t border-b border-neutral-100 py-4 text-left">
            <div className="flex justify-between text-xs">
              <span className="font-sans text-neutral-400">Order Reference</span>
              <span className="font-mono font-bold text-neutral-800">{completedOrder.id}</span>
            </div>
            <div className="mt-2 flex justify-between text-xs">
              <span className="font-sans text-neutral-400">Estimated Delivery</span>
              <span className="font-sans font-medium text-neutral-800">3 - 5 Business Days</span>
            </div>
            <div className="mt-2 flex justify-between text-xs">
              <span className="font-sans text-neutral-400">Total Charged</span>
              <span className="font-mono font-bold text-neutral-900">${completedOrder.total.toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-8 flex flex-col space-y-3">
            <button
              id="btn-success-backshop"
              onClick={onBackToShop}
              className="rounded-xl bg-neutral-900 py-3 text-xs font-semibold text-white shadow-md transition-all hover:bg-neutral-800"
            >
              Continue Shopping
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8" id="checkout-form-view">
      {/* Return back trigger */}
      <button
        id="btn-checkout-back"
        onClick={onBackToShop}
        className="flex items-center space-x-1.5 text-xs font-semibold text-neutral-500 transition-colors hover:text-neutral-900 mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Return to Curated Shop</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form */}
        <div className="lg:col-span-7">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Shipping */}
            <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm">
              <h3 className="font-sans text-base font-semibold text-neutral-900 flex items-center space-x-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-neutral-100 font-mono text-xs font-bold text-neutral-800">
                  1
                </span>
                <span>Shipping Details</span>
              </h3>

              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={shippingInfo.name}
                    onChange={handleInputChange}
                    className="mt-1.5 w-full rounded-lg border border-neutral-200 px-3.5 py-2 font-sans text-sm outline-none focus:border-neutral-950 transition-colors bg-neutral-50/50"
                    placeholder="E.g. Edward Hopper"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={shippingInfo.email}
                    onChange={handleInputChange}
                    className="mt-1.5 w-full rounded-lg border border-neutral-200 px-3.5 py-2 font-sans text-sm outline-none focus:border-neutral-950 transition-colors bg-neutral-50/50"
                    placeholder="edward@hopper.com"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    required
                    value={shippingInfo.address}
                    onChange={handleInputChange}
                    className="mt-1.5 w-full rounded-lg border border-neutral-200 px-3.5 py-2 font-sans text-sm outline-none focus:border-neutral-950 transition-colors bg-neutral-50/50"
                    placeholder="E.g. 40 Nighthawks Ave"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={shippingInfo.city}
                    onChange={handleInputChange}
                    className="mt-1.5 w-full rounded-lg border border-neutral-200 px-3.5 py-2 font-sans text-sm outline-none focus:border-neutral-950 transition-colors bg-neutral-50/50"
                    placeholder="New York"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                    Zip Code *
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    required
                    value={shippingInfo.zipCode}
                    onChange={handleInputChange}
                    className="mt-1.5 w-full rounded-lg border border-neutral-200 px-3.5 py-2 font-sans text-sm outline-none focus:border-neutral-950 transition-colors bg-neutral-50/50"
                    placeholder="10001"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Payment */}
            <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm">
              <h3 className="font-sans text-base font-semibold text-neutral-900 flex items-center space-x-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-neutral-100 font-mono text-xs font-bold text-neutral-800">
                  2
                </span>
                <span>Payment Authorization</span>
              </h3>

              <div className="mt-5 space-y-4">
                <div className="rounded-lg border border-neutral-100 bg-neutral-50 p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <CreditCard className="h-5 w-5 text-neutral-700" />
                    <span className="text-sm font-medium text-neutral-800">Credit / Debit Card</span>
                  </div>
                  <Lock className="h-4 w-4 text-neutral-400" />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                    Card Number *
                  </label>
                  <input
                    type="text"
                    name="cardNumber"
                    required
                    maxLength={19}
                    value={paymentInfo.cardNumber}
                    onChange={handlePaymentChange}
                    className="mt-1.5 w-full rounded-lg border border-neutral-200 px-3.5 py-2 font-sans text-sm outline-none focus:border-neutral-950 transition-colors bg-neutral-50/50"
                    placeholder="0000 0000 0000 0000"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                      Expiration Date *
                    </label>
                    <input
                      type="text"
                      name="expiry"
                      required
                      maxLength={5}
                      value={paymentInfo.expiry}
                      onChange={handlePaymentChange}
                      className="mt-1.5 w-full rounded-lg border border-neutral-200 px-3.5 py-2 font-sans text-sm outline-none focus:border-neutral-950 transition-colors bg-neutral-50/50"
                      placeholder="MM/YY"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                      Security Code (CVC) *
                    </label>
                    <input
                      type="password"
                      name="cvc"
                      required
                      maxLength={3}
                      value={paymentInfo.cvc}
                      onChange={handlePaymentChange}
                      className="mt-1.5 w-full rounded-lg border border-neutral-200 px-3.5 py-2 font-sans text-sm outline-none focus:border-neutral-950 transition-colors bg-neutral-50/50"
                      placeholder="123"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Submission triggers */}
            <button
              id="submit-order-btn"
              type="submit"
              disabled={isProcessing}
              className={`w-full rounded-xl py-4 font-sans text-xs font-semibold text-white shadow-md flex items-center justify-center space-x-2 transition-all duration-200 ${
                isProcessing
                  ? "bg-neutral-600 cursor-not-allowed"
                  : "bg-neutral-900 hover:bg-neutral-800 hover:shadow-lg active:scale-98"
              }`}
            >
              {isProcessing ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Securing Payment Authorization...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="h-4.5 w-4.5" />
                  <span>Authorize & Place Order (${total.toFixed(2)})</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-5">
          <div className="sticky top-24 rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm space-y-5">
            <h3 className="font-sans text-sm font-semibold text-neutral-900 uppercase tracking-wider border-b border-neutral-50 pb-3 flex items-center justify-between">
              <span>Your Selection</span>
              <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-neutral-100 font-bold text-neutral-600">
                {cartItems.reduce((acc, item) => acc + item.quantity, 0)} Items
              </span>
            </h3>

            {/* Item List */}
            <div className="space-y-4 max-h-[220px] overflow-y-auto pr-2">
              {cartItems.map((item, idx) => (
                <div key={idx} className="flex items-center space-x-3 text-xs">
                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded bg-neutral-50 border border-neutral-100">
                    <img src={item.product.image} alt={item.product.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-neutral-800 truncate">{item.product.name}</h4>
                    <span className="text-[10px] text-neutral-400 uppercase font-medium">
                      {item.selectedColor} {item.selectedSize ? `• ${item.selectedSize}` : ""} • Qty {item.quantity}
                    </span>
                  </div>
                  <span className="font-mono font-bold text-neutral-700">${item.product.price * item.quantity}</span>
                </div>
              ))}
            </div>

            {/* Price tallies */}
            <div className="border-t border-neutral-100 pt-4 space-y-2 text-xs">
              <div className="flex justify-between text-neutral-500">
                <span>Subtotal</span>
                <span className="font-mono">${subtotal}</span>
              </div>
              <div className="flex justify-between text-neutral-500">
                <span>Shipping</span>
                <span className="font-mono">{shipping === 0 ? "FREE" : `$${shipping}`}</span>
              </div>
              <div className="flex justify-between text-neutral-500">
                <span>Estimated Sales Tax (8%)</span>
                <span className="font-mono">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t border-neutral-100 pt-3 text-sm font-semibold text-neutral-900">
                <span>Total Amount</span>
                <span className="font-mono text-base">${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Trust badge */}
            <div className="rounded-xl bg-neutral-50 p-3.5 flex items-start space-x-3 border border-neutral-100">
              <Lock className="h-4.5 w-4.5 text-neutral-400 shrink-0 mt-0.5" />
              <div>
                <h5 className="font-sans text-[10px] font-bold uppercase tracking-wider text-neutral-700">Secured SSL Checkout</h5>
                <p className="mt-0.5 text-[10px] text-neutral-400 leading-normal">
                  Your billing information is encrypted end-to-end. Aura never retains raw card credentials.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
