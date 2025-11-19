// src/routes/orderRoutes.js
const { Router } = require('express');
const orderController = require('../controllers/orderController');
const checkAuth = require('../middlewares/checkAuth');
const checkAdmin = require('../middlewares/checkAdmin');
const validate = require('../middlewares/validate');
const { createOrderSchema, updateOrderSchema } = require('../schemas/orderSchema');

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Pedidos
 *   description: Gerenciamento de pedidos
 */

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Cria um novo pedido
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - paymentMethod
 *               - items
 *             properties:
 *               paymentMethod:
 *                 type: string
 *                 enum: [PIX, CASH, CREDIT, DEBIT]
 *                 description: Método de pagamento
 *               status:
 *                 type: string
 *                 default: PENDING
 *                 description: Status inicial do pedido
 *               clientId:
 *                 type: integer
 *                 description: ID do cliente (opcional se pego do token)
 *               createdById:
 *                 type: integer
 *                 description: ID do criador (opcional se pego do token)
 *               items:
 *                 type: array
 *                 description: Lista de itens do pedido
 *                 items:
 *                   type: object
 *                   required:
 *                     - itemId
 *                     - quantity
 *                   properties:
 *                     itemId:
 *                       type: integer
 *                       description: ID do item no cardápio
 *                     quantity:
 *                       type: integer
 *                       description: Quantidade do item
 *     responses:
 *       201:
 *         description: Pedido criado com sucesso
 *       400:
 *         description: Erro de validação ou dados incorretos
 *       404:
 *         description: Cliente, Criador ou Item não encontrado
 */
router.post('/', [checkAuth, validate(createOrderSchema)], orderController.create);

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Lista pedidos
 *     description: Se for ADMIN, retorna todos. Se for CLIENT, retorna apenas os seus.
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pedidos retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get('/', checkAuth, orderController.getAll);

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Obtém detalhes de um pedido específico
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do pedido
 *     responses:
 *       200:
 *         description: Detalhes do pedido encontrados
 *       404:
 *         description: Pedido não encontrado
 */
router.get('/:id', checkAuth, orderController.getById);

/**
 * @swagger
 * /orders/{id}:
 *   put:
 *     summary: Atualiza o status ou pagamento de um pedido
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do pedido
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PENDING, COMPLETED, CANCELLED]
 *               paymentMethod:
 *                 type: string
 *                 enum: [PIX, CASH, CREDIT, DEBIT]
 *     responses:
 *       200:
 *         description: Pedido atualizado com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Pedido não encontrado
 */
router.put('/:id', [checkAuth, validate(updateOrderSchema)], orderController.update);

/**
 * @swagger
 * /orders/{id}:
 *   delete:
 *     summary: Deleta um pedido (Requer Admin)
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do pedido a ser deletado
 *     responses:
 *       204:
 *         description: Pedido deletado com sucesso
 *       403:
 *         description: Acesso negado (apenas admin)
 *       404:
 *         description: Pedido não encontrado
 */
router.delete('/:id', [checkAuth, checkAdmin], orderController.delete);

module.exports = router;
