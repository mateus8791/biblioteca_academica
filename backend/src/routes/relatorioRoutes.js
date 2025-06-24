// Arquivo: backend/src/routes/relatorioRoutes.js

const express = require('express');
const { getDashboardStats } = require('../controllers/relatorioController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// A rota agora é completa: /relatorios/estatisticas
router.get('/relatorios/estatisticas', authMiddleware, getDashboardStats);

module.exports = router;