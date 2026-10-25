
import { Station, ConnectorType } from '../types';

const API_URL = 'http://127.0.0.1:5000/api/stations';

export interface StationFilter {
  searchQuery?: string;
  connectorType?: ConnectorType | 'all';
  minSpeedKw?: number;
  maxPrice?: number;
  availableOnly?: boolean;
  operator?: string | 'all';
  maxDistanceKm?: number;
}


interface ApiConnector {
  type: string;
  powerKW: number | null;
}

interface ApiStation {
  id: number;
  ocmId: number;
  name: string;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  connectors: ApiConnector[];

  sourceStationId?: string | null;
  operatorName?: string | null;
  state?: string | null;
  city?: string | null;
  accessType?: string | null;
  operatingHours?: string | null;
  operationalStatus?: string | null;
  evChargingPrice?: number | string | null;
  evChargingPriceUnit?: string | null;
  parkingFee?: number | string | null;
  parkingFeeUnit?: string | null;
  userRating?: number | string | null;
  dataSource?: string | null;
}




function mapStation(raw: ApiStation): Station {
  const address = raw.address || 'Address unavailable';

  const parts = address
    .split(',')
    .map((p) => p.trim())
    .filter(Boolean);

  const city =
    raw.city ||
    (parts.length >= 2 ? parts[parts.length - 2] : parts[0]) ||
    'Unknown';

  const connectors = (raw.connectors || []).map((c, index) => {
    const powerKw = c.powerKW ?? 0;

    const currentType: 'DC Fast' | 'AC Slow' | 'Ultra Fast' =
      powerKw >= 150
        ? 'Ultra Fast'
        : powerKw >= 50
          ? 'DC Fast'
          : 'AC Slow';

    return {
      id: `${raw.id}-${index}`,
      type: c.type as ConnectorType,
      powerKw,
      status: 'maintenance' as const,
      pricePerKwh: Number(raw.evChargingPrice) || 0,
      currentType,
    };
  });

  const maxPower = connectors.reduce(
    (max, connector) => Math.max(max, connector.powerKw),
    0
  );

  const price = Number(raw.evChargingPrice);
  const rating = Number(raw.userRating);

  const statusText = (raw.operationalStatus || '').toLowerCase();

  const stationStatus: Station['status'] =
  statusText.includes('maintenance') ||
  statusText.includes('upcoming') ||
  statusText.includes('planned')
    ? 'Offline'
    : statusText.includes('operational')
      ? 'Available'
      : 'Offline';

  return {
    id: String(raw.id),
    name: raw.name,
    address,
    city,
    operator: raw.operatorName || 'Unknown',
    latitude: raw.latitude ?? 0,
    longitude: raw.longitude ?? 0,
    connectors,
    pricePerKwh: Number.isFinite(price) ? price : 0,
    availableConnectors: 0,
    totalConnectors: connectors.length,
    status: stationStatus,
    distanceKm: 0,
    chargingSpeed: maxPower === 0 ? 'Unknown' : `${maxPower} kW`,
    rating: Number.isFinite(rating) ? rating : 0,
    reviewCount: 0,
    openingHours: raw.operatingHours || 'Unknown',
    amenities: [],
  };
}



export const stationService = {
  async getStations(filters?: StationFilter): Promise<Station[]> {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error('Could not load charging stations from the backend.');
    }

    const data: { stations: ApiStation[] } = await response.json();
    let result = data.stations.map(mapStation);

    if (!filters) return result;

    if (filters.searchQuery?.trim()) {
      const q = filters.searchQuery.toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.address.toLowerCase().includes(q) ||
          s.operator.toLowerCase().includes(q) ||
          s.city.toLowerCase().includes(q)
      );
    }

    if (filters.connectorType && filters.connectorType !== 'all') {
      result = result.filter((s) =>
        s.connectors.some((c) => c.type === filters.connectorType)
      );
    }

    if (filters.minSpeedKw) {
      result = result.filter((s) =>
        s.connectors.some((c) => c.powerKw >= filters.minSpeedKw!)
      );
    }

    // Open Charge Map does not reliably provide pricing or live availability.
   

    

   

    

    return result;
  },

  async getStationById(id: string): Promise<Station | null> {
    const stations = await this.getStations();
    return stations.find((s) => s.id === id) ?? null;
  },

  async getNearbyStations(limit = 4): Promise<Station[]> {
    // True proximity sorting will be added when user location is available.
    return (await this.getStations()).slice(0, limit);
  },

  async getStationAvailability(id: string) {
    const station = await this.getStationById(id);
    if (!station) return null;

    return {
      stationId: station.id,
      available: station.availableConnectors,
      total: station.totalConnectors,
      status: station.status,
      connectors: station.connectors,
    };
  },
};
