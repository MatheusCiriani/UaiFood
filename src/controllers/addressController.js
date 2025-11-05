// src/controllers/addressController.js
const prisma = require('../lib/prismaClient');

class AddressController {

  // --- CREATE ---
  async create(req, res) {
    try {
      // Todos os campos do Address
      const { street, number, district, city, state, zipCode } = req.body;

      // Validação básica
      if (!street || !number || !district || !city || !state || !zipCode) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios: rua, número, bairro, cidade, estado e CEP.' });
      }

      const newAddress = await prisma.address.create({
        data: {
          street,
          number,
          district,
          city,
          state,
          zipCode,
        }
      });
      res.status(201).json(newAddress);

    } catch (error) {
      res.status(500).json({ error: 'Erro ao criar endereço', details: error.message });
    }
  }

  // --- READ (All) ---
  async getAll(req, res) {
    try {
      const addresses = await prisma.address.findMany({
        // Opcional: incluir o usuário atrelado, se houver
        include: {
          user: {
            select: { id: true, name: true } // Seleciona só alguns campos do user
          } 
        }
      });
      res.status(200).json(addresses);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar endereços', details: error.message });
    }
  }

  // --- READ (by ID) ---
  async getById(req, res) {
    try {
      const addressId = BigInt(req.params.id);
      const address = await prisma.address.findUnique({
        where: { id: addressId },
        include: { user: { select: { id: true, name: true } } }
      });

      if (!address) {
        return res.status(404).json({ error: `Endereço com ID ${addressId} não encontrado.` });
      }
      res.status(200).json(address);

    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar endereço', details: error.message });
    }
  }

  // --- UPDATE ---
  async update(req, res) {
    try {
      const addressId = BigInt(req.params.id);
      const { street, number, district, city, state, zipCode } = req.body;

      // Validação
      if (!street || !number || !district || !city || !state || !zipCode) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
      }

      const updatedAddress = await prisma.address.update({
        where: { id: addressId },
        data: {
          street,
          number,
          district,
          city,
          state,
          zipCode,
        }
      });
      res.status(200).json(updatedAddress);

    } catch (error) {
      // P2025: "Record to update not found." (O Endereço não existe)
      if (error.code === 'P2025') {
        return res.status(404).json({ error: `Endereço com ID ${req.params.id} não encontrado.` });
      }
      res.status(500).json({ error: 'Erro ao atualizar endereço', details: error.message });
    }
  }

  // --- DELETE ---
  async delete(req, res) {
    try {
      const addressId = BigInt(req.params.id);

      await prisma.address.delete({
        where: { id: addressId },
      });

      res.status(204).send(); // 204 No Content

    } catch (error) {
      // P2025: "Record to delete not found."
      if (error.code === 'P2025') {
        return res.status(404).json({ error: `Endereço com ID ${req.params.id} não encontrado.` });
      }
      // P2003: "Foreign key constraint failed"
      // Isso acontece se você tentar deletar um Endereço que um User está usando.
      if (error.code === 'P2003') {
         return res.status(409).json({ error: 'Este endereço não pode ser deletado pois está em uso por um usuário.' });
      }
      res.status(500).json({ error: 'Erro ao deletar endereço', details: error.message });
    }
  }
}

module.exports = new AddressController();