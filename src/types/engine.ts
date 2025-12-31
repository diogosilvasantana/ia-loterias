import type { LotteryConfig } from './index';

export interface StrategyResult {
    score: number; // 0 to 100
    isValid: boolean;
    reason?: string;
    name: string; // Name of the strategy involved
}

export interface Strategy {
    id: string;
    name: string;
    description: string;
    type: 'FILTER' | 'GENERATOR'; // Filter checks validity, Generator creates numbers
    weight: number; // Importance of this strategy in the final score (1-10)

    // Method to validate a game (returns score/validity)
    validate?: (numbers: number[], config: LotteryConfig) => StrategyResult;

    // Method to generate numbers (optional, for specific generators like Delta)
    generate?: (config: LotteryConfig, count: number) => number[];
}

export interface GameScore {
    numbers: number[];
    totalScore: number;
    strategiesResults: StrategyResult[];
    category: 'SNIPER' | 'BALANCED' | 'RANDOM';
}

export interface MatrixConfig {
    totalNumbers: number; // How many numbers to select from (e.g., 10 best numbers)
    guarantee: number; // Guarantee X hits (e.g., Quadra = 4)
    condition: number; // If Y numbers match (e.g., if 6 drawn numbers are within the 10 selected)
}

export type IntelligenceMode = 'SNIPER' | 'DELTA' | 'EXCLUSION' | 'FIXED' | 'MATRIX';
