// src/controllers/itemController.js
const prisma = require('../lib/prismaClient');

console.log("--- 2. ITEM CONTROLLER: A variável prisma é:", typeof prisma); 

class ItemController {

  // --- CREATE ---
  async create(req, res) {
    try {
      // description, unitPrice, categoryId vêm do schema.prisma 
      const { description, unitPrice, categoryId } = req.body;

      // Validação básica
      if (!description || !unitPrice || !categoryId) {
        return res.status(400).json({ error: 'Descrição, Preço Unitário e ID da Categoria são obrigatórios.' });
      }

      // Converte os tipos para garantir que sejam compatíveis com o schema 
      const fUnitPrice = parseFloat(unitPrice);
      const bCategoryId = BigInt(categoryId);

      const newItem = await prisma.item.create({
        data: {
          description,
          unitPrice: fUnitPrice,
          categoryId: bCategoryId,
        },
        include: { // Inclui a categoria no retorno para ficar mais completo
          category: true,
        }
      });
      res.status(201).json(newItem);

    } catch (error) {
      // P2003 é o erro de "Foreign key constraint failed"
      // Significa que o categoryId enviado não existe na tabela Category
      if (error.code === 'P2003') {
        return res.status(404).json({ error: `Categoria com ID ${categoryId} não encontrada.` });
      }
      res.status(500).json({ error: 'Erro ao criar item', details: error.message });
    }
  }

  // --- READ (All) ---
  async getAll(req, res) {
    try {
      const items = await prisma.item.findMany({
        // É uma boa prática incluir a categoria relacionada 
        include: {
          category: true, 
        }
      });
      res.status(200).json(items);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar itens', details: error.message });
    }
  }

  // --- READ (by ID) ---
  async getById(req, res) {
    try {
      const itemId = BigInt(req.params.id); // O ID do Item é BigInt 
      const item = await prisma.item.findUnique({
        where: { id: itemId },
        include: {
          category: true, // Inclui a categoria relacionada 
        }
      });

      if (!item) {
        return res.status(404).json({ error: `Item com ID ${itemId} não encontrado.` });
      }
      res.status(200).json(item);

    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar item', details: error.message });
    }
  }

  // --- UPDATE ---
  async update(req, res) {
    try {
      const itemId = BigInt(req.params.id); // O ID do Item é BigInt 
      const { description, unitPrice, categoryId } = req.body;

      // Validação
      if (!description || !unitPrice || !categoryId) {
        return res.status(400).json({ error: 'Descrição, Preço Unitário e ID da Categoria são obrigatórios.' });
      }

      // Converte os tipos
      const fUnitPrice = parseFloat(unitPrice);
      const bCategoryId = BigInt(categoryId);

      const updatedItem = await prisma.item.update({
        where: { id: itemId },
        data: {
          description,
          unitPrice: fUnitPrice,
          categoryId: bCategoryId,
        },
        include: { // Inclui a categoria no retorno
          category: true,
        }
      });
      res.status(200).json(updatedItem);

    } catch (error) {
      // P2025: "Record to update not found." (O Item não existe)
      if (error.code === 'P2025') {
        return res.status(404).json({ error: `Item com ID ${req.params.id} não encontrado.` });
      }
      // P2003: A Categoria (categoryId) informada não existe
      if (error.code === 'P2003') {
        return res.status(404).json({ error: `Categoria com ID ${categoryId} não encontrada.` });
      }
      res.status(500).json({ error: 'Erro ao atualizar item', details: error.message });
    }
  }

  // --- DELETE ---
  async delete(req, res) {
    try {
      const itemId = BigInt(req.params.id); // O ID do Item é BigInt 

      await prisma.item.delete({
        where: { id: itemId },
      });

      res.status(204).send(); // 204 No Content

    } catch (error) {
      // P2025: "Record to delete not found."
      if (error.code === 'P2025') {
        return res.status(404).json({ error: `Item com ID ${req.params.id} não encontrado.` });
      }
      res.status(500).json({ error: 'Erro ao deletar item', details: error.message });
    }
  }
}

// Exportamos uma instância da classe
module.exports = new ItemController();