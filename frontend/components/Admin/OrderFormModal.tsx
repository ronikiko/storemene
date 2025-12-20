import React, { useState, useMemo } from 'react';
import { Product, Customer, Order, OrderItem, OrderStatus } from '../../types';
import { X, Plus, Trash2, Search } from 'lucide-react';

interface OrderFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (order: Order) => void;
    customers: Customer[];
    products: Product[];
}

const OrderFormModal: React.FC<OrderFormModalProps> = ({ isOpen, onClose, onSave, customers, products }) => {
    const [ selectedCustomerId, setSelectedCustomerId ] = useState<string>('');
    const [ orderItems, setOrderItems ] = useState<OrderItem[]>([]);
    const [ status, setStatus ] = useState<OrderStatus>('pending');
    const [ address, setAddress ] = useState('');
    const [ searchTerm, setSearchTerm ] = useState('');

    const selectedCustomer = useMemo(() =>
        customers.find(c => c.id === selectedCustomerId),
        [ customers, selectedCustomerId ]
    );

    const filteredProducts = useMemo(() =>
        products.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase())),
        [ products, searchTerm ]
    );

    const totalAmount = useMemo(() =>
        orderItems.reduce((acc, item) => acc + item.total, 0),
        [ orderItems ]
    );

    const handleAddProduct = (product: Product) => {
        const existingItem = orderItems.find(item => item.productId === product.id);
        if (existingItem) {
            setOrderItems(orderItems.map(item =>
                item.productId === product.id
                    ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.price }
                    : item
            ));
        } else {
            setOrderItems([ ...orderItems, {
                productId: product.id,
                title: product.title,
                quantity: 1,
                price: product.price,
                total: product.price,
                imageUrl: product.imageUrl
            } ]);
        }
    };

    const handleRemoveItem = (productId: number) => {
        setOrderItems(orderItems.filter(item => item.productId !== productId));
    };

    const handleUpdateQuantity = (productId: number, quantity: number) => {
        if (quantity <= 0) {
            handleRemoveItem(productId);
            return;
        }
        setOrderItems(orderItems.map(item =>
            item.productId === productId
                ? { ...item, quantity, total: quantity * item.price }
                : item
        ));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCustomer) {
            alert('אנא בחר לקוח');
            return;
        }
        if (orderItems.length === 0) {
            alert('אנא הוסף לפחות מוצר אחד להזמנה');
            return;
        }

        const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
        const newOrder: Order = {
            id: orderId,
            customerId: selectedCustomer.id,
            customerName: selectedCustomer.name,
            customerPhone: selectedCustomer.phone,
            customerAddress: address,
            items: orderItems,
            totalAmount,
            status,
            createdAt: new Date().toISOString()
        };

        onSave(newOrder);
        onClose();
        // Reset state
        setSelectedCustomerId('');
        setOrderItems([]);
        setStatus('pending');
        setAddress('');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white w-full max-w-4xl rounded-2xl shadow-2xl p-6 overflow-y-auto max-h-[90vh]">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">יצירת הזמנה חדשה</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Customer Selection */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">בחר לקוח *</label>
                                <select
                                    required
                                    value={selectedCustomerId}
                                    onChange={(e) => setSelectedCustomerId(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-black outline-none"
                                >
                                    <option value="">בחר לקוח...</option>
                                    {customers.map(c => (
                                        <option key={c.id} value={c.id}>{c.name} ({c.phone})</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">כתובת למשלוח</label>
                                <input
                                    type="text"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    placeholder="רחוב, מספר, עיר"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-black outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">סטטוס</label>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value as OrderStatus)}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-black outline-none"
                                >
                                    <option value="pending">התקבל (Pending)</option>
                                    <option value="processing">בטיפול (Processing)</option>
                                    <option value="shipped">נשלח (Shipped)</option>
                                    <option value="delivered">נמסר (Delivered)</option>
                                    <option value="cancelled">בוטל (Cancelled)</option>
                                </select>
                            </div>
                        </div>

                        {/* Product Selection */}
                        <div className="space-y-4 border-r border-gray-100 pr-6">
                            <label className="block text-sm font-medium text-gray-700 mb-1">הוספת מוצרים</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="חפש מוצר..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg pr-10 pl-4 py-2 text-sm focus:ring-2 focus:ring-black outline-none"
                                />
                                <Search className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" />
                            </div>
                            <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
                                {filteredProducts.map(product => (
                                    <div key={product.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg border border-transparent hover:border-gray-200 transition-all">
                                        <div className="flex items-center gap-3">
                                            <img src={product.imageUrl} alt="" className="w-10 h-10 object-cover rounded" />
                                            <div>
                                                <div className="text-sm font-bold">{product.title}</div>
                                                <div className="text-xs text-gray-500">₪{product.price.toFixed(2)}</div>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleAddProduct(product)}
                                            className="p-1.5 bg-gray-100 hover:bg-black hover:text-white rounded-md transition-all"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Order Items Summary */}
                    <div className="border-t border-gray-100 pt-6">
                        <h3 className="font-bold mb-4">סיכום מוצרים</h3>
                        <div className="space-y-3">
                            {orderItems.length === 0 ? (
                                <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-100 rounded-xl">
                                    עדיין לא נוספו מוצרים להזמנה
                                </div>
                            ) : (
                                orderItems.map(item => (
                                    <div key={item.productId} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <img src={item.imageUrl} alt="" className="w-12 h-12 object-cover rounded" />
                                            <div>
                                                <div className="font-bold text-sm">{item.title}</div>
                                                <div className="text-xs text-gray-500">₪{item.price.toFixed(2)} ליחידה</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={item.quantity}
                                                    onChange={(e) => handleUpdateQuantity(item.productId, parseInt(e.target.value) || 0)}
                                                    className="w-16 bg-white border border-gray-200 rounded px-2 py-1 text-center text-sm"
                                                />
                                            </div>
                                            <div className="w-24 text-left font-bold text-sm">₪{item.total.toFixed(2)}</div>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveItem(item.productId)}
                                                className="text-red-500 hover:bg-red-50 p-1.5 rounded-full transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {orderItems.length > 0 && (
                            <div className="mt-6 flex justify-between items-center bg-black text-white p-4 rounded-xl">
                                <span className="font-bold">סה"כ לתשלום</span>
                                <span className="text-xl font-black">₪{totalAmount.toFixed(2)}</span>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-3 justify-end pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2.5 rounded-xl border border-gray-300 font-bold hover:bg-gray-50 transition-colors"
                        >
                            ביטול
                        </button>
                        <button
                            type="submit"
                            className="px-8 py-2.5 bg-blue-600 text-white rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-colors"
                        >
                            שמור הזמנה
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default OrderFormModal;
