import { create } from 'zustand';

interface AppState {
    credits: number;
    isPro: boolean;
    theme: 'dark' | 'light';

    // Actions
    addCredits: (amount: number) => void;
    removeCredits: (amount: number) => void;
    setProStatus: (status: boolean) => void;
    toggleTheme: () => void;
}

export const useStore = create<AppState>((set) => ({
    credits: 10, // Default Free credits
    isPro: false,
    theme: 'dark',

    addCredits: (amount) => set((state) => ({ credits: state.credits + amount })),
    removeCredits: (amount) => set((state) => ({ credits: Math.max(0, state.credits - amount) })),
    setProStatus: (status) => set({ isPro: status }),
    toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
}));
