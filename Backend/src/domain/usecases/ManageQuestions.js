const questionsRepository = require('../../infra/QuestionsRepository');

module.exports = {
  getAll: () => questionsRepository.getAll(),
  add: (question, options) => questionsRepository.add(question, options),
  remove: (id) => questionsRepository.remove(id),
};
