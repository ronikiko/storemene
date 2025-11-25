import React from 'react';
import { Product } from '../types';
import { X, Sparkles, Loader2 } from 'lucide-react';

interface GeminiModalProps {
  isOpen: boolean;
  isLoading: boolean;
  product: Product | null;
  advice: string | null;
  onClose: () => void;
}

const GeminiModal: React.FC<GeminiModalProps> = ({ isOpen, isLoading, product, advice, onClose }) => {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>
      
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <Sparkles className="w-5 h-5 text-yellow-300" />
            <h2 className="font-bold text-lg">הסטייליסטית של StyleFlow</h2>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="flex gap-4 mb-6">
            <img 
              src={product.imageUrl} 
              alt={product.title} 
              className="w-20 h-28 object-cover rounded-lg shadow-md bg-gray-100"
            />
            <div>
              <h3 className="font-bold text-gray-900">{product.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{product.category} • ₪{product.price}</p>
            </div>
          </div>

          <div className="bg-purple-50 border border-purple-100 rounded-xl p-4 min-h-[100px] flex items-center justify-center relative">
            {isLoading ? (
              <div className="flex flex-col items-center gap-2 text-purple-600">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span className="text-sm font-medium">מתאימה לך לוק...</span>
              </div>
            ) : (
              <p className="text-gray-800 text-sm leading-relaxed text-center font-medium">
                {advice}
              </p>
            )}
            
            {/* Decorative Quote Icon */}
            {!isLoading && (
              <div className="absolute -top-3 -right-2 bg-white p-1 rounded-full border border-purple-100">
                <Sparkles className="w-4 h-4 text-purple-500" />
              </div>
            )}
          </div>

          <button 
            onClick={onClose}
            className="w-full mt-6 bg-black text-white font-bold py-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            מעולה, תודה!
          </button>
        </div>
      </div>
    </div>
  );
};

export default GeminiModal;