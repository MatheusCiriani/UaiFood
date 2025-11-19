// src/controllers/itemController.js
const prisma = require('../lib/prismaClient');

class ItemController {

  // --- CREATE ---
  async create(req, res) {
    try {
      // Zod converteu 'unitPrice' para Number automaticamente.
      // 'categoryId' vem como String (pelo Schema), convertemos para BigInt aqui.
      const { description, unitPrice, categoryId } = req.body;
      const image = req.file ? req.file.filename : null;

      const newItem = await prisma.item.create({
        data: {
          description,
          unitPrice, 
          categoryId: BigInt(categoryId), 
          image,
        },
        include: { category: true }
      });
      res.status(201).json(newItem);

    } catch (error) {
      console.error(error);
      if (error.code === 'P2003') {
        return res.status(404).json({ error: `Categoria não encontrada.` });
      }
      res.status(500).json({ error: 'Erro ao criar item', details: error.message });
    }
  }

  // --- UPDATE ---
  async update(req, res) {
    try {
      const itemId = BigInt(req.params.id);
      // Zod validou se os campos existem
      const { description, unitPrice, categoryId } = req.body;
      const image = req.file ? req.file.filename : undefined;

      const dataToUpdate = {
        description,
        unitPrice,
        categoryId: BigInt(categoryId),
      };

      if (image) {
        dataToUpdate.image = image;
      }

      const updatedItem = await prisma.item.update({
        where: { id: itemId },
        data: dataToUpdate,
        include: { category: true }
      });
      res.status(200).json(updatedItem);

    } catch (error) {
      console.error(error);
      if (error.code === 'P2025') return res.status(404).json({ error: `Item não encontrado.` });
      if (error.code === 'P2003') return res.status(404).json({ error: `Categoria não encontrada.` });
      res.status(500).json({ error: 'Erro ao atualizar item', details: error.message });
    }
  }

  // --- READ & DELETE (Padrão) ---
  async getAll(req, res) {
    try {
      const items = await prisma.item.findMany({ include: { category: true } });
      res.status(200).json(items);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar itens', details: error.message });
    }
  }

  async getById(req, res) {
    try {
      const item = await prisma.item.findUnique({ 
        where: { id: BigInt(req.params.id) }, 
        include: { category: true } 
      });
      if (!item) return res.status(404).json({ error: 'Item não encontrado' });
      res.status(200).json(item);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar item', details: error.message });
    }
  }

  async delete(req, res) {
    try {
      await prisma.item.delete({ where: { id: BigInt(req.params.id) } });
      res.status(204).send();
    } catch (error) {
      if (error.code === 'P2025') return res.status(404).json({ error: 'Item não encontrado' });
      res.status(500).json({ error: 'Erro', details: error.message });
    }
  }
}

module.exports = new ItemController();