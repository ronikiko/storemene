import React from 'react';
import { Category } from '../types';
import { Flame, Coffee, Apple, Milk, Croissant, Package, Sparkles, HelpCircle } from 'lucide-react';

interface CategoryNavProps {
    categories: Category[];
    selectedCategory: string | null;
    onSelectCategory: (id: string | null) => void;
}

const iconMap: Record<string, React.ElementType> = {
    'flame': Flame,
    'coffee': Coffee,
    'apple': Apple,
    'milk': Milk,
    'croissant': Croissant,
    'package': Package,
    'sparkles': Sparkles,
};

const CategoryNav: React.FC<CategoryNavProps> = ({ categories, selectedCategory, onSelectCategory }) => {
    return (
        <div className="w-full overflow-x-auto pb-6 pt-4 no-scrollbar">
            <div className="flex gap-3 px-4 min-w-max">
                <button
                    onClick={() => onSelectCategory(null)}
                    className={`flex items-center gap-3 px-6 py-3 rounded-2xl transition-all duration-300 border ${selectedCategory === null
                            ? 'bg-coffee-900 text-white border-coffee-900 shadow-xl shadow-coffee-200 scale-105'
                            : 'bg-white text-coffee-600 border-coffee-100 hover:border-coffee-300'
                        }`}
                >
                    <Package className={`w-5 h-5 ${selectedCategory === null ? 'text-champagne-400' : ''}`} />
                    <span className="font-black text-sm whitespace-nowrap">הכל</span>
                </button>

                {categories.map((category) => {
                    const IconComponent = iconMap[ category.icon ] || HelpCircle;
                    const isActive = selectedCategory === category.id;
                    return (
                        <button
                            key={category.id}
                            onClick={() => onSelectCategory(category.id)}
                            className={`flex items-center gap-3 px-6 py-3 rounded-2xl transition-all duration-300 border ${isActive
                                    ? 'bg-coffee-900 text-white border-coffee-900 shadow-xl shadow-coffee-200 scale-105'
                                    : 'bg-white text-coffee-600 border-coffee-100 hover:border-coffee-300'
                                }`}
                        >
                            <IconComponent className={`w-5 h-5 ${isActive ? 'text-champagne-400' : ''}`} />
                            <span className="font-black text-sm whitespace-nowrap">{category.name}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default CategoryNav;
