import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type AppError = {
    status: number | undefined;
    statusText: string | undefined;
};

type State = {
    error: AppError | null;
    setError: (error: AppError) => void;
    clearError: () => void;
};

const useErrorStore = create<State>()(
    persist(
        (set) => ({
            error: null,
            setError: (error) => set({ error }),
            clearError: () => set({ error: null }),
        }),
        {
            name: 'error-store',
        },
    ),
);

export default useErrorStore;
