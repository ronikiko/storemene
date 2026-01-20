import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ordersApi } from '../services/api';
import { Check, X, Package, ShoppingBag, AlertCircle, ArrowLeft, Send, Truck } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const OrderPicker: React.FC = () => {
    const { token } = useParams<{ token: string }>();
    const [ order, setOrder ] = useState<any>(null);
    const [ itemsStatus, setItemsStatus ] = useState<Record<number, 'pending' | 'collected' | 'out_of_stock'>>({});
    const [ pickedQuantities, setPickedQuantities ] = useState<Record<number, number>>({});
    const [ isLoading, setIsLoading ] = useState(true);
    const [ isSubmitting, setIsSubmitting ] = useState(false);
    const { success, error } = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                if (!token) return;
                const data = await ordersApi.getByToken(token);
                setOrder(data);

                if (data && data.items) {
                    const statusMap: Record<number, any> = {};
                    const quantityMap: Record<number, number> = {};
                    data.items.forEach((item: any) => {
                        statusMap[ item.id ] = item.pickingStatus || 'pending';
                        quantityMap[ item.id ] = item.pickedQuantity ?? item.quantity;
                    });
                    setItemsStatus(statusMap);
                    setPickedQuantities(quantityMap);
                }
            } catch (err) {
                error('לא הצלחנו לטעון את ההזמנה');
            } finally {
                setIsLoading(false);
            }
        };
        fetchOrder();
    }, [ token ]);

    const toggleStatus = (itemId: number, status: 'collected' | 'out_of_stock') => {
        setItemsStatus(prev => {
            const nextStatus = prev[ itemId ] === status ? 'pending' : status;

            if (nextStatus === 'out_of_stock') {
                setPickedQuantities(pq => ({ ...pq, [ itemId ]: 0 }));
            } else if (nextStatus === 'collected' && pickedQuantities[ itemId ] === 0) {
                const originalQty = order?.items?.find((i: any) => i.id === itemId)?.quantity || 1;
                setPickedQuantities(pq => ({ ...pq, [ itemId ]: originalQty }));
            }

            return {
                ...prev,
                [ itemId ]: nextStatus
            };
        });
    };

    const updateQuantity = (itemId: number, delta: number) => {
        setPickedQuantities(prev => {
            const current = prev[ itemId ] || 0;
            const newVal = Math.max(0, current + delta);

            // Auto-update status based on quantity
            if (newVal === 0) {
                setItemsStatus(s => ({ ...s, [ itemId ]: 'out_of_stock' }));
            } else if (itemsStatus[ itemId ] === 'out_of_stock') {
                setItemsStatus(s => ({ ...s, [ itemId ]: 'pending' }));
            }

            return {
                ...prev,
                [ itemId ]: newVal
            };
        });
    };

    const handleComplete = async () => {
        if (!token) return;
        setIsSubmitting(true);
        try {
            const statusArray = Object.entries(itemsStatus).map(([ id, status ]) => ({
                id: parseInt(id),
                status,
                pickedQuantity: pickedQuantities[ parseInt(id) ]
            }));
            await ordersApi.completePicking(token, statusArray);
            success('ההזמנה עודכנה לסטטוס מוכן למשלוח!');
            setTimeout(() => navigate('/'), 2000);
        } catch (err) {
            error('שגיאה בעדכון ההזמנה');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return (
        <div className="min-h-screen bg-pearl flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-coffee-200 border-t-coffee-900 rounded-full animate-spin" />
                <p className="font-bold text-coffee-900">טוען הזמנה...</p>
            </div>
        </div>
    );

    if (!order) return (
        <div className="min-h-screen bg-pearl flex items-center justify-center p-6">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl text-center max-w-sm w-full border border-coffee-100/50">
                <div className="w-20 h-20 bg-red-50 text-red-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                    <AlertCircle className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-black text-coffee-950 mb-3">אופס!</h2>
                <p className="text-coffee-500 font-medium mb-8">הלינק הזה כבר לא בתוקף או שההזמנה לא נמצאה.</p>
                <button onClick={() => navigate('/')} className="w-full py-4 bg-coffee-900 text-white font-black rounded-2xl">חזרה לחנות</button>
            </div>
        </div>
    );

    const items = order.items || [];
    const handledCount = Object.values(itemsStatus).filter(s => s !== 'pending').length;
    const pendingCount = items.length - handledCount;

    return (
        <div className="min-h-screen bg-pearl pb-32" dir="rtl">
            {/* Header */}
            <div className="glass sticky top-0 z-50 border-b border-coffee-100/50 p-6">
                <div className="container mx-auto flex items-center justify-between">
                    <div className="text-right">
                        <h1 className="text-2xl font-black text-coffee-950">ליקוט הזמנה</h1>
                        <p className="text-sm font-bold text-coffee-400 uppercase tracking-widest">{order.id}</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className={`px-4 py-2 rounded-full text-xs font-black shadow-sm ${pendingCount === 0 ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                            {pendingCount === 0 ? 'כל הפריטים טופלו' : `${pendingCount} פריטים נותרו`}
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {/* Customer Info Card */}
                <div className="glass p-6 rounded-[2rem] premium-shadow border border-white/50 mb-8 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-4 text-right w-full">
                        <div className="w-16 h-16 bg-coffee-900 rounded-2xl flex items-center justify-center text-champagne-400">
                            <Package className="w-8 h-8" />
                        </div>
                        <div>
                            <div className="text-[10px] font-black text-coffee-400 uppercase tracking-widest mb-1">לקוח</div>
                            <div className="text-xl font-black text-coffee-950">{order.customerName}</div>
                            <div className="text-sm font-bold text-coffee-500">{order.customerPhone} | {order.customerAddress || 'אין כתובת'}</div>
                        </div>
                    </div>
                </div>

                {/* Items List */}
                <div className="space-y-4">
                    {items.map((item: any) => {
                        const currentPicked = pickedQuantities[ item.id ] || 0;
                        const isChanged = currentPicked !== item.quantity;

                        return (
                            <div key={item.id} className={`glass p-6 rounded-[2.5rem] border transition-all duration-300 premium-shadow ${itemsStatus[ item.id ] === 'collected' ? 'border-green-200 bg-green-50/30' : itemsStatus[ item.id ] === 'out_of_stock' ? 'border-red-200 bg-red-50/30' : 'border-white/50'}`}>
                                <div className="flex flex-col items-center text-center sm:flex-row sm:text-right sm:items-center gap-6">
                                    {/* Product Image */}
                                    <div className="relative shrink-0">
                                        <img
                                            src={item.imageUrl}
                                            className="w-32 h-32 sm:w-24 sm:h-24 object-cover rounded-[2rem] shadow-md border border-coffee-100 bg-white"
                                            onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/150')}
                                        />
                                        {itemsStatus[ item.id ] !== 'pending' && (
                                            <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center shadow-lg border-2 border-white z-10 animate-in zoom-in duration-300">
                                                {itemsStatus[ item.id ] === 'collected' ? (
                                                    <div className="bg-green-500 text-white w-full h-full rounded-full flex items-center justify-center"><Check className="w-4 h-4" /></div>
                                                ) : (
                                                    <div className="bg-red-500 text-white w-full h-full rounded-full flex items-center justify-center"><X className="w-4 h-4" /></div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Info & Controls */}
                                    <div className="flex-1 w-full space-y-4">
                                        <div>
                                            <h3 className="text-xl font-black text-coffee-950 leading-tight">{item.title}</h3>
                                            <p className="text-sm font-bold text-coffee-400">₪{item.price?.toLocaleString()} ליח'</p>
                                        </div>

                                        <div className="flex flex-col gap-3">
                                            {/* Quantity Selector */}
                                            <div className="flex items-center justify-center sm:justify-start gap-4">
                                                <div className="flex items-center bg-gray-100/80 p-1 rounded-2xl border border-gray-200 shadow-inner">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, -1)}
                                                        className="w-10 h-10 flex items-center justify-center hover:bg-white hover:shadow-sm rounded-xl transition-all text-coffee-600 active:scale-90"
                                                    >-</button>
                                                    <span className="font-black text-xl min-w-[3ch] text-center text-coffee-950">{currentPicked}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, 1)}
                                                        className="w-10 h-10 flex items-center justify-center hover:bg-white hover:shadow-sm rounded-xl transition-all text-coffee-600 active:scale-90"
                                                    >+</button>
                                                </div>

                                                <div className="flex flex-col items-start gap-0.5">
                                                    {isChanged && <span className="text-[10px] font-black text-red-500 bg-red-50 px-2 py-0.5 rounded-md line-through">הוזמן: {item.quantity}</span>}
                                                    <span className={`text-sm font-black ${isChanged ? 'text-green-600' : 'text-coffee-400'}`}>לוקט: {currentPicked}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Large Status Buttons */}
                                    <div className="flex items-center gap-3 pt-2 sm:pt-0">
                                        <button
                                            onClick={() => toggleStatus(item.id, 'out_of_stock')}
                                            className={`w-14 h-14 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center transition-all ${itemsStatus[ item.id ] === 'out_of_stock' ? 'bg-red-600 text-white shadow-lg scale-110' : 'bg-white text-red-600 border-2 border-red-100 hover:bg-red-50 active:scale-95'}`}
                                            title="אין במלאי"
                                        >
                                            <X className="w-7 h-7 sm:w-6 sm:h-6" />
                                        </button>
                                        <button
                                            onClick={() => toggleStatus(item.id, 'collected')}
                                            className={`w-14 h-14 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center transition-all ${itemsStatus[ item.id ] === 'collected' ? 'bg-green-600 text-white shadow-lg scale-110' : 'bg-white text-green-600 border-2 border-green-100 hover:bg-green-50 active:scale-95'}`}
                                            title="נאסף"
                                        >
                                            <Check className="w-7 h-7 sm:w-6 sm:h-6" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Footer Summary & Action */}
            <div className="fixed bottom-0 left-0 right-0 p-4 sm:p-6 glass border-t border-coffee-100/50 z-50">
                <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-4 sm:gap-8 w-full sm:w-auto">
                        <div className="text-center sm:text-right">
                            <div className="text-[10px] font-black text-coffee-400 uppercase tracking-widest mb-1">פריטים</div>
                            <div className="text-xl font-black text-coffee-950">{items.length}</div>
                        </div>
                        <div className="text-center sm:text-right text-green-600 border-x border-coffee-100 sm:border-none px-2">
                            <div className="text-[10px] font-black uppercase tracking-widest text-coffee-400 mb-1">נאספו</div>
                            <div className="text-xl font-black">{Object.values(itemsStatus).filter(s => s === 'collected').length}</div>
                        </div>
                        <div className="text-center sm:text-right text-red-600">
                            <div className="text-[10px] font-black uppercase tracking-widest text-coffee-400 mb-1">חסר</div>
                            <div className="text-xl font-black">{Object.values(itemsStatus).filter(s => s === 'out_of_stock').length}</div>
                        </div>
                    </div>

                    <button
                        onClick={handleComplete}
                        disabled={isSubmitting || pendingCount > 0}
                        className={`flex items-center justify-center gap-3 w-full sm:w-auto px-12 py-5 rounded-[2rem] font-black text-lg transition-all shadow-2xl ${pendingCount > 0
                            ? 'bg-coffee-100 text-coffee-300 cursor-not-allowed opacity-50'
                            : 'bg-coffee-900 text-white hover:scale-105 active:scale-95 shadow-coffee-200'
                            }`}
                    >
                        {isSubmitting ? (
                            <div className="flex items-center gap-2">
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                <span>מעדכן...</span>
                            </div>
                        ) : (
                            <>
                                <span>שגר הזמנה</span>
                                <Send className="w-6 h-6" />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderPicker;
