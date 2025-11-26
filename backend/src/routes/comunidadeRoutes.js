const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const authMiddleware = require('../middlewares/authMiddleware');

// =====================================================
// ROTA DE USUÁRIOS ATIVOS/ONLINE
// =====================================================

/**
 * GET /api/comunidade/usuarios-ativos
 * Busca usuários ativos/online baseado em access_logs
 * Acesso: Público
 */
router.get('/usuarios-ativos', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;

    // Buscar usuários que fizeram login recentemente (últimas 24h)
    // Considera online se última atividade foi há menos de 15 minutos
    const result = await pool.query(
      `SELECT DISTINCT ON (u.id)
        u.id,
        u.nome,
        u.foto_url,
        al.last_seen,
        al.is_active,
        CASE
          WHEN al.is_active = true AND al.last_seen > NOW() - INTERVAL '15 minutes' THEN true
          ELSE false
        END as online,
        CASE
          WHEN al.last_seen > NOW() - INTERVAL '1 hour' THEN 'Há menos de 1h'
          WHEN al.last_seen > NOW() - INTERVAL '24 hours' THEN 'Hoje'
          ELSE 'Offline'
        END as ultima_atividade
       FROM usuario u
       LEFT JOIN access_logs al ON u.id = al.usuario_id
       WHERE u.tipo_usuario = 'aluno'
       AND al.login_time > NOW() - INTERVAL '7 days'
       ORDER BY u.id, al.last_seen DESC
       LIMIT $1`,
      [limit]
    );

    // Contar total de usuários online
    const onlineCount = await pool.query(
      `SELECT COUNT(DISTINCT al.usuario_id) as count
       FROM access_logs al
       WHERE al.is_active = true
       AND al.last_seen > NOW() - INTERVAL '15 minutes'`
    );

    res.json({
      success: true,
      data: {
        usuarios: result.rows.map(row => ({
          id: row.id,
          nome: row.nome,
          foto_url: row.foto_url,
          online: row.online,
          ultima_atividade: row.ultima_atividade
        })),
        total_online: parseInt(onlineCount.rows[0].count)
      }
    });
  } catch (error) {
    console.error('Erro ao buscar usuários ativos:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar usuários ativos'
    });
  }
});

// =====================================================
// ROTAS DE AUTORES
// =====================================================

/**
 * GET /api/comunidade/autores
 * Lista todos os autores com estatísticas
 * Acesso: Público
 */
