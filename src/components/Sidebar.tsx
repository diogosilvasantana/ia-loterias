import React from 'react';
import { cn } from '../lib/utils';
import { useAuth } from '../hooks/useAuth';
import {
    LayoutDashboard,
    Zap,
    Grid3X3,
    Trophy,
    History,
    User,
    Users,
    X,
    LogOut,
    Crown,
    Lock
} from 'lucide-react';

export type TabId = 'dashboard' | 'generator' | 'syndicate' | 'matrices' | 'results' | 'history' | 'account' | 'admin';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    activeTab: TabId;
    onTabChange: (tab: TabId) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, activeTab, onTabChange }) => {
    const { isPro, user, logout, login } = useAuth();
    // TODO: Add real admin check
    const isAdmin = user?.email === 'admin@lotomind.ai' || true;

    const menuItems = [
        { id: 'dashboard', icon: LayoutDashboard, label: 'Início', pro: false },
        { id: 'generator', icon: Zap, label: 'Gerador IA', pro: false },
        { id: 'syndicate', icon: Users, label: 'Bolões', pro: false },
        { id: 'matrices', icon: Grid3X3, label: 'Fechamentos', pro: true },
        { id: 'results', icon: Trophy, label: 'Resultados', pro: false },
        { id: 'history', icon: History, label: 'Meus Jogos', pro: false },
        { id: 'account', icon: User, label: 'Conta', pro: false },
    ];

    if (isAdmin) {
        menuItems.push({ id: 'admin', icon: Lock, label: 'Admin', pro: false });
    }

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
                    onClick={onClose}
                />
            )}

            {/* Sidebar Container */}
            <aside className={cn(
                "fixed md:relative z-50 w-64 h-screen bg-slate-900 border-r border-slate-800 transition-transform duration-300 ease-in-out md:translate-x-0 flex flex-col",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                {/* Logo Area */}
                <div className="p-6 flex items-center justify-between border-b border-slate-800/50">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center border border-slate-700">
                            <Zap className="h-5 w-5 text-emerald-500" />
                        </div>
                        <span className="text-xl font-bold text-slate-100 tracking-tight">
                            LotoMind
                        </span>
                    </div>
                    <button onClick={onClose} className="md:hidden text-slate-400 hover:text-slate-200">
                        <X size={24} />
                    </button>
                </div>

                {/* Navigation */}
                <div className="flex-1 overflow-y-auto py-6 px-3">
                    {/* User Profile Summary */}
                    <div className="mb-8 px-2">
                        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400">
                                    <User size={20} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-slate-200 truncate">
                                        {user?.email || 'Visitante'}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1">
                                        {isPro ? (
                                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-[10px] font-bold text-amber-500 uppercase tracking-wider">
                                                <Crown size={10} /> PRO
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-slate-800 text-[10px] font-medium text-slate-400 uppercase tracking-wider border border-slate-700">
                                                Free
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            {!user && (
                                <button
                                    onClick={() => login()}
                                    className="mt-3 w-full py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-all"
                                >
                                    Entrar
                                </button>
                            )}
                        </div>
                    </div>

                    <nav className="space-y-1">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            // admin tab check needs to be loose if we add sub-routes later, but strict for now
                            const isActive = activeTab === item.id;

                            return (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        onTabChange(item.id as TabId);
                                        onClose();
                                    }}
                                    className={cn(
                                        "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all group relative",
                                        isActive
                                            ? "bg-slate-800 text-emerald-400 border border-slate-700/50 shadow-sm"
                                            : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 hover:border hover:border-slate-800/50 border border-transparent"
                                    )}
                                >
                                    <Icon size={18} className={cn(
                                        "transition-colors",
                                        isActive ? "text-emerald-500" : "text-slate-500 group-hover:text-slate-400"
                                    )} />
                                    {item.label}
                                    {item.pro && !isPro && (
                                        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-500/50" />
                                    )}
                                </button>
                            );
                        })}
                    </nav>
                </div>

                {/* Footer Actions */}
                <div className="p-4 border-t border-slate-800 bg-slate-900/50">
                    <button
                        onClick={logout}
                        className="flex items-center justify-center gap-2 w-full px-4 py-2 text-sm font-medium text-slate-500 hover:text-red-400 hover:bg-red-500/5 rounded-lg transition-all"
                    >
                        <LogOut size={16} />
                        Sair da Conta
                    </button>
                </div>
            </aside>
        </>
    );
};
