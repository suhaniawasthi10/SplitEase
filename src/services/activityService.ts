import axios from 'axios';
import type { Activity } from '../types/models';

const API_BASE_URL = 'http://localhost:8002/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export const activityService = {
  async getRecentActivities(limit?: number): Promise<Activity[]> {
    const response = await api.get('/activities', {
      params: { limit },
    });
    return response.data.activities;
  },
};
