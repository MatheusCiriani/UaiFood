// src/middlewares/checkAdmin.js

function checkAdmin(req, res, next) {
  // Este middleware assume que o 'checkAuth' já rodou.
  // O 'checkAuth' colocou o payload do token (ex: { id: 1, type: 'ADMIN' })
  // dentro do objeto 'req.user'.

  // 1. Verificamos se o usuário (do token) não é um ADMIN
  if (req.user.type !== 'ADMIN') {
    // 403 Forbidden (Proibido)
    // O usuário está autenticado (logado), mas não tem permissão para
    // acessar este recurso específico.
    return res.status(403).json({ error: 'Acesso negado. Esta rota é restrita a administradores.' });
  }

  // 2. Se for ADMIN, deixa a requisição passar para o controller
  next();
}

module.exports = checkAdmin;