import React, { useEffect, useState } from 'react';
import { HeroSlideshow } from '../components/home/HeroSlideshow';
import { FindChargerSection } from '../components/home/FindChargerSection';
import { NearbyStations } from '../components/home/NearbyStations';
import { QuickActions } from '../components/home/QuickActions';
import { UpcomingBookingSection } from '../components/home/UpcomingBookingSection';
import { AIAssistantPreview } from '../components/home/AIAssistantPreview';
import { ImpactPreview } from '../components/home/ImpactPreview';
import { stationService } from '../services/stationService';
import { bookingService } from '../services/bookingService';
import { Station, Booking } from '../types';

export const HomePage: React.FC = () => {
  const [stations, setStations] = useState<Station[]>([]);
  const [upcomingBooking, setUpcomingBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    async function loadData() {
      try {
        const [stationList, upcoming] = await Promise.all([
          stationService.getStations(),
          bookingService.getUpcomingBooking()
        ]);
        setStations(stationList);
        setUpcomingBooking(upcoming);
      } catch (err) {
        console.error('Failed to load homepage data', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="w-full">
      {/* 1. Hero Slideshow with 3 photographic rotating slides */}
      <HeroSlideshow />

      {/* 2. Find a Charger Map Preview Section */}
      <FindChargerSection stations={stations} />

      {/* 3. Nearby Charging Stations Card List */}
      <NearbyStations stations={stations} />

      {/* 4. Quick Action Cards */}
      <QuickActions />

      {/* 5. Upcoming Booking Section */}
      <UpcomingBookingSection booking={upcomingBooking} />

      {/* 6. AI Assistant Preview Card */}
      <AIAssistantPreview />

      {/* 7. Environmental Impact Section */}
      <ImpactPreview />
    </div>
  );
};
