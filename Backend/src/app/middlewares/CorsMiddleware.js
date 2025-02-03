const cors = require('cors');

const allowedOrigins = [
  'https://chat-bot-web-nine.vercel.app',
  'http://localhost:3000',
  'https://chat-bot-web-git-main-saullo-programadors-projects.vercel.app/Conectar'
];

const corsOptions = {
  origin: (origin, callback) => {
    console.log('Origin recebida:', origin);
    console.log('Allowed Origins:', allowedOrigins);
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error('Bloqueado por CORS:', origin); // Log detalhado
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Permite cookies e autenticação via headers
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

module.exports = cors(corsOptions);
