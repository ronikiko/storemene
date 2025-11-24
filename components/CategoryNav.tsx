import React from 'react';
import { Category } from '../types';

interface CategoryNavProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (id: string | null) => void;
}

const CategoryNav: React.FC<CategoryNavProps> = ({ categories, selectedCategory, onSelectCategory }) => {
  return (
    <div className="bg-white py-4 border-b border-gray-100 sticky top-[61px] z-30 shadow-sm">
      <div className="container mx-auto px-2">
        <div className="flex gap-4 overflow-x-auto no-scrollbar px-2 items-start">
           {/* 'All' Option */}
           <div 
              onClick={() => onSelectCategory(null)}
              className="flex flex-col items-center gap-2 min-w-[70px] cursor-pointer group"
            >
              <div className={`w-16 h-16 rounded-full flex items-center justify-center bg-gray-50 border-2 transition-all ${selectedCategory === null ? 'border-black ring-1 ring-black' : 'border-transparent group-hover:border-gray-200'}`}>
                <span className={`text-xs ${selectedCategory === null ? 'font-bold text-black' : 'font-medium text-gray-500'}`}>הכל</span>
              </div>
              <span className={`text-xs font-medium whitespace-nowrap ${selectedCategory === null ? 'text-black font-bold' : 'text-gray-700'}`}>
                כל המוצרים
              </span>
            </div>

          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <div 
                key={cat.id} 
                onClick={() => onSelectCategory(isActive ? null : cat.id)}
                className="flex flex-col items-center gap-2 min-w-[70px] cursor-pointer group"
              >
                <div className={`w-16 h-16 rounded-full overflow-hidden border-2 transition-all p-[2px] ${isActive ? 'border-black ring-1 ring-black' : 'border-transparent group-hover:border-gray-300'}`}>
                  <img 
                    src={cat.image} 
                    alt={cat.name} 
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <span className={`text-xs font-medium whitespace-nowrap ${isActive ? 'text-black font-bold' : 'text-gray-700 group-hover:text-black'}`}>
                  {cat.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CategoryNav;