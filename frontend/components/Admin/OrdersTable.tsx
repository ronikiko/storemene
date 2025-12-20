import React, { useState } from 'react';
import { Order, OrderStatus } from '../../types';
import { Package, Truck, CheckCircle, XCircle, Clock, ChevronDown, ChevronUp, Search, Eye, FileText, Pencil } from 'lucide-react';

interface OrdersTableProps {
    orders: Order[];
    onUpdateStatus: (order: Order) => void;
    onEdit: (order: Order) => void;
}

const statusColors: Record<OrderStatus, string> = {
    'pending': 'bg-yellow-100 text-yellow-800',
    'processing': 'bg-blue-100 text-blue-800',
    'shipped': 'bg-purple-100 text-purple-800',
    'delivered': 'bg-green-100 text-green-800',
    'cancelled': 'bg-red-100 text-red-800',
};

const statusLabels: Record<OrderStatus, string> = {
    'pending': 'התקבל',
    'processing': 'בטיפול',
    'shipped': 'נשלח',
    'delivered': 'נמסר',
    'cancelled': 'בוטל',
};

const OrdersTable: React.FC<OrdersTableProps> = ({ orders, onUpdateStatus, onEdit }) => {
    const [ expandedOrderId, setExpandedOrderId ] = useState<string | null>(null);

    const toggleExpand = (id: string) => {
        setExpandedOrderId(expandedOrderId === id ? null : id);
    };

    const handleStatusChange = (order: Order, newStatus: OrderStatus) => {
        onUpdateStatus({ ...order, status: newStatus });
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
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
                                                            <span className="font-medium">₪{item.total.toFixed(2)}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
                                                    <div className="text-sm text-gray-500">
                                                        <strong>כתובת למשלוח:</strong> {order.customerAddress || 'איסוף עצמי'}
                                                    </div>
                                                    <div className="text-lg font-black">
                                                        סה"כ: ₪{order.totalAmount.toFixed(2)}
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
