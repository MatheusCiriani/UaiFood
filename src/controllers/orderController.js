// src/controllers/orderController.js
const prisma = require('../lib/prismaClient');

const orderInclude = {
  client: { select: { id: true, name: true, phone: true } },
  createdBy: { select: { id: true, name: true } },
  orderItems: { include: { item: true } }
}

class OrderController {

  // --- CREATE ---
  async create(req, res) {
    try {
      // Zod validou 'paymentMethod' e 'items'
      const { paymentMethod, status, clientId, createdById, items } = req.body;

      const newOrder = await prisma.order.create({
        data: {
          paymentMethod,
          status,
          clientId: BigInt(clientId),
          createdById: BigInt(createdById),
          orderItems: {
            create: items.map(item => ({
              quantity: item.quantity, // Zod já converteu para number
              item: { 
                connect: { id: BigInt(item.itemId) } 
              }
            }))
          }
        },
        include: orderInclude
      });
      res.status(201).json(newOrder);

    } catch (error) {
      if (error.code === 'P2003') {
        return res.status(404).json({ error: 'Cliente, Criador ou Item não encontrado.' });
      }
      if (error.code === 'P2025') {
         return res.status(404).json({ error: 'Um dos IDs de item não foi encontrado.' });
      }
      res.status(500).json({ error: 'Erro ao criar pedido', details: error.message });
    }
  }

  // --- READ (Inteligente) ---
  async getAll(req, res) {
    try {
      const { id: userId, type: userType } = req.user; 
      const whereClause = {};
      
      // Se não for admin, vê apenas os próprios pedidos
      if (userType !== 'ADMIN') {
        whereClause.clientId = BigInt(userId);
      }
      
      const orders = await prisma.order.findMany({
        where: whereClause,
        include: orderInclude,
        orderBy: { createdAt: 'desc' }
      });
      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar pedidos', details: error.message });
    }
  }

  // --- UPDATE ---
  async update(req, res) {
    try {
      const orderId = BigInt(req.params.id);
      const { status, paymentMethod } = req.body;
      
      const dataToUpdate = {};
      if (status) dataToUpdate.status = status;
      if (paymentMethod) dataToUpdate.paymentMethod = paymentMethod;

      const updatedOrder = await prisma.order.update({
        where: { id: orderId },
        data: dataToUpdate,
        include: orderInclude
      });
      res.status(200).json(updatedOrder);
    } catch (error) {
      if (error.code === 'P2025') return res.status(404).json({ error: 'Pedido não encontrado.' });
      res.status(500).json({ error: 'Erro ao atualizar pedido', details: error.message });
    }
  }

  // ... (getById e delete)
  async getById(req, res) {
    try {
      const order = await prisma.order.findUnique({
        where: { id: BigInt(req.params.id) },
        include: orderInclude
      });
      if (!order) return res.status(404).json({ error: 'Pedido não encontrado.' });
      res.status(200).json(order);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar pedido', details: error.message });
    }
  }

  async delete(req, res) {
    try {
      const orderId = BigInt(req.params.id);
      await prisma.$transaction([
        prisma.orderItem.deleteMany({ where: { orderId: orderId } }),
        prisma.order.delete({ where: { id: orderId } })
      ]);
      res.status(204).send();
    } catch (error) {
      if (error.code === 'P2025') return res.status(404).json({ error: 'Pedido não encontrado.' });
      res.status(500).json({ error: 'Erro ao deletar pedido', details: error.message });
    }
  }
}

module.exports = new OrderController();