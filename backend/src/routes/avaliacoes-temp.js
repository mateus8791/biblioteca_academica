router.get('/usuarios/meus-livros-lidos', authMiddleware, async (req, res) => {
  try {
    const usuario_id = req.usuario.id;
    
    // Query simplificada para teste
    const result = await pool.query(
      `SELECT 
        l.id,
        l.titulo,
        l.autor,
        l.capa_url,
        l.isbn
       FROM livros l
       LIMIT 5`
    );

    const livros = result.rows.map(row => ({
      id: row.id,
      titulo: row.titulo,
      autor: row.autor,
      capa_url: row.capa_url,
      isbn: row.isbn,
      estatisticas: {
        media_notas: '0',
        total_avaliacoes: 0
      }
    }));

    res.json({
      success: true,
      data: {
        livros,
        total: livros.length
      }
    });
  } catch (error) {
    console.error('Erro ao buscar livros lidos:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar livros lidos'
    });
  }
});
