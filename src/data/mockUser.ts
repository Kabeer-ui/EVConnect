import { User } from '../types';

export const MOCK_USER: User = {
  id: 'usr-8921',
  name: 'Alex Rivera',
  email: 'alex.rivera@example.com',
  phone: '+1 (555) 382-9014',
  memberSince: 'March 2024',
  primaryVehicleId: 'veh-01',
  preferredConnector: 'CCS2',
  vehicles: [
    {
      id: 'veh-01',
      brand: 'Hyundai',
      model: 'Ioniq 5 AWD Long Range',
      year: 2024,
      batteryCapacityKwh: 77.4,
      usableRangeKm: 480,
      preferredConnector: 'CCS2',
      licensePlate: '7EV-CONN'
    },
    {
      id: 'veh-02',
      brand: 'Polestar',
      model: 'Polestar 2 Dual Motor',
      year: 2023,
      batteryCapacityKwh: 78.0,
      usableRangeKm: 450,
      preferredConnector: 'CCS2',
      licensePlate: 'ECO-290'
    }
  ],
  notificationSettings: {
    bookingReminders: true,
    stationAlerts: true,
    impactSummaries: true,
    emailReceipts: true
  }
};
