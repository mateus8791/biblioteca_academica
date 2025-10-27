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

// --- ROTAS PARA A COLEÇÃO DE LIVROS ---
router.get('/livros', authMiddleware, getAllBooks);
router.get('/livros/disponiveis', authMiddleware, getAvailableBooks);

// --- CORREÇÃO AQUI ---
// Usamos 'checkRole' em vez de 'roleMiddleware'
router.post('/livros', authMiddleware, checkRole(['bibliotecario']), createBook); 


// --- ROTAS PARA UM LIVRO ESPECÍFICO ---
router.get('/livros/:id', authMiddleware, getBookById);

// --- CORREÇÃO AQUI ---
router.put('/livros/:id', authMiddleware, checkRole(['bibliotecario']), updateBook);

// --- CORREÇÃO AQUI ---
router.delete('/livros/:id', authMiddleware, checkRole(['bibliotecario']), deleteBook);

// --- ROTAS DE FILTRO ---
router.get('/livros/categoria/:categoriaId', authMiddleware, getBooksByCategory);
router.get('/livros/autor/:autorId', authMiddleware, getBooksByAuthor);


// --- Nova Rota de Importação ---
router.post(
    '/livros/importar', 
    authMiddleware,
    // --- CORREÇÃO AQUI ---
    checkRole(['bibliotecario']), // Garante que só bibliotecários acessem
    upload.single('file'), 
    importarLivrosCSV 
);
// --- Fim da Nova Rota ---

module.exports = router;
