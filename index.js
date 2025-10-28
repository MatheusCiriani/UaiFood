// index.js

const express = require('express');
const { PrismaClient } = require('@prisma/client');

// =================================================================
// Correção para o erro "Do not know how to serialize a BigInt"
BigInt.prototype.toJSON = function() {
  return this.toString();
}
// =================================================================

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para o Express "ler" JSON
app.use(express.json());


/*
 * ==========================================
 * CRUD DE CATEGORIAS
 * ==========================================
 */

// --- CREATE ---
// POST /categories
// Cria uma nova categoria
app.post('/categories', async (req, res) => {
  try {
    const { description } = req.body;

    if (!description) {
      return res.status(400).json({ error: 'A descrição (description) é obrigatória.' });
    }

    const newCategory = await prisma.category.create({
      data: {
        description: description,
      },
    });
    res.status(201).json(newCategory);

  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar categoria', details: error.message });
  }
});

// --- READ (All) ---
// GET /categories
// Lista todas as categorias
app.get('/categories', async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar categorias', details: error.message });
  }
});

// --- READ (by ID) ---
// GET /categories/:id
// Busca uma categoria específica por ID
app.get('/categories/:id', async (req, res) => {
  try {
    const categoryId = BigInt(req.params.id);

    const category = await prisma.category.findUnique({
      where: {
        id: categoryId,
      },
    });

    if (!category) {
      return res.status(4404).json({ error: `Categoria com ID ${categoryId} não encontrada.` });
    }
    res.status(200).json(category);

  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar categoria', details: error.message });
  }
});

// --- UPDATE ---
// PUT /categories/:id
// Atualiza uma categoria existente por ID
app.put('/categories/:id', async (req, res) => {
  try {
    const categoryId = BigInt(req.params.id);
    const { description } = req.body;

    if (!description) {
      return res.status(400).json({ error: 'A descrição (description) é obrigatória.' });
    }

    const updatedCategory = await prisma.category.update({
      where: {
        id: categoryId,
      },
      data: {
        description: description,
      },
    });
    res.status(200).json(updatedCategory);

  } catch (error) {
    // P2025 é o código de erro do Prisma para "Registro não encontrado"
    if (error.code === 'P2025') {
      return res.status(404).json({ error: `Categoria com ID ${req.params.id} não encontrada.` });
    }
    res.status(500).json({ error: 'Erro ao atualizar categoria', details: error.message });
  }
});

// --- DELETE ---
// DELETE /categories/:id
// Deleta uma categoria por ID
app.delete('/categories/:id', async (req, res) => {
  try {
    const categoryId = BigInt(req.params.id);

    await prisma.category.delete({
      where: {
        id: categoryId,
      },
    });

    // 204 "No Content" é a resposta padrão para um DELETE bem-sucedido
    res.status(204).send();

  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: `Categoria com ID ${req.params.id} não encontrada.` });
    }
    res.status(500).json({ error: 'Erro ao deletar categoria', details: error.message });
  }
});


// --- Rota Padrão ---
app.get('/', (req, res) => {
  res.send('API do "tipo iFood" está no ar!');
});

// --- Inicialização do Servidor ---
app.listen(PORT, () => {
  console.log(`Servidor rodando com sucesso na porta ${PORT}`);
});