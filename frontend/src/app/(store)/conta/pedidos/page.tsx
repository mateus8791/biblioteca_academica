'use client';

import { useState } from 'react';

export default function TrackOrdersPage() {
  const [chave, setChave] = useState('');

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    // futuro: chamar /api/pedidos?protocolo=xxx ou ?email=xxx
    alert(`Pesquisar por: ${chave}`);
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-2">Acompanhar Pedido</h1>
      <p className="text-gray-600 mb-6">Informe seu protocolo, e-mail ou CPF para localizar o pedido.</p>

      <form onSubmit={handleSearch} className="flex gap-2 max-w-lg">
        <input
          value={chave}
          onChange={(e) => setChave(e.target.value)}
          placeholder="Ex.: PROT-2025-0001 ou seu e-mail"
          className="flex-1 border rounded-xl px-4 py-2"
        />
        <button className="px-4 py-2 rounded-xl bg-blue-600 text-white">Buscar</button>
      </form>

      <div className="mt-6 rounded-xl bg-white border p-6 text-gray-500">
        Resultado da busca aparecerá aqui.
      </div>
    </main>
  );
}
