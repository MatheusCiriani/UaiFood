const { z } = require('zod');

const loginSchema = z.object({
  email: z.string({ required_error: "Email é obrigatório" }).email("Email inválido"),
  password: z.string({ required_error: "Senha é obrigatória" }).min(1, "Senha não pode ser vazia"),
});

module.exports = { loginSchema };