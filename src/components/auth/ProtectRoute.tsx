import React from 'react';
import { useAuth } from '../../hooks/useAuth';

interface ProtectRouteProps {
    children: React.ReactNode;
    onlyPro?: boolean;
    fallback?: React.ReactNode;
}

export const ProtectRoute: React.FC<ProtectRouteProps> = ({
    children,
    onlyPro = false,
    fallback
}) => {
    const { isAuthenticated, isPro, login } = useAuth();

    if (!isAuthenticated) {
        return (
            <div className="flex flex-col items-center justify-center p-8 bg-slate-900 rounded-lg border border-slate-800">
                <h3 className="text-xl font-bold text-white mb-4">Acesso Restrito</h3>
                <p className="text-slate-400 mb-6 text-center">Faça login para acessar esta funcionalidade.</p>
                <button
                    onClick={() => login()}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-full font-bold transition-colors"
                >
                    Entrar / Criar Conta
                </button>
            </div>
        );
    }

    if (onlyPro && !isPro) {
        return fallback || (
            <div className="flex flex-col items-center justify-center p-8 bg-slate-900 rounded-lg border border-amber-500/30 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-amber-500 text-xs font-bold px-2 py-1 text-black">PRO</div>
                <h3 className="text-xl font-bold text-amber-500 mb-2">Funcionalidade Premium</h3>
                <p className="text-slate-400 mb-6 text-center max-w-md">
                    Esta ferramenta (Mapas de Calor, Fechamentos, IA) é exclusiva para assinantes PRO.
                </p>
                <div className="grid grid-cols-1 gap-2 mb-6 text-sm text-slate-300">
                    <div>✓ Gerações Ilimitadas</div>
                    <div>✓ IA Estatística e Delta</div>
                    <div>✓ Exportação Excel</div>
                </div>
                <button
                    onClick={() => {/* Trigger Upgrade Modal - implemented later */ }}
                    className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black px-8 py-2 rounded-full font-bold shadow-lg shadow-amber-500/20 transition-all transform hover:scale-105"
                >
                    Quero ser PRO
                </button>
            </div>
        );
    }

    return <>{children}</>;
};
