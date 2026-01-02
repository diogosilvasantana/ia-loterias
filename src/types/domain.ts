export type LotteryType = 'megasena' | 'lotofacil' | 'quina' | 'lotomania' | 'timemania' | 'duplasena' | 'diadesorte' | 'maismilionaria' | 'supersete';

export interface LotteryConfig {
    name: string;
    slug: LotteryType;
    primaryColor: string;
    totalNumbers: number;
    pickedNumbers: number;
    cols: number;
    rangeSum: { min: number, max: number };
    balanceEvenOdd: { min: number, max: number };
    maxSequences: number;
    hasQuadrants: boolean;
    hasFrame: boolean;
    hasZones?: boolean;
    zones?: {
        name: string;
        total: number;
        picked: number;
    }[];
}

export type StrategyType = 'FILTER' | 'GENERATOR';
export type IntelligenceMode = 'RANDOM' | 'STATISTICAL' | 'MATRIX' | 'DELTA';

export interface StrategyResult {
    score: number;
    isValid: boolean;
    reason?: string;
    name: string;
}

export interface Strategy {
    id: string;
    name: string;
    description: string;
    type: StrategyType;
    weight: number;
    validate?: (numbers: number[], config: LotteryConfig) => StrategyResult;
    generate?: (config: LotteryConfig, count: number) => number[];
}

export interface Game {
    id: string;
    numbers: number[];
    timestamp: number;
    totalScore: number;
    strategiesResults: StrategyResult[];
    category: 'SNIPER' | 'BALANCED' | 'RANDOM';
    lotteryType: LotteryType;
}

export interface MatrixConfig {
    id: string;
    name: string;
    totalNumbers: number;
    guarantee: number;
    condition: number; // e.g. "if 5 hit"
}

export interface GameStats {
    frequencyMap: Record<number, number>;
    hotNumbers: number[];
    coldNumbers: number[];
    lastDraw: number[];
    updatedAt: string;
}

export type PlanType = 'FREE' | 'PRO';

export interface SubscriptionPlan {
    type: PlanType;
    name: string;
    dailyLimit: number; // -1 for unlimited
    features: string[];
    price: number;
}

export interface UserProfile {
    uid: string;
    email: string;
    plan: PlanType;
    credits: number;
    savedGames: Game[];
}
