import React, { useState, useEffect } from 'react';
import { Category } from '../../types';
import { X, Save, Flame, Coffee, Apple, Milk, Croissant, Package, Sparkles, HelpCircle } from 'lucide-react';

interface CategoryFormModalProps {
  isOpen: boolean;
  categoryToEdit: Category | null;
  onClose: () => void;
  onSave: (category: Category) => void;
}

const AVAILABLE_ICONS = [
  { id: 'flame', component: Flame, label: 'להבה' },
  { id: 'coffee', component: Coffee, label: 'קפה' },
  { id: 'apple', component: Apple, label: 'תפוח' },
  { id: 'milk', component: Milk, label: 'חלב' },
  { id: 'croissant', component: Croissant, label: 'מאפה' },
  { id: 'package', component: Package, label: 'חבילה' },
  { id: 'sparkles', component: Sparkles, label: 'ניצוצות' },
];

const CategoryFormModal: React.FC<CategoryFormModalProps> = ({ isOpen, categoryToEdit, onClose, onSave }) => {
  const [ formData, setFormData ] = useState<Category>({
    id: '',
    name: '',
    icon: 'package',
  });

  useEffect(() => {
    if (categoryToEdit) {
      setFormData(categoryToEdit);
    } else {
      // Reset for new category
      setFormData({
        id: '',
        name: '',
        icon: 'package'
      });
    }
  }, [ categoryToEdit, isOpen ]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Simple validation
    if (!formData.id || !formData.name) return;

    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Failed to save category:', error);
    }
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
              onChange={(e) => setFormData({ ...formData, id: e.target.value.replace(/\s+/g, '_').toLowerCase() })}
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
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">בחר אייקון</label>
            <div className="grid grid-cols-4 gap-2">
              {AVAILABLE_ICONS.map((iconItem) => {
                const Icon = iconItem.component;
                const isSelected = formData.icon === iconItem.id;
                return (
                  <button
                    key={iconItem.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, icon: iconItem.id })}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${isSelected
                      ? 'border-black bg-black text-white shadow-md scale-105'
                      : 'border-gray-100 hover:border-gray-300 text-gray-600 hover:bg-gray-50'
                      }`}
                  >
                    <Icon className="w-6 h-6 mb-1" />
                    <span className="text-[10px] font-medium">{iconItem.label}</span>
                  </button>
                );
              })}
            </div>
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