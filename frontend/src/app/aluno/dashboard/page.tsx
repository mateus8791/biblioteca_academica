'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/services/api';
import { BookOpen, Clock, DollarSign, Award } from 'lucide-react';

// Importar componentes
import { KPICard } from '@/components/dashboard/KPICard';
import { ChartCard } from '@/components/dashboard/ChartCard';
import { ActivityChart } from '@/components/dashboard/ActivityChart';
import { CategoriesChart } from '@/components/dashboard/CategoriesChart';
import { ActiveLoansTable } from '@/components/dashboard/ActiveLoansTable';
import { PopularBooksList } from '@/components/dashboard/PopularBooksList';

interface DashboardData {
  kpis: {
    reservas_disponiveis: number;
    reservas_aguardando: number;
    multas_pendentes: string;
    livros_retirados: number;
  };
  atividade: Array<{
    mes: string;
    livros: number;
  }>;
  categorias: Array<{
    nome: string;
    quantidade: number;
    percentual: number;
  }>;
  reservasAtivas: Array<{
    id: number;
    livro_titulo: string;
    livro_capa_url: string | null;
    autores: string;
    data_expiracao: string;
    status: 'disponivel' | 'aguardando';
    dias_restantes: number;
  }>;
  livrosPopulares: Array<{
    id: number;
    titulo: string;
    capa_url: string | null;
    autores: string;
    total_reservas: number;
  }>;
}

export default function AlunoDashboardPage() {
  const { usuario } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Verifica se há token antes de fazer a requisição
        const token = localStorage.getItem('bibliotech_token');
        if (!token) {
          console.warn('[Dashboard] Token não encontrado no localStorage');
          setError('Você precisa estar autenticado para acessar o dashboard. Redirecionando para login...');
          setTimeout(() => {
            window.location.href = '/auth/login';
          }, 2000);
          return;
        }

        // DIAGNÓSTICO: Verificar token antes de buscar dashboard
        try {
          const diagnostico = await api.get('/diagnostico/token');
          console.log('[Dashboard] Diagnóstico do token:', diagnostico.data);
        } catch (diagError) {
          console.error('[Dashboard] Erro no diagnóstico do token:', diagError);
        }

        console.log('[Dashboard] Buscando dados do dashboard...');
        const response = await api.get('/dashboard/aluno');
        console.log('[Dashboard] Dados recebidos com sucesso:', response.data);
        setData(response.data);
        setError(null);
      } catch (error: any) {
        console.error('Erro ao carregar dados do dashboard:', error);

        // Mensagens de erro mais específicas
        let errorMessage = 'Não foi possível carregar os dados do dashboard.';

        if (error.response?.status === 401) {
          errorMessage = 'Sessão expirada. Por favor, faça login novamente.';
        } else if (error.response?.status === 403) {
          errorMessage = 'Você não tem permissão para acessar este dashboard.';
        } else if (error.response?.status === 404) {
          errorMessage = 'Endpoint do dashboard não encontrado.';
        } else if (error.response?.status === 500) {
          errorMessage = 'Erro no servidor. Por favor, tente novamente mais tarde.';
          console.error('[Dashboard] Detalhes do erro 500:', error.response?.data);
        } else if (!error.response) {
          errorMessage = 'Não foi possível conectar ao servidor. Verifique sua conexão.';
        }

        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-10 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-2xl"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-96 bg-gray-200 rounded-2xl"></div>
            <div className="h-96 bg-gray-200 rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  // Formatação de moeda
  const formatCurrency = (value: string | number) => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(numValue);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      {/* Cabeçalho com Saudação */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Olá, {usuario?.nome?.split(' ')[0]}! 👋
        </h1>
        <p className="text-gray-600 mt-2">
          Aqui está um resumo da sua atividade na biblioteca
        </p>
      </div>

      {/* KPIs - Linha de Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KPICard
          title="Prontas para Retirada"
          value={`${data?.kpis.reservas_disponiveis || 0}`}
          icon={BookOpen}
          iconColor="text-green-600"
          iconBgColor="bg-green-100"
          valueColor="text-green-600"
        />
        <KPICard
          title="Aguardando na Fila"
          value={`${data?.kpis.reservas_aguardando || 0}`}
          icon={Clock}
          iconColor="text-amber-600"
          iconBgColor="bg-amber-100"
          valueColor="text-amber-600"
        />
        <KPICard
          title="Pendências Financeiras"
          value={formatCurrency(data?.kpis.multas_pendentes || 0)}
          icon={DollarSign}
          iconColor="text-orange-600"
          iconBgColor="bg-orange-100"
          valueColor="text-orange-600"
        />
        <KPICard
          title="Livros Retirados"
          value={`${data?.kpis.livros_retirados || 0}+`}
          icon={Award}
          iconColor="text-purple-600"
          iconBgColor="bg-purple-100"
          valueColor="text-purple-600"
        />
      </div>

      {/* Linha 2: Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Gráfico de Atividade - 2 colunas */}
        <div className="lg:col-span-2">
          <ChartCard title="Minha Atividade" subtitle="Reservas realizadas nos últimos 6 meses">
            <ActivityChart data={data?.atividade || []} />
          </ChartCard>
        </div>

        {/* Gráfico de Categorias - 1 coluna */}
        <div className="lg:col-span-1">
          <ChartCard title="Minhas Categorias" subtitle="Distribuição de livros retirados">
            <CategoriesChart data={data?.categorias || []} />
          </ChartCard>
        </div>
      </div>

      {/* Linha 3: Tabelas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tabela de Reservas Ativas - 2 colunas */}
        <div className="lg:col-span-2">
          <ChartCard title="Minhas Reservas Ativas" subtitle="Livros disponíveis e aguardando">
            <ActiveLoansTable emprestimos={data?.reservasAtivas || []} />
          </ChartCard>
        </div>

        {/* Lista de Livros Populares - 1 coluna */}
        <div className="lg:col-span-1">
          <ChartCard
            title="Mais Populares"
            subtitle="Os mais reservados da biblioteca"
          >
            <PopularBooksList livros={data?.livrosPopulares || []} />
          </ChartCard>
        </div>
      </div>
    </div>
  );
}
