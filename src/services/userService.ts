import { authService } from './authService';
import { User, Vehicle } from '../types';

export const userService = {
  async getProfile(): Promise<User> {
    await new Promise((resolve) => setTimeout(resolve, 60));
    return authService.getCurrentUser();
  },

  async updateProfile(updates: Partial<User>): Promise<User> {
    await new Promise((resolve) => setTimeout(resolve, 120));
    const current = authService.getCurrentUser();
    const updated = { ...current, ...updates };
    localStorage.setItem('evconnect_auth_user', JSON.stringify(updated));
    return updated;
  },

  async addVehicle(vehicle: Omit<Vehicle, 'id'>): Promise<Vehicle> {
    const user = authService.getCurrentUser();
    const newVehicle: Vehicle = {
      ...vehicle,
      id: `veh-${Math.floor(100 + Math.random() * 900)}`
    };
    const updatedVehicles = [...user.vehicles, newVehicle];
    await this.updateProfile({ vehicles: updatedVehicles });
    return newVehicle;
  }
};
