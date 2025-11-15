// src/index.js
const express = require('express');
const cors = require('cors');


const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors());
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

const orderRoutes = require('./routes/orderRoutes');
app.use('/orders', orderRoutes);

const authRoutes = require('./routes/authRoutes');
app.use('/auth', authRoutes);

// ==========================================================

// --- Rota Padrão ---
app.get('/', (req, res) => {
  res.send('API do "UaiFood" está no ar!');
});

// --- Inicialização do Servidor ---
app.listen(PORT, () => {
  console.log(`Servidor rodando com sucesso na porta ${PORT}`);
});