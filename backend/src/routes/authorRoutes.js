// backend/src/routes/authorRoutes.js
const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { getAllAuthors } = require('../controllers/authorController');

const router = express.Router();

// Rota para buscar todos os autores (protegida por segurança)
router.get('/autores', authMiddleware, getAllAuthors);

module.exports = router;