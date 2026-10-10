import React from 'react';
import { Link } from 'react-router-dom';
import { Booking } from '../../types';
import { Calendar, Clock, Zap, MapPin, ArrowRight, ShieldCheck } from 'lucide-react';

interface UpcomingBookingSectionProps {
  booking: Booking | null;
}

export const UpcomingBookingSection: React.FC<UpcomingBookingSectionProps> = ({ booking }) => {
  return (
    <section className="py-12 bg-white border-b border-emerald-950/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="text-xs font-bold text-emerald-800 tracking-wider uppercase mb-1">
              Active Itinerary
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-[#062D24] font-display">
              Upcoming Reservation
            </h3>
          </div>
          <Link
            to="/bookings"
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 transition-colors"
          >
            All Bookings →
          </Link>
        </div>

        {booking ? (
          <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-[#062D24] to-[#0A3D31] text-white shadow-xl relative overflow-hidden">
            {/* Ambient subtle glow ring */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-3 max-w-xl">
                <div className="flex items-center gap-2 text-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-emerald-300 font-semibold">{booking.status} Reservation (Demo)</span>
                  <span className="text-emerald-500/60" aria-hidden="true">·</span>
                  <span className="text-emerald-200/80 font-mono">Ref: {booking.id}</span>
                </div>

                <h4 className="text-2xl font-extrabold text-white font-display">
                  {booking.stationName}
                </h4>

                <p className="text-xs sm:text-sm text-emerald-200/90 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{booking.stationAddress}</span>
                </p>

                {/* Reservation Specs */}
                <div className="pt-2 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-emerald-100">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-emerald-400" />
                    <span>{booking.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-emerald-400" />
                    <span>{booking.timeSlot} ({booking.durationMinutes} min)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-emerald-400" />
                    <span>{booking.connectorPowerKw} kW {booking.connectorType}</span>
                  </div>
                </div>
              </div>

              {/* Action column */}
              <div className="flex flex-col sm:flex-row lg:flex-col items-stretch lg:items-end gap-3 shrink-0">
                <div className="text-left lg:text-right">
                  <span className="text-[11px] text-emerald-300/80 block">Estimated Cost</span>
                  <span className="text-xl font-black text-white tabular-nums">
                    ${booking.estimatedCost.toFixed(2)}
                  </span>
                </div>

                <Link
                  to="/bookings"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-emerald-400 hover:bg-emerald-300 text-[#05251D] font-bold text-xs tracking-tight transition-all duration-150 shadow-md"
                >
                  <span>View Booking</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        ) : (
          /* Empty state */
          <div className="p-8 rounded-3xl bg-[#F8FAF9] border border-neutral-200 text-center flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center mb-3">
              <Calendar className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-neutral-900 mb-1">No upcoming bookings</h4>
            <p className="text-xs text-neutral-500 max-w-sm mb-4">
              Reserve your next charging slot in advance to ensure an open connector when you arrive.
            </p>
            <Link
              to="/explore"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-900 transition-colors"
            >
              <span>Find a charger</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};
