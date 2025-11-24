import React from 'react';
import { Product } from '../types';
import { Star, ShoppingCart, Eye, Tag } from 'lucide-react';

interface ProductCardProps {
  product: Product & { isSpecialPrice?: boolean };
  onAddToCart: (product: Product) => void;
  onQuickView?: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onQuickView }) => {
  return (
    <div className={`group flex flex-col relative bg-white ${product.isSpecialPrice ? 'ring-2 ring-purple-500/20 rounded-lg' : ''}`}>
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-200 rounded-lg mb-2 cursor-pointer" onClick={() => onQuickView && onQuickView(product)}>
        <img
          src={product.imageUrl}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Badges */}
        <div className="absolute top-2 left-0 flex flex-col gap-1 items-start">
          {product.isSpecialPrice && (
             <span className="bg-purple-600 text-white text-[10px] font-bold px-2 py-1 rounded-r-md shadow-sm flex items-center gap-1">
               <Tag className="w-3 h-3" />
               מחיר מיוחד
             </span>
          )}
          {!product.isSpecialPrice && product.discount && (
            <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-r-md shadow-sm">
              -{product.discount}%
            </span>
          )}
          {product.isNew && (
            <span className="bg-black text-white text-[10px] font-bold px-2 py-1 rounded-r-md shadow-sm">
              חדש
            </span>
          )}
        </div>

        {/* Hover Action Buttons */}
        <div className="absolute bottom-2 right-2 flex flex-col gap-2 z-10">
           {/* Quick View Button */}
           <button 
            onClick={(e) => {
              e.stopPropagation();
              if(onQuickView) onQuickView(product);
            }}
            className="bg-white/90 hover:bg-black hover:text-white text-black p-2 rounded-full shadow-md transition-all md:opacity-0 md:translate-x-4 md:group-hover:opacity-100 md:group-hover:translate-x-0 delay-75"
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
            className="bg-white/90 hover:bg-black hover:text-white text-black p-2 rounded-full shadow-md transition-all md:opacity-0 md:translate-x-4 md:group-hover:opacity-100 md:group-hover:translate-x-0"
            aria-label="Add to cart"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-1 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-1">
            <h3 
              className="text-sm text-gray-700 truncate w-full font-normal cursor-pointer hover:text-black transition-colors"
              onClick={() => onQuickView && onQuickView(product)}
            >
              {product.title}
            </h3>
        </div>
        
        <div className="flex items-baseline gap-2 mb-1 flex-wrap">
          <span className={`font-bold ${product.isSpecialPrice ? 'text-purple-700' : 'text-black'}`}>₪{product.price.toFixed(2)}</span>
          {product.originalPrice && (
            <span className="text-xs text-gray-400 line-through">₪{product.originalPrice.toFixed(2)}</span>
          )}
        </div>

        <div className="flex items-center gap-1 mb-2">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`w-3 h-3 ${i < Math.round(product.rating) ? 'fill-current' : 'text-gray-200'}`} 
              />
            ))}
          </div>
          <span className="text-[10px] text-gray-400">({product.reviews})</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;