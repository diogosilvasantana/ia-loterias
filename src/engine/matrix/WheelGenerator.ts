// MatrixConfig type is defined in domain.ts but not used in this file

/**
 * WheelGenerator (Gerador de Fechamentos)
 * 
 * Generates a set of games that guarantee a certain number of hits (Guarantee)
 * if a condition is met (Condition).
 * 
 * Example: Select 10 numbers. Guarantee 4 (Quadra) if Hit 6 (Mega).
 */
export class WheelGenerator {

    /**
     * Generates combinations (n choose k)
     */
    static *combine(source: number[], comboLength: number): Generator<number[]> {
        const sourceLen = source.length;

        // Headless recursion to generator
        // Or simple iterative
        if (comboLength > sourceLen || comboLength <= 0) return;

        // Initial indices
        const indices = Array.from({ length: comboLength }, (_, i) => i);

        yield indices.map(i => source[i]);

        while (true) {
            let i = comboLength - 1;
            while (i >= 0 && indices[i] === sourceLen - comboLength + i) {
                i--;
            }
            if (i < 0) break;

            indices[i]++;
            for (let j = i + 1; j < comboLength; j++) {
                indices[j] = indices[j - 1] + 1;
            }
            yield indices.map(idx => source[idx]);
        }
    }

    /**
     * Generates a Wheel (Fechamento)
     * Uses a Greedy Algorithm to find minimal cover.
     * 
     * WARNING: For large N, this is computationally expensive.
     * Optimized for client-side usage with safeguards.
     */
    static generate(selectedNumbers: number[], pickSize: number, guarantee: number): number[][] {
        // If we select same amount as pickSize, return 1 game
        if (selectedNumbers.length === pickSize) {
            return [selectedNumbers.sort((a, b) => a - b)];
        }

        // 1. Generate ALL possible winning combinations (The "Condition")
        // e.g. If specific condition not passed, usually we assume condition = pickSize (Hit 6 in 6).
        // The Guarantee is based on if we hit `pickSize` numbers among `selectedNumbers`.

        // But "Closing" logic usually is:
        // We want to cover all K-subsets of SelectedNumbers such that each T-subset is covered.
        // Mathematical notation: C(v, k, t, m)
        // v = selectedNumbers.length
        // k = pickSize (ticket size)
        // t = guarantee (match guarantee)
        // m = condition (balls drawn) - usually same as k for standard wheels, or user specified.

        // Simplified Greedy Approach:
        // We want to cover all tuples of size 'guarantee' present in 'selectedNumbers'.
        // Every time we add a ticket (size 'pickSize'), we cross off the 'guarantee'-tuples covered by it.
        // Repeat until all 'guarantee'-tuples are covered.

        const allGames: number[][] = [];

        // Optimization: If guarantee is low (e.g. 4), we map all quartets.
        // If selectedNumbers is large (e.g. 20), C(20, 4) = 4845 tuples to cover.
        // We pick games of size 6. C(6, 4) = 15 coverage per game.
        // Approx games = 4845 / 15 = 323. Feasible for JS.

        if (selectedNumbers.length > 25) {
            throw new Error("Para performance no navegador, limite a matriz a 25 números.");
        }

        // Generate all target tuples (what we need to guarantee)
        const tuplesToCover = new Set<string>();
        for (const tuple of this.combine(selectedNumbers, guarantee)) {
            tuplesToCover.add(tuple.join(','));
        }

        // Candidate generation is tricky. We can try random greedy or iterate all possible games.
        // Iterating all possible games C(20, 6) = 38,760. Feasible.

        const possibleGames = Array.from(this.combine(selectedNumbers, pickSize));

        // Greedy selection
        while (tuplesToCover.size > 0 && possibleGames.length > 0) {
            // Find the game that covers the MOST remaining tuples
            let bestGameIndex = -1;
            let maxCovered = -1;
            let bestCoveredTuples: string[] = [];

            // Sampling optimization: check random subset of possibleGames if too large
            // For precision, check all.

            for (let i = 0; i < possibleGames.length; i++) {
                const game = possibleGames[i];

                // Count how many tuples this game covers
                // A game covers C(pickSize, guarantee) tuples.
                // We only care about those still in tuplesToCover.

                let coveredCount = 0;
                const currentCovered: string[] = [];

                for (const t of this.combine(game, guarantee)) {
                    const key = t.join(',');
                    if (tuplesToCover.has(key)) {
                        coveredCount++;
                        currentCovered.push(key);
                    }
                }

                if (coveredCount > maxCovered) {
                    maxCovered = coveredCount;
                    bestGameIndex = i;
                    bestCoveredTuples = currentCovered;
                }
            }

            if (bestGameIndex !== -1 && maxCovered > 0) {
                // Add best game
                allGames.push(possibleGames[bestGameIndex]);

                // Remove covered tuples
                for (const t of bestCoveredTuples) {
                    tuplesToCover.delete(t);
                }

                // Optimization: Remove used game? Yes.
                possibleGames.splice(bestGameIndex, 1);
            } else {
                // Cannot cover more? Or done?
                break;
            }
        }

        return allGames;
    }
}
