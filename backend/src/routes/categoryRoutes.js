// backend/src/routes/categoryRoutes.js
const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { getAllCategories } = require('../controllers/categoryController');

const router = express.Router();

// Rota para buscar todas as categorias (protegida por segurança)
router.get('/categorias', authMiddleware, getAllCategories);

module.exports = router;