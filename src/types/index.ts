export type ConnectorType = 'CCS2' | 'Type 2' | 'CHAdeMO' | 'GB/T' | 'Tesla Supercharger';

export interface Connector {
  id: string;
  type: ConnectorType;
  powerKw: number;
  status: 'available' | 'occupied' | 'maintenance';
  pricePerKwh: number;
  currentType: 'DC Fast' | 'AC Slow' | 'Ultra Fast';
}

export interface Amenity {
  id: string;
  name: string;
  icon: string;
}

export interface StationReview {
  id: string;
  userName: string;
  rating: number;
  date: string;
  comment: string;
  vehicleModel?: string;
}

export interface Station {
  id: string;
  name: string;
  operator: string;
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  distanceKm: number;
  connectors: Connector[];
  totalConnectors: number;
  availableConnectors: number;
  chargingSpeed: string; // e.g. "Up to 150 kW"
  pricePerKwh: number;
  status: 'Available' | 'Busy' | 'Full' | 'Offline';
  rating: number;
  reviewCount: number;
  openingHours: string;
  amenities: string[];
  imageUrl?: string;
  networkBadge?: string;
  isDemoData?: boolean;
  dataSource?: string;
}

export interface TimeSlot {
  id: string;
  time: string;
  status: 'Available' | 'Selected' | 'Occupied' | 'Unavailable';
}

export interface Booking {
  id: string;
  stationId: string;
  stationName: string;
  stationAddress: string;
  operator: string;
  connectorId: string;
  connectorType: ConnectorType;
  connectorPowerKw: number;
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "14:00 - 14:45"
  durationMinutes: number;
  estimatedKwh: number;
  estimatedCost: number;
  status: 'Upcoming' | 'Active' | 'Completed' | 'Cancelled';
  createdAt: string;
  vehicleModel: string;
  batteryStartPct?: number;
  batteryTargetPct?: number;
  isDemo?: boolean;
}

export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  batteryCapacityKwh: number;
  usableRangeKm: number;
  preferredConnector: ConnectorType;
  licensePlate: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  vehicles: Vehicle[];
  primaryVehicleId: string;
  preferredConnector: ConnectorType;
  notificationSettings: {
    bookingReminders: boolean;
    stationAlerts: boolean;
    impactSummaries: boolean;
    emailReceipts: boolean;
  };
  memberSince: string;
}

export interface ImpactStats {
  chargingSessions: number;
  estimatedCo2AvoidedKg: number;
  electricKmDriven: number;
  energyConsumedKwh: number;
  treesEquivalent: number;
  fuelCostSaved: number;
  monthlyBreakdown: {
    month: string;
    kwh: number;
    co2Kg: number;
    km: number;
  }[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  stationRecommendations?: Station[];
  actionLink?: {
    text: string;
    href: string;
  };
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  type: 'booking' | 'alert' | 'system';
}
