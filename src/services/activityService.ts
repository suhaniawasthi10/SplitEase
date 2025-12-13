import api from '../utils/axios';
import type { Activity } from '../types/models';

export const activityService = {
  async getRecentActivities(limit?: number): Promise<Activity[]> {
    const response = await api.get('/activities', {
      params: { limit },
    });
    return response.data.activities;
  },
};
