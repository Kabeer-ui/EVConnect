import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Station } from '../../types';
import { Plus, Minus, Navigation, MapPin, Zap, Maximize2, RotateCcw, AlertCircle, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface InteractiveMapProps {
  stations: Station[];
  selectedStationId?: string | null;
  onSelectStation?: (station: Station) => void;
  className?: string;
  heightClass?: string;
  showControls?: boolean;
  initialCenter?: [number, number];
  initialZoom?: number;
  children?: React.ReactNode;
}

// Default center: San Francisco Bay Area Demo Cluster
const DEFAULT_CENTER: [number, number] = [37.7785, -122.4280];
const DEFAULT_ZOOM = 13;

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  stations,
  selectedStationId,
  onSelectStation,
  className = '',
  heightClass = 'h-[500px]',
  showControls = true,
  initialCenter = DEFAULT_CENTER,
  initialZoom = DEFAULT_ZOOM,
  children
}) => {
  const navigate = useNavigate();
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);

  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationNotice, setLocationNotice] = useState<string | null>(null);
  const [activeStation, setActiveStation] = useState<Station | null>(null);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return; // Prevent re-initialization

    // Create map instance
    const map = L.map(mapContainerRef.current, {
      center: initialCenter,
      zoom: initialZoom,
      zoomControl: false,
      attributionControl: true,
      maxZoom: 18,
      minZoom: 3
    });

    // Dark-themed tile layer using CartoDB Dark Matter with OSM attribution
    const tileLayer = L.tileLayer(
      
        'https://tile.openstreetmap.org/{z}/{x}/{y}.png',

      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions" target="_blank" rel="noopener noreferrer">CARTO</a>',
        
        maxZoom: 19, className: 'evconnect-map-tiles'
      }
    );

    tileLayer.addTo(map);

    // Layer group for station markers
    const markersLayer = L.layerGroup().addTo(map);
    markersLayerRef.current = markersLayer;
    mapInstanceRef.current = map;

    // Invalidate size once rendered into container
    setTimeout(() => {
      map.invalidateSize();
    }, 150);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Markers whenever stations or selectedStationId change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    if (!map || !markersLayer) return;

    markersLayer.clearLayers();

    stations.forEach((station) => {
      const isSelected = selectedStationId === station.id;
      const isAvailable = station.availableConnectors > 0;
      const statusColor = isAvailable ? '#10B981' : '#F59E0B';
      const statusBg = isAvailable ? '#062D24' : '#2A1F06';

      // Custom high-contrast vector marker icon
      const customIcon = L.divIcon({
        className: 'evconnect-marker',
        html: `
          <div style="position: relative; width: 40px; height: 48px; cursor: pointer; display: flex; flex-direction: column; align-items: center; justify-content: flex-start;">
            ${isSelected ? `
              <div style="position: absolute; top: -6px; left: -6px; width: 52px; height: 52px; border-radius: 9999px; background: rgba(52, 211, 153, 0.25); border: 2px dashed #34D399; animation: spin 8s linear infinite;"></div>
            ` : ''}
            <div style="
              width: 36px;
              height: 36px;
              border-radius: 12px;
              background: ${statusBg};
              border: 2px solid ${statusColor};
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 4px 14px rgba(0,0,0,0.4);
              transform: ${isSelected ? 'scale(1.15)' : 'scale(1)'};
              transition: transform 0.2s;
            ">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="${statusColor}" stroke="none">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
              </svg>
            </div>
            <!-- Indicator tip & badge -->
            <div style="
              width: 0;
              height: 0;
              border-left: 5px solid transparent;
              border-right: 5px solid transparent;
              border-top: 6px solid ${statusColor};
              margin-top: -1px;
            "></div>
            <!-- Bays count pill -->
            <div style="
              position: absolute;
              bottom: 0px;
              background: #031510;
              border: 1px solid ${statusColor};
              color: #ECFDF5;
              font-size: 9px;
              font-weight: 700;
              padding: 0 4px;
              border-radius: 6px;
              white-space: nowrap;
              letter-spacing: -0.02em;
            ">
              ${station.availableConnectors}/${station.totalConnectors}
            </div>
          </div>
        `,
        iconSize: [40, 48],
        iconAnchor: [20, 44],
        popupAnchor: [0, -42]
      });

      const marker = L.marker([station.latitude, station.longitude], {
        icon: customIcon,
        title: station.name
      });

      // Build Rich HTML Popup
      const popupHtml = `
        <div style="padding: 14px; min-width: 240px; max-width: 280px; font-family: inherit;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
            <span style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #34D399;">
              ${station.operator}
            </span>
            <span style="font-size: 10px; font-weight: 600; color: #9CA3AF; background: #0E3327; padding: 2px 6px; border-radius: 6px;">
              Demo Hub
            </span>
          </div>

          <h4 style="font-size: 14px; font-weight: 800; color: #FFFFFF; margin: 0 0 4px 0; line-height: 1.2;">
            ${station.name}
          </h4>

          <p style="font-size: 11px; color: #A7F3D0; margin: 0 0 10px 0; display: flex; align-items: center; gap: 4px;">
            📍 ${station.address}
          </p>

          <div style="background: #041712; border: 1px solid rgba(16,185,129,0.2); border-radius: 10px; padding: 8px; margin-bottom: 10px; font-size: 11px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
              <span style="color: #9CA3AF;">Power Output:</span>
              <span style="font-weight: 700; color: #F3F4F6;">⚡ ${station.chargingSpeed}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
              <span style="color: #9CA3AF;">Rate:</span>
              <span style="font-weight: 700; color: #F3F4F6;">$${station.pricePerKwh.toFixed(2)}/kWh</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #9CA3AF;">Simulated Bays:</span>
              <span style="font-weight: 700; color: ${isAvailable ? '#34D399' : '#F59E0B'};">
                ${station.availableConnectors} of ${station.totalConnectors} open
              </span>
            </div>
          </div>

          <div style="font-size: 9.5px; color: #6EE7B7; opacity: 0.8; margin-bottom: 10px;">
            * Demo data: availability simulated for preview.
          </div>

          <div style="display: flex; gap: 6px;">
            <a href="/stations/${station.id}" style="
              flex: 1;
              text-align: center;
              padding: 6px 8px;
              background: #0E362A;
              color: #A7F3D0;
              border: 1px solid rgba(16,185,129,0.3);
              border-radius: 8px;
              font-size: 11px;
              font-weight: 600;
              text-decoration: none;
            ">Details</a>
            <a href="/booking/${station.id}" style="
              flex: 1;
              text-align: center;
              padding: 6px 8px;
              background: #10B981;
              color: #04241B;
              border-radius: 8px;
              font-size: 11px;
              font-weight: 700;
              text-decoration: none;
            ">Book Bay</a>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, {
        closeButton: true,
        className: 'evconnect-popup'
      });

      marker.on('click', () => {
        setActiveStation(station);
        if (onSelectStation) {
          onSelectStation(station);
        }
      });

      marker.addTo(markersLayer);

      // Auto-open popup if explicitly selected
      if (isSelected) {
        marker.openPopup();
      }
    });

    // If selectedStationId changed, center smoothly
    if (selectedStationId) {
      const target = stations.find((s) => s.id === selectedStationId);
      if (target) {
        map.panTo([target.latitude, target.longitude], { animate: true, duration: 0.6 });
      }
    }
  }, [stations, selectedStationId, onSelectStation]);

  // Zoom and Pan Controls
  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };

  const handleFitBounds = () => {
    const map = mapInstanceRef.current;
    if (!map || stations.length === 0) return;
    const bounds = L.latLngBounds(stations.map((s) => [s.latitude, s.longitude]));
    map.fitBounds(bounds, { padding: [50, 50], animate: true });
  };

  const handleCenterDemoCluster = () => {
    mapInstanceRef.current?.flyTo(DEFAULT_CENTER, DEFAULT_ZOOM, { duration: 0.8 });
  };

  // Browser Geolocation Permission & Location Finder
  const handleRequestUserLocation = () => {
    if (!navigator.geolocation) {
      setLocationNotice('Geolocation is not supported by your browser.');
      setTimeout(() => setLocationNotice(null), 4000);
      return;
    }

    setIsLocating(true);
    setLocationNotice(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const coords: [number, number] = [latitude, longitude];
        setUserLocation(coords);
        setIsLocating(false);

        const map = mapInstanceRef.current;
        if (!map) return;

        // Add or move user marker
        if (userMarkerRef.current) {
          userMarkerRef.current.setLatLng(coords);
        } else {
          const userIcon = L.divIcon({
            className: 'user-location-marker',
            html: `
              <div style="position: relative; width: 24px; height: 24px;">
                <div style="position: absolute; inset: -8px; background: rgba(59, 130, 246, 0.25); border-radius: 9999px; animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
                <div style="width: 24px; height: 24px; border-radius: 9999px; background: #3B82F6; border: 3px solid #FFFFFF; box-shadow: 0 0 10px rgba(59, 130, 246, 0.8);"></div>
              </div>
            `,
            iconSize: [24, 24],
            iconAnchor: [12, 12]
          });

          const userMarker = L.marker(coords, { icon: userIcon, title: 'Your Current Location' })
            .bindPopup(
              `<div style="padding: 10px; font-size: 12px; color: #fff;"><strong>Your Location</strong><br/><span style="color: #9ca3af; font-size: 10px;">Browser GPS position</span></div>`
            )
            .addTo(map);

          userMarkerRef.current = userMarker;
        }

        // Fly to user
        map.flyTo(coords, 14, { duration: 1 });

        // Calculate distance to demo cluster
        const clusterLat = DEFAULT_CENTER[0];
        const clusterLng = DEFAULT_CENTER[1];
        const distKm = Math.round(
          Math.sqrt(Math.pow(latitude - clusterLat, 2) + Math.pow(longitude - clusterLng, 2)) * 111
        );

        if (distKm > 80) {
          setLocationNotice(
            `Located ${distKm} km from the San Francisco sample cluster. Showing your GPS position.`
          );
        } else {
          setLocationNotice('Centered on your detected location near the demo stations.');
        }
      },
      (err) => {
        setIsLocating(false);
        let msg = 'Unable to access your location.';
        if (err.code === err.PERMISSION_DENIED) {
          msg = 'Location permission was denied. You can explore the demo map manually.';
        } else if (err.code === err.TIMEOUT) {
          msg = 'Location request timed out.';
        }
        setLocationNotice(msg);
        setTimeout(() => setLocationNotice(null), 5000);
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-[#061A14] select-none border border-emerald-950/40 shadow-inner ${heightClass} ${className}`}>
      {/* Real Geographic Map DOM Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" tabIndex={0} />

      {/* Optional custom children overlay */}
      {children}

      {/* Floating Control Buttons */}
      {showControls && (
        <div className="absolute top-4 right-4 flex flex-col gap-2 z-[400]">
          <button
            onClick={handleZoomIn}
            className="w-9 h-9 rounded-xl bg-[#08241C]/90 hover:bg-[#0E3A2E] text-emerald-300 border border-emerald-700/40 flex items-center justify-center shadow-lg transition-colors backdrop-blur-sm"
            title="Zoom in"
            aria-label="Zoom in"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="w-9 h-9 rounded-xl bg-[#08241C]/90 hover:bg-[#0E3A2E] text-emerald-300 border border-emerald-700/40 flex items-center justify-center shadow-lg transition-colors backdrop-blur-sm"
            title="Zoom out"
            aria-label="Zoom out"
          >
            <Minus className="w-4 h-4" />
          </button>
          <button
            onClick={handleRequestUserLocation}
            disabled={isLocating}
            className={`w-9 h-9 rounded-xl border flex items-center justify-center shadow-lg transition-colors backdrop-blur-sm ${
              userLocation
                ? 'bg-blue-900/90 text-blue-300 border-blue-500/50'
                : 'bg-[#08241C]/90 hover:bg-[#0E3A2E] text-emerald-300 border-emerald-700/40'
            }`}
            title="Locate me (requests browser permission)"
            aria-label="Locate me"
          >
            <Navigation className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={handleCenterDemoCluster}
            className="w-9 h-9 rounded-xl bg-[#08241C]/90 hover:bg-[#0E3A2E] text-emerald-300 border border-emerald-700/40 flex items-center justify-center shadow-lg transition-colors backdrop-blur-sm"
            title="Center on Demo Cluster"
            aria-label="Center on Demo Cluster"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={handleFitBounds}
            className="w-9 h-9 rounded-xl bg-[#08241C]/90 hover:bg-[#0E3A2E] text-emerald-300 border border-emerald-700/40 flex items-center justify-center shadow-lg transition-colors backdrop-blur-sm"
            title="Fit all stations"
            aria-label="Fit all stations"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Geolocation Notice Toast */}
      {locationNotice && (
        <div className="absolute top-4 left-4 right-16 sm:right-auto sm:max-w-md z-[400] p-3 rounded-xl bg-[#08241C]/95 border border-emerald-600/40 shadow-xl backdrop-blur-md text-xs text-emerald-200 flex items-start gap-2 animate-in fade-in slide-in-from-top-2">
          <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span>{locationNotice}</span>
            {userLocation && (
              <button
                onClick={handleCenterDemoCluster}
                className="block mt-1 font-bold text-emerald-300 hover:underline"
              >
                Jump to San Francisco Demo Hubs →
              </button>
            )}
          </div>
          <button
            onClick={() => setLocationNotice(null)}
            className="text-neutral-400 hover:text-white text-xs ml-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* Map Legend & Demo Dataset Badge */}
      <div className="absolute bottom-4 left-4 z-[400] hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-xl bg-[#08241C]/90 backdrop-blur-md border border-emerald-800/50 text-[11px] text-emerald-200">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          <span>Available Bays</span>
        </div>
        <span className="text-emerald-800">|</span>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          <span>High Demand</span>
        </div>
        <span className="text-emerald-800">|</span>
        <span className="text-[10px] text-emerald-400/80 font-medium">
          SF Bay Demo Dataset (Leaflet + OpenStreetMap)
        </span>
      </div>
    </div>
  );
};
