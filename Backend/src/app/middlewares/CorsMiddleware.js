const cors = require('cors');


const allowedOrigins = [
  'https://chat-bot-web-git-main-saullo-programadors-projects.vercel.app/', // URL do frontend no Vercel
  'http://localhost:3000' // Para desenvolvimento local
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Se estiver usando cookies ou autenticação
};

module.exports = require('cors')(corsOptions);

