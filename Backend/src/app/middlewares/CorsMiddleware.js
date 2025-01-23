const cors = require('cors');

const corsMiddleware = cors({
  origin: [
    'https://chat-bot-qo1lw6kb7-saullo-programadors-projects.vercel.app', // URL do frontend na Vercel
    'http://localhost:3000', // Para desenvolvimento local (se necessário)
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true, // Se precisar de cookies ou autenticação
});

module.exports = corsMiddleware;
