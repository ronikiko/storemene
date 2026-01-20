import React from 'react';
import { Product, Category } from '../types';
import { ShoppingBag, Eye, Star, Zap, Plus, Minus, Trash2 } from 'lucide-react';

interface ProductTableProps {
    products: (Product & { isSpecialPrice?: boolean })[];
    categories: Category[];
    cartItems: { id: number; quantity: number }[];
    onAddToCart: (product: Product) => void;
    onUpdateQuantity: (id: number, delta: number) => void;
    onQuickView: (product: Product) => void;
    showPrices?: boolean;
}

const ProductTable: React.FC<ProductTableProps> = ({
    products,
    categories,
    cartItems,
    onAddToCart,
    onUpdateQuantity,
    onQuickView,
    showPrices = true
}) => {

    return (
        <div className="w-full overflow-hidden bg-white/30 backdrop-blur-md rounded-[2.5rem] border border-coffee-100/50 shadow-2xl">
            <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-right border-collapse">
                    <thead>
                        <tr className="border-b border-coffee-100/50">
                            <th className="px-8 py-6 text-[10px] font-black text-coffee-400 uppercase tracking-[0.2em]">המוצר</th>
                            <th className="hidden md:table-cell px-8 py-6 text-[10px] font-black text-coffee-400 uppercase tracking-[0.2em]">קטגוריה</th>
                            {showPrices && <th className="px-8 py-6 text-[10px] font-black text-coffee-400 uppercase tracking-[0.2em]">מחיר</th>}
                            <th className="px-8 py-6 text-[10px] font-black text-coffee-400 uppercase tracking-[0.2em] text-left">פעולות</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-coffee-50/50 text-coffee-950 font-medium">
                        {products.map((product) => (
                            <tr
                                key={product.id}
                                className="group hover:bg-white/60 transition-all duration-300 ease-out"
                            >
                                <td className="px-8 py-5">
                                    <div className="flex items-center gap-4">
                                        <div
                                            className="relative w-14 h-14 rounded-2xl overflow-hidden bg-pearl border border-coffee-100/50 shadow-sm cursor-pointer active:scale-95 transition-transform"
                                            onClick={() => onQuickView(product)}
                                        >
                                            <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                            {product.isNew && (
                                                <div className="absolute top-1 right-1 bg-coffee-900 text-white text-[8px] font-black px-1.5 py-0.5 rounded-md shadow-lg">
                                                    חדש
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <h4
                                                className="font-black text-base text-coffee-950 group-hover:text-coffee-600 transition-colors cursor-pointer"
                                                onClick={() => onQuickView(product)}
                                            >
                                                {product.title}
                                            </h4>
                                            {product.isSpecialPrice && (
                                                <div className="flex items-center gap-1 mt-1 text-red-500">
                                                    <Zap className="w-3 h-3 fill-current" />
                                                    <span className="text-[10px] font-black uppercase tracking-wider">מחיר מיוחד</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </td>
                                <td className="hidden md:table-cell px-8 py-5">
                                    <span className="px-3 py-1.5 rounded-xl bg-pearl border border-coffee-50 text-xs font-bold text-coffee-400 group-hover:bg-white group-hover:border-coffee-100 transition-colors">
                                        {categories && categories.find((category) => category.id === product.category)?.name}
                                    </span>
                                </td>
                                {showPrices && (
                                    <td className="px-8 py-5">
                                        <div className="flex flex-col">
                                            <span className={`text-lg font-black ${product.isSpecialPrice ? 'text-red-600' : 'text-coffee-950'}`}>
                                                ₪{product.price.toFixed(2)}
                                            </span>
                                            {product.originalPrice && (
                                                <span className="text-xs text-coffee-300 line-through font-bold">
                                                    ₪{product.originalPrice.toFixed(2)}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                )}
                                <td className="px-8 py-5">
                                    <div className="flex items-center justify-end gap-3">
                                        <button
                                            onClick={() => onQuickView(product)}
                                            className="w-10 h-10 flex items-center justify-center text-coffee-400 hover:text-coffee-900 bg-white/50 hover:bg-white border border-transparent hover:border-coffee-100 rounded-xl transition-all shadow-sm active:scale-90"
                                            title="צפייה מהירה"
                                        >
                                            <Eye className="w-5 h-5" />
                                        </button>

                                        {(() => {
                                            const cartItem = cartItems.find(item => item.id === product.id);
                                            if (cartItem) {
                                                return (
                                                    <div className="flex items-center bg-coffee-50 rounded-2xl p-1 border border-coffee-100/50">
                                                        <button
                                                            onClick={() => onUpdateQuantity(product.id, -1)}
                                                            className="w-10 h-10 flex items-center justify-center text-coffee-900 hover:bg-white rounded-xl transition-colors"
                                                        >
                                                            {cartItem.quantity === 1 ? <Trash2 className="w-4 h-4 text-red-500" /> : <Minus className="w-4 h-4" />}
                                                        </button>
                                                        <span className="w-8 text-center font-black text-coffee-950 text-sm">{cartItem.quantity}</span>
                                                        <button
                                                            onClick={() => onUpdateQuantity(product.id, 1)}
                                                            className="w-10 h-10 flex items-center justify-center text-coffee-900 hover:bg-white rounded-xl transition-colors"
                                                        >
                                                            <Plus className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                );
                                            }
                                            return (
                                                <button
                                                    onClick={() => onAddToCart(product)}
                                                    className="w-12 h-12 flex items-center justify-center bg-coffee-900 text-white hover:bg-black rounded-2xl transition-all shadow-lg hover:shadow-coffee-100 active:scale-95"
                                                    title="הוסף לסל"
                                                >
                                                    <ShoppingBag className="w-5 h-5" />
                                                </button>
                                            );
                                        })()}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {products.length === 0 && (
                <div className="py-20 text-center">
                    <div className="w-16 h-16 bg-pearl rounded-full flex items-center justify-center mx-auto mb-4 border border-coffee-100">
                        <ShoppingBag className="w-6 h-6 text-coffee-200" />
                    </div>
                    <p className="text-coffee-400 font-bold">אין מוצרים להצגה</p>
                </div>
            )}
        </div>
    );
};

export default ProductTable;
