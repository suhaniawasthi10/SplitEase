import api from '../utils/axios';
import type { GroupDetails, GroupStats, UserBalance, Expense } from '../types/models';

export interface GroupDetailsResponse {
  group: GroupDetails;
  stats: GroupStats;
  userBalance: UserBalance;
}

export const groupDetailsService = {
  async getGroupDetails(groupId: string): Promise<GroupDetailsResponse> {
    const response = await api.get(`/groups/${groupId}`);
    return response.data;
  },

  async getGroupExpenses(groupId: string, limit = 20, skip = 0): Promise<{ expenses: Expense[]; total: number }> {
    const response = await api.get(`/expenses`, {
      params: { groupId, limit, skip }
    });
    return response.data;
  },

  async addMemberToGroup(groupId: string, friendId: string, role = 'member'): Promise<void> {
    await api.post(`/groups/${groupId}/members`, { friendId, role });
  },

  async removeMemberFromGroup(groupId: string, memberId: string): Promise<void> {
    await api.delete(`/groups/${groupId}/members/${memberId}`);
  },

  async updateGroupSettings(groupId: string, data: Partial<GroupDetails>): Promise<GroupDetails> {
    const response = await api.put(`/groups/${groupId}`, data);
    return response.data.group;
  },

  async sendEmailInvite(groupId: string, email: string): Promise<{ message: string; invite: any }> {
    const response = await api.post(`/groups/${groupId}/invite`, { email });
    return response.data;
  },

  async acceptInvite(token: string): Promise<{ message: string; group: GroupDetails }> {
    const response = await api.post(`/groups/invite/${token}/accept`);
    return response.data;
  },

  async rejectInvite(token: string): Promise<{ message: string }> {
    const response = await api.post(`/groups/invite/${token}/reject`);
    return response.data;
  },

  async leaveGroup(groupId: string): Promise<{ message: string }> {
    const response = await api.post(`/groups/${groupId}/leave`);
    return response.data;
  },

  async deleteGroup(groupId: string): Promise<{ message: string }> {
    const response = await api.delete(`/groups/${groupId}`);
    return response.data;
  },
};
