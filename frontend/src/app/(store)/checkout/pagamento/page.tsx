'use client';

import { Stepper } from "@/components/checkout/Stepper";
import { PaymentMethods } from "@/components/checkout/PaymentMethods";
import { SummaryPayment } from "@/components/checkout/SummaryPayment";

export default function PagamentoPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <Stepper active="pagamento" />

        <h1 className="text-3xl font-bold text-gray-800 mb-6">Pagamento</h1>

        <div className="grid md:grid-cols-[1fr,320px] gap-8">
          {/* Métodos de pagamento */}
          <PaymentMethods />

          {/* Resumo do pedido com cupom */}
          <SummaryPayment />
        </div>
      </div>
    </main>
  );
}
