import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuth = create(
  persist(
    (set) => ({
      user: null,
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => {
        set({ user: null, isAuthenticated: false });
        document.cookie = "accessToken=; Max-Age=0; path=/";
        document.cookie = "refreshToken=; Max-Age=0; path=/";
      },
    }),
    {
      name: "auth-store",
    }
  )
);

export default useAuth;
