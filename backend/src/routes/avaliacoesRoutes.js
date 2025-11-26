const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const authMiddleware = require('../middlewares/authMiddleware');

/**
 * GET /api/livros/:livro_id/avaliacoes
 * Busca todas as avaliações de um livro
 * Acesso: Público
 */
router.get('/livros/:livro_id/avaliacoes', async (req, res) => {
  try {
    const { livro_id } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Buscar avaliações com informações do usuário
    const avaliacoesResult = await pool.query(
      `SELECT
        a.id,
        a.livro_id,
        a.usuario_id,
        a.nota,
        a.comentario,
        a.data_criacao,
        u.nome as usuario_nome
       FROM avaliacoes a
       JOIN usuarios u ON a.usuario_id = u.id
       WHERE a.livro_id = $1
       ORDER BY a.data_criacao DESC
       LIMIT $2 OFFSET $3`,
      [livro_id, limit, offset]
    );

    // Buscar estatísticas
    const statsResult = await pool.query(
      `SELECT
        COUNT(*) as total_avaliacoes,
        ROUND(AVG(nota)::numeric, 1) as media_notas
       FROM avaliacoes
       WHERE livro_id = $1`,
      [livro_id]
    );

    const totalItens = parseInt(statsResult.rows[0].total_avaliacoes);
    const mediaNotas = statsResult.rows[0].media_notas || 0;

    res.json({
      success: true,
      data: {
        avaliacoes: avaliacoesResult.rows.map(row => ({
          id: row.id,
          livro_id: row.livro_id,
          usuario_id: row.usuario_id,
          nota: row.nota,
          comentario: row.comentario,
          data_criacao: row.data_criacao,
          usuario: {
            id: row.usuario_id,
            nome: row.usuario_nome
          }
        })),
        estatisticas: {
          media_notas: mediaNotas.toString(),
          total_avaliacoes: totalItens
        },
        paginacao: {
          pagina_atual: page,
          total_paginas: Math.ceil(totalItens / limit),
          total_itens: totalItens
        }
      }
    });
  } catch (error) {
    console.error('Erro ao buscar avaliações:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar avaliações'
    });
  }
});

/**
 * POST /api/livros/:livro_id/avaliacoes
 * Cria uma nova avaliação
 * Acesso: Autenticado
 */
