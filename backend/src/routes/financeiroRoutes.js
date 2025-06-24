// Arquivo: backend/src/routes/financeiroRoutes.js

const express = require('express');
const { createTransacao } = require('../controllers/financeiroController');
const authMiddleware = require('../middlewares/authMiddleware');
const { checkRole } = require('../middlewares/roleMiddleware');

const router = express.Router();
const adminOnly = [authMiddleware, checkRole(['bibliotecario', 'admin'])];

// Rota para criar uma nova transação financeira
router.post('/transacoes-financeiras', adminOnly, createTransacao);

module.exports = router;