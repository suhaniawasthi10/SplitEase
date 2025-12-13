import api from '../utils/axios';
import type { Friend } from '../types/models';

export const friendsService = {
  async getFriends(): Promise<Friend[]> {
    const response = await api.get('/friends/list');
    return response.data.friends;
  },

  async getPendingRequests(): Promise<Friend[]> {
    const response = await api.get('/friends/pending');
    // Backend returns { received: [...], sent: [...] }
    // We only care about received requests (incoming)
    return response.data.received || [];
  },

  async sendFriendRequest(friendUsername: string): Promise<void> {
    await api.post('/friends/request', { friendUsername });
  },

  async acceptFriendRequest(requestId: string): Promise<void> {
    await api.put(`/friends/accept/${requestId}`);
  },

  async rejectFriendRequest(requestId: string): Promise<void> {
    await api.put(`/friends/reject/${requestId}`);
  },

  async removeFriend(friendshipId: string): Promise<void> {
    await api.delete(`/friends/${friendshipId}`);
  },

  async searchFriends(username: string): Promise<any[]> {
    const response = await api.get('/friends/search', {
      params: { username }
    });
    return response.data.friends;
  },
};
