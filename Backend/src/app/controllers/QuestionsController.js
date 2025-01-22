const manageQuestions = require('../../domain/usecases/ManageQuestions');

module.exports = {
  getQuestions: (req, res) => {
    try {
      const questions = manageQuestions.getAll();
      res.json(questions);
    } catch (err) {
      res.status(500).json({ message: 'Erro ao carregar perguntas.' });
    }
  },
  addQuestion: (req, res) => {
    const { question, options } = req.body;
    try {
      const newQuestion = manageQuestions.add(question, options);
      res.status(201).json(newQuestion);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },
  deleteQuestion: (req, res) => {
    const id = parseInt(req.params.id);
    try {
      manageQuestions.remove(id);
      res.json({ message: 'Pergunta removida com sucesso.' });
    } catch (err) {
      res.status(500).json({ message: 'Erro ao deletar pergunta.' });
    }
  },
};
