// Arquivo: frontend/src/app/dashboard/student/page.tsx
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { BookOpen, BarChart3, Star } from 'lucide-react';

// Um componente simples para os cartões de estatísticas
const StatCard = ({ title, value, icon: Icon }: {
  title: string;
  value: string;
  icon: React.ElementType
}) => (
  <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
    <Icon className="w-10 h-10 text-blue-500 mr-4" />
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);


export default function StudentDashboardPage() {
  return (
    <DashboardLayout>
      {/* Cabeçalho da Página */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Painel do Aluno</h1>
        <p className="text-gray-600">Bem-vindo de volta, Mateus!</p>
      </div>

      {/* Seção de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Livros Lidos este Ano" value="12" icon={BookOpen} />
        <StatCard title="Posição no Ranking de Leitura" value="7º" icon={BarChart3} />
        <StatCard title="Gênero Favorito" value="Ficção Científica" icon={Star} />
      </div>

      {/* Seção de Interesses (Placeholder) */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Sua Lista de Interesses</h2>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-gray-500">Aqui será exibida a lista de livros que você marcou como interesse...</p>
          {/* Futuramente, aqui entrará uma lista/grid de componentes de livro */}
        </div>
      </div>
    </DashboardLayout>
  );
}