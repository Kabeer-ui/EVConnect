import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { stationService } from '../services/stationService';
import { Station, Connector } from '../types';
import {
  MapPin,
  Clock,
  Zap,
  Star,
  CheckCircle2,
  Navigation,
  ArrowLeft,
  Coffee,
  Wifi,
  ShieldCheck,
  CalendarPlus,
  Share2,
  Info
} from 'lucide-react';
import { InteractiveMap } from '../components/common/InteractiveMap';

export const StationDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [station, setStation] = useState<Station | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    async function fetchStation() {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const data = await stationService.getStationById(id);
        if (!data) {
          setError('Station not found.');
        } else {
          setStation(data);
        }
      } catch (err) {
        setError('Failed to load station details. Please retry.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchStation();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <span className="text-xs text-neutral-500">Loading station details...</span>
      </div>
    );
  }

  if (error || !station) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <h2 className="text-xl font-bold text-neutral-800 mb-2">Station Not Found</h2>
        <p className="text-xs text-neutral-500 mb-6">
          {error || 'The requested charging station ID does not exist in our catalog.'}
        </p>
        <Link
          to="/explore"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#062D24] text-emerald-300 text-xs font-semibold hover:bg-[#0A3D31] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Explore Stations</span>
        </Link>
      </div>
    );
  }

  const isAvailable = station.availableConnectors > 0;

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleOpenNavigation = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${station.latitude},${station.longitude}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="w-full min-h-screen bg-[#F8FAF9] pb-24">
      {/* Breadcrumb & Navigation Bar */}
      <div className="bg-white border-b border-neutral-200 py-3.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link
            to="/explore"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to stations</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="px-3 py-1.5 rounded-lg border border-neutral-200 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 flex items-center gap-1.5 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copiedLink ? 'Copied Link' : 'Share'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Demo Data Disclaimer */}
        <div className="mb-6 p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/60 text-xs text-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>
              <strong>Demo Station Profile:</strong> Operating hours and bay availability are simulated for evaluation. Production environment will stream live OCPI telemetry.
            </span>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded self-start sm:self-auto">
            Prototype Data
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Info Column */}
          <div className="lg:col-span-8 space-y-6 min-w-0">
            
            {/* Header Block */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-neutral-200/90 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800">
                  <span>{station.operator}</span>
                  <span aria-hidden="true">·</span>
                  <span>~{station.distanceKm} km from SF demo center</span>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-semibold">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isAvailable ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}
                  />
                  <span className={isAvailable ? 'text-emerald-800' : 'text-amber-800'}>
                    {station.availableConnectors} of {station.totalConnectors} bays free (Demo)
                  </span>
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#062D24] font-display mb-3">
                {station.name}
              </h1>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-neutral-600 mb-6">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
                  {station.address}, {station.city}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-emerald-700 shrink-0" />
                  {station.openingHours}
                </span>
                <span className="flex items-center gap-1 font-semibold text-neutral-900">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500 shrink-0" />
                  {station.rating} ({station.reviewCount} reviews)
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-neutral-100">
                <Link
                  to={`/booking/${station.id}`}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-[#05251D] font-bold text-xs tracking-tight transition-all duration-150 shadow-md hover:scale-[1.01]"
                >
                  <CalendarPlus className="w-4 h-4" />
                  <span>Reserve Bay</span>
                </Link>

                <button
                  onClick={handleOpenNavigation}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-semibold text-xs transition-colors"
                >
                  <Navigation className="w-4 h-4 text-neutral-700" />
                  <span>Open External Maps</span>
                </button>
              </div>
            </div>

            {/* Individual Connector Bays List */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-neutral-200/90 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-[#062D24] font-display">
                    Charging Bays &amp; Connectors ({station.connectors.length})
                  </h3>
                  <span className="text-xs text-neutral-400">Simulated individual stall telemetry</span>
                </div>
                <span className="text-xs font-semibold text-emerald-800">
                  ${station.pricePerKwh.toFixed(2)}/kWh
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {station.connectors.map((connector, index) => {
                  const bayAvailable = connector.status === 'available';

                  return (
                    <div
                      key={connector.id}
                      className={`p-4 rounded-2xl border transition-all ${
                        bayAvailable
                          ? 'bg-[#F8FAF9] border-neutral-200 hover:border-emerald-600/40'
                          : 'bg-neutral-50/60 border-neutral-200/60 opacity-80'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="font-bold text-neutral-900">
                          Bay 0{index + 1} · {connector.type}
                        </span>
                        <div className="flex items-center gap-1 font-semibold text-[11px]">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              bayAvailable ? 'bg-emerald-500' : 'bg-neutral-400'
                            }`}
                          />
                          <span className={bayAvailable ? 'text-emerald-800' : 'text-neutral-500'}>
                            {bayAvailable ? 'Available (Demo)' : 'Occupied (Demo)'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-neutral-500">
                        <span className="flex items-center gap-1 font-semibold text-[#062D24]">
                          <Zap className="w-3.5 h-3.5 text-emerald-600" />
                          {connector.powerKw} kW ({connector.currentType})
                        </span>
                        <span className="tabular-nums font-medium">
                          ${connector.pricePerKwh.toFixed(2)}/kWh
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Amenities & Site Facilities */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-neutral-200/90 shadow-sm">
              <h3 className="text-base sm:text-lg font-bold text-[#062D24] font-display mb-4">
                Station Amenities
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {station.amenities.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/70 text-xs text-neutral-700 flex items-center gap-2 font-medium"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Real Interactive Leaflet Location Map */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-neutral-200/90 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-base sm:text-lg font-bold text-[#062D24] font-display">
                  Geographic Location &amp; Access
                </h3>
                <span className="text-[11px] text-neutral-400">OpenStreetMap + Leaflet</span>
              </div>
              <p className="text-xs text-neutral-500 mb-4">
                Located at {station.address}. Interactive map shows local surrounding streets and expressway access points.
              </p>
              <div className="rounded-2xl overflow-hidden border border-neutral-200">
                <InteractiveMap
                  stations={[station]}
                  selectedStationId={station.id}
                  heightClass="h-[320px]"
                  showControls={true}
                  initialCenter={[station.latitude, station.longitude]}
                  initialZoom={15}
                />
              </div>
            </div>

          </div>

          {/* Right Column: Pricing & Booking Summary Card */}
          <div className="lg:col-span-4 sticky top-20 space-y-5 min-w-0">
            <div className="p-6 rounded-3xl bg-[#062D24] text-white border border-emerald-900/60 shadow-xl">
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                Standard Tariff
              </span>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-3xl font-black tabular-nums font-display">${station.pricePerKwh.toFixed(2)}</span>
                <span className="text-xs text-emerald-200/80">/ kWh energy delivered</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#0A382C] border border-emerald-800/40 space-y-2 text-xs mb-6">
                <div className="flex items-center justify-between text-emerald-200">
                  <span>Idle Fee</span>
                  <span className="text-white font-medium">$0.00 (first 15 min)</span>
                </div>
                <div className="flex items-center justify-between text-emerald-200">
                  <span>Hold Guarantee</span>
                  <span className="text-white font-medium">15 min grace window</span>
                </div>
                <div className="flex items-center justify-between text-emerald-200">
                  <span>Session Cap</span>
                  <span className="text-white font-medium">60 minutes</span>
                </div>
              </div>

              <Link
                to={`/booking/${station.id}`}
                className="w-full py-3.5 px-4 rounded-2xl bg-emerald-400 hover:bg-emerald-300 text-[#041F17] font-bold text-xs tracking-tight transition-colors flex items-center justify-center gap-2 shadow-md"
              >
                <CalendarPlus className="w-4 h-4" />
                <span>Reserve Bay</span>
              </Link>
            </div>

            {/* Operator info box */}
            <div className="p-5 rounded-2xl bg-white border border-neutral-200/80 text-xs">
              <span className="text-[11px] text-neutral-400 block mb-1">Network Host</span>
              <p className="font-bold text-neutral-800">{station.operator}</p>
              <p className="text-neutral-500 mt-1 leading-relaxed">
                Interconnected via EVConnect Open Roaming interface. Partner network billing will automatically consolidate to your account.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
