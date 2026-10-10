import { MOCK_STATIONS } from '../data/mockStations';
import { Station, ConnectorType } from '../types';

export interface StationFilter {
  searchQuery?: string;
  connectorType?: ConnectorType | 'all';
  minSpeedKw?: number;
  maxPrice?: number;
  availableOnly?: boolean;
  operator?: string | 'all';
  maxDistanceKm?: number;
}

// In the future this connects to GET /api/stations
export const stationService = {
  async getStations(filters?: StationFilter): Promise<Station[]> {
    // Simulate slight async network behavior
    await new Promise((resolve) => setTimeout(resolve, 80));
    let result = [...MOCK_STATIONS];

    if (!filters) return result;

    if (filters.searchQuery && filters.searchQuery.trim() !== '') {
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

    if (filters.maxPrice) {
      result = result.filter((s) => s.pricePerKwh <= filters.maxPrice!);
    }

    if (filters.availableOnly) {
      result = result.filter((s) => s.availableConnectors > 0);
    }

    if (filters.operator && filters.operator !== 'all') {
      result = result.filter((s) => s.operator === filters.operator);
    }

    if (filters.maxDistanceKm) {
      result = result.filter((s) => s.distanceKm <= filters.maxDistanceKm!);
    }

    return result;
  },

  // In the future this connects to GET /api/stations/:id
  async getStationById(id: string): Promise<Station | null> {
    await new Promise((resolve) => setTimeout(resolve, 60));
    const station = MOCK_STATIONS.find((s) => s.id === id);
    return station || null;
  },

  // In the future this connects to GET /api/stations/nearby
  async getNearbyStations(limit = 4): Promise<Station[]> {
    await new Promise((resolve) => setTimeout(resolve, 50));
    return [...MOCK_STATIONS].sort((a, b) => a.distanceKm - b.distanceKm).slice(0, limit);
  },

  // In the future this connects to GET /api/stations/:id/availability
  async getStationAvailability(id: string) {
    const station = await this.getStationById(id);
    if (!station) return null;
    return {
      stationId: station.id,
      available: station.availableConnectors,
      total: station.totalConnectors,
      status: station.status,
      connectors: station.connectors
    };
  }
};
