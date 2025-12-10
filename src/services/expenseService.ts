import axios from 'axios';
import type { Expense } from '../types/models';

const API_BASE_URL = 'http://localhost:8002/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

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
};
