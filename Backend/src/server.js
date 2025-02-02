const express = require('express');
const { setupMiddlewares, setupRoutes } = require('./interfaces/routes/Index.js');
const whatsappClient = require('./infra/WhatsappClient.js');

const app = express();
const PORT = process.env.PORT;
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

// Configurar middlewares e rotas
setupMiddlewares(app);
setupRoutes(app);

// Adicione tratamento de erros global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Erro interno do servidor' });
});

// Inicializar o cliente do WhatsApp
whatsappClient.initialize();
// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
