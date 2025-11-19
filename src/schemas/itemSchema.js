// src/schemas/itemSchema.js
const { z } = require('zod');

const itemSchema = z.object({
  description: z.string({ required_error: "A descrição é obrigatória." })
    .min(3, "A descrição deve ter pelo menos 3 letras."),
  
  // O 'coerce' é fundamental aqui!
  // Como estamos enviando um arquivo, os dados chegam como texto ("25.50").
  // O z.coerce.number() converte automaticamente para número (25.50).
  unitPrice: z.coerce.number({ required_error: "O preço é obrigatório." })
    .positive("O preço deve ser maior que zero."),
    
  // O categoryId também chega como string.
  // Aceitamos string ou número e garantimos que não está vazio.
  categoryId: z.string({ required_error: "Selecione uma categoria." })
    .or(z.number().transform(n => String(n))) // Se vier como número, transforma em string
    .refine(val => val.length > 0, "Categoria inválida"),
});

module.exports = itemSchema;