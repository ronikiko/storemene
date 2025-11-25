import React from 'react';
import { Check } from 'lucide-react';

interface SidebarProps {
    selectedPriceRange: string | null;
    onPriceRangeChange: (range: string | null) => void;

    showOnlyNew: boolean;
    onToggleNew: () => void;
    showOnlySale: boolean;
    onToggleSale: () => void;

    className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({
    selectedPriceRange,
    onPriceRangeChange,
    showOnlyNew,
    onToggleNew,
    showOnlySale,
    onToggleSale,
    className = ''
}) => {
    const priceRanges = [
        { id: 'under-50', label: 'עד ₪50' },
        { id: '50-100', label: '₪50 - ₪100' },
        { id: '100-200', label: '₪100 - ₪200' },
        { id: '200-plus', label: 'מעל ₪200' },
    ];

    return (
        <aside className={`w-full md:w-64 flex-shrink-0 flex flex-col gap-8 ${className}`}>

            {/* Price Ranges */}
            <div>
                <h3 className="font-bold text-coffee-900 mb-4 text-lg">מחיר</h3>
                <div className="flex flex-col gap-2">
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${selectedPriceRange === null ? 'border-coffee-900' : 'border-coffee-200 group-hover:border-coffee-400'}`}>
                            {selectedPriceRange === null && <div className="w-2.5 h-2.5 rounded-full bg-coffee-900" />}
                        </div>
                        <input type="radio" name="price" className="hidden" checked={selectedPriceRange === null} onChange={() => onPriceRangeChange(null)} />
                        <span className={`text-sm ${selectedPriceRange === null ? 'font-bold text-coffee-900' : 'text-coffee-700'}`}>הכל</span>
                    </label>
                    {priceRanges.map(range => (
                        <label key={range.id} className="flex items-center gap-3 cursor-pointer group">
                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${selectedPriceRange === range.id ? 'border-coffee-900' : 'border-coffee-200 group-hover:border-coffee-400'}`}>
                                {selectedPriceRange === range.id && <div className="w-2.5 h-2.5 rounded-full bg-coffee-900" />}
                            </div>
                            <input type="radio" name="price" className="hidden" checked={selectedPriceRange === range.id} onChange={() => onPriceRangeChange(range.id)} />
                            <span className={`text-sm ${selectedPriceRange === range.id ? 'font-bold text-coffee-900' : 'text-coffee-700'}`}>{range.label}</span>
                        </label>
                    ))}
                </div>
            </div>

            <hr className="border-coffee-100" />

            {/* Status Filters */}
            <div>
                <h3 className="font-bold text-coffee-900 mb-4 text-lg">סינון</h3>
                <div className="flex flex-col gap-3">
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${showOnlySale ? 'bg-coffee-900 border-coffee-900' : 'bg-white border-coffee-200 group-hover:border-coffee-400'}`}>
                            {showOnlySale && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <input type="checkbox" className="hidden" checked={showOnlySale} onChange={onToggleSale} />
                        <span className={`text-sm ${showOnlySale ? 'font-bold text-coffee-900' : 'text-coffee-700'}`}>במבצע</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${showOnlyNew ? 'bg-coffee-900 border-coffee-900' : 'bg-white border-coffee-200 group-hover:border-coffee-400'}`}>
                            {showOnlyNew && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <input type="checkbox" className="hidden" checked={showOnlyNew} onChange={onToggleNew} />
                        <span className={`text-sm ${showOnlyNew ? 'font-bold text-coffee-900' : 'text-coffee-700'}`}>חדש באתר</span>
                    </label>
                </div>
            </div>

        </aside>
    );
};

export default Sidebar;
