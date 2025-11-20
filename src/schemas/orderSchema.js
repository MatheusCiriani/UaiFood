const { z } = require('zod');

const orderItemSchema = z.object({
  itemId: z.number({ required_error: "ID do item obrigatório" }),
  
  quantity: z.coerce.number() // Garante que é número
    .int("A quantidade deve ser um número inteiro") // <-- Impede 1.5 itens
    .min(1, "Quantidade deve ser pelo menos 1")
    .max(100, "Quantidade máxima por item é 100"), // <-- Proteção contra abuso
});

const createOrderSchema = z.object({
  paymentMethod: z.enum(['CASH', 'DEBIT', 'CREDIT', 'PIX'], { 
    errorMap: () => ({ message: "Forma de pagamento inválida" }) 
  }),
  status: z.string().default('PENDING'),
  clientId: z.any().optional(),
  createdById: z.any().optional(),
  
  items: z.array(orderItemSchema)
    .nonempty("O pedido deve ter pelo menos 1 item")
    .max(50, "O pedido não pode ter mais de 50 itens diferentes"), // <-- Proteção
});

const updateOrderSchema = z.object({
  status: z.enum(['PENDING', 'COMPLETED', 'CANCELLED']).optional(), // Valida o status exato
  paymentMethod: z.enum(['CASH', 'DEBIT', 'CREDIT', 'PIX']).optional(),
});

module.exports = { createOrderSchema, updateOrderSchema };