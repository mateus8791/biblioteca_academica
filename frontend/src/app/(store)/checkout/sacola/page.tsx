'use client';

import { Stepper } from '@/components/checkout/Stepper';
import { EmptyBag } from '@/components/checkout/EmptyBag';
import { CartList } from '@/components/checkout/CartList';
import { useCart, type CartState } from '@/store/cart';
import { useCheckout } from '@/store/checkout';

export default function SacolaPage() {
  const items = useCart((s: CartState) => s.items);
  // ✅ evita “getSnapshot should be cached”
  const freight = useCheckout((s) => s.freight);

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <Stepper active="sacola" />
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Sacola</h1>
        {items.length === 0 ? <EmptyBag /> : <CartList />}
      </div>
    </main>
  );
}
