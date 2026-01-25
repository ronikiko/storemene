import React, { useState } from 'react';
import { Lock, ArrowRight, X } from 'lucide-react';

interface CustomerPINModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (pin: string) => Promise<void>;
    customerName: string;
}

const CustomerPINModal: React.FC<CustomerPINModalProps> = ({ isOpen, onClose, onSubmit, customerName }) => {
    const [ pin, setPin ] = useState('');
    const [ isSubmitting, setIsSubmitting ] = useState(false);
    const [ error, setError ] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (pin.length !== 4) return;

        setIsSubmitting(true);
        setError(null);
        try {
            await onSubmit(pin);
        } catch (err: any) {
            setError(err.message || 'סיסמא שגויה, נסה שוב');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCharInput = (val: string) => {
        if (val.length <= 4 && /^\d*$/.test(val)) {
            setPin(val);
            if (val.length === 4) {
                // Optional: auto-submit or just wait for button
            }
        }
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-coffee-950/80 backdrop-blur-md" />

            <div className="relative bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
                <div className="p-8 text-center">
                    <div className="w-16 h-16 bg-coffee-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Lock className="w-8 h-8 text-coffee-900" />
                    </div>

                    <h2 className="text-2xl font-black text-coffee-950 mb-2">שלום, {customerName}</h2>
                    <p className="text-coffee-600 mb-8 text-sm">נא הקלד את 4 הספרות של הקוד שקיבלת כדי להיכנס לקטלוג</p>

                    <form onSubmit={handleSubmit} className="space-y-6 relative">
                        <div className="flex flex-row-reverse justify-center gap-3">
                            {[ 0, 1, 2, 3 ].map((index) => (
                                <div
                                    key={index}
                                    className={`w-12 h-16 rounded-xl border-2 flex items-center justify-center text-2xl font-black transition-all ${pin.length > index
                                        ? 'border-coffee-900 bg-coffee-50 text-coffee-950'
                                        : 'border-coffee-100 bg-white text-coffee-200'
                                        }`}
                                >
                                    {pin.length > index ? '•' : ''}
                                </div>
                            ))}
                        </div>

                        <input
                            type="text"
                            pattern="\d*"
                            inputMode="numeric"
                            maxLength={4}
                            autoFocus
                            className="absolute opacity-0 w-full h-16 top-0 left-0 cursor-default"
                            value={pin}
                            onChange={(e) => handleCharInput(e.target.value)}
                        />

                        {error && (
                            <div className="text-red-500 text-xs font-bold animate-shake">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={pin.length !== 4 || isSubmitting}
                            className={`w-full py-4 rounded-2xl font-black flex items-center justify-center gap-2 transition-all ${pin.length === 4 && !isSubmitting
                                ? 'bg-coffee-900 text-white shadow-xl hover:bg-black active:scale-95'
                                : 'bg-coffee-100 text-coffee-300 cursor-not-allowed'
                                }`}
                        >
                            {isSubmitting ? 'מאמת...' : (
                                <>
                                    כניסה לקטלוג
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CustomerPINModal;
