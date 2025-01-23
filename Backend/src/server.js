const express = require('express');
const cors = require('cors');  // Importa diretamente o pacote CORS

const app = express();

// Use o middleware CORS diretamente
app.use(cors({
  origin: [
    'https://chat-bot-qo1lw6kb7-saullo-programadors-projects.vercel.app',
    'http://localhost:3000',
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

// Outras configurações do servidor
app.use(express.json());

// Rotas
const routes = require('./interfaces/routes/Index');
app.use(routes);

// Inicialização do servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
