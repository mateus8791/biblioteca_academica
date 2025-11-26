// Arquivo: backend/src/middlewares/roleMiddleware.js

/**
 * Middleware para verificar tipo de usuário
 * @param {Array<string>} tiposPermitidos - Tipos de usuário permitidos: 'admin', 'bibliotecario', 'aluno'
 */
const checkRole = (tiposPermitidos) => {
  return (req, res, next) => {
    const tipoUsuario = req.usuario.tipo_usuario;

    if (!tipoUsuario) {
      return res.status(403).json({
        message: 'Tipo de usuário não definido.'
      });
    }

    if (tiposPermitidos.includes(tipoUsuario)) {
      next();
    } else {
      res.status(403).json({
        message: 'Acesso negado. Você não tem permissão para este recurso.'
      });
    }
  };
};

/**
 * Middleware para verificar se o usuário é admin
 */
const checkAdmin = (req, res, next) => {
  if (req.usuario.tipo_usuario === 'admin') {
    next();
  } else {
    res.status(403).json({
      message: 'Acesso negado. Apenas administradores podem acessar este recurso.'
    });
  }
};

/**
 * Middleware para verificar se o usuário é admin ou bibliotecário
 */
const checkAdminOrBibliotecario = (req, res, next) => {
  const tipo = req.usuario.tipo_usuario;
  if (tipo === 'admin' || tipo === 'bibliotecario') {
    next();
  } else {
    res.status(403).json({
      message: 'Acesso negado. Apenas administradores e bibliotecários podem acessar este recurso.'
    });
  }
};

module.exports = {
  checkRole,
  checkAdmin,
  checkAdminOrBibliotecario,
};