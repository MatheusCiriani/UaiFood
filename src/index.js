// src/index.js
const express = require('express');
const cors = require('cors');
const path = require('path');

// --- IMPORTAÇÕES DO SWAGGER ---
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./config/swagger'); // Caminho para o arquivo que criamos


const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors());
// Middleware para o Express "ler" JSON
app.use(express.json());

// --- 2. ROTA DA DOCUMENTAÇÃO SWAGGER ---
// Ao acessar http://localhost:3000/api-docs, você verá a documentação
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// rota para ver o JSON real
app.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerDocs);
});

// ==========================================================
// IMPORTAR E USAR AS ROTAS DE CATEGORIA
// ==========================================================
const categoryRoutes = require('./routes/categoryRoutes');
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

// --- SERVIR IMAGENS ESTÁTICAS ---
// Torna a pasta 'uploads' acessível publicamente na rota '/uploads'
app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));

// ==========================================================

// --- Rota Padrão ---
app.get('/', (req, res) => {
  res.send('API do "UaiFood" está no ar! Acesse /api-docs para ver a documentação.');
});

// --- Inicialização do Servidor ---
app.listen(PORT, () => {
  console.log(`Servidor rodando com sucesso na porta ${PORT}`);
  console.log(`Documentação Swagger disponível em http://localhost:${PORT}/api-docs`);
});