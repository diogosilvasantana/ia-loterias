import { useState, useCallback } from 'react';
import { CoreEngine } from '../engine/CoreEngine';
import type { Game, IntelligenceMode, MatrixConfig, LotteryConfig } from '../types/domain';
import { useAuth } from '../hooks/useAuth';

// Singleton Engine
const engine = new CoreEngine();

interface UseLotoMindProps {
    lottery: LotteryConfig;
}

export const useLotoMind = ({ lottery }: UseLotoMindProps) => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedGames, setGeneratedGames] = useState<Game[]>([]);
    const [error, setError] = useState<string | null>(null);

    // Use our new Auth hook
    const { credits, isPro, useCredit } = useAuth();

    const generate = useCallback(async (
        mode: IntelligenceMode,
        quantity: number,
        matrixConfig?: MatrixConfig, // ID or object? We probably need to pass full config object from UI
        fixedNumbers: number[] = [],
        excludedNumbers: number[] = []
    ) => {
        setIsGenerating(true);
        setError(null);
        setGeneratedGames([]);

        // SaaS Constraints
        const isProFeature = mode === 'STATISTICAL' || mode === 'MATRIX' || mode === 'DELTA';
        if (isProFeature && !isPro) {
            setError("Funcionalidade exclusiva para usuários PRO.");
            setIsGenerating(false);
            return;
        }

        if (credits < 1 && !isPro) {
            setError("Créditos insuficientes.");
            setIsGenerating(false);
            return;
        }

        try {
            // Fake Async for UX
            await new Promise(resolve => setTimeout(resolve, 600));

            const results = engine.generate({
                lottery,
                mode,
                quantity,
                matrixConfig,
                fixedNumbers,
                excludedNumbers,
                // stats: ... // We need to pass stats here if we want Statistical mode to work fully
                // For now, we omit stats, engine will run purely random or simple bias
            });

            setGeneratedGames(results);
            useCredit(); // Deduct credit
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Erro ao gerar jogos.");
        } finally {
            setIsGenerating(false);
        }
    }, [lottery, credits, isPro, useCredit]);

    return {
        isGenerating,
        generatedGames,
        error,
        generate,
        isPro,
        credits
    };
};
