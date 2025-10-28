const { PrismaClient } = require('@prisma/client');

// Correção para o erro "Do not know how to serialize a BigInt"
BigInt.prototype.toJSON = function() {
  return this.toString();
}

const prisma = new PrismaClient();

module.exports = prisma;