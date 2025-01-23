const express = require('express');
const corsMiddleware = require('./app/middlewares/CorsMiddleware.js'); // Caminho correto para o arquivo
console.log(typeof corsMiddleware)

const app = express();

// Configuração do CORS
app.use(corsMiddleware);

// Outras configurações do servidor...
app.use(express.json());

// Rotas
const routes = require('./interfaces/routes/Index.js');
app.use(routes);

// Porta do servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
