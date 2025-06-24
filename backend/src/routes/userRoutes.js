// Arquivo: backend/src/routes/userRoutes.js

const express = require('express');
const { 
    getAllUsers,
    createUser,
    getUserById,
    updateUser,
    deleteUser 
} = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const { checkRole } = require('../middlewares/roleMiddleware');

const router = express.Router();

// Usamos um array de middlewares para proteger as rotas
const adminOnly = [authMiddleware, checkRole(['bibliotecario', 'admin'])];

// Rota para LISTAR todos os usuários e CRIAR um novo usuário
router.get('/usuarios', adminOnly, getAllUsers);
router.post('/usuarios', adminOnly, createUser);

// Novas rotas para um usuário específico (GET, PUT, DELETE)
router.get('/usuarios/:id', adminOnly, getUserById);
router.put('/usuarios/:id', adminOnly, updateUser);
router.delete('/usuarios/:id', adminOnly, deleteUser);

module.exports = router;