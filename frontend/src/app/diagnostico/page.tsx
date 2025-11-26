'use client';

import { useEffect, useState } from 'react';
import api from '@/services/api';

export default function DiagnosticoPage() {
  const [resultado, setResultado] = useState<any>(null);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    const verificarToken = async () => {
      try {
        const response = await api.get('/diagnostico/token');
        setResultado(response.data);
      } catch (error: any) {
        setErro(error.response?.data?.message || error.message);
      }
    };

    verificarToken();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-6 text-gray-800">
            🔍 Diagnóstico de Token JWT
          </h1>

          {erro && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
              <p className="text-red-700 font-medium">❌ Erro:</p>
              <p className="text-red-600 mt-2">{erro}</p>
            </div>
          )}

          {resultado && (
            <div className="space-y-4">
              <div className="bg-green-50 border-l-4 border-green-500 p-4">
                <p className="text-green-700 font-medium">
                  ✅ {resultado.mensagem}
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded">
                <h2 className="font-bold text-lg mb-3">Dados do Token:</h2>
                <pre className="bg-gray-800 text-green-400 p-4 rounded overflow-x-auto">
                  {JSON.stringify(resultado.usuario, null, 2)}
                </pre>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded">
                  <p className="text-sm text-gray-600">Possui "tipo"?</p>
                  <p className="text-xl font-bold">
                    {resultado.possui_tipo ? '✅ Sim' : '❌ Não'}
                  </p>
                  {resultado.valor_tipo && (
                    <p className="text-sm text-gray-600 mt-2">
                      Valor: {resultado.valor_tipo}
                    </p>
                  )}
                </div>

                <div className="bg-purple-50 p-4 rounded">
                  <p className="text-sm text-gray-600">Possui "tipo_usuario"?</p>
                  <p className="text-xl font-bold">
                    {resultado.possui_tipo_usuario ? '✅ Sim' : '❌ Não'}
                  </p>
                  {resultado.valor_tipo_usuario && (
                    <p className="text-sm text-gray-600 mt-2">
                      Valor: {resultado.valor_tipo_usuario}
                    </p>
                  )}
                </div>
              </div>

              {resultado.possui_tipo && !resultado.possui_tipo_usuario && (
                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
                  <p className="text-yellow-700 font-medium">
                    ⚠️ PROBLEMA DETECTADO!
                  </p>
                  <p className="text-yellow-600 mt-2">
                    O token usa "tipo" mas deveria usar "tipo_usuario".
                    <br />
                    <strong>Solução:</strong> Faça logout e login novamente.
                  </p>
                </div>
              )}

              {resultado.possui_tipo_usuario && (
                <div className="bg-green-50 border-l-4 border-green-500 p-4">
                  <p className="text-green-700 font-medium">
                    ✅ Token correto!
                  </p>
                  <p className="text-green-600 mt-2">
                    O token está usando "tipo_usuario" corretamente.
                  </p>
                </div>
              )}
            </div>
          )}

          {!resultado && !erro && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-4">Verificando token...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
