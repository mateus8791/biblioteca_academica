// src/services/api.js
export const API = {
  async createOrder(payload) {
    const res = await fetch('/api/pedidos', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(payload)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Erro ao criar pedido.');
    return json;
  }
};
