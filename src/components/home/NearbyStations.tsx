import React from 'react';
import { Link } from 'react-router-dom';
import { Station } from '../../types';
import { Zap, ArrowRight, Info } from 'lucide-react';

interface NearbyStationsProps {
  stations: Station[];
}

export const NearbyStations: React.FC<NearbyStationsProps> = ({ stations }) => {
  return (
    <section className="py-14 bg-white border-b border-emerald-950/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-xs font-bold text-emerald-800 tracking-wider uppercase mb-1.5 flex items-center gap-1.5">
              <span>Sample Hubs</span>
              <span className="text-neutral-400">·</span>
              <span className="text-emerald-700 font-semibold">Simulated Bay Status</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#062D24] font-display">
              Sample Charging Stations
            </h2>
            <p className="text-sm text-neutral-600 mt-1 max-w-xl">
              High-output charging hubs from the SF Bay Area demo cluster. Distance calculated from cluster reference point.
            </p>
          </div>

          <Link
            to="/explore"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-900 transition-colors shrink-0"
          >
            <span>Explore all {stations.length} hubs</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Station Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stations.slice(0, 3).map((station) => {
            const isAvailable = station.availableConnectors > 0;
            const uniqueConnectors = Array.from(new Set(station.connectors.map((c) => c.type))).join(', ');

            return (
              <div
                key={station.id}
                className="rounded-2xl p-6 bg-[#F8FAF9] border border-neutral-200/90 hover:border-emerald-700/40 hover:shadow-lg transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  {/* Clean unboxed operator & demo metadata */}
                  <div className="flex items-center justify-between text-xs text-neutral-500 mb-2 gap-2">
                    <div className="flex items-center gap-1.5 font-medium truncate">
                      <span className="text-emerald-800 font-semibold">{station.operator}</span>
                      <span aria-hidden="true">·</span>
                      <span className="truncate">~{station.distanceKm} km (Demo)</span>
                    </div>

                    {/* Demo Status text with accessible indicator dot */}
                    <div className="flex items-center gap-1.5 text-xs font-semibold shrink-0">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isAvailable ? 'bg-emerald-500' : 'bg-amber-500'
                        }`}
                      />
                      <span className={isAvailable ? 'text-emerald-800' : 'text-amber-800'}>
                        {station.status} (Demo)
                      </span>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-[#062D24] font-display group-hover:text-emerald-800 transition-colors mb-1.5 line-clamp-1">
                    {station.name}
                  </h3>

                  <p className="text-xs text-neutral-500 line-clamp-1 mb-4">
                    {station.address}
                  </p>

                  {/* Clean Data Specs Block */}
                  <div className="p-3.5 rounded-xl bg-white border border-neutral-200/70 mb-4 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-500">Charging Speed</span>
                      <span className="font-semibold text-neutral-900 flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5 text-emerald-600" />
                        {station.chargingSpeed}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-500">Simulated Bays</span>
                      <span className="font-semibold text-neutral-900 tabular-nums">
                        {station.availableConnectors} of {station.totalConnectors} bays free
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-500">Price Rate</span>
                      <span className="font-semibold text-neutral-900 tabular-nums">
                        ${station.pricePerKwh.toFixed(2)} / kWh
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-neutral-100">
                      <span className="text-neutral-500">Connectors</span>
                      <span className="text-neutral-700 font-medium truncate max-w-[170px]" title={uniqueConnectors}>
                        {uniqueConnectors}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="flex items-center gap-2 pt-2">
                  <Link
                    to={`/stations/${station.id}`}
                    className="flex-1 py-2.5 px-3 text-center text-xs font-semibold rounded-xl bg-white hover:bg-neutral-100 text-neutral-800 border border-neutral-200 transition-colors"
                  >
                    View Details
                  </Link>
                  <Link
                    to={`/booking/${station.id}`}
                    className="flex-1 py-2.5 px-3 text-center text-xs font-semibold rounded-xl bg-[#062D24] hover:bg-[#0A3D31] text-emerald-300 transition-colors shadow-sm"
                  >
                    Reserve Bay
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
