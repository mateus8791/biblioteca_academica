// Arquivo: backend/src/routes/authRoutes.js

const express = require('express');
const { login, loginComId } = require('../controllers/authController');

const router = express.Router();

// Rota para login com email/senha
router.post('/login', login);

// NOVA ROTA para login com ID e perfil
router.post('/login-id', loginComId);

module.exports = router;