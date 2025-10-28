// 1. Importar o Express
const express = require('express');

// 2. Criar uma instância do Express
const app = express();
app.use(express.json());

// 3. Definir a porta (use uma porta alta, como 3000 ou 8000)
// Usamos process.env.PORT para compatibilidade com serviços de deploy (como Heroku)
const PORT = process.env.PORT || 3000;

// 4. Criar uma rota de teste (Endpoint)
// Quando alguém acessar a raiz (/) do seu site com o método GET...
app.get('/', (req, res) => {
  // req = Requisição (dados que vêm do cliente)
  // res = Resposta (o que você envia de volta)
  res.send('Olá, mundo! Meu primeiro servidor Express está no ar.');
});

// 5. Iniciar o servidor e fazê-lo "ouvir" a porta definida
app.listen(PORT, () => {
  console.log(`Servidor rodando com sucesso na porta ${PORT}`);
});