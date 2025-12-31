import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { cn } from '../lib/utils';
import {
    LayoutDashboard,
    Zap,
    Grid3X3,
    Trophy,
    History,
    User,
    Menu,
    X,
    LogOut,
    Crown
} from 'lucide-react';

export type TabId = 'dashboard' | 'generator' | 'matrices' | 'results' | 'history' | 'account';

interface MainLayoutProps {
    children: React.ReactNode;
    activeTab: TabId;
    onTabChange: (tab: TabId) => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children, activeTab, onTabChange }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { isPro, user, logout, login } = useAuth();

    const menuItems = [
        { id: 'dashboard', icon: LayoutDashboard, label: 'Início', pro: false },
        { id: 'generator', icon: Zap, label: 'Gerador IA', pro: false },
        { id: 'matrices', icon: Grid3X3, label: 'Fechamentos', pro: true },
        { id: 'results', icon: Trophy, label: 'Resultados', pro: false },
        { id: 'history', icon: History, label: 'Meus Jogos', pro: false },
        { id: 'account', icon: User, label: 'Conta', pro: false },
    ];

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex overflow-hidden">

            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={cn(
                "fixed md:relative z-50 w-64 h-full bg-slate-900 border-r border-slate-800 transition-transform duration-300 ease-in-out md:translate-x-0",
                isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20">
                            <Zap className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-300">
                            LotoMind
                        </span>
                    </div>
                    <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden text-slate-400">
                        <X size={24} />
                    </button>
                </div>

                <div className="px-3 py-2">
                    {/* User Mini Card */}
                    <div className="mb-6 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-slate-300">
                                <User size={20} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">
                                    {user?.email || 'Visitante'}
                                </p>
                                <div className="flex items-center gap-1.5 mt-1">
                                    {isPro ? (
                                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-[10px] font-bold text-amber-500 uppercase tracking-wider">
                                            <Crown size={10} /> PRO
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-slate-700 text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                                            Free
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                        {!user && (
                            <button
                                onClick={() => login()}
                                className="mt-3 w-full py-1.5 text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
                            >
                                Entrar
                            </button>
                        )}
                    </div>

                    <nav className="space-y-1">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = activeTab === item.id;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        onTabChange(item.id as TabId);
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className={cn(
                                        "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all group relative",
                                        isActive
                                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                            : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                                    )}
                                >
                                    <Icon size={20} className={cn(
                                        isActive ? "text-emerald-400" : "text-slate-500 group-hover:text-slate-300"
                                    )} />
                                    {item.label}
                                    {item.pro && !isPro && (
                                        <Zap size={12} className="ml-auto text-amber-500 opacity-70" />
                                    )}
                                </button>
                            );
                        })}
                    </nav>
                </div>

                <div className="absolute bottom-4 left-0 w-full px-4">
                    <button
                        onClick={logout}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-slate-500 hover:text-red-400 transition-colors"
                    >
                        <LogOut size={16} />
                        Sair
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-w-0 overflow-y-auto h-screen scroll-smooth">
                {/* Mobile Header */}
                <div className="md:hidden flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-30">
                    <span className="font-bold text-lg text-white">LotoMind</span>
                    <button onClick={() => setIsMobileMenuOpen(true)} className="text-slate-300">
                        <Menu size={24} />
                    </button>
                </div>

                <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
                    {children}
                </div>
            </main>
        </div>
    );
};
