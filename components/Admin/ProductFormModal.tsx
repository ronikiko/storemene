import React, { useState, useEffect } from 'react';
import { Product, Category } from '../../types';
import { X, Save } from 'lucide-react';

interface ProductFormModalProps {
  isOpen: boolean;
  productToEdit: Product | null;
  categories: Category[];
  onClose: () => void;
  onSave: (product: Product) => void;
}

const ProductFormModal: React.FC<ProductFormModalProps> = ({ isOpen, productToEdit, categories, onClose, onSave }) => {
  const [formData, setFormData] = useState<Partial<Product>>({
    title: '',
    price: 0,
    category: 'pantry',
    imageUrl: '',
    rating: 5,
    reviews: 0,
    isNew: false,
  });

  useEffect(() => {
    if (productToEdit) {
      setFormData(productToEdit);
    } else {
      // Reset for new product
      setFormData({
        title: '',
        price: 0,
        originalPrice: 0,
        category: categories.length > 0 ? categories[0].id : 'pantry',
        imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
        rating: 5,
        reviews: 0,
        isNew: true,
      });
    }
  }, [productToEdit, isOpen, categories]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!formData.title || !formData.price) return;

    const productPayload = {
      ...formData,
      id: productToEdit ? productToEdit.id : Date.now(), // Generate ID if new
    } as Product;

    onSave(productPayload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="text-lg font-bold">{productToEdit ? 'עריכת מוצר' : 'הוספת מוצר חדש'}</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[80vh]">
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">שם המוצר</label>
            <input 
              type="text" 
              required
              className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-black outline-none"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">מחיר (₪)</label>
              <input 
                type="number" 
                required
                step="0.1"
                className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-black outline-none"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">מחיר מקורי (אופציונלי)</label>
              <input 
                type="number" 
                step="0.1"
                className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-black outline-none"
                value={formData.originalPrice || ''}
                onChange={(e) => setFormData({...formData, originalPrice: e.target.value ? parseFloat(e.target.value) : undefined})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">קטגוריה</label>
            <select 
              className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-black outline-none"
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
            >
              {categories.filter(c => c.id !== 'new').map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">URL תמונה</label>
            <input 
              type="url" 
              required
              className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-black outline-none text-xs"
              value={formData.imageUrl}
              onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
            />
            {formData.imageUrl && (
              <img src={formData.imageUrl} alt="Preview" className="mt-2 w-20 h-20 object-cover rounded-lg border border-gray-200" />
            )}
          </div>

          <div className="flex items-center gap-3 pt-2">
            <input 
              type="checkbox" 
              id="isNew"
              checked={formData.isNew}
              onChange={(e) => setFormData({...formData, isNew: e.target.checked})}
              className="w-5 h-5 accent-black bg-white border-gray-300 rounded focus:ring-black"
            />
            <label htmlFor="isNew" className="text-sm font-medium cursor-pointer">האם המוצר חדש?</label>
          </div>

          <button 
            type="submit"
            className="w-full bg-black text-white font-bold py-3 rounded-xl mt-4 flex items-center justify-center gap-2 hover:bg-gray-800"
          >
            <Save className="w-5 h-5" />
            {productToEdit ? 'שמור שינויים' : 'צור מוצר'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductFormModal;