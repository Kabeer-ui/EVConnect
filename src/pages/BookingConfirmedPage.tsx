import React, { useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Booking } from '../types';
import { CheckCircle2, Calendar, Clock, Zap, MapPin, ArrowRight, Home, CalendarCheck } from 'lucide-react';

export const BookingConfirmedPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const booking = (location.state as { booking?: Booking })?.booking;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Fallback data if page accessed directly
  const bookingData: Booking = booking || {
    id: 'EVC-8842',
    stationId: 'sta-101',
    stationName: 'Presidio Green Hub',
    stationAddress: '100 Montgomery St, Presidio Heights',
    operator: 'Electrify America',
    connectorId: 'c-101-2',
    connectorType: 'CCS2',
    connectorPowerKw: 350,
    date: '2026-10-08',
    timeSlot: '17:30 - 18:15',
    durationMinutes: 45,
    estimatedKwh: 48,
    estimatedCost: 18.24,
    status: 'Upcoming',
    createdAt: new Date().toISOString(),
    vehicleModel: 'Hyundai Ioniq 5 AWD Long Range'
  };

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] bg-[#F8FAF9] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-xl w-full">
        {/* Main Confirmation Card */}
        <div className="rounded-3xl bg-white border border-neutral-200/90 shadow-xl p-8 sm:p-10 text-center relative overflow-hidden">
          {/* Subtle top decoration */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400" />

          {/* Icon */}
          <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-5 shadow-sm border border-emerald-100">
            <CheckCircle2 className="w-9 h-9 stroke-[2.2]" />
          </div>

          <div className="text-xs font-bold text-emerald-800 tracking-wider uppercase mb-1">
            Demo Reservation Confirmed
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#062D24] font-display mb-2">
            Charging Bay Reserved
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 max-w-md mx-auto mb-6">
            Demonstration booking recorded in local session state. When backend integration is active, this confirms directly via station operator APIs.
          </p>

          {/* Booking Details Box */}
          <div className="p-5 rounded-2xl bg-[#F8FAF9] border border-neutral-200 text-left space-y-3.5 mb-8 text-xs">
            <div className="flex items-center justify-between pb-2.5 border-b border-neutral-200">
              <span className="text-neutral-500 font-medium">Reservation Code</span>
              <span className="font-mono font-bold text-emerald-900 text-sm tracking-wide">
                {bookingData.id}
              </span>
            </div>

            <div className="flex items-start justify-between pb-2.5 border-b border-neutral-200">
              <span className="text-neutral-500 font-medium">Station &amp; Host</span>
              <div className="text-right">
                <span className="font-bold text-neutral-900 block">{bookingData.stationName}</span>
                <span className="text-[11px] text-neutral-500">{bookingData.operator}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pb-2.5 border-b border-neutral-200">
              <span className="text-neutral-500 font-medium">Location</span>
              <span className="font-medium text-neutral-800 truncate max-w-[220px]">
                {bookingData.stationAddress}
              </span>
            </div>

            <div className="flex items-center justify-between pb-2.5 border-b border-neutral-200">
              <span className="text-neutral-500 font-medium">Date &amp; Time</span>
              <span className="font-bold text-neutral-900">
                {bookingData.date} · {bookingData.timeSlot}
              </span>
            </div>

            <div className="flex items-center justify-between pb-2.5 border-b border-neutral-200">
              <span className="text-neutral-500 font-medium">Connector</span>
              <span className="font-semibold text-neutral-900">
                {bookingData.connectorPowerKw} kW {bookingData.connectorType}
              </span>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-neutral-500 font-medium">Estimated Energy &amp; Cost</span>
              <span className="font-bold text-[#062D24] tabular-nums">
                ~{bookingData.estimatedKwh} kWh (${bookingData.estimatedCost.toFixed(2)})
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <Link
              to="/bookings"
              className="w-full sm:flex-1 py-3 px-4 rounded-2xl bg-[#062D24] hover:bg-[#0A3D31] text-emerald-300 font-bold text-xs tracking-tight transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>View My Bookings</span>
            </Link>

            <Link
              to="/"
              className="w-full sm:flex-1 py-3 px-4 rounded-2xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-semibold text-xs transition-colors flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
