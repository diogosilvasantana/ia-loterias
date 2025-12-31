import type { Strategy, StrategyResult } from '../../types/engine';
import type { LotteryConfig } from '../../types';

export const ParityStrategy: Strategy = {
    id: 'parity-balance',
    name: 'Equilíbrio Par/Ímpar',
    description: 'Analisa a proporção de números pares e ímpares.',
    type: 'FILTER',
    weight: 7,
    validate: (numbers: number[], config: LotteryConfig): StrategyResult => {
        const evenCount = numbers.filter(n => n % 2 === 0).length;
        // oddCount is total - evenCount

        const { min, max } = config.balanceEvenOdd;

        if (evenCount >= min && evenCount <= max) {
            return {
                score: 100,
                isValid: true,
                name: 'Equilíbrio Par/Ímpar',
                reason: `${evenCount} pares (Intervalo: ${min}-${max}).`
            };
        }

        return {
            score: 40,
            isValid: false,
            name: 'Equilíbrio Par/Ímpar',
            reason: `${evenCount} pares. Ideal entre ${min} e ${max}.`
        };
    }
};