router.post('/livros/:livro_id/avaliacoes', authMiddleware, async (req, res) => {
  try {
    const { livro_id } = req.params;
    const { nota, comentario } = req.body;
    const usuario_id = req.usuario.id; // ID do usuário autenticado

    // Validações
    if (!nota || nota < 1 || nota > 5) {
      return res.status(400).json({
        success: false,
        error: 'A nota deve estar entre 1 e 5'
      });
    }

    if (!comentario || comentario.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'O comentário é obrigatório'
      });
    }

    if (comentario.trim().length > 1000) {
      return res.status(400).json({
        success: false,
        error: 'O comentário não pode ter mais de 1000 caracteres'
      });
    }

    // Verificar se o livro existe
    const livroExists = await pool.query(
      'SELECT id FROM livro WHERE id = $1',
      [livro_id]
    );

    if (livroExists.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Livro não encontrado'
      });
    }

    // Inserir avaliação
    const result = await pool.query(
      `INSERT INTO avaliacoes (livro_id, usuario_id, nota, comentario)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [livro_id, usuario_id, nota, comentario.trim()]
    );

    res.status(201).json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Erro ao criar avaliação:', error);

    // Tratar erro de constraint UNIQUE (usuário já avaliou)
    if (error.constraint === 'unique_usuario_livro') {
      return res.status(409).json({
        success: false,
        error: 'Você já avaliou este livro'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Erro ao salvar avaliação'
    });
  }
});

/**
 * GET /api/usuarios/meus-livros-lidos
 * Busca todos os livros lidos pelo usuário autenticado
 * Acesso: Autenticado
 */
router.get('/usuarios/meus-livros-lidos', authMiddleware, async (req, res) => {
  try {
    const usuario_id = req.usuario.id;
    console.log('[MEUS-LIVROS] Iniciando busca para usuario_id:', usuario_id);

    // Buscar todos os livros avaliados pelo usuário com estatísticas gerais
    const sqlQuery = `
      SELECT
        l.id,
        l.titulo,
        STRING_AGG(DISTINCT aut.nome, ', ') as autor,
        l.capa_url,
        l.isbn,
        a.id as minha_avaliacao_id,
        a.nota as minha_nota,
        a.comentario as meu_comentario,
        a.data_criacao as minha_data_avaliacao,
        ROUND(AVG(a_all.nota)::numeric, 1) as media_notas,
        COUNT(DISTINCT a_all.id) as total_avaliacoes
      FROM avaliacoes a
      INNER JOIN livro l ON a.livro_id = l.id
      LEFT JOIN livro_autor la ON l.id = la.livro_id
      LEFT JOIN autor aut ON la.autor_id = aut.id
      LEFT JOIN avaliacoes a_all ON a_all.livro_id = l.id
      WHERE a.usuario_id = $1
      GROUP BY l.id, l.titulo, l.capa_url, l.isbn,
               a.id, a.nota, a.comentario, a.data_criacao
      ORDER BY a.data_criacao DESC
    `;

    console.log('[MEUS-LIVROS] Executando SQL query:', sqlQuery);
    console.log('[MEUS-LIVROS] Com parametros:', [usuario_id]);

    const result = await pool.query(sqlQuery, [usuario_id]);

    console.log('[MEUS-LIVROS] Query executada com sucesso. Rows encontradas:', result.rows.length);

    const livros = result.rows.map(row => ({
      id: row.id,
      titulo: row.titulo,
      autor: row.autor,
      capa_url: row.capa_url,
      isbn: row.isbn,
      data_leitura: row.minha_data_avaliacao,
      minha_avaliacao: row.minha_avaliacao_id ? {
        id: row.minha_avaliacao_id,
        nota: row.minha_nota,
        comentario: row.meu_comentario,
        data_criacao: row.minha_data_avaliacao
      } : undefined,
      estatisticas: {
        media_notas: row.media_notas?.toString() || '0',
        total_avaliacoes: parseInt(row.total_avaliacoes) || 0
      }
    }));

    console.log('[MEUS-LIVROS] Livros processados:', livros.length);
    console.log('[MEUS-LIVROS] Enviando resposta de sucesso');

    res.json({
      success: true,
      data: {
        livros,
        total: livros.length
      }
    });
  } catch (error) {
    console.error('[MEUS-LIVROS] ❌ ERRO CAPTURADO:', error.message);
    console.error('[MEUS-LIVROS] Erro completo:', error);
    console.error('[MEUS-LIVROS] Stack trace:', error.stack);
    console.error('[MEUS-LIVROS] Código do erro:', error.code);
    console.error('[MEUS-LIVROS] Detalhes:', error.detail);

    res.status(500).json({
      success: false,
      error: 'Erro ao buscar livros lidos'
    });
  }
});

/**
 * PUT /api/avaliacoes/:id
 * Atualiza uma avaliação existente
 * Acesso: Autenticado (apenas próprio usuário)
 */
router.put('/avaliacoes/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { nota, comentario } = req.body;
    const usuario_id = req.usuario.id;

    // Validações
    if (!nota || nota < 1 || nota > 5) {
      return res.status(400).json({
        success: false,
        error: 'A nota deve estar entre 1 e 5'
      });
    }

    // Verificar se a avaliação pertence ao usuário
    const checkResult = await pool.query(
      'SELECT * FROM avaliacoes WHERE id = $1 AND usuario_id = $2',
      [id, usuario_id]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Avaliação não encontrada ou você não tem permissão'
      });
    }

    // Atualizar avaliação
    const result = await pool.query(
      `UPDATE avaliacoes
       SET nota = $1, comentario = $2
       WHERE id = $3 AND usuario_id = $4
       RETURNING *`,
      [nota, comentario, id, usuario_id]
    );

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Erro ao atualizar avaliação:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao atualizar avaliação'
    });
  }
});

/**
 * DELETE /api/avaliacoes/:id
 * Deleta uma avaliação
 * Acesso: Autenticado (apenas próprio usuário)
 */
router.delete('/avaliacoes/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const usuario_id = req.usuario.id;

    // Deletar avaliação (apenas se pertencer ao usuário)
    const result = await pool.query(
      'DELETE FROM avaliacoes WHERE id = $1 AND usuario_id = $2 RETURNING *',
      [id, usuario_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Avaliação não encontrada ou você não tem permissão'
      });
    }

    res.json({
      success: true,
      message: 'Avaliação deletada com sucesso'
    });
  } catch (error) {
    console.error('Erro ao deletar avaliação:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao deletar avaliação'
    });
  }
});

module.exports = router;
