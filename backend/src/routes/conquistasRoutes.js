// Arquivo: backend/src/routes/conquistasRoutes.js

const express = require('express');
const { getMinhasConquistas } = require('../controllers/conquistasController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// A rota /conquistas é protegida, o usuário precisa estar logado.
// Ela automaticamente pegará os dados do usuário logado através do token.
router.get('/conquistas', authMiddleware, getMinhasConquistas);

module.exports = router;