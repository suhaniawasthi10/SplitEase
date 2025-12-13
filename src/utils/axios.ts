import axios from 'axios';

const API_BASE_URL = 'http://localhost:8002/api';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true, // Important: This ensures cookies are sent with requests
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add response interceptor to handle common errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Don't automatically redirect - let components handle 401 errors
        return Promise.reject(error);
    }
);

export default api;
