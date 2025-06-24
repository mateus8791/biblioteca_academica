// Arquivo: backend/src/controllers/authController.js

const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Função de login principal
const login = async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ mensagem: 'Email e senha são obrigatórios.' });
  }

  try {
    const { rows: usuarios } = await pool.query('SELECT * FROM usuario WHERE email = $1', [email]);

    if (usuarios.length === 0) {
      return res.status(404).json({ mensagem: 'Usuário não encontrado.' });
    }

    const usuario = usuarios[0];
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha_hash);

    if (!senhaCorreta) {
      return res.status(401).json({ mensagem: 'Email ou senha inválidos.' });
    }

    // --- CORREÇÃO AQUI: Adicionamos mais dados ao payload do token ---
    const payload = {
      id: usuario.id,
      nome: usuario.nome, // Adicionado
      tipo: usuario.tipo_usuario,
      foto_url: usuario.foto_url // Adicionado
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' });

    const { senha_hash, ...usuarioSemSenha } = usuario;

    return res.status(200).json({
      mensagem: 'Login bem-sucedido!',
      usuario: usuarioSemSenha,
      token,
    });

  } catch (error) {
    console.error('Erro no login:', error);
    return res.status(500).json({ mensagem: 'Erro interno do servidor.' });
  }
};


// Função de login com ID (usada na tela de seleção de perfil)
const loginComId = async (req, res) => {
  const { id, profile } = req.body;

  if (!id || !profile) {
    return res.status(400).json({ message: 'ID e perfil são obrigatórios.' });
  }
  
  const tipoUsuarioNoBanco = profile === 'librarian' ? 'bibliotecario' : 'aluno';

  try {
    const query = 'SELECT * FROM usuario WHERE id = $1 AND tipo_usuario = $2';
    const { rows } = await pool.query(query, [id, tipoUsuarioNoBanco]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado com a identificação fornecida.' });
    }

    const usuarioEncontrado = rows[0];

    // --- CORREÇÃO AQUI: Adicionamos mais dados ao payload do token ---
    const payload = {
      id: usuarioEncontrado.id,
      nome: usuarioEncontrado.nome,
      tipo: usuarioEncontrado.tipo_usuario,
      foto_url: usuarioEncontrado.foto_url
    };
    
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' });

    const { senha_hash, ...usuarioSemSenha } = usuarioEncontrado;

    return res.status(200).json({
      mensagem: 'Validação de perfil bem-sucedida!',
      usuario: usuarioSemSenha,
      token,
    });

  } catch (error) {
    console.error('Erro no login com ID:', error);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};


module.exports = {
  login,
  loginComId,
};