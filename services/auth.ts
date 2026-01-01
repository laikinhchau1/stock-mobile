import api from './api';
import { API_ENDPOINTS } from '@/constants/api';

export interface User {
    id: string;
    email: string;
    name: string;
    avatar?: string;
}

export interface AuthResponse {
    user: User;
    accessToken: string;
    refreshToken: string;
}

export interface RegisterData {
    email: string;
    password: string;
    name: string;
}

export interface LoginData {
    email: string;
    password: string;
}

export const authApi = {
    register: (data: RegisterData) => {
        return api.post<AuthResponse>(API_ENDPOINTS.REGISTER, data);
    },

    login: (data: LoginData) => {
        return api.post<AuthResponse>(API_ENDPOINTS.LOGIN, data);
    },

    getProfile: () => {
        return api.get<User>(API_ENDPOINTS.ME);
    },

    changePassword: (currentPassword: string, newPassword: string) => {
        return api.post<{ message: string }>(API_ENDPOINTS.CHANGE_PASSWORD, {
            currentPassword,
            newPassword,
        });
    },
};

export default authApi;
