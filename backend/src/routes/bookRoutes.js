// backend/src/routes/livros.js (ou caminho equivalente)

const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const multer = require('multer'); 

// --- CORREÇÃO AQUI ---
// Importamos a função 'checkRole' de dentro do objeto exportado
const { checkRole } = require('../middlewares/roleMiddleware'); 
// --- FIM DA CORREÇÃO ---

const {
  getAllBooks,
  createBook,
  getBookById,
  updateBook,
  deleteBook,
  getAvailableBooks,     
  getBooksByCategory,
  getBooksByAuthor,
  importarLivrosCSV      
} = require('../controllers/bookController');

const router = express.Router();

// Configuração do multer
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Apenas arquivos .csv são permitidos!'), false);
    }
  }
}); 

// ------------------------------
// ROTAS PÚBLICAS (sem login)
// ------------------------------

// Lista todos os livros (público para a Storefront)
router.get('/livros', getAllBooks);

// Busca um livro por ID (público para a Storefront)
router.get('/livros/:id', getBookById);

// ------------------------------
// ROTAS AUTENTICADAS
// ------------------------------

// Livros disponíveis (mantém proteção)
router.get('/livros/disponiveis', authMiddleware, getAvailableBooks);

// Criação de livro (somente bibliotecário)
router.post('/livros', authMiddleware, checkRole(['bibliotecario']), createBook); 

// Atualização de livro (somente bibliotecário)
router.put('/livros/:id', authMiddleware, checkRole(['bibliotecario']), updateBook);

// Exclusão de livro (somente bibliotecário)
router.delete('/livros/:id', authMiddleware, checkRole(['bibliotecario']), deleteBook);

// Filtros (mantém proteção)
router.get('/livros/categoria/:categoriaId', authMiddleware, getBooksByCategory);
router.get('/livros/autor/:autorId', authMiddleware, getBooksByAuthor);

// Importação via CSV (somente bibliotecário)
router.post(
  '/livros/importar', 
  authMiddleware,
  checkRole(['bibliotecario']),
  upload.single('file'), 
  importarLivrosCSV 
);

module.exports = router;
