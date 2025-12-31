import type { LotteryResult } from "../types";

interface ApiLotteryResult {
    concurso: number;
    data: string;
    dezenas: string[];
}

export const fetchLotteryResults = async (): Promise<LotteryResult[]> => {
    try {
        const response = await fetch("https://loteriascaixa-api.herokuapp.com/api/megasena");
        if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.statusText}`);
        }

        // The API returns an array of objects
        const data: ApiLotteryResult[] = await response.json();

        // Adapt to our internal LotteryResult format
        return data.map((item) => {
            // Convert string array ["01", "02"] to number array [1, 2]
            const dezenas = item.dezenas.map((d) => parseInt(d, 10));

            // Infer if it's a "Virada" game (Mega da Virada)
            // Mega da Virada always happens on Dec 31st
            const isVirada = item.data.includes("/12/") && item.data.startsWith("31");

            return {
                concurso: item.concurso,
                data: item.data,
                dezenas,
                is_virada: isVirada
            };
        });
    } catch (error) {
        console.error("Error fetching lottery results:", error);
        throw error;
    }
};
