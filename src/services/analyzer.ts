import type { LotteryResult, LotteryStats, FrequencyMap } from "../types";

export const analyzeHistory = (history: LotteryResult[]): LotteryStats => {
    const frequencyMap: FrequencyMap = {};

    // Initialize all numbers 1-60 with 0
    for (let i = 1; i <= 60; i++) {
        frequencyMap[i] = 0;
    }

    // Count frequencies
    history.forEach((result) => {
        result.dezenas.forEach((num) => {
            if (frequencyMap[num] !== undefined) {
                frequencyMap[num]++;
            }
        });
    });

    // Determine hot numbers (sort by frequency descending)
    const sortedNumbers = Object.entries(frequencyMap)
        .sort(([, freqA], [, freqB]) => freqB - freqA)
        .map(([num]) => parseInt(num));

    // Top 10 hot numbers
    const hotNumbers = sortedNumbers.slice(0, 10);

    // Recent Hot Numbers (Last 20 draws)
    const recentFrequency: FrequencyMap = {};
    const recentHistory = history.slice(-20); // Assuming history is sorted oldest to newest

    recentHistory.forEach((result) => {
        result.dezenas.forEach((num) => {
            recentFrequency[num] = (recentFrequency[num] || 0) + 1;
        });
    });

    const sortedRecent = Object.entries(recentFrequency)
        .sort(([, freqA], [, freqB]) => freqB - freqA)
        .map(([num]) => parseInt(num));

    // Top 10 recent hot numbers
    const recentHotNumbers = sortedRecent.slice(0, 10);

    // Calculate Average Spacing
    let totalSpacing = 0;
    let totalGames = 0;

    history.forEach((result) => {
        const sorted = [...result.dezenas].sort((a, b) => a - b);
        let gameSpacingSum = 0;
        for (let i = 0; i < sorted.length - 1; i++) {
            gameSpacingSum += (sorted[i + 1] - sorted[i]);
        }
        totalSpacing += (gameSpacingSum / 5); // Average spacing in this game
        totalGames++;
    });

    const averageSpacing = totalGames > 0 ? totalSpacing / totalGames : 10; // Default approx 10

    // Build Global History Set for O(1) Access
    // Store as sorted string "n1-n2-n3-n4-n5-n6"
    const allCombinations = new Set<string>();
    history.forEach(result => {
        // results.dezenas might not be sorted in source JSON, ensure sort
        const sorted = [...result.dezenas].sort((a, b) => a - b);
        allCombinations.add(sorted.join('-'));
    });

    // Calculate Delays
    const delays: FrequencyMap = {};
    const lastAppearance: FrequencyMap = {};
    const totalDraws = history.length;

    // Initialize delays with totalDraws (worst case: never appeared)
    for (let i = 1; i <= 60; i++) delays[i] = totalDraws;

    // Iterate history to find last appearance
    // History is assumed to be chronological (oldest to newest) or we use the 'concurso' field check
    // Assuming history from input is valid. Let's traverse backwards for efficiency?
    // Actually, traversing forwards updates the "last seen" index.
    history.forEach((result, index) => {
        result.dezenas.forEach(num => {
            lastAppearance[num] = index;
        });
    });

    // Calculate delay relative to the last game (totalDraws - 1 - lastIndex)
    for (let i = 1; i <= 60; i++) {
        if (lastAppearance[i] !== undefined) {
            delays[i] = totalDraws - 1 - lastAppearance[i];
        } else {
            // Never appeared, delay is full history
            delays[i] = totalDraws;
        }
    }

    // Analyze Cycle
    // A cycle ends when all 60 numbers have been drawn.
    // We want to know the *current* open cycle numbers (those NOT yet drawn since the last cycle close).

    // We need to simulate cycles from the beginning? That's heavy.
    // Optimization: Look backwards. The current cycle contains numbers that have appeared since the "start of the cycle".
    // Wait, the standard definition is: Cycle is the set of numbers required to complete the full 60 set.
    // The "Cycle" metric usually lists the numbers MISSING to close the current cycle.
    // Let's find the start of the current cycle. Check backwards until we find a point where (going forward) all 60 numbers were drawn? No.
    // Easier: Track drawn numbers from the end backwards? No.

    // Correct Algorithm:
    // Iterate from Game 1. Track set of drawn numbers. When size == 60, clear set, start new cycle.
    // The "Current Cycle" is the set of numbers NOT YET in the current accumulating set.
    let drawnInCycle = new Set<number>();

    // To be precise we should iterate all. 3000 games is fast for JS.
    for (const result of history) {
        result.dezenas.forEach(num => drawnInCycle.add(num));
        if (drawnInCycle.size === 60) {
            drawnInCycle.clear(); // Cycle closed, start new
        }
    }

    // The numbers missing from drawnInCycle are the ones we want
    const missingInCycle: number[] = [];
    for (let i = 1; i <= 60; i++) {
        if (!drawnInCycle.has(i)) {
            missingInCycle.push(i);
        }
    }

    return {
        frequencyMap,
        hotNumbers,
        recentHotNumbers,
        averageSpacing,
        delays,
        cycle: missingInCycle,
        lastDraw: history[history.length - 1].dezenas,
        allCombinations
    };
};
