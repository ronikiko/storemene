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
    <header className="sticky top-0 z-50 glass border-b border-coffee-100/50">
      <div className="container mx-auto px-4 py-3 md:py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-coffee-900 rounded-2xl flex items-center justify-center shadow-lg transform -rotate-3 hover:rotate-0 transition-transform cursor-pointer" onClick={onLogoClick}>
              <ShoppingBag className="w-6 h-6 text-champagne-100" />
            </div>
            <h1
              onClick={onLogoClick}
              className="text-xl md:text-2xl font-black tracking-tight text-coffee-900 cursor-pointer hover:opacity-80 transition-opacity leading-tight"
            >
              קיקו שיווק
            </h1>
          </div>

          {/* Middle: Customer Badge (Desktop Only) */}
          {customerName && (
            <div className="hidden lg:flex items-center gap-3 px-5 py-2.5 bg-coffee-950 text-white rounded-2xl shadow-xl animate-in fade-in slide-in-from-top-4 duration-500 border border-white/10">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <div className="flex flex-col">
                <span className="text-[10px] text-coffee-400 font-bold uppercase tracking-wider">מחובר כעת</span>
                <span className="text-sm font-bold text-champagne-50">{customerName}</span>
              </div>
            </div>
          )}

          {/* Right: Icons (Desktop only or specific actions) */}
          <div className="flex items-center gap-2">
            <button
              className="text-coffee-600 hover:text-coffee-900 p-2.5 hover:bg-coffee-50 rounded-2xl transition-all hidden md:flex"
              onClick={onUserClick}
            >
              <User className="w-6 h-6" />
            </button>
            <button
              className={`relative p-2.5 rounded-2xl transition-all ${cartCount > 0
                  ? 'bg-coffee-900 text-white shadow-lg shadow-coffee-200'
                  : 'text-coffee-600 hover:bg-coffee-50'
                } ${cartAnimating ? 'scale-110' : ''}`}
              onClick={onCartClick}
            >
              <ShoppingBag className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-white text-coffee-950 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-coffee-900 shadow-sm animate-in zoom-in">
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