// src/index.js
const express = require('express');

// Não precisamos mais do PrismaClient ou do BigInt aqui
// const { PrismaClient } = require('@prisma/client');
// BigInt.prototype.toJSON = function() { ... }

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para o Express "ler" JSON
app.use(express.json());

// ==========================================================
// IMPORTAR E USAR AS ROTAS DE CATEGORIA
// ==========================================================
const categoryRoutes = require('./routes/categoryRoutes');

// Aqui está a mágica:
// Dizemos ao Express que qualquer rota que comece com '/categories'
// deve ser gerenciada pelo arquivo 'categoryRoutes'.
app.use('/categories', categoryRoutes);

const itemRoutes = require('./routes/itemRoutes'); 
app.use('/items', itemRoutes);             

const addressRoutes = require('./routes/addressRoutes'); 
app.use('/addresses', addressRoutes);

const userRoutes = require('./routes/userRoutes');
app.use('/users', userRoutes);

// ==========================================================

/*
 * Todo o CRUD DE CATEGORIAS foi removido daqui
 * e movido para 'controllers' e 'routes'
 */

// --- Rota Padrão ---
app.get('/', (req, res) => {
  res.send('API do "UaiFood" está no ar!');
});

// --- Inicialização do Servidor ---
app.listen(PORT, () => {
  console.log(`Servidor rodando com sucesso na porta ${PORT}`);
});