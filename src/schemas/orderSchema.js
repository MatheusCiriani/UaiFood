const { z } = require('zod');

const orderItemSchema = z.object({
  itemId: z.coerce.number().or(z.string().transform(val => Number(val))), // Aceita string ou numero e converte
  quantity: z.coerce.number().min(1, "Quantidade deve ser pelo menos 1"),
});

const createOrderSchema = z.object({
  paymentMethod: z.enum(['CASH', 'DEBIT', 'CREDIT', 'PIX']),
  status: z.string().default('PENDING'),
  // clientId e createdById geralmente pegamos do token (req.user), não do body, mas se seu front manda:
  clientId: z.coerce.number().optional(), 
  createdById: z.coerce.number().optional(),
  
  items: z.array(orderItemSchema).nonempty("O pedido deve ter pelo menos 1 item"),
});

// Para update de status
const updateOrderSchema = z.object({
  status: z.string().optional(),
  paymentMethod: z.enum(['CASH', 'DEBIT', 'CREDIT', 'PIX']).optional(),
});

module.exports = { createOrderSchema, updateOrderSchema };