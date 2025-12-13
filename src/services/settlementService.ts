import api from '../utils/axios';

export interface CreateSettlementData {
    paidTo: string;
    amount: number;
    groupId?: string;
    note?: string;
}

export interface Settlement {
    _id: string;
    paidBy: {
        _id: string;
        name: string;
        username: string;
    };
    paidTo: {
        _id: string;
        name: string;
        username: string;
    };
    amount: number;
    groupId?: {
        _id: string;
        name: string;
    };
    note: string;
    settledAt: string;
    createdAt: string;
}

export const settlementService = {
    // Create a new settlement
    async createSettlement(data: CreateSettlementData): Promise<Settlement> {
        try {
            const response = await api.post('/settlements', data);
            return response.data.settlement;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Failed to create settlement');
        }
    },

    // Get all settlements
    async getSettlements(params?: { groupId?: string; limit?: number; skip?: number }): Promise<{ settlements: Settlement[]; count: number }> {
        try {
            const response = await api.get('/settlements', { params });
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Failed to fetch settlements');
        }
    },

    // Get group-specific settlements
    async getGroupSettlements(groupId: string): Promise<{ settlements: Settlement[]; count: number }> {
        try {
            const response = await api.get(`/settlements/group/${groupId}`);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Failed to fetch group settlements');
        }
    },
};
