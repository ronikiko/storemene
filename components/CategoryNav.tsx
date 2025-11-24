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
        <div className="w-full overflow-x-auto pb-4 pt-2 no-scrollbar">
            <div className="flex gap-4 px-4 min-w-max">
                <button
                    onClick={() => onSelectCategory(null)}
                    className={`flex flex-col items-center gap-2 min-w-[40px] group transition-all ${selectedCategory === null ? 'scale-105' : 'opacity-70 hover:opacity-100'}`}
                >
                    <div className={`w-12 h-12 md:w-12 md:h-12 rounded-full border-2 flex items-center justify-center overflow-hidden shadow-sm transition-all ${selectedCategory === null ? 'border-coffee-900 bg-coffee-900 text-white ring-2 ring-coffee-900/20' : 'border-transparent bg-white text-coffee-900 group-hover:border-coffee-200'}`}>
                        <span className="font-bold text-lg">הכל</span>
                    </div>
                    <span className={`text-sm font-bold ${selectedCategory === null ? 'text-coffee-900' : 'text-coffee-600'}`}>כל המוצרים</span>
                </button>

                {categories.map((category) => {
                    const IconComponent = iconMap[ category.icon ] || HelpCircle;
                    return (
                        <button
                            key={category.id}
                            onClick={() => onSelectCategory(category.id)}
                            className={`flex flex-col items-center gap-2 min-w-[80px] group transition-all ${selectedCategory === category.id ? 'scale-105' : 'opacity-70 hover:opacity-100'}`}
                        >
                            <div className={`w-12 h-12 md:w-12 md:h-12 rounded-full border-2 flex items-center justify-center overflow-hidden shadow-sm transition-all ${selectedCategory === category.id ? 'border-coffee-900 bg-coffee-900 text-white ring-2 ring-coffee-900/20' : 'border-transparent bg-white text-coffee-900 group-hover:border-coffee-200'}`}>
                                <IconComponent className="w-6 h-6" />
                            </div>
                            <span className={`text-sm font-bold ${selectedCategory === category.id ? 'text-coffee-900' : 'text-coffee-600'}`}>{category.name}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default CategoryNav;
