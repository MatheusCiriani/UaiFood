const { z } = require('zod');
const addressSchema = require('./addressSchema');

const createUserSchema = z.object({
  name: z.string().min(3, "Nome deve ter no mínimo 3 letras"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(8, "Telefone inválido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
  type: z.enum(['CLIENT', 'ADMIN'], { errorMap: () => ({ message: "Tipo deve ser CLIENT ou ADMIN" }) }),
  address: addressSchema, // Valida o endereço aninhado
});

// Para Update, usamos partial (tudo opcional) e removemos o address obrigatório
const updateUserSchema = createUserSchema.partial().omit({ address: true }).extend({
    addressId: z.any().optional() 
});

module.exports = { createUserSchema, updateUserSchema };