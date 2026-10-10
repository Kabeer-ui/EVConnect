import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookingService } from '../services/bookingService';
import { Booking } from '../types';
import {
  Calendar,
  Clock,
  Zap,
  MapPin,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowRight,
  Plus
} from 'lucide-react';

export const MyBookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeTab, setActiveTab] = useState<'Upcoming' | 'Active' | 'History'>('Upcoming');
  const [loading, setLoading] = useState(true);
  const [cancelModalId, setCancelModalId] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    loadBookings();
  }, []);

  async function loadBookings() {
    setLoading(true);
    try {
      const data = await bookingService.getBookings();
      setBookings(data);
    } catch (err) {
      console.error('Failed to load bookings', err);
    } finally {
      setLoading(false);
    }
  }

  const handleCancelBooking = async (id: string) => {
    try {
      await bookingService.cancelBooking(id);
      setCancelModalId(null);
      await loadBookings();
    } catch (err) {
      console.error('Failed to cancel', err);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === 'Upcoming') return b.status === 'Upcoming';
    if (activeTab === 'Active') return b.status === 'Active';
    return b.status === 'Completed' || b.status === 'Cancelled';
  });

  return (
    <div className="w-full min-h-screen bg-[#F8FAF9] pb-24">
      {/* Top Header */}
      <div className="bg-white border-b border-neutral-200 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#062D24] font-display">
              My Bookings &amp; Sessions
            </h1>
            <p className="text-xs text-neutral-500 mt-1">
              Manage your reserved bays, active charging sessions, and past invoices.
            </p>
          </div>

          <Link
            to="/explore"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#062D24] text-emerald-300 font-semibold text-xs hover:bg-[#0A3D31] transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New Reservation</span>
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Demo Notice Banner */}
        <div className="mb-6 p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/60 text-xs text-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span>
            <strong>Simulated Session History:</strong> Bookings shown below represent mock database records for demonstration.
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded self-start sm:self-auto">
            Demo State
          </span>
        </div>

        {/* Filter Tabs (Interactive segmented buttons) */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-neutral-200/60 max-w-sm mb-6">
          <button
            onClick={() => setActiveTab('Upcoming')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'Upcoming'
                ? 'bg-white text-[#062D24] shadow-sm'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Upcoming ({bookings.filter((b) => b.status === 'Upcoming').length})
          </button>
          <button
            onClick={() => setActiveTab('Active')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'Active'
                ? 'bg-white text-[#062D24] shadow-sm'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Active (0)
          </button>
          <button
            onClick={() => setActiveTab('History')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'History'
                ? 'bg-white text-[#062D24] shadow-sm'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            History ({bookings.filter((b) => b.status === 'Completed' || b.status === 'Cancelled').length})
          </button>
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="py-20 text-center text-xs text-neutral-400">Loading bookings...</div>
        ) : filteredBookings.length === 0 ? (
          /* Realistic empty states */
          <div className="p-10 rounded-3xl bg-white border border-neutral-200 text-center max-w-md mx-auto my-6">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto mb-3">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-neutral-900 mb-1">
              No {activeTab.toLowerCase()} bookings
            </h3>
            <p className="text-xs text-neutral-500 mb-5 leading-relaxed">
              {activeTab === 'Upcoming'
                ? 'You do not have any pending charging slots scheduled right now.'
                : activeTab === 'Active'
                ? 'No charging sessions are currently dispensing power to your vehicle.'
                : 'You have no past completed charging receipts in this period.'}
            </p>
            <Link
              to="/explore"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#062D24] text-emerald-300 font-semibold text-xs hover:bg-[#0A3D31] transition-colors"
            >
              <span>Explore chargers</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          /* Bookings Card List */
          <div className="space-y-4">
            {filteredBookings.map((b) => {
              const isUpcoming = b.status === 'Upcoming';
              const isCompleted = b.status === 'Completed';
              const isCancelled = b.status === 'Cancelled';

              return (
                <div
                  key={b.id}
                  className="p-6 rounded-3xl bg-white border border-neutral-200/90 shadow-sm hover:border-neutral-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="space-y-2 max-w-xl">
                    <div className="flex items-center gap-2 text-xs text-neutral-500">
                      <span className="font-mono font-bold text-[#062D24]">{b.id}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-emerald-800 font-semibold">{b.operator}</span>
                      <span aria-hidden="true">·</span>
                      <span
                        className={`font-semibold ${
                          isUpcoming
                            ? 'text-emerald-700'
                            : isCompleted
                            ? 'text-neutral-700'
                            : 'text-rose-600'
                        }`}
                      >
                        {b.status}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-neutral-900 font-display">
                      {b.stationName}
                    </h3>

                    <p className="text-xs text-neutral-500 line-clamp-1 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                      {b.stationAddress}
                    </p>

                    <div className="pt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-neutral-600">
                      <span className="flex items-center gap-1.5 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                        {b.date}
                      </span>
                      <span className="flex items-center gap-1.5 font-medium">
                        <Clock className="w-3.5 h-3.5 text-emerald-700" />
                        {b.timeSlot}
                      </span>
                      <span className="flex items-center gap-1.5 font-medium">
                        <Zap className="w-3.5 h-3.5 text-emerald-700" />
                        {b.connectorPowerKw} kW ({b.connectorType})
                      </span>
                    </div>
                  </div>

                  {/* Right Action column */}
                  <div className="flex flex-col sm:flex-row md:flex-col items-stretch sm:items-center md:items-end justify-between gap-3 border-t md:border-t-0 pt-4 md:pt-0 border-neutral-100">
                    <div className="text-left md:text-right">
                      <span className="text-[11px] text-neutral-400 block">Session Total</span>
                      <span className="text-lg font-black text-neutral-900 tabular-nums font-display">
                        ${b.estimatedCost.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        to={`/stations/${b.stationId}`}
                        className="px-3 py-1.5 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors"
                      >
                        Station Info
                      </Link>

                      {isUpcoming && (
                        <button
                          onClick={() => setCancelModalId(b.id)}
                          className="px-3 py-1.5 rounded-xl border border-rose-200 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Cancel Confirmation Dialog */}
      {cancelModalId && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-sm w-full p-6 rounded-3xl bg-white border border-neutral-200 shadow-2xl text-center">
            <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
            <h4 className="text-base font-bold text-neutral-900 mb-1">Cancel Reservation?</h4>
            <p className="text-xs text-neutral-500 mb-6">
              Your guaranteed charging stall hold will be released back to the public network immediately.
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCancelModalId(null)}
                className="flex-1 py-2.5 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-700 hover:bg-neutral-50"
              >
                Keep Booking
              </button>
              <button
                onClick={() => handleCancelBooking(cancelModalId)}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
