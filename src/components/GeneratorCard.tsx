import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Sparkles, Loader2 } from "lucide-react";
import { useState } from "react";
import type { LotteryConfig } from "../types";

// Update Props
interface GeneratorCardProps {
    onGenerate: (quantity: number) => void;
    isGenerating: boolean;
    config: LotteryConfig;
}

export const GeneratorCard = ({ onGenerate, isGenerating, config }: GeneratorCardProps) => {
    const [quantity, setQuantity] = useState(1);

    // Extract base color name for simpler tailwind classes if possible, 
    // or usage in specific logic. e.g. "emerald-500" -> "emerald"
    const colorName = config.primaryColor.split('-')[0];

    return (
        <Card className="w-full max-w-md mx-auto bg-slate-900 border-slate-800 shadow-xl overflow-hidden mb-8 relative group">
            <div className={`absolute inset-0 bg-gradient-to-r from-${colorName}-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

            <CardContent className="p-8 flex flex-col items-center text-center">
                <h2 className="text-2xl font-bold text-slate-100 mb-2">
                    Gerar {config.name}
                </h2>
                <p className="text-slate-400 mb-6">
                    IA estatística calibrada para {config.totalNumbers} números com seleção de {config.pickedNumbers}.
                </p>

                {/* Quantity Selector */}
                <div className="flex bg-slate-800/50 p-1 rounded-lg mb-6 border border-slate-700">
                    {[1, 3, 5, 10].map((q) => (
                        <button
                            key={q}
                            onClick={() => setQuantity(q)}
                            disabled={isGenerating}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${quantity === q
                                ? "bg-slate-700 text-white shadow-sm"
                                : "text-slate-400 hover:text-slate-200"
                                }`}
                        >
                            {q} Jogo{q > 1 ? 's' : ''}
                        </button>
                    ))}
                </div>

                <Button
                    size="lg"
                    onClick={() => onGenerate(quantity)}
                    disabled={isGenerating}
                    style={{
                        // Dynamic styling is safer via inline styles for specific colors
                        // We use a slight gradient based on the passed color
                        // But Tailwind classes are cleaner if they exist. 
                        // Let's rely on standard Shadcn `className` override if possible, 
                        // but dynamic BG class needs safelist. 
                        // Safe approach: use style for bg-color fallback
                        // backgroundColor: `var(--color-${colorName}-600)`
                    }}
                    className={`w-full h-16 text-xl font-bold text-white transition-all 
                        bg-${colorName}-600 hover:bg-${colorName}-500
                        shadow-[0_0_20px_rgba(0,0,0,0.2)] hover:shadow-[0_0_40px_rgba(0,0,0,0.4)] 
                        active:scale-95 border border-${colorName}-400/30`}
                >
                    {isGenerating ? (
                        <>
                            <Loader2 className="mr-3 h-7 w-7 animate-spin" />
                            CALCULANDO...
                        </>
                    ) : (
                        <>
                            <Sparkles className="mr-3 h-6 w-6 fill-white text-white" />
                            GERAR {quantity} JOGO{quantity > 1 ? 'S' : ''}
                        </>
                    )}
                </Button>
            </CardContent>
        </Card>
    );
};
