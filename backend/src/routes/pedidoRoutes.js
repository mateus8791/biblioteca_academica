// backend/src/routes/pedidoRoutes.js
const router = require('express').Router();
const c = require('../controllers/pedidoController');

// criar um pedido (status pendente, calcula total etc. — implementaremos depois)
router.post('/pedidos', c.criarPedido);

// confirmar pagamento (PIX/Cartão/Boleto)
router.post('/pedidos/:id/confirmar', c.confirmarPagamento);

// listar pedidos do usuário logado
// uso: GET /api/pedidos/me?usuario_id=123
router.get('/pedidos/me', c.listarPedidosDoUsuario);

module.exports = router;
