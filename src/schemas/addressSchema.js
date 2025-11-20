// src/schemas/addressSchema.js
const { z } = require('zod');

const addressSchema = z.object({
  street: z.string().min(1, "Rua é obrigatória"),
  number: z.string().min(1, "Número é obrigatório"),
  district: z.string().min(1, "Bairro é obrigatório"),
  city: z.string().min(1, "Cidade é obrigatória"),
  
  // Melhora 1: Transforma "mg" ou "sp" em "MG", "SP" automaticamente
  state: z.string()
    .length(2, "Estado deve ter 2 letras (UF)")
    .transform(val => val.toUpperCase()),
  
  // Melhora 2: Remove traço/ponto e garante exatamente 8 números
  zipCode: z.string()
    .transform(val => val.replace(/\D/g, '')) // Remove tudo que não é dígito
    .refine(val => val.length === 8, "CEP deve conter exatamente 8 números"),
});

module.exports = addressSchema;