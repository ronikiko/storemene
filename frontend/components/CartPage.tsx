import React, { useState, useMemo, useEffect } from 'react';
import { CartItem, Customer } from '../types';
import { Trash2, Plus, Minus, ArrowRight, MessageCircle, ShieldCheck, AlertTriangle, X, Loader2, ShoppingBag } from 'lucide-react';
import { useToast } from '../context/ToastContext';

interface CartPageProps {
  cartItems: CartItem[];
  onUpdateQuantity: (id: number, delta: number) => void;
  onRemoveItem: (id: number) => void;
  onBack: () => void;
  showPrices?: boolean;
  onPlaceOrder: (order: any) => void;
  activeCustomerId?: string | null;
  customers: Customer[];
  customerName: string;
}

const CartPage: React.FC<CartPageProps> = ({ cartItems, onUpdateQuantity, onRemoveItem, onBack, showPrices = true, onPlaceOrder, activeCustomerId, customers, customerName }) => {
  const [ itemToRemove, setItemToRemove ] = useState<number | null>(null);
  const [ isSubmitting, setIsSubmitting ] = useState(false);
  const { error } = useToast();

  const subtotal = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [ cartItems ]);

  const total = subtotal;

  const handleCheckout = async () => {
    const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder = {
      id: orderId,
      customerId: activeCustomerId || undefined,
      customerName,
      items: cartItems.map(item => ({
        productId: item.id,
        title: item.title,
        quantity: item.quantity,
        price: item.price,
        total: item.price * item.quantity,
        imageUrl: item.imageUrl
      })),
      totalAmount: total,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    setIsSubmitting(true);
    try {
      await onPlaceOrder(newOrder);
    } catch (err) {
      console.error('Failed to create order:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmRemove = () => {
    if (itemToRemove !== null) {
      onRemoveItem(itemToRemove);
      setItemToRemove(null);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-700">
        <div className="w-32 h-32 bg-coffee-50 rounded-[3rem] flex items-center justify-center mb-8 premium-shadow">
          <ShoppingBag className="w-12 h-12 text-coffee-200" />
        </div>
        <h2 className="text-3xl font-black text-coffee-950 mb-3">הסל שלך ריק</h2>
        <p className="text-coffee-500 font-medium mb-10 max-w-xs leading-relaxed">הגיע הזמן לרענן את המלאי! בואי נחזור לקטלוג ונמצא דברים מהממים.</p>
        <button
          onClick={onBack}
          className="bg-coffee-900 text-white px-12 py-4 rounded-2xl font-black hover:scale-105 active:scale-95 transition-all shadow-xl shadow-coffee-100 flex items-center gap-3"
        >
          <ArrowRight className="w-5 h-5" />
          חזרה לקטלוג
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex flex-col lg:flex-row gap-10 items-start">
        {/* Left Column: Items */}
        <div className="flex-1 w-full">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-black text-coffee-950">הסל שלי</h1>
            <span className="bg-coffee-900 text-white px-3 py-1 rounded-full text-xs font-black">{cartItems.length} פריטים</span>
          </div>

          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="glass rounded-[2rem] p-4 flex gap-4 md:gap-6 premium-shadow border border-coffee-50">
                <div className="w-24 h-32 md:w-32 md:h-40 flex-shrink-0 bg-pearl rounded-2xl overflow-hidden border border-coffee-50">
                  <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover transition-transform hover:scale-110 duration-500" />
                </div>

                <div className="flex-1 flex flex-col justify-between py-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-black text-lg text-coffee-950 leading-tight mb-1">{item.title}</h3>
                      <span className="text-xs font-bold text-coffee-400 uppercase tracking-wider">{item.category}</span>
                    </div>
                    <button
                      onClick={() => setItemToRemove(item.id)}
                      className="text-coffee-300 hover:text-red-500 transition-colors p-2 bg-coffee-50 rounded-xl"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex justify-between items-end">
                    <div className="flex items-center gap-2 bg-pearl rounded-2xl p-1 border border-coffee-100/50 shadow-inner">
                      <button
                        onClick={() => onUpdateQuantity(item.id, -1)}
                        className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm hover:bg-coffee-50 text-coffee-900 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="font-black text-sm w-8 text-center text-coffee-900">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, 1)}
                        className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm hover:bg-coffee-50 text-coffee-900 transition-all"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    {showPrices && (
                      <div className="text-left">
                        <div className="font-black text-xl text-coffee-950">₪{(item.price * item.quantity).toFixed(2)}</div>
                        {item.quantity > 1 && (
                          <div className="text-[10px] font-bold text-coffee-400">₪{item.price} ליחידה</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Checkout */}
        <div className="lg:w-[400px] w-full lg:sticky lg:top-24">
          <div className="glass rounded-[2.5rem] premium-shadow p-8 border border-white/50">
            <h3 className="font-black text-2xl text-coffee-950 mb-8">סיכום הזמנה</h3>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-coffee-500 font-bold">
                <span>סכום ביניים</span>
                <span className="text-coffee-950">₪{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-coffee-500 font-bold">
                <span>משלוח</span>
                <span className="text-green-600">חינם</span>
              </div>
              <div className="h-px bg-coffee-100 my-4" />
              <div className="flex justify-between items-end">
                <span className="font-black text-coffee-950 text-lg">סה"כ לתשלום</span>
                <div className="text-left">
                  <div className="text-3xl font-black text-coffee-950">₪{total.toFixed(2)}</div>
                  <div className="text-[10px] font-bold text-coffee-400 uppercase tracking-tighter">כולל מע"מ</div>
                </div>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={isSubmitting}
              className={`w-full ${isSubmitting ? 'bg-coffee-100' : 'bg-coffee-900 hover:bg-coffee-950 hover:scale-[1.02]'} text-white font-black py-5 rounded-2xl shadow-2xl transition-all disabled:cursor-not-allowed flex items-center justify-center gap-3 active:scale-95`}
            >
              {isSubmitting ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <MessageCircle className="w-6 h-6" />
              )}
              {isSubmitting ? 'מעבד הזמנה...' : 'השלמת הזמנה בוואטסאפ'}
            </button>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center gap-2 text-center p-3 rounded-2xl bg-white/50 border border-coffee-50">
                <ShieldCheck className="w-5 h-5 text-green-600" />
                <span className="text-[10px] font-bold text-coffee-600 leading-tight">רכישה מאובטחת</span>
              </div>
              <div className="flex flex-col items-center gap-2 text-center p-3 rounded-2xl bg-white/50 border border-coffee-50">
                <Trash2 className="w-5 h-5 text-coffee-400" />
                <span className="text-[10px] font-bold text-coffee-600 leading-tight">ביטוח משלוח</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {itemToRemove !== null && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-coffee-950/40 backdrop-blur-md" onClick={() => setItemToRemove(null)} />
          <div className="relative bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl p-8 animate-in zoom-in-95 duration-300">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-red-50 text-red-600 rounded-[2rem] flex items-center justify-center mb-6">
                <AlertTriangle className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-coffee-950 mb-3">להסיר מהסל?</h3>
              <p className="text-coffee-500 font-medium mb-8 leading-relaxed">בטוחה שאת רוצה להוריד את הפריט הזה? תמיד אפשר להוסיף אותו שוב מאוחר יותר.</p>

              <div className="flex gap-4 w-full">
                <button
                  onClick={() => setItemToRemove(null)}
                  className="flex-1 py-4 rounded-xl font-bold text-coffee-400 hover:bg-coffee-50 transition-colors"
                >
                  לשמור בסל
                </button>
                <button
                  onClick={confirmRemove}
                  className="flex-1 py-4 rounded-xl bg-red-600 text-white font-black hover:bg-red-700 shadow-xl shadow-red-100 active:scale-95 transition-all"
                >
                  כן, להסיר
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;