// backend/src/controllers/categoryController.js
const pool = require('../config/database');

const getAllCategories = async (req, res) => { /* ... código existente ... */ };

// NOVA FUNÇÃO
const createCategory = async (req, res) => {
  const { nome, descricao } = req.body;
  if (!nome) {
    return res.status(400).json({ mensagem: 'O nome da categoria é obrigatório.' });
  }
  try {
    const newCategory = await pool.query(
      'INSERT INTO categoria (nome, descricao) VALUES ($1, $2) RETURNING *',
      [nome, descricao]
    );
    res.status(201).json(newCategory.rows[0]);
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro interno do servidor.' });
  }
};

module.exports = { getAllCategories, createCategory };