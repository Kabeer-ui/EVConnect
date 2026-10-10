import React from 'react';
import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#07241C] text-neutral-300 pt-14 pb-20 md:pb-12 border-t border-emerald-950/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-emerald-900/40">
          {/* Brand & Platform Notice */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 text-[#07241C] flex items-center justify-center font-bold">
                <Zap className="w-4 h-4 fill-[#07241C] stroke-none" />
              </div>
              <span className="text-lg font-bold text-white font-display">EVConnect</span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed mb-4">
              An open mobility discovery and booking layer connecting drivers with public and partner charging networks.
            </p>
            <p className="text-[11px] text-emerald-400/80 leading-normal">
              Notice: EVConnect operates as an aggregator and booking platform. Charging infrastructure is owned and maintained by partner networks.
            </p>
          </div>

          {/* Navigation links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Discovery</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/explore" className="hover:text-emerald-400 transition-colors">
                  Explore Stations
                </Link>
              </li>
              <li>
                <Link to="/explore?filter=fast" className="hover:text-emerald-400 transition-colors">
                  Ultra-Fast Chargers (&ge; 150 kW)
                </Link>
              </li>
              <li>
                <Link to="/explore?filter=available" className="hover:text-emerald-400 transition-colors">
                  Live Available Bays
                </Link>
              </li>
              <li>
                <Link to="/assistant" className="hover:text-emerald-400 transition-colors">
                  EVConnect AI Copilot
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Account & Trips</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/bookings" className="hover:text-emerald-400 transition-colors">
                  My Reservations
                </Link>
              </li>
              <li>
                <Link to="/impact" className="hover:text-emerald-400 transition-colors">
                  Environmental Impact
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-emerald-400 transition-colors">
                  Vehicles & Settings
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-emerald-400 transition-colors">
                  Sign In
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Network Partners</h4>
            <p className="text-xs text-neutral-400 leading-relaxed mb-3">
              Integrating with Electrify America, ChargePoint, EVgo, BP Pulse, and municipal grids.
            </p>
            <div className="flex flex-wrap gap-2 text-[11px] text-emerald-300/80">
              <span className="px-2 py-1 rounded bg-[#0A3026]">Open Roaming</span>
              <span className="px-2 py-1 rounded bg-[#0A3026]">OCPI 2.2</span>
              <span className="px-2 py-1 rounded bg-[#0A3026]">Plug &amp; Charge</span>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-neutral-400 gap-3">
          <p>© {new Date().getFullYear()} EVConnect Mobility Platform. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-neutral-200 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-neutral-200 cursor-pointer">Terms of Service</span>
            <span className="hover:text-neutral-200 cursor-pointer">Station Partner API</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
