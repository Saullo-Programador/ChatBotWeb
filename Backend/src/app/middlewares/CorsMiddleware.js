const cors = require('cors');

// Configuração do middleware CORS
const corsMiddleware = cors({
  origin: [
    'https://chat-bot-qo1lw6kb7-saullo-programadors-projects.vercel.app', // URL do frontend na Vercel
    'http://localhost:3000', // Para desenvolvimento local
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true, // Se necessário (cookies, autenticação)
});

module.exports = corsMiddleware;
