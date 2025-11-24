import React, { useState, useEffect } from 'react';
import { Customer, PriceList } from '../../types';
import { X, Save } from 'lucide-react';

interface CustomerFormModalProps {
  isOpen: boolean;
  customerToEdit: Customer | null;
  priceLists: PriceList[];
  onClose: () => void;
  onSave: (customer: Customer) => void;
}

const CustomerFormModal: React.FC<CustomerFormModalProps> = ({ isOpen, customerToEdit, priceLists, onClose, onSave }) => {
  const [ formData, setFormData ] = useState<Customer>({
    id: '',
    name: '',
    email: '',
    phone: '',
    priceListId: '',
    token: ''
  });

  useEffect(() => {
    if (customerToEdit) {
      setFormData(customerToEdit);
    } else {
      setFormData({
        id: '',
        name: '',
        email: '',
        phone: '',
        priceListId: '',
        token: ''
      });
    }
  }, [ customerToEdit, isOpen ]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    const payload = {
      ...formData,
      id: formData.id || Date.now().toString(),
      token: formData.token || (Math.random().toString(36).substring(2) + Date.now().toString(36))
    };
    onSave(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="text-lg font-bold">{customerToEdit ? 'עריכת לקוח' : 'הוספת לקוח חדש'}</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">שם מלא</label>
            <input
              type="text"
              required
              className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-black outline-none"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">אימייל</label>
            <input
              type="email"
              required
              className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-black outline-none"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">טלפון</label>
            <input
              type="tel"
              className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-black outline-none"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">מחירון משויך</label>
            <select
              className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-black outline-none"
              value={formData.priceListId || ''}
              onChange={(e) => setFormData({ ...formData, priceListId: e.target.value })}
            >
              <option value="">ללא מחירון (מחיר רגיל)</option>
              {priceLists.map(pl => (
                <option key={pl.id} value={pl.id}>{pl.name}</option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white font-bold py-3 rounded-xl mt-4 flex items-center justify-center gap-2 hover:bg-gray-800"
          >
            <Save className="w-5 h-5" />
            {customerToEdit ? 'שמור שינויים' : 'צור לקוח'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CustomerFormModal;