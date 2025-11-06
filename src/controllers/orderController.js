// src/controllers/orderController.js
const prisma = require('../lib/prismaClient');

console.log("--- 3. ORDER CONTROLLER: A variável prisma é:", typeof prisma); 
// Um "include" padrão para trazer todos os detalhes do pedido
const orderInclude = {
  // Traz o cliente, mas seleciona só o ID e Nome
  client: {
    select: { id: true, name: true, phone: true }
  },
  // Traz o funcionário que criou, selecionando ID e Nome
  createdBy: {
    select: { id: true, name: true }
  },
  // Traz os itens do pedido
  orderItems: {
    include: {
      // Traz os detalhes do Item (produto) de cada orderItem
      item: true
    }
  }
}

class OrderController {

  // --- CREATE ---
  async create(req, res) {
    try {
      const { paymentMethod, status, clientId, createdById, items } = req.body;

      // --- Validação ---
      if (!paymentMethod || !status || !clientId || !createdById) {
        return res.status(400).json({ error: 'Método de Pagamento, Status, ID do Cliente e ID do Criador são obrigatórios.' });
      }

      // Valida o ENUM PaymentMethod
      const validMethods = ['CASH', 'DEBIT', 'CREDIT', 'PIX'];
      if (!validMethods.includes(paymentMethod)) {
        return res.status(400).json({ error: `Método de Pagamento deve ser um de: ${validMethods.join(', ')}` });
      }

      // Valida o array de Itens
      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: 'O pedido deve conter pelo menos um item.' });
      }

      // Validação interna dos itens
      for (const item of items) {
        if (!item.itemId || !item.quantity) {
          return res.status(400).json({ error: 'Cada item deve ter "itemId" e "quantity".' });
        }
      }
      // --- Fim Validação ---

      const newOrder = await prisma.order.create({
        data: {
          paymentMethod,
          status,
          clientId: BigInt(clientId),
          createdById: BigInt(createdById),
          orderItems: { // --- CRIAÇÃO ANINHADA (Nested Write) ---
            create: items.map(item => ({
              quantity: parseInt(item.quantity),
              item: { // Conecta o item existente
                connect: { id: BigInt(item.itemId) }
              }
            }))
          }
        },
        include: orderInclude // Inclui todos os detalhes no retorno
      });
      res.status(201).json(newOrder);

    } catch (error) {
      // P2003: Chave estrangeira falhou (clientId, createdById ou um itemId não existe)
      if (error.code === 'P2003') {
        return res.status(404).json({ error: 'Não foi possível criar o pedido. Verifique se o Cliente, Criador e todos os Itens existem.', details: error.message });
      }
      // P2025: Um "connect" falhou (um dos itemIds não foi encontrado)
      if (error.code === 'P2025') {
         return res.status(404).json({ error: 'Um dos IDs de item (itemId) não foi encontrado.', details: error.message });
      }
      res.status(500).json({ error: 'Erro ao criar pedido', details: error.message });
    }
  }

  // --- READ (All) ---
  async getAll(req, res) {
    try {
      const orders = await prisma.order.findMany({
        include: orderInclude,
        orderBy: { createdAt: 'desc' } // Opcional: mais novos primeiro
      });
      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar pedidos', details: error.message });
    }
  }

  // --- READ (by ID) ---
  async getById(req, res) {
    try {
      const orderId = BigInt(req.params.id);
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: orderInclude
      });

      if (!order) {
        return res.status(404).json({ error: `Pedido com ID ${orderId} não encontrado.` });
      }
      res.status(200).json(order);

    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar pedido', details: error.message });
    }
  }

  // --- UPDATE (Status/Payment) ---
  // Geralmente não se "atualiza" um pedido (adicionando/removendo itens).
  // O mais comum é atualizar o 'status' (ex: "PENDING" -> "COMPLETED")
  // ou o método de pagamento.
  async update(req, res) {
    try {
      const orderId = BigInt(req.params.id);
      const { status, paymentMethod } = req.body;

      // Validação
      if (!status && !paymentMethod) {
        return res.status(400).json({ error: 'Você deve fornecer um "status" ou "paymentMethod" para atualizar.' });
      }
      
      const dataToUpdate = {};
      if (status) dataToUpdate.status = status;
      if (paymentMethod) {
        // Valida o ENUM
        const validMethods = ['CASH', 'DEBIT', 'CREDIT', 'PIX'];
        if (!validMethods.includes(paymentMethod)) {
          return res.status(400).json({ error: `Método de Pagamento deve ser um de: ${validMethods.join(', ')}` });
        }
        dataToUpdate.paymentMethod = paymentMethod;
      }

      const updatedOrder = await prisma.order.update({
        where: { id: orderId },
        data: dataToUpdate,
        include: orderInclude
      });
      res.status(200).json(updatedOrder);

    } catch (error) {
      // P2025: "Record to update not found."
      if (error.code === 'P2025') {
        return res.status(404).json({ error: `Pedido com ID ${req.params.id} não encontrado.` });
      }
      res.status(500).json({ error: 'Erro ao atualizar pedido', details: error.message });
    }
  }

  // --- DELETE ---
  async delete(req, res) {
    try {
      const orderId = BigInt(req.params.id);

      // --- TRANSAÇÃO DE DELETE ---
      // Como o seu schema não define "onDelete: Cascade",
      // não podemos deletar um Order se ele tiver OrderItems.
      // A forma correta é deletar os "filhos" (OrderItems) primeiro,
      // e depois o "pai" (Order), tudo em uma transação.
      
      const transaction = await prisma.$transaction([
        // 1. Deleta os OrderItems
        prisma.orderItem.deleteMany({
          where: { orderId: orderId },
        }),
        // 2. Deleta o Order
        prisma.order.delete({
          where: { id: orderId },
        })
      ]);
      
      // A Posição [1] da transação é o resultado do 'prisma.order.delete'
      // Se ele não encontrou o ID, o 'count' será 0 e lançará um erro.
      // (O Prisma lança P2025 antes, então o catch abaixo vai pegar)

      res.status(204).send(); // 204 No Content

    } catch (error) {
      // P2025: "Record to delete not found."
      // (O 'prisma.order.delete' falhou pois o ID não existe)
      if (error.code === 'P2025') {
        return res.status(404).json({ error: `Pedido com ID ${req.params.id} não encontrado.` });
      }
      res.status(500).json({ error: 'Erro ao deletar pedido', details: error.message });
    }
  }
}

module.exports = new OrderController();