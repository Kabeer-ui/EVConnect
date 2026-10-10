import { MOCK_IMPACT_STATS } from '../data/mockImpact';
import { ImpactStats } from '../types';

export const impactService = {
  // In the future this connects to GET /api/user/impact
  async getUserImpact(): Promise<ImpactStats> {
    await new Promise((resolve) => setTimeout(resolve, 80));
    return { ...MOCK_IMPACT_STATS };
  }
};
