import React from 'react';
import { Menu, Calendar, Globe } from 'lucide-react';

interface AppHeaderProps {
    onMenuClick: () => void;
    title?: string;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ onMenuClick, title = 'LotoMind AI' }) => {
    // Current date format for "Financial Terminal" look
    const currentDate = new Date().toLocaleDateString('pt-BR', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    }).toUpperCase();

    return (
        <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-slate-800 bg-slate-950/80 px-6 backdrop-blur-md">
            <button
                onClick={onMenuClick}
                className="md:hidden text-slate-400 hover:text-slate-200 transition-colors"
                aria-label="Toggle Menu"
            >
                <Menu size={24} />
            </button>

            <div className="flex flex-1 items-center justify-between">
                <div className="flex items-center gap-3">
                    <span className="hidden md:flex h-6 w-[1px] bg-slate-800"></span>
                    <h2 className="text-sm font-semibold tracking-wide text-slate-200 uppercase">
                        {title === 'LotoMind AI' ? 'Dashboard Global' : title}
                    </h2>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono text-slate-500">
                    <div className="hidden md:flex items-center gap-2">
                        <Globe size={12} className="text-slate-600" />
                        <span className="text-emerald-500">ONLINE</span>
                    </div>
                    <div className="flex items-center gap-2 border-l border-slate-800 pl-4">
                        <Calendar size={12} className="text-slate-600" />
                        <span>{currentDate}</span>
                    </div>
                </div>
            </div>
        </header>
    );
};
