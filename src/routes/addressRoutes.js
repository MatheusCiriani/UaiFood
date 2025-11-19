// src/routes/addressRoutes.js
const { Router } = require('express');
const addressController = require('../controllers/addressController');
const checkAuth = require('../middlewares/checkAuth');
const validate = require('../middlewares/validate');
const addressSchema = require('../schemas/addressSchema');

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Endereços
 *   description: Gerenciamento de endereços
 */

/**
 * @swagger
 * /addresses:
 *   post:
 *     summary: Cria um novo endereço
 *     tags: [Endereços]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - street
 *               - number
 *               - district
 *               - city
 *               - state
 *               - zipCode
 *             properties:
 *               street:
 *                 type: string
 *                 description: Rua ou Avenida
 *               number:
 *                 type: string
 *                 description: Número da residência
 *               district:
 *                 type: string
 *                 description: Bairro
 *               city:
 *                 type: string
 *                 description: Cidade
 *               state:
 *                 type: string
 *                 description: Estado (UF)
 *               zipCode:
 *                 type: string
 *                 description: CEP
 *     responses:
 *       201:
 *         description: Endereço criado com sucesso
 *       400:
 *         description: Erro de validação
 */
router.post('/', [checkAuth, validate(addressSchema)], addressController.create);

/**
 * @swagger
 * /addresses:
 *   get:
 *     summary: Lista todos os endereços
 *     tags: [Endereços]
 *     responses:
 *       200:
 *         description: Lista de endereços retornada
 */
router.get('/', addressController.getAll);

/**
 * @swagger
 * /addresses/{id}:
 *   get:
 *     summary: Obtém um endereço por ID
 *     tags: [Endereços]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do endereço
 *     responses:
 *       200:
 *         description: Endereço encontrado
 *       404:
 *         description: Endereço não encontrado
 */
router.get('/:id', addressController.getById);

/**
 * @swagger
 * /addresses/{id}:
 *   put:
 *     summary: Atualiza um endereço existente
 *     tags: [Endereços]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do endereço
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               street:
 *                 type: string
 *               number:
 *                 type: string
 *               district:
 *                 type: string
 *               city:
 *                 type: string
 *               state:
 *                 type: string
 *               zipCode:
 *                 type: string
 *     responses:
 *       200:
 *         description: Endereço atualizado com sucesso
 *       400:
 *         description: Erro de validação
 *       404:
 *         description: Endereço não encontrado
 */
router.put('/:id', [checkAuth, validate(addressSchema)], addressController.update);

/**
 * @swagger
 * /addresses/{id}:
 *   delete:
 *     summary: Deleta um endereço
 *     tags: [Endereços]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do endereço
 *     responses:
 *       204:
 *         description: Endereço deletado com sucesso
 *       404:
 *         description: Endereço não encontrado
 *       409:
 *         description: Erro (endereço em uso por um usuário)
 */
router.delete('/:id', addressController.delete);

module.exports = router;
