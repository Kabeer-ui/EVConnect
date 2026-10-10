import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { stationService } from '../services/stationService';
import { bookingService } from '../services/bookingService';
import { authService } from '../services/authService';
import { Station, Connector, TimeSlot } from '../types';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Zap,
  CheckCircle2,
  ShieldCheck,
  ChevronRight,
  MapPin,
  Car
} from 'lucide-react';

const GENERATED_TIME_SLOTS: TimeSlot[] = [
  { id: 'ts-1', time: '08:00 - 08:45', status: 'Available' },
  { id: 'ts-2', time: '09:00 - 09:45', status: 'Occupied' },
  { id: 'ts-3', time: '10:00 - 10:45', status: 'Available' },
  { id: 'ts-4', time: '11:15 - 12:00', status: 'Available' },
  { id: 'ts-5', time: '12:30 - 13:15', status: 'Occupied' },
  { id: 'ts-6', time: '14:00 - 14:45', status: 'Available' },
  { id: 'ts-7', time: '15:15 - 16:00', status: 'Available' },
  { id: 'ts-8', time: '16:30 - 17:15', status: 'Occupied' },
  { id: 'ts-9', time: '17:30 - 18:15', status: 'Available' },
  { id: 'ts-10', time: '18:45 - 19:30', status: 'Available' },
  { id: 'ts-11', time: '20:00 - 20:45', status: 'Available' }
];

