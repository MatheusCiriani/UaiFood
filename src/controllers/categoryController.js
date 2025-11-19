// src/controllers/categoryController.js
const prisma = require('../lib/prismaClient');

class CategoryController {

  async create(req, res) {
    try {
      const { description } = req.body;
      const newCategory = await prisma.category.create({
        data: { description },
      });
      res.status(201).json(newCategory);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao criar categoria', details: error.message });
    }
  }

  async update(req, res) {
    try {
      const categoryId = BigInt(req.params.id);
      const { description } = req.body;
      const updatedCategory = await prisma.category.update({
        where: { id: categoryId },
        data: { description },
      });
      res.status(200).json(updatedCategory);
    } catch (error) {
      if (error.code === 'P2025') return res.status(404).json({ error: 'Categoria não encontrada.' });
      res.status(500).json({ error: 'Erro ao atualizar categoria', details: error.message });
    }
  }

  async getAll(req, res) {
    try {
      const categories = await prisma.category.findMany();
      res.status(200).json(categories);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar categorias', details: error.message });
    }
  }

  async getById(req, res) {
    try {
      const category = await prisma.category.findUnique({ where: { id: BigInt(req.params.id) } });
      if (!category) return res.status(404).json({ error: 'Categoria não encontrada.' });
      res.status(200).json(category);
    } catch (error) {
      res.status(500).json({ error: 'Erro', details: error.message });
    }
  }

  async delete(req, res) {
    try {
      await prisma.category.delete({ where: { id: BigInt(req.params.id) } });
      res.status(204).send();
    } catch (error) {
      if (error.code === 'P2025') return res.status(404).json({ error: 'Categoria não encontrada.' });
      res.status(500).json({ error: 'Erro ao deletar categoria', details: error.message });
    }
  }
}

module.exports = new CategoryController();