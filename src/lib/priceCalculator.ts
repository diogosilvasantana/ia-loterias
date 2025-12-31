import type { LotteryType } from '../types/domain';
import { LOTTERY_CONFIGS } from '../config/lotteries';

/**
 * Calculate the price of a single bet
 */
export const calculateBetPrice = (
    lottery: LotteryType,
    numbersCount: number
): number => {
    const config = LOTTERY_CONFIGS[lottery];
    return config.priceTable[numbersCount] || 0;
};

/**
 * Calculate total price for multiple games (syndicate)
 */
export const calculateSyndicatePrice = (
    lottery: LotteryType,
    numbersCount: number,
    gamesCount: number
): number => {
    const singleBetPrice = calculateBetPrice(lottery, numbersCount);
    return singleBetPrice * gamesCount;
};

/**
 * Calculate price per share in a syndicate
 */
export const calculateSharePrice = (
    totalPrice: number,
    sharesCount: number
): number => {
    if (sharesCount === 0) return 0;
    return totalPrice / sharesCount;
};

/**
 * Format price to Brazilian Real
 */
export const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(price);
};

/**
 * Calculate combinations (n choose k) - used for probability calculations
 */
export const calculateCombinations = (n: number, k: number): number => {
    if (k > n) return 0;
    if (k === 0 || k === n) return 1;

    let result = 1;
    for (let i = 1; i <= k; i++) {
        result *= (n - i + 1) / i;
    }
    return Math.round(result);
};

/**
 * Calculate odds of winning with given configuration
 */
export const calculateOdds = (
    lottery: LotteryType,
    numbersCount: number
): { combinations: number; odds: string } => {
    const config = LOTTERY_CONFIGS[lottery];
    const combinations = calculateCombinations(numbersCount, config.pickedNumbers);
    const totalCombinations = calculateCombinations(config.totalNumbers, config.pickedNumbers);

    const odds = `1 em ${Math.round(totalCombinations / combinations).toLocaleString('pt-BR')}`;

    return { combinations, odds };
};
