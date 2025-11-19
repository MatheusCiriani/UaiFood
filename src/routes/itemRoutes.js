// src/routes/itemRoutes.js
const { Router } = require('express');
const itemController = require('../controllers/itemController');
const checkAuth = require('../middlewares/checkAuth');
const checkAdmin = require('../middlewares/checkAdmin');
const upload = require('../config/upload');
const validate = require('../middlewares/validate');
const itemSchema = require('../schemas/itemSchema');

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Itens
 *     description: Gerenciamento de produtos e upload de imagens
 */

/**
 * @swagger
 * /items:
 *   post:
 *     summary: Cria um novo item com imagem (Requer Admin)
 *     tags: [Itens]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - description
 *               - unitPrice
 *               - categoryId
 *             properties:
 *               description:
 *                 type: string
 *                 description: Nome do produto
 *               unitPrice:
 *                 type: number
 *                 description: Preço unitário (ex 25.50)
 *               categoryId:
 *                 type: string
 *                 description: ID da categoria
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Arquivo de imagem do produto
 *     responses:
 *       201:
 *         description: Item criado com sucesso
 *       400:
 *         description: Erro de validação ou upload
 *       401:
 *         description: Não autorizado
 */

router.post('/',[checkAuth, checkAdmin, upload.single('image'), validate(itemSchema)],itemController.create);

/**
 * @swagger
 * /items:
 *   get:
 *     summary: Lista todos os itens do cardápio
 *     tags: [Itens]
 *     responses:
 *       200:
 *         description: Lista de itens retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get('/', itemController.getAll);

/**
 * @swagger
 * /items/{id}:
 *   get:
 *     summary: Obtém detalhes de um item por ID
 *     tags: [Itens]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do item
 *     responses:
 *       200:
 *         description: Detalhes do item
 *       404:
 *         description: Item não encontrado
 */
router.get('/:id', itemController.getById);

/**
 * @swagger
 * /items/{id}:
 *   put:
 *     summary: Atualiza um item existente (Requer Admin)
 *     tags: [Itens]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do item
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *               unitPrice:
 *                 type: number
 *               categoryId:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Item atualizado com sucesso
 *       400:
 *         description: Erro de validação
 *       404:
 *         description: Item não encontrado
 */
router.put('/:id',[checkAuth, checkAdmin, upload.single('image'), validate(itemSchema)],itemController.update);

/**
 * @swagger
 * /items/{id}:
 *   delete:
 *     summary: Deleta um item (Requer Admin)
 *     tags: [Itens]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do item a ser deletado
 *     responses:
 *       204:
 *         description: Item deletado com sucesso
 *       404:
 *         description: Item não encontrado
 */
router.delete('/:id', [checkAuth, checkAdmin], itemController.delete);

module.exports = router;
