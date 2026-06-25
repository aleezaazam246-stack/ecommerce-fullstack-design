import { motion } from "motion/react";
import { History, Package, Clock, Truck, CheckCircle, ChevronRight, MapPin } from "lucide-react";
import { Order, OrderStatus } from "../types";

interface OrderHistoryViewProps {
  orders: Order[];
  onBackToShop: () => void;
}

export default function OrderHistoryView({
  orders,
  onBackToShop,
}: OrderHistoryViewProps) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-6" id="order-history-view">
      {/* Header */}
      <div className="border-b border-neutral-100 pb-5">
        <h2 className="font-sans text-2xl font-semibold tracking-tight text-neutral-900">Your Orders & Deliveries</h2>
        <p className="mt-1 text-sm text-neutral-500">Track shipment progressions, review past invoices, and audit order specifications.</p>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-200 bg-white p-12 text-center space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-neutral-50 text-neutral-400">
            <History className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-sans text-sm font-semibold text-neutral-800">No Orders Found</h3>
            <p className="mt-1 text-xs text-neutral-400 max-w-xs mx-auto">
              You have not placed any orders yet. Begin exploring our curated collections to find your perfect pieces.
            </p>
          </div>
          <button
            id="btn-empty-orders-shop"
            onClick={onBackToShop}
            className="rounded-xl bg-neutral-900 px-5 py-2.5 text-xs font-semibold text-white hover:bg-neutral-800 transition-all active:scale-95"
          >
            Explore Curated Shop
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            // Setup status stepper state
            const steps = [
              { label: "Processing", icon: Clock, active: true },
              { label: "Shipped", icon: Truck, active: order.status === OrderStatus.SHIPPED || order.status === OrderStatus.DELIVERED },
              { label: "Delivered", icon: CheckCircle, active: order.status === OrderStatus.DELIVERED }
            ];

            return (
              <motion.div
                key={order.id}
                id={`order-block-${order.id}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-neutral-100 bg-white p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Meta details */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-neutral-50 pb-4 text-xs font-medium">
                  <div className="flex flex-col space-y-1 sm:space-y-0 sm:flex-row sm:space-x-6">
                    <div>
                      <span className="text-neutral-400 font-sans uppercase text-[10px] tracking-wider block">Reference ID</span>
                      <span className="font-mono text-neutral-900 font-bold">{order.id}</span>
                    </div>
                    <div>
                      <span className="text-neutral-400 font-sans uppercase text-[10px] tracking-wider block">Date Placed</span>
                      <span className="text-neutral-700">{order.date}</span>
                    </div>
                    <div>
                      <span className="text-neutral-400 font-sans uppercase text-[10px] tracking-wider block">Total Amount</span>
                      <span className="font-mono text-neutral-950 font-bold">${order.total.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="mt-3 sm:mt-0">
                    <span className="inline-flex items-center rounded-full bg-neutral-100 px-3 py-1 font-sans text-[11px] font-bold text-neutral-800 tracking-wider uppercase">
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* Stepper tracker */}
                <div className="my-6 py-4 border-b border-neutral-50 bg-neutral-50/50 rounded-xl px-4">
                  <div className="flex items-center justify-between max-w-lg mx-auto relative">
                    {/* Background line connector */}
                    <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-neutral-200 -translate-y-1/2 z-0" />
                    <div 
                      className="absolute top-1/2 left-0 h-0.5 bg-neutral-900 -translate-y-1/2 z-0 transition-all duration-500"
                      style={{ 
                        width: order.status === OrderStatus.DELIVERED ? "100%" : order.status === OrderStatus.SHIPPED ? "50%" : "0%" 
                      }}
                    />

                    {/* Steps render */}
                    {steps.map((st, i) => {
                      const StepIcon = st.icon;
                      return (
                        <div key={i} className="flex flex-col items-center z-10 relative">
                          <div
                            className={`flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                              st.active
                                ? "bg-neutral-950 border-neutral-950 text-white"
                                : "bg-white border-neutral-200 text-neutral-400"
                            }`}
                          >
                            <StepIcon className="h-4.5 w-4.5" />
                          </div>
                          <span
                            className={`mt-2 font-sans text-[10px] font-bold uppercase tracking-wider ${
                              st.active ? "text-neutral-900" : "text-neutral-400"
                            }`}
                          >
                            {st.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Items grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-2">
                  <div className="md:col-span-8 space-y-3">
                    <h4 className="font-sans text-[10px] font-bold uppercase tracking-wider text-neutral-400">Purchased Items</h4>
                    <div className="space-y-3 max-h-[160px] overflow-y-auto">
                      {order.items.map((it, idx) => (
                        <div key={idx} className="flex items-center space-x-3 text-xs">
                          <img src={it.product.image} alt={it.product.name} className="h-10 w-10 rounded bg-neutral-50 object-cover" />
                          <div className="flex-1">
                            <h5 className="font-medium text-neutral-800 line-clamp-1">{it.product.name}</h5>
                            <p className="text-[10px] text-neutral-400 font-medium">
                              Color: {it.selectedColor} {it.selectedSize ? `• Size: ${it.selectedSize}` : ""} • Qty {it.quantity}
                            </p>
                          </div>
                          <span className="font-mono text-neutral-700">${it.product.price * it.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Delivery Location card */}
                  <div className="md:col-span-4 rounded-xl border border-neutral-100 bg-neutral-50/50 p-4 space-y-2">
                    <h4 className="font-sans text-[10px] font-bold uppercase tracking-wider text-neutral-400 flex items-center space-x-1">
                      <MapPin className="h-3 w-3" />
                      <span>Delivery Location</span>
                    </h4>
                    <div className="text-[11px] text-neutral-600 leading-relaxed font-sans">
                      <p className="font-bold text-neutral-800">{order.shippingAddress.name}</p>
                      <p className="mt-0.5">{order.shippingAddress.address}</p>
                      <p>{order.shippingAddress.city}, {order.shippingAddress.zipCode}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
