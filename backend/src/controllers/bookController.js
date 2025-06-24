// Arquivo: backend/src/controllers/bookController.js (Seu código com as melhorias)

const pool = require('../config/database');
const { registrarAcao } = require('../services/auditoriaService'); // 1. IMPORTAMOS O SERVIÇO DE AUDITORIA

// --- 1. LISTAR TODOS OS LIVROS (com lógica de busca) ---
const getAllBooks = async (req, res) => {
  const { search } = req.query; // Pega o termo de busca da URL

  try {
    let queryParams = [];
    let whereClause = '';

    // Se um termo de busca foi enviado, construímos a cláusula WHERE
    if (search) {
      // Usamos ILIKE para uma busca "case-insensitive"
      // Buscamos no título do livro E no nome do autor
      whereClause = `
        WHERE l.titulo ILIKE $1 OR a.nome ILIKE $1
      `;
      queryParams.push(`%${search}%`);
    }

    const query = `
      SELECT
        l.id, l.titulo, l.isbn, l.capa_url, l.quantidade_disponivel,
        TO_CHAR(l.data_cadastro, 'DD/MM/YYYY') AS data_cadastro,
        (SELECT STRING_AGG(a.nome, ', ') FROM autor a JOIN livro_autor la ON a.id = la.autor_id WHERE la.livro_id = l.id) AS autores_nomes
      FROM 
        livro l
      LEFT JOIN 
        livro_autor la ON l.id = la.livro_id
      LEFT JOIN 
        autor a ON la.autor_id = a.id
      ${whereClause}
      GROUP BY
        l.id
      ORDER BY
        l.titulo ASC;
    `;
    const { rows } = await pool.query(query, queryParams);
    res.status(200).json(rows);
  } catch (error) {
    console.error("Erro ao buscar livros:", error);
    res.status(500).json({ mensagem: "Erro interno do servidor." });
  }
};

