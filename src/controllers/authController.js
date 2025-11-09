// src/controllers/authController.js
const prisma = require('../lib/prismaClient');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class AuthController {

  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
      }

      // 1. Encontra o usuário pelo email
      const user = await prisma.user.findUnique({
        where: { email: email }
      });

      // Se o email não existe
      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado.' });
      }

      // 2. Compara a senha enviada com a senha (hash) no banco
      const isPasswordValid = await bcrypt.compare(password, user.password);

      // Se a senha está incorreta
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Senha inválida.' });
      }

      // 3. Gera o Token JWT
      // O token vai "carregar" o ID e o Tipo (CLIENT/ADMIN) do usuário
      const token = jwt.sign(
        { 
          id: user.id, 
          type: user.type 
        },
        process.env.JWT_SECRET, // Nosso segredo do .env
        { expiresIn: '8h' } // O token expira em 8 horas
      );

      // Não retornamos o usuário todo, especialmente a senha!
      res.status(200).json({
        message: 'Login bem-sucedido!',
        token: token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          type: user.type
        }
      });

    } catch (error) {
      res.status(500).json({ error: 'Erro durante o login', details: error.message });
    }
  }
}

module.exports = new AuthController();