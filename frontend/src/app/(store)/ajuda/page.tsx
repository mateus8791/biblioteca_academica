export default function HelpPage() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-2">Ajuda</h1>
      <p className="text-gray-600 mb-6">Dúvidas frequentes sobre compras, entrega e pagamentos.</p>

      <div className="rounded-xl bg-white border divide-y">
        <details className="p-4">
          <summary className="font-medium cursor-pointer">Como funciona a sacola e o checkout?</summary>
          <p className="mt-2 text-gray-600">Adicione livros à sacola, informe endereço, escolha pagamento e revise.</p>
        </details>
        <details className="p-4">
          <summary className="font-medium cursor-pointer">Posso comprar sem cadastro?</summary>
          <p className="mt-2 text-gray-600">Sim, visitantes podem avançar até o checkout.</p>
        </details>
        <details className="p-4">
          <summary className="font-medium cursor-pointer">Como acompanho meu pedido?</summary>
          <p className="mt-2 text-gray-600">Use a página “Acompanhar Pedido” informando protocolo ou e-mail.</p>
        </details>
      </div>
    </main>
  );
}
