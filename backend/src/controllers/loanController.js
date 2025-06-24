// Arquivo: backend/src/controllers/loanController.js

const pool = require('../config/database');

// Função para buscar todos os empréstimos e reservas de um usuário específico
const getMyBooks = async (req, res) => {
  // O ID do usuário vem do nosso middleware de segurança
  const usuarioId = req.usuarioId;

  try {
    // --- Query para Empréstimos Ativos ---
    // Busca empréstimos que ainda não foram devolvidos
    const emprestimosQuery = `
      SELECT 
        e.id,
        'emprestimo' as tipo,
        l.titulo,
        l.capa_url,
        a.nome as autor_nome,
        e.data_emprestimo,
        e.data_devolucao_prevista
      FROM emprestimo e
      JOIN livro l ON e.livro_id = l.id
      LEFT JOIN livro_autor la ON l.id = la.livro_id
      LEFT JOIN autor a ON la.autor_id = a.id
      WHERE e.usuario_id = $1 AND e.status = 'ativo'
      GROUP BY e.id, l.id, a.nome;
    `;
    const emprestimosResult = await pool.query(emprestimosQuery, [usuarioId]);

    // --- Query para Reservas Ativas ---
    // Busca reservas que ainda não foram atendidas ou canceladas
    const reservasQuery = `
      SELECT 
        r.id,
        'reserva' as tipo,
        l.titulo,
        l.capa_url,
        a.nome as autor_nome,
        r.data_reserva,
        r.data_expiracao
      FROM reserva r
      JOIN livro l ON r.livro_id = l.id
      LEFT JOIN livro_autor la ON l.id = la.livro_id
      LEFT JOIN autor a ON la.autor_id = a.id
      WHERE r.usuario_id = $1 AND r.status = 'ativa'
      GROUP BY r.id, l.id, a.nome;
    `;
    const reservasResult = await pool.query(reservasQuery, [usuarioId]);

    // Junta os dois resultados em uma única lista
    const meusLivros = [...emprestimosResult.rows, ...reservasResult.rows];
    
    res.status(200).json(meusLivros);

  } catch (error) {
    console.error("Erro ao buscar 'Meus Livros':", error);
    res.status(500).json({ mensagem: 'Erro interno do servidor.' });
  }
};

module.exports = {
  getMyBooks,
};
