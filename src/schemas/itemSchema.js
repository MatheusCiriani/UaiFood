// src/schemas/itemSchema.js
const { z } = require('zod');

const itemSchema = z.object({
  description: z.string({ required_error: "A descrição é obrigatória." })
    .trim()
    .min(3, "A descrição do item deve ter pelo menos 3 letras.")
    .max(100, "O nome do item deve ter no máximo 100 caracteres."),

  // O coerce transforma "25.50" (string do upload) em 25.50 (number)
  unitPrice: z.coerce.number({ required_error: "O preço é obrigatório." })
    .positive("O preço deve ser um valor positivo.")
    .min(0.01, "O preço não pode ser zero."),
    
  categoryId: z.string({ required_error: "Selecione uma categoria." })
    .or(z.number().transform(n => String(n))) // Aceita número e vira string
    .refine(val => val.length > 0, "Categoria inválida"),
});

module.exports = itemSchema;