// src/middlewares/validate.js
const validate = (schema) => (req, res, next) => {
  try {
    // O parse valida e "limpa" os dados
    req.body = schema.parse(req.body);
    next();
  } catch (error) {
    
    // --- MUDANÇA AQUI ---
    // Pegamos a primeira mensagem de erro específica do Zod
    // Ex: "Formato de email inválido"
    const message = error.errors[0].message;

    return res.status(400).json({
      // Agora enviamos a mensagem específica no campo 'error'
      // Assim o seu frontend (toast/alert) vai mostrar o texto certo.
      error: message, 
      
      // Mantemos os detalhes técnicos caso precise debugar depois
      details: error.errors 
    });
    // --- FIM DA MUDANÇA ---
  }
};

module.exports = validate;