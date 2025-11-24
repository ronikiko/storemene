import React from 'react';
import { Category } from '../types';

interface CategoryNavProps {
    categories: Category[];
    selectedCategory: string | null;
    onSelectCategory: (id: string | null) => void;
}

const CategoryNav: React.FC<CategoryNavProps> = ({ categories, selectedCategory, onSelectCategory }) => {
    return (
        <div className="w-full overflow-x-auto pb-4 pt-2 no-scrollbar">
            <div className="flex gap-4 px-4 min-w-max">
                <button
                    onClick={() => onSelectCategory(null)}
                    className={`flex flex-col items-center gap-2 min-w-[40px] group transition-all ${selectedCategory === null ? 'scale-105' : 'opacity-70 hover:opacity-100'}`}
                >
                    <div className={`w-12 h-12 md:w-12 md:h-12 rounded-full border-2 flex items-center justify-center overflow-hidden shadow-sm transition-all ${selectedCategory === null ? 'border-coffee-900 ring-2 ring-coffee-900/20' : 'border-transparent bg-white group-hover:border-coffee-200'}`}>
                        <span className="font-bold text-coffee-900 text-lg">הכל</span>
                    </div>
                    <span className={`text-sm font-bold ${selectedCategory === null ? 'text-coffee-900' : 'text-coffee-600'}`}>כל המוצרים</span>
                </button>

                {categories.map((category) => (
                    <button
                        key={category.id}
                        onClick={() => onSelectCategory(category.id)}
                        className={`flex flex-col items-center gap-2 min-w-[80px] group transition-all ${selectedCategory === category.id ? 'scale-105' : 'opacity-70 hover:opacity-100'}`}
                    >
                        <div className={`w-12 h-12 md:w-12 md:h-12 rounded-full border-2 flex items-center justify-center overflow-hidden shadow-sm transition-all ${selectedCategory === category.id ? 'border-coffee-900 ring-2 ring-coffee-900/20' : 'border-transparent bg-white group-hover:border-coffee-200'}`}>
                            <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
                        </div>
                        <span className={`text-sm font-bold ${selectedCategory === category.id ? 'text-coffee-900' : 'text-coffee-600'}`}>{category.name}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default CategoryNav;
