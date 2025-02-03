const cors = require('cors');

console.log("Allowed Origins:", allowedOrigins);


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
