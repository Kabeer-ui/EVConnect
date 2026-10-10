import { ChatMessage, Station, User, Booking } from '../types';
import { stationService } from './stationService';
import { bookingService } from './bookingService';
import { authService } from './authService';

export interface AssistantContext {
  user: User;
  stations: Station[];
  upcomingBooking: Booking | null;
  userLocation?: { lat: number; lng: number };
}

// In the future this connects to POST /api/assistant/message
export const assistantService = {
  async getInitialMessages(): Promise<ChatMessage[]> {
    const user = authService.getCurrentUser();
    const firstName = user.name.split(' ')[0] || 'there';
    return [
      {
        id: 'msg-init-1',
        sender: 'assistant',
        content: `Hello ${firstName}! I'm your EVConnect Copilot. I can help you locate high-speed charging hubs, review your upcoming reservation at Presidio Green Hub, or plan charging along your route. What would you like to explore today?`,
        timestamp: 'Just now'
      }
    ];
  },

  async sendMessage(userInput: string): Promise<ChatMessage> {
    // Simulate real assistant latency
    await new Promise((resolve) => setTimeout(resolve, 600));

    const inputLower = userInput.toLowerCase();
    const stations = await stationService.getStations();
    const upcoming = await bookingService.getUpcomingBooking();
    const allBookings = await bookingService.getBookings();
    const nowStr = 'Just now';

    // 1. Upcoming booking query
    if (inputLower.includes('upcoming') || inputLower.includes('my booking') || inputLower.includes('reservation')) {
      if (upcoming) {
        return {
          id: `msg-${Date.now()}`,
          sender: 'assistant',
          content: `You have an upcoming booking at **${upcoming.stationName}** on **${upcoming.date}** (${upcoming.timeSlot}). You reserved a **${upcoming.connectorPowerKw} kW ${upcoming.connectorType}** bay. Current status is **${upcoming.status}**.`,
          timestamp: nowStr,
          actionLink: {
            text: 'View Booking Details',
            href: `/bookings`
          }
        };
      } else {
        return {
          id: `msg-${Date.now()}`,
          sender: 'assistant',
          content: `You currently have no upcoming charging bookings scheduled. Would you like me to find an available ultra-fast charger nearby?`,
          timestamp: nowStr,
          actionLink: {
            text: 'Explore Nearby Stations',
            href: '/explore'
          }
        };
      }
    }

    // 2. Fast charger / closest charger
    if (inputLower.includes('fast') || inputLower.includes('speed') || inputLower.includes('350') || inputLower.includes('closest') || inputLower.includes('near')) {
      const topFast = stations
        .filter((s) => s.availableConnectors > 0)
        .sort((a, b) => a.distanceKm - b.distanceKm)
        .slice(0, 2);

      return {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        content: `I found ${topFast.length} high-speed stations near you with immediate open bays. The closest high-capacity station is **${topFast[0].name}** (${topFast[0].distanceKm} km away, ${topFast[0].chargingSpeed}, ${topFast[0].availableConnectors} of ${topFast[0].totalConnectors} bays available).`,
        timestamp: nowStr,
        stationRecommendations: topFast,
        actionLink: {
          text: `Reserve bay at ${topFast[0].name}`,
          href: `/booking/${topFast[0].id}`
        }
      };
    }

    // 3. Booking history
    if (inputLower.includes('history') || inputLower.includes('past') || inputLower.includes('previous')) {
      const completed = allBookings.filter((b) => b.status === 'Completed');
      return {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        content: `You have completed **${completed.length} charging sessions** on record through EVConnect. Your last completed session was at **${completed[0]?.stationName || 'SOMA Tech Plaza Station'}** where you charged ~${completed[0]?.estimatedKwh || 42} kWh.`,
        timestamp: nowStr,
        actionLink: {
          text: 'View All Past Bookings',
          href: '/bookings'
        }
      };
    }

    // 4. Best available / Book best
    if (inputLower.includes('best') || inputLower.includes('recommend') || inputLower.includes('book')) {
      const best = stations.find((s) => s.id === 'sta-101') || stations[0];
      return {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        content: `Based on your vehicle's CCS2 connector and ultra-fast charging capability, I recommend **${best.name}** operated by ${best.operator}. It offers ${best.chargingSpeed} at $${best.pricePerKwh.toFixed(2)}/kWh with ${best.availableConnectors} bays ready now.`,
        timestamp: nowStr,
        stationRecommendations: [best],
        actionLink: {
          text: `Book Slot at ${best.name}`,
          href: `/booking/${best.id}`
        }
      };
    }

    // Default helpful response
    return {
      id: `msg-${Date.now()}`,
      sender: 'assistant',
      content: `I can assist with real-time station availability, reserve specific time slots, calculate charging duration for your battery capacity, and review your session history across all charging networks. Try asking: "Find a fast charger near me" or "What's my upcoming booking?".`,
      timestamp: nowStr,
      actionLink: {
        text: 'Browse Station Directory',
        href: '/explore'
      }
    };
  }
};
