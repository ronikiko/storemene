import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { X, ShoppingCart, Star, Check, ShieldCheck, Truck, ChevronRight, ChevronLeft, Plus, Minus, Trash2 } from 'lucide-react';

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onUpdateQuantity?: (id: number, delta: number) => void;
  quantityInCart?: number;
  onNext: () => void;
  onPrev: () => void;
  showPrices?: boolean;
}

const PACK_OPTIONS = [ 1, 2, 3, 5, 10 ];

const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
  onUpdateQuantity,
  quantityInCart = 0,
  onNext,
  onPrev,
  showPrices = true
}) => {
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center sm:px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white w-full h-full sm:w-[85vw] md:w-[70vw] lg:w-[45vw] max-w-2xl sm:rounded-[3rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300 flex flex-col sm:max-h-[95vh] group/modal border-coffee-100/30">

        {/* Navigation Buttons */}
        <button
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          className="absolute left-2 sm:left-6 top-[32.5vh] -translate-y-1/2 z-20 p-2 sm:p-4 bg-white/90 hover:bg-white text-coffee-900 rounded-2xl shadow-xl hover:scale-110 transition-all opacity-100 md:opacity-0 group-hover/modal:opacity-100 flex items-center justify-center border border-coffee-100"
          aria-label="Previous product"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 h-6" />
        </button>

        <button
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          className="absolute right-2 sm:right-6 top-[32.5vh] -translate-y-1/2 z-20 p-2 sm:p-4 bg-white/90 hover:bg-white text-coffee-900 rounded-2xl shadow-xl hover:scale-110 transition-all opacity-100 md:opacity-0 group-hover/modal:opacity-100 flex items-center justify-center border border-coffee-100"
          aria-label="Next product"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 h-6" />
        </button>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 z-30 p-2 sm:p-3 bg-white/90 hover:bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all text-coffee-400 hover:text-coffee-900 border border-coffee-100"
        >
          <X className="w-2 h-2 sm:w-2 h-2" />
        </button>


        {/* Image Section */}
        <div className="w-full bg-pearl h-[55vh] sm:h-[65vh] relative group overflow-hidden border-b border-coffee-100/50">
          <img
            src={product.imageUrl}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {product.discount && (
            <div className="absolute top-8 left-8 bg-red-600 text-white text-xs font-black px-4 py-2 rounded-full shadow-2xl animate-pulse">
              מחיר מיוחד -{product.discount}%
            </div>
          )}
        </div>

        {/* Details Section */}
        <div className="w-full p-6 sm:p-10 flex flex-col overflow-y-auto no-scrollbar bg-white flex-1">
          <div className="mb-2 text-coffee-400 text-[10px] font-black uppercase tracking-[0.2em]">{product.category}</div>
          <h2 className="text-3xl md:text-4xl font-black text-coffee-950 mb-6 leading-tight font-serif italic">{product.title}</h2>

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

          {/* Action Button / Quantity Selector */}
          {showPrices && (
            quantityInCart > 0 ? (
              <div className="flex items-center justify-between bg-coffee-50 rounded-[2rem] p-2 border border-coffee-100 shadow-inner">
                <button
                  onClick={(e) => { e.stopPropagation(); onUpdateQuantity?.(product.id, -1); }}
                  className="w-14 h-14 flex items-center justify-center bg-white text-coffee-900 rounded-[1.5rem] shadow-sm hover:shadow-md active:scale-95 transition-all"
                >
                  {quantityInCart === 1 ? <Trash2 className="w-6 h-6 text-red-500" /> : <Minus className="w-6 h-6" />}
                </button>

                <div className="flex flex-col items-center">
                  <span className="text-2xl font-black text-coffee-950">{quantityInCart}</span>
                  <span className="text-[10px] font-bold text-coffee-400 uppercase tracking-widest">בסל שלך</span>
                </div>

                <button
                  onClick={(e) => { e.stopPropagation(); onUpdateQuantity?.(product.id, 1); }}
                  className="w-14 h-14 flex items-center justify-center bg-coffee-900 text-white rounded-[1.5rem] shadow-lg hover:bg-black active:scale-95 transition-all"
                >
                  <Plus className="w-6 h-6" />
                </button>
              </div>
            ) : (
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
            )
          )}

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