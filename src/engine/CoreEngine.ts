import type {
    Game,
    IntelligenceMode,
    MatrixConfig,
    Strategy,
    LotteryConfig,
    GameStats,
    StrategyResult
} from '../types/domain';
import { ALL_STRATEGIES } from './strategies';
import { WheelGenerator } from './matrix/WheelGenerator';

export interface EngineRequest {
    lottery: LotteryConfig;
    mode: IntelligenceMode;
    quantity: number;
    matrixConfig?: MatrixConfig;
    excludedNumbers?: number[];
    fixedNumbers?: number[];
    stats?: GameStats; // Optional: Required for Statistical mode
}

export class CoreEngine {
    private strategies: Strategy[];

    constructor(strategies: Strategy[] = ALL_STRATEGIES) {
        this.strategies = strategies;
    }

    /**
     * Main entry point to generate games
     */
    public generate(request: EngineRequest): Game[] {
        const { lottery, mode, quantity } = request;

        switch (mode) {
            case 'RANDOM':
                // Free Mode: Basic Random + Basic Filters (Sum, Even/Odd)
                return this.generateRandomSmart(lottery, quantity, request.fixedNumbers, request.excludedNumbers);

            case 'STATISTICAL':
                // Pro Mode: Uses Stats (Hot/Cold) + All Filters (Frame, Delta, etc.)
                return this.generateStatistical(lottery, quantity, request.stats, request.fixedNumbers, request.excludedNumbers);

            case 'DELTA':
                return this.generateDelta(lottery, quantity);

            case 'MATRIX':
                if (!request.matrixConfig) throw new Error("Configuração de Matriz necessária.");
                return this.generateMatrix(lottery, request.matrixConfig);

            default:
                return this.generateRandomSmart(lottery, quantity);
        }
    }

    /**
     * Free Mode: Random generation with basic validation (Sum, Even/Odd)
     */
    private generateRandomSmart(
        config: LotteryConfig,
        count: number,
        fixed: number[] = [],
        excluded: number[] = []
    ): Game[] {
        const results: Game[] = [];
        let attempts = 0;
        const MAX_ATTEMPTS = count * 100;

        // Filter out advanced strategies for Free mode, keep only basic ones
        // Assuming 'sum-gauss' and 'parity-balance' are the basic ones
        const basicStrategies = this.strategies.filter(s =>
            s.id === 'sum-gauss' || s.id === 'parity-balance'
        );

        while (results.length < count && attempts < MAX_ATTEMPTS) {
            attempts++;
            const numbers = this.generateRandomNumbers(config, fixed, excluded);
            const score = this.scoreGame(numbers, config, basicStrategies);

            // Basic acceptance: > 50 score
            if (score.totalScore >= 50 && score.strategiesResults.every(r => r.isValid)) {
                results.push(score);
            }
        }

        // Return sorted
        return results.sort((a, b) => b.totalScore - a.totalScore);
    }

    /**
     * Pro Mode: Uses Hot/Cold numbers and checks ALL strategies
     */
    private generateStatistical(
        config: LotteryConfig,
        count: number,
        stats?: GameStats,
        fixed: number[] = [],
        excluded: number[] = []
    ): Game[] {
        const results: Game[] = [];
        let attempts = 0;
        const MAX_ATTEMPTS = count * 200;

        while (results.length < count && attempts < MAX_ATTEMPTS) {
            attempts++;

            // 1. Generate with bias if stats available
            let numbers: number[];

            if (stats && Math.random() > 0.3) {
                // 70% chance to try to use "Hot" numbers for part of the ticket
                numbers = this.generateBiasedNumbers(config, stats, fixed, excluded);
            } else {
                numbers = this.generateRandomNumbers(config, fixed, excluded);
            }

            // 2. Score with ALL strategies
            const score = this.scoreGame(numbers, config, this.strategies);

            // Strict acceptance for Pro: > 75 score
            if (score.totalScore > 75) {
                results.push(score);
            }
        }

        return results.sort((a, b) => b.totalScore - a.totalScore);
    }

