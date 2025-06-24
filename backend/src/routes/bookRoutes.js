// Arquivo: backend/src/routes/bookRoutes.js (VERSÃO COMPLETA E CORRETA)

const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');

// Importamos TODAS as 5 funções do nosso controlador
const {
  getAllBooks,
  createBook,
  getBookById,
  updateBook,
  deleteBook
} = require('../controllers/bookController');

const router = express.Router();


// --- ROTAS PARA A COLEÇÃO DE LIVROS ---

// GET /api/livros -> Busca todos os livros
router.get('/livros', authMiddleware, getAllBooks);

// POST /api/livros -> Cria um novo livro
router.post('/livros', authMiddleware, createBook);


// --- ROTAS PARA UM LIVRO ESPECÍFICO ---
// O ':id' na URL é um parâmetro dinâmico. O Express vai capturar o valor
// que for colocado ali e nos dar acesso a ele no controlador.

// GET /api/livros/:id -> Busca UM livro específico pelo ID
router.get('/livros/:id', authMiddleware, getBookById);

// PUT /api/livros/:id -> ATUALIZA um livro pelo ID
router.put('/livros/:id', authMiddleware, updateBook);

// DELETE /api/livros/:id -> APAGA um livro pelo ID
router.delete('/livros/:id', authMiddleware, deleteBook);


module.exports = router;