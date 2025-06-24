// backend/src/controllers/authorController.js
const pool = require('../config/database');

const getAllAuthors = async (req, res) => { /* ... código existente ... */ };

// NOVA FUNÇÃO
const createAuthor = async (req, res) => {
  const { nome, biografia, nacionalidade } = req.body;
  if (!nome) {
    return res.status(400).json({ mensagem: 'O nome do autor é obrigatório.' });
  }
  try {
    const newAuthor = await pool.query(
      'INSERT INTO autor (nome, biografia, nacionalidade) VALUES ($1, $2, $3) RETURNING *',
      [nome, biografia, nacionalidade]
    );
    res.status(201).json(newAuthor.rows[0]);
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro interno do servidor.' });
  }
};

module.exports = { getAllAuthors, createAuthor };