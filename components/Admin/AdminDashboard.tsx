import React, { useState, useRef } from 'react';
import { Product, Category, Customer, PriceList } from '../../types';
import { Plus, Pencil, Trash2, LogOut, Package, Grid, Users, Tag, Download, Upload, Link as LinkIcon } from 'lucide-react';
import ProductFormModal from './ProductFormModal';
import CategoryFormModal from './CategoryFormModal';
import CustomerFormModal from './CustomerFormModal';
import PriceListFormModal from './PriceListFormModal';
import { useToast } from '../../context/ToastContext';

interface AdminDashboardProps {
  products: Product[];
  categories: Category[];
  customers: Customer[];
  priceLists: PriceList[];

  onAddProduct: (product: Product) => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (id: number) => void;

  onAddCategory: (category: Category) => void;
  onEditCategory: (category: Category) => void;
  onDeleteCategory: (id: string) => void;

  onAddCustomer: (customer: Customer) => void;
  onEditCustomer: (customer: Customer) => void;
  onDeleteCustomer: (id: string) => void;

  onAddPriceList: (pl: PriceList) => void;
  onEditPriceList: (pl: PriceList) => void;
  onDeletePriceList: (id: string) => void;

  onLogout: () => void;
  onGoHome: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({
  products, categories, customers, priceLists,
  onAddProduct, onEditProduct, onDeleteProduct,
  onAddCategory, onEditCategory, onDeleteCategory,
  onAddCustomer, onEditCustomer, onDeleteCustomer,
  onAddPriceList, onEditPriceList, onDeletePriceList,
  onLogout, onGoHome
}) => {
  const [ activeTab, setActiveTab ] = useState<'products' | 'categories' | 'customers' | 'pricelists'>('products');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { success, error, info } = useToast();

  // Modal States
  const [ isProductModalOpen, setIsProductModalOpen ] = useState(false);
  const [ editingProduct, setEditingProduct ] = useState<Product | null>(null);

  const [ isCategoryModalOpen, setIsCategoryModalOpen ] = useState(false);
  const [ editingCategory, setEditingCategory ] = useState<Category | null>(null);

  const [ isCustomerModalOpen, setIsCustomerModalOpen ] = useState(false);
  const [ editingCustomer, setEditingCustomer ] = useState<Customer | null>(null);

  const [ isPriceListModalOpen, setIsPriceListModalOpen ] = useState(false);
  const [ editingPriceList, setEditingPriceList ] = useState<PriceList | null>(null);

  // Handlers
  const handleSaveProduct = (p: Product) => editingProduct ? onEditProduct(p) : onAddProduct(p);
  const handleSaveCategory = (c: Category) => editingCategory ? onEditCategory(c) : onAddCategory(c);
  const handleSaveCustomer = (c: Customer) => editingCustomer ? onEditCustomer(c) : onAddCustomer(c);
  const handleSavePriceList = (pl: PriceList) => editingPriceList ? onEditPriceList(pl) : onAddPriceList(pl);

  // --- CSV Export Logic ---
  const handleExport = () => {
    let data: any[] = [];
    let filename = '';

    switch (activeTab) {
      case 'products':
        data = products;
        filename = 'products.csv';
        break;
      case 'categories':
        data = categories;
        filename = 'categories.csv';
        break;
      case 'customers':
        data = customers;
        filename = 'customers.csv';
        break;
      case 'pricelists':
        data = priceLists;
        filename = 'pricelists.csv';
        break;
    }

    if (!data.length) {
      alert('אין נתונים לייצוא');
      return;
    }

    const allKeys = Array.from(new Set(data.flatMap(Object.keys)));

    // Create CSV content
    const csvContent = [
      allKeys.join(','),
      ...data.map(item => allKeys.map(key => {
        let val = item[ key ];
        if (val === undefined || val === null) return '';
        if (typeof val === 'object') {
          // JSON stringify objects (like prices in PriceList) and escape quotes
          val = JSON.stringify(val).replace(/"/g, '""');
          return `"${val}"`;
        }
        val = String(val).replace(/"/g, '""');
        return `"${val}"`;
      }).join(','))
    ].join('\n');

    // Trigger download
    const blob = new Blob([ csvContent ], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- CSV Import Logic ---
  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Reset
      fileInputRef.current.click();
    }
  };

  const parseCSVLine = (line: string): string[] => {
    const result = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[ i ];
      if (char === '"') {
        if (inQuotes && line[ i + 1 ] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current);
    return result;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[ 0 ];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text) return;

      const lines = text.split('\n').filter(line => line.trim() !== '');
      if (lines.length < 2) return;

      const headers = lines[ 0 ].split(',').map(h => h.trim());

      lines.slice(1).forEach(line => {
        const values = parseCSVLine(line);
        const item: any = {};

        headers.forEach((header, index) => {
          let val = values[ index ];
          // Try to clean quotes if they exist wrapping the value
          // Note: parseCSVLine handles structural quotes, but we might still have type conversion to do

          if (activeTab === 'products') {
            if ([ 'price', 'originalPrice', 'discount', 'rating', 'reviews', 'id' ].includes(header)) {
              item[ header ] = val ? Number(val) : undefined;
            } else if (header === 'isNew') {
              item[ header ] = val === 'true';
            } else {
              item[ header ] = val;
            }
          } else if (activeTab === 'pricelists' && header === 'prices') {
            try {
              item[ header ] = JSON.parse(val || '{}');
            } catch (e) {
              item[ header ] = {};
            }
          } else {
            // Default string
            item[ header ] = val;
          }
        });

        // Add or Update based on ID check
        // Note: This matches simple ID checks. In a real app, strict validation is needed.
        if (activeTab === 'products') {
          const exists = products.find(p => p.id === item.id);
          exists ? onEditProduct(item) : onAddProduct(item);
        } else if (activeTab === 'categories') {
          const exists = categories.find(c => c.id === item.id);
          exists ? onEditCategory(item) : onAddCategory(item);
        } else if (activeTab === 'customers') {
          const exists = customers.find(c => c.id === item.id);
          exists ? onEditCustomer(item) : onAddCustomer(item);
        } else if (activeTab === 'pricelists') {
          const exists = priceLists.find(p => p.id === item.id);
          exists ? onEditPriceList(item) : onAddPriceList(item);
        }
      });
      alert('ייבוא הושלם בהצלחה!');
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans pb-20">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".csv"
        className="hidden"
      />

      {/* Top Bar */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-black">ניהול חנות</h1>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={onGoHome} className="text-sm font-medium text-gray-600 hover:text-black hidden md:block">
              חזרה לאתר
            </button>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors text-sm font-bold"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden md:inline">התנתק</span>
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">

        {/* Tabs & Actions */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-6 gap-4">

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 bg-white p-2 rounded-xl shadow-sm border border-gray-100">
            {[
              { id: 'products', label: 'מוצרים', icon: Package },
              { id: 'categories', label: 'קטגוריות', icon: Grid },
              { id: 'customers', label: 'לקוחות', icon: Users },
              { id: 'pricelists', label: 'מחירונים', icon: Tag },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === tab.id ? 'bg-black text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap self-end xl:self-auto">
            <button
              onClick={handleImportClick}
              className="bg-white text-gray-700 border border-gray-300 px-4 py-3 rounded-full font-bold shadow-sm hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm"
              title="ייבוא מקובץ CSV"
            >
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">ייבוא</span>
            </button>
            <button
              onClick={handleExport}
              className="bg-white text-gray-700 border border-gray-300 px-4 py-3 rounded-full font-bold shadow-sm hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm"
              title="ייצוא לקובץ CSV"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">ייצוא</span>
            </button>
            <button
              onClick={() => {
                if (activeTab === 'products') { setEditingProduct(null); setIsProductModalOpen(true); }
                if (activeTab === 'categories') { setEditingCategory(null); setIsCategoryModalOpen(true); }
                if (activeTab === 'customers') { setEditingCustomer(null); setIsCustomerModalOpen(true); }
                if (activeTab === 'pricelists') { setEditingPriceList(null); setIsPriceListModalOpen(true); }
              }}
              className="bg-blue-600 text-white px-6 py-3 rounded-full font-bold shadow-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              הוסף חדש
            </button>
          </div>
        </div>

        {/* Content Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            {activeTab === 'products' && (
              <table className="w-full text-right">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-medium">
                  <tr>
                    <th className="px-6 py-4">תמונה</th>
                    <th className="px-6 py-4">שם מוצר</th>
                    <th className="px-6 py-4">קטגוריה</th>
                    <th className="px-6 py-4">מחיר</th>
                    <th className="px-6 py-4">פעולות</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <img src={product.imageUrl} alt="" className="w-12 h-12 object-cover rounded-lg border border-gray-200" />
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900">{product.title}</td>
                      <td className="px-6 py-4 text-gray-500 text-sm">{categories.find(c => c.id === product.category)?.name || product.category}</td>
                      <td className="px-6 py-4 font-bold">₪{product.price.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button onClick={() => { setEditingProduct(product); setIsProductModalOpen(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"><Pencil className="w-4 h-4" /></button>
                          <button onClick={() => onDeleteProduct(product.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-full"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeTab === 'categories' && (
              <table className="w-full text-right">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-medium">
                  <tr>
                    <th className="px-6 py-4">תמונה</th>
                    <th className="px-6 py-4">מזהה</th>
                    <th className="px-6 py-4">שם</th>
                    <th className="px-6 py-4">פעולות</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {categories.map((cat) => (
                    <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4"><img src={cat.image} className="w-10 h-10 rounded-full" /></td>
                      <td className="px-6 py-4 text-sm font-mono">{cat.id}</td>
                      <td className="px-6 py-4 font-bold">{cat.name}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button onClick={() => { setEditingCategory(cat); setIsCategoryModalOpen(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"><Pencil className="w-4 h-4" /></button>
                          <button onClick={() => onDeleteCategory(cat.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-full"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeTab === 'customers' && (
              <table className="w-full text-right">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-medium">
                  <tr>
                    <th className="px-6 py-4">שם הלקוח</th>
                    <th className="px-6 py-4">אימייל</th>
                    <th className="px-6 py-4">טלפון</th>
                    <th className="px-6 py-4">מחירון</th>
                    <th className="px-6 py-4">פעולות</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {customers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-bold">{customer.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{customer.email}</td>
                      <td className="px-6 py-4 text-sm">{customer.phone}</td>
                      <td className="px-6 py-4">
                        {customer.priceListId ? (
                          <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-bold">
                            {priceLists.find(pl => pl.id === customer.priceListId)?.name || customer.priceListId}
                          </span>
                        ) : <span className="text-gray-400 text-xs">רגיל</span>}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              const url = `${window.location.origin}?token=${customer.token}`;
                              navigator.clipboard.writeText(url);
                              alert('הקישור הועתק ללוח: ' + url);
                            }}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-full"
                            title="העתק קישור לחנות"
                          >
                            <LinkIcon className="w-4 h-4" />
                          </button>
                          <button onClick={() => { setEditingCustomer(customer); setIsCustomerModalOpen(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"><Pencil className="w-4 h-4" /></button>
                          <button onClick={() => onDeleteCustomer(customer.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-full"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeTab === 'pricelists' && (
              <table className="w-full text-right">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-medium">
                  <tr>
                    <th className="px-6 py-4">שם המחירון</th>
                    <th className="px-6 py-4">מזהה</th>
                    <th className="px-6 py-4">מספר מוצרים מתומחרים</th>
                    <th className="px-6 py-4">פעולות</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {priceLists.map((pl) => (
                    <tr key={pl.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-bold">{pl.name}</td>
                      <td className="px-6 py-4 text-sm font-mono text-gray-500">{pl.id}</td>
                      <td className="px-6 py-4 text-sm">{Object.keys(pl.prices).length}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button onClick={() => { setEditingPriceList(pl); setIsPriceListModalOpen(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"><Pencil className="w-4 h-4" /></button>
                          <button onClick={() => onDeletePriceList(pl.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-full"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      <ProductFormModal
        isOpen={isProductModalOpen}
        productToEdit={editingProduct}
        categories={categories}
        onClose={() => setIsProductModalOpen(false)}
        onSave={handleSaveProduct}
      />
      <CategoryFormModal
        isOpen={isCategoryModalOpen}
        categoryToEdit={editingCategory}
        onClose={() => setIsCategoryModalOpen(false)}
        onSave={handleSaveCategory}
      />
      <CustomerFormModal
        isOpen={isCustomerModalOpen}
        customerToEdit={editingCustomer}
        priceLists={priceLists}
        onClose={() => setIsCustomerModalOpen(false)}
        onSave={handleSaveCustomer}
      />
      <PriceListFormModal
        isOpen={isPriceListModalOpen}
        priceListToEdit={editingPriceList}
        products={products}
        onClose={() => setIsPriceListModalOpen(false)}
        onSave={handleSavePriceList}
      />
    </div>
  );
};

export default AdminDashboard;