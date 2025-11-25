import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { X, ShoppingCart, Star, Check, ShieldCheck, Truck, ChevronRight, ChevronLeft } from 'lucide-react';

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onNext: () => void;
  onPrev: () => void;
  showPrices?: boolean;
}

const PACK_OPTIONS = [ 1, 2, 3, 5, 10 ];

const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, isOpen, onClose, onAddToCart, onNext, onPrev, showPrices = true }) => {
  const [ selectedPack, setSelectedPack ] = useState<number>(1);
  const [ isAdding, setIsAdding ] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [ isOpen, onNext, onPrev, onClose ]);

  if (!isOpen || !product) return null;

  const handleAddToCart = () => {
    setIsAdding(true);
    onAddToCart(product, selectedPack);
    setTimeout(() => {
      setIsAdding(false);
      // onClose(); // Kept open as per user request
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col md:flex-row max-h-[90vh] md:h-auto group/modal">

        {/* Navigation Buttons */}
        <button
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/80 hover:bg-white text-coffee-900 rounded-full shadow-lg hover:scale-110 transition-all opacity-0 group-hover/modal:opacity-100"
          aria-label="Previous product"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/80 hover:bg-white text-coffee-900 rounded-full shadow-lg hover:scale-110 transition-all opacity-0 group-hover/modal:opacity-100"
          aria-label="Next product"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/80 hover:bg-white rounded-full shadow-sm hover:shadow-md transition-all text-gray-500 hover:text-black"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Image Section */}
        <div className="w-full md:w-1/2 bg-gray-50 h-64 md:h-auto relative group">
          <img
            src={product.imageUrl}
            alt={product.title}
            className="w-full h-full object-cover"
          />
          {product.discount && (
            <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
              מחיר מיוחד -{product.discount}%
            </div>
          )}
        </div>

        {/* Details Section */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col overflow-y-auto custom-scrollbar justify-between">
          <div className="mb-1 text-gray-500 text-sm font-medium uppercase tracking-wide">{product.category}</div>
          <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-2 leading-tight font-serif italic">{product.title}</h2>

          {/* Price & Rating */}
          {showPrices && (
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-bold text-black">₪{product.price.toFixed(2)}</span>
                {product.originalPrice && (
                  <span className="text-lg text-gray-400 line-through decoration-1">₪{product.originalPrice.toFixed(2)}</span>
                )}
              </div>
              {/* <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-bold text-gray-800">{product.rating}</span>
                <span className="text-xs text-gray-400">({product.reviews})</span>
              </div> */}
            </div>
          )}

          <hr className="border-gray-200 mb-6" />

          {/* Pack/Quantity Selector */}
          {/* <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-bold text-gray-900">כמות במארז (יחידות)</span>
            </div>
            <div className="flex gap-2">
              {PACK_OPTIONS.map((count) => (
                <button
                  key={count}
                  onClick={() => setSelectedPack(count)}
                  className={`w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-lg border text-sm font-medium transition-all ${selectedPack === count
                    ? 'bg-black text-white border-black shadow-md scale-105'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                    }`}
                >
                  {count}
                </button>
              ))}
            </div>
          </div> */}

          {/* Action Button */}
          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className={`w-full py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all shadow-lg transform active:scale-[0.98] ${isAdding
              ? 'bg-green-600 text-white'
              : 'bg-black text-white hover:bg-gray-900 hover:shadow-xl'
              }`}
          >
            {isAdding ? (
              <>
                <Check className="w-5 h-5" />
                נוסף
              </>
            ) : (
              <>
                הוספה למועדפים
              </>
            )}
          </button>

          {/* Extra Info */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-gray-600">
              {/* <Truck className="w-4 h-4" /> */}
              <span className="text-xs"></span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              {/* <ShieldCheck className="w-4 h-4" />
              <span className="text-xs">אחריות מלאה לשנה</span> */}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;