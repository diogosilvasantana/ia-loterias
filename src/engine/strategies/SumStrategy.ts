import type { Strategy, StrategyResult, LotteryConfig } from '../../types/domain';

export const SumStrategy: Strategy = {
    id: 'sum-gauss',
    name: 'Soma de Gauss',
    description: 'Verifica se a soma das dezenas está dentro do intervalo estatístico padrão.',
    type: 'FILTER',
    weight: 8,
    validate: (numbers: number[], config: LotteryConfig): StrategyResult => {
        const sum = numbers.reduce((a, b) => a + b, 0);
        const { min, max } = config.rangeSum;

        // Check strict range from config
        // We can add a "tolerance" or just use the config rigid limits.
        // Let's assume config limits are the "ideal" range.

        // Ideal range gives 100 score.
        // If it's slightly off but acceptable, lower score.
        // If it's way off, 0 score.

        // For now, simple implementation:
        const inRange = sum >= min && sum <= max;

        if (inRange) {
            return {
                score: 100,
                isValid: true,
                name: 'Soma de Gauss',
                reason: `Soma ${sum} está no intervalo ideal (${min}-${max}).`
            };
        }

        // Calculate distance penalty
        const dist = sum < min ? min - sum : sum - max;
        const penalty = Math.min(100, dist * 2); // 2 points per unit off

        return {
            score: Math.max(0, 100 - penalty),
            isValid: penalty < 50, // Allow some deviation
            name: 'Soma de Gauss',
            reason: `Soma ${sum} fora do intervalo ideal (${min}-${max}).`
        };
    }
};
