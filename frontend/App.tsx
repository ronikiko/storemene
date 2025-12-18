import React, { useState, useMemo, useEffect } from 'react';
import Header from './components/Header';
import { Routes, Route, useNavigate, useLocation, Navigate, useSearchParams } from 'react-router-dom';
import CategoryNav from './components/CategoryNav';
import ProductCard from './components/ProductCard';
import QuickViewModal from './components/QuickViewModal';
import CartPage from './components/CartPage';
import AdminLogin from './components/Admin/AdminLogin';
import AdminDashboard from './components/Admin/AdminDashboard';
import ProductTable from './components/ProductTable';
import Pagination from './components/Pagination';
import { ToastProvider, useToast } from './context/ToastContext';
import { Product, CartItem, Category, Customer, PriceList, Order } from './types';
import { Zap, AlertCircle, Lock, Users, LayoutGrid, List, Menu, Filter, Search } from 'lucide-react';
import { productsApi, categoriesApi, customersApi, priceListsApi, authApi, settingsApi, ordersApi } from './services/api';

const App: React.FC = () => {
  // --- Data State (From Backend) ---
  const [ products, setProducts ] = useState<Product[]>([]);
  const [ categories, setCategories ] = useState<Category[]>([]);
  const [ customers, setCustomers ] = useState<Customer[]>([]);
  const [ priceLists, setPriceLists ] = useState<PriceList[]>([]);
  const [ orders, setOrders ] = useState<Order[]>([]);
  const [ showPrices, setShowPrices ] = useState(true);
  const { success } = useToast();

  // --- Loading & Error States ---
  const [ isLoading, setIsLoading ] = useState(true);
  const [ error, setError ] = useState<string | null>(null);

  // --- Navigation & Auth ---
  const navigate = useNavigate();
  const location = useLocation();
  const [ searchParams ] = useSearchParams();
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

  const [ selectedCategory, setSelectedCategory ] = useState<string | null>(null);
  const [ isMobileSidebarOpen, setIsMobileSidebarOpen ] = useState(false);
  const [ viewMode, setViewMode ] = useState<'grid' | 'table'>('grid');
  const [ currentPage, setCurrentPage ] = useState(1);
  const itemsPerPage = viewMode === 'grid' ? 12 : 20;

  // New Filters
  const [ sortBy, setSortBy ] = useState<string>('default');
  const [ selectedPriceRange, setSelectedPriceRange ] = useState<string | null>(null);
  const [ showOnlyNew, setShowOnlyNew ] = useState(false);
  const [ showOnlySale, setShowOnlySale ] = useState(false);
  const [ cartAnimating, setCartAnimating ] = useState(false);
  const [ searchTerm, setSearchTerm ] = useState('');

  // --- Fetch Data from Backend ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [ productsData, categoriesData, customersData, priceListsData, settingsData, ordersData ] = await Promise.all([
          productsApi.getAll(),
          categoriesApi.getAll(),
          customersApi.getAll(),
          priceListsApi.getAll(),
          settingsApi.getAll(),
          ordersApi.getAll(),
        ]);

        setProducts(productsData);
        setCategories(categoriesData);
        setCustomers(customersData);
        setPriceLists(priceListsData);
        setOrders(ordersData);

        // Load show_prices setting
        const showPricesSetting = settingsData.find((s: any) => s.id === 'show_prices');
        if (showPricesSetting) {
          setShowPrices(showPricesSetting.value === 'true');
        }

        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
        console.error('Failed to fetch data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // --- URL Customer Token Logic ---
  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (tokenParam && customers.length > 0) {
      const customerExists = customers.find(c => c.token === tokenParam);
      if (customerExists) {
        setActiveCustomerId(customerExists.id);
      }
    }
  }, [ customers, searchParams ]);

  // --- Cart Logic ---
  const cartCount = useMemo(() => cartItems.reduce((acc, item) => acc + item.quantity, 0), [ cartItems ]);

  const handleAddToCart = (product: Product, quantity: number = 1) => {
    const info = getEffectiveProductInfo(product);
    const itemToAdd = { ...product, price: info.price }; // Use effective price for cart

    // Trigger cart animation
    setCartAnimating(true);
    setTimeout(() => setCartAnimating(false), 600);

    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        success(`${product.title} - נוסף!`);
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      success(`${product.title} - נוסף לסל!`);
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
    setSearchTerm('');

    setCurrentPage(1);
  };

  // --- Settings Handler ---
  const handleUpdateShowPrices = async (value: boolean) => {
    try {
      await settingsApi.update('show_prices', value.toString());
      setShowPrices(value);
    } catch (err) {
      console.error('Failed to update show_prices setting:', err);
    }
  };

  // --- Auth Handler ---
  const handleLogin = () => {
    setIsAdminAuthenticated(true);
    navigate('/admin');
  };

  // Products
  const handleAddProduct = async (p: Product) => {
    try {
      const newProduct = await productsApi.create(p);
      setProducts(prev => [ newProduct, ...prev ]);
    } catch (err) {
      console.error('Failed to add product:', err);
      throw err;
    }
  };

  const handleEditProduct = async (p: Product) => {
    try {
      const updatedProduct = await productsApi.update(p.id, p);
      setProducts(prev => prev.map(x => x.id === p.id ? updatedProduct : x));
    } catch (err) {
      console.error('Failed to update product:', err);
      throw err;
    }
  };

  const handleDeleteProduct = async (id: number) => {
    try {
      await productsApi.delete(id);
      setProducts(prev => prev.filter(x => x.id !== id));
      handleRemoveFromCart(id);
    } catch (err) {
      console.error('Failed to delete product:', err);
      throw err;
    }
  };

  // Categories
  const handleAddCategory = async (c: Category) => {
    try {
      const newCategory = await categoriesApi.create(c);
      setCategories(prev => [ ...prev, newCategory ]);
    } catch (err) {
      console.error('Failed to add category:', err);
      throw err;
    }
  };

  const handleEditCategory = async (c: Category) => {
    try {
      const updatedCategory = await categoriesApi.update(c.id, c);
      setCategories(prev => prev.map(x => x.id === c.id ? updatedCategory : x));
    } catch (err) {
      console.error('Failed to update category:', err);
      throw err;
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      await categoriesApi.delete(id);
      setCategories(prev => prev.filter(x => x.id !== id));
    } catch (err) {
      console.error('Failed to delete category:', err);
      throw err;
    }
  };

  // Customers
  const handleAddCustomer = async (c: Customer) => {
    try {
      const newCustomer = await customersApi.create(c);
      setCustomers(prev => [ ...prev, newCustomer ]);
    } catch (err) {
      console.error('Failed to add customer:', err);
      throw err;
    }
  };

  const handleEditCustomer = async (c: Customer) => {
    try {
      const updatedCustomer = await customersApi.update(c.id, c);
      setCustomers(prev => prev.map(x => x.id === c.id ? updatedCustomer : x));
    } catch (err) {
      console.error('Failed to update customer:', err);
      throw err;
    }
  };

  const handleDeleteCustomer = async (id: string) => {
    try {
      await customersApi.delete(id);
      setCustomers(prev => prev.filter(x => x.id !== id));
    } catch (err) {
      console.error('Failed to delete customer:', err);
      throw err;
    }
  };

  // Price Lists
  const handleAddPriceList = async (pl: PriceList) => {
    try {
      const newPriceList = await priceListsApi.create(pl);
      setPriceLists(prev => [ ...prev, newPriceList ]);
    } catch (err) {
      console.error('Failed to add price list:', err);
      throw err;
    }
  };

  const handleEditPriceList = async (pl: PriceList) => {
    try {
      const updatedPriceList = await priceListsApi.update(pl.id, pl);
      setPriceLists(prev => prev.map(x => x.id === pl.id ? updatedPriceList : x));
    } catch (err) {
      console.error('Failed to update price list:', err);
      throw err;
    }
  };

  const handleDeletePriceList = async (id: string) => {
    try {
      await priceListsApi.delete(id);
      setPriceLists(prev => prev.filter(x => x.id !== id));
    } catch (err) {
      console.error('Failed to delete price list:', err);
      throw err;
    }
  };

  // --- Filtering & Sorting ---
  const filteredProducts = products.filter(product => {
    // 0. Search Term
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      const matchesTitle = product.title.toLowerCase().includes(searchLower);
      const matchesCategory = categories.find(c => c.id === product.category)?.name.toLowerCase().includes(searchLower);
      if (!matchesTitle && !matchesCategory) return false;
    }

    // 1. Category
    if (selectedCategory && selectedCategory !== 'new' && product.category !== selectedCategory) return false;
    if (selectedCategory === 'new' && !product.isNew) return false;

    // 2. Status Filters
    if (showOnlyNew && !product.isNew) return false;
    if (showOnlySale && (!product.discount || product.discount <= 0)) return false;


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
  const handlePlaceOrder = async (order: Order) => {
    try {
      const savedOrder = await ordersApi.create(order);
      setOrders(prev => [ savedOrder, ...prev ]);
      setCartItems([]);
      navigate('/');
      success('ההזמנה התקבלה בהצלחה!');
    } catch (err) {
      console.error('Failed to place order:', err);
      // Fallback in case of API failure for some reason (optional, but good for UX)
      // For now just rethrow or show alert
      alert('שגיאה בביצוע ההזמנה. אנא נסה שוב.');
    }
  };

  const handleUpdateOrder = async (updatedOrder: Order) => {
    try {
      const savedOrder = await ordersApi.update(updatedOrder.id, updatedOrder);
      setOrders(prev => prev.map(o => o.id === savedOrder.id ? savedOrder : o));
    } catch (err) {
      console.error('Failed to update order:', err);
    }
  };

  const renderLogin = () => <AdminLogin onLogin={handleLogin} onBack={() => navigate('/')} />;

  const renderAdmin = () => {
    if (!isAdminAuthenticated) return renderLogin();
    return (
      <AdminDashboard
        products={products}
        categories={categories}
        customers={customers}
        priceLists={priceLists}
        orders={orders}

        onAddProduct={handleAddProduct}
        onEditProduct={handleEditProduct}
        onDeleteProduct={handleDeleteProduct}

        onAddCategory={handleAddCategory}
        onEditCategory={handleEditCategory}
        onDeleteCategory={handleDeleteCategory}

        onAddCustomer={handleAddCustomer}
        onEditCustomer={handleEditCustomer}
        onDeleteCustomer={handleDeleteCustomer}

        onAddPriceList={handleAddPriceList}
        onEditPriceList={handleEditPriceList}
        onDeletePriceList={handleDeletePriceList}

        onUpdateOrder={handleUpdateOrder}

        showPrices={showPrices}
        onUpdateShowPrices={handleUpdateShowPrices}

        onLogout={() => { setIsAdminAuthenticated(false); navigate('/'); }}
        onGoHome={() => navigate('/')}
      />
    );
  };

  const Layout = ({ children }: { children: React.ReactNode }) => (
    <div className="flex flex-col min-h-screen">
      <Header
        cartCount={cartCount}
        onCartClick={() => navigate('/checkout')}
        onLogoClick={() => navigate('/')}
        onUserClick={() => isAdminAuthenticated ? navigate('/admin') : navigate('/login')}
        cartAnimating={cartAnimating}
      />
      <main className="flex-grow">
        {children}
      </main>
    </div>
  );

  const renderCheckout = () => (
    <CartPage
      cartItems={cartItems}
      onUpdateQuantity={handleUpdateCartQuantity}
      onRemoveItem={handleRemoveFromCart}
      onBack={() => navigate('/')}
      showPrices={showPrices}
      onPlaceOrder={handlePlaceOrder}
      activeCustomerId={activeCustomerId}
    />
  );

  const renderHome = () => (
    <div className="min-h-screen pb-20 bg-gray-50 font-sans selection:bg-gray-200">

      <div className="container mx-auto px-4 mt-4 mb-2">
        <CategoryNav
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={(id) => { setSelectedCategory(id); setCurrentPage(1); }}
        />
      </div>

      <div className="container mx-auto px-4 py-4 flex gap-8">
        {/* Main Content */}
        <main className="flex-1 min-h-[600px] min-w-0">
          {/* Top Toolbar */}
          <div className="bg-white p-4 rounded-xl border border-coffee-100 shadow-sm mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start flex-1">
              <span className="text-sm text-coffee-500 font-medium hidden md:block whitespace-nowrap">
                {filteredProducts.length} מוצרים
              </span>

              {/* Search Field */}
              <div className="relative flex-1 w-full md:max-w-md md:mx-4">
                <input
                  type="text"
                  placeholder="חיפוש מוצרים..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-4 pr-10 py-2 text-sm focus:ring-2 focus:ring-coffee-900 focus:border-transparent outline-none transition-all"
                />
                <Search className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute left-3 top-2.5 text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
              <span className="text-sm text-coffee-500 font-medium md:hidden whitespace-nowrap">
                {filteredProducts.length} מוצרים
              </span>
              <div className="flex justify-end items-center gap-2 bg-coffee-50 rounded-lg p-1">
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
                      showPrices={showPrices}
                    />
                  ))}
                </div>
              ) : (
                <ProductTable
                  products={filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map(p => getEffectiveProductInfo(p))}
                  onAddToCart={handleAddToCart}
                  onQuickView={setQuickViewProduct}
                  showPrices={showPrices}
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
    <>
      {/* Loading State */}
      {isLoading && (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-coffee-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-coffee-900 font-bold">טוען נתונים...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {!isLoading && error && (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="text-center max-w-md">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">שגיאה בטעינת הנתונים</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <p className="text-sm text-gray-500 mb-4">
              ודא שהשרת פועל על http://localhost:3001
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-coffee-900 text-white px-6 py-3 rounded-lg font-bold hover:bg-coffee-800"
            >
              נסה שוב
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      {!isLoading && !error && (
        <>
          <Routes>
            <Route path="/" element={<Layout>{renderHome()}</Layout>} />
            <Route path="/checkout" element={<Layout>{renderCheckout()}</Layout>} />
            <Route path="/login" element={renderLogin()} />
            <Route path="/admin" element={isAdminAuthenticated ? renderAdmin() : <Navigate to="/login" />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>

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
              showPrices={showPrices}
            />
          )}
        </>
      )}
    </>
  );
};

export default App;