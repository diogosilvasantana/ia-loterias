import React from 'react';
import { Grid3X3, Lock } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const Matrices: React.FC = () => {
    const { isPro, upgradeToPro } = useAuth();

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 animate-in fade-in zoom-in duration-500">
            <div className="relative">
                <div className="w-24 h-24 bg-slate-900 rounded-2xl flex items-center justify-center border border-slate-800 shadow-2xl">
                    <Grid3X3 size={48} className="text-slate-600" />
                </div>
                {!isPro && (
                    <div className="absolute -top-2 -right-2 bg-amber-500 rounded-full p-2 border-4 border-slate-950">
                        <Lock size={16} className="text-black" />
                    </div>
                )}
            </div>

            <div className="max-w-md space-y-4">
                <h2 className="text-2xl font-bold text-white">Gerador de Fechamentos</h2>
                <p className="text-slate-400">
                    Crie matrizes matemáticas para garantir prêmios (Quadra/Quina) ao acertar as dezenas condicionais.
                </p>

                {!isPro ? (
                    <div className="p-6 bg-amber-500/5 border border-amber-500/20 rounded-xl space-y-4">
                        <p className="text-amber-500 font-bold text-sm uppercase tracking-wide">Funcionalidade Exclusiva PRO</p>
                        <button
                            onClick={upgradeToPro}
                            className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold rounded-full hover:shadow-lg hover:shadow-amber-500/20 transition-all transform hover:scale-105"
                        >
                            Desbloquear Agora
                        </button>
                    </div>
                ) : (
                    <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                        <p className="text-emerald-400 font-bold">Você tem acesso total!</p>
                        <p className="text-slate-500 text-sm mt-1">Ferramenta em desenvolvimento final. Em breve disponível.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
