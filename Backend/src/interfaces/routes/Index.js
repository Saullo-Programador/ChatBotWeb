const corsMiddleware = require('../app/middlewares/corsMiddleware');
const jsonMiddleware = require('../app/middlewares/jsonMiddleware');
const questionsRoutes = require('./routes/questionsRoutes');
const qrRoutes = require('./routes/qrRoutes');

const setupMiddlewares = (app) => {
  app.use(corsMiddleware);
  app.use(jsonMiddleware);
};

const setupRoutes = (app) => {
  app.use('/questions', questionsRoutes);
  app.use('/qr', qrRoutes);
};

module.exports = { setupMiddlewares, setupRoutes };
