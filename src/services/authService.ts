import { MOCK_USER } from '../data/mockUser';
import { User } from '../types';

const AUTH_USER_KEY = 'evconnect_auth_user';

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

// In the future this connects to POST /api/auth/login and POST /api/auth/register
export const authService = {
  getCurrentUser(): User {
    try {
      const stored = localStorage.getItem(AUTH_USER_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // fallback
    }
    return MOCK_USER;
  },

  async login(credentials: LoginCredentials): Promise<{ success: boolean; user: User }> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    // For now mock success with existing user or adapted email
    const currentUser = this.getCurrentUser();
    const updated = {
      ...currentUser,
      email: credentials.email
    };
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(updated));
    return { success: true, user: updated };
  },

  async signup(data: SignupData): Promise<{ success: boolean; user: User }> {
    await new Promise((resolve) => setTimeout(resolve, 250));
    const newUser: User = {
      id: `usr-${Math.floor(1000 + Math.random() * 9000)}`,
      name: data.name,
      email: data.email,
      phone: data.phone,
      memberSince: 'October 2026',
      primaryVehicleId: 'veh-new-1',
      preferredConnector: 'CCS2',
      vehicles: [
        {
          id: 'veh-new-1',
          brand: data.vehicleBrand,
          model: data.vehicleModel,
          year: 2025,
          batteryCapacityKwh: data.batteryCapacity || 75,
          usableRangeKm: Math.round((data.batteryCapacity || 75) * 5.8),
          preferredConnector: 'CCS2',
          licensePlate: 'NEW-EV1'
        }
      ],
      notificationSettings: {
        bookingReminders: true,
        stationAlerts: true,
        impactSummaries: true,
        emailReceipts: true
      }
    };

    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(newUser));
    return { success: true, user: newUser };
  },

  logout(): void {
    localStorage.removeItem(AUTH_USER_KEY);
  },

  isAuthenticated(): boolean {
    return true; // default mock session active
  }
};
