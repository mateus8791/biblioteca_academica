// Arquivo: backend/src/middlewares/authMiddleware.js

const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // 1. Verifica se o token foi enviado
  if (!authHeader) {
    return res.status(401).json({ message: 'Token não fornecido.' });
  }

  // 2. Verifica se o token está no formato correto ("Bearer [token]")
  const parts = authHeader.split(' ');
  if (parts.length !== 2) {
    return res.status(401).json({ message: 'Erro no formato do token.' });
  }

  const [scheme, token] = parts;
  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).json({ message: 'Token mal formatado.' });
  }

  // 3. Verifica a validade do token
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token inválido ou expirado.' });
    }

    // 4. Se o token for válido, anexa os dados decodificados (id, tipo) em req.usuario
    req.usuario = decoded; 
    return next(); // Permite que a requisição continue para o próximo middleware (roleMiddleware)
  });
};