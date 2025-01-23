const corsMiddleware = require('../../app/middlewares/CorsMiddleware');
const jsonMiddleware = require('../../app/middlewares/JsonMiddleware');
const questionsRoutes = require('./QuestionsRoutes');
const qrRoutes = require('./QrRoutes');

const setupMiddlewares = (app) => {
  app.use(corsMiddleware);
  app.use(jsonMiddleware);
};

const setupRoutes = (app) => {
  app.use('/questions', questionsRoutes);
  app.use('/qr', qrRoutes);
};

module.exports = { setupMiddlewares, setupRoutes };
