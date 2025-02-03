const express = require('express');
const { setupMiddlewares, setupRoutes } = require('./interfaces/routes/Index.js');
const whatsappClient = require('./infra/WhatsappClient');
const cors = require('cors');

const app = express();
const PORT = process.env || 4000 ;
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

app.use(cors({
    origin: 'https://chat-bot-web-nine.vercel.app', // Permite apenas o seu frontend
    methods: ['GET', 'POST'], // Métodos permitidos
    allowedHeaders: ['Content-Type', 'Authorization'] // Cabeçalhos permitidos
}));

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
