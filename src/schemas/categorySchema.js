// src/schemas/categorySchema.js
const { z } = require('zod');

const categorySchema = z.object({
  description: z.string({ required_error: "A descrição da categoria é obrigatória." })
    .trim()
    .min(3, "A categoria deve ter pelo menos 3 letras.")
    .max(50, "A categoria não pode ter mais de 50 caracteres."),
});

module.exports = categorySchema;