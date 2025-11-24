import React from 'react';
import { SlidersHorizontal, Star, X, ChevronDown, ChevronUp } from 'lucide-react';

interface FilterBarProps {
  maxPrice: number;
  currentMaxPrice: number;
  onPriceChange: (val: number) => void;
  minRating: number | null;
  onRatingChange: (val: number | null) => void;
  resultCount: number;
  onClear: () => void;
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ 
  maxPrice, 
  currentMaxPrice, 
  onPriceChange, 
  minRating, 
  onRatingChange, 
  resultCount,
  onClear,
  isOpen,
  setIsOpen
}) => {
  
  const hasActiveFilters = currentMaxPrice < maxPrice || minRating !== null;

  return (
    <div className="container mx-auto px-4 mb-6 mt-4">
        <div className="flex items-center justify-between">
             <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full border text-sm font-medium transition-all shadow-sm ${isOpen || hasActiveFilters ? 'bg-black text-white border-black ring-2 ring-black/20' : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400 hover:bg-gray-50'}`}
            >
                <SlidersHorizontal className="w-4 h-4" />
                <span>סינון ומיון</span>
                {hasActiveFilters && <span className="ml-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />}
                {isOpen ? <ChevronUp className="w-3 h-3 ml-1 opacity-70" /> : <ChevronDown className="w-3 h-3 ml-1 opacity-70" />}
            </button>
            <span className="text-sm font-medium text-gray-500">{resultCount} מוצרים</span>
        </div>

        {isOpen && (
            <div className="mt-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-xl animate-in slide-in-from-top-4 fade-in duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Price Filter */}
                    <div className="flex flex-col gap-3">
                        <div className="flex justify-between items-end">
                            <label className="text-sm font-bold text-gray-900">טווח מחירים</label>
                            <span className="text-lg font-bold text-black bg-gray-100 px-2 py-0.5 rounded">₪0 - ₪{currentMaxPrice}</span>
                        </div>
                        <input 
                            type="range" 
                            min="0" 
                            max={maxPrice} 
                            step="10"
                            value={currentMaxPrice} 
                            onChange={(e) => onPriceChange(Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black focus:outline-none focus:ring-2 focus:ring-black/20"
                        />
                        <div className="flex justify-between text-xs font-medium text-gray-400">
                            <span>₪0</span>
                            <span>₪{maxPrice}</span>
                        </div>
                    </div>

                    {/* Rating Filter */}
                    <div className="flex flex-col gap-3">
                         <label className="text-sm font-bold text-gray-900">דירוג לקוחות</label>
                         <div className="flex flex-wrap gap-2">
                            {[5, 4, 3, 2].map(stars => (
                                <button
                                    key={stars}
                                    onClick={() => onRatingChange(minRating === stars ? null : stars)}
                                    className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm border transition-all ${minRating === stars ? 'bg-black text-white border-black shadow-md transform scale-105' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}
                                >
                                    <span>{stars}</span>
                                    <Star className={`w-3.5 h-3.5 ${minRating === stars ? 'fill-white' : 'fill-yellow-400 text-yellow-400'}`} />
                                    {stars < 5 && <span className="opacity-70">+</span>}
                                </button>
                            ))}
                         </div>
                    </div>
                </div>
                
                {/* Clear Actions */}
                {hasActiveFilters && (
                    <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end">
                        <button 
                            onClick={onClear}
                            className="text-sm text-red-500 font-bold hover:bg-red-50 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                        >
                            <X className="w-4 h-4" />
                            נקה הכל
                        </button>
                    </div>
                )}
            </div>
        )}
    </div>
  );
};

export default FilterBar;