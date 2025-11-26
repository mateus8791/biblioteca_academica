'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LimparCachePage() {
  const router = useRouter();

  useEffect(() => {
    // Limpar todo o localStorage
    localStorage.clear();

    // Limpar sessionStorage também
    sessionStorage.clear();

    // Mostrar mensagem
    console.log('✅ Cache limpo com sucesso!');

    // Redirecionar para login após 1 segundo
    setTimeout(() => {
      router.push('/auth/login');
    }, 1000);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <div className="mb-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Limpando cache...
        </h1>
        <p className="text-gray-600">
          Redirecionando para login em instantes...
        </p>
      </div>
    </div>
  );
}
