const express = require('express');
const { setupMiddlewares, setupRoutes } = require('../interfaces/routes/Index');
const whatsappClient = require('../infra/whatsapp/WhatsappClient');

const app = express();
const PORT = 3000;

// Configurar middlewares e rotas
setupMiddlewares(app);
setupRoutes(app);

// Inicializar o cliente do WhatsApp
whatsappClient.initialize();

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
