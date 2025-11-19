// src/middlewares/validate.js
const validate = (schema) => (req, res, next) => {
  try {
    // O parse valida e "limpa" os dados
    req.body = schema.parse(req.body);
    next();
  } catch (error) {
    
    // --- CORREÇÃO APLICADA ---
    // Usamos '?.' (optional chaining). 
    // Se 'error.errors' não existir, ele tenta pegar 'error.message'.
    // Se nem isso existir, usa uma mensagem genérica.
    const message = error.errors?.[0]?.message || error.message || "Erro na validação dos dados";

    return res.status(400).json({
      error: message, 
      
      // Se for erro do Zod envia 'errors', senão envia o objeto de erro inteiro para debug
      details: error.errors || error 
    });
    // --- FIM DA CORREÇÃO ---
  }
};

module.exports = validate;