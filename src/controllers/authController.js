// src/controllers/authController.js
const prisma = require('../lib/prismaClient');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class AuthController {

  async login(req, res) {
    try {
      // O Zod (via middleware) já garantiu que email e password existem.
      const { email, password } = req.body;

      // 1. Verifica se o usuário existe
      const user = await prisma.user.findUnique({
        where: { email: email }
      });

      if (!user) {
        return res.status(401).json({ error: 'Email ou senha incorretos.' });
      }

      // 2. Verifica se a senha bate
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Email ou senha incorretos.' });
      }

      // 3. Gera o Token
      const token = jwt.sign(
        { 
          id: user.id, 
          type: user.type 
        },
        process.env.JWT_SECRET,
        { expiresIn: '8h' }
      );

      // 4. Retorna Token + Usuário (Importante para o redirecionamento do Front)
      res.status(200).json({
        message: 'Login bem-sucedido!',
        token: token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          type: user.type,
          // Se precisar, pode retornar o endereço também se incluir no findUnique
        }
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro durante o login', details: error.message });
    }
  }
}

module.exports = new AuthController();