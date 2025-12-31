import type { Strategy, StrategyResult, LotteryConfig } from '../../types/domain';

export const FrameStrategy: Strategy = {
    id: 'frame-border',
    name: 'Moldura',
    description: 'Verifica quantos números estão na borda do volante.',
    type: 'FILTER',
    weight: 6,
    validate: (numbers: number[], config: LotteryConfig): StrategyResult => {
        if (!config.hasFrame) {
            return { score: 100, isValid: true, name: 'Moldura', reason: 'N/A' };
        }

        const { cols, totalNumbers, pickedNumbers } = config;
        const rows = Math.ceil(totalNumbers / cols);

        const isFrame = (n: number) => {
            // 1-indexed numbers
            if (n <= cols) return true; // First row
            if (n > (rows - 1) * cols) return true; // Last row
            if (n % cols === 1 || n % cols === 0) return true; // First or Lats column
            return false;
        };

        const frameCount = numbers.filter(n => isFrame(n)).length;

        // Heuristics for Frame (Approximate good range ~40-60% of picked numbers usually?)
        // This varies a lot by lottery. 
        // MegaSena (6 picks): Usually 2-4 on frame.
        // Lotofacil (15 picks): Usually 8-11 on frame.

        // We could add this to config, but let's approximate dynamically for now
        // or hardcode based on common knowledge if needed.

        let minF = 0, maxF = 0;

        if (config.slug === 'megasena') {
            minF = 1; maxF = 4; // Refinement
        } else if (config.slug === 'lotofacil') {
            minF = 8; maxF = 11;
        } else {
            // fallback generic 30-70%
            minF = Math.floor(pickedNumbers * 0.3);
            maxF = Math.ceil(pickedNumbers * 0.7);
        }

        if (frameCount >= minF && frameCount <= maxF) {
            return {
                score: 100,
                isValid: true,
                name: 'Moldura',
                reason: `${frameCount} na moldura. (Ideal: ${minF}-${maxF})`
            };
        }

        return {
            score: 50,
            isValid: true, // It's not a hard failure usually
            name: 'Moldura',
            reason: `${frameCount} na moldura. Fora do ideal (${minF}-${maxF}).`
        };
    }
};
