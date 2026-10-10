import { ImpactStats } from '../types';

export const MOCK_IMPACT_STATS: ImpactStats = {
  chargingSessions: 34,
  estimatedCo2AvoidedKg: 642, // e.g. ~180g CO2/km avoided compared to average ICE car
  electricKmDriven: 4120,
  energyConsumedKwh: 765,
  treesEquivalent: 28, // approx CO2 absorption equivalence
  fuelCostSaved: 482, // compared to equivalent gas pricing
  monthlyBreakdown: [
    { month: 'May 2026', kwh: 110, co2Kg: 92, km: 590 },
    { month: 'Jun 2026', kwh: 135, co2Kg: 114, km: 720 },
    { month: 'Jul 2026', kwh: 160, co2Kg: 134, km: 860 },
    { month: 'Aug 2026', kwh: 175, co2Kg: 147, km: 940 },
    { month: 'Sep 2026', kwh: 185, co2Kg: 155, km: 1010 }
  ]
};
