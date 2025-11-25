import React from 'react';
import { Product } from '../types';
import { Star, ShoppingCart, Eye, Tag } from 'lucide-react';

interface ProductCardProps {
  product: Product & { isSpecialPrice?: boolean };
  onAddToCart: (product: Product) => void;
  onQuickView?: (product: Product) => void;
  showPrices?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onQuickView, showPrices = true }) => {
  return (
    <div className="group flex flex-col relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-coffee-50">
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-coffee-50 cursor-pointer" onClick={() => onQuickView && onQuickView(product)}>
        <img
          src={product.imageUrl}
          alt={product.title}
          className="w-full h-full object-contain p-4 transition-transform duration-700 group-hover:scale-105"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 items-start">
          {product.isSpecialPrice && (
            <span className="bg-white/90 backdrop-blur text-coffee-700 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1 border border-coffee-100">
              <Tag className="w-3 h-3" />
              מחיר מיוחד
            </span>
          )}
          {!product.isSpecialPrice && product.discount && (
            <span className="bg-red-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
              -{product.discount}%
            </span>
          )}
          {product.isNew && (
            <span className="bg-coffee-900 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
              חדש
            </span>
          )}
        </div>

        {/* Hover Action Buttons */}
        <div className="absolute bottom-3 right-3 flex flex-col gap-2 z-10">
          {/* Quick View Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onQuickView) onQuickView(product);
            }}
            className="bg-white text-coffee-900 p-2.5 rounded-full shadow-lg transition-all transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 hover:bg-coffee-50"
            aria-label="Quick view"
          >
            <Eye className="w-4 h-4" />
          </button>

          {/* Add to Cart Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            className="bg-coffee-900 text-white p-2.5 rounded-full shadow-lg transition-all transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 delay-75 hover:bg-coffee-800"
            aria-label="Add to cart"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        <div className="mb-2">
          <h3
            className="text-base font-bold text-coffee-900 truncate w-full cursor-pointer hover:text-coffee-600 transition-colors"
            onClick={() => onQuickView && onQuickView(product)}
          >
            {product.title}
          </h3>
        </div>

        {showPrices && (
          <div className="flex items-baseline gap-2 mt-auto">
            <span className={`text-lg font-black ${product.isSpecialPrice ? 'text-green-600' : 'text-coffee-900'}`}>₪{product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="text-xs text-coffee-300 line-through font-medium">₪{product.originalPrice.toFixed(2)}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;