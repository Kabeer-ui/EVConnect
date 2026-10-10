import { INITIAL_MOCK_BOOKINGS } from '../data/mockBookings';
import { Booking } from '../types';

const STORAGE_KEY = 'evconnect_user_bookings';

function getStoredBookings(): Booking[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // fallback to initial
  }
  return [...INITIAL_MOCK_BOOKINGS];
}

function saveBookings(bookings: Booking[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
  } catch {
    // silent catch
  }
}

// In the future this connects to /api/bookings endpoints
export const bookingService = {
  async getBookings(): Promise<Booking[]> {
    await new Promise((resolve) => setTimeout(resolve, 60));
    return getStoredBookings();
  },

  async getUpcomingBooking(): Promise<Booking | null> {
    const bookings = await this.getBookings();
    const upcoming = bookings.find((b) => b.status === 'Upcoming');
    return upcoming || null;
  },

  async getBookingById(id: string): Promise<Booking | null> {
    const bookings = await this.getBookings();
    return bookings.find((b) => b.id === id) || null;
  },

  // Future POST /api/bookings
  async createBooking(bookingData: Omit<Booking, 'id' | 'createdAt' | 'status'>): Promise<Booking> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    const newBooking: Booking = {
      ...bookingData,
      id: `EVC-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      status: 'Upcoming'
    };

    const current = getStoredBookings();
    const updated = [newBooking, ...current];
    saveBookings(updated);
    return newBooking;
  },

  // Future PATCH /api/bookings/:id/cancel
  async cancelBooking(id: string): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    const current = getStoredBookings();
    const idx = current.findIndex((b) => b.id === id);
    if (idx !== -1) {
      current[idx].status = 'Cancelled';
      saveBookings(current);
      return true;
    }
    return false;
  }
};
