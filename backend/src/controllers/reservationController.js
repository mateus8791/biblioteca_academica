// Arquivo: backend/src/controllers/reservationController.js

const pool = require('../config/database');

// --- Função para CRIAR uma reserva (já existia) ---
const createReservation = async (req, res) => {
  const usuarioId = req.usuarioId; 
  const { livro_id, data_expiracao } = req.body;

  if (!livro_id || !data_expiracao) {
    return res.status(400).json({ mensagem: 'O ID do livro e a data de retirada são obrigatórios.' });
  }

  const client = await pool.connect();
  try {
    const limiteQuery = "SELECT COUNT(*) FROM reserva WHERE usuario_id = $1 AND status = 'ativa'";
    const { rows } = await client.query(limiteQuery, [usuarioId]);
    const numReservasAtivas = parseInt(rows[0].count, 10);

    if (numReservasAtivas >= 1) {
      return res.status(403).json({ mensagem: 'Limite de 1 reserva ativa por vez atingido.' });
    }
    
    await client.query('BEGIN');
    const novaReserva = await client.query(
      "INSERT INTO reserva (livro_id, usuario_id, data_expiracao, status) VALUES ($1, $2, $3, 'ativa') RETURNING *",
      [livro_id, usuarioId, data_expiracao]
    );
    await client.query('COMMIT');
    res.status(201).json(novaReserva.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Erro ao criar reserva:', error);
    res.status(500).json({ mensagem: 'Erro interno do servidor.' });
  } finally {
    client.release();
  }
};


// --- NOVA FUNÇÃO PARA CANCELAR UMA RESERVA ---
const cancelReservation = async (req, res) => {
  const usuarioId = req.usuarioId; // ID do usuário logado
  const { id } = req.params;      // ID da reserva que vem da URL (ex: /api/reservas/meu-id-aqui)

  try {
    // Primeiro, vamos garantir que a reserva pertence ao usuário que está tentando cancelá-la
    const updateQuery = `
      UPDATE reserva 
      SET status = 'cancelada' 
      WHERE id = $1 AND usuario_id = $2 AND status = 'ativa'
      RETURNING *;
    `;
    
    const { rows, rowCount } = await pool.query(updateQuery, [id, usuarioId]);

    // Se rowCount for 0, significa que nenhuma linha foi alterada.
    // Isso acontece se a reserva não existe, não pertence ao usuário ou já não estava 'ativa'.
    if (rowCount === 0) {
      return res.status(404).json({ mensagem: 'Reserva não encontrada ou não pertence ao usuário.' });
    }

    res.status(200).json({ mensagem: 'Reserva cancelada com sucesso!', reserva: rows[0] });

  } catch (error) {
    console.error("Erro ao cancelar reserva:", error);
    res.status(500).json({ mensagem: 'Erro interno do servidor.' });
  }
};


module.exports = {
  createReservation,
  cancelReservation, // Exporta a nova função
};
