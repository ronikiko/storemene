import React, { useState, useRef, useEffect } from 'react';
import { Routes, Route, useNavigate, useParams, Navigate } from 'react-router-dom';
import { Product, Category, Customer, PriceList, Order } from '../../types';
import { Plus, Pencil, Trash2, LogOut, Package, Grid, Users, Tag, Download, Upload, Link as LinkIcon, HelpCircle, DollarSign, Search, ShoppingBag, X, ArrowRight, AlertTriangle, Lock, Flame, Coffee, Apple, Milk, Croissant, Sparkles } from 'lucide-react';
import ProductFormModal from './ProductFormModal';
import CategoryFormModal from './CategoryFormModal';
import CustomerFormModal from './CustomerFormModal';
import PriceListFormModal from './PriceListFormModal';
import OrderFormModal from './OrderFormModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import UserFormModal from './UserFormModal';
import OrdersTable from './OrdersTable';
import { useToast } from '../../context/ToastContext';
import { productsApi, categoriesApi, customersApi, priceListsApi, settingsApi, ordersApi, usersApi } from '../../services/api';

interface AdminDashboardProps {
  products: Product[];
  categories: Category[];
  customers: Customer[];
  priceLists: PriceList[];
  orders: Order[];

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

  onUpdateOrder: (order: Order) => void;
  onAddOrder: (order: Order) => void;

  showPrices: boolean;
  onUpdateShowPrices: (value: boolean) => void;

  onLogout: () => void;
  onGoHome: () => void;
}

const iconMap: Record<string, React.ElementType> = {
  'flame': Flame,
  'coffee': Coffee,
  'apple': Apple,
  'milk': Milk,
  'croissant': Croissant,
  'package': Package,
  'sparkles': Sparkles,
};

