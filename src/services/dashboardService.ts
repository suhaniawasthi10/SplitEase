import api from '../utils/axios';

export interface BalanceSummary {
  youOwe: number;
  youreOwed: number;
  netBalance: number;
  owedCount: number;
  owedByCount: number;
}

export interface DetailedBalance {
  _id: string;
  fromUserId?: {
    _id: string;
    name: string;
    username: string;
    upiId?: string;
  };
  toUserId?: {
    _id: string;
    name: string;
    username: string;
    upiId?: string;
  };
  amount: number;
  groupId?: {
    _id: string;
    name: string;
  };
  user: {
    _id: string;
    name: string;
    username: string;
    upiId?: string;
  };
}

export const dashboardService = {
  // Get balance summary for dashboard cards
  async getBalanceSummary(): Promise<BalanceSummary> {
    try {
      const response = await api.get('/settlements/dashboard/summary');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch balance summary');
    }
  },

  // Get detailed balances with friend info
  async getDetailedBalances(): Promise<{ owedToYou: DetailedBalance[]; youOwe: DetailedBalance[] }> {
    try {
      const response = await api.get('/settlements/dashboard/detailed');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch detailed balances');
    }
  },
};