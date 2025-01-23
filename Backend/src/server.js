const express = require('express');
const corsMiddleware = require('./app/middlewares/CorsMiddleware'); // Caminho correto para o middleware

const app = express();

// Use o middleware CORS
app.use(corsMiddleware);

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
