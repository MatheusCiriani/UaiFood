const { z } = require('zod');

const categorySchema = z.object({
  description: z.string({ required_error: "Descrição é obrigatória" })
    .min(3, "A descrição deve ter pelo menos 3 letras"),
});

module.exports = categorySchema;