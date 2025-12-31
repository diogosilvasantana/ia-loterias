import React, { useState } from 'react';
import { Sidebar, type TabId } from '../components/Sidebar';
import { AppHeader } from '../components/AppHeader';

interface MainLayoutProps {
    children: React.ReactNode;
    activeTab: TabId;
    onTabChange: (tab: TabId) => void;
}

const PAGE_TITLES: Record<TabId, string> = {
    dashboard: 'Visão Geral do Mercado',
    generator: 'Terminal de Geração IA',
    syndicate: 'Calculadora de Bolões',
    matrices: 'Análise de Matrizes',
    results: 'Ticker de Resultados',
    history: 'Histórico de Operações',
    account: 'Perfil do Investidor',
    admin: 'Admin Console'
};

export type { TabId };

export const MainLayout: React.FC<MainLayoutProps> = ({ children, activeTab, onTabChange }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex overflow-hidden selection:bg-emerald-500/30">
            {/* Sidebar */}
            <Sidebar
                isOpen={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
                activeTab={activeTab}
                onTabChange={onTabChange}
            />

            {/* Main Layout Area */}
            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative transition-all duration-300">

                {/* Header */}
                <AppHeader
                    onMenuClick={() => setIsMobileMenuOpen(true)}
                    title={PAGE_TITLES[activeTab]}
                />

                {/* Content Scroll Area */}
                <main className="flex-1 overflow-y-auto scroll-smooth p-4 md:p-6 lg:p-8 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
                    <div className="max-w-7xl mx-auto space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};
