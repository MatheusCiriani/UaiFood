// src/controllers/categoryController.js
const prisma = require('../lib/prismaClient'); // Importamos nosso prisma centralizado

class CategoryController {

  // --- CREATE ---
  async create(req, res) {
    try {
      const { description } = req.body;

      if (!description) {
        return res.status(400).json({ error: 'A descrição (description) é obrigatória.' });
      }

      const newCategory = await prisma.category.create({
        data: { description: description },
      });
      res.status(201).json(newCategory);

    } catch (error) {
      res.status(500).json({ error: 'Erro ao criar categoria', details: error.message });
    }
  }

  // --- READ (All) ---
  async getAll(req, res) {
    try {
      const categories = await prisma.category.findMany();
      res.status(200).json(categories);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar categorias', details: error.message });
    }
  }

  // --- READ (by ID) ---
  async getById(req, res) {
    try {
      const categoryId = BigInt(req.params.id);
      const category = await prisma.category.findUnique({
        where: { id: categoryId },
      });

      if (!category) {
        return res.status(404).json({ error: `Categoria com ID ${categoryId} não encontrada.` }); // Corrigido para 404
      }
      res.status(200).json(category);

    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar categoria', details: error.message });
    }
  }

  // --- UPDATE ---
  async update(req, res) {
    try {
      const categoryId = BigInt(req.params.id);
      const { description } = req.body;

      if (!description) {
        return res.status(400).json({ error: 'A descrição (description) é obrigatória.' });
      }

      const updatedCategory = await prisma.category.update({
        where: { id: categoryId },
        data: { description: description },
      });
      res.status(200).json(updatedCategory);

    } catch (error) {
      if (error.code === 'P2025') {
        return res.status(404).json({ error: `Categoria com ID ${req.params.id} não encontrada.` });
      }
      res.status(500).json({ error: 'Erro ao atualizar categoria', details: error.message });
    }
  }

  // --- DELETE ---
  async delete(req, res) {
    try {
      const categoryId = BigInt(req.params.id);
      await prisma.category.delete({
        where: { id: categoryId },
      });
      res.status(204).send();

    } catch (error) {
      if (error.code === 'P2025') {
        return res.status(404).json({ error: `Categoria com ID ${req.params.id} não encontrada.` });
      }
      res.status(500).json({ error: 'Erro ao deletar categoria', details: error.message });
    }
  }
}

// Exportamos uma instância da classe
module.exports = new CategoryController();