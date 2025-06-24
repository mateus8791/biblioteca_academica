// Arquivo: backend/src/middlewares/roleMiddleware.js

const checkRole = (rolesPermitidas) => {
  return (req, res, next) => {
    // Esta linha agora vai funcionar, pois o authMiddleware criou o req.usuario
    const tipoUsuario = req.usuario.tipo;

    if (rolesPermitidas.includes(tipoUsuario)) {
      next();
    } else {
      res.status(403).json({ message: 'Acesso negado. Você não tem permissão para este recurso.' });
    }
  };
};

module.exports = {
  checkRole,
};