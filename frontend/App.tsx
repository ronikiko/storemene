import React, { useState, useMemo, useEffect } from 'react';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import { Routes, Route, useNavigate, useLocation, Navigate, useSearchParams } from 'react-router-dom';
import CategoryNav from './components/CategoryNav';
import ProductCard from './components/ProductCard';
import QuickViewModal from './components/QuickViewModal';
import CustomerPINModal from './components/CustomerPINModal';
import CartPage from './components/CartPage';
import AdminLogin from './components/Admin/AdminLogin';
import AdminDashboard from './components/Admin/AdminDashboard';
import ProductTable from './components/ProductTable';
import Pagination from './components/Pagination';
import OrderPicker from './components/OrderPicker';
import { ToastProvider, useToast } from './context/ToastContext';
import { Product, CartItem, Category, Customer, PriceList, Order } from './types';
import { Zap, AlertCircle, Lock, Users, LayoutGrid, List, Menu, Filter, Search, X } from 'lucide-react';
import { productsApi, categoriesApi, customersApi, priceListsApi, authApi, settingsApi, ordersApi } from './services/api';

interface LayoutProps {
  children: React.ReactNode;
  cartCount: number;
  currentCustomerName: string | null;
  cartAnimating: boolean;
  isAdminAuthenticated: boolean;
  isCustomerAuthenticated: boolean;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  cartCount,
  currentCustomerName,
  cartAnimating,
  isAdminAuthenticated,
  isCustomerAuthenticated
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const activePath = location.pathname;
  const activeTab = activePath === '/' ? 'home' :
    activePath === '/checkout' ? 'cart' :
      activePath === '/admin' || activePath === '/login' ? 'profile' : 'home';

