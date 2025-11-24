import React from 'react';
import { Search, ShoppingBag, User, Heart, Menu } from 'lucide-react';

interface HeaderProps {
  cartCount: number;
  onCartClick?: () => void;
  onLogoClick?: () => void;
  onUserClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ cartCount, onCartClick, onLogoClick, onUserClick }) => {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
      {/* Top Banner */}
      <div className="bg-black text-white text-xs text-center py-1.5 px-2 truncate">
        משלוח חינם בקנייה מעל ₪199 • החזרות קלות
      </div>

      {/* Main Navbar */}
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Logo & Menu */}
          <div className="flex items-center gap-3">
            <button className="md:hidden p-1">
              <Menu className="w-6 h-6 text-gray-700" />
            </button>
            <h1 
              onClick={onLogoClick}
              className="text-2xl font-extrabold tracking-tighter italic font-serif cursor-pointer hover:opacity-80 transition-opacity"
            >
              החנות של מיצ׳י
            </h1>
          </div>

          {/* Center: Search (Hidden on super small screens, visible on mobile via expansion in real app) */}
          <div className="flex-1 max-w-lg hidden md:block">
            <div className="relative">
              <input
                type="text"
                placeholder="מה בא לך לחפש היום?"
                className="w-full bg-gray-100 text-gray-800 rounded-full py-2 px-4 pr-10 focus:outline-none focus:ring-1 focus:ring-black text-sm"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Search className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Right: Icons */}
          <div className="flex items-center gap-4 sm:gap-6">
             <button className="text-gray-700 hover:text-black md:hidden">
                <Search className="w-6 h-6" />
            </button>
            <button className="text-gray-700 hover:text-black relative">
              <Heart className="w-6 h-6" />
            </button>
             <button 
                className="text-gray-700 hover:text-black relative"
                onClick={onUserClick}
                aria-label="Login / Account"
             >
              <User className="w-6 h-6" />
            </button>
            <button 
              className="text-gray-700 hover:text-black relative"
              onClick={onCartClick}
            >
              <ShoppingBag className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-in zoom-in">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Search Bar (Visible only on small screens) */}
      <div className="md:hidden px-4 pb-3">
          <div className="relative">
              <input
                type="text"
                placeholder="חיפוש..."
                className="w-full bg-gray-100 text-gray-800 rounded-lg py-2 px-4 pr-10 focus:outline-none text-sm"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Search className="w-4 h-4" />
              </div>
            </div>
      </div>
    </header>
  );
};

export default Header;