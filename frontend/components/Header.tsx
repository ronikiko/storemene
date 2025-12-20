import React from 'react';
import { Search, ShoppingBag, User, Heart, Menu, Users } from 'lucide-react';

interface HeaderProps {
  cartCount: number;
  onCartClick?: () => void;
  onLogoClick?: () => void;
  onUserClick?: () => void;
  cartAnimating?: boolean;
  customerName?: string | null;
}

const Header: React.FC<HeaderProps> = ({ cartCount, onCartClick, onLogoClick, onUserClick, cartAnimating = false, customerName }) => {
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

          {/* Middle: Customer Badge */}
          {customerName && (
            <div className="hidden lg:flex items-center gap-3 px-4 py-2 bg-slate-800 text-white rounded-full shadow-lg animate-in slide-in-from-top-2 duration-300">
              <Users className="w-5 h-5 text-green-400" />
              <div className="flex items-center gap-2 text-sm font-medium">
                <span className="text-slate-400">צפה כלקוח:</span>
                <span className="text-green-400 font-bold">{customerName}</span>
              </div>
            </div>
          )}

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
    </header>
  );
};

export default Header;