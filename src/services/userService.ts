import axios from '../utils/axios';
import type { User } from '../types/auth';

export interface UpdateUserData {
    name?: string;
    username?: string;
    preferredCurrency?: string;
}

export const userService = {
    async updateProfile(data: UpdateUserData): Promise<{ message: string; user: User }> {
        try {
            const response = await axios.put('/user/me', data);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Failed to update profile');
        }
    },

    async uploadProfileImage(file: File): Promise<{ message: string; user: User }> {
        try {
            const formData = new FormData();
            formData.append('profileImage', file);

            const response = await axios.post('/user/profile-image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Failed to upload image');
        }
    },

    async deleteProfileImage(): Promise<{ message: string; user: User }> {
        try {
            const response = await axios.delete('/user/profile-image');
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Failed to delete image');
        }
    },

    async deleteAccount(password: string): Promise<{ message: string }> {
        try {
            const response = await axios.delete('/user/account', {
                data: { password }
            });
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Failed to delete account');
        }
    },

    async updateUpiId(upiId: string): Promise<{ message: string; user: User }> {
        try {
            const response = await axios.put('/user/upi-id', { upiId });
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Failed to update UPI ID');
        }
    },

    async searchUsers(query: string): Promise<any[]> {
        try {
            const response = await axios.get('/user/search', {
                params: { query }
            });
            return response.data.users;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Failed to search users');
        }
    }
};
