// src/middlewares/validate.js
const validate = (schema) => (req, res, next) => {
  try {
    // O Zod tenta validar e limpar os dados
    req.body = schema.parse(req.body);
    next();
  } catch (error) {
    // O Zod lança um erro contendo uma lista de problemas (error.errors)
    
    // Pegamos a primeira mensagem de erro específica configurada no schema
    // O '?.' evita que o servidor caia se o array estiver vazio por algum motivo bizarro
    const message = error.errors?.[0]?.message || 'Erro de validação';

    return res.status(400).json({
      // Enviamos essa mensagem específica no campo 'error'
      // Assim, o seu frontend (toast) vai mostrar exatamente: "A senha deve ter no mínimo 6 caracteres"
      error: message, 
      
      // Detalhes técnicos para debug (opcional)
      details: error.errors 
    });
  }
};

module.exports = validate;