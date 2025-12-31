import { useState } from 'react';
import { MainLayout, type TabId } from './layouts/MainLayout';
import { Dashboard } from './pages/Dashboard';
import { Generator } from './pages/Generator';
import { Matrices } from './pages/Matrices';
import { useAuth } from './hooks/useAuth';

function App() {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const { user } = useAuth();

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard onNavigate={setActiveTab} />;
      case 'generator':
        return <Generator />;
      case 'matrices':
        return <Matrices />;
      case 'results':
        return (
          <div className="flex items-center justify-center h-96 text-slate-500">
            Página de Resultados em Manutenção (Conectando API da Caixa...)
          </div>
        );
      case 'history':
        return (
          <div className="flex items-center justify-center h-96 text-slate-500">
            {user ? 'Seus jogos salvos aparecerão aqui.' : 'Faça login para ver seu histórico.'}
          </div>
        );
      case 'account':
        return (
          <div className="p-8 bg-slate-900 rounded-xl border border-slate-800">
            <h2 className="text-2xl font-bold text-white mb-4">Minha Conta</h2>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 text-2xl font-bold">
                {user?.email?.charAt(0).toUpperCase() || '?'}
              </div>
              <div>
                <p className="text-white font-bold">{user?.email || 'Visitante'}</p>
                <p className="text-slate-500 text-sm">Plano: {user?.plan || 'Nenhum'}</p>
              </div>
            </div>
          </div>
        );
      default:
        return <Dashboard onNavigate={setActiveTab} />;
    }
  };

  return (
    <MainLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </MainLayout>
  );
}

export default App;
