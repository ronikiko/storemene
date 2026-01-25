import React from 'react';
import { Home, Grid, Search, ShoppingBag, User } from 'lucide-react';

interface BottomNavProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
    cartCount: number;
    isAuthenticated?: boolean;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange, cartCount, isAuthenticated }) => {
    const tabs = [
        { id: 'home', icon: Home, label: 'ראשי' },
        { id: 'categories', icon: Grid, label: 'קטגוריות' },
        { id: 'search', icon: Search, label: 'חיפוש' },
        { id: 'cart', icon: ShoppingBag, label: 'סל', badge: cartCount, hidden: !isAuthenticated },
        { id: 'profile', icon: User, label: 'פרופיל', hidden: !isAuthenticated },
    ].filter(t => !t.hidden);

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[100] pb-safe">
            <div className="mx-4 mb-4 glass rounded-3xl premium-shadow border border-white/50 px-2 py-2">
                <div className="flex justify-around items-center">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            className={`flex flex-col items-center gap-1 p-2 rounded-2xl transition-all relative ${activeTab === tab.id
                                ? 'text-coffee-950 scale-110'
                                : 'text-coffee-400 hover:text-coffee-600'
                                }`}
                        >
                            <div className={`p-1.5 rounded-xl transition-colors ${activeTab === tab.id ? 'bg-champagne-100' : 'bg-transparent'
                                }`}>
                                <tab.icon className="w-6 h-6" />
                            </div>

                            {tab.badge !== undefined && tab.badge > 0 && (
                                <span className="absolute top-1 right-1 bg-coffee-900 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-pearl animate-in zoom-in">
                                    {tab.badge}
                                </span>
                            )}

                            <span className="text-[10px] font-bold">{tab.label}</span>

                            {activeTab === tab.id && (
                                <span className="absolute -bottom-1 w-1 h-1 bg-coffee-900 rounded-full" />
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </nav>
    );
};

export default BottomNav;
