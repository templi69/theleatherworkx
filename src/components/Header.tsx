import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ShoppingBag, Search, ShieldCheck, LayoutDashboard, Store, X, Phone } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    cart,
    setIsCartOpen,
    activeView,
    setActiveView,
    unreadOrdersCount,
    searchQuery,
    setSearchQuery,
    setSelectedCategory,
    markOrdersAsViewed,
  } = useStore();

  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleAdminClick = () => {
    if (activeView === 'store') {
      setActiveView('admin');
      markOrdersAsViewed();
    } else {
      setActiveView('store');
    }
  };

  const navCategories = [
    { label: 'All Collection', value: 'all' },
    { label: 'Bespoke Hand-Painted', value: 'bespoke' },
    { label: 'Travel & Duffles', value: 'travel' },
    { label: 'Wallets & Sleeves', value: 'wallets' },
    { label: 'Bags & Satchels', value: 'bags' },
    { label: 'Accessories', value: 'accessories' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E8E1D9] transition-all">
      {/* Top Announcement Bar */}
      <div className="bg-[#1E1915] text-[#D4AF37] px-4 py-2 text-xs font-medium tracking-wider flex items-center justify-between">
        <div className="hidden sm:flex items-center gap-2 text-stone-300">
          <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>Handcrafted in Pakistan • 100% Full-Grain Leather</span>
        </div>
        <div className="mx-auto sm:mx-0 text-center text-[11px] sm:text-xs text-[#FAF8F5]">
          <span className="font-semibold text-[#E5B869]">CASH ON DELIVERY</span> Available Nationwide • Free Delivery Over Rs. 5,000
        </div>
        <div className="hidden md:flex items-center gap-4 text-stone-300">
          <span className="flex items-center gap-1">
            <Phone className="w-3 h-3 text-[#D4AF37]" />
            <span>Support: +92 300 8452109</span>
          </span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Mobile Search Toggle */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 text-stone-700 hover:text-stone-950 transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>

          {/* Brand Logo */}
          <div className="flex flex-col items-center sm:items-start cursor-pointer" onClick={() => { setActiveView('store'); }}>
            <div className="flex items-center gap-2">
              <span className="font-serif-luxury text-2xl sm:text-3xl font-bold tracking-widest text-[#1E1915]">
                THE LEATHER WORKX
              </span>
            </div>
            <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.25em] text-[#8B5A2B] font-semibold">
              Handcrafted Artisanal Leather • Pakistan
            </span>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden lg:flex items-center flex-1 max-w-xs mx-8">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search duffles, wallets, passport sleeves..."
                className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-[#E2D8CE] rounded-full focus:outline-none focus:border-[#8B5A2B] text-stone-800 placeholder-stone-400 shadow-xs transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Owner Admin Portal Switcher */}
            <button
              onClick={handleAdminClick}
              className={`relative flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full text-xs font-medium transition-all ${
                activeView === 'admin'
                  ? 'bg-[#1E1915] text-[#FAF8F5] shadow-sm ring-1 ring-[#D4AF37]'
                  : 'bg-white border border-[#E2D8CE] text-stone-800 hover:border-[#8B5A2B] hover:text-[#8B5A2B]'
              }`}
              title="Switch between Customer Store and Business Owner Admin Portal"
            >
              {activeView === 'admin' ? (
                <>
                  <Store className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span className="hidden sm:inline">Customer Store</span>
                </>
              ) : (
                <>
                  <LayoutDashboard className="w-3.5 h-3.5 text-[#8B5A2B]" />
                  <span className="hidden sm:inline">Owner Admin</span>
                  {unreadOrdersCount > 0 && (
                    <span className="flex items-center justify-center bg-[#8B5A2B] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full animate-pulse">
                      {unreadOrdersCount} new
                    </span>
                  )}
                </>
              )}
            </button>

            {/* Shopping Bag Button */}
            {activeView === 'store' && (
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative flex items-center gap-2 p-2 sm:px-3.5 sm:py-2 bg-[#8B5A2B] hover:bg-[#72451F] text-white rounded-full text-xs font-semibold shadow-xs transition-all cursor-pointer"
                aria-label="Shopping Bag"
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline">Bag</span>
                <span className="w-5 h-5 bg-white text-[#8B5A2B] rounded-full flex items-center justify-center font-bold text-[11px]">
                  {totalItems}
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Search Input Drawer */}
        {isSearchOpen && (
          <div className="lg:hidden pb-4 pt-1">
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products, wallets, bags..."
                className="w-full pl-9 pr-8 py-2 text-xs bg-white border border-[#E2D8CE] rounded-lg focus:outline-none focus:border-[#8B5A2B] text-stone-800 placeholder-stone-400"
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Navigation Categories (Store view only) */}
        {activeView === 'store' && (
          <nav className="hidden md:flex items-center justify-center gap-8 py-2.5 border-t border-[#EFE8E0] text-xs font-medium tracking-wider uppercase text-stone-600">
            {navCategories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => {
                  setSelectedCategory(cat.value);
                  setSearchQuery('');
                }}
                className="hover:text-[#8B5A2B] transition-colors pb-1 border-b-2 border-transparent hover:border-[#8B5A2B] cursor-pointer"
              >
                {cat.label}
              </button>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
};
