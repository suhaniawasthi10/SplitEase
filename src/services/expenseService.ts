import api from '../utils/axios';
import type { Expense } from '../types/models';

export interface CreateExpenseData {
  description: string;
  amount: number;
  splitType: 'equal' | 'exact' | 'percentage';
  participants: Array<{ userId: string; share?: number }>;
  groupId?: string;
  category?: string;
  notes?: string;
}

export const expenseService = {
  async createExpense(data: CreateExpenseData): Promise<Expense> {
    const response = await api.post('/expenses', data);
    return response.data.expense;
  },

  async updateExpense(expenseId: string, data: Partial<CreateExpenseData>): Promise<Expense> {
    const response = await api.put(`/expenses/${expenseId}`, data);
    return response.data.expense;
  },

  async deleteExpense(expenseId: string): Promise<void> {
    await api.delete(`/expenses/${expenseId}`);
  },

  async changePayer(expenseId: string, newPayerId: string): Promise<Expense> {
    const response = await api.put(`/expenses/${expenseId}/change-payer`, { newPayerId });
    return response.data.expense;
  },

  async getExpenses(params?: { groupId?: string; limit?: number; skip?: number }): Promise<{ expenses: Expense[]; total: number }> {
    const response = await api.get('/expenses', { params });
    return response.data;
  },

  async getExpenseDetails(expenseId: string): Promise<Expense> {
    const response = await api.get(`/expenses/${expenseId}`);
    return response.data.expense;
  },
};
