export interface AuthState {
    user: UserLoginDto | null;
    isAuthenticated: boolean;
    login: (user: UserLoginDto) => void;
    logout: () => void;
}
