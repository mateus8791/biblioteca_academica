// Arquivo: backend/src/controllers/dashboardController.js

const pool = require('../config/database');

const getLoanDashboardData = async (req, res) => {
  try {
    console.log("Buscando dados para o Dashboard de Empréstimos e Finanças...");

    // Usamos Promise.all para executar todas as consultas em paralelo
    const [
      emprestimosRecentesResult,
      statsFinanceirasResult,
      livrosMaisEmprestadosResult,
    ] = await Promise.all([
      // Query 1: CORRIGIDO - Nomes de tabela em minúsculo e sem aspas
      pool.query(`
        SELECT
          e.id,
          l.titulo AS livro_titulo,
          u.nome AS usuario_nome,
          e.data_emprestimo,
          e.data_devolucao_prevista,
          e.status
        FROM emprestimo e
        JOIN usuario u ON e.usuario_id = u.id
        JOIN livro l ON e.livro_id = l.id
        ORDER BY e.data_emprestimo DESC
        LIMIT 10;
      `),
      // Query 2: CORRIGIDO - Nome da tabela em minúsculo e sem aspas
      pool.query(`
        SELECT
          COALESCE(SUM(valor) FILTER (WHERE tipo = 'multa_atraso'), 0) AS total_multas,
          COALESCE(SUM(valor) FILTER (WHERE tipo = 'venda_livro'), 0) AS total_vendas,
          COALESCE(SUM(valor) FILTER (WHERE tipo = 'orcamento_acervo'), 0) AS orcamento_acervo
        FROM "Transacao_Financeira";
      `),
      // Query 3: CORRIGIDO - Nomes de tabela em minúsculo e sem aspas
      pool.query(`
        SELECT 
          l.titulo,
          COUNT(e.id) AS total_emprestimos
        FROM emprestimo e
        JOIN livro l ON e.livro_id = l.id
        GROUP BY l.titulo
        ORDER BY total_emprestimos DESC
        LIMIT 5;
      `),
    ]);

    // Montamos o objeto de resposta final para o frontend
    const dashboardData = {
      emprestimosRecentes: emprestimosRecentesResult.rows,
      statsFinanceiras: statsFinanceirasResult.rows[0],
      livrosMaisPopulares: livrosMaisEmprestadosResult.rows,
    };

    res.status(200).json(dashboardData);

  } catch (error) {
    console.error('Erro ao buscar dados do dashboard de empréstimos:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

module.exports = {
  getLoanDashboardData,
};