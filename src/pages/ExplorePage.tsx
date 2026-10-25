import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Zap,
  MapPin,
  RotateCcw,
  SlidersHorizontal,
  ChevronRight,
  Info,
  Calendar,
  Clock,
  Car,
  BatteryCharging,
  Gauge,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Station, ConnectorType, Booking, User } from '../types';
import { stationService } from '../services/stationService';
import { bookingService } from '../services/bookingService';
import { authService } from '../services/authService';
import { InteractiveMap } from '../components/common/InteractiveMap';

export const ExplorePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialSearch = searchParams.get('search') || '';
  const initialFilter = searchParams.get('filter') || '';

  const [stations, setStations] = useState<Station[]>([]);

const [userLocation, setUserLocation] = useState<{
  latitude: number;
  longitude: number;
} | null>(null);

const [locationMessage, setLocationMessage] = useState(
  'Getting your location...'
);

useEffect(() => {
  if (!navigator.geolocation) {
    setLocationMessage('Location is not supported by this browser.');
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      setUserLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
      setLocationMessage('Using your current location');
    },
    () => {
      setLocationMessage(
        'Location unavailable. Showing stations across India.'
      );
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000,
    }
  );
}, []);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);

  // User and Booking Context (Demo State)
  const [currentUser, setCurrentUser] = useState<User>(() => authService.getCurrentUser());
  const [upcomingBooking, setUpcomingBooking] = useState<Booking | null>(null);

  // Filters
  const [connectorType, setConnectorType] = useState<ConnectorType | 'all'>('all');
  const [minSpeed, setMinSpeed] = useState<number>(initialFilter === 'fast' ? 150 : 0);
  const [availableOnly, setAvailableOnly] = useState<boolean>(initialFilter === 'available');
  const [selectedOperator, setSelectedOperator] = useState<string>('all');
  const [maxDistance, setMaxDistance] = useState<number>(20);
  const [sortBy, setSortBy] = useState<'distance' | 'speed' | 'price' | 'rating'>('distance');
  const [showFiltersModal, setShowFiltersModal] = useState(false);

  const primaryVehicle = currentUser.vehicles[0];

  useEffect(() => {
    window.scrollTo(0, 0);
    async function loadItinerary() {
      try {
        const upcoming = await bookingService.getUpcomingBooking();
        setUpcomingBooking(upcoming);
      } catch (err) {
        console.error('Failed to load upcoming reservation', err);
      }
    }
    loadItinerary();
  }, []);

  // Fetch stations with filters
  useEffect(() => {
    let isCancelled = false;

    async function fetchStations() {
      setLoading(true);
      setError(null);
      try {
        const data = await stationService.getStations({
          searchQuery,
          connectorType: connectorType !== 'all' ? connectorType : undefined,
          minSpeedKw: minSpeed > 0 ? minSpeed : undefined,
          availableOnly: availableOnly || undefined,
          operator: selectedOperator !== 'all' ? selectedOperator : undefined,
          maxDistanceKm: maxDistance
        });

        if (!isCancelled) {
          // Client-side sorting
          const sorted = [...data].sort((a, b) => {
            if (sortBy === 'distance') return a.distanceKm - b.distanceKm;
            if (sortBy === 'speed') {
              const maxA = Math.max(...a.connectors.map((c) => c.powerKw));
              const maxB = Math.max(...b.connectors.map((c) => c.powerKw));
              return maxB - maxA;
            }
            if (sortBy === 'price') return a.pricePerKwh - b.pricePerKwh;
            if (sortBy === 'rating') return b.rating - a.rating;
            return 0;
          });

          setStations(sorted);

          // Preserve selection or default to first
          if (sorted.length > 0) {
            setSelectedStation((prev) => {
              const stillExists = sorted.find((s) => s.id === prev?.id);
              return stillExists || sorted[0];
            });
          } else {
            setSelectedStation(null);
          }
        }
      } catch (err) {
        if (!isCancelled) {
          setError('Failed to query station directory. Please retry.');
          console.error(err);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    }

    fetchStations();

    return () => {
      isCancelled = true;
    };
  }, [searchQuery, connectorType, minSpeed, availableOnly, selectedOperator, maxDistance, sortBy]);

  const operators = ['Electrify America', 'EVgo Network', 'ChargePoint', 'BP Pulse', 'Volta Network'];
  const connectors: ConnectorType[] = ['CCS2', 'Type 2', 'CHAdeMO'];

  const resetFilters = () => {
    setSearchQuery('');
    setConnectorType('all');
    setMinSpeed(0);
    setAvailableOnly(false);
    setSelectedOperator('all');
    setMaxDistance(20);
    setSortBy('distance');
    setSearchParams({});
  };

  const handleSelectStation = (station: Station) => {
    setSelectedStation(station);
    // Smooth scroll card into view on small screens or list
    const elem = document.getElementById(`station-compact-${station.id}`);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  const activeFiltersCount = [
    searchQuery.trim() !== '',
    connectorType !== 'all',
    minSpeed > 0,
    availableOnly,
    selectedOperator !== 'all',
    maxDistance < 20
  ].filter(Boolean).length;

  // Calculate estimated charging time based on primary vehicle (77.4 kWh battery at 42% SoC aiming for 80%)
  const calculateTimeToTarget = (stationSpeedKw: number) => {
    const kwhNeeded = (primaryVehicle?.batteryCapacityKwh || 77.4) * (0.8 - 0.42); // ~29.4 kWh
    const effectiveKw = Math.min(stationSpeedKw, 240); // vehicle acceptance curve peak
    const hours = kwhNeeded / effectiveKw;
    return Math.max(12, Math.round(hours * 60));
  };

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] bg-[#051711] text-neutral-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-black">
      {/* 1. Cockpit Header Command Strip */}
      <div className="bg-[#08221A]/95 border-b border-emerald-900/40 backdrop-blur-xl px-4 sm:px-6 lg:px-8 py-3.5 sticky top-16 z-30 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Left: Title & Cluster Indicator */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 text-[#041D16] flex items-center justify-center font-black shadow-md shadow-emerald-500/10 shrink-0">
              <Zap className="w-5 h-5 fill-current stroke-none" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-black text-white font-display tracking-tight truncate">
                  Explore Charging Stations
                </h1>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-950/80 text-emerald-300 border border-emerald-700/40">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Demo Cluster</span>
                </span>
              </div>
              <p className="text-[11px] text-emerald-200/70 truncate">
                SF Bay Area Prototype Cluster · Real-time Leaflet GIS preview
              </p>
            </div>
          </div>

          {/* Right: Telemetry pill & Filter reset */}
          <div className="flex items-center gap-2 self-stretch md:self-auto shrink-0 justify-between md:justify-end">
            <div className="hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-xl bg-[#0B2A20] border border-emerald-800/40 text-xs">
              <div className="flex items-center gap-1.5 text-neutral-300">
                <Car className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-semibold text-white">{primaryVehicle.model.split(' ')[0]}</span>
                <span className="text-emerald-500/80">·</span>
                <span className="text-emerald-300 font-bold">42% SoC</span>
              </div>
              <span className="text-emerald-700">|</span>
              <div className="text-[11px] text-neutral-400">
                <span className="text-emerald-300 font-bold">{stations.length}</span> hubs match
              </div>
            </div>

            <button
              onClick={() => setShowFiltersModal(!showFiltersModal)}
              className="lg:hidden px-3 py-2 rounded-xl bg-[#0E3529] hover:bg-[#144738] text-emerald-200 text-xs font-semibold flex items-center gap-1.5 border border-emerald-700/40 transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters {activeFiltersCount > 0 ? `(${activeFiltersCount})` : ''}</span>
            </button>

            {activeFiltersCount > 0 && (
              <button
                onClick={resetFilters}
                className="px-2.5 py-1.5 rounded-xl bg-neutral-900/60 hover:bg-neutral-800 text-neutral-300 text-xs font-semibold flex items-center gap-1 border border-neutral-700/40 transition-colors"
                title="Reset all filters"
              >
                <RotateCcw className="w-3 h-3" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            )}
          </div>

        </div>
      </div>

      {/* 2. Cockpit Filter Controls Ribbon (Immediately above the Map) */}
      <div className="bg-[#071C15]/90 border-b border-emerald-950/60 px-4 sm:px-6 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          
          {/* Search Field */}
          <div className="relative flex-1 max-w-md min-w-0">
            <Search className="w-4 h-4 text-emerald-400/70 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search station, street, or operator (e.g. Presidio, SOMA)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-8 py-2 rounded-xl bg-[#0A261E] border border-emerald-800/40 text-xs text-white placeholder-emerald-400/50 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/30 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white text-xs p-1"
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          {/* Speed & Connector Quick Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 text-xs no-scrollbar max-w-full shrink-0">
            {/* Speed Pills */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-[#09221B] border border-emerald-900/40">
              <button
                onClick={() => setMinSpeed(0)}
                className={`px-2.5 py-1 rounded-lg font-semibold text-[11px] whitespace-nowrap transition-colors ${
                  minSpeed === 0
                    ? 'bg-emerald-500 text-[#041E17] font-bold shadow-xs'
                    : 'text-neutral-300 hover:text-white'
                }`}
              >
                All Speeds
              </button>
              <button
                onClick={() => setMinSpeed(150)}
                className={`px-2.5 py-1 rounded-lg font-semibold text-[11px] whitespace-nowrap transition-colors flex items-center gap-1 ${
                  minSpeed === 150
                    ? 'bg-emerald-500 text-[#041E17] font-bold shadow-xs'
                    : 'text-neutral-300 hover:text-white'
                }`}
              >
                <Zap className="w-3 h-3" />
                <span>&ge; 150 kW</span>
              </button>
              <button
                onClick={() => setMinSpeed(300)}
                className={`px-2.5 py-1 rounded-lg font-semibold text-[11px] whitespace-nowrap transition-colors flex items-center gap-1 ${
                  minSpeed === 300
                    ? 'bg-emerald-500 text-[#041E17] font-bold shadow-xs'
                    : 'text-neutral-300 hover:text-white'
                }`}
              >
                <Zap className="w-3 h-3" />
                <span>&ge; 300 kW Ultra</span>
              </button>
            </div>

            {/* Connector Dropdown / Quick Filter */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-[#09221B] border border-emerald-900/40">
              <button
                onClick={() => setConnectorType('all')}
                className={`px-2.5 py-1 rounded-lg font-semibold text-[11px] whitespace-nowrap transition-colors ${
                  connectorType === 'all'
                    ? 'bg-emerald-900 text-emerald-200 border border-emerald-600/50'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                All Ports
              </button>
              {connectors.map((c) => (
                <button
                  key={c}
                  onClick={() => setConnectorType(c)}
                  className={`px-2.5 py-1 rounded-lg font-semibold text-[11px] whitespace-nowrap transition-colors ${
                    connectorType === c
                      ? 'bg-emerald-900 text-emerald-200 border border-emerald-600/50'
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            {/* Availability Checkbox Button */}
            <button
              onClick={() => setAvailableOnly(!availableOnly)}
              className={`px-3 py-1.5 rounded-xl border font-semibold text-[11px] flex items-center gap-1.5 whitespace-nowrap transition-all ${
                availableOnly
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-500'
                  : 'bg-[#09221B] text-neutral-400 border-emerald-900/40 hover:text-white'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  availableOnly ? 'bg-emerald-400 animate-pulse' : 'bg-neutral-600'
                }`}
              />
              <span>Available Bays Only</span>
            </button>
          </div>

        </div>
      </div>

      {/* 3. Main Dashboard Workspace Layout */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-5 flex-1 min-w-0">
        
        {/* Transparent Demo Cluster Disclaimer */}
        <div className="mb-4 px-3.5 py-2 rounded-xl bg-[#0B2820]/90 border border-emerald-800/30 text-[11px] text-emerald-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-1 shadow-sm">
          <div className="flex items-center gap-2">
            <Info className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>
              <strong>Simulation mode active:</strong> Demonstrating synchronized geographic GIS discovery. All station bays and vehicle telemetry represent simulated prototype records.
            </span>
          </div>
          <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/40 whitespace-nowrap self-start sm:self-auto">
            OCPI Mock Interface
          </span>
        </div>

        {/* Desktop Grid Layout: Main Map Area (8 cols) + Secondary Panel (4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          
          {/* Main Stage: Focused Leaflet Geographic Map & Cards Beneath */}
          <div className="lg:col-span-8 flex flex-col gap-4 min-w-0">
            
            {/* The Geographic Leaflet Map */}
            <div className="rounded-2xl overflow-hidden border border-emerald-800/40 shadow-2xl relative bg-[#061A14]">
              <InteractiveMap
                stations={stations}
                selectedStationId={selectedStation?.id}
                onSelectStation={handleSelectStation}
                heightClass="h-[420px] sm:h-[500px] lg:h-[540px]"
                showControls={true}
              >
                {/* Embedded Floating Map Header Strip */}
                <div className="absolute top-3 left-3 z-[400] max-w-[calc(100%-4rem)] pointer-events-auto">
                  {selectedStation ? (
                    <div className="px-3.5 py-2 rounded-xl bg-[#061E17]/95 border border-emerald-700/50 shadow-xl backdrop-blur-md flex items-center gap-3 text-xs text-white animate-in fade-in">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                      <div className="min-w-0">
                        <span className="font-extrabold text-white block truncate">
                          {selectedStation.name}
                        </span>
                        <span className="text-[10px] text-emerald-300 block truncate">
                          {selectedStation.chargingSpeed} · {selectedStation.availableConnectors}/{selectedStation.totalConnectors} bays free
                        </span>
                      </div>
                      <Link
                        to={`/booking/${selectedStation.id}`}
                        className="px-2.5 py-1 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-[#041D16] font-bold text-[11px] shrink-0 transition-colors"
                      >
                        Book Bay
                      </Link>
                    </div>
                  ) : (
                    <div className="px-3 py-1.5 rounded-xl bg-[#061E17]/90 border border-emerald-800/40 text-[11px] text-emerald-300 backdrop-blur-md flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Select any station marker to preview</span>
                    </div>
                  )}
                </div>
              </InteractiveMap>
            </div>

            {/* Station Cards Grid / Carousel Beneath the Map */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider font-display">
                    Station Directory ({stations.length})
                  </h3>
                  <span className="text-[11px] text-emerald-400/80 font-medium">
                    Sorted by {sortBy}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="py-1 px-2.5 rounded-lg bg-[#0A261E] border border-emerald-800/40 text-[11px] text-emerald-200 focus:outline-none focus:border-emerald-400"
                  >
                    <option value="distance">Nearest Distance</option>
                    <option value="speed">Max Power (kW)</option>
                    <option value="price">Lowest Price ($/kWh)</option>
                    <option value="rating">Top Rated</option>
                  </select>
                </div>
              </div>

              {/* Station Card List */}
              {loading ? (
                <div className="p-12 text-center text-xs text-neutral-400 bg-[#0A261E]/60 rounded-2xl border border-emerald-900/30">
                  <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  <span>Loading network hubs...</span>
                </div>
              ) : error ? (
                <div className="p-8 rounded-2xl bg-[#0E2A20] border border-rose-500/30 text-center text-xs text-rose-300">
                  <p className="font-bold mb-2">{error}</p>
                  <button
                    onClick={resetFilters}
                    className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-semibold"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : stations.length === 0 ? (
                <div className="p-10 rounded-2xl bg-[#09221B] border border-emerald-900/30 text-center">
                  <p className="text-sm font-bold text-white mb-1">No charging hubs match your filters</p>
                  <p className="text-xs text-emerald-300/70 mb-4">Try clearing speed, distance or operator filters.</p>
                  <button
                    onClick={resetFilters}
                    className="px-4 py-2 rounded-xl bg-emerald-500 text-[#041F17] font-bold text-xs hover:bg-emerald-400 transition-colors"
                  >
                    Reset all filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {stations.map((st) => {
                    const isSelected = selectedStation?.id === st.id;
                    const isAvailable = st.availableConnectors > 0;
                    const maxPowerKw = Math.max(...st.connectors.map((c) => c.powerKw));
                    const uniqueConnectors = Array.from(new Set(st.connectors.map((c) => c.type))).join(' · ');

                    return (
                      <div
                        key={st.id}
                        id={`station-compact-${st.id}`}
                        onClick={() => handleSelectStation(st)}
                        className={`p-4 rounded-2xl cursor-pointer transition-all duration-200 border flex flex-col justify-between group ${
                          isSelected
                            ? 'bg-[#0E3529] border-emerald-500 shadow-xl ring-1 ring-emerald-400/40'
                            : 'bg-[#0A261E]/90 border-emerald-900/40 hover:border-emerald-600/50 hover:bg-[#0C2D24]'
                        }`}
                      >
                        <div>
                          {/* Card Top: Operator & Distance */}
                          <div className="flex items-center justify-between text-xs text-emerald-300/80 mb-1.5 gap-2">
                            <div className="flex items-center gap-1.5 truncate">
                              <span className="font-bold text-emerald-400 uppercase tracking-wider text-[10px]">
                                {st.operator}
                              </span>
                              <span aria-hidden="true" className="text-emerald-800">·</span>
                              <span className="truncate text-neutral-300 text-[11px]">
                                ~{st.distanceKm} km (Demo)
                              </span>
                            </div>

                            {/* Simulated Availability Badge */}
                            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#041812] border border-emerald-800/40 shrink-0">
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  isAvailable ? 'bg-emerald-400' : 'bg-amber-400'
                                }`}
                              />
                              <span className={isAvailable ? 'text-emerald-300' : 'text-amber-300'}>
                                {st.availableConnectors}/{st.totalConnectors} Open
                              </span>
                            </div>
                          </div>

                          {/* Station Name */}
                          <h4 className="text-sm font-extrabold text-white group-hover:text-emerald-300 transition-colors mb-1 truncate">
                            {st.name}
                          </h4>

                          <p className="text-[11px] text-neutral-400 truncate mb-3 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-emerald-500 shrink-0" />
                            <span>{st.address}</span>
                          </p>

                          {/* Tech Specs Micro-Grid */}
                          <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-[#061C16] border border-emerald-900/30 mb-3 text-[11px]">
                            <div>
                              <span className="text-neutral-400 block text-[10px]">Max Speed</span>
                              <span className="font-bold text-white flex items-center gap-1">
                                <Zap className="w-3 h-3 text-emerald-400" />
                                {st.chargingSpeed}
                              </span>
                            </div>
                            <div>
                              <span className="text-neutral-400 block text-[10px]">Price Rate</span>
                              <span className="font-bold text-white tabular-nums">
                                ${st.pricePerKwh.toFixed(2)}/kWh
                              </span>
                            </div>
                            <div className="col-span-2 pt-1 border-t border-emerald-950/60">
                              <span className="text-neutral-400 block text-[10px]">Connectors</span>
                              <span className="text-emerald-200 font-medium truncate block">
                                {uniqueConnectors}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 pt-1">
                          <Link
                            to={`/stations/${st.id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="flex-1 py-2 text-center text-xs font-semibold rounded-xl bg-[#09221B] hover:bg-[#0E3529] text-emerald-200 border border-emerald-800/40 transition-colors"
                          >
                            Details
                          </Link>
                          <Link
                            to={`/booking/${st.id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="flex-1 py-2 text-center text-xs font-bold rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#041D16] transition-colors shadow-sm"
                          >
                            Reserve Bay
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>

          {/* Secondary Panel: Vehicle Telemetry & Reservation Itinerary (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-4 min-w-0">
            
            {/* 1. Connected Vehicle Telemetry Card (Inspired by Dashboard Reference) */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-[#0A2820] to-[#061E17] border border-emerald-800/40 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between pb-3 border-b border-emerald-900/40 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-950 text-emerald-400 flex items-center justify-center border border-emerald-700/40">
                    <Car className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider font-display">
                      Vehicle Status
                    </h3>
                    <span className="text-[10px] text-emerald-400/80">Simulated Telemetry (Demo)</span>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#041611] text-emerald-300 border border-emerald-800/40 font-bold">
                  {primaryVehicle.licensePlate}
                </span>
              </div>

              {/* Vehicle Title */}
              <div className="mb-4">
                <h4 className="text-base font-extrabold text-white">
                  {primaryVehicle.brand} {primaryVehicle.model}
                </h4>
                <p className="text-xs text-neutral-400">
                  {primaryVehicle.batteryCapacityKwh} kWh Li-ion Battery · {primaryVehicle.preferredConnector} Standard
                </p>
              </div>

              {/* Battery Circular / Progress Gauge */}
              <div className="p-4 rounded-xl bg-[#041A14] border border-emerald-900/40 mb-4">
                <div className="flex items-end justify-between mb-2">
                  <div className="flex items-center gap-1.5 text-xs text-emerald-300 font-semibold">
                    <BatteryCharging className="w-4 h-4 text-emerald-400" />
                    <span>State of Charge (SoC)</span>
                  </div>
                  <span className="text-2xl font-black text-white tabular-nums font-display">
                    42%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-3 rounded-full bg-neutral-900/80 overflow-hidden p-0.5 border border-emerald-900/40 mb-2">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-teal-400 to-emerald-400 shadow-sm"
                    style={{ width: '42%' }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-neutral-400">
                  <span>32.5 kWh stored</span>
                  <span className="text-emerald-300 font-bold">~202 km remaining</span>
                </div>
              </div>

              {/* Dynamic Charging Recommendation */}
              {selectedStation && (
                <div className="p-3 rounded-xl bg-[#0E3529]/60 border border-emerald-700/40 text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-300 font-bold mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Selected: {selectedStation.name}</span>
                  </div>
                  <p className="text-[11px] text-neutral-300 leading-relaxed">
                    At {selectedStation.chargingSpeed}, top-up to 80% takes approx{' '}
                    <strong className="text-white">
                      ~{calculateTimeToTarget(Math.max(...selectedStation.connectors.map((c) => c.powerKw)))} minutes
                    </strong>.
                  </p>
                </div>
              )}
            </div>

            {/* 2. Upcoming Reservation Widget */}
            <div className="p-5 rounded-2xl bg-[#0A261E] border border-emerald-800/40 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-emerald-900/40 mb-3">
                <span className="text-xs font-bold text-white uppercase tracking-wider font-display flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Next Reservation</span>
                </span>
                <span className="text-[10px] text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded font-bold">
                  Demo
                </span>
              </div>

              {upcomingBooking ? (
                <div className="space-y-2.5">
                  <div>
                    <h4 className="text-sm font-bold text-white line-clamp-1">
                      {upcomingBooking.stationName}
                    </h4>
                    <p className="text-[11px] text-neutral-400 line-clamp-1">
                      {upcomingBooking.stationAddress}
                    </p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#061A14] border border-emerald-900/30 text-[11px] text-neutral-300 space-y-1">
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Scheduled:</span>
                      <span className="font-semibold text-white">
                        {upcomingBooking.date} · {upcomingBooking.timeSlot}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Connector:</span>
                      <span className="font-semibold text-emerald-300">
                        {upcomingBooking.connectorPowerKw} kW {upcomingBooking.connectorType}
                      </span>
                    </div>
                  </div>

                  <Link
                    to="/bookings"
                    className="block w-full py-2 px-3 text-center rounded-xl bg-[#0E3529] hover:bg-[#144738] text-emerald-200 font-bold text-xs border border-emerald-700/40 transition-colors"
                  >
                    View All Reservations →
                  </Link>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-xs text-neutral-400 mb-3">No upcoming charging slots booked.</p>
                  {selectedStation && (
                    <Link
                      to={`/booking/${selectedStation.id}`}
                      className="inline-block py-2 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#041D16] font-bold text-xs transition-colors"
                    >
                      Book at {selectedStation.name.split(' ')[0]}
                    </Link>
                  )}
                </div>
              )}
            </div>

            {/* 3. GIS Map Legend & Data Source Card */}
            <div className="p-5 rounded-2xl bg-[#0A261E] border border-emerald-800/40 text-xs shadow-xl space-y-3">
              <span className="font-bold text-white uppercase tracking-wider text-[11px] block">
                Map Symbology
              </span>

              <div className="space-y-2 text-[11px] text-neutral-300">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-md bg-emerald-500 shrink-0" />
                  <span>Available Bays (≥1 open stall)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-md bg-amber-500 shrink-0" />
                  <span>High Demand / Fully Occupied</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-blue-500 border border-white shrink-0" />
                  <span>Your GPS Location (Browser Geolocation)</span>
                </div>
              </div>

              <div className="pt-2 border-t border-emerald-950 text-[10px] text-emerald-300/60 leading-relaxed">
                Cartographic tiles provided by OpenStreetMap contributors &amp; CARTO. Station information formatted to OCPI 2.2 schemas.
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
