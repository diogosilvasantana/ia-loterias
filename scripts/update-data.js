import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_API = "https://loteriascaixa-api.herokuapp.com/api";
const DATA_DIR = path.resolve(__dirname, '../src/data');

// List of lotteries to fetch
// Keys must match LotteryType in types/index.ts
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
    console.log("🚀 Starting Global Data Update...");

    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    for (const lottery of LOTTERIES) {
        await fetchLotteryData(lottery);
    }

    console.log("✅ All updates completed!");
}

async function fetchLotteryData(lottery) {
    const url = `${BASE_API}/${lottery}`;
    const targetFile = path.resolve(DATA_DIR, `${lottery}.json`);

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
            // Mais Milionaria has 'trevos', Super Sete has columns, etc. 
            // We might need to store extra data for complex lotteries?
            // For now, let's store raw 'dezenas' as numbers. 
            // Note: Api returns strings usually.

            // Special handling for Trevos/Month?
            // The Generics expect 'dezenas'. If we need more, we'll strip them or store in 'meta'?
            // Start simple.

            is_virada: isVirada(lottery, item.data)
        }));

        fs.writeFileSync(targetFile, JSON.stringify(cleanedData, null, 2), 'utf-8');
        console.log(`[${lottery}] Saved ${cleanedData.length} records.`);

    } catch (error) {
        console.error(`[${lottery}] ❌ Error:`, error.message);
    }
}

function isVirada(lottery, dateStr) {
    if (lottery === 'megasena' && dateStr.startsWith("31/12")) return true;
    if (lottery === 'lotofacil' && dateStr.startsWith("07/09")) return true; // Independence
    if (lottery === 'quina' && dateStr.startsWith("24/06")) return true; // Sao Joao
    if (lottery === 'duplasena' && (dateStr.startsWith("08/04") || dateStr.startsWith("09/04"))) return true; // Easter (approx)
    return false;
}

updateAllData();
