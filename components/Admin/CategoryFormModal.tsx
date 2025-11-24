import React, { useState, useEffect } from 'react';
import { Category } from '../../types';
import { X, Save } from 'lucide-react';

interface CategoryFormModalProps {
  isOpen: boolean;
  categoryToEdit: Category | null;
  onClose: () => void;
  onSave: (category: Category) => void;
}

const CategoryFormModal: React.FC<CategoryFormModalProps> = ({ isOpen, categoryToEdit, onClose, onSave }) => {
  const [formData, setFormData] = useState<Category>({
    id: '',
    name: '',
    image: '',
  });

  useEffect(() => {
    if (categoryToEdit) {
      setFormData(categoryToEdit);
    } else {
      // Reset for new category
      setFormData({ 
        id: '', 
        name: '', 
        image: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&w=200&q=80' 
      });
    }
  }, [categoryToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!formData.id || !formData.name) return;

    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="text-lg font-bold">{categoryToEdit ? 'עריכת קטגוריה' : 'הוספת קטגוריה חדשה'}</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">מזהה קטגוריה (ID באנגלית)</label>
            <input 
              type="text" 
              required
              disabled={!!categoryToEdit} // Disable ID editing for existing categories to prevent breaking links
              className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-black outline-none disabled:bg-gray-100 disabled:text-gray-500"
              value={formData.id}
              onChange={(e) => setFormData({...formData, id: e.target.value.replace(/\s+/g, '_').toLowerCase()})}
              placeholder="e.g., dairy"
            />
            {!categoryToEdit && <p className="text-xs text-gray-500 mt-1">משמש לזיהוי פנימי (ללא רווחים)</p>}
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">שם הקטגוריה</label>
            <input 
              type="text" 
              required
              className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-black outline-none"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">URL תמונה</label>
            <input 
              type="url" 
              required
              className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-black outline-none text-xs"
              value={formData.image}
              onChange={(e) => setFormData({...formData, image: e.target.value})}
            />
            {formData.image && (
              <img src={formData.image} alt="Preview" className="mt-2 w-16 h-16 object-cover rounded-full border border-gray-200" />
            )}
          </div>

          <button 
            type="submit"
            className="w-full bg-black text-white font-bold py-3 rounded-xl mt-4 flex items-center justify-center gap-2 hover:bg-gray-800"
          >
            <Save className="w-5 h-5" />
            {categoryToEdit ? 'שמור שינויים' : 'צור קטגוריה'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CategoryFormModal;