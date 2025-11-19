// src/controllers/userController.js
const prisma = require('../lib/prismaClient');
const bcrypt = require('bcrypt');

const userSelect = {
  id: true, name: true, email: true, phone: true, type: true,
  addressId: true, address: true, createdAt: true, updatedAt: true,
}

class UserController {

  // --- CREATE ---
  async create(req, res) {
    try {
      // O Zod garantiu a estrutura
      const { name, email, phone, password, type, address } = req.body;

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          phone,
          password: hashedPassword,
          type,
          // Criação aninhada do endereço
          address: {
            create: {
              street: address.street,
              number: address.number,
              district: address.district,
              city: address.city,
              state: address.state,
              zipCode: address.zipCode,
            }
          }
        },
        select: userSelect
      });
      
      res.status(201).json(newUser);

    } catch (error) {
      if (error.code === 'P2002') {
         return res.status(409).json({ error: 'Email, Telefone ou Endereço já está em uso.' });
      }
      res.status(500).json({ error: 'Erro ao criar usuário', details: error.message });
    }
  }

  // --- UPDATE ---
  async update(req, res) {
    try {
      const userId = BigInt(req.params.id);
      const { name, email, phone, password, type, addressId } = req.body;

      const dataToUpdate = {};

      if (name) dataToUpdate.name = name;
      if (email) dataToUpdate.email = email;
      if (phone) dataToUpdate.phone = phone;
      if (addressId) dataToUpdate.addressId = BigInt(addressId);
      if (type) dataToUpdate.type = type;

      if (password) {
        const salt = await bcrypt.genSalt(10);
        dataToUpdate.password = await bcrypt.hash(password, salt);
      }

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: dataToUpdate,
        select: userSelect
      });
      res.status(200).json(updatedUser);

    } catch (error) {
      if (error.code === 'P2025') {
        return res.status(404).json({ error: `Usuário com ID ${req.params.id} não encontrado.` });
      }
      if (error.code === 'P2003') {
        return res.status(404).json({ error: `Endereço vinculado não encontrado.` });
      }
      if (error.code === 'P2002') {
         return res.status(409).json({ error: 'Email ou Telefone já em uso.' });
      }
      res.status(500).json({ error: 'Erro ao atualizar usuário', details: error.message });
    }
  }

  // --- READ (All) ---
  async getAll(req, res) {
    try {
      const users = await prisma.user.findMany({ select: userSelect });
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar usuários', details: error.message });
    }
  }

  // --- READ (by ID) ---
  async getById(req, res) {
    try {
      const userId = BigInt(req.params.id);
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: userSelect
      });
      if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar usuário', details: error.message });
    }
  }

  // --- DELETE ---
  async delete(req, res) {
    try {
      await prisma.user.delete({ where: { id: BigInt(req.params.id) } });
      res.status(204).send();
    } catch (error) {
      if (error.code === 'P2025') return res.status(404).json({ error: 'Usuário não encontrado.' });
      if (error.code === 'P2003') return res.status(409).json({ error: 'Usuário possui pedidos e não pode ser excluído.' });
      res.status(500).json({ error: 'Erro ao deletar usuário', details: error.message });
    }
  }
}

module.exports = new UserController();