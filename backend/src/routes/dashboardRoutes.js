// Arquivo: backend/src/routes/dashboardRoutes.js

const express = require('express');
const { getLoanDashboardData } = require('../controllers/dashboardController');
const authMiddleware = require('../middlewares/authMiddleware');
const { checkRole } = require('../middlewares/roleMiddleware');

const router = express.Router();

// Protegemos a rota para que apenas bibliotecários/admins possam acessá-la
const adminOnly = [authMiddleware, checkRole(['bibliotecario', 'admin'])];

// Define o endpoint GET /dashboard/emprestimos
router.get('/dashboard/emprestimos', adminOnly, getLoanDashboardData);

module.exports = router;