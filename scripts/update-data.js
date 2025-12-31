import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_API = "https://loteriascaixa-api.herokuapp.com/api";
const DATA_DIR = path.resolve(__dirname, '../src/data');

const LOTTERIES = [
    'megasena',
    'lotofacil',
    'quina',
    'lotomania',
    'timemania',
    'duplasena',
    'diadesorte',
    'maismilionaria',
    'supersete'
];

async function updateAllData() {
    console.log("🚀 Starting Global Data Update & Analysis...");

    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    for (const lottery of LOTTERIES) {
        await fetchLotteryData(lottery);
    }

    console.log("✅ All updates and stats calculated!");
}

async function fetchLotteryData(lottery) {
    const url = `${BASE_API}/${lottery}`;
    const targetFile = path.resolve(DATA_DIR, `${lottery}.json`);
    const statsFile = path.resolve(DATA_DIR, `${lottery}-stats.json`);

    console.log(`[${lottery}] Fetching data...`);

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        // Normalize Data
        const cleanedData = data.map(item => ({
            concurso: item.concurso,
            data: item.data,
            dezenas: item.dezenas ? item.dezenas.map(d => parseInt(d, 10)) : [],
            is_virada: isVirada(lottery, item.data)
        }));

        fs.writeFileSync(targetFile, JSON.stringify(cleanedData, null, 2), 'utf-8');
        console.log(`[${lottery}] Saved ${cleanedData.length} records.`);

        // Calculate Stats
        calculateAndSaveStats(lottery, cleanedData, statsFile);

    } catch (error) {
        console.error(`[${lottery}] ❌ Error:`, error.message);
    }
}

function calculateAndSaveStats(lottery, data, filepath) {
    // 1. Last Draw
    const lastDraw = data[0]?.dezenas || [];

    // 2. Frequency (All Time)
    const freqMap = {};
    data.forEach(draw => {
        draw.dezenas.forEach(num => {
            freqMap[num] = (freqMap[num] || 0) + 1;
        });
    });

    // 3. Hot/Cold (Last 20 Draws - Short term trend)
    const recentDraws = data.slice(0, 20);
    const recentFreq = {};
    recentDraws.forEach(draw => {
        draw.dezenas.forEach(num => {
            recentFreq[num] = (recentFreq[num] || 0) + 1;
        });
    });

    const sortedRecent = Object.entries(recentFreq)
        .sort((a, b) => b[1] - a[1]) // Descending
        .map(pair => parseInt(pair[0], 10));

    // Hot: Top 10 from recent
    const hotNumbers = sortedRecent.slice(0, 10);

    // Cold: Numbers that appeared 0 times in recent 20, or lowest frequency
    // (Simplification: Just take bottom from sortedRecent? No, numbers not in recentFreq are coldest)
    // We need to know Total Numbers for the lottery to know missing ones. 
    // We'll stick to 'Least Frequent in Recent' present, or simplified logic.
    // Better: Sort ALL numbers by recent freq.

    // Ideally we'd need config to know range (1-60 etc).
    // Start simple.

    const stats = {
        updatedAt: new Date().toISOString(),
        lastDraw,
        frequencyMap: freqMap,
        hotNumbers,
        coldNumbers: [] // Implement if needed with range info
    };

    fs.writeFileSync(filepath, JSON.stringify(stats, null, 2), 'utf-8');
    console.log(`[${lottery}] 📊 Stats generated.`);
}

function isVirada(lottery, dateStr) {
    if (lottery === 'megasena' && dateStr.startsWith("31/12")) return true;
    if (lottery === 'lotofacil' && dateStr.startsWith("07/09")) return true;
    if (lottery === 'quina' && dateStr.startsWith("24/06")) return true;
    if (lottery === 'duplasena' && (dateStr.startsWith("08/04") || dateStr.startsWith("09/04"))) return true;
    return false;
}

updateAllData();
