// Arquivo: backend/src/routes/reservationRoutes.js

const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');

// Importamos as duas funções do nosso controlador
const {
  createReservation,
  cancelReservation,
} = require('../controllers/reservationController');

const router = express.Router();

// Rota para CRIAR uma nova reserva (já existia)
router.post('/reservas', authMiddleware, createReservation);

// --- NOVA ROTA ---
// Rota para CANCELAR uma reserva específica pelo seu ID.
// Usamos o método PUT, pois estamos ATUALIZANDO o status da reserva.
router.put('/reservas/:id/cancelar', authMiddleware, cancelReservation);


module.exports = router;
