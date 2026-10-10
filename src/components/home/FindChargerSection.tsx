import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, ArrowRight, Zap, Info } from 'lucide-react';
import { Station } from '../../types';
import { InteractiveMap } from '../common/InteractiveMap';

interface FindChargerSectionProps {
  stations: Station[];
}

export const FindChargerSection: React.FC<FindChargerSectionProps> = ({ stations }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpeed, setSelectedSpeed] = useState<number | 'all'>('all');

  const filteredStations = stations.filter((s) => {
    const matchesSearch =
      searchQuery.trim() === '' ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.operator.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSpeed =
      selectedSpeed === 'all' ||
      s.connectors.some((c) => c.powerKw >= (selectedSpeed as number));

    return matchesSearch && matchesSpeed;
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/explore?search=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <section className="py-14 bg-[#F8FAF9] border-b border-emerald-950/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
          <div>
            <div className="text-xs font-bold text-emerald-800 tracking-wider uppercase mb-1.5 flex items-center gap-1.5">
              <span>Interactive Geographic Map</span>
              <span className="text-neutral-400">·</span>
              <span className="text-emerald-700 font-semibold">Demo Dataset</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#062D24] font-display">
              Find a charger near you
            </h2>
            <p className="text-sm text-neutral-600 mt-1 max-w-xl">
              Explore public and partner charging networks. Sample stations shown from the San Francisco Bay Area prototype cluster.
            </p>
          </div>

          <Link
            to="/explore"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-900 transition-colors shrink-0"
          >
            <span>View all {stations.length} stations</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Demo Data Disclaimer Banner */}
        <div className="mb-4 px-4 py-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200/60 text-xs text-emerald-900 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>
              <strong>Note:</strong> Showing sample demo stations. Bay status and connector availability are simulated for interface evaluation.
            </span>
          </div>
          <span className="text-[10px] uppercase tracking-wider font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded">
            Prototype
          </span>
        </div>

        {/* Search & Quick Controls Bar */}
        <div className="p-3 mb-6 rounded-2xl bg-white border border-neutral-200/80 shadow-sm flex flex-col md:flex-row items-stretch md:items-center gap-3">
          <form onSubmit={handleSearchSubmit} className="flex-1 relative min-w-0">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search station name, street or operator (e.g. Presidio, SOMA)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-50/80 border border-neutral-200 text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all placeholder:text-neutral-400"
            />
          </form>

          {/* Quick Speed Filter Segmented Buttons */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 text-xs shrink-0 max-w-full">
            <button
              onClick={() => setSelectedSpeed('all')}
              className={`px-3 py-2 rounded-xl font-semibold whitespace-nowrap transition-colors ${
                selectedSpeed === 'all'
                  ? 'bg-[#062D24] text-white shadow-sm'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              All Speeds
            </button>
            <button
              onClick={() => setSelectedSpeed(150)}
              className={`px-3 py-2 rounded-xl font-semibold whitespace-nowrap transition-colors flex items-center gap-1 ${
                selectedSpeed === 150
                  ? 'bg-[#062D24] text-white shadow-sm'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              <span>&ge; 150 kW</span>
            </button>
            <button
              onClick={() => setSelectedSpeed(300)}
              className={`px-3 py-2 rounded-xl font-semibold whitespace-nowrap transition-colors flex items-center gap-1 ${
                selectedSpeed === 300
                  ? 'bg-[#062D24] text-white shadow-sm'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              <span>&ge; 300 kW Ultra</span>
            </button>
          </div>

          <Link
            to="/explore"
            className="px-4 py-2.5 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap border border-emerald-200 shrink-0"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Faceted Filters</span>
          </Link>
        </div>

        {/* Map Container */}
        <div className="rounded-2xl overflow-hidden shadow-md border border-neutral-200">
          <InteractiveMap
            stations={filteredStations}
            heightClass="h-[440px] sm:h-[480px]"
            showControls={true}
          />
        </div>
      </div>
    </section>
  );
};
