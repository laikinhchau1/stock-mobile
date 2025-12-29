import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

interface User {
    id: string;
    email: string;
    name: string;
    avatar?: string;
}

interface AuthState {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;

    // Actions
    setTokens: (accessToken: string, refreshToken: string) => Promise<void>;
    setUser: (user: User) => void;
    login: (user: User, accessToken: string, refreshToken: string) => Promise<void>;
    logout: () => Promise<void>;
    setLoading: (loading: boolean) => void;
    hydrate: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
    isLoading: true,

    setTokens: async (accessToken, refreshToken) => {
        await SecureStore.setItemAsync('accessToken', accessToken);
        await SecureStore.setItemAsync('refreshToken', refreshToken);
        set({ accessToken, refreshToken });
    },

    setUser: (user) => {
        set({ user, isAuthenticated: true });
    },

    login: async (user, accessToken, refreshToken) => {
        await get().setTokens(accessToken, refreshToken);
        set({ user, isAuthenticated: true, isLoading: false });
        await AsyncStorage.setItem('user', JSON.stringify(user));
    },

    logout: async () => {
        await SecureStore.deleteItemAsync('accessToken');
        await SecureStore.deleteItemAsync('refreshToken');
        await AsyncStorage.removeItem('user');
        set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
        });
    },

    setLoading: (isLoading) => {
        set({ isLoading });
    },

    hydrate: async () => {
        try {
            const [accessToken, refreshToken, userJson] = await Promise.all([
                SecureStore.getItemAsync('accessToken'),
                SecureStore.getItemAsync('refreshToken'),
                AsyncStorage.getItem('user'),
            ]);

            if (accessToken && refreshToken && userJson) {
                const user = JSON.parse(userJson);
                set({
                    user,
                    accessToken,
                    refreshToken,
                    isAuthenticated: true,
                    isLoading: false,
                });
            } else {
                set({ isLoading: false });
            }
        } catch (error) {
            console.error('Error hydrating auth state:', error);
            set({ isLoading: false });
        }
    },
}));
