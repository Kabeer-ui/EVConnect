import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bell, User, Zap, Sparkles, Calendar, Compass, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  onOpenNotifications?: () => void;
}

export const Navbar: React.FC<NavbarProps> = () => {
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Explore', path: '/explore' },
    { label: 'Bookings', path: '/bookings' },
    { label: 'AI Assistant', path: '/assistant' },
    { label: 'Impact', path: '/impact' }
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#F8FAF9]/85 backdrop-blur-md border-b border-emerald-950/10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Brand Wordmark (Single clean element) */}
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="flex items-center gap-2 group focus-visible:outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-[#062D24] text-emerald-400 flex items-center justify-center shadow-md transition-transform group-hover:scale-105">
              <Zap className="w-5 h-5 fill-emerald-400 stroke-none" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-[#062D24] font-display">
              EVConnect
            </span>
          </Link>
        </div>

        {/* Zone 2: Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-7">
          {navLinks.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-semibold transition-colors duration-150 relative py-1 ${
                  active
                    ? 'text-[#062D24]'
                    : 'text-neutral-600 hover:text-[#062D24]'
                }`}
              >
                {item.label}
                {active && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Zone 3: Actions (Notification, Profile) */}
        <div className="flex items-center gap-3">
          {/* Notification Button */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-xl text-neutral-600 hover:text-[#062D24] hover:bg-emerald-900/5 transition-colors relative"
              aria-label="View notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white border border-neutral-200 shadow-xl p-4 z-50 text-neutral-900 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                  <h4 className="text-sm font-bold text-[#062D24]">Notifications</h4>
                  <span className="text-xs text-emerald-600 font-medium">1 new</span>
                </div>
                <div className="divide-y divide-neutral-100 py-2">
                  <div className="py-2.5">
                    <p className="text-xs font-semibold text-neutral-800">Demo Booking: Presidio Green Hub</p>
                    <p className="text-[11px] text-neutral-500 mt-0.5">Oct 8, 17:30 – 18:15 (Bay 2 simulated)</p>
                    <span className="text-[10px] text-emerald-600 font-medium block mt-1">10 mins ago</span>
                  </div>
                  <div className="py-2.5">
                    <p className="text-xs font-medium text-neutral-700">Sample Alert: 350kW bay open in Marina</p>
                    <p className="text-[11px] text-neutral-500 mt-0.5">Simulated network update for demo cluster.</p>
                  </div>
                </div>
                <Link
                  to="/bookings"
                  onClick={() => setShowNotifications(false)}
                  className="block text-center text-xs font-semibold text-emerald-700 hover:text-emerald-800 pt-2 border-t border-neutral-100"
                >
                  Manage All Bookings →
                </Link>
              </div>
            )}
          </div>

          {/* User Profile Avatar Link */}
          <Link
            to="/profile"
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-emerald-950/5 hover:bg-emerald-900/10 border border-emerald-950/10 transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-[#062D24] text-emerald-300 flex items-center justify-center font-bold text-xs">
              AR
            </div>
            <span className="hidden sm:inline text-xs font-semibold text-[#062D24]">
              Alex
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
};
