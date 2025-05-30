import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserLoginDto } from '@shared/types/user/user.types';

interface AuthState {
    user: UserLoginDto | null;
    isAuthenticated: boolean;
    login: (user: UserLoginDto) => void;
    logout: () => void;
}

const useAuth = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            login: (user: UserLoginDto) => set({ user, isAuthenticated: true }),
            logout: () => {
                set({ user: null, isAuthenticated: false });
                document.cookie = 'accessToken=; Max-Age=0; path=/';
                document.cookie = 'refreshToken=; Max-Age=0; path=/';
            },
        }),
        {
            name: 'auth-store',
        }
    )
);

export default useAuth;
