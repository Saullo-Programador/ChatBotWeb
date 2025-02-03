const cors = require('cors');

const allowedOrigins = [
  process.env.FRONTEND_URL || 'https://chat-bot-web-nine.vercel.app',
  'http://localhost:3000'
];

const corsOptions = {
  origin: (origin, callback) => {
    console.log('Origin recebida:', origin);
    console.log('Allowed Origins:', allowedOrigins);
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Permite cookies e autenticação via headers
};

module.exports = cors(corsOptions);
