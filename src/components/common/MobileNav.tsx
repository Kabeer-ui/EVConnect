import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, CalendarCheck, Sparkles, User } from 'lucide-react';

export const MobileNav: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Explore', path: '/explore', icon: Compass },
    { label: 'Bookings', path: '/bookings', icon: CalendarCheck },
    { label: 'AI Copilot', path: '/assistant', icon: Sparkles },
    { label: 'Profile', path: '/profile', icon: User }
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#F8FAF9]/95 backdrop-blur-lg border-t border-emerald-950/10 py-2 px-3 shadow-lg">
      <div className="grid grid-cols-5 items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center py-1 transition-colors ${
                active ? 'text-[#062D24] font-bold' : 'text-neutral-500 hover:text-neutral-800'
              }`}
            >
              <div
                className={`p-1 rounded-xl transition-all ${
                  active ? 'bg-emerald-100 text-[#062D24]' : ''
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
