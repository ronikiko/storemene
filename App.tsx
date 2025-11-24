import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import CategoryNav from './components/CategoryNav';
import ProductCard from './components/ProductCard';
import FilterBar from './components/FilterBar';
import QuickViewModal from './components/QuickViewModal';
import CartPage from './components/CartPage';
import AdminLogin from './components/Admin/AdminLogin';
import AdminDashboard from './components/Admin/AdminDashboard';
import { PRODUCTS as INITIAL_PRODUCTS, CATEGORIES as INITIAL_CATEGORIES, CUSTOMERS as INITIAL_CUSTOMERS, PRICE_LISTS as INITIAL_PRICE_LISTS } from './constants';
import { Product, CartItem, Category, Customer, PriceList } from './types';
import { Zap, AlertCircle, Lock, Users } from 'lucide-react';

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
  const [ priceLimit, setPriceLimit ] = useState<number>(1000);
  const [ minRating, setMinRating ] = useState<number | null>(null);
  const [ isFilterOpen, setIsFilterOpen ] = useState(false);

  React.useEffect(() => {
    setPriceLimit(maxGlobalPrice);
  }, [ maxGlobalPrice ]);

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
    setPriceLimit(maxGlobalPrice);
    setMinRating(null);
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

  // --- View Rendering ---

  if (currentView === 'login') return <AdminLogin onLogin={handleLogin} onBack={() => setCurrentView('home')} />;

  if (currentView === 'admin') {
    if (!isAdminAuthenticated) { setCurrentView('login'); return null; }
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
  }

  if (currentView === 'checkout') {
    return (
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
  }

  const filteredProducts = products.filter(product => {
    if (selectedCategory && selectedCategory !== 'new' && product.category !== selectedCategory) return false;
    if (selectedCategory === 'new' && !product.isNew) return false;
    if (product.price > priceLimit) return false;
    if (minRating !== null && product.rating < minRating) return false;
    return true;
  });

  return (
    <div className="min-h-screen pb-20 bg-white font-sans">
      <Header
        cartCount={cartCount}
        onCartClick={() => setCurrentView('checkout')}
        onLogoClick={() => setCurrentView('home')}
        onUserClick={() => isAdminAuthenticated ? setCurrentView('admin') : setCurrentView('login')}
      />
      <CategoryNav categories={categories} selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />

      {/* Hero & Banner code from previous setup ... */}
      {!selectedCategory && !minRating && priceLimit === maxGlobalPrice && (
        <section className="relative w-full h-[200px] md:h-[400px] bg-gray-900 overflow-hidden group">
          <div className="absolute inset-0 opacity-80 transition-opacity group-hover:opacity-70">
            <img src="https://picsum.photos/1600/900?grayscale" alt="Hero" className="w-full h-full object-cover" />
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-4">
            <h2 className="text-3xl md:text-6xl font-black mb-2 tracking-tight italic drop-shadow-lg">טרי ואיכותי!</h2>
            <p className="text-sm md:text-xl font-medium mb-6 text-gray-200">כל המוצרים הטריים במקום אחד</p>
            <button className="bg-white text-black font-bold py-3 px-8 rounded-full hover:scale-105 hover:bg-black hover:text-white transition-all text-sm md:text-base shadow-xl">
              לקנייה עכשיו
            </button>
          </div>
        </section>
      )}

      <FilterBar
        maxPrice={maxGlobalPrice} currentMaxPrice={priceLimit} onPriceChange={setPriceLimit}
        minRating={minRating} onRatingChange={setMinRating} resultCount={filteredProducts.length}
        onClear={handleClearFilters} isOpen={isFilterOpen} setIsOpen={setIsFilterOpen}
      />

      <main className="container mx-auto px-2 md:px-4 min-h-[400px]">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-x-3 gap-y-8 md:gap-6">
            {filteredProducts.map((product) => {
              const effectiveInfo = getEffectiveProductInfo(product);
              return (
                <ProductCard
                  key={product.id}
                  product={{ ...effectiveInfo, originalPrice: effectiveInfo.originalPrice }}
                  onAddToCart={(p) => handleAddToCart(p, 1)}
                  onQuickView={setQuickViewProduct}
                />
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <AlertCircle className="w-12 h-12 mb-4 text-gray-300" />
            <p className="text-lg font-medium">לא נמצאו מוצרים התואמים את הסינון.</p>
            <button onClick={handleClearFilters} className="mt-4 text-black font-bold underline hover:no-underline">נקה סינונים</button>
          </div>
        )}
      </main>

      <QuickViewModal
        isOpen={!!quickViewProduct}
        product={quickViewProduct ? getEffectiveProductInfo(quickViewProduct) : null}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Footer & Mobile Nav from previous setup ... */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 py-2 px-6 flex justify-between items-center z-40 text-[10px] font-medium text-gray-500 safe-area-pb">
        <div className="flex flex-col items-center gap-1 text-black" onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setCurrentView('home'); }}>
          <Zap className="w-5 h-5" /> <span>בית</span>
        </div>
        <div className="flex flex-col items-center gap-1 cursor-pointer hover:text-black" onClick={() => setIsFilterOpen(!isFilterOpen)}>
          <div className="w-5 h-5 flex items-center justify-center rounded-sm border border-gray-300"><div className="w-3 h-0.5 bg-gray-500"></div></div> <span>סינון</span>
        </div>
        <div
          className="flex flex-col items-center gap-1 cursor-pointer"
          onClick={() => isAdminAuthenticated ? setCurrentView('admin') : setCurrentView('login')}
        >
          <Lock className="w-5 h-5" /> <span>ניהול</span>
        </div>
      </div>

      {/* Simulation Bar (Active Customer Indicator) */}
      {activeCustomerId && (() => {
        const activeCustomer = customers.find(c => c.id === activeCustomerId);
        const activePriceList = activeCustomer?.priceListId ? priceLists.find(pl => pl.id === activeCustomer.priceListId) : null;

        return (
          <div className="fixed bottom-16 md:bottom-4 left-4 z-50 bg-black/90 backdrop-blur text-white px-4 py-2 rounded-full shadow-lg text-xs flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4">
            <Users className="w-4 h-4 text-green-400" />
            <span className="opacity-75">צפה כלקוח:</span>
            <span className="font-bold text-white">
              {activeCustomer?.name}
              {activePriceList && <span className="text-green-400 ml-1">({activePriceList.name})</span>}
            </span>
          </div>
        );
      })()}

    </div>
  );
};

export default App;