router.get('/autores', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const result = await pool.query(
      `SELECT
        a.id,
        a.nome,
        a.biografia,
        a.foto_url,
        a.nacionalidade,
        a.data_nascimento,
        COUNT(DISTINCT aa.id) as total_avaliacoes,
        COALESCE(ROUND(AVG(aa.nota)::numeric, 1), 0) as media_notas,
        COUNT(DISTINCT la.livro_id) as total_livros
       FROM autor a
       LEFT JOIN avaliacoes_autor aa ON a.id = aa.autor_id
       LEFT JOIN livro_autor la ON a.id = la.autor_id
       GROUP BY a.id, a.nome, a.biografia, a.foto_url, a.nacionalidade, a.data_nascimento
       ORDER BY total_avaliacoes DESC, a.nome ASC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    const countResult = await pool.query('SELECT COUNT(*) FROM autor');
    const totalItens = parseInt(countResult.rows[0].count);

    res.json({
      success: true,
      data: {
        autores: result.rows.map(row => ({
          id: row.id,
          nome: row.nome,
          biografia: row.biografia,
          foto_url: row.foto_url,
          nacionalidade: row.nacionalidade,
          data_nascimento: row.data_nascimento,
          estatisticas: {
            total_avaliacoes: parseInt(row.total_avaliacoes),
            media_notas: parseFloat(row.media_notas),
            total_livros: parseInt(row.total_livros)
          }
        })),
        paginacao: {
          pagina_atual: page,
          total_paginas: Math.ceil(totalItens / limit),
          total_itens: totalItens
        }
      }
    });
  } catch (error) {
    console.error('Erro ao buscar autores:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar autores'
    });
  }
});

/**
 * GET /api/comunidade/autores/:id
 * Busca detalhes de um autor com avaliações
 * Acesso: Público
 */
router.get('/autores/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Buscar dados do autor
    const autorResult = await pool.query(
      `SELECT
        a.id,
        a.nome,
        a.biografia,
        a.foto_url,
        a.nacionalidade,
        a.data_nascimento
       FROM autor a
       WHERE a.id = $1`,
      [id]
    );

    if (autorResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Autor não encontrado'
      });
    }

    const autor = autorResult.rows[0];

    // Buscar estatísticas
    const statsResult = await pool.query(
      `SELECT
        COUNT(DISTINCT aa.id) as total_avaliacoes,
        COALESCE(ROUND(AVG(aa.nota)::numeric, 1), 0) as media_notas,
        COUNT(DISTINCT la.livro_id) as total_livros
       FROM autor a
       LEFT JOIN avaliacoes_autor aa ON a.id = aa.autor_id
       LEFT JOIN livro_autor la ON a.id = la.autor_id
       WHERE a.id = $1
       GROUP BY a.id`,
      [id]
    );

    const stats = statsResult.rows[0] || { total_avaliacoes: 0, media_notas: 0, total_livros: 0 };

    // Buscar avaliações com curtidas e respostas
    const avaliacoesResult = await pool.query(
      `SELECT
        aa.id,
        aa.autor_id,
        aa.usuario_id,
        aa.nota,
        aa.comentario,
        aa.data_criacao,
        u.nome as usuario_nome,
        u.foto_url as usuario_foto,
        COUNT(DISTINCT cc.id) as total_curtidas,
        COUNT(DISTINCT rc.id) as total_respostas
       FROM avaliacoes_autor aa
       JOIN usuario u ON aa.usuario_id = u.id
       LEFT JOIN curtidas_comentario cc ON cc.tipo_comentario = 'autor' AND cc.comentario_id = aa.id
       LEFT JOIN respostas_comentario rc ON rc.tipo_comentario = 'autor' AND rc.comentario_id = aa.id
       WHERE aa.autor_id = $1
       GROUP BY aa.id, aa.autor_id, aa.usuario_id, aa.nota, aa.comentario, aa.data_criacao, u.nome, u.foto_url
       ORDER BY total_curtidas DESC, aa.data_criacao DESC`,
      [id]
    );

    // Buscar livros do autor
    const livrosResult = await pool.query(
      `SELECT
        l.id,
        l.titulo,
        l.capa_url,
        l.ano_publicacao
       FROM livro l
       JOIN livro_autor la ON l.id = la.livro_id
       WHERE la.autor_id = $1
       ORDER BY l.ano_publicacao DESC`,
      [id]
    );

    res.json({
      success: true,
      data: {
        autor: {
          ...autor,
          estatisticas: {
            total_avaliacoes: parseInt(stats.total_avaliacoes),
            media_notas: parseFloat(stats.media_notas),
            total_livros: parseInt(stats.total_livros)
          }
        },
        avaliacoes: avaliacoesResult.rows.map(row => ({
          id: row.id,
          autor_id: row.autor_id,
          usuario_id: row.usuario_id,
          nota: row.nota,
          comentario: row.comentario,
          data_criacao: row.data_criacao,
          usuario: {
            id: row.usuario_id,
            nome: row.usuario_nome,
            foto_url: row.usuario_foto
          },
          interacoes: {
            total_curtidas: parseInt(row.total_curtidas),
            total_respostas: parseInt(row.total_respostas)
          }
        })),
        livros: livrosResult.rows
      }
    });
  } catch (error) {
    console.error('Erro ao buscar autor:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar autor'
    });
  }
});

/**
 * POST /api/comunidade/autores/:id/avaliacoes
 * Cria uma avaliação para um autor
 * Acesso: Autenticado
 */
router.post('/autores/:id/avaliacoes', authMiddleware, async (req, res) => {
  try {
    const { id: autor_id } = req.params;
    const { nota, comentario } = req.body;
    const usuario_id = req.usuario.id;

    // Validações
    if (!nota || nota < 1 || nota > 5) {
      return res.status(400).json({
        success: false,
        error: 'Nota deve estar entre 1 e 5'
      });
    }

    if (!comentario || comentario.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Comentário é obrigatório'
      });
    }

    // Verificar se autor existe
    const autorExists = await pool.query('SELECT id FROM autor WHERE id = $1', [autor_id]);
    if (autorExists.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Autor não encontrado'
      });
    }

    // Inserir avaliação
    const result = await pool.query(
      `INSERT INTO avaliacoes_autor (autor_id, usuario_id, nota, comentario)
       VALUES ($1, $2, $3, $4)
       RETURNING id, autor_id, usuario_id, nota, comentario, data_criacao`,
      [autor_id, usuario_id, nota, comentario.trim()]
    );

    const avaliacao = result.rows[0];

    // Buscar nome do usuário
    const userResult = await pool.query('SELECT nome, foto_url FROM usuario WHERE id = $1', [usuario_id]);
    const user = userResult.rows[0];

    res.status(201).json({
      success: true,
      data: {
        avaliacao: {
          ...avaliacao,
          usuario: {
            id: usuario_id,
            nome: user.nome,
            foto_url: user.foto_url
          },
          interacoes: {
            total_curtidas: 0,
            total_respostas: 0
          }
        }
      }
    });
  } catch (error) {
    if (error.code === '23505') { // Unique violation
      return res.status(400).json({
        success: false,
        error: 'Você já avaliou este autor'
      });
    }

    console.error('Erro ao criar avaliação de autor:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao criar avaliação'
    });
  }
});

// =====================================================
// ROTAS DE CURTIDAS
// =====================================================

/**
 * POST /api/comunidade/comentarios/:tipo/:id/curtir
 * Curtir ou descurtir um comentário
 * Acesso: Autenticado
 */
router.post('/comentarios/:tipo/:id/curtir', authMiddleware, async (req, res) => {
  try {
    const { tipo, id } = req.params;
    const usuario_id = req.usuario.id;

    // Validar tipo
    if (!['livro', 'autor'].includes(tipo)) {
      return res.status(400).json({
        success: false,
        error: 'Tipo inválido. Use "livro" ou "autor"'
      });
    }

    // Verificar se já curtiu
    const existingLike = await pool.query(
      'SELECT id FROM curtidas_comentario WHERE tipo_comentario = $1 AND comentario_id = $2 AND usuario_id = $3',
      [tipo, id, usuario_id]
    );

    if (existingLike.rows.length > 0) {
      // Descurtir (remover curtida)
      await pool.query(
        'DELETE FROM curtidas_comentario WHERE tipo_comentario = $1 AND comentario_id = $2 AND usuario_id = $3',
        [tipo, id, usuario_id]
      );

      res.json({
        success: true,
        data: {
          curtido: false,
          mensagem: 'Curtida removida'
        }
      });
    } else {
      // Curtir (adicionar curtida)
      await pool.query(
        'INSERT INTO curtidas_comentario (tipo_comentario, comentario_id, usuario_id) VALUES ($1, $2, $3)',
        [tipo, id, usuario_id]
      );

      res.json({
        success: true,
        data: {
          curtido: true,
          mensagem: 'Comentário curtido'
        }
      });
    }
  } catch (error) {
    console.error('Erro ao curtir comentário:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao processar curtida'
    });
  }
});

/**
 * GET /api/comunidade/comentarios/:tipo/:id/curtidas
 * Verificar se usuário curtiu e total de curtidas
 * Acesso: Autenticado
 */
router.get('/comentarios/:tipo/:id/curtidas', authMiddleware, async (req, res) => {
  try {
    const { tipo, id } = req.params;
    const usuario_id = req.usuario.id;

    // Total de curtidas
    const totalResult = await pool.query(
      'SELECT COUNT(*) FROM curtidas_comentario WHERE tipo_comentario = $1 AND comentario_id = $2',
      [tipo, id]
    );

    // Verificar se usuário curtiu
    const userLikeResult = await pool.query(
      'SELECT id FROM curtidas_comentario WHERE tipo_comentario = $1 AND comentario_id = $2 AND usuario_id = $3',
      [tipo, id, usuario_id]
    );

    res.json({
      success: true,
      data: {
        total_curtidas: parseInt(totalResult.rows[0].count),
        curtido_por_usuario: userLikeResult.rows.length > 0
      }
    });
  } catch (error) {
    console.error('Erro ao buscar curtidas:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar curtidas'
    });
  }
});

// =====================================================
// ROTAS DE RESPOSTAS
// =====================================================

/**
 * POST /api/comunidade/comentarios/:tipo/:id/respostas
 * Criar resposta a um comentário
 * Acesso: Autenticado
 */
router.post('/comentarios/:tipo/:id/respostas', authMiddleware, async (req, res) => {
  try {
    const { tipo, id } = req.params;
    const { texto } = req.body;
    const usuario_id = req.usuario.id;

    // Validações
    if (!['livro', 'autor'].includes(tipo)) {
      return res.status(400).json({
        success: false,
        error: 'Tipo inválido'
      });
    }

    if (!texto || texto.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Texto da resposta é obrigatório'
      });
    }

    // Inserir resposta
    const result = await pool.query(
      `INSERT INTO respostas_comentario (tipo_comentario, comentario_id, usuario_id, texto)
       VALUES ($1, $2, $3, $4)
       RETURNING id, tipo_comentario, comentario_id, usuario_id, texto, data_criacao`,
      [tipo, id, usuario_id, texto.trim()]
    );

    const resposta = result.rows[0];

    // Buscar dados do usuário
    const userResult = await pool.query('SELECT nome, foto_url FROM usuario WHERE id = $1', [usuario_id]);
    const user = userResult.rows[0];

    res.status(201).json({
      success: true,
      data: {
        resposta: {
          ...resposta,
          usuario: {
            id: usuario_id,
            nome: user.nome,
            foto_url: user.foto_url
          }
        }
      }
    });
  } catch (error) {
    console.error('Erro ao criar resposta:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao criar resposta'
    });
  }
});

/**
 * GET /api/comunidade/comentarios/:tipo/:id/respostas
 * Listar respostas de um comentário
 * Acesso: Público
 */
router.get('/comentarios/:tipo/:id/respostas', async (req, res) => {
  try {
    const { tipo, id } = req.params;

    const result = await pool.query(
      `SELECT
        rc.id,
        rc.tipo_comentario,
        rc.comentario_id,
        rc.usuario_id,
        rc.texto,
        rc.data_criacao,
        u.nome as usuario_nome,
        u.foto_url as usuario_foto
       FROM respostas_comentario rc
       JOIN usuario u ON rc.usuario_id = u.id
       WHERE rc.tipo_comentario = $1 AND rc.comentario_id = $2
       ORDER BY rc.data_criacao ASC`,
      [tipo, id]
    );

    res.json({
      success: true,
      data: {
        respostas: result.rows.map(row => ({
          id: row.id,
          tipo_comentario: row.tipo_comentario,
          comentario_id: row.comentario_id,
          usuario_id: row.usuario_id,
          texto: row.texto,
          data_criacao: row.data_criacao,
          usuario: {
            id: row.usuario_id,
            nome: row.usuario_nome,
            foto_url: row.usuario_foto
          }
        }))
      }
    });
  } catch (error) {
    console.error('Erro ao buscar respostas:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar respostas'
    });
  }
});

// =====================================================
// ROTA DE AVALIAÇÕES DE LIVROS
// =====================================================

/**
 * GET /api/comunidade/livros/avaliacoes
 * Retorna as avaliações mais recentes de livros da comunidade
 * Acesso: Público
 */
router.get('/livros/avaliacoes', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;

    const result = await pool.query(
      `SELECT
        av.id,
        av.livro_id,
        av.usuario_id,
        av.nota,
        av.comentario,
        av.data_criacao,
        u.nome as usuario_nome,
        u.foto_url as usuario_foto,
        l.titulo as livro_titulo,
        l.capa_url as livro_capa,
        COUNT(DISTINCT cc.id) as total_curtidas,
        COUNT(DISTINCT rc.id) as total_respostas
       FROM avaliacoes av
       JOIN usuario u ON av.usuario_id = u.id
       JOIN livro l ON av.livro_id = l.id
       LEFT JOIN curtidas_comentario cc ON cc.tipo_comentario = 'livro' AND cc.comentario_id = av.id
       LEFT JOIN respostas_comentario rc ON rc.tipo_comentario = 'livro' AND rc.comentario_id = av.id
       WHERE av.comentario IS NOT NULL AND av.comentario != ''
       GROUP BY av.id, av.livro_id, av.usuario_id, av.nota, av.comentario, av.data_criacao,
                u.nome, u.foto_url, l.titulo, l.capa_url
       ORDER BY av.data_criacao DESC
       LIMIT $1`,
      [limit]
    );

    res.json({
      success: true,
      data: {
        avaliacoes: result.rows.map(row => ({
          id: row.id,
          livro_id: row.livro_id,
          usuario_id: row.usuario_id,
          nota: row.nota,
          comentario: row.comentario,
          data_criacao: row.data_criacao,
          usuario: {
            id: row.usuario_id,
            nome: row.usuario_nome,
            foto_url: row.usuario_foto
          },
          livro: {
            id: row.livro_id,
            titulo: row.livro_titulo,
            capa_url: row.livro_capa
          },
          interacoes: {
            total_curtidas: parseInt(row.total_curtidas),
            total_respostas: parseInt(row.total_respostas)
          }
        }))
      }
    });
  } catch (error) {
    console.error('Erro ao buscar avaliações de livros:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar avaliações'
    });
  }
});

/**
 * POST /api/comunidade/livros/:id/avaliacoes
 * Cria uma avaliação para um livro
 * Acesso: Autenticado
 */
router.post('/livros/:id/avaliacoes', authMiddleware, async (req, res) => {
  try {
    const { id: livro_id } = req.params;
    const { nota, comentario } = req.body;
    const usuario_id = req.usuario.id;

    // Validações
    if (!nota || nota < 1 || nota > 5) {
      return res.status(400).json({
        success: false,
        error: 'Nota deve estar entre 1 e 5'
      });
    }

    if (!comentario || comentario.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Comentário é obrigatório'
      });
    }

    // Verificar se livro existe
    const livroExists = await pool.query('SELECT id, titulo, capa_url FROM livro WHERE id = $1', [livro_id]);
    if (livroExists.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Livro não encontrado'
      });
    }

    const livro = livroExists.rows[0];

    // Verificar se já avaliou
    const avaliacaoExistente = await pool.query(
      'SELECT id FROM avaliacoes WHERE livro_id = $1 AND usuario_id = $2',
      [livro_id, usuario_id]
    );

    if (avaliacaoExistente.rows.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Você já avaliou este livro'
      });
    }

    // Inserir avaliação
    const result = await pool.query(
      `INSERT INTO avaliacoes (livro_id, usuario_id, nota, comentario)
       VALUES ($1, $2, $3, $4)
       RETURNING id, livro_id, usuario_id, nota, comentario, data_criacao`,
      [livro_id, usuario_id, nota, comentario.trim()]
    );

    const avaliacao = result.rows[0];

    // Buscar dados do usuário
    const userResult = await pool.query('SELECT nome, foto_url FROM usuario WHERE id = $1', [usuario_id]);
    const user = userResult.rows[0];

    res.status(201).json({
      success: true,
      data: {
        avaliacao: {
          ...avaliacao,
          usuario: {
            id: usuario_id,
            nome: user.nome,
            foto_url: user.foto_url
          },
          livro: {
            id: livro.id,
            titulo: livro.titulo,
            capa_url: livro.capa_url
          },
          interacoes: {
            total_curtidas: 0,
            total_respostas: 0
          }
        }
      }
    });
  } catch (error) {
    console.error('Erro ao criar avaliação de livro:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao criar avaliação'
    });
  }
});

/**
 * GET /api/comunidade/estatisticas
 * Retorna estatísticas gerais da comunidade
 * Acesso: Público
 */
router.get('/estatisticas', async (req, res) => {
  try {
    // Total de usuários
    const usuariosResult = await pool.query(
      `SELECT COUNT(*) as count FROM usuario WHERE tipo_usuario = 'aluno'`
    );

    // Total de livros
    const livrosResult = await pool.query(
      `SELECT COUNT(*) as count FROM livro`
    );

    // Total de avaliações (livros + autores)
    const avaliacoesLivrosResult = await pool.query(
      `SELECT COUNT(*) as count FROM avaliacoes`
    );
    const avaliacoesAutoresResult = await pool.query(
      `SELECT COUNT(*) as count FROM avaliacoes_autor`
    );

    // Usuários online
    const onlineResult = await pool.query(
      `SELECT COUNT(DISTINCT al.usuario_id) as count
       FROM access_logs al
       WHERE al.is_active = true
       AND al.last_seen > NOW() - INTERVAL '15 minutes'`
    );

    res.json({
      success: true,
      data: {
        total_usuarios: parseInt(usuariosResult.rows[0].count),
        total_livros: parseInt(livrosResult.rows[0].count),
        total_avaliacoes: parseInt(avaliacoesLivrosResult.rows[0].count) + parseInt(avaliacoesAutoresResult.rows[0].count),
        usuarios_online: parseInt(onlineResult.rows[0].count)
      }
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar estatísticas'
    });
  }
});

// =====================================================
// ROTA DE SWIPE (Descoberta de Livros)
// =====================================================

/**
 * GET /api/comunidade/livros/swipe
 * Retorna livros para descoberta (com resumo IA)
 * Acesso: Autenticado
 */
router.get('/livros/swipe', authMiddleware, async (req, res) => {
  try {
    const usuario_id = req.usuario.id;
    const limit = parseInt(req.query.limit) || 10;

    // Buscar livros que o usuário ainda não leu/avaliou
    const result = await pool.query(
      `SELECT
        l.id,
        l.titulo,
        l.capa_url,
        l.ano_publicacao,
        ri.resumo_texto,
        STRING_AGG(DISTINCT a.nome, ', ') as autores,
        COALESCE(ROUND(AVG(av.nota)::numeric, 1), 0) as media_notas,
        COUNT(DISTINCT av.id) as total_avaliacoes
       FROM livro l
       LEFT JOIN resumo_ia ri ON l.id = ri.livro_id
       LEFT JOIN livro_autor la ON l.id = la.livro_id
       LEFT JOIN autor a ON la.autor_id = a.id
       LEFT JOIN avaliacoes av ON l.id = av.livro_id
       WHERE l.id NOT IN (
         SELECT DISTINCT e.livro_id
         FROM emprestimo e
         WHERE e.usuario_id = $1 AND e.status = 'devolvido'
       )
       AND l.id NOT IN (
         SELECT DISTINCT av2.livro_id
         FROM avaliacoes av2
         WHERE av2.usuario_id = $1
       )
       GROUP BY l.id, l.titulo, l.capa_url, l.ano_publicacao, ri.resumo_texto
       ORDER BY RANDOM()
       LIMIT $2`,
      [usuario_id, limit]
    );

    res.json({
      success: true,
      data: {
        livros: result.rows.map(row => ({
          id: row.id,
          titulo: row.titulo,
          capa_url: row.capa_url,
          ano_publicacao: row.ano_publicacao,
          autores: row.autores,
          resumo: row.resumo_texto,
          estatisticas: {
            media_notas: parseFloat(row.media_notas),
            total_avaliacoes: parseInt(row.total_avaliacoes)
          }
        }))
      }
    });
  } catch (error) {
    console.error('Erro ao buscar livros para swipe:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar livros'
    });
  }
});

module.exports = router;
