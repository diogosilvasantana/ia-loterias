import { useState, useEffect, useCallback } from "react";
import type { Game, LotteryResult, LotteryStats, LotteryType } from "../types";
import { LOTTERY_CONFIGS } from "../config/lotteries";
import { analyzeHistory } from "../services/analyzer";
import { generateGame } from "../services/generator";

export const useLotteryEngine = () => {
    const [selectedLottery, setSelectedLottery] = useState<LotteryType>('megasena');
    const [stats, setStats] = useState<LotteryStats | null>(null);
    const [games, setGames] = useState<Game[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);

    // Load data/stats whenever selected lottery changes
    useEffect(() => {
        const loadData = async () => {
            try {
                // Dynamic Import (Vite/Webpack handles this if path is constructible)
                // Note: For Vite, glob import is preferred usually, but simple template string 
                // often works if files are in unknown static location. 
                // However, safe way is using a map or switch if dynamic import fails during build analysis.
                // Let's try dynamic import first.
                // NOTE: We need to assert the path clearly for the bundler.
                const module = await import(`../data/${selectedLottery}.json`);

                const history = module.default as LotteryResult[];
                const computedStats = analyzeHistory(history);
                setStats(computedStats);

            } catch (error) {
                console.warn(`Could not load data for ${selectedLottery}:`, error);
                // Fallback: Empty Stats (Math Only)
                setStats({
                    frequencyMap: {},
                    hotNumbers: [],
                    recentHotNumbers: [],
                    averageSpacing: 0,
                    delays: {},
                    cycle: [],
                    lastDraw: [],
                    allCombinations: new Set()
                });
            }

            // Clear current games list when switching lottery type
            setGames([]);
        };

        loadData();
    }, [selectedLottery]);

    const generateNewGame = useCallback((quantity: number = 1) => {
        if (!stats) return;

        setIsGenerating(true);
        const config = LOTTERY_CONFIGS[selectedLottery];

        setTimeout(() => {
            const newGames: Game[] = [];

            for (let i = 0; i < quantity; i++) {
                let strategy: 'balanced' | 'trend' | 'surprise' = 'balanced';

                if (quantity === 10) {
                    if (i < 5) strategy = 'balanced';
                    else if (i < 8) strategy = 'trend';
                    else strategy = 'surprise';
                }

                const { numbers, explanation, confidence } = generateGame(stats, config, strategy);

                newGames.push({
                    id: crypto.randomUUID(),
                    numbers: numbers,
                    timestamp: Date.now(),
                    explanation,
                    confidence,
                    strategy
                });
            }

            setGames((prev) => [...newGames, ...prev]);
            setIsGenerating(false);
        }, 800);
    }, [stats, selectedLottery]);

    const clearHistory = useCallback(() => {
        setGames([]);
    }, []);

    const removeGame = useCallback((id: string) => {
        setGames((prev) => prev.filter((g) => g.id !== id));
    }, []);

    return {
        selectedLottery,
        setSelectedLottery,
        config: LOTTERY_CONFIGS[selectedLottery],
        stats,
        games,
        isGenerating,
        generateNewGame,
        clearHistory,
        removeGame,
    };
};
