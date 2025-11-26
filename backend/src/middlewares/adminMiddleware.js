// Arquivo: backend/src/middlewares/adminMiddleware.js
// Middleware para verificar se o usuário é administrador

const checkAdmin = (req, res, next) => {
  console.log('[adminMiddleware] Verificando permissões de admin...');
  console.log('[adminMiddleware] req.usuario:', req.usuario);

  // req.usuario é criado pelo authMiddleware (JWT)
  if (!req.usuario) {
    console.log('[adminMiddleware] req.usuario não existe!');
    return res.status(401).json({ mensagem: 'Autenticação necessária' });
  }

  const tipoUsuario = req.usuario.tipo_usuario;
  console.log('[adminMiddleware] tipo_usuario:', tipoUsuario);

  // Verificar se o usuário é bibliotecário (admin)
  if (tipoUsuario === 'bibliotecario') {
    console.log('[adminMiddleware] Usuário é bibliotecário, permitindo acesso');
    return next();
  } else {
    console.log('[adminMiddleware] Usuário NÃO é bibliotecário, bloqueando acesso (403)');
    return res.status(403).json({
      mensagem: 'Acesso negado. Esta funcionalidade é exclusiva para administradores.'
    });
  }
};

module.exports = {
  checkAdmin
};
