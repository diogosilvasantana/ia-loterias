import { useUserStore } from '../store/userStore';

export const useAuth = () => {
    const {
        user,
        isAuthenticated,
        login,
        logout,
        upgradeToPro,
        decrementCredits
    } = useUserStore();

    const isPro = user?.plan === 'PRO';
    const credits = user?.credits ?? 0;

    return {
        user,
        isAuthenticated,
        isPro,
        credits,
        login,
        logout,
        upgradeToPro,
        checkLimit: () => {
            if (isPro) return true;
            return credits > 0;
        },
        useCredit: decrementCredits
    };
};
