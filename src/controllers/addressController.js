// src/controllers/addressController.js
const prisma = require('../lib/prismaClient');

class AddressController {

  async create(req, res) {
    try {
      const { street, number, district, city, state, zipCode } = req.body;
      const newAddress = await prisma.address.create({
        data: { street, number, district, city, state, zipCode }
      });
      res.status(201).json(newAddress);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao criar endereço', details: error.message });
    }
  }

  async update(req, res) {
    try {
      const addressId = BigInt(req.params.id);
      const { street, number, district, city, state, zipCode } = req.body;
      const updatedAddress = await prisma.address.update({
        where: { id: addressId },
        data: { street, number, district, city, state, zipCode }
      });
      res.status(200).json(updatedAddress);
    } catch (error) {
      if (error.code === 'P2025') return res.status(404).json({ error: 'Endereço não encontrado.' });
      res.status(500).json({ error: 'Erro ao atualizar endereço', details: error.message });
    }
  }

  async getAll(req, res) {
    try {
      const addresses = await prisma.address.findMany({
        include: { user: { select: { id: true, name: true } } }
      });
      res.status(200).json(addresses);
    } catch (error) {
      res.status(500).json({ error: 'Erro', details: error.message });
    }
  }

  async getById(req, res) {
    try {
      const address = await prisma.address.findUnique({
        where: { id: BigInt(req.params.id) },
        include: { user: { select: { id: true, name: true } } }
      });
      if (!address) return res.status(404).json({ error: 'Endereço não encontrado.' });
      res.status(200).json(address);
    } catch (error) {
      res.status(500).json({ error: 'Erro', details: error.message });
    }
  }

  async delete(req, res) {
    try {
      await prisma.address.delete({ where: { id: BigInt(req.params.id) } });
      res.status(204).send();
    } catch (error) {
      if (error.code === 'P2025') return res.status(404).json({ error: 'Endereço não encontrado.' });
      if (error.code === 'P2003') return res.status(409).json({ error: 'Endereço em uso.' });
      res.status(500).json({ error: 'Erro ao deletar endereço', details: error.message });
    }
  }
}

module.exports = new AddressController();