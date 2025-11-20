// src/schemas/userSchema.js
const { z } = require('zod');
const addressSchema = require('./addressSchema');

const createUserSchema = z.object({
  name: z.string({ required_error: "O nome é obrigatório." })
    .trim()
    .min(3, "O nome deve ter pelo menos 3 letras.")
    // --- CORREÇÃO AQUI ---
    // Adicionamos o 'i' no final: /(.)\1\1/i
    // Isso faz com que 'Aaa' ou 'BBB' sejam detectados como repetidos.
    .refine(name => !/(.)\1\1/i.test(name), "O nome não pode ter 3 letras iguais seguidas.")
    .transform(name => name.trim()),

  email: z.string({ required_error: "O e-mail é obrigatório." })
    .email("O formato do e-mail é inválido.")
    .toLowerCase(),

  phone: z.string({ required_error: "O telefone é obrigatório." })
    .transform(val => val.replace(/\D/g, ''))
    .refine(val => val.length >= 10 && val.length <= 11, "O telefone deve ter DDD + Número (10 ou 11 dígitos)."),

  password: z.string({ required_error: "A senha é obrigatória." })
    .min(6, "A senha é muito curta (mínimo 6 caracteres).")
    .refine(val => /[0-9]/.test(val), "A senha precisa ter pelo menos um número."),
  
  type: z.enum(['CLIENT', 'ADMIN'], { 
    errorMap: () => ({ message: "Tipo de usuário inválido (deve ser CLIENT ou ADMIN)." }) 
  }).optional().default('CLIENT'),

  address: addressSchema,
});

const updateUserSchema = createUserSchema.partial().omit({ address: true }).extend({
    addressId: z.any().optional() 
});

module.exports = { createUserSchema, updateUserSchema };