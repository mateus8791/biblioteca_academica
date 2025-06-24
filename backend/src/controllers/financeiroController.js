// Arquivo: backend/src/controllers/financeiroController.js

const pool = require('../config/database');
const { registrarAcao } = require('../services/auditoriaService');

// Função para criar uma nova transação financeira
const createTransacao = async (req, res) => {
  const { descricao, valor, tipo, usuario_id, emprestimo_id } = req.body;

  // Validação dos dados
  if (!descricao || !valor || !tipo) {
    return res.status(400).json({ message: 'Descrição, valor e tipo são obrigatórios.' });
  }

  try {
    const query = `
      INSERT INTO "Transacao_Financeira" (descricao, valor, tipo, usuario_id, emprestimo_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [descricao, valor, tipo, usuario_id, emprestimo_id]);

    // Registra a ação na auditoria
    const adminId = req.usuario.id;
    await registrarAcao(adminId, 'REGISTRO_FINANCEIRO', `Registrou transação: ${descricao} - R$ ${valor}`);

    res.status(201).json({ message: 'Transação registrada com sucesso!', transacao: rows[0] });

  } catch (error) {
    console.error('Erro ao registrar transação financeira:', error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

module.exports = {
  createTransacao,
};