// --- 2. CRIAR UM NOVO LIVRO (com registro de auditoria) ---
const createBook = async (req, res) => {
  const { titulo, isbn, ano_publicacao, num_paginas, sinopse, capa_url, autor_nome, categoria_nome, quantidade_disponivel } = req.body;

  if (!titulo || !autor_nome || !categoria_nome) {
    return res.status(400).json({ mensagem: 'Título, nome do autor e nome da categoria são obrigatórios.' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    let autorId;
    const autorExistente = await client.query('SELECT id FROM autor WHERE nome = $1', [autor_nome]);
    if (autorExistente.rows.length > 0) {
      autorId = autorExistente.rows[0].id;
    } else {
      const novoAutor = await client.query('INSERT INTO autor (nome) VALUES ($1) RETURNING id', [autor_nome]);
      autorId = novoAutor.rows[0].id;
    }

    let categoriaId;
    const categoriaExistente = await client.query('SELECT id FROM categoria WHERE nome = $1', [categoria_nome]);
    if (categoriaExistente.rows.length > 0) {
      categoriaId = categoriaExistente.rows[0].id;
    } else {
      const novaCategoria = await client.query('INSERT INTO categoria (nome) VALUES ($1) RETURNING id', [categoria_nome]);
      categoriaId = novaCategoria.rows[0].id;
    }

    const livroResult = await client.query(
      'INSERT INTO livro (titulo, isbn, ano_publicacao, num_paginas, sinopse, capa_url, quantidade_disponivel) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      [titulo, isbn, ano_publicacao, num_paginas, sinopse, capa_url, quantidade_disponivel || 0]
    );
    const novoLivroId = livroResult.rows[0].id;

    await client.query('INSERT INTO livro_autor (livro_id, autor_id) VALUES ($1, $2)', [novoLivroId, autorId]);
    await client.query('INSERT INTO livro_categoria (livro_id, categoria_id) VALUES ($1, $2)', [novoLivroId, categoriaId]);

    await client.query('COMMIT');
    
    // REGISTRA A AÇÃO NA AUDITORIA
    await registrarAcao(req.usuario.id, 'CADASTRO_LIVRO', `Cadastrou o livro '${titulo}'`);
    
    res.status(201).json({ mensagem: 'Livro cadastrado com sucesso!', livroId: novoLivroId });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Erro ao cadastrar livro:', error);
    res.status(500).json({ mensagem: 'Erro interno do servidor.' });
  } finally {
    client.release();
  }
};

// --- 3. BUSCAR UM LIVRO POR ID (com a query corrigida) ---
const getBookById = async (req, res) => {
  const { id } = req.params;
  try {
    const query = `
      SELECT
        l.*,
        (SELECT array_agg(a.id) FROM autor a JOIN livro_autor la ON a.id = la.autor_id WHERE la.livro_id = l.id) as autores_ids,
        (SELECT array_agg(c.id) FROM categoria c JOIN livro_categoria lc ON c.id = lc.categoria_id WHERE lc.livro_id = l.id) as categorias_ids
      FROM livro l
      WHERE l.id = $1;
    `;
    const { rows } = await pool.query(query, [id]);
    if (rows.length === 0) {
      return res.status(404).json({ mensagem: 'Livro não encontrado.' });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Erro ao buscar livro por ID:', error);
    res.status(500).json({ mensagem: 'Erro interno do servidor.' });
  }
};

// --- 4. ATUALIZAR UM LIVRO (com registro de auditoria) ---
const updateBook = async (req, res) => {
  const { id } = req.params;
  const { titulo, isbn, ano_publicacao, num_paginas, sinopse, capa_url, quantidade_disponivel, autores_ids, categorias_ids } = req.body;
  
  if (!titulo || !autores_ids || !categorias_ids) {
    return res.status(400).json({ mensagem: 'Título, autores e categorias são obrigatórios.' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    await client.query(
      `UPDATE livro SET titulo = $1, isbn = $2, ano_publicacao = $3, num_paginas = $4, sinopse = $5, capa_url = $6, quantidade_disponivel = $7 WHERE id = $8`,
      [titulo, isbn, ano_publicacao, num_paginas, sinopse, capa_url, quantidade_disponivel, id]
    );

    await client.query('DELETE FROM livro_autor WHERE livro_id = $1', [id]);
    if (autores_ids && autores_ids.length > 0) {
        for (const autor_id of autores_ids) {
            await client.query('INSERT INTO livro_autor (livro_id, autor_id) VALUES ($1, $2)', [id, autor_id]);
        }
    }
    
    await client.query('DELETE FROM livro_categoria WHERE livro_id = $1', [id]);
     if (categorias_ids && categorias_ids.length > 0) {
        for (const categoria_id of categorias_ids) {
            await client.query('INSERT INTO livro_categoria (livro_id, categoria_id) VALUES ($1, $2)', [id, categoria_id]);
        }
    }
    
    await client.query('COMMIT');

    // REGISTRA A AÇÃO NA AUDITORIA
    await registrarAcao(req.usuario.id, 'UPDATE_LIVRO', `Atualizou o livro '${titulo}'`);
    
    res.status(200).json({ mensagem: 'Livro atualizado com sucesso!' });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Erro ao atualizar livro:', error);
    res.status(500).json({ mensagem: 'Erro interno do servidor ao atualizar livro.' });
  } finally {
    client.release();
  }
};

// --- 5. APAGAR UM LIVRO (com registro de auditoria) ---
const deleteBook = async (req, res) => {
    const { id } = req.params;
    try {
        // Pega o título do livro ANTES de deletar para usar no log
        const bookResult = await pool.query('SELECT titulo FROM livro WHERE id = $1', [id]);
        const nomeLivroDeletado = bookResult.rows[0]?.titulo || `ID ${id}`;

        const deleteOp = await pool.query('DELETE FROM livro WHERE id = $1', [id]);
        if (deleteOp.rowCount === 0) {
            return res.status(404).json({ mensagem: 'Livro não encontrado para exclusão.' });
        }

        // REGISTRA A AÇÃO NA AUDITORIA
        await registrarAcao(req.usuario.id, 'DELETE_LIVRO', `Deletou o livro '${nomeLivroDeletado}'`);

        res.status(200).json({ mensagem: 'Livro apagado com sucesso.' });
    } catch (error) {
        console.error('Erro ao apagar livro:', error);
        res.status(500).json({ mensagem: 'Erro interno do servidor.' });
    }
};

// Exporta todas as funções
module.exports = {
  getAllBooks,
  createBook,
  getBookById,
  updateBook,
  deleteBook,
};