    private generateDelta(config: LotteryConfig, count: number): Game[] {
        const deltaStrat = this.strategies.find(s => s.id === 'delta-system');
        if (!deltaStrat || !deltaStrat.generate) throw new Error("Estratégia Delta não encontrada");

        const results: Game[] = [];
        for (let i = 0; i < count; i++) {
            const numbers = deltaStrat.generate(config, 1);
            results.push(this.scoreGame(numbers, config, this.strategies)); // Score with all
        }
        return results.sort((a, b) => b.totalScore - a.totalScore);
    }

    private generateMatrix(config: LotteryConfig, matrix: MatrixConfig): Game[] {
        // Simple matrix: Generate best candidates then wheel
        // If we had stats, we'd pick hot numbers. Without stats, we pick random or from a "good" generated batch.

        const candidates = this.generateRandomNumbers(config, [], [], matrix.totalNumbers); // Generate N unique randoms
        // In real world, candidates should be chosen by the user or by stats. 
        // For automation, let's pick from a batch of high-scoring random numbers?
        // For simplicity: Random pool for now (or User provided in 'fixed' if we supported that for matrix)

        const wheels = WheelGenerator.generate(candidates, config.pickedNumbers, matrix.guarantee);

        return wheels.map(w => this.scoreGame(w, config, this.strategies))
            .sort((a, b) => b.totalScore - a.totalScore);
    }

    private scoreGame(numbers: number[], config: LotteryConfig, activeStrategies: Strategy[]): Game {
        let totalWeight = 0;
        let weightedSum = 0;
        const stratResults: StrategyResult[] = [];

        for (const strat of activeStrategies) {
            if (strat.type === 'FILTER' && strat.validate) {
                const res = strat.validate(numbers, config);
                stratResults.push(res);
                weightedSum += res.score * strat.weight;
                totalWeight += strat.weight;
            }
        }

        const finalScore = totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0;

        return {
            id: crypto.randomUUID(),
            numbers,
            timestamp: Date.now(),
            totalScore: finalScore,
            strategiesResults: stratResults,
            category: finalScore > 90 ? 'SNIPER' : 'BALANCED',
            lotteryType: config.slug
        };
    }

    private generateRandomNumbers(
        config: LotteryConfig,
        fixed: number[] = [],
        excluded: number[] = [],
        sizeOverride?: number
    ): number[] {
        const picked = new Set<number>(fixed);
        const excludeSet = new Set<number>(excluded);
        const targetSize = sizeOverride || config.pickedNumbers;

        if (fixed.length > targetSize) throw new Error("Muitos números fixos.");

        while (picked.size < targetSize) {
            const n = Math.floor(Math.random() * config.totalNumbers) + 1;
            if (!picked.has(n) && !excludeSet.has(n)) {
                picked.add(n);
            }
        }

        return Array.from(picked).sort((a, b) => a - b);
    }

    /**
     * Biased Generation: Tries to include Hot Numbers
     */
    private generateBiasedNumbers(
        config: LotteryConfig,
        stats: GameStats,
        fixed: number[],
        excluded: number[]
    ): number[] {
        const picked = new Set<number>(fixed);
        const excludeSet = new Set<number>(excluded);
        const targetSize = config.pickedNumbers;

        // Try to add 2-3 hot numbers
        const hotPool = stats.hotNumbers.filter(n => !picked.has(n) && !excludeSet.has(n));
        const hotToPick = Math.min(hotPool.length, 3);

        for (let i = 0; i < hotToPick; i++) {
            // Pick random from hot pool
            const idx = Math.floor(Math.random() * hotPool.length);
            picked.add(hotPool[idx]);
            hotPool.splice(idx, 1);
        }

        // Fill rest with random
        while (picked.size < targetSize) {
            const n = Math.floor(Math.random() * config.totalNumbers) + 1;
            if (!picked.has(n) && !excludeSet.has(n)) {
                picked.add(n);
            }
        }

        return Array.from(picked).sort((a, b) => a - b);
    }
}
