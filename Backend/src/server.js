const express = require('express');
const { setupMiddlewares, setupRoutes } = require('./interfaces/routes/Index.js');
const whatsappClient = require('./infra/WhatsappClient.js');
const cors = require('./app/middlewares/CorsMiddleware.js');

const app = express();
const PORT = process.env.PORT;

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

// Middleware de CORS (antes das rotas)
app.use(cors);

// Política de Segurança de Conteúdo (CSP)
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; img-src 'self' data:;" // Permite imagens base64
  );
  next();
});

// Configurar middlewares e rotas
setupMiddlewares(app);
setupRoutes(app);

// Tratamento de erros global
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
