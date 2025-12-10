import axios from 'axios';
import type { Group } from '../types/models';

const API_BASE_URL = 'http://localhost:8002/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export const groupsService = {
  async getUserGroups(): Promise<Group[]> {
    const response = await api.get('/groups');
    return response.data.groups;
  },

  async getGroupDetails(groupId: string): Promise<Group> {
    const response = await api.get(`/groups/${groupId}`);
    return response.data.group;
  },

  async createGroup(data: { name: string; description?: string }): Promise<Group> {
    const response = await api.post('/groups', data);
    return response.data.group;
  },

  async updateGroup(groupId: string, data: { name?: string; description?: string }): Promise<Group> {
    const response = await api.put(`/groups/${groupId}`, data);
    return response.data.group;
  },

  async deleteGroup(groupId: string): Promise<void> {
    await api.delete(`/groups/${groupId}`);
  },
};