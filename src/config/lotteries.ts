import type { LotteryConfig, LotteryType } from "../types";

export const LOTTERY_CONFIGS: Record<LotteryType, LotteryConfig> = {
    megasena: {
        name: "Mega Sena",
        slug: "megasena",
        primaryColor: "emerald-500",
        totalNumbers: 60,
        pickedNumbers: 6,
        cols: 10,
        rangeSum: { min: 130, max: 230 },
        balanceEvenOdd: { min: 2, max: 4 },
        maxSequences: 1,
        hasQuadrants: true,
        hasFrame: true
    },
    lotofacil: {
        name: "Lotofácil",
        slug: "lotofacil",
        primaryColor: "purple-500",
        totalNumbers: 25,
        pickedNumbers: 15,
        cols: 5,
        rangeSum: { min: 180, max: 220 }, // Sum of 15 numbers is higher
        balanceEvenOdd: { min: 6, max: 9 }, // Balanced is 7/8 or 8/7
        maxSequences: 4, // Sequences are inevitable in 15/25
        hasQuadrants: false,
        hasFrame: true
    },
    quina: {
        name: "Quina",
        slug: "quina",
        primaryColor: "indigo-600",
        totalNumbers: 80,
        pickedNumbers: 5,
        cols: 10,
        rangeSum: { min: 160, max: 240 },
        balanceEvenOdd: { min: 1, max: 4 },
        maxSequences: 1,
        hasQuadrants: true,
        hasFrame: false
    },
    lotomania: {
        name: "Lotomania",
        slug: "lotomania",
        primaryColor: "orange-500",
        totalNumbers: 100,
        pickedNumbers: 50,
        cols: 10,
        rangeSum: { min: 2100, max: 3000 }, // Huge sum
        balanceEvenOdd: { min: 20, max: 30 },
        maxSequences: 5,
        hasQuadrants: true, // Grid is 10x10
        hasFrame: true
    },
    timemania: {
        name: "Timemania",
        slug: "timemania",
        primaryColor: "yellow-500",
        totalNumbers: 80,
        pickedNumbers: 10,
        cols: 10,
        rangeSum: { min: 300, max: 500 },
        balanceEvenOdd: { min: 3, max: 7 },
        maxSequences: 2,
        hasQuadrants: true,
        hasFrame: true
    },
    duplasena: {
        name: "Dupla Sena",
        slug: "duplasena",
        primaryColor: "red-500",
        totalNumbers: 50,
        pickedNumbers: 6,
        cols: 10,
        rangeSum: { min: 120, max: 190 },
        balanceEvenOdd: { min: 2, max: 4 },
        maxSequences: 1,
        hasQuadrants: true,
        hasFrame: true
    },
    diadesorte: {
        name: "Dia de Sorte",
        slug: "diadesorte",
        primaryColor: "amber-400",
        totalNumbers: 31,
        pickedNumbers: 7,
        cols: 7, // 7 Cols matches days of week feeling? Or standard 10? 31 nums -> 7 cols x 4 rows + 3. 
        rangeSum: { min: 80, max: 150 },
        balanceEvenOdd: { min: 2, max: 5 },
        maxSequences: 2,
        hasQuadrants: false,
        hasFrame: false
    },
    maismilionaria: {
        name: "+Milionária",
        slug: "maismilionaria",
        primaryColor: "teal-600",
        totalNumbers: 50,
        pickedNumbers: 6,
        cols: 10,
        rangeSum: { min: 120, max: 190 },
        balanceEvenOdd: { min: 2, max: 4 },
        maxSequences: 1,
        hasQuadrants: true,
        hasFrame: true,
        hasZones: true,
        zones: [
            { name: "Clover", total: 6, picked: 2 }
        ]
    },
    supersete: {
        name: "Super Sete",
        slug: "supersete",
        primaryColor: "lime-500",
        totalNumbers: 10, // 0-9 per column
        pickedNumbers: 7, // 1 per column (7 columns)
        cols: 1, // Special rendering needed
        rangeSum: { min: 20, max: 50 },
        balanceEvenOdd: { min: 2, max: 5 },
        maxSequences: 0,
        hasQuadrants: false,
        hasFrame: false
    }
};