const AdminDashboard: React.FC<AdminDashboardProps> = ({
  products, categories, customers, priceLists, orders,
  onAddProduct, onEditProduct, onDeleteProduct,
  onAddCategory, onEditCategory, onDeleteCategory,
  onAddCustomer, onEditCustomer, onDeleteCustomer,
  onAddPriceList, onEditPriceList, onDeletePriceList,
  onUpdateOrder, onAddOrder,
  showPrices, onUpdateShowPrices,
  onLogout, onGoHome
}) => {
  const navigate = useNavigate();
  const { "*": splat } = useParams();
  const activeTab = splat || 'products';
  const [ systemUsers, setSystemUsers ] = useState<any[]>([]);
  const [ isUserModalOpen, setIsUserModalOpen ] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { success, error: toastError, info } = useToast();

  // Pagination States
  const [ currentPage, setCurrentPage ] = useState(1);
  const [ itemsPerPage, setItemsPerPage ] = useState(20);

  // Search State
  const [ searchTerm, setSearchTerm ] = useState('');

  // Modal States
  const [ isProductModalOpen, setIsProductModalOpen ] = useState(false);
  const [ editingProduct, setEditingProduct ] = useState<Product | null>(null);

  const [ isCategoryModalOpen, setIsCategoryModalOpen ] = useState(false);
  const [ editingCategory, setEditingCategory ] = useState<Category | null>(null);

  const [ isCustomerModalOpen, setIsCustomerModalOpen ] = useState(false);
  const [ editingCustomer, setEditingCustomer ] = useState<Customer | null>(null);

  const [ isPriceListModalOpen, setIsPriceListModalOpen ] = useState(false);
  const [ editingPriceList, setEditingPriceList ] = useState<PriceList | null>(null);

  const [ isOrderModalOpen, setIsOrderModalOpen ] = useState(false);
  const [ editingOrder, setEditingOrder ] = useState<Order | null>(null);

  const [ viewingPriceListCustomers, setViewingPriceListCustomers ] = useState<PriceList | null>(null);

  // Delete Confirmation Modal State
  const [ deleteConfirm, setDeleteConfirm ] = useState<{
    isOpen: boolean;
    type: 'product' | 'category' | 'customer' | 'pricelist' | null;
    id: number | string | null;
    name: string;
  }>({ isOpen: false, type: null, id: null, name: '' });

  // Reset pagination when switching tabs, changing items per page, or searching
  useEffect(() => {
    setCurrentPage(1);
  }, [ activeTab, itemsPerPage, searchTerm ]);

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    }
  }, [ activeTab ]);

  const fetchUsers = async () => {
    try {
      const data = await usersApi.getAll();
      setSystemUsers(data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      toastError('Failed to fetch users');
    }
  };

  // Handlers
  const handleSaveProduct = (p: Product) => editingProduct ? onEditProduct(p) : onAddProduct(p);
  const handleSaveCategory = (c: Category) => editingCategory ? onEditCategory(c) : onAddCategory(c);
  const handleSaveCustomer = (c: Customer) => editingCustomer ? onEditCustomer(c) : onAddCustomer(c);
  const handleSavePriceList = (pl: PriceList) => editingPriceList ? onEditPriceList(pl) : onAddPriceList(pl);
  const handleSaveOrder = (o: Order) => editingOrder ? onUpdateOrder(o) : onAddOrder(o);

  const handleSaveUser = async (userData: any) => {
    try {
      await usersApi.create(userData);
      success('משתמש נוסף בהצלחה');
      fetchUsers();
      setIsUserModalOpen(false);
    } catch (err) {
      toastError(err instanceof Error ? err.message : 'שגיאה ביצירת משתמש');
      throw err;
    }
  };

  // Delete Handlers with Confirmation
  const handleDeleteClick = (type: 'product' | 'category' | 'customer' | 'pricelist', id: number | string, name: string) => {
    setDeleteConfirm({ isOpen: true, type, id, name });
  };

  const handleConfirmDelete = () => {
    if (!deleteConfirm.id || !deleteConfirm.type) return;

    switch (deleteConfirm.type) {
      case 'product':
        onDeleteProduct(deleteConfirm.id as number);
        break;
      case 'category':
        onDeleteCategory(deleteConfirm.id as string);
        break;
      case 'customer':
        onDeleteCustomer(deleteConfirm.id as string);
        break;
      case 'pricelist':
        onDeletePriceList(deleteConfirm.id as string);
        break;
    }

    setDeleteConfirm({ isOpen: false, type: null, id: null, name: '' });
  };

  const handleCancelDelete = () => {
    setDeleteConfirm({ isOpen: false, type: null, id: null, name: '' });
  };

  // --- Pagination Logic ---
  const getCurrentData = () => {
    let data: any[] = [];
    const searchLower = searchTerm.toLowerCase().trim();

    switch (activeTab) {
      case 'products':
        data = searchLower
          ? products.filter(p =>
            p.title.toLowerCase().includes(searchLower) ||
            categories.find(c => c.id === p.category)?.name.toLowerCase().includes(searchLower)
          )
          : products;
        break;
      case 'categories':
        data = searchLower
          ? categories.filter(c =>
            c.name.toLowerCase().includes(searchLower) ||
            c.id.toLowerCase().includes(searchLower)
          )
          : categories;
        break;
      case 'customers':
        data = searchLower
          ? customers.filter(c =>
            c.name.toLowerCase().includes(searchLower) ||
            c.email.toLowerCase().includes(searchLower) ||
            c.phone.includes(searchLower)
          )
          : customers;
        break;
      case 'pricelists':
        data = searchLower
          ? priceLists.filter(pl =>
            pl.name.toLowerCase().includes(searchLower) ||
            pl.id.toLowerCase().includes(searchLower)
          )
          : priceLists;
        break;
      case 'orders':
        data = searchLower
          ? orders.filter(o =>
            o.customerName.toLowerCase().includes(searchLower) ||
            o.id.toLowerCase().includes(searchLower) ||
            o.customerPhone?.includes(searchLower)
          )
          : orders;
        break;
      case 'users':
        data = searchLower
          ? systemUsers.filter(u =>
            u.name.toLowerCase().includes(searchLower) ||
            u.email.toLowerCase().includes(searchLower) ||
            u.role.toLowerCase().includes(searchLower)
          )
          : systemUsers;
        break;
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return {
      data: data.slice(startIndex, endIndex),
      total: data.length,
      totalPages: Math.ceil(data.length / itemsPerPage),
      startIndex: startIndex + 1,
      endIndex: Math.min(endIndex, data.length)
    };
  };

  const paginationInfo = getCurrentData();
  const paginatedProducts = activeTab === 'products' ? paginationInfo.data : products;
  const paginatedCategories = activeTab === 'categories' ? paginationInfo.data : categories;
  const paginatedCustomers = activeTab === 'customers' ? paginationInfo.data : customers;
  const paginatedPriceLists = activeTab === 'pricelists' ? paginationInfo.data : priceLists;
  const paginatedUsers = activeTab === 'users' ? paginationInfo.data : systemUsers;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
  };


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
      case 'users':
        data = systemUsers.map(({ password, ...rest }) => rest); // Exclude password
        filename = 'users.csv';
        break;
    }

    if (!data.length) {
      alert('אין נתונים לייצוא');
      return;
    }

    const allKeys = Array.from(new Set(data.flatMap(Object.keys)));

    // Create CSV content with UTF-8 BOM for proper Hebrew encoding in Excel
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

    // Add BOM (Byte Order Mark) for UTF-8 to ensure Excel recognizes Hebrew text
    const csvWithBOM = '\uFEFF' + csvContent;

    // Trigger download
    const blob = new Blob([ csvWithBOM ], { type: 'text/csv;charset=utf-8;' });
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
      let text = event.target?.result as string;
      if (!text) return;

      // Remove BOM if present
      if (text.charCodeAt(0) === 0xFEFF) {
        text = text.slice(1);
      }

      // Check if text contains Hebrew characters, if not try different encoding
      const hasHebrew = /[\u0590-\u05FF]/.test(text);

      if (!hasHebrew && /[\x00-\x1F\x7F-\x9F]/.test(text)) {
        // Text has gibberish/control characters but no Hebrew - try windows-1255
        alert('הקובץ לא מקודד ב-UTF-8. אנא שמור את הקובץ כ-"CSV UTF-8" ב-Excel ונסה שוב.');
        return;
      }

      const lines = text.split('\n').filter(line => line.trim() !== '');
      if (lines.length < 2) return;

      // Parse headers using the same CSV parser to handle quoted fields
      const headers = parseCSVLine(lines[ 0 ]).map(h => h.replace(/^"|"$/g, '').trim());

      lines.slice(1).forEach(line => {
        const values = parseCSVLine(line);
        const item: any = {};

        headers.forEach((header, index) => {
          // Remove surrounding quotes and trim
          let val = values[ index ]?.replace(/^"|"$/g, '').trim() || '';

          if (activeTab === 'products') {
            if ([ 'price', 'originalPrice', 'discount', 'rating', 'reviews', 'id' ].includes(header)) {
              item[ header ] = val && val !== '' ? Number(val) : (header === 'id' ? 0 : undefined);
            } else if (header === 'isNew') {
              item[ header ] = val === 'true' || val === '1';
            } else {
              item[ header ] = val || '';
            }
          } else if (activeTab === 'pricelists' && header === 'prices') {
            try {
              item[ header ] = JSON.parse(val || '{}');
            } catch (e) {
              item[ header ] = {};
            }
          } else {
            // Default string
            item[ header ] = val || '';
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
        } else if (activeTab === 'users') {
          // For users, we only support adding new ones via CSV for now, or updating if ID exists.
          // This is a simplified example.
          const exists = systemUsers.find(u => u.id === item.id);
          if (exists) {
            // In a real app, you'd have an onEditUser prop
            console.warn('User update via CSV not fully implemented. Consider adding onEditUser prop.');
          } else {
            handleSaveUser(item); // Assuming item has username, password, role
          }
        }
      });
      alert('ייבוא הושלם בהצלחה!');
    };
    reader.readAsText(file, 'UTF-8');
  };

  const stats = [
    { label: 'מוצרים במלאי', value: products.length, icon: Package, color: 'bg-blue-50 text-blue-600' },
    { label: 'הזמנות ממתינות', value: orders.filter(o => o.status === 'pending').length, icon: ShoppingBag, color: 'bg-orange-50 text-orange-600' },
    { label: 'לקוחות רשומים', value: customers.length, icon: Users, color: 'bg-purple-50 text-purple-600' },
    { label: 'מחזור מכירות', value: `₪${orders.reduce((acc, o) => acc + o.totalAmount, 0).toLocaleString()}`, icon: DollarSign, color: 'bg-green-50 text-green-600' },
  ];

  return (
    <div className="min-h-screen bg-pearl font-sans pb-20 selection:bg-coffee-100">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".csv"
        className="hidden"
      />

      {/* Top Bar */}
      <div className="glass border-b border-coffee-100/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-coffee-900 rounded-xl flex items-center justify-center shadow-lg">
              <Lock className="w-5 h-5 text-champagne-400" />
            </div>
            <h1 className="text-xl font-black text-coffee-950 uppercase tracking-tighter">ניהול מערכת</h1>
          </div>
          <div className="flex items-center gap-3">
            {/* Show Prices Toggle */}
            <div className="flex items-center gap-3 bg-white/50 px-4 py-2 rounded-2xl border border-coffee-100/50 shadow-sm">
              <span className="text-[10px] font-black text-coffee-400 uppercase tracking-widest hidden md:inline">הצגת מחירים</span>
              <button
                onClick={() => onUpdateShowPrices(!showPrices)}
                className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${showPrices ? 'bg-coffee-900' : 'bg-coffee-200'}`}
              >
                <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 ${showPrices ? 'right-7' : 'right-1'}`} />
              </button>
            </div>
            <button onClick={onGoHome} className="text-xs font-black text-coffee-500 hover:text-coffee-900 transition-colors hidden md:block uppercase tracking-wider">
              חזרה לחנות
            </button>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2.5 rounded-2xl transition-all text-xs font-black"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden md:inline">התנתקות</span>
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {stats.map((stat, idx) => (
            <div key={idx} className="glass p-6 rounded-[2rem] premium-shadow border border-white/50 flex flex-col gap-4 group hover:scale-[1.02] transition-transform duration-300">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.color} shadow-sm group-hover:rotate-12 transition-transform`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <div className="text-[10px] font-black text-coffee-400 uppercase tracking-widest mb-1">{stat.label}</div>
                <div className="text-2xl font-black text-coffee-950">{stat.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs & Actions */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-8 gap-6">

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 p-1.5 bg-coffee-100/30 rounded-3xl border border-coffee-100/50 w-full xl:w-auto overflow-x-auto no-scrollbar">
            {[
              { id: 'products', label: 'מוצרים', icon: Package },
              { id: 'categories', label: 'קטגוריות', icon: Grid },
              { id: 'customers', label: 'לקוחות', icon: Users },
              { id: 'pricelists', label: 'מחירונים', icon: Tag },
              { id: 'orders', label: 'הזמנות', icon: ShoppingBag },
              { id: 'users', label: 'מנהלים', icon: Lock },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => navigate(`/admin/${tab.id}`)}
                className={`
                  flex items-center gap-3 px-6 py-3.5 font-black text-xs transition-all rounded-2xl whitespace-nowrap
                  ${activeTab === tab.id
                    ? 'bg-coffee-900 text-white shadow-xl shadow-coffee-200 translate-y-[-1px]'
                    : 'text-coffee-400 hover:text-coffee-600 hover:bg-white/50'}
                `}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4 w-full xl:w-auto">
            {/* Search Field */}
            <div className="relative w-full md:max-w-md">
              <input
                type="text"
                placeholder="חיפוש חופשי..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/50 border border-coffee-100 rounded-2xl px-12 py-3.5 text-sm focus:ring-4 focus:ring-coffee-100 outline-none font-medium placeholder:text-coffee-300 shadow-inner"
              />
              <Search className="absolute right-4 top-3.5 w-5 h-5 text-coffee-300" />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 w-full md:w-auto justify-end">
              <button
                onClick={handleImportClick}
                className="bg-white text-coffee-600 border border-coffee-100 px-5 py-3.5 rounded-2xl font-black shadow-sm hover:bg-coffee-50 transition-all flex items-center gap-2 text-xs"
                title="ייבוא מקובץ CSV"
              >
                <Upload className="w-4 h-4" />
                <span className="hidden sm:inline">ייבוא</span>
              </button>
              <button
                onClick={handleExport}
                className="bg-white text-coffee-600 border border-coffee-100 px-5 py-3.5 rounded-2xl font-black shadow-sm hover:bg-coffee-50 transition-all flex items-center gap-2 text-xs"
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
                  if (activeTab === 'orders') { setEditingOrder(null); setIsOrderModalOpen(true); }
                  if (activeTab === 'users') { setIsUserModalOpen(true); }
                }}
                className="bg-coffee-950 text-champagne-50 px-8 py-3.5 rounded-2xl font-black shadow-2xl hover:bg-black transition-all flex items-center gap-2 text-xs active:scale-95 translate-y-[-1px]"
              >
                <Plus className="w-5 h-5" />
                חדש
              </button>
            </div>
          </div>
        </div>

        {/* Content Table */}
        <div className="glass rounded-[2rem] premium-shadow overflow-hidden border border-white/50">
          <Routes>
            <Route path="products" element={
              <div className="overflow-x-auto">
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
                    {paginatedProducts.map((product) => (
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
                            <button onClick={() => handleDeleteClick('product', product.id, product.title)} className="p-2 text-red-600 hover:bg-red-50 rounded-full"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            } />

            <Route path="categories" element={
              <div className="overflow-x-auto">
                <table className="w-full text-right">
                  <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-medium">
                    <tr>
                      <th className="px-6 py-4">אייקון</th>
                      <th className="px-6 py-4">מזהה</th>
                      <th className="px-6 py-4">שם</th>
                      <th className="px-6 py-4">פעולות</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {paginatedCategories.map((cat) => {
                      const IconComponent = iconMap[ cat.icon ] || HelpCircle;
                      return (
                        <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                              <IconComponent className="w-6 h-6" />
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm font-mono">{cat.id}</td>
                          <td className="px-6 py-4 font-bold">{cat.name}</td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <button onClick={() => { setEditingCategory(cat); setIsCategoryModalOpen(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"><Pencil className="w-4 h-4" /></button>
                              <button onClick={() => handleDeleteClick('category', cat.id, cat.name)} className="p-2 text-red-600 hover:bg-red-50 rounded-full"><Trash2 className="w-4 h-4" /></button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            } />

            <Route path="customers" element={
              <div className="overflow-x-auto">
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
                    {paginatedCustomers.map((customer) => (
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
                            <button onClick={() => handleDeleteClick('customer', customer.id, customer.name)} className="p-2 text-red-600 hover:bg-red-50 rounded-full"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            } />

            <Route path="pricelists" element={
              <div className="overflow-x-auto">
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
                    {paginatedPriceLists.map((pl) => (
                      <tr key={pl.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-bold">{pl.name}</td>
                        <td className="px-6 py-4 text-sm font-mono text-gray-500">{pl.id}</td>
                        <td className="px-6 py-4 text-sm">{Object.keys(pl.prices).length}</td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => setViewingPriceListCustomers(pl)}
                              className="p-2 text-purple-600 hover:bg-purple-50 rounded-full"
                              title="צפה בלקוחות משויכים"
                            >
                              <Users className="w-4 h-4" />
                            </button>
                            <button onClick={() => { setEditingPriceList(pl); setIsPriceListModalOpen(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"><Pencil className="w-4 h-4" /></button>
                            <button onClick={() => handleDeleteClick('pricelist', pl.id, pl.name)} className="p-2 text-red-600 hover:bg-red-50 rounded-full"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            } />

            <Route path="users" element={
              <div className="overflow-x-auto">
                <table className="w-full text-right">
                  <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-medium">
                    <tr>
                      <th className="px-6 py-4">שם</th>
                      <th className="px-6 py-4">אימייל</th>
                      <th className="px-6 py-4">תפקיד</th>
                      <th className="px-6 py-4">פעולות</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {paginatedUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-bold">{user.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{user.email}</td>
                        <td className="px-6 py-4 text-sm">{user.role}</td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            } />

            <Route path="orders" element={
              <div className="p-4 bg-gray-50 border-t border-gray-100">
                <OrdersTable orders={paginationInfo.data} onUpdateStatus={onUpdateOrder} onEdit={(order) => { setEditingOrder(order); setIsOrderModalOpen(true); }} />
              </div>
            } />

            <Route path="/" element={<Navigate to="products" replace />} />
          </Routes>
        </div>
        {/* Pagination Controls */}
        {paginationInfo.total > 0 && (
          <div className="px-8 py-6 bg-white/50 border-t border-coffee-100/50 flex flex-col sm:flex-row items-center justify-between gap-6">
            {/* Items per page selector */}
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-black text-coffee-400 uppercase tracking-widest">הצג פריטים:</span>
              <div className="flex bg-pearl p-1 rounded-xl border border-coffee-100 shadow-inner">
                {[ 20, 50, 100 ].map(val => (
                  <button
                    key={val}
                    onClick={() => handleItemsPerPageChange(val)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all ${itemsPerPage === val ? 'bg-coffee-900 text-white shadow-xl translate-y-[-1px]' : 'text-coffee-400 hover:text-coffee-600 hover:bg-white'}`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>

            {/* Status Info */}
            <div className="text-xs font-bold text-coffee-500 bg-coffee-50 px-4 py-2.5 rounded-full border border-coffee-100/50">
              מציג <span className="text-coffee-950">{paginationInfo.startIndex}-{paginationInfo.endIndex}</span> מתוך <span className="text-coffee-950">{paginationInfo.total}</span>
            </div>

            {/* Page Selector */}
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-coffee-100 text-coffee-900 disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:bg-coffee-50 shadow-sm"
              >
                <ArrowRight className="w-4 h-4 rotate-180" />
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: paginationInfo.totalPages }, (_, i) => i + 1)
                  .filter(p => p === 1 || p === paginationInfo.totalPages || (p >= currentPage - 1 && p <= currentPage + 1))
                  .map((p, idx, arr) => (
                    <React.Fragment key={p}>
                      {idx > 0 && arr[ idx - 1 ] !== p - 1 && <span className="text-coffee-300 mx-1">...</span>}
                      <button
                        onClick={() => handlePageChange(p)}
                        className={`w-10 h-10 rounded-xl text-xs font-black transition-all ${currentPage === p ? 'bg-coffee-900 text-white shadow-xl translate-y-[-1px]' : 'text-coffee-400 hover:bg-white border border-transparent hover:border-coffee-100'}`}
                      >
                        {p}
                      </button>
                    </React.Fragment>
                  ))
                }
              </div>

              <button
                disabled={currentPage === paginationInfo.totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-coffee-100 text-coffee-900 disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:bg-coffee-50 shadow-sm"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
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
        onClose={() => setIsProductModalOpen(false)}
        onSave={handleSavePriceList}
      />
      <OrderFormModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        onSave={handleSaveOrder}
        customers={customers}
        products={products}
        priceLists={priceLists}
        orderToEdit={editingOrder}
      />
      <UserFormModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        onSave={handleSaveUser}
      />

      {/* Delete Confirmation Modal */}
      {
        deleteConfirm.isOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-coffee-950/40 backdrop-blur-md" onClick={handleCancelDelete} />
            <div className="relative bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl p-8 animate-in zoom-in-95 duration-300">
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-red-50 text-red-600 rounded-[2rem] flex items-center justify-center mb-6">
                  <AlertTriangle className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black text-coffee-950 mb-3">מחיקת {deleteConfirm.type === 'product' ? 'מוצר' : deleteConfirm.type === 'category' ? 'קטגוריה' : deleteConfirm.type === 'customer' ? 'לקוח' : 'מחירון'}</h3>
                <p className="text-coffee-500 font-medium mb-8 leading-relaxed">האם את בטוחה שברצונך למחוק את <span className="text-coffee-950 font-bold">{deleteConfirm.name}</span>? פעולה זו אינה ניתנת לביטול.</p>

                <div className="flex gap-4 w-full">
                  <button
                    onClick={handleCancelDelete}
                    className="flex-1 py-4 rounded-xl font-bold text-coffee-400 hover:bg-coffee-50 transition-colors"
                  >
                    ביטול
                  </button>
                  <button
                    onClick={handleConfirmDelete}
                    className="flex-1 py-4 rounded-xl bg-red-600 text-white font-black hover:bg-red-700 shadow-xl shadow-red-100 active:scale-95 transition-all"
                  >
                    כן, למחוק
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      }

      {/* Price List Customers Modal */}
      {
        viewingPriceListCustomers && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-coffee-950/40 backdrop-blur-md" onClick={() => setViewingPriceListCustomers(null)} />
            <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
              <div className="p-8 border-b border-coffee-100/50 flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-black text-coffee-950 leading-tight">לקוחות משויכים</h3>
                  <p className="text-sm font-bold text-coffee-400 uppercase tracking-widest">{viewingPriceListCustomers.name}</p>
                </div>
                <button
                  onClick={() => setViewingPriceListCustomers(null)}
                  className="w-12 h-12 bg-coffee-50 text-coffee-400 rounded-2xl flex items-center justify-center hover:bg-coffee-100 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-8 max-h-[60vh] overflow-y-auto no-scrollbar">
                {customers.filter(c => c.priceListId === viewingPriceListCustomers.id).length > 0 ? (
                  <div className="space-y-4">
                    {customers.filter(c => c.priceListId === viewingPriceListCustomers.id).map(customer => (
                      <div key={customer.id} className="flex items-center justify-between p-5 bg-pearl rounded-2xl border border-coffee-100/50 group hover:border-coffee-300 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-coffee-900 font-black">
                            {customer.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-black text-coffee-950">{customer.name}</div>
                            <div className="text-xs font-bold text-coffee-400">{customer.email}</div>
                          </div>
                        </div>
                        <div className="text-sm font-black text-coffee-900 bg-white px-3 py-1.5 rounded-lg shadow-sm">
                          {customer.phone}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <div className="w-20 h-20 bg-coffee-50 text-coffee-200 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Users className="w-10 h-10" />
                    </div>
                    <p className="text-lg font-black text-coffee-950 mb-1">אין לקוחות משויכים</p>
                    <p className="text-sm font-bold text-coffee-400 uppercase tracking-wider">שייכי לקוחות למחירון זה כדי לראות אותם כאן</p>
                  </div>
                )}
              </div>

              <div className="p-8 border-t border-coffee-100/50 bg-coffee-50/50">
                <button
                  onClick={() => setViewingPriceListCustomers(null)}
                  className="w-full bg-coffee-900 text-white font-black py-4 rounded-2xl shadow-xl shadow-coffee-100 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  סגור
                </button>
              </div>
            </div>
          </div>
        )
      }
    </div >
  );
};

export default AdminDashboard;