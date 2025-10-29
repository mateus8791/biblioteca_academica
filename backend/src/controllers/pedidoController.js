// backend/src/controllers/pedidoController.js
// Stubs: só respondem 501 por enquanto, pra garantir que o servidor sobe sem quebrar.

async function criarPedido(req, res) {
  return res.status(501).json({ error: 'Não implementado ainda: criarPedido' });
}

async function confirmarPagamento(req, res) {
  return res.status(501).json({ error: 'Não implementado ainda: confirmarPagamento' });
}

async function listarPedidosDoUsuario(req, res) {
  return res.status(501).json({ error: 'Não implementado ainda: listarPedidosDoUsuario' });
}

module.exports = {
  criarPedido,
  confirmarPagamento,
  listarPedidosDoUsuario,
};
