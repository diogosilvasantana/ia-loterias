export interface LotteryResult {
    concurso: number;
    data: string;
    dezenas: number[];
    is_virada: boolean;
}

export type LotteryType = 'megasena' | 'lotofacil' | 'quina' | 'lotomania' | 'timemania' | 'duplasena' | 'diadesorte' | 'maismilionaria' | 'supersete';

export interface LotteryConfig {
    name: string;
    slug: LotteryType;
    primaryColor: string;
    totalNumbers: number;
    pickedNumbers: number;
    cols: number; // Grid columns for UI
    rangeSum: { min: number, max: number };
    balanceEvenOdd: { min: number, max: number };
    maxSequences: number; // 0 for strict, 1-2 for others
    hasQuadrants: boolean; // Lotofacil/Lotomania don't use strict quadrants same way
    hasFrame: boolean;
    hasZones?: boolean; // For Mais Milionaria
    zones?: {
        name: string;
        total: number;
        picked: number;
    }[];
}


export interface FrequencyMap {
    [number: number]: number;
}

export interface LotteryStats {
    frequencyMap: FrequencyMap;
    hotNumbers: number[];
    recentHotNumbers: number[];
    averageSpacing: number;
    delays: FrequencyMap;
    cycle: number[];
    lastDraw: number[];
    allCombinations: Set<string>; // For rapid global history check
}

export interface Game {
    id: string;
    numbers: number[];
    timestamp: number;
    explanation?: string;
    confidence: number;
    strategy?: 'trend' | 'balanced' | 'surprise';
}
