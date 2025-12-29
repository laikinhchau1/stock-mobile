import axios, { AxiosInstance } from 'axios';
import { useAuthStore } from '@/stores/auth-store';
import { API_BASE_URL } from '@/constants/api';

// Create axios instance
const axiosInstance: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add auth token to requests
axiosInstance.interceptors.request.use((config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle 401 errors and token refresh
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Token expired, try refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const { refreshToken } = useAuthStore.getState();
                const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
                    refreshToken,
                });

                const { accessToken, refreshToken: newRefreshToken } = response.data;
                await useAuthStore.getState().setTokens(accessToken, newRefreshToken);

                // Retry original request
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return axiosInstance(originalRequest);
            } catch {
                useAuthStore.getState().logout();
                return Promise.reject(error);
            }
        }

        return Promise.reject(error);
    }
);

// Simple API methods
export const api = {
    get: <T>(url: string) => axiosInstance.get<T>(url).then((res) => res.data),

    post: <T>(url: string, data?: any) => axiosInstance.post<T>(url, data).then((res) => res.data),

    put: <T>(url: string, data?: any) => axiosInstance.put<T>(url, data).then((res) => res.data),

    delete: <T>(url: string) => axiosInstance.delete<T>(url).then((res) => res.data),

    patch: <T>(url: string, data?: any) => axiosInstance.patch<T>(url, data).then((res) => res.data),
};

export default api;