export const BookingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [station, setStation] = useState<Station | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Stepper state (1: Connector, 2: Date, 3: Slot, 4: Review)
  const [step, setStep] = useState<number>(1);

  // Selection states
  const [selectedConnector, setSelectedConnector] = useState<Connector | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('2026-10-08');
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [batteryTargetPct, setBatteryTargetPct] = useState<number>(80);

  const currentUser = authService.getCurrentUser();
  const currentVehicle = currentUser.vehicles[0];

  useEffect(() => {
    window.scrollTo(0, 0);
    async function loadStation() {
      if (!id) return;
      try {
        const data = await stationService.getStationById(id);
        if (data) {
          setStation(data);
          // Auto select first available connector
          const firstAvailable = data.connectors.find((c) => c.status === 'available') || data.connectors[0];
          setSelectedConnector(firstAvailable);
          // Auto select first available slot
          const firstSlot = GENERATED_TIME_SLOTS.find((s) => s.status === 'Available') || GENERATED_TIME_SLOTS[0];
          setSelectedSlot(firstSlot);
        }
      } catch (err) {
        console.error('Failed to load station', err);
      } finally {
        setLoading(false);
      }
    }
    loadStation();
  }, [id]);

  if (loading) {
    return <div className="py-20 text-center text-neutral-400">Loading booking setup...</div>;
  }

  if (!station || !selectedConnector) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center px-4">
        <h2 className="text-lg font-bold text-neutral-800">Station Unavailable</h2>
        <Link to="/explore" className="text-xs text-emerald-700 font-semibold underline mt-2 block">
          Return to station directory
        </Link>
      </div>
    );
  }

  const estimatedKwh = 45; // approx 45 kWh session
  const estimatedCost = Number((estimatedKwh * selectedConnector.pricePerKwh).toFixed(2));

  const handleConfirmBooking = async () => {
    if (!selectedSlot) return;
    setIsSubmitting(true);
    try {
      const newBooking = await bookingService.createBooking({
        stationId: station.id,
        stationName: station.name,
        stationAddress: station.address,
        operator: station.operator,
        connectorId: selectedConnector.id,
        connectorType: selectedConnector.type,
        connectorPowerKw: selectedConnector.powerKw,
        date: selectedDate,
        timeSlot: selectedSlot.time,
        durationMinutes: 45,
        estimatedKwh,
        estimatedCost,
        vehicleModel: `${currentVehicle.brand} ${currentVehicle.model}`,
        batteryStartPct: 20,
        batteryTargetPct,
        isDemo: true
      });

      // Navigate to booking-confirmed with the booking in state
      navigate('/booking-confirmed', { state: { booking: newBooking } });
    } catch (err) {
      console.error('Failed to create booking', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const datesList = [
    { label: 'Today', value: '2026-10-07', weekday: 'Wed' },
    { label: 'Tomorrow', value: '2026-10-08', weekday: 'Thu' },
    { label: 'Friday', value: '2026-10-09', weekday: 'Fri' },
    { label: 'Saturday', value: '2026-10-10', weekday: 'Sat' }
  ];

  return (
    <div className="w-full min-h-screen bg-[#F8FAF9] pb-24">
      {/* Top Header */}
      <div className="bg-white border-b border-neutral-200 py-3.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link
            to={`/stations/${station.id}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Cancel &amp; return to {station.name}</span>
          </Link>
          <div className="text-xs font-semibold text-neutral-500">
            Step {step} of 4
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Prototype Reservation Notice */}
        <div className="mb-6 p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/60 text-xs text-emerald-950 flex items-center justify-between gap-2">
          <span>
            <strong>Demo Reservation Flow:</strong> This booking is simulated locally for testing. It will persist in your session and will not charge a real card.
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded shrink-0">
            Simulated
          </span>
        </div>

        {/* Stepper Progress Bar */}
        <div className="mb-8">
          <div className="grid grid-cols-4 gap-2 text-xs font-semibold">
            <button
              onClick={() => setStep(1)}
              className={`pb-2 border-b-2 text-left transition-colors ${
                step >= 1 ? 'border-emerald-600 text-[#062D24]' : 'border-neutral-200 text-neutral-400'
              }`}
            >
              1. Connector
            </button>
            <button
              onClick={() => setStep(2)}
              className={`pb-2 border-b-2 text-left transition-colors ${
                step >= 2 ? 'border-emerald-600 text-[#062D24]' : 'border-neutral-200 text-neutral-400'
              }`}
            >
              2. Date
            </button>
            <button
              onClick={() => setStep(3)}
              className={`pb-2 border-b-2 text-left transition-colors ${
                step >= 3 ? 'border-emerald-600 text-[#062D24]' : 'border-neutral-200 text-neutral-400'
              }`}
            >
              3. Time Slot
            </button>
            <button
              onClick={() => setStep(4)}
              className={`pb-2 border-b-2 text-left transition-colors ${
                step >= 4 ? 'border-emerald-600 text-[#062D24]' : 'border-neutral-200 text-neutral-400'
              }`}
            >
              4. Review
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Booking Content */}
          <div className="lg:col-span-8 space-y-6">

            {/* STEP 1: Select Connector */}
            {step === 1 && (
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-neutral-200 shadow-sm animate-in fade-in">
                <h2 className="text-xl font-bold text-[#062D24] font-display mb-1">
                  1. Select Charging Bay &amp; Connector
                </h2>
                <p className="text-xs text-neutral-500 mb-6">
                  Choose a connector matching your vehicle port. Verified for {currentVehicle.brand} {currentVehicle.model}.
                </p>

                <div className="space-y-3">
                  {station.connectors.map((c, i) => {
                    const isSelected = selectedConnector.id === c.id;
                    const isAvailable = c.status === 'available';

                    return (
                      <div
                        key={c.id}
                        onClick={() => setSelectedConnector(c)}
                        className={`p-4 rounded-2xl cursor-pointer border transition-all flex items-center justify-between ${
                          isSelected
                            ? 'border-emerald-600 bg-emerald-50/40 ring-1 ring-emerald-500/20'
                            : 'border-neutral-200 bg-white hover:border-neutral-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                              isSelected ? 'bg-[#062D24] text-emerald-300' : 'bg-neutral-100 text-neutral-600'
                            }`}
                          >
                            <Zap className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-neutral-900">
                                Bay 0{i + 1} · {c.type}
                              </span>
                              <span className="text-[11px] text-neutral-500 font-medium">({c.currentType})</span>
                            </div>
                            <span className="text-xs text-emerald-800 font-medium">
                              {c.powerKw} kW Max Output
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-xs font-bold text-neutral-900 block tabular-nums">
                            ${c.pricePerKwh.toFixed(2)}/kWh
                          </span>
                          <span className={`text-[11px] font-semibold ${isAvailable ? 'text-emerald-700' : 'text-neutral-500'}`}>
                            {isAvailable ? 'Immediate bay' : 'Occupied bay'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setStep(2)}
                    className="px-6 py-3 rounded-2xl bg-[#062D24] hover:bg-[#0A3D31] text-emerald-300 font-bold text-xs transition-colors flex items-center gap-1.5"
                  >
                    <span>Continue to Date</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Select Date */}
            {step === 2 && (
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-neutral-200 shadow-sm animate-in fade-in">
                <h2 className="text-xl font-bold text-[#062D24] font-display mb-1">
                  2. Select Charging Date
                </h2>
                <p className="text-xs text-neutral-500 mb-6">
                  Select the day you plan to arrive at {station.name}.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                  {datesList.map((d) => {
                    const isSelected = selectedDate === d.value;
                    return (
                      <button
                        key={d.value}
                        onClick={() => setSelectedDate(d.value)}
                        className={`p-4 rounded-2xl border text-center transition-all ${
                          isSelected
                            ? 'border-emerald-600 bg-emerald-50/50 ring-1 ring-emerald-500/20'
                            : 'border-neutral-200 bg-white hover:border-neutral-300'
                        }`}
                      >
                        <span className="text-xs text-neutral-400 uppercase font-semibold block">{d.weekday}</span>
                        <span className="text-sm font-bold text-neutral-900 block my-0.5">{d.label}</span>
                        <span className="text-[11px] text-neutral-500">{d.value.split('-').slice(1).join('/')}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
                  <button
                    onClick={() => setStep(1)}
                    className="text-xs font-semibold text-neutral-600 hover:text-neutral-900"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="px-6 py-3 rounded-2xl bg-[#062D24] hover:bg-[#0A3D31] text-emerald-300 font-bold text-xs transition-colors flex items-center gap-1.5"
                  >
                    <span>Continue to Time Slot</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Select Time Slot */}
            {step === 3 && (
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-neutral-200 shadow-sm animate-in fade-in">
                <h2 className="text-xl font-bold text-[#062D24] font-display mb-1">
                  3. Select 45-Minute Window
                </h2>
                <p className="text-xs text-neutral-500 mb-6">
                  Bays are held for up to 15 minutes past arrival time.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                  {GENERATED_TIME_SLOTS.map((slot) => {
                    const isSelected = selectedSlot?.id === slot.id;
                    const isOccupied = slot.status === 'Occupied';

                    return (
                      <button
                        key={slot.id}
                        disabled={isOccupied}
                        onClick={() => setSelectedSlot(slot)}
                        className={`p-3.5 rounded-2xl border text-left transition-all ${
                          isOccupied
                            ? 'bg-neutral-100 border-neutral-200 text-neutral-400 cursor-not-allowed opacity-60'
                            : isSelected
                            ? 'border-emerald-600 bg-emerald-50/50 ring-1 ring-emerald-500/20 text-[#062D24]'
                            : 'border-neutral-200 bg-white hover:border-neutral-300 text-neutral-800'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="font-bold">{slot.time}</span>
                        </div>
                        <span className={`text-[10px] font-semibold ${isOccupied ? 'text-neutral-400' : 'text-emerald-700'}`}>
                          {slot.status}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
                  <button
                    onClick={() => setStep(2)}
                    className="text-xs font-semibold text-neutral-600 hover:text-neutral-900"
                  >
                    ← Back
                  </button>
                  <button
                    disabled={!selectedSlot}
                    onClick={() => setStep(4)}
                    className="px-6 py-3 rounded-2xl bg-[#062D24] hover:bg-[#0A3D31] text-emerald-300 font-bold text-xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <span>Review Booking</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: Review Booking */}
            {step === 4 && (
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-neutral-200 shadow-sm animate-in fade-in space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-[#062D24] font-display mb-1">
                    4. Review &amp; Guarantee Bay
                  </h2>
                  <p className="text-xs text-neutral-500">
                    Review your reservation parameters before confirmation.
                  </p>
                </div>

                {/* Review specs card */}
                <div className="p-5 rounded-2xl bg-[#F8FAF9] border border-neutral-200 space-y-3 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
                    <span className="text-neutral-500">Charging Station</span>
                    <span className="font-bold text-neutral-900">{station.name}</span>
                  </div>
                  <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
                    <span className="text-neutral-500">Address</span>
                    <span className="font-medium text-neutral-800">{station.address}</span>
                  </div>
                  <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
                    <span className="text-neutral-500">Date &amp; Window</span>
                    <span className="font-bold text-emerald-800">{selectedDate} ({selectedSlot?.time})</span>
                  </div>
                  <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
                    <span className="text-neutral-500">Connector Bay</span>
                    <span className="font-semibold text-neutral-900">{selectedConnector.powerKw} kW {selectedConnector.type}</span>
                  </div>
                  <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
                    <span className="text-neutral-500">Registered Vehicle</span>
                    <span className="font-semibold text-neutral-900">{currentVehicle.brand} {currentVehicle.model} ({currentVehicle.licensePlate})</span>
                  </div>
                  <div className="flex items-center justify-between pt-1 text-sm font-bold">
                    <span className="text-neutral-700">Estimated Cost</span>
                    <span className="text-[#062D24] tabular-nums">${estimatedCost.toFixed(2)} (~{estimatedKwh} kWh)</span>
                  </div>
                </div>

                {/* Target charge slider */}
                <div className="p-4 rounded-2xl bg-white border border-neutral-200 text-xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-neutral-800">Target State of Charge (SoC)</span>
                    <span className="font-bold text-emerald-700 tabular-nums">{batteryTargetPct}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    step="5"
                    value={batteryTargetPct}
                    onChange={(e) => setBatteryTargetPct(Number(e.target.value))}
                    className="w-full accent-emerald-600"
                  />
                  <div className="flex justify-between text-[10px] text-neutral-400 mt-1">
                    <span>50% (Quick top-up)</span>
                    <span>80% (Recommended)</span>
                    <span>100% (Full pack)</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
                  <button
                    onClick={() => setStep(3)}
                    className="text-xs font-semibold text-neutral-600 hover:text-neutral-900"
                  >
                    ← Back
                  </button>
                  <button
                    disabled={isSubmitting}
                    onClick={handleConfirmBooking}
                    className="px-8 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-[#05251D] font-black text-xs tracking-tight transition-all duration-150 shadow-md flex items-center gap-2 hover:scale-[1.01]"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isSubmitting ? 'Confirming...' : 'Confirm Reservation'}</span>
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Right Summary Sticky Card */}
          <div className="lg:col-span-4 sticky top-20">
            <div className="p-6 rounded-3xl bg-[#062D24] text-white border border-emerald-900/60 shadow-xl space-y-4">
              <div>
                <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">
                  Station Itinerary
                </span>
                <h3 className="text-lg font-bold text-white font-display mt-0.5">{station.name}</h3>
                <p className="text-xs text-emerald-200/80 mt-1">{station.address}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#0A382C] border border-emerald-800/40 space-y-2 text-xs">
                <div className="flex items-center justify-between text-emerald-200">
                  <span>Selected Date</span>
                  <span className="text-white font-semibold">{selectedDate}</span>
                </div>
                <div className="flex items-center justify-between text-emerald-200">
                  <span>Window</span>
                  <span className="text-white font-semibold">{selectedSlot?.time || 'Not selected'}</span>
                </div>
                <div className="flex items-center justify-between text-emerald-200">
                  <span>Power Output</span>
                  <span className="text-white font-semibold">{selectedConnector.powerKw} kW</span>
                </div>
              </div>

              <div className="pt-2 border-t border-emerald-800/40 text-xs text-emerald-200/90 leading-relaxed">
                Free cancellation up to 30 minutes before your selected start time.
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
