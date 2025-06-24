// Arquivo: frontend/src/app/page.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import api from '@/services/api'; // MUDANÇA 1: Importamos nossa 'api' em vez do 'axios'
import { Lock, Mail } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErro('');

    try {
      // MUDANÇA 2: Usamos nossa instância 'api' e passamos só a parte final da URL
      const response = await api.post('/auth/login', {
        email,
        senha,
      });

      console.log('Login bem-sucedido:', response.data);

      localStorage.setItem('bibliotech_token', response.data.token);
      localStorage.setItem('bibliotech_usuario', JSON.stringify(response.data.usuario));

      router.push('/select-profile');

    } catch (error: any) {
      console.error('Falha no login:', error);
      const mensagemErro = error.response?.data?.mensagem || 'Não foi possível fazer login. Tente novamente.';
      setErro(mensagemErro);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-sm p-8 space-y-6 bg-white rounded-xl shadow-lg">
        <div className="flex justify-center">
          <Image src="/logo.png" alt="Logo da Biblioteca" width={120} height={120} priority />
        </div>

        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">Acesso ao Sistema</h1>
          <p className="text-sm text-gray-500">Bem-vindo(a) ao Bibliotech!</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="relative">
            <Mail className="absolute w-5 h-5 text-gray-400 top-3 left-3" />
            <input
              id="email"
              type="email"
              required
              className="w-full pl-10 pr-4 py-2 text-gray-700 bg-gray-100 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
              placeholder="seu-email@dominio.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="relative">
            <Lock className="absolute w-5 h-5 text-gray-400 top-3 left-3" />
            <input
              id="password"
              type="password"
              required
              className="w-full pl-10 pr-4 py-2 text-gray-700 bg-gray-100 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
              placeholder="Sua senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          </div>
          
          {erro && (
            <div className="p-3 text-sm text-center text-red-800 bg-red-100 border border-red-200 rounded-md">
              {erro}
            </div>
          )}

          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-transform transform hover:scale-105"
            >
              Entrar
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}