
import { User } from '../types';

const AUTH_USER_KEY = 'evconnect_auth_user';
const API_URL = 'http://127.0.0.1:5000/api';

export interface LoginCredentials {
  email: string;
  password?: string;
  rememberMe?: boolean;
}

export interface SignupData {
  name: string;
  email: string;
  phone: string;
  password?: string;
  vehicleBrand: string;
  vehicleModel: string;
  batteryCapacity: number;
}

interface ApiUser {
  id: string | number;
  fullName?: string;
  name?: string;
  email: string;
  createdAt?: string;
  created_at?: string;
}

async function post<T>(endpoint: string, body: unknown): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || result.message || 'Request failed');
  }

  return result as T;
}

function buildUser(apiUser: ApiUser): User {
  const createdAt = apiUser.createdAt || apiUser.created_at;

  return {
    id: String(apiUser.id),
    name: apiUser.fullName || apiUser.name || 'EVConnect User',
    email: apiUser.email,
    phone: '',
    memberSince: createdAt
      ? new Date(createdAt).toLocaleDateString('en-US', {
          month: 'long',
          year: 'numeric',
        })
      : new Date().toLocaleDateString('en-US', {
          month: 'long',
          year: 'numeric',
        }),
    primaryVehicleId: '',
    preferredConnector: 'CCS2',
    vehicles: [],
    notificationSettings: {
      bookingReminders: true,
      stationAlerts: true,
      impactSummaries: true,
      emailReceipts: true,
    },
  };
}

function saveUser(user: User): User {
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  return user;
}

export const authService = {
  getCurrentUser(): User {
    const stored = localStorage.getItem(AUTH_USER_KEY);

    if (!stored) {
      throw new Error('No logged-in user. Please log in.');
    }

    return JSON.parse(stored) as User;
  },

  async login(
    credentials: LoginCredentials
  ): Promise<{ success: boolean; user: User }> {
    if (!credentials.password) {
      throw new Error('Please enter your password.');
    }

    const result = await post<{ user: ApiUser }>('/login', {
      email: credentials.email,
      password: credentials.password,
    });

    const user = buildUser(result.user);
    saveUser(user);

    return { success: true, user };
  },

  async signup(
    data: SignupData
  ): Promise<{ success: boolean; user: User }> {
    if (!data.password) {
      throw new Error('Please enter a password.');
    }

    const result = await post<{ user: ApiUser }>('/register', {
      fullName: data.name,
      email: data.email,
      password: data.password,
    });

    const user = buildUser(result.user);

    user.phone = data.phone;

    if (data.vehicleBrand && data.vehicleModel) {
      const vehicleId = `veh-${Date.now()}`;

      user.primaryVehicleId = vehicleId;
      user.vehicles = [
        {
          id: vehicleId,
          brand: data.vehicleBrand,
          model: data.vehicleModel,
          year: new Date().getFullYear(),
          batteryCapacityKwh: data.batteryCapacity,
          usableRangeKm: Math.round(data.batteryCapacity * 5.8),
          preferredConnector: 'CCS2',
          licensePlate: '',
        },
      ];
    }

    saveUser(user);
    return { success: true, user };
  },

  logout(): void {
    localStorage.removeItem(AUTH_USER_KEY);
  },

  isAuthenticated(): boolean {
    try {
      return Boolean(localStorage.getItem(AUTH_USER_KEY));
    } catch {
      return false;
    }
  },
};
