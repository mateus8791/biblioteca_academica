// Arquivo: backend/src/controllers/conquistasController.js

const pool = require('../config/database');

const getMinhasConquistas = async (req, res) => {
  console.log('🔍 [CONQUISTAS] Requisição recebida');
  console.log('🔍 [CONQUISTAS] req.usuario:', req.usuario);

  if (!req.usuario || !req.usuario.id) {
    console.error('❌ [CONQUISTAS] Token antigo detectado (sem campo id)');
    console.error('❌ [CONQUISTAS] req.usuario:', req.usuario);
    return res.status(401).json({
      message: 'Token desatualizado. Por favor, faça logout e login novamente para gerar um novo token.',
      code: 'TOKEN_OUTDATED'
    });
  }

  const { id: usuarioId } = req.usuario;

  try {
    console.log(`✅ [CONQUISTAS] Buscando dados de conquistas para o usuário: ${usuarioId}`);

    // --- CORREÇÃO: Separamos as consultas para evitar o erro de agregação ---
    const [
      historicoResult,
      totalLidosResult,
      devolucoesNoPrazoResult,
      generosDiferentesResult
    ] = await Promise.all([
      // Query 1: Busca o histórico de livros lidos (sem alteração)
      pool.query(`
        SELECT 
          l.id as livro_id, l.titulo, l.capa_url,
          (SELECT a.nome FROM autor a JOIN livro_autor la ON a.id = la.autor_id WHERE la.livro_id = l.id LIMIT 1) as autor_nome,
          TO_CHAR(e.data_devolucao_real, 'DD/MM/YYYY') as data_conclusao
        FROM emprestimo e
        JOIN livro l ON e.livro_id = l.id
        WHERE e.usuario_id = $1 AND e.status = 'devolvido'
        ORDER BY e.data_devolucao_real DESC;
      `, [usuarioId]),

      // Query 2: Conta o total de livros lidos
      pool.query("SELECT COUNT(*) FROM emprestimo WHERE usuario_id = $1 AND status = 'devolvido'", [usuarioId]),

      // Query 3: Conta as devoluções no prazo
      pool.query("SELECT COUNT(*) FROM emprestimo WHERE usuario_id = $1 AND status = 'devolvido' AND data_devolucao_real <= data_devolucao_prevista", [usuarioId]),
      
      // Query 4: Conta os gêneros diferentes
      pool.query(`
        SELECT COUNT(DISTINCT lc.categoria_id) 
        FROM emprestimo e
        JOIN livro_categoria lc ON e.livro_id = lc.livro_id
        WHERE e.usuario_id = $1 AND e.status = 'devolvido'
      `, [usuarioId])
    ]);

    const historico = historicoResult.rows;
    const totalLidos = parseInt(totalLidosResult.rows[0].count, 10);
    const devolucoesNoPrazo = parseInt(devolucoesNoPrazoResult.rows[0].count, 10);
    const generosDiferentes = parseInt(generosDiferentesResult.rows[0].count, 10);

    // Lógica de Gamificação (agora com os dados corretos)
    let nivelLeitor = { nome: 'Leitor Iniciante', proximoNivel: 5 };
    if (totalLidos >= 15) {
      nivelLeitor = { nome: 'Mestre da Biblioteca', proximoNivel: Infinity };
    } else if (totalLidos >= 5) {
      nivelLeitor = { nome: 'Leitor Voraz', proximoNivel: 15 };
    }

    const conquistas = [];
    if (totalLidos >= 1) conquistas.push({ nome: 'Primeira Leitura', descricao: 'Você leu seu primeiro livro!', icon: 'BookOpen' });
    if (devolucoesNoPrazo >= 5) conquistas.push({ nome: 'Pontualidade Perfeita', descricao: 'Devolveu 5 livros no prazo.', icon: 'Clock' });
    if (generosDiferentes >= 3) conquistas.push({ nome: 'Explorador de Gêneros', descricao: 'Leu livros de 3 categorias diferentes.', icon: 'Compass' });
    
    const conquistasData = {
      nivelLeitor,
      totalLivrosLidos: totalLidos,
      historico,
      conquistas,
    };

    res.status(200).json(conquistasData);

  } catch (error) {
    console.error('Erro ao buscar dados de conquistas:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

module.exports = {
  getMinhasConquistas,
};