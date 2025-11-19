// src/routes/categoryRoutes.js
const { Router } = require('express');
const categoryController = require('../controllers/categoryController');
const checkAuth = require('../middlewares/checkAuth');
const checkAdmin = require('../middlewares/checkAdmin');
const validate = require('../middlewares/validate');
const categorySchema = require('../schemas/categorySchema');

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Categorias
 *     description: Gerenciamento de categorias do cardápio
 */

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Cria uma nova categoria (Requer Admin)
 *     tags: [Categorias]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - description
 *             properties:
 *               description:
 *                 type: string
 *                 description: "Nome da categoria (ex: Bebidas, Lanches)"
 *     responses:
 *       201:
 *         description: Categoria criada com sucesso
 *       400:
 *         description: Erro de validação
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado (apenas admin)
 */
router.post('/', [checkAuth, checkAdmin, validate(categorySchema)], categoryController.create);

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Lista todas as categorias
 *     tags: [Categorias]
 *     responses:
 *       200:
 *         description: Lista de categorias retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   description:
 *                     type: string
 */
router.get('/', categoryController.getAll);

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     summary: Obtém detalhes de uma categoria por ID
 *     tags: [Categorias]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da categoria
 *     responses:
 *       200:
 *         description: Categoria encontrada
 *       404:
 *         description: Categoria não encontrada
 */
router.get('/:id', categoryController.getById);

/**
 * @swagger
 * /categories/{id}:
 *   put:
 *     summary: Atualiza uma categoria existente (Requer Admin)
 *     tags: [Categorias]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da categoria
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Categoria atualizada com sucesso
 *       400:
 *         description: Erro de validação
 *       404:
 *         description: Categoria não encontrada
 */
router.put('/:id', [checkAuth, checkAdmin, validate(categorySchema)], categoryController.update);

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Deleta uma categoria (Requer Admin)
 *     tags: [Categorias]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da categoria a ser deletada
 *     responses:
 *       204:
 *         description: Categoria deletada com sucesso
 *       404:
 *         description: Categoria não encontrada
 *       500:
 *         description: Erro ao deletar (provavelmente a categoria tem itens vinculados)
 */
router.delete('/:id', [checkAuth, checkAdmin], categoryController.delete);

module.exports = router;
