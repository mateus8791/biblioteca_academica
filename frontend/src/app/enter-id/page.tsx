
// Arquivo: frontend/src/app/enter-id/page.tsx
'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { KeyRound, ArrowRight } from 'lucide-react';
import { Suspense, useState, FormEvent } from 'react';
// 1. Importamos o useAuth do nosso NOVO contexto!
import { useAuth } from '../../contexts/AuthContext'; 

const EnterIdContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const profile = searchParams.get('profile');

  const [id, setId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // 2. Agora o useAuth funciona e nos dá a função que precisamos!
  const { loginWithId } = useAuth();

  const profileConfig = {
    student: {
      title: 'Acessar como Aluno',
      placeholder: 'Digite seu código de matrícula',
      icon: '/icons/student-icon.png',
    },
    librarian: {
      title: 'Acessar como Bibliotecário',
      placeholder: 'Digite seu ID de funcionário',
      icon: '/icons/librarian-icon.png',
    },
    default: {
      title: 'Verificação de ID',
      placeholder: 'Digite seu código de identificação',
      icon: '/logo.png',
    },
  };

  const config =
    profileConfig[profile as keyof typeof profileConfig] || profileConfig.default;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!id || !profile) {
      setError('ID ou Perfil inválido.');
      setLoading(false);
      return;
    }

    try {
      // 3. Chamamos a função que agora existe e funciona
      const user = await loginWithId(id, profile as 'aluno' | 'bibliotecario');
      
      if (user) {
        if (user.tipo_usuario === 'bibliotecario') {
          router.push('/admin/livros'); // Redireciona o bibliotecário
        } else if (user.tipo_usuario === 'aluno') {
          router.push('/catalogo'); // Redireciona o aluno
        }
      }
    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          'Ocorreu um erro ao verificar sua identificação.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-sm p-8 space-y-6 bg-white rounded-xl shadow-lg">
        <div className="flex justify-center">
          <Image
            src={config.icon}
            alt={`Ícone ${config.title}`}
            width={90}
            height={90}
            className="rounded-full"
          />
        </div>

        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">{config.title}</h1>
          <p className="text-sm text-gray-500">
            Por favor, insira sua identificação para prosseguir.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="relative">
            <KeyRound className="absolute w-5 h-5 text-gray-400 top-3 left-3" />
            <input
              id="user-id"
              name="user-id"
              type="text"
              required
              value={id}
              onChange={(e) => setId(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-gray-700 bg-gray-100 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
              placeholder={config.placeholder}
              disabled={loading}
            />
          </div>

          {error && (
            <p className="text-xs text-center text-red-600 bg-red-100 p-2 rounded-md">
              {error}
            </p>
          )}

          <div>
            <button
              type="submit"
              className="w-full flex items-center justify-center px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-transform transform hover:scale-105 disabled:bg-gray-400"
              disabled={loading}
            >
              {loading ? 'Validando...' : 'Confirmar'}
              {!loading && <ArrowRight className="w-5 h-5 ml-2" />}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default function EnterIdPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Carregando...</div>}>
      <EnterIdContent />
    </Suspense>
  );
}