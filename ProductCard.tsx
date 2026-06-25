import React from "react";
import { motion } from "motion/react";
import { Star, Eye, Heart, ShoppingCart } from "lucide-react";
import { Product } from "../types";

interface ProductCardProps {
  key?: any;
  product: Product;
  onViewDetails: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
}

export default function ProductCard({
  product,
  onViewDetails,
  onAddToCart,
  isWishlisted,
  onToggleWishlist,
}: ProductCardProps) {
  return (
    <motion.div
      id={`product-card-${product.id}`}
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-neutral-100 bg-white p-3 transition-shadow duration-300 hover:shadow-xl hover:shadow-neutral-100/50"
    >
      {/* Product Image Section */}
      <div className="relative aspect-square overflow-hidden rounded-xl bg-neutral-50">
        <img
          src={product.image}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {/* Floating actions */}
        <div className="absolute top-2.5 right-2.5 flex flex-col space-y-1.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <button
            id={`btn-fav-${product.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(product);
            }}
            className={`flex h-9 w-9 items-center justify-center rounded-full border bg-white shadow-sm transition-all duration-200 hover:scale-105 ${
              isWishlisted
                ? "border-rose-100 text-rose-500 bg-rose-50/50"
                : "border-neutral-100 text-neutral-500 hover:text-neutral-900"
            }`}
          >
            <Heart className="h-4.5 w-4.5" fill={isWishlisted ? "currentColor" : "none"} />
          </button>

          <button
            id={`btn-quickview-${product.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(product);
            }}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-100 bg-white text-neutral-500 shadow-sm transition-all duration-200 hover:scale-105 hover:text-neutral-950"
            title="Quick View"
          >
            <Eye className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Low Stock Badge */}
        {product.stock <= 10 && (
          <span className="absolute bottom-2 left-2 rounded bg-neutral-900/90 px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider text-white backdrop-blur-xs">
            Only {product.stock} Left
          </span>
        )}
      </div>

      {/* Product Information */}
      <div className="mt-4 flex flex-1 flex-col justify-between">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-400">
            {product.category}
          </span>
          <h3 
            id={`title-${product.id}`}
            onClick={() => onViewDetails(product)}
            className="mt-1 font-sans text-sm font-medium text-neutral-800 transition-colors hover:text-neutral-950 cursor-pointer line-clamp-1"
          >
            {product.name}
          </h3>

          {/* Rating */}
          <div className="mt-1.5 flex items-center space-x-1">
            <div className="flex items-center text-amber-400">
              <Star className="h-3.5 w-3.5 fill-current" />
            </div>
            <span className="font-mono text-xs font-medium text-neutral-600">
              {product.rating.toFixed(1)}
            </span>
            <span className="font-sans text-[11px] text-neutral-400">
              ({product.ratingCount})
            </span>
          </div>
        </div>

        {/* Price & Add To Cart Button */}
        <div className="mt-4 flex items-center justify-between border-t border-neutral-50 pt-3">
          <span className="font-mono text-base font-semibold text-neutral-900">
            ${product.price}
          </span>

          <button
            id={`btn-addcart-${product.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            className="flex items-center space-x-1.5 rounded-lg bg-neutral-900 px-3 py-1.5 font-sans text-xs font-semibold text-white transition-all duration-200 hover:bg-neutral-850 hover:shadow-md active:scale-95"
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
