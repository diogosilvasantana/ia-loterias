import { Sparkles } from "lucide-react";

export const Header = () => {
    return (
        <header className="flex flex-col items-center justify-center py-8 px-4 text-center">
            <div className="flex items-center gap-3 mb-2 relative">
                <div className="absolute inset-0 blur-2xl bg-emerald-500/20 rounded-full" />
                <Sparkles className="w-10 h-10 text-emerald-400 relative z-10" />
                <h1 className="relative z-10 text-5xl md:text-7xl font-extrabold tracking-tighter bg-gradient-to-r from-emerald-400 via-emerald-200 to-amber-200 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]">
                    Mega Virada AI
                </h1>
            </div>
            <p className="text-slate-400 text-sm md:text-lg max-w-lg font-medium tracking-wide">
                Motor estatístico avançado para geração de jogos
            </p>
        </header>
    );
};
