// src/routes/userRoutes.js
const { Router } = require('express');
const userController = require('../controllers/userController');
const checkAuth = require('../middlewares/checkAuth');
const checkAdmin = require('../middlewares/checkAdmin');
const validate = require('../middlewares/validate');
const { createUserSchema, updateUserSchema } = require('../schemas/userSchema');

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Usuários
 *   description: Gerenciamento de usuários e registro
 */

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Cria um novo usuário (Registro Público)
 *     tags: [Usuários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - type
 *               - address
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *               password:
 *                 type: string
 *                 format: password
 *               type:
 *                 type: string
 *                 enum: [CLIENT, ADMIN]
 *               address:
 *                 type: object
 *                 properties:
 *                   street:
 *                     type: string
 *                   number:
 *                     type: string
 *                   district:
 *                     type: string
 *                   city:
 *                     type: string
 *                   state:
 *                     type: string
 *                   zipCode:
 *                     type: string
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *       400:
 *         description: Erro de validação
 *       409:
 *         description: Email já cadastrado
 */
router.post('/', validate(createUserSchema), userController.create);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Lista todos os usuários (Requer Admin)
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuários
 *       403:
 *         description: Acesso negado
 */
router.get('/', [checkAuth, checkAdmin], userController.getAll);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Obtém um usuário por ID (Requer Admin)
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Dados do usuário
 *       404:
 *         description: Usuário não encontrado
 */
router.get('/:id', [checkAuth, checkAdmin], userController.getById);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Atualiza dados de um usuário
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *               password:
 *                 type: string
 *               addressId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Usuário atualizado
 *       404:
 *         description: Usuário não encontrado
 */
router.put('/:id', [checkAuth, validate(updateUserSchema)], userController.update);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Deleta um usuário
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Usuário deletado
 *       404:
 *         description: Usuário não encontrado
 *       409:
 *         description: Conflito (usuário possui pedidos vinculados)
 */
router.delete('/:id', checkAuth, userController.delete);

module.exports = router;
