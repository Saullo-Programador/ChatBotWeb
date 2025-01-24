const cors = require('cors');

const allowedOrigins = [
  'https://chatbotweb-q157.onrender.com', // URL do backend
  'http://localhost:3000', // Para desenvolvimento local
  'https://chat-bot-711u1fc10-saullo-programadors-projects.vercel.app/', // Substitua pela URL final do frontend após o deploy
];

const corsOptions = {
  origin: (origin, callback) => {
    // Permite requisições sem origem (como ferramentas do Postman) ou valida a origem
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Permite cookies se necessário
};

module.exports = cors(corsOptions);
