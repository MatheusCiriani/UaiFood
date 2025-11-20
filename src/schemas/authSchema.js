// src/schemas/authSchema.js
const { z } = require('zod');

const loginSchema = z.object({
  email: z.string({ required_error: "O e-mail é obrigatório" })
    .email("Formato de e-mail inválido") // Valida se tem @ e domínio
    .trim() // Remove espaços em branco no início e fim (comum em mobile)
    .toLowerCase(), // Transforma em minúsculo para garantir que bata com o banco

  password: z.string({ required_error: "A senha é obrigatória" })
    .min(1, "A senha não pode estar vazia")
    // Otimização: Se no registro o mínimo é 6, aqui também pode ser.
    // Isso evita processar senhas que com certeza estão erradas.
    .min(6, "A senha deve ter no mínimo 6 caracteres"), 
});

module.exports = { loginSchema };