// src/controllers/userController.js
const prisma = require('../lib/prismaClient'); // Você está usando 'prismaClient', vou manter
const bcrypt = require('bcrypt');

// Um "select" padrão para NUNCA retornar a senha
const userSelect = {
  id: true,
  name: true,
  phone: true,
  type: true,
  addressId: true,
  address: true, // Inclui o endereço, se houver
  createdAt: true,
  updatedAt: true,
}

class UserController {

  // --- CREATE (MODIFICADO) ---
  async create(req, res) {
    try {
      // Agora esperamos um objeto 'address' no body, e NÃO 'addressId'
      const { name, phone, password, type, address } = req.body;

      // Validação dos dados do Usuário
      if (!name || !phone || !password || !type) {
        return res.status(400).json({ error: 'Nome, Telefone, Senha e Tipo são obrigatórios.' });
      }

      // Validação do 'address' (agora é obrigatório)
      if (!address) {
        return res.status(400).json({ error: 'O objeto "address" (endereço) é obrigatório.' });
      }

      // Validação dos campos DENTRO do 'address'
      const { street, number, district, city, state, zipCode } = address;
      if (!street || !number || !district || !city || !state || !zipCode) {
        return res.status(400).json({ error: 'Todos os campos do endereço são obrigatórios: rua, número, bairro, cidade, estado e CEP.' });
      }

      // Valida o ENUM UserType 
      if (type !== 'CLIENT' && type !== 'ADMIN') {
        return res.status(400).json({ error: 'O "Tipo" de usuário deve ser "CLIENT" ou "ADMIN".' });
      }

      // --- CRIPTOGRAFIA DA SENHA ---
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      // -------------------------------

      // --- CRIAÇÃO ANINHADA (NESTED CREATE) ---
      // O Prisma vai criar o Usuário e o Endereço na mesma transação.
      // Ele cria o 'address' primeiro, pega o ID, e o vincula ao novo 'user'.
      const newUser = await prisma.user.create({
        data: {
          name,
          phone,
          password: hashedPassword,
          type,
          address: { // Aqui está a mágica
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
        select: userSelect // Usa o select para não retornar a senha
      });
      
      res.status(201).json(newUser);

    } catch (error) {
      // Os erros P2003 e P2002 (de 'addressId') não se aplicam mais aqui,
      // pois estamos criando o endereço junto.
      // Um erro P2002 (unique constraint) pode acontecer se 'phone' for único no schema, por exemplo.
      if (error.code === 'P2002') {
         return res.status(409).json({ error: 'Erro de campo único (ex: telefone ou endereço já podem estar em uso, se forem @unique)', details: error.message });
      }
      res.status(500).json({ error: 'Erro ao criar usuário e endereço', details: error.message });
    }
  }

  // --- READ (All) ---
  async getAll(req, res) {
    try {
      const users = await prisma.user.findMany({
        select: userSelect // NUNCA retorne a senha
      });
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
        select: userSelect // NUNCA retorne a senha
      });

      if (!user) {
        return res.status(404).json({ error: `Usuário com ID ${userId} não encontrado.` });
      }
      res.status(200).json(user);

    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar usuário', details: error.message });
    }
  }

  // --- UPDATE ---
  // A lógica de update continua a mesma. 
  // O usuário pode atualizar seus dados ou trocar seu 'addressId' por outro existente.
  // Se quiséssemos permitir a ATUALIZAÇÃO do endereço aninhado, faríamos parecido com o create.
  async update(req, res) {
    let addressId; // Para usar no catch
    try {
      const userId = BigInt(req.params.id);
      let { name, phone, password, type, addressId } = req.body;

      const dataToUpdate = {};

      if (name) dataToUpdate.name = name;
      if (phone) dataToUpdate.phone = phone;
      if (addressId) dataToUpdate.addressId = BigInt(addressId);
      
      if (type) {
        if (type !== 'CLIENT' && type !== 'ADMIN') {
          return res.status(400).json({ error: 'O "Tipo" de usuário deve ser "CLIENT" ou "ADMIN".' });
        }
        dataToUpdate.type = type;
      }

      if (password) {
        const salt = await bcrypt.genSalt(10);
        dataToUpdate.password = await bcrypt.hash(password, salt);
      }

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: dataToUpdate,
        select: userSelect // NUNCA retorne a senha
      });
      res.status(200).json(updatedUser);

    } catch (error) {
      if (error.code === 'P2025') {
        return res.status(404).json({ error: `Usuário com ID ${req.params.id} não encontrado.` });
      }
      if (error.code === 'P2003') {
        return res.status(404).json({ error: `Endereço com ID ${addressId} não encontrado.` });
      }
      res.status(500).json({ error: 'Erro ao atualizar usuário', details: error.message });
    }
  }

  // --- DELETE ---
  async delete(req, res) {
    try {
      const userId = BigInt(req.params.id);

      // Importante: Como o Endereço está 1-para-1, 
      // o que acontece com ele quando o User é deletado?
      // Depende do 'onDelete' no seu schema. Se não houver,
      // você pode precisar deletar o endereço manualmente
      // ou o endereço ficará "órfão" no banco.

      await prisma.user.delete({
        where: { id: userId },
      });

      res.status(204).send(); // 204 No Content

    } catch (error) {
      if (error.code === 'P2025') {
        return res.status(404).json({ error: `Usuário com ID ${req.params.id} não encontrado.` });
      }
      if (error.code === 'P2003') {
        return res.status(409).json({ error: 'Este usuário não pode ser deletado pois possui pedidos (Orders) vinculados.' });
      }
      res.status(500).json({ error: 'Erro ao deletar usuário', details: error.message });
    }
  }
}

module.exports = new UserController();