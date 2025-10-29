'use client';

import { Stepper } from "@/components/checkout/Stepper";
import { AddressForm } from "@/components/checkout/AddressForm";
import { useCart, type CartState } from "@/store/cart";
import { useCheckout } from "@/store/checkout";
import { brl } from "@/lib/currency";

export default function EntregaPage() {
  // ✅ seletores que retornam valores estáveis (nada de objetos criados no selector)
  const items = useCart((s: CartState) => s.items);
  const totalFn = useCart((s: CartState) => s.total);
  const cartTotal = totalFn();

  // ✅ pegue cada chave separadamente (evita criar objetos no selector)
  const freight = useCheckout(s => s.freight);

  const freightValue = freight?.value ?? 0;
  const orderTotal = cartTotal + freightValue;

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <Stepper active="entrega" />
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Entrega</h1>

        <div className="grid md:grid-cols-[1fr,320px] gap-8">
          {/* Formulário de endereço */}
          <AddressForm />

          {/* Resumo do pedido */}
          <aside className="bg-white rounded-2xl border p-4 h-fit">
            <h4 className="text-lg font-semibold">Resumo</h4>
            <div className="mt-4 flex justify-between text-sm">
              <span>Subtotal</span>
              <span>{brl(cartTotal)}</span>
            </div>

            <div className="mt-2 flex justify-between text-sm">
              <span>Frete {freight?.service ? `(${freight.service})` : ""}</span>
              <span>{freight ? brl(freight.value) : "—"}</span>
            </div>

            {/* Removido o prazo estimado pois 'eta' não existe em 'Freight' */}

            <div className="mt-3 border-t pt-3 flex justify-between font-bold">
              <span>Total</span>
              <span>{brl(orderTotal)}</span>
            </div>

            <button
              className="mt-4 w-full rounded-xl bg-blue-600 text-white py-3 font-semibold hover:brightness-110 disabled:opacity-50"
              disabled={items.length === 0 || !freight}
              onClick={() => {
                // prossiga para a etapa de pagamento
                window.location.href = "/checkout/pagamento";
              }}
            >
              Continuar para pagamento
            </button>

            <p className="text-xs text-gray-500 mt-2">
              Você poderá revisar tudo antes de finalizar a compra.
            </p>
          </aside>
        </div>
      </div>
    </main>
  );
}
