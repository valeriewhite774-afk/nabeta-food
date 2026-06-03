/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Wifi, Battery, Signal, ArrowLeft, Menu, ShoppingBag, Moon, Sun, Smartphone, BellRing } from 'lucide-react';

interface PhoneShellProps {
  children: React.ReactNode;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  brandName: string;
  slogan: string;
  cartCount: number;
  onOpenCart: () => void;
  onOpenMenu: () => void;
  onBack: (() => void) | null;
  notificationsCount: number;
  onOpenNotifications: () => void;
  viewMode?: 'standalone' | 'simulator';
  onOpenRewards?: () => void;
  onOpenReviews?: () => void;
  onOpenTracking?: () => void;
  showTrackingButton?: boolean;
  activeView?: string;
}

export const PhoneShell: React.FC<PhoneShellProps> = ({
  children,
  darkMode,
  setDarkMode,
  brandName,
  slogan,
  cartCount,
  onOpenCart,
  onOpenMenu,
  onBack,
  notificationsCount,
  onOpenNotifications,
  viewMode = 'standalone',
  onOpenRewards,
  onOpenReviews,
  onOpenTracking,
  showTrackingButton = false,
  activeView = 'menu',
}) => {
  const [currentTime, setCurrentTime] = useState('8:57');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // 0 should be 12
      // Let's hardcode '8:57' initially as on the screenshot, but allow it to tick if desired,
      // Or simply show authentic simulated time! We'll show a nice formatted standard time format.
      setCurrentTime(`${hours}:${minutes} ${ampm}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  if (viewMode === 'standalone') {
    return (
      <div 
        id="standalone-web-view" 
        className={`w-full max-w-6xl mx-auto rounded-3xl flex flex-col relative transition-colors duration-300 ${
          darkMode ? 'bg-[#101211] text-white' : 'bg-[#FAFAF9] text-black'
        } font-sans shadow-xl border ${darkMode ? 'border-gray-800/80' : 'border-gray-200'} selection:bg-cta/20`}
      >
        {/* Brand Slogan Ribbon */}
        <div className="bg-[#40685D] text-white py-2 px-4 text-xs font-sans font-medium text-center tracking-wide uppercase select-none flex items-center justify-center gap-1.5 animate-pulse rounded-t-[22px]">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
          <span>{slogan}</span>
        </div>

        {/* Standalone Custom Header */}
        <header className={`px-6 py-4 border-b transition-colors z-45 ${
          darkMode ? 'bg-[#101211]/95 border-gray-800' : 'bg-white/95 border-gray-100'
        } backdrop-blur-md sticky top-0`}>
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            
            {/* Logo + Back/Menu button */}
            <div className="flex items-center space-x-3 select-none">
              {onBack ? (
                <button 
                  id="phone-header-back-btn"
                  onClick={onBack} 
                  className={`p-1.5 rounded-full transition-colors ${
                    darkMode ? 'hover:bg-gray-800 text-gray-250' : 'hover:bg-gray-100 text-gray-700'
                  }`}
                  title="Go Back"
                >
                  <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
                </button>
              ) : (
                <div onClick={onOpenMenu} className="cursor-pointer flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-[#40685D] flex items-center justify-center font-serif text-white font-bold text-base shadow-sm">
                    N
                  </div>
                </div>
              )}
              
              <span className="font-serif font-bold text-base md:text-lg tracking-wider text-[#40685D] dark:text-[#a2c4b9] uppercase truncate">
                {brandName}
              </span>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-6 text-[11px] font-semibold tracking-wide uppercase select-none">
              <button
                onClick={onOpenMenu}
                className={`transition-colors py-1 border-b-2 hover:opacity-100 ${
                  activeView === 'menu' 
                    ? 'border-[#40685D] text-[#40685D] dark:text-[#a2c4b9] dark:border-[#a2c4b9]' 
                    : `${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-black'} border-transparent opacity-80`
                }`}
              >
                Browse Menu
              </button>
              {onOpenRewards && (
                <button
                  onClick={onOpenRewards}
                  className={`transition-colors py-1 border-b-2 hover:opacity-100 ${
                    activeView === 'rewards' 
                      ? 'border-[#40685D] text-[#40685D] dark:text-[#a2c4b9] dark:border-[#a2c4b9]' 
                      : `${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-black'} border-transparent opacity-80`
                  }`}
                >
                  Loyalty Rewards
                </button>
              )}
              {onOpenReviews && (
                <button
                  onClick={onOpenReviews}
                  className={`transition-colors py-1 border-b-2 hover:opacity-100 ${
                    activeView === 'reviews' 
                      ? 'border-[#40685D] text-[#40685D] dark:text-[#a2c4b9] dark:border-[#a2c4b9]' 
                      : `${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-black'} border-transparent opacity-80`
                  }`}
                >
                  Reviews & FAQs
                </button>
              )}
              {showTrackingButton && onOpenTracking && (
                <button
                  onClick={onOpenTracking}
                  className={`transition-colors py-1 border-b-2 hover:opacity-100 ${
                    activeView === 'tracking' 
                      ? 'border-[#40685D] text-[#40685D] dark:text-[#a2c4b9] dark:border-[#a2c4b9]' 
                      : `${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-black'} border-transparent opacity-80`
                  }`}
                >
                  Track Live Order
                </button>
              )}
            </nav>

            {/* Right actions: Dark Mode Toggle, Notifications Bell, Cart */}
            <div className="flex items-center space-x-1.5">
              {/* Theme Toggle directly accessible */}
              <button 
                id="phone-dark-mode-toggle"
                onClick={() => setDarkMode(!darkMode)}
                className={`p-1.5 rounded-full transition-colors ${
                  darkMode ? 'hover:bg-gray-850 text-yellow-400' : 'hover:bg-gray-100 text-[#40685D]'
                }`}
                title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              {/* Real-time Notifications Bell */}
              <button 
                id="phone-header-bell-btn"
                onClick={onOpenNotifications} 
                className={`p-1.5 relative rounded-full transition-transform hover:scale-105 active:scale-95 ${
                  darkMode ? 'text-gray-300 hover:bg-gray-850' : 'text-gray-700 hover:bg-gray-100'
                }`}
                title="Notifications"
              >
                <BellRing className="w-5 h-5" />
                {notificationsCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white font-sans font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                    {notificationsCount}
                  </span>
                )}
              </button>

              {/* Shopping Bag */}
              <button 
                id="phone-header-cart-btn"
                onClick={onOpenCart} 
                className={`p-1.5 relative rounded-full transition-transform hover:scale-105 active:scale-95 ${
                  darkMode ? 'text-gray-300 hover:bg-gray-850' : 'text-gray-700 hover:bg-gray-100'
                }`}
                title="Shopping Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-[#40685D] text-white font-sans font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation tabs (hidden on desktop screens) */}
          <div className="md:hidden flex items-center justify-center space-x-3 border-t border-gray-100 dark:border-gray-850/80 mt-3 pt-2 text-[10px] font-bold tracking-wider uppercase select-none">
            <button
              onClick={onOpenMenu}
              className={`transition-colors py-1 px-3 rounded-full ${
                activeView === 'menu' 
                  ? 'bg-[#40685D] text-white' 
                  : `${darkMode ? 'text-gray-300' : 'text-gray-600'}`
              }`}
            >
              Menu
            </button>
            {onOpenRewards && (
              <button
                onClick={onOpenRewards}
                className={`transition-colors py-1 px-3 rounded-full ${
                  activeView === 'rewards' 
                    ? 'bg-[#40685D] text-white' 
                    : `${darkMode ? 'text-gray-300' : 'text-gray-600'}`
                }`}
              >
                Rewards
              </button>
            )}
            {onOpenReviews && (
              <button
                onClick={onOpenReviews}
                className={`transition-colors py-1 px-3 rounded-full ${
                  activeView === 'reviews' 
                    ? 'bg-[#40685D] text-white' 
                    : `${darkMode ? 'text-gray-300' : 'text-gray-600'}`
                }`}
              >
                Reviews
              </button>
            )}
            {showTrackingButton && onOpenTracking && (
              <button
                onClick={onOpenTracking}
                className={`transition-colors py-1 px-3 rounded-full ${
                  activeView === 'tracking' 
                    ? 'bg-[#40685D] text-white' 
                    : `${darkMode ? 'text-red-400' : 'text-red-650'}`
                }`}
              >
                Tracking
              </button>
            )}
          </div>
        </header>

        {/* Scrollable Screen Content */}
        <div id="phone-scroll-content" className="flex-1 overflow-y-auto no-scrollbar pb-10 flex flex-col p-4 sm:p-6 md:p-8">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div id="phone-device-wrapper" className="relative mx-auto w-full max-w-[430px] h-[880px] bg-[#1a1c1b] rounded-[52px] p-3.5 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] border-4 border-[#2d302e] flex flex-col overflow-hidden transition-all duration-300">
      
      {/* Dynamic Island / Notch */}
      <div id="phone-notch" className="absolute top-5 left-1/2 -translate-x-1/2 w-32 h-[26px] bg-black rounded-full z-50 flex items-center justify-center shadow-inner">
        <div className="w-3 h-3 bg-[#0d0d0f] rounded-full mr-2 border border-[#222]"></div>
        <div className="w-8 h-1 bg-[#151517] rounded-full"></div>
      </div>

      {/* Internal Phone Bezel Guard */}
      <div 
        id="phone-internal-screen" 
        className={`w-full h-full rounded-[38px] overflow-hidden flex flex-col relative transition-colors duration-300 ${
          darkMode ? 'bg-[#101211] text-white' : 'bg-[#FAFAF9] text-black'
        } font-sans shadow-inner selection:bg-cta/20`}
      >
        {/* Status Bar */}
        <div className={`pt-4 px-6 pb-2 flex justify-between items-center text-xs font-semibold tracking-tight z-40 select-none ${
          darkMode ? 'text-gray-300 bg-[#101211]' : 'text-gray-700 bg-[#FAFAF9]'
        }`}>
          <div>{currentTime}</div>
          
          {/* Notification icons resembling screenshot */}
          <div className="flex items-center space-x-1">
            <span className="text-[10px] scale-90 translate-y-[0px] font-bold tracking-tight text-emerald-500">•</span>
            <span className="text-[10px] opacity-75 font-mono">4G</span>
            <Signal className="w-3.5 h-3.5 stroke-[2.5]" />
            <Wifi className="w-3.5 h-3.5 stroke-[2.5]" />
            <div className="flex items-center space-x-0.5">
              <span className="text-[9px] font-bold">100</span>
              <Battery className="w-5 h-5 opacity-90 stroke-[1.5]" />
            </div>
          </div>
        </div>

        {/* Website Address Bar Mimic */}
        <div className={`px-4 py-1.5 border-b flex items-center justify-between z-40 ${
          darkMode ? 'bg-[#181a19] border-gray-800' : 'bg-gray-100 border-gray-200'
        }`}>
          <div className="flex space-x-1.5 items-center">
            <span className="w-2 h-2 rounded-full bg-red-400"></span>
            <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
            <span className="w-2 h-2 rounded-full bg-green-400"></span>
          </div>
          <div className={`px-6 py-0.5 rounded-full text-xs font-serif tracking-wide truncate max-w-[200px] text-center ${
            darkMode ? 'bg-[#111312] text-gray-400' : 'bg-white text-gray-500 shadow-sm'
          }`}>
            nabetafood.com
          </div>
          <div className="flex items-center space-x-2">
            <button 
              id="phone-dark-mode-toggle"
              onClick={() => setDarkMode(!darkMode)}
              className={`p-1 rounded-full hover:scale-110 active:scale-95 transition-all ${
                darkMode ? 'text-yellow-400 hover:bg-gray-800' : 'text-cta hover:bg-gray-200'
              }`}
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Brand Slogan Ribbon at the strictly top container */}
        <div className="bg-[#40685D] text-white py-1.5 px-3 text-[10px] font-sans font-medium text-center tracking-wide uppercase select-none animate-pulse">
          {slogan}
        </div>

        {/* Phone App Custom Header */}
        <header className={`px-4 py-3 grid grid-cols-3 items-center border-b transition-colors z-40 ${
          darkMode ? 'bg-[#101211]/95 border-gray-800' : 'bg-white/95 border-gray-100'
        } backdrop-blur-md sticky top-0`}>
          <div className="flex items-center justify-start">
            {onBack ? (
              <button 
                id="phone-header-back-btn"
                onClick={onBack} 
                className={`p-1.5 rounded-full transition-colors ${
                  darkMode ? 'hover:bg-gray-800 text-gray-200' : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
              </button>
            ) : (
              <button 
                id="phone-header-menu-btn"
                onClick={onOpenMenu} 
                className={`p-1.5 rounded-full transition-colors ${
                  darkMode ? 'hover:bg-gray-800 text-gray-200' : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <Menu className="w-5 h-5 stroke-[2]" />
              </button>
            )}
          </div>

          <div className="flex justify-center items-center">
            <span className="font-serif font-bold text-base tracking-widest text-[#40685D] dark:text-[#a2c4b9] uppercase text-center truncate">
              {brandName}
            </span>
          </div>

          <div className="flex items-center justify-end space-x-1.5">
            {/* Real-time Notifications Bell */}
            <button 
              id="phone-header-bell-btn"
              onClick={onOpenNotifications} 
              className="p-1.5 relative rounded-full transition-transform hover:scale-105 active:scale-95"
            >
              <BellRing className={`w-5 h-5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} />
              {notificationsCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white font-sans font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                  {notificationsCount}
                </span>
              )}
            </button>

            {/* Shopping Bag matching exact icon in screenshot */}
            <button 
              id="phone-header-cart-btn"
              onClick={onOpenCart} 
              className="p-1.5 relative rounded-full transition-transform hover:scale-105 active:scale-95"
            >
              <ShoppingBag className={`w-5 h-5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#40685D] text-white font-sans font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </header>

        {/* Scrollable Screen Content */}
        <div id="phone-scroll-content" className="flex-1 overflow-y-auto no-scrollbar pb-10 flex flex-col">
          {children}
        </div>

        {/* Home Drag Indicator Bar */}
        <div className="h-6 w-full flex items-center justify-center select-none absolute bottom-0 z-50">
          <div className="w-1/3 h-1 bg-gray-500/70 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};
