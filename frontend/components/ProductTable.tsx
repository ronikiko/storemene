import React from 'react';
import { Product } from '../types';
import { ShoppingCart, Eye } from 'lucide-react';

interface ProductTableProps {
    products: (Product & { isSpecialPrice?: boolean })[];
    onAddToCart: (product: Product) => void;
    onQuickView: (product: Product) => void;
}

const ProductTable: React.FC<ProductTableProps> = ({ products, onAddToCart, onQuickView }) => {
    return (
        <div className="overflow-x-auto bg-white rounded-2xl shadow-sm border border-coffee-100">
            <table className="w-full text-right">
                <thead className="bg-coffee-50 text-coffee-900 text-sm font-bold">
                    <tr>
                        <th className="px-6 py-4 rounded-tr-2xl">מוצר</th>
                        <th className="px-6 py-4">קטגוריה</th>
                        <th className="px-6 py-4">מחיר</th>
                        <th className="px-6 py-4 rounded-tl-2xl">פעולות</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-coffee-50">
                    {products.map((product) => (
                        <tr key={product.id} className="group hover:bg-coffee-50/50 transition-colors">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-4 cursor-pointer" onClick={() => onQuickView(product)}>
                                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                        <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-coffee-900 group-hover:text-coffee-600 transition-colors">{product.title}</h4>
                                        {product.isNew && <span className="text-[10px] bg-coffee-900 text-white px-1.5 py-0.5 rounded-full">חדש</span>}
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-coffee-700">
                                {product.category}
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex flex-col items-start">
                                    <span className={`font-bold ${product.isSpecialPrice ? 'text-green-600' : 'text-coffee-900'}`}>
                                        ₪{product.price.toFixed(2)}
                                    </span>
                                    {product.originalPrice && (
                                        <span className="text-xs text-coffee-300 line-through">
                                            ₪{product.originalPrice.toFixed(2)}
                                        </span>
                                    )}
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => onQuickView(product)}
                                        className="p-2 text-coffee-600 hover:bg-coffee-100 rounded-full transition-colors"
                                        title="צפייה מהירה"
                                    >
                                        <Eye className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => onAddToCart(product)}
                                        className="p-2 bg-coffee-900 text-white hover:bg-coffee-800 rounded-full transition-colors shadow-sm"
                                        title="הוסף לסל"
                                    >
                                        <ShoppingCart className="w-5 h-5" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProductTable;
