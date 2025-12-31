import type { SubscriptionPlan } from '../types/domain';

export const PLANS: Record<string, SubscriptionPlan> = {
    FREE: {
        type: 'FREE',
        name: 'Gratuito',
        dailyLimit: 3,
        price: 0,
        features: [
            'Geração Aleatória Inteligente',
            'Filtros Básicos (Soma, Par/Ímpar)',
            'Resultados das Loterias',
            '3 Gerações Diárias'
        ]
    },
    PRO: {
        type: 'PRO',
        name: 'Profissional',
        dailyLimit: -1, // Unlimited
        price: 29.90,
        features: [
            'Gerações Ilimitadas',
            'Inteligência Estatística (Mapas de Calor)',
            'Fechamentos Matemáticos (Matrizes)',
            'Modo Delta Avançado',
            'Salvar e Exportar Jogos (Excel/TXT)',
            'Acesso Antecipado a Novas Funcionalidades'
        ]
    }
};
