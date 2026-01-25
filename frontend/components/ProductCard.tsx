import React from 'react';
import { Product } from '../types';
import { Star, ShoppingCart, Eye, Tag, Plus, Minus, Trash2 } from 'lucide-react';

interface ProductCardProps {
  product: Product & { isSpecialPrice?: boolean };
  onAddToCart: (product: Product) => void;
  onUpdateQuantity?: (id: number, delta: number) => void;
  quantityInCart?: number;
  onQuickView?: (product: Product) => void;
  showPrices?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onUpdateQuantity,
  quantityInCart = 0,
  onQuickView,
  showPrices = true
}) => {
  return (
    <div className="group flex flex-col h-full relative bg-white rounded-[2rem] premium-shadow hover:shadow-2xl transition-all duration-500 overflow-hidden border border-coffee-100/30">
      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-pearl cursor-pointer" onClick={() => onQuickView && onQuickView(product)}>
        <img
          src={product.imageUrl}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
        />

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 items-start z-10">
          {product.isSpecialPrice && (
            <span className="glass-dark text-champagne-100 text-[10px] font-black px-3 py-1.5 rounded-xl shadow-lg flex items-center gap-1.5">
              <Star className="w-3 h-3 fill-champagne-400 text-champagne-400" />
              בלעדי
            </span>
          )}
          {!product.isSpecialPrice && product.discount && (
            <span className="bg-red-500 text-white text-[10px] font-black px-3 py-1.5 rounded-xl shadow-lg">
              -{product.discount}%
            </span>
          )}
          {product.isNew && (
            <span className="bg-coffee-950 text-champagne-50 text-[10px] font-black px-3 py-1.5 rounded-xl shadow-lg">
              NEW
            </span>
          )}
        </div>

        {/* Action Overlay */}
        <div className="absolute inset-0 bg-coffee-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onQuickView) onQuickView(product);
            }}
            className="w-10 h-10 glass text-coffee-900 rounded-full flex items-center justify-center transform translate-y-8 group-hover:translate-y-0 transition-transform duration-300 shadow-xl hover:bg-white"
          >
            <Eye className="w-4 h-4" />
          </button>

          {showPrices && (
            quantityInCart > 0 ? (
              <div className="flex items-center bg-white rounded-full p-0.5 shadow-xl transform translate-y-8 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                <button
                  onClick={(e) => { e.stopPropagation(); onUpdateQuantity?.(product.id, -1); }}
                  className="w-9 h-9 flex items-center justify-center text-coffee-900 hover:bg-coffee-50 rounded-full transition-colors"
                >
                  {quantityInCart === 1 ? <Trash2 className="w-3.5 h-3.5 text-red-500" /> : <Minus className="w-3.5 h-3.5" />}
                </button>
                <span className="w-7 text-center text-sm font-black text-coffee-900">{quantityInCart}</span>
                <button
                  onClick={(e) => { e.stopPropagation(); onUpdateQuantity?.(product.id, 1); }}
                  className="w-9 h-9 flex items-center justify-center text-coffee-900 hover:bg-coffee-50 rounded-full transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToCart(product);
                }}
                className="w-10 h-10 bg-coffee-900 text-white rounded-full flex items-center justify-center transform translate-y-8 group-hover:translate-y-0 transition-transform duration-300 delay-75 shadow-xl hover:bg-coffee-800"
              >
                <ShoppingCart className="w-4 h-4" />
              </button>
            )
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col bg-white">
        <div className="mb-2">
          <h3
            className="text-sm font-bold text-coffee-900 leading-snug cursor-pointer group-hover:text-coffee-600 transition-colors line-clamp-2"
            onClick={() => onQuickView && onQuickView(product)}
          >
            {product.title}
          </h3>
        </div>

        <div className="flex items-center justify-between mt-auto">
          {showPrices ? (
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1.5">
                <span className={`text-lg font-black ${product.isSpecialPrice ? 'text-coffee-950' : 'text-coffee-900'}`}>₪{product.price.toFixed(2)}</span>
                {product.originalPrice && (
                  <span className="text-[10px] text-coffee-300 line-through font-medium">₪{product.originalPrice.toFixed(2)}</span>
                )}
              </div>
              {product.isSpecialPrice && <span className="text-[9px] font-bold text-coffee-400 uppercase tracking-tighter">מחיר מותאם אישית</span>}
            </div>
          ) : (
            <div className="text-xs font-bold text-coffee-400 italic">צור קשר למחיר</div>
          )}

          {/* Quick Add (Visible on Mobile) */}
          {showPrices && (
            quantityInCart > 0 ? (
              <div className="md:hidden flex items-center bg-coffee-50 rounded-xl p-1">
                <button
                  onClick={(e) => { e.stopPropagation(); onUpdateQuantity?.(product.id, -1); }}
                  className="w-8 h-8 flex items-center justify-center text-coffee-900"
                >
                  {quantityInCart === 1 ? <Trash2 className="w-3.5 h-3.5 text-red-500" /> : <Minus className="w-3.5 h-3.5" />}
                </button>
                <span className="w-6 text-center text-sm font-black text-coffee-900">{quantityInCart}</span>
                <button
                  onClick={(e) => { e.stopPropagation(); onUpdateQuantity?.(product.id, 1); }}
                  className="w-8 h-8 flex items-center justify-center text-coffee-900"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
                className="md:hidden w-10 h-10 bg-coffee-50 text-coffee-900 rounded-xl flex items-center justify-center active:scale-90 transition-transform"
              >
                <Plus className="w-5 h-5" />
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;