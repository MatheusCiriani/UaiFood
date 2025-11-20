// src/schemas/orderSchema.js
const { z } = require('zod');

const orderItemSchema = z.object({
  // MUDANÇA: Adicionado z.coerce.number() para aceitar string "1" e virar numero 1
  itemId: z.coerce.number({ required_error: "ID do item obrigatório" }),
  
  quantity: z.coerce.number()
    .int("A quantidade deve ser um número inteiro")
    .min(1, "Quantidade deve ser pelo menos 1")
    .max(100, "Quantidade máxima por item é 100"),
});

const createOrderSchema = z.object({
  paymentMethod: z.enum(['CASH', 'DEBIT', 'CREDIT', 'PIX'], { 
    errorMap: () => ({ message: "Forma de pagamento inválida" }) 
  }),
  status: z.string().default('PENDING'),
  
  // MUDANÇA: Adicionado coerce aqui também, pois o user.id pode vir como string do frontend
  clientId: z.coerce.number().optional(),
  createdById: z.coerce.number().optional(),
  
  items: z.array(orderItemSchema)
    .nonempty("O pedido deve ter pelo menos 1 item")
    .max(50, "O pedido não pode ter mais de 50 itens diferentes"),
});

const updateOrderSchema = z.object({
  status: z.enum(['PENDING', 'COMPLETED', 'CANCELLED']).optional(),
  paymentMethod: z.enum(['CASH', 'DEBIT', 'CREDIT', 'PIX']).optional(),
});

module.exports = { createOrderSchema, updateOrderSchema };