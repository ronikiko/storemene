import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import CategoryNav from './components/CategoryNav';
import ProductCard from './components/ProductCard';
import QuickViewModal from './components/QuickViewModal';
import CartPage from './components/CartPage';
import AdminLogin from './components/Admin/AdminLogin';
import AdminDashboard from './components/Admin/AdminDashboard';
import ProductTable from './components/ProductTable';
import Pagination from './components/Pagination';
import { ToastProvider } from './context/ToastContext';
import { PRODUCTS as INITIAL_PRODUCTS, CATEGORIES as INITIAL_CATEGORIES, CUSTOMERS as INITIAL_CUSTOMERS, PRICE_LISTS as INITIAL_PRICE_LISTS } from './constants';
import { Product, CartItem, Category, Customer, PriceList } from './types';
import { Zap, AlertCircle, Lock, Users, LayoutGrid, List, Menu, Filter } from 'lucide-react';

const App: React.FC = () => {
  // --- Data State (Backend Simulation) ---
  const [ products, setProducts ] = useState<Product[]>(INITIAL_PRODUCTS);
  const [ categories, setCategories ] = useState<Category[]>(INITIAL_CATEGORIES);
  const [ customers, setCustomers ] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [ priceLists, setPriceLists ] = useState<PriceList[]>(INITIAL_PRICE_LISTS);

  // --- View State ---
  const [ currentView, setCurrentView ] = useState<'home' | 'checkout' | 'login' | 'admin'>('home');
  const [ isAdminAuthenticated, setIsAdminAuthenticated ] = useState(false);

  // --- Session State (Simulation) ---
  const [ activeCustomerId, setActiveCustomerId ] = useState<string | null>(null);

  // --- Shopping State ---
  const [ cartItems, setCartItems ] = useState<CartItem[]>([]);
  const [ quickViewProduct, setQuickViewProduct ] = useState<Product | null>(null);

  // --- Helper: Get Effective Price for a Product ---
  const getEffectiveProductInfo = (product: Product) => {
    let effectivePrice = product.price;
    let isSpecialPrice = false;

    if (activeCustomerId) {
      const customer = customers.find(c => c.id === activeCustomerId);
      if (customer?.priceListId) {
        const priceList = priceLists.find(pl => pl.id === customer.priceListId);
        if (priceList && priceList.prices[ product.id ] !== undefined) {
          effectivePrice = priceList.prices[ product.id ];
          isSpecialPrice = true;
        }
      }
    }

    return { ...product, price: effectivePrice, originalPrice: isSpecialPrice ? product.price : product.originalPrice, isSpecialPrice };
  };

  // --- Filter State ---
  const maxGlobalPrice = useMemo(() => {
    if (products.length === 0) return 100;
    return Math.ceil(Math.max(...products.map(p => p.price)));
  }, [ products ]);

  const [ selectedCategory, setSelectedCategory ] = useState<string | null>(null);
  const [ isFilterOpen, setIsFilterOpen ] = useState(false); // Kept for backward compat if needed, but mostly replaced
  const [ isMobileSidebarOpen, setIsMobileSidebarOpen ] = useState(false);
  const [ viewMode, setViewMode ] = useState<'grid' | 'table'>('grid');
  const [ currentPage, setCurrentPage ] = useState(1);
  const itemsPerPage = viewMode === 'grid' ? 12 : 20;

  // New Filters
  const [ sortBy, setSortBy ] = useState<string>('default');
  const [ selectedPriceRange, setSelectedPriceRange ] = useState<string | null>(null);
  const [ showOnlyNew, setShowOnlyNew ] = useState(false);
  const [ showOnlySale, setShowOnlySale ] = useState(false);

  // --- URL Simulation Logic ---
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenParam = params.get('token');
    if (tokenParam) {
      const customerExists = customers.find(c => c.token === tokenParam);
      if (customerExists) {
        setActiveCustomerId(customerExists.id);
      }
    }
  }, [ customers ]);

  // --- Cart Logic ---
  const cartCount = useMemo(() => cartItems.reduce((acc, item) => acc + item.quantity, 0), [ cartItems ]);

  const handleAddToCart = (product: Product, quantity: number = 1) => {
    const info = getEffectiveProductInfo(product);
    const itemToAdd = { ...product, price: info.price }; // Use effective price for cart

    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [ ...prev, { ...itemToAdd, quantity } ];
    });
  };

  const handleUpdateCartQuantity = (id: number, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const handleRemoveFromCart = (id: number) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const handleClearFilters = () => {
    setSelectedCategory(null);
    setSortBy('default');
    setSelectedPriceRange(null);
    setShowOnlyNew(false);
    setShowOnlySale(false);

    setCurrentPage(1);
    setIsFilterOpen(false);
  };

  // --- CRUD Handlers ---
  const handleLogin = () => { setIsAdminAuthenticated(true); setCurrentView('admin'); };

  // Products
  const handleAddProduct = (p: Product) => setProducts(prev => [ p, ...prev ]);
  const handleEditProduct = (p: Product) => setProducts(prev => prev.map(x => x.id === p.id ? p : x));
  const handleDeleteProduct = (id: number) => { setProducts(prev => prev.filter(x => x.id !== id)); handleRemoveFromCart(id); };

  // Categories
  const handleAddCategory = (c: Category) => setCategories(prev => [ ...prev, c ]);
  const handleEditCategory = (c: Category) => setCategories(prev => prev.map(x => x.id === c.id ? c : x));
  const handleDeleteCategory = (id: string) => setCategories(prev => prev.filter(x => x.id !== id));

  // Customers
  const handleAddCustomer = (c: Customer) => setCustomers(prev => [ ...prev, c ]);
  const handleEditCustomer = (c: Customer) => setCustomers(prev => prev.map(x => x.id === c.id ? c : x));
  const handleDeleteCustomer = (id: string) => setCustomers(prev => prev.filter(x => x.id !== id));

  // Price Lists
  const handleAddPriceList = (pl: PriceList) => setPriceLists(prev => [ ...prev, pl ]);
  const handleEditPriceList = (pl: PriceList) => setPriceLists(prev => prev.map(x => x.id === pl.id ? pl : x));
  const handleDeletePriceList = (id: string) => setPriceLists(prev => prev.filter(x => x.id !== id));

  // --- Filtering & Sorting ---
  const filteredProducts = products.filter(product => {
    // 1. Category
    if (selectedCategory && selectedCategory !== 'new' && product.category !== selectedCategory) return false;
    if (selectedCategory === 'new' && !product.isNew) return false;

    // 2. Status Filters
    if (showOnlyNew && !product.isNew) return false;
    if (showOnlySale && (!product.discount || product.discount <= 0)) return false;

    // 3. Price Range
    const effectiveInfo = getEffectiveProductInfo(product);
    const price = effectiveInfo.price;

    if (selectedPriceRange) {
      if (selectedPriceRange === 'under-50' && price >= 50) return false;
      if (selectedPriceRange === '50-100' && (price < 50 || price >= 100)) return false;
      if (selectedPriceRange === '100-200' && (price < 100 || price >= 200)) return false;
      if (selectedPriceRange === '200-plus' && price < 200) return false;
    }

    return true;
  }).sort((a, b) => {
    const priceA = getEffectiveProductInfo(a).price;
    const priceB = getEffectiveProductInfo(b).price;

    switch (sortBy) {
      case 'price-asc': return priceA - priceB;
      case 'price-desc': return priceB - priceA;
      case 'name-asc': return a.title.localeCompare(b.title);
      default: return 0; // 'default' order (usually by ID or added date)
    }
  });

  // --- Quick View Navigation ---
  const handleNextProduct = () => {
    if (!quickViewProduct) return;
    const currentIndex = filteredProducts.findIndex(p => p.id === quickViewProduct.id);
    if (currentIndex === -1) return;
    const nextIndex = (currentIndex + 1) % filteredProducts.length;
    setQuickViewProduct(filteredProducts[ nextIndex ]);
  };

  const handlePrevProduct = () => {
    if (!quickViewProduct) return;
    const currentIndex = filteredProducts.findIndex(p => p.id === quickViewProduct.id);
    if (currentIndex === -1) return;
    const prevIndex = (currentIndex - 1 + filteredProducts.length) % filteredProducts.length;
    setQuickViewProduct(filteredProducts[ prevIndex ]);
  };

  // --- View Rendering Helpers ---
  const renderLogin = () => <AdminLogin onLogin={handleLogin} onBack={() => setCurrentView('home')} />;

  const renderAdmin = () => {
    if (!isAdminAuthenticated) return renderLogin();
    return (
      <AdminDashboard
        products={products} categories={categories} customers={customers} priceLists={priceLists}
        onAddProduct={handleAddProduct} onEditProduct={handleEditProduct} onDeleteProduct={handleDeleteProduct}
        onAddCategory={handleAddCategory} onEditCategory={handleEditCategory} onDeleteCategory={handleDeleteCategory}
        onAddCustomer={handleAddCustomer} onEditCustomer={handleEditCustomer} onDeleteCustomer={handleDeleteCustomer}
        onAddPriceList={handleAddPriceList} onEditPriceList={handleEditPriceList} onDeletePriceList={handleDeletePriceList}
        onLogout={() => { setIsAdminAuthenticated(false); setCurrentView('home'); }}
        onGoHome={() => setCurrentView('home')}
      />
    );
  };

  const renderCheckout = () => (
    <div className="min-h-screen bg-white font-sans">
      <Header
        cartCount={cartCount}
        onCartClick={() => setCurrentView('checkout')}
        onLogoClick={() => setCurrentView('home')}
        onUserClick={() => isAdminAuthenticated ? setCurrentView('admin') : setCurrentView('login')}
      />
      <CartPage cartItems={cartItems} onUpdateQuantity={handleUpdateCartQuantity} onRemoveItem={handleRemoveFromCart} onBack={() => setCurrentView('home')} />
    </div>
  );

  const renderHome = () => (
    <div className="min-h-screen pb-20 bg-coffee-50 font-sans selection:bg-coffee-200">
      <Header
        cartCount={cartCount}
        onCartClick={() => setCurrentView('checkout')}
        onLogoClick={() => setCurrentView('home')}
        onUserClick={() => isAdminAuthenticated ? setCurrentView('admin') : setCurrentView('login')}
      />

      <div className="container mx-auto px-4 mt-6 mb-8">
        <CategoryNav
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={(id) => { setSelectedCategory(id); setCurrentPage(1); }}
        />
      </div>

      <div className="container mx-auto px-4 py-8 flex gap-8">

        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <Sidebar
            selectedPriceRange={selectedPriceRange}
            onPriceRangeChange={setSelectedPriceRange}
            showOnlyNew={showOnlyNew}
            onToggleNew={() => setShowOnlyNew(!showOnlyNew)}
            showOnlySale={showOnlySale}
            onToggleSale={() => setShowOnlySale(!showOnlySale)}
          />
        </div>

        {/* Mobile Sidebar Drawer */}
        {isMobileSidebarOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileSidebarOpen(false)} />
            <div className="relative bg-white w-4/5 max-w-xs h-full shadow-2xl p-6 overflow-y-auto animate-in slide-in-from-right">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-coffee-900">סינון</h2>
                <button onClick={() => setIsMobileSidebarOpen(false)} className="p-2 text-coffee-500">
                  <span className="sr-only">סגור</span>
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <Sidebar
                selectedPriceRange={selectedPriceRange}
                onPriceRangeChange={setSelectedPriceRange}
                showOnlyNew={showOnlyNew}
                onToggleNew={() => setShowOnlyNew(!showOnlyNew)}
                showOnlySale={showOnlySale}
                onToggleSale={() => setShowOnlySale(!showOnlySale)}
              />
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 min-h-[600px]">
          {/* Top Toolbar */}
          <div className="bg-white p-4 rounded-xl border border-coffee-100 shadow-sm mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
              <button
                onClick={() => setIsMobileSidebarOpen(true)}
                className="md:hidden flex items-center gap-2 text-coffee-900 font-bold"
              >
                <Filter className="w-5 h-5" />
                <span>סינון</span>
              </button>
              <span className="text-sm text-coffee-500 font-medium hidden md:block">
                {filteredProducts.length} מוצרים
              </span>
            </div>
            <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
              <div className="flex items-center gap-2">
                <span className="text-sm text-coffee-700 hidden md:inline">מיון:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-coffee-50 border-none rounded-lg text-sm py-2 pl-8 pr-4 text-coffee-900 font-medium focus:ring-1 focus:ring-coffee-200"
                >
                  <option value="default">מומלץ</option>
                  <option value="price-asc">מחיר: נמוך לגבוה</option>
                  <option value="price-desc">מחיר: גבוה לנמוך</option>
                  <option value="name-asc">שם: א-ת</option>
                </select>
              </div>
              <div className="flex bg-coffee-50 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white text-coffee-900 shadow-sm' : 'text-coffee-400 hover:text-coffee-600'}`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-1.5 rounded-md transition-all ${viewMode === 'table' ? 'bg-white text-coffee-900 shadow-sm' : 'text-coffee-400 hover:text-coffee-600'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {filteredProducts.length > 0 ? (
            <>
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((product) => (
                    <ProductCard
                      key={product.id}
                      product={getEffectiveProductInfo(product)}
                      onAddToCart={handleAddToCart}
                      onQuickView={setQuickViewProduct}
                    />
                  ))}
                </div>
              ) : (
                <ProductTable
                  products={filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map(p => getEffectiveProductInfo(p))}
                  onAddToCart={handleAddToCart}
                  onQuickView={setQuickViewProduct}
                />
              )}

              {filteredProducts.length > itemsPerPage && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={Math.ceil(filteredProducts.length / itemsPerPage)}
                  onPageChange={setCurrentPage}
                />
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-coffee-400 bg-white rounded-2xl border border-coffee-50">
              <AlertCircle className="w-16 h-16 mb-6 opacity-50" />
              <p className="text-xl font-bold text-coffee-800">לא נמצאו מוצרים.</p>
              <button onClick={handleClearFilters} className="mt-6 text-coffee-600 font-bold underline hover:text-coffee-900 hover:no-underline">נקה סינונים</button>
            </div>
          )}
        </main>
      </div>
    </div>
  );

  return (
    <ToastProvider>
      {currentView === 'login' && renderLogin()}
      {currentView === 'admin' && renderAdmin()}
      {currentView === 'checkout' && renderCheckout()}
      {currentView === 'home' && renderHome()}

      {/* Simulation Bar (Active Customer Indicator) */}
      {activeCustomerId && (() => {
        const activeCustomer = customers.find(c => c.id === activeCustomerId);
        const activePriceList = activeCustomer?.priceListId ? priceLists.find(pl => pl.id === activeCustomer.priceListId) : null;

        return (
          <div className="fixed bottom-16 md:bottom-4 left-4 z-50 bg-coffee-900/95 backdrop-blur text-white px-5 py-3 rounded-full shadow-xl text-xs flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 border border-white/10">
            <Users className="w-4 h-4 text-green-400" />
            <span className="opacity-75 font-medium">צפה כלקוח:</span>
            <span className="font-bold text-white text-sm">
              {activeCustomer?.name}
              {activePriceList && <span className="text-green-400 ml-1">({activePriceList.name})</span>}
            </span>
          </div>
        );
      })()}

      {quickViewProduct && (
        <QuickViewModal
          product={getEffectiveProductInfo(quickViewProduct)}
          isOpen={!!quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          onAddToCart={handleAddToCart}
          onNext={handleNextProduct}
          onPrev={handlePrevProduct}
        />
      )}
    </ToastProvider>
  );
};

export default App;