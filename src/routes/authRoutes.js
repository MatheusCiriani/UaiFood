const { Router } = require('express');
const authController = require('../controllers/authController');
const validate = require('../middlewares/validate');
const { loginSchema } = require('../schemas/authSchema');

const router = Router();
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Autentica um usuário e retorna o token
 *     description: Verifica email e senha para liberar acesso ao sistema.
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: E-mail do usuário
 *                 example: admin@teste.com
 *               password:
 *                 type: string
 *                 description: Senha do usuário
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Login realizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *       401:
 *         description: Email ou senha incorretos.
 */


router.post('/login', validate(loginSchema), authController.login);

module.exports = router;