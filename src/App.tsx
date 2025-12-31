import { Header } from "./components/Header";
import { GeneratorCard } from "./components/GeneratorCard";
import { StatsView } from "./components/StatsView";
import { GameList } from "./components/GameList";
import { LotterySelector } from "./components/LotterySelector";
import { useLotteryEngine } from "./hooks/useLotteryEngine";

function App() {
  const {
    stats,
    games,
    isGenerating,
    generateNewGame,
    clearHistory,
    removeGame,
    selectedLottery,
    setSelectedLottery,
    config
  } = useLotteryEngine();

  // Dynamic Background Color based on Config
  // Since we can't use dynamic string interpolation reliably for Tailwind classes like `bg-${config.primaryColor}/10`,
  // we can use a style object or lookups.
  // Or simply rely on the fact that `primaryColor` format is `color-shade` e.g. `emerald-500`.
  // We can convert `emerald-500` to `emerald` for the bg gradient?
  // Let's use inline styles for the crucial big gradient to be safe.

  // Actually, Shadcn/Tailwind recommendation for dynamic values: use CSS variables or style.
  // Let's try to map the primary color name (emerald, purple) to a class.
  const colorName = config.primaryColor.split('-')[0]; // emerald, purple, etc.

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-${colorName}-500/30`}>
      {/* Background Ambience - Dynamic */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,_#0f172a_0%,_#020617_100%)] -z-20" />
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 -z-10 mix-blend-soft-light" />

      {/* The Glow */}
      <div
        className={`fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-${colorName}-500/10 blur-[100px] rounded-full pointer-events-none -z-10 transition-colors duration-1000`}
      // Fallback style if class `bg-${colorName}-500/10` is purged
      // style={{ backgroundColor: `var(--color-${colorName}-500)` }} // simplified
      />

      <main className="container mx-auto max-w-5xl px-4 pb-20 pt-8 md:pt-12">
        <Header />

        {/* Lottery Selector */}
        <div className="mt-6 mb-8 flex justify-center">
          <LotterySelector
            selected={selectedLottery}
            onSelect={setSelectedLottery}
          />
        </div>

        <div className="space-y-8">
          {/* Stats is optional/hidden if empty? Or just show zeroes? */}
          {stats && <StatsView stats={stats} />}

          <GeneratorCard
            onGenerate={generateNewGame}
            isGenerating={isGenerating}
            config={config}
          />

          <GameList
            games={games}
            onClear={clearHistory}
            onRemove={removeGame}
            config={config}
          />
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 py-4 text-center text-xs text-slate-600 bg-slate-950/80 backdrop-blur border-t border-slate-900">
        <p>LotoMind AI • Probabilidade Teórica ({config.name}) • Jogue com Moderação</p>
      </footer>
    </div>
  );
}

export default App;
