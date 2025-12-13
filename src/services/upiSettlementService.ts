import axios from '../utils/axios';

export interface CreateUpiSettlementData {
    paidTo: string;
    amount: number;
    groupId?: string;
    upiTransactionId?: string;
}

export interface UpiSettlement {
    _id: string;
    paidBy: string;
    paidTo: {
        _id: string;
        name: string;
        username: string;
        upiId: string;
    };
    amount: number;
    groupId?: string;
    paymentMethod: string;
    paymentStatus: 'pending' | 'completed' | 'failed';
    upiTransactionId?: string;
    createdAt: string;
}

export const upiSettlementService = {
    async createUpiSettlement(data: CreateUpiSettlementData): Promise<{
        message: string;
        settlement: UpiSettlement;
        recipientUpiId: string;
        recipientName: string;
    }> {
        try {
            const response = await axios.post('/upi-settlements/upi', data);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Failed to create UPI settlement');
        }
    },

    async confirmUpiPayment(
        settlementId: string,
        upiTransactionId?: string
    ): Promise<{
        message: string;
        settlement: UpiSettlement;
    }> {
        try {
            const response = await axios.put(`/upi-settlements/${settlementId}/confirm`, {
                upiTransactionId
            });
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Failed to confirm payment');
        }
    },

    async cancelUpiPayment(settlementId: string): Promise<{
        message: string;
        settlement: UpiSettlement;
    }> {
        try {
            const response = await axios.put(`/upi-settlements/${settlementId}/cancel`);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Failed to cancel payment');
        }
    }
};
