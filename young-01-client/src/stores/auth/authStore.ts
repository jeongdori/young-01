import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserResponseDto } from '@shared/types/user/user.types';

type AuthState = {
    user: UserResponseDto | null;
    isAuthenticated: boolean;
    login: (user: UserResponseDto) => void;
    logout: () => void;
};

const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            login: (user: UserResponseDto) => set({ user, isAuthenticated: true }),
            logout: () => {
                set({ user: null, isAuthenticated: false });
                document.cookie = 'accessToken=; Max-Age=0; path=/';
                document.cookie = 'refreshToken=; Max-Age=0; path=/';
            },
        }),
        {
            name: 'auth-store',
        },
    ),
);

export default useAuthStore;
