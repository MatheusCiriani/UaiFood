// src/middlewares/checkAuth.js
const jwt = require('jsonwebtoken');

// Este é o nosso middleware de autenticação
function checkAuth(req, res, next) {
  // 1. Pega o token do cabeçalho 'Authorization'
  const authHeader = req.headers['authorization'];
  
  // O formato do cabeçalho é "Bearer TOKEN_LONGO_AQUI"
  // Nós queremos apenas o "TOKEN_LONGO_AQUI"
  const token = authHeader && authHeader.split(' ')[1];

  // 2. Se não houver token, retorna um erro 401 (Não Autorizado)
  if (!token) {
    return res.status(401).json({ error: 'Acesso negado. Nenhum token fornecido.' });
  }

  // 3. Verifica se o token é válido
  try {
    const secret = process.env.JWT_SECRET;
    
    // O 'verify' decodifica o token usando nosso segredo.
    // Se o token for inválido (errado ou expirado), ele vai dar um erro.
    const decodedPayload = jwt.verify(token, secret);

    // 4. Se deu tudo certo, o token é válido!
    // Nós adicionamos o payload (que tem o ID e o TIPO do usuário)
    // ao objeto 'req' para que as próximas funções (os controllers)
    // saibam quem é o usuário que está fazendo a requisição.
    req.user = decodedPayload; // Ex: { id: '5', type: 'CLIENT' }

    next(); // Permite que a requisição continue para o controller

  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expirado. Faça o login novamente.' });
    }
    // Outros erros (ex: assinatura inválida)
    return res.status(403).json({ error: 'Token inválido.' });
  }
}

module.exports = checkAuth;