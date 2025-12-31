import type { LotteryConfig, LotteryType } from "../types/domain";

export interface PriceTable {
    [numbers: number]: number; // number of picks -> price in BRL
}

export interface LotteryConfigWithPricing extends LotteryConfig {
    priceTable: PriceTable;
    minNumbers: number;
    maxNumbers: number;
}

export const LOTTERY_CONFIGS: Record<LotteryType, LotteryConfigWithPricing> = {
    megasena: {
        name: "Mega Sena",
        slug: "megasena",
        primaryColor: "emerald-600",
        totalNumbers: 60,
        pickedNumbers: 6,
        minNumbers: 6,
        maxNumbers: 15,
        cols: 10,
        rangeSum: { min: 130, max: 230 },
        balanceEvenOdd: { min: 2, max: 4 },
        maxSequences: 1,
        hasQuadrants: true,
        hasFrame: true,
        priceTable: {
            6: 5.00,
            7: 35.00,
            8: 140.00,
            9: 420.00,
            10: 1050.00,
            11: 2310.00,
            12: 4620.00,
            13: 8580.00,
            14: 15015.00,
            15: 25025.00
        }
    },
    lotofacil: {
        name: "Lotofácil",
        slug: "lotofacil",
        primaryColor: "purple-600",
        totalNumbers: 25,
        pickedNumbers: 15,
        minNumbers: 15,
        maxNumbers: 20,
        cols: 5,
        rangeSum: { min: 180, max: 220 },
        balanceEvenOdd: { min: 6, max: 9 },
        maxSequences: 4,
        hasQuadrants: false,
        hasFrame: true,
        priceTable: {
            15: 3.00,
            16: 48.00,
            17: 408.00,
            18: 2448.00,
            19: 11628.00,
            20: 46512.00
        }
    },
    quina: {
        name: "Quina",
        slug: "quina",
        primaryColor: "indigo-600",
        totalNumbers: 80,
        pickedNumbers: 5,
        minNumbers: 5,
        maxNumbers: 15,
        cols: 10,
        rangeSum: { min: 160, max: 240 },
        balanceEvenOdd: { min: 1, max: 4 },
        maxSequences: 1,
        hasQuadrants: true,
        hasFrame: false,
        priceTable: {
            5: 2.50,
            6: 15.00,
            7: 52.50,
            8: 140.00,
            9: 315.00,
            10: 630.00,
            11: 1155.00,
            12: 1980.00,
            13: 3217.50,
            14: 5005.00,
            15: 7507.50
        }
    },
    lotomania: {
        name: "Lotomania",
        slug: "lotomania",
        primaryColor: "orange-600",
        totalNumbers: 100,
        pickedNumbers: 50,
        minNumbers: 50,
        maxNumbers: 50, // Lotomania is fixed at 50
        cols: 10,
        rangeSum: { min: 2100, max: 3000 },
        balanceEvenOdd: { min: 20, max: 30 },
        maxSequences: 5,
        hasQuadrants: true,
        hasFrame: true,
        priceTable: {
            50: 3.00
        }
    },
    diadesorte: {
        name: "Dia de Sorte",
        slug: "diadesorte",
        primaryColor: "amber-600",
        totalNumbers: 31,
        pickedNumbers: 7,
        minNumbers: 7,
        maxNumbers: 15,
        cols: 7,
        rangeSum: { min: 80, max: 150 },
        balanceEvenOdd: { min: 2, max: 5 },
        maxSequences: 2,
        hasQuadrants: false,
        hasFrame: false,
        priceTable: {
            7: 2.50,
            8: 20.00,
            9: 90.00,
            10: 300.00,
            11: 825.00,
            12: 1980.00,
            13: 4290.00,
            14: 8580.00,
            15: 16016.00
        }
    },
    timemania: {
        name: "Timemania",
        slug: "timemania",
        primaryColor: "yellow-600",
        totalNumbers: 80,
        pickedNumbers: 10,
        minNumbers: 10,
        maxNumbers: 10, // Timemania is fixed at 10
        cols: 10,
        rangeSum: { min: 300, max: 500 },
        balanceEvenOdd: { min: 3, max: 7 },
        maxSequences: 2,
        hasQuadrants: true,
        hasFrame: true,
        priceTable: {
            10: 3.50
        }
    },
    duplasena: {
        name: "Dupla Sena",
        slug: "duplasena",
        primaryColor: "red-600",
        totalNumbers: 50,
        pickedNumbers: 6,
        minNumbers: 6,
        maxNumbers: 15,
        cols: 10,
        rangeSum: { min: 120, max: 190 },
        balanceEvenOdd: { min: 2, max: 4 },
        maxSequences: 1,
        hasQuadrants: true,
        hasFrame: true,
        priceTable: {
            6: 2.50,
            7: 17.50,
            8: 70.00,
            9: 210.00,
            10: 525.00,
            11: 1155.00,
            12: 2310.00,
            13: 4290.00,
            14: 7507.50,
            15: 12512.50
        }
    },
    maismilionaria: {
        name: "+Milionária",
        slug: "maismilionaria",
        primaryColor: "teal-600",
        totalNumbers: 50,
        pickedNumbers: 6,
        minNumbers: 6,
        maxNumbers: 12,
        cols: 10,
        rangeSum: { min: 120, max: 190 },
        balanceEvenOdd: { min: 2, max: 4 },
        maxSequences: 1,
        hasQuadrants: true,
        hasFrame: true,
        hasZones: true,
        zones: [
            { name: "Trevo", total: 6, picked: 2 }
        ],
        priceTable: {
            6: 6.00,
            7: 42.00,
            8: 168.00,
            9: 504.00,
            10: 1260.00,
            11: 2772.00,
            12: 5544.00
        }
    },
    supersete: {
        name: "Super Sete",
        slug: "supersete",
        primaryColor: "lime-600",
        totalNumbers: 10,
        pickedNumbers: 7,
        minNumbers: 7,
        maxNumbers: 7, // Super Sete is fixed
        cols: 1,
        rangeSum: { min: 20, max: 50 },
        balanceEvenOdd: { min: 2, max: 5 },
        maxSequences: 0,
        hasQuadrants: false,
        hasFrame: false,
        priceTable: {
            7: 2.50
        }
    }
};

// Helper to get available number options for a lottery
export const getNumberOptions = (lotteryType: LotteryType): number[] => {
    const config = LOTTERY_CONFIGS[lotteryType];
    const options: number[] = [];
    for (let i = config.minNumbers; i <= config.maxNumbers; i++) {
        if (config.priceTable[i] !== undefined) {
            options.push(i);
        }
    }
    return options;
};

// Helper to get price for specific configuration
export const getLotteryPrice = (lotteryType: LotteryType, numbersCount: number): number => {
    const config = LOTTERY_CONFIGS[lotteryType];
    return config.priceTable[numbersCount] || 0;
};
