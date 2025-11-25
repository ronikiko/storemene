import React, { useState, useEffect } from 'react';
import { PriceList, Product } from '../../types';
import { X, Save, Search } from 'lucide-react';

interface PriceListFormModalProps {
  isOpen: boolean;
  priceListToEdit: PriceList | null;
  products: Product[];
  onClose: () => void;
  onSave: (priceList: PriceList) => void;
}

const PriceListFormModal: React.FC<PriceListFormModalProps> = ({ isOpen, priceListToEdit, products, onClose, onSave }) => {
  const [ formData, setFormData ] = useState<PriceList>({
    id: '',
    name: '',
    prices: {}
  });
  const [ searchTerm, setSearchTerm ] = useState('');

  useEffect(() => {
    if (priceListToEdit) {
      setFormData(priceListToEdit);
    } else {
      setFormData({
        id: '',
        name: '',
        prices: {}
      });
    }
  }, [ priceListToEdit, isOpen ]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.id || !formData.name) return;

    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Failed to save price list:', error);
    }
  };

  const handlePriceChange = (productId: number, price: string) => {
    const newPrices = { ...formData.prices };
    if (price === '') {
      delete newPrices[ productId ];
    } else {
      newPrices[ productId ] = parseFloat(price);
    }
    setFormData({ ...formData, prices: newPrices });
  };

  const filteredProducts = products.filter(p => p.title.includes(searchTerm));

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-100 flex-shrink-0">
          <h3 className="text-lg font-bold">{priceListToEdit ? 'עריכת מחירון' : 'הוספת מחירון חדש'}</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
          <div className="p-4 space-y-4 border-b border-gray-100 bg-gray-50 flex-shrink-0">
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-bold text-gray-700 mb-1">שם המחירון</label>
                <input
                  type="text"
                  required
                  className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-black outline-none"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="לדוגמה: סיטונאות VIP"
                />
              </div>
              <div className="w-1/3">
                <label className="block text-sm font-bold text-gray-700 mb-1">מזהה (ID)</label>
                <input
                  type="text"
                  required
                  disabled={!!priceListToEdit}
                  className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-black outline-none disabled:bg-gray-200"
                  value={formData.id}
                  onChange={(e) => setFormData({ ...formData, id: e.target.value.replace(/\s+/g, '_').toLowerCase() })}
                  placeholder="wholesale_vip"
                />
              </div>
            </div>
          </div>

          <div className="p-4 flex-1 overflow-hidden flex flex-col">
            <h4 className="font-bold mb-2">תמחור מוצרים</h4>

            <div className="relative mb-3">
              <input
                type="text"
                placeholder="חפש מוצר..."
                className="w-full pl-4 pr-10 py-2 border rounded-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            </div>

            <div className="flex-1 overflow-y-auto border rounded-lg custom-scrollbar">
              <table className="w-full text-right">
                <thead className="bg-gray-100 sticky top-0 text-xs text-gray-600">
                  <tr>
                    <th className="p-3">מוצר</th>
                    <th className="p-3">מחיר בסיס</th>
                    <th className="p-3">מחיר מיוחד</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredProducts.map(product => {
                    const hasCustomPrice = formData.prices[ product.id ] !== undefined;
                    return (
                      <tr key={product.id} className={hasCustomPrice ? "bg-yellow-50" : ""}>
                        <td className="p-3 text-sm flex items-center gap-2">
                          <img src={product.imageUrl} className="w-8 h-8 rounded object-cover" />
                          <span>{product.title}</span>
                        </td>
                        <td className="p-3 text-sm text-gray-500">₪{product.price}</td>
                        <td className="p-3">
                          <input
                            type="number"
                            step="0.1"
                            placeholder="רגיל"
                            className={`w-24 px-2 py-1 border rounded text-sm ${hasCustomPrice ? 'border-black font-bold bg-white' : 'border-gray-200'}`}
                            value={formData.prices[ product.id ] || ''}
                            onChange={(e) => handlePriceChange(product.id, e.target.value)}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-4 border-t border-gray-100 flex-shrink-0">
            <button
              type="submit"
              className="w-full bg-black text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-800"
            >
              <Save className="w-5 h-5" />
              {priceListToEdit ? 'שמור שינויים' : 'צור מחירון'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PriceListFormModal;