'use client';

import React, { useState } from 'react';
// --- CORREÇÃO: Caminho relativo ajustado ---
import { Button } from '../admin/emprestimos/components/ui/button';
// --- FIM DA CORREÇÃO ---
import { useRouter } from 'next/navigation';

// Interface simples para os itens do carrinho
interface CartItem {
  id: number;
  livroId: number;
  titulo: string;
  quantidade: number;
  precoUnitario: number;
  subtotal: number;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([
    // --- Mock de itens no carrinho ---
    { id: 1, livroId: 101, titulo: 'O Senhor dos Anéis', quantidade: 1, precoUnitario: 59.90, subtotal: 59.90 },
    { id: 2, livroId: 102, titulo: '1984', quantidade: 1, precoUnitario: 35.50, subtotal: 35.50 },
    // --- Fim do Mock ---
  ]);
  const [status, setStatus] = useState<'initial' | 'waiting_payment_options' | 'selecting_payment' | 'confirming_payment' | 'completed' | 'error'>('initial');
  const [pedidoId, setPedidoId] = useState<number | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);

  const calculateTotal = () => {
    return cartItems.reduce((acc, item) => acc + item.subtotal, 0);
  };

  const handleConfirmPurchase = () => {
    console.log("Clicou em Confirmar Compra");
    setStatus('waiting_payment_options');
    // Implementaremos o timer aqui no próximo passo
  };

  const handleSelectPayment = (method: string) => {
    console.log("Selecionou Pagamento:", method);
    setSelectedPaymentMethod(method);
    setStatus('confirming_payment');
    // Implementaremos o segundo timer aqui no próximo passo
  };

  const handleFinalConfirm = () => {
    console.log("Confirmando pagamento final para o pedido:", pedidoId, "com método:", selectedPaymentMethod);
    // Implementaremos a chamada ao backend aqui no próximo passo
    // Por agora, simulamos sucesso e redirecionamos
    router.push(`/pedido/confirmacao/123`); // ID mockado
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6 text-center">Finalizar Compra</h1>

      {/* --- Seção de Revisão dos Itens (Usando divs e Tailwind) --- */}
      <div className="border rounded-lg shadow-md mb-6 bg-white">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Resumo do Pedido</h2>
        </div>
        <div className="p-4">
          {cartItems.length === 0 ? (
            <p>Seu carrinho está vazio.</p>
          ) : (
            <ul className="space-y-3">
              {cartItems.map(item => (
                <li key={item.id} className="flex justify-between items-center border-b pb-2 last:border-b-0 last:pb-0">
                  <div>
                    <p className="font-medium">{item.titulo}</p>
                    <p className="text-sm text-gray-600">Qtd: {item.quantidade} x R$ {item.precoUnitario.toFixed(2).replace('.', ',')}</p>
                  </div>
                  <p className="font-semibold">R$ {item.subtotal.toFixed(2).replace('.', ',')}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
        {cartItems.length > 0 && (
          <div className="p-4 border-t flex justify-end font-bold text-lg">
            Total: R$ {calculateTotal().toFixed(2).replace('.', ',')}
          </div>
        )}
      </div>

      {/* --- Seção de Controle do Fluxo --- */}
      <div className="text-center space-y-4 mt-8">
        {status === 'initial' && cartItems.length > 0 && (
          <Button size="lg" onClick={handleConfirmPurchase}>
            Confirmar Compra
          </Button>
        )}

        {status === 'waiting_payment_options' && (
          <p className="text-gray-600 animate-pulse">Aguardando opções de pagamento...</p>
          // Adicionaremos timer visual
        )}

        {status === 'selecting_payment' && (
          <div>
            <h2 className="text-xl font-semibold mb-3">Escolha a forma de pagamento:</h2>
            <div className="flex justify-center gap-4">
              <Button onClick={() => handleSelectPayment('Pix')}>Pix</Button>
              <Button onClick={() => handleSelectPayment('Cartão de Crédito')}>Cartão de Crédito</Button>
              {/* Adicione mais formas de pagamento se necessário */}
            </div>
          </div>
        )}

         {status === 'confirming_payment' && (
           <p className="text-gray-600 animate-pulse">Processando pagamento via {selectedPaymentMethod}...</p>
           // Adicionaremos timer visual
         )}

         {status === 'error' && (
             <p className="text-red-500 font-semibold">Ocorreu um erro ao processar seu pedido.</p>
             // Adicionar botão para tentar novamente ou voltar
         )}
      </div> {/* Esta div fecha a seção de controle do fluxo */}

    </div> // Esta div fecha o container principal
  ); // Este parêntese fecha o return
} // Esta chave fecha o componente