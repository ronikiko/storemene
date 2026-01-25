import React, { useState } from 'react';
import { Order, OrderStatus } from '../../types';
import { Package, Truck, CheckCircle, XCircle, Clock, ChevronDown, ChevronUp, Search, Eye, FileText, Pencil, Share, Loader2, RefreshCw } from 'lucide-react';
import { ordersApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';

interface OrdersTableProps {
    orders: Order[];
    onUpdateStatus: (order: Order) => void;
    onEdit: (order: Order) => void;
    onRefresh?: () => Promise<boolean>;
}


const statusColors: Record<OrderStatus, string> = {
    'pending': 'bg-yellow-100 text-yellow-800',
    'processing': 'bg-blue-100 text-blue-800',
    'ready_for_shipping': 'bg-green-100 text-green-800',
    'shipped': 'bg-purple-100 text-purple-800',
    'delivered': 'bg-teal-100 text-teal-800',
    'cancelled': 'bg-red-100 text-red-800',
};

const statusLabels: Record<OrderStatus, string> = {
    'pending': 'התקבל',
    'processing': 'בטיפול',
    'ready_for_shipping': 'מוכן למשלוח',
    'shipped': 'נשלח',
    'delivered': 'נמסר',
    'cancelled': 'בוטל',
};

const OrdersTable: React.FC<OrdersTableProps> = ({ orders, onUpdateStatus, onEdit, onRefresh }) => {
    const [ expandedOrderId, setExpandedOrderId ] = useState<string | null>(null);
    const [ isRefreshing, setIsRefreshing ] = useState(false);
    const [ isSending, setIsSending ] = useState<Record<string, boolean>>({});
    const { success, error } = useToast();

    const toggleExpand = (id: string) => {
        setExpandedOrderId(expandedOrderId === id ? null : id);
    };

    const handleStatusChange = (order: Order, newStatus: OrderStatus) => {
        onUpdateStatus({ ...order, status: newStatus });
    };

    const handleResendPicking = async (order: Order) => {
        if (isSending[ order.id ]) return;

        setIsSending(prev => ({ ...prev, [ order.id ]: true }));
        try {
            await ordersApi.getPickingLink(order.id);
            success(`הודעת ווצאפ נשלחה לליקוט עבור הזמנת לקוח -${order.customerName}`);
        } catch (err) {
            console.error('Failed to get picking link:', err);
            error('שגיאה בשליחת הודעת וואטסאפ');
        } finally {
            setIsSending(prev => ({ ...prev, [ order.id ]: false }));
        }
    };

    const handleRefresh = async () => {
        if (!onRefresh) return;
        setIsRefreshing(true);
        await onRefresh();
        setIsRefreshing(false);
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Header with Refresh Button */}
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white">
                <h3 className="font-black text-coffee-950 text-lg">ניהול הזמנות</h3>
                {onRefresh && (
                    <button
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${isRefreshing ? 'bg-gray-100 text-gray-400' : 'bg-coffee-50 text-coffee-900 hover:bg-coffee-100'}`}
                    >
                        <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                        {isRefreshing ? 'מרענן...' : 'רענן נתונים'}
                    </button>
                )}
            </div>
            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-right">
                    <thead className="bg-gray-50 text-gray-600 text-sm font-medium">
                        <tr>
                            <th className="px-6 py-4">מספר הזמנה</th>
                            <th className="px-6 py-4">לקוח</th>
                            <th className="px-6 py-4">תאריך</th>
                            <th className="px-6 py-4">סכום</th>
                            <th className="px-6 py-4">סטטוס</th>
                            <th className="px-6 py-4">פעולות</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {orders.map((order) => (
                            <React.Fragment key={order.id}>
                                <tr className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900">#{order.id}</td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium">{order.customerName}</div>
                                        <div className="text-xs text-gray-500">{order.customerPhone}</div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 text-sm">
                                        {new Date(order.createdAt).toLocaleDateString('he-IL')}
                                        <br />
                                        {new Date(order.createdAt).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}
                                    </td>
                                    <td className="px-6 py-4 font-bold">₪{order.totalAmount.toFixed(2)}</td>
                                    <td className="px-6 py-4">
                                        <select
                                            value={order.status}
                                            onChange={(e) => handleStatusChange(order, e.target.value as OrderStatus)}
                                            className={`px-3 py-1 rounded-full text-xs font-bold border-none focus:ring-2 focus:ring-offset-1 cursor-pointer ${statusColors[ order.status ]}`}
                                        >
                                            {Object.entries(statusLabels).map(([ key, label ]) => (
                                                <option key={key} value={key}>{label}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            {order.documentLink && (
                                                <a
                                                    href={order.documentLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-2 hover:bg-gray-100 rounded-full text-coffee-600 transition-colors"
                                                    title="צפה במסמך (ריווחית)"
                                                >
                                                    <FileText className="w-5 h-5" />
                                                </a>
                                            )}
                                            <button
                                                onClick={() => handleResendPicking(order)}
                                                disabled={isSending[ order.id ]}
                                                className={`p-2 rounded-full transition-colors ${isSending[ order.id ] ? 'text-gray-400 bg-gray-100' : 'hover:bg-green-50 text-green-600'}`}
                                                title="שלח שוב לליקוט (WhatsApp)"
                                            >
                                                {isSending[ order.id ] ? (
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                ) : (
                                                    <Share className="w-5 h-5" />
                                                )}
                                            </button>
                                            <button
                                                onClick={() => onEdit(order)}
                                                className="p-2 hover:bg-blue-50 rounded-full text-blue-600 transition-colors"
                                                title="ערוך הזמנה"
                                            >
                                                <Pencil className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => toggleExpand(order.id)}
                                                className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
                                                title="צפה בפרטים"
                                            >
                                                {expandedOrderId === order.id ? <ChevronUp className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                    </td>
                                </tr>

                                {/* Expanded Details */}
                                {expandedOrderId === order.id && (
                                    <tr className="bg-gray-50/50">
                                        <td colSpan={6} className="px-6 py-4">
                                            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                                                <h4 className="font-bold mb-3 text-sm text-gray-700">פרטי הזמנה:</h4>
                                                <div className="space-y-2">
                                                    {order.items.map((item, idx) => (
                                                        <div key={idx} className="flex justify-between items-center text-sm border-b border-gray-50 last:border-0 pb-2 last:pb-0">
                                                            <div className="flex items-center gap-3">
                                                                {item.imageUrl && (
                                                                    <img src={item.imageUrl} alt={item.title} className="w-10 h-10 rounded object-cover bg-gray-100" />
                                                                )}
                                                                <span>{item.quantity}x {item.title}</span>
                                                            </div>
                                                            <div className="flex items-center gap-3">
                                                                <span className="font-medium">
                                                                    {item.discountPercent > 0 && (
                                                                        <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded-md ml-2">
                                                                            -{item.discountPercent}%
                                                                        </span>
                                                                    )}
                                                                    ₪{item.total.toFixed(2)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
                                                    <div className="text-sm text-gray-500">
                                                        <strong>כתובת למשלוח:</strong> {order.customerAddress || 'איסוף עצמי'}
                                                    </div>
                                                    <div className="flex flex-col items-end gap-1">
                                                        {order.discountPercent > 0 && (
                                                            <div className="text-sm text-red-500 font-medium">
                                                                הנחה כללית: {order.discountPercent}%-
                                                            </div>
                                                        )}
                                                        <div className="text-lg font-black">
                                                            סה"כ: ₪{order.totalAmount.toFixed(2)}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OrdersTable;
