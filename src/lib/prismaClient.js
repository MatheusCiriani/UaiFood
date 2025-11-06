const { PrismaClient } = require('@prisma/client');

// Correção para o erro "Do not know how to serialize a BigInt"
BigInt.prototype.toJSON = function() {
  return this.toString();
}

const prisma = new PrismaClient();

console.log("--- 1. ARQUIVO prismaClient.js FOI EXECUTADO ---"); 

module.exports = prisma;