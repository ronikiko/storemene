import React from 'react';
import { Search, ShoppingBag, User, Heart, Menu } from 'lucide-react';

interface HeaderProps {
  cartCount: number;
  onCartClick?: () => void;
  onLogoClick?: () => void;
  onUserClick?: () => void;
  cartAnimating?: boolean;
}

const Header: React.FC<HeaderProps> = ({ cartCount, onCartClick, onLogoClick, onUserClick, cartAnimating = false }) => {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm border-b border-coffee-100">
      {/* Top Banner */}

      {/* Main Navbar */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-6">
          {/* Left: Logo & Menu */}
          <div className="flex items-center gap-4">
            <button className="md:hidden p-1 text-coffee-800">
              <Menu className="w-6 h-6" />
            </button>
            <h1
              onClick={onLogoClick}
              className="text-2xl md:text-3xl font-black tracking-tight text-coffee-900 cursor-pointer hover:opacity-90 transition-opacity"
            >
              קטלוג מוצרים - קיקו שיווק
            </h1>
          </div>

          {/* Center: Search */}
          <div className="flex-1 max-w-xl hidden md:block">
            <div className="relative group">
              <input
                type="text"
                placeholder="חיפוש מוצרים..."
                className="w-full bg-coffee-50 text-coffee-900 rounded-full py-2.5 px-5 pr-11 focus:outline-none focus:ring-2 focus:ring-coffee-200 transition-all placeholder:text-coffee-400 text-sm font-medium"
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-coffee-400 group-focus-within:text-coffee-600 transition-colors">
                <Search className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Right: Icons */}
          <div className="flex items-center gap-3 sm:gap-5">
            <button className="text-coffee-700 hover:text-coffee-900 md:hidden p-2 hover:bg-coffee-50 rounded-full transition-colors">
              <Search className="w-6 h-6" />
            </button>
            <button className="text-coffee-700 hover:text-coffee-900 p-2 hover:bg-coffee-50 rounded-full transition-colors relative hidden sm:block">
              <Heart className="w-6 h-6" />
            </button>
            <button
              className="text-coffee-700 hover:text-coffee-900 p-2 hover:bg-coffee-50 rounded-full transition-colors"
              onClick={onUserClick}
              aria-label="Login / Account"
            >
              <User className="w-6 h-6" />
            </button>
            <button
              className={`text-coffee-700 hover:text-coffee-900 p-2 hover:bg-coffee-50 rounded-full transition-colors relative ${cartAnimating ? 'animate-bounce' : ''}`}
              onClick={onCartClick}
            >
              <ShoppingBag className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-coffee-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-in zoom-in border-2 border-white">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="md:hidden px-4 pb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="חיפוש..."
            className="w-full bg-coffee-50 text-coffee-900 rounded-xl py-3 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-coffee-200 text-sm font-medium"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-coffee-400">
            <Search className="w-4 h-4" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;