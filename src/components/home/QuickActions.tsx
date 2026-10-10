import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, CalendarPlus, CalendarCheck2, Sparkles, ArrowRight } from 'lucide-react';

export const QuickActions: React.FC = () => {
  const actions = [
    {
      title: 'Find Chargers',
      description: 'Search by network, connector, and live availability status.',
      icon: Compass,
      link: '/explore',
      accentColor: 'text-emerald-700'
    },
    {
      title: 'Book a Slot',
      description: 'Reserve a guaranteed fast-charging bay before arrival.',
      icon: CalendarPlus,
      link: '/explore',
      accentColor: 'text-emerald-700'
    },
    {
      title: 'My Bookings',
      description: 'View active reservations, past receipts, and trip logs.',
      icon: CalendarCheck2,
      link: '/bookings',
      accentColor: 'text-emerald-700'
    },
    {
      title: 'Ask EVConnect AI',
      description: 'Instant answers on compatible plugs, route stops, and timing.',
      icon: Sparkles,
      link: '/assistant',
      accentColor: 'text-emerald-700'
    }
  ];

  return (
    <section className="py-12 bg-[#F8FAF9] border-b border-emerald-950/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h3 className="text-xs font-bold text-emerald-800 tracking-wider uppercase mb-1">
            Quick Actions
          </h3>
          <h2 className="text-xl sm:text-2xl font-bold text-[#062D24] font-display">
            Fast access for drivers
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {actions.map((act) => {
            const Icon = act.icon;
            return (
              <Link
                key={act.title}
                to={act.link}
                className="p-5 rounded-2xl bg-white border border-neutral-200/80 hover:border-emerald-600/40 hover:shadow-md transition-all duration-150 flex flex-col justify-between group"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center mb-4 transition-transform group-hover:scale-105">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-neutral-900 group-hover:text-emerald-800 transition-colors mb-1">
                    {act.title}
                  </h4>
                  <p className="text-xs text-neutral-500 leading-relaxed">
                    {act.description}
                  </p>
                </div>

                <div className="pt-4 mt-2 flex items-center gap-1 text-xs font-semibold text-emerald-700 group-hover:translate-x-0.5 transition-transform">
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};
