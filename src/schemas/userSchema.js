// src/schemas/userSchema.js
const { z } = require('zod');
const addressSchema = require('./addressSchema');

const createUserSchema = z.object({
  // Regra 1: Nome sem 3 letras repetidas
  name: z.string()
    .min(3, "Nome deve ter no mínimo 3 letras")
    .refine(name => !/(.)\1\1/.test(name), "O nome não pode ter 3 letras iguais seguidas") // Regex que busca 3 caracteres idênticos
    .transform(name => name.trim()), // Remove espaços extras nas pontas

  email: z.string()
    .email("Email inválido")
    .toLowerCase(), // Força email minúsculo para evitar duplicidade (Maria@ vs maria@)

  // Regra 2: Telefone (DDD + Número)
  phone: z.string()
    .transform(val => val.replace(/\D/g, '')) // Remove parênteses, traços e espaços
    .refine(val => val.length >= 10 && val.length <= 11, "Telefone deve ter DDD + Número (10 ou 11 dígitos)"),

  // Melhora 3: Senha mais forte (mínimo 6 chars + pelo menos 1 número)
  password: z.string()
    .min(6, "A senha deve ter no mínimo 6 caracteres")
    .refine(val => /[0-9]/.test(val), "A senha deve conter pelo menos um número"), 

  type: z.enum(['CLIENT', 'ADMIN'], { errorMap: () => ({ message: "Tipo deve ser CLIENT ou ADMIN" }) }),
  
  address: addressSchema,
});

// Update Schema (parcial)
const updateUserSchema = createUserSchema.partial().omit({ address: true }).extend({
    addressId: z.any().optional() 
});

module.exports = { createUserSchema, updateUserSchema };