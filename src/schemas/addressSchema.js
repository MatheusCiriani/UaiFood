// src/schemas/addressSchema.js
const { z } = require('zod');

const addressSchema = z.object({
  street: z.string({ required_error: "A rua é obrigatória." }).min(1, "A rua não pode ser vazia."),
  number: z.string({ required_error: "O número é obrigatório." }).min(1, "O número não pode ser vazio."),
  district: z.string({ required_error: "O bairro é obrigatório." }).min(1, "O bairro não pode ser vazio."),
  city: z.string({ required_error: "A cidade é obrigatória." }).min(1, "A cidade não pode ser vazia."),
  
  state: z.string({ required_error: "O estado (UF) é obrigatório." })
    .length(2, "O estado deve ser a sigla de 2 letras (ex: MG).")
    .transform(val => val.toUpperCase()),
  
  zipCode: z.string({ required_error: "O CEP é obrigatório." })
    .transform(val => val.replace(/\D/g, ''))
    .refine(val => val.length === 8, "O CEP deve conter exatamente 8 números."),
});

module.exports = addressSchema;