import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserProfile, Game } from '../types/domain';
import { PLANS } from '../config/plans';

interface UserState {
    user: UserProfile | null;
    isAuthenticated: boolean;
    login: (email?: string) => void;
    logout: () => void;
    upgradeToPro: () => void;
    downgradeToFree: () => void;
    decrementCredits: () => boolean; // Returns true if success
    saveGame: (game: Game) => void;
    removeGame: (gameId: string) => void;
    clearGames: () => void;
}

export const useUserStore = create<UserState>()(
    persist(
        (set, get) => ({
            user: null,
            isAuthenticated: false,

            login: (email = 'usuario@exemplo.com') => {
                set({
                    isAuthenticated: true,
                    user: {
                        uid: 'mock-user-123',
                        email,
                        plan: 'FREE',
                        credits: PLANS.FREE.dailyLimit,
                        savedGames: []
                    }
                });
            },

            logout: () => set({ user: null, isAuthenticated: false }),

            upgradeToPro: () => set((state) => ({
                user: state.user ? { ...state.user, plan: 'PRO', credits: 9999 } : null
            })),

            downgradeToFree: () => set((state) => ({
                user: state.user ? { ...state.user, plan: 'FREE', credits: PLANS.FREE.dailyLimit } : null
            })),

            decrementCredits: () => {
                const { user } = get();
                if (!user) return false;
                if (user.plan === 'PRO') return true; // Unlimited

                if (user.credits > 0) {
                    set({ user: { ...user, credits: user.credits - 1 } });
                    return true;
                }
                return false;
            },

            saveGame: (game) => set((state) => ({
                user: state.user ? {
                    ...state.user,
                    savedGames: [...state.user.savedGames, game]
                } : null
            })),

            removeGame: (gameId) => set((state) => ({
                user: state.user ? {
                    ...state.user,
                    savedGames: state.user.savedGames.filter(g => g.id !== gameId)
                } : null
            })),

            clearGames: () => set((state) => ({
                user: state.user ? {
                    ...state.user,
                    savedGames: []
                } : null
            }))
        }),
        {
            name: 'lotomind-user-storage', // local storage key
        }
    )
);