  const handleTabChange = (tabId: string) => {
    if (tabId === 'home') navigate('/');
    if (tabId === 'cart') navigate('/checkout');
    if (tabId === 'profile') navigate(isAdminAuthenticated ? '/admin/products' : '/login');
    if (tabId === 'categories') {
      navigate('/');
      setTimeout(() => {
        document.querySelector('#category-nav')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
    if (tabId === 'search') {
      navigate('/');
      setTimeout(() => {
        document.querySelector('#search-input')?.scrollIntoView({ behavior: 'smooth' });
        (document.querySelector('#search-input') as HTMLInputElement)?.focus();
      }, 100);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-pearl selection:bg-coffee-100">
      <Header
        cartCount={cartCount}
        onCartClick={() => navigate('/checkout')}
        onLogoClick={() => navigate('/')}
        onUserClick={() => isAdminAuthenticated ? navigate('/admin') : navigate('/login')}
        cartAnimating={cartAnimating}
        customerName={currentCustomerName}
        isAuthenticated={isAdminAuthenticated || isCustomerAuthenticated}
      />
      <main className="flex-grow pb-24 md:pb-8">
        {children}
      </main>
      <BottomNav
        activeTab={activeTab}
        onTabChange={handleTabChange}
        cartCount={cartCount}
        isAuthenticated={isAdminAuthenticated || isCustomerAuthenticated}
      />
    </div>
  );
};

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
  const [ isAuthChecked, setIsAuthChecked ] = useState(false);

  // --- Navigation & Auth ---
  const navigate = useNavigate();
  const location = useLocation();
  const [ searchParams ] = useSearchParams();
  const [ isAdminAuthenticated, setIsAdminAuthenticated ] = useState(false);
  const [ isCustomerAuthenticated, setIsCustomerAuthenticated ] = useState(false);
  const [ showPINModal, setShowPINModal ] = useState(false);
  const [ pinTargetCustomer, setPinTargetCustomer ] = useState<Customer | null>(null);

  // --- Session State (Simulation) ---
  const [ activeCustomerId, setActiveCustomerId ] = useState<string | null>(null);
  const [ currentCustomer, setCurrentCustomer ] = useState<any>(null);

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
  const itemsPerPage = viewMode === 'grid' ? 24 : 30;

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
      if (!isAuthChecked) return;

      try {
        setIsLoading(true);
        // Data available to everyone (Products, Categories, Settings)
        const [ productsData, categoriesData, settingsData ] = await Promise.all([
          productsApi.getAll(),
          categoriesApi.getAll(),
          settingsApi.getAll(),
        ]);

        setProducts(productsData);
        setCategories(categoriesData);

        // Load show_prices setting
        const showPricesSetting = settingsData.find((s: any) => s.id === 'show_prices');
        if (showPricesSetting) {
          setShowPrices(showPricesSetting.value === 'true');
        }

        // Admin-only data
        if (isAdminAuthenticated) {
          const [ customersData, priceListsData, ordersData ] = await Promise.all([
            customersApi.getAll(),
            priceListsApi.getAll(),
            ordersApi.getAll(),
          ]);
          setCustomers(customersData);
          setPriceLists(priceListsData);
          setOrders(ordersData);
        } else if (isCustomerAuthenticated && currentCustomer?.priceListId) {
          try {
            const plData = await priceListsApi.getById(currentCustomer.priceListId);
            setPriceLists([ plData ]);
          } catch (err) {
            console.error('Failed to fetch customer price list:', err);
          }
        }

        setError(null);
      } catch (err: any) {
        if (err.status !== 401 && err.status !== 403) {
          setError(err instanceof Error ? err.message : 'Failed to load data');
        }
        console.error('Failed to fetch data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [ isAuthChecked, isAdminAuthenticated, isCustomerAuthenticated, currentCustomer ]);

  useEffect(() => {
    const checkSessions = async () => {
      try {
        // Check Admin
        try {
          await authApi.getMe();
          setIsAdminAuthenticated(true);
        } catch (err) {
          setIsAdminAuthenticated(false);
        }

        // Check Customer
        try {
          const customerSession = await authApi.getCustomerMe();
          setIsCustomerAuthenticated(true);
          setActiveCustomerId(customerSession.id);
          setCurrentCustomer(customerSession);
        } catch (err) {
          setIsCustomerAuthenticated(false);
        }

      } finally {
        setIsAuthChecked(true);
      }
    };
    checkSessions();
  }, []);

  // --- URL Customer Token Logic ---
  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (!tokenParam) return;

    const fetchCustomerInfo = async () => {
      try {
        const customer = await authApi.getCustomerPublicInfo(tokenParam);
        // If not already authenticated as THIS customer, show PIN modal
        if (!isCustomerAuthenticated || activeCustomerId !== customer.id) {
          setPinTargetCustomer(customer);
          setShowPINModal(true);
        }
      } catch (err) {
        console.error('Failed to fetch customer info:', err);
      }
    };

    fetchCustomerInfo();
  }, [ searchParams, isCustomerAuthenticated, activeCustomerId ]);

  // --- Cart Logic ---
  const cartCount = useMemo(() => cartItems.reduce((acc, item) => acc + item.quantity, 0), [ cartItems ]);

  const currentCustomerName = useMemo(() => {
    if (activeCustomerId) {
      const customer = customers.find(c => c.id === activeCustomerId) || currentCustomer;
      if (customer && customer.id === activeCustomerId) {
        return customer.name;
      }
      return null;
    }
    return customers.find(c => c.name === 'לקוח כללי')?.name || 'לקוח כללי';
  }, [ activeCustomerId, customers, currentCustomer ]);

  const effectiveShowPrices = showPrices && (isAdminAuthenticated || isCustomerAuthenticated);

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
    setCartItems(prev => {
      const updated = prev.map(item => {
        if (item.id === id) {
          return { ...item, quantity: item.quantity + delta };
        }
        return item;
      });
      return updated.filter(item => item.quantity > 0);
    });
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
    navigate('/admin/products');
    success('התחברת בהצלחה');
  };

  const handleLogout = async () => {
    try {
      await authApi.logoutAdmin();
      setIsAdminAuthenticated(false);
      navigate('/');
      success('התנתקת בהצלחה');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const renderBlocked = () => (
    <div className="min-h-screen bg-coffee-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center bg-white p-12 rounded-[3rem] shadow-2xl border border-coffee-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="w-20 h-20 bg-coffee-950 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-xl">
          <Lock className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-black text-coffee-950 mb-4">הגישה מוגבלת</h2>
        <p className="text-coffee-600 mb-8 leading-relaxed">
          נא להשתמש בלינק האישי שנשלח אליך כדי לגלוש בקטלוג ולבצע הזמנות.
        </p>
        <button
          onClick={() => navigate('/login')}
          className="text-coffee-900 font-bold hover:underline"
        >
          כניסה למערכת ניהול
        </button>
      </div>
    </div>
  );

  const handlePINSubmit = async (pin: string) => {
    if (!pinTargetCustomer) return;
    try {
      const response = await authApi.authenticateCustomer(pinTargetCustomer.token, pin);
      setIsCustomerAuthenticated(true);
      setActiveCustomerId(response.id);
      setCurrentCustomer(response);
      setShowPINModal(false);
      setPinTargetCustomer(null);
      success('התחברת בהצלחה לקטלוג');
    } catch (err: any) {
      throw new Error(err.message || 'סיסמא שגויה');
    }
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
  const filteredProducts = useMemo(() => {
    const list = products.filter(product => {
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
    });

    return list.sort((a, b) => {
      const priceA = getEffectiveProductInfo(a).price;
      const priceB = getEffectiveProductInfo(b).price;

      switch (sortBy) {
        case 'price-asc': return priceA - priceB;
        case 'price-desc': return priceB - priceA;
        case 'name-asc': return a.title.localeCompare(b.title);
        default: return 0; // 'default' order (usually by ID or added date)
      }
    });
  }, [ products, searchTerm, categories, selectedCategory, showOnlyNew, showOnlySale, sortBy, customers, priceLists, activeCustomerId ]);

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
      success('ההזמנה עודכנה בהצלחה!');

      // If backend returned a WhatsApp link (meaning status changed to processing)
      if (savedOrder.whatsAppLink) {
        window.open(savedOrder.whatsAppLink, '_blank');
      }
    } catch (err) {
      console.error('Failed to update order:', err);
      throw err;
    }
  };

  const handleAddOrder = async (order: Order) => {
    try {
      const savedOrder = await ordersApi.create(order);
      setOrders(prev => [ savedOrder, ...prev ]);
      success('ההזמנה נוצרה בהצלחה!');
    } catch (err) {
      console.error('Failed to create order:', err);
      throw err;
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
        onAddOrder={handleAddOrder}

        showPrices={showPrices}
        onUpdateShowPrices={handleUpdateShowPrices}

        onLogout={handleLogout}
        onGoHome={() => navigate('/')}
      />
    );
  };


  const renderCheckout = () => (
    <CartPage
      cartItems={cartItems}
      onUpdateQuantity={handleUpdateCartQuantity}
      onRemoveItem={handleRemoveFromCart}
      onBack={() => navigate('/')}
      showPrices={effectiveShowPrices}
      onPlaceOrder={handlePlaceOrder}
      activeCustomerId={activeCustomerId}
      customers={customers}
      customerName={currentCustomerName || 'לקוח כללי'}
    />
  );

  const renderHome = () => (
    <div className="min-h-screen pb-10 bg-pearl">
      <div id="category-nav" className="container mx-auto px-4 mt-2 mb-2">
        <CategoryNav
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={(id) => { setSelectedCategory(id); setCurrentPage(1); }}
        />
      </div>

      <div className="container mx-auto px-4 py-4">
        {/* Main Content */}
        <main className="min-h-[600px]">
          {/* Top Toolbar */}
          <div className="glass p-4 rounded-3xl premium-shadow mb-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4 w-full md:w-auto flex-1">
              <span className="text-sm text-coffee-500 font-black hidden lg:block whitespace-nowrap bg-coffee-50 px-4 py-2 rounded-full">
                {filteredProducts.length} פריטים בקטלוג
              </span>

              {/* Search Field */}
              <div className="relative flex-1 w-full md:max-w-xl">
                <input
                  id="search-input"
                  type="text"
                  placeholder="חפשי מוצר, קטגוריה או סגנון..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white/50 border border-coffee-100 rounded-2xl pl-4 pr-12 py-3.5 text-sm focus:ring-4 focus:ring-coffee-100 focus:border-coffee-300 outline-none transition-all font-medium placeholder:text-coffee-300 shadow-inner"
                />
                <Search className="absolute right-4 top-3.5 w-5 h-5 text-coffee-400" />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute left-4 top-3.5 text-coffee-300 hover:text-coffee-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
              <span className="text-xs text-coffee-400 font-bold lg:hidden">
                {filteredProducts.length} מוצרים
              </span>
              <div className="flex items-center gap-1.5 bg-coffee-100/30 p-1.5 rounded-2xl border border-coffee-100/50">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${viewMode === 'grid' ? 'bg-coffee-900 text-white shadow-xl translate-y-[-1px]' : 'text-coffee-400 hover:text-coffee-600'}`}
                >
                  <LayoutGrid className="w-4 h-4" />
                  <span className="hidden sm:inline">גלריה</span>
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${viewMode === 'table' ? 'bg-coffee-900 text-white shadow-xl translate-y-[-1px]' : 'text-coffee-400 hover:text-coffee-600'}`}
                >
                  <List className="w-4 h-4" />
                  <span className="hidden sm:inline">רשימה</span>
                </button>
              </div>
            </div>
          </div>

          {filteredProducts.length > 0 ? (
            <>
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 md:gap-6">
                  {filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((product) => (
                    <ProductCard
                      key={product.id}
                      product={getEffectiveProductInfo(product)}
                      onAddToCart={handleAddToCart}
                      onUpdateQuantity={handleUpdateCartQuantity}
                      quantityInCart={cartItems.find(item => item.id === product.id)?.quantity}
                      onQuickView={setQuickViewProduct}
                      showPrices={effectiveShowPrices}
                    />
                  ))}
                </div>
              ) : (
                <div className="glass rounded-[2rem] overflow-hidden premium-shadow">
                  <ProductTable
                    products={filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map(p => getEffectiveProductInfo(p))}
                    categories={categories}
                    cartItems={cartItems}
                    onAddToCart={handleAddToCart}
                    onUpdateQuantity={handleUpdateCartQuantity}
                    onQuickView={setQuickViewProduct}
                    showPrices={effectiveShowPrices}
                  />
                </div>
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
            <div className="flex flex-col items-center justify-center py-24 text-coffee-400 glass rounded-[3rem] border border-coffee-100/50 premium-shadow">
              <div className="w-24 h-24 bg-coffee-50 rounded-full flex items-center justify-center mb-8">
                <Search className="w-10 h-10 text-coffee-200" />
              </div>
              <p className="text-2xl font-black text-coffee-900 mb-2">לא מצאנו את מה שחיפשת...</p>
              <p className="text-coffee-500 font-medium mb-8 text-center max-w-sm">נסי לחפש מילה אחרת או לבדוק בקטגוריות השונות</p>
              <button
                onClick={handleClearFilters}
                className="bg-coffee-900 text-white px-10 py-4 rounded-2xl font-black shadow-xl shadow-coffee-200 hover:scale-105 active:scale-95 transition-all"
              >
                ניקוי כל הסינונים
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );

  return (
    <>
      {(!isAuthChecked || isLoading) && (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-coffee-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-coffee-900 font-bold">טוען נתונים...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {isAuthChecked && !isLoading && error && location.pathname !== '/login' && (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="text-center max-w-md">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">שגיאה בטעינת הנתונים</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <p className="text-sm text-gray-500 mb-4">
              אנא ודא שהשרת פועל ושיש לך חיבור לאינטרנט.
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

      {isAuthChecked && !isLoading && !error && (
        <>
          {showPINModal && pinTargetCustomer && (
            <CustomerPINModal
              isOpen={showPINModal}
              onClose={() => setShowPINModal(false)}
              onSubmit={handlePINSubmit}
              customerName={pinTargetCustomer.name}
            />
          )}

          <Routes>
            <Route path="/" element={
              <Layout
                cartCount={cartCount}
                currentCustomerName={currentCustomerName}
                cartAnimating={cartAnimating}
                isAdminAuthenticated={isAdminAuthenticated}
                isCustomerAuthenticated={isCustomerAuthenticated}
              >
                {renderHome()}
              </Layout>
            } />
            <Route path="/checkout" element={
              (isAdminAuthenticated || isCustomerAuthenticated) ? (
                <Layout
                  cartCount={cartCount}
                  currentCustomerName={currentCustomerName}
                  cartAnimating={cartAnimating}
                  isAdminAuthenticated={isAdminAuthenticated}
                  isCustomerAuthenticated={isCustomerAuthenticated}
                >
                  {renderCheckout()}
                </Layout>
              ) : (
                <Navigate to="/" />
              )
            } />
            <Route path="/login" element={renderLogin()} />
            <Route path="/picker/:token" element={<OrderPicker />} />
            <Route path="/admin/*" element={isAdminAuthenticated ? renderAdmin() : <Navigate to="/login" />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>


          {quickViewProduct && (
            <QuickViewModal
              product={getEffectiveProductInfo(quickViewProduct)}
              isOpen={!!quickViewProduct}
              onClose={() => setQuickViewProduct(null)}
              onAddToCart={handleAddToCart}
              onUpdateQuantity={handleUpdateCartQuantity}
              quantityInCart={cartItems.find(item => item.id === quickViewProduct.id)?.quantity}
              onNext={handleNextProduct}
              onPrev={handlePrevProduct}
              showPrices={effectiveShowPrices}
            />
          )}
        </>
      )}
    </>
  );
};

export default App;