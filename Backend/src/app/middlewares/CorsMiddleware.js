const cors = require('cors');

app.use(
    cors({
      origin: ['https://chat-bot-qo1lw6kb7-saullo-programadors-projects.vercel.app/'], // Substitua pela URL do frontend na Vercel
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      credentials: true, // Se necessário (cookies, auth)
    })
  );

module.exports = cors();
