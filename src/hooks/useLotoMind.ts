import { useState, useCallback } from 'react';
import { CoreEngine } from '../engine/CoreEngine';
import type { GameScore, IntelligenceMode, MatrixConfig } from '../types/engine';
import type { LotteryConfig } from '../types';
import { useStore } from '../store';

// Initialize engine once (singleton behavior for now)
const engine = new CoreEngine();

interface UseLotoMindProps {
    lottery: LotteryConfig;
}

export const useLotoMind = ({ lottery }: UseLotoMindProps) => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedGames, setGeneratedGames] = useState<GameScore[]>([]);
    const [error, setError] = useState<string | null>(null);

    const { credits, isPro, removeCredits } = useStore();

    const generate = useCallback(async (
        mode: IntelligenceMode,
        quantity: number,
        matrixConfig?: MatrixConfig,
        fixedNumbers: number[] = [],
        excludedNumbers: number[] = []
    ) => {
        setIsGenerating(true);
        setError(null);
        setGeneratedGames([]);

        // SaaS Constraints
        const isProFeature = mode === 'MATRIX' || mode === 'DELTA' || mode === 'EXCLUSION';
        if (isProFeature && !isPro) {
            setError("Funcionalidade exclusiva para usuários PRO.");
            setIsGenerating(false);
            return;
        }

        if (credits < 1) {
            setError("Créditos insuficientes.");
            setIsGenerating(false);
            return;
        }

        try {
            // Simulate Async for UI effect (and not blocking main thread too hard if we used workers, 
            // but here it's sync. We can wrap in minimal timeout to let UI update).
            await new Promise(resolve => setTimeout(resolve, 500));

            const results = engine.generate({
                lottery,
                mode,
                quantity,
                matrixConfig,
                fixedNumbers,
                excludedNumbers
            });

            setGeneratedGames(results);
            removeCredits(1); // Consume credit per generation batch
        } catch (err) {
            console.error(err);
            setError("Erro ao gerar jogos. Tente novamente.");
        } finally {
            setIsGenerating(false);
        }
    }, [lottery, credits, isPro, removeCredits]);

    return {
        isGenerating,
        generatedGames,
        error,
        generate,
        isPro,
        credits
    };
};
