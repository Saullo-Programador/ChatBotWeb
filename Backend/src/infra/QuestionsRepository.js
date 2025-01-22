const fs = require('fs');
const path = require('path');
const QUESTIONS_FILE = path.join(__dirname, '../data/questions.json');

const getQuestionsFromFile = () => {
  if (!fs.existsSync(QUESTIONS_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(QUESTIONS_FILE, 'utf-8'));
  } catch {
    return [];
  }
};

module.exports = {
  getAll: () => getQuestionsFromFile(),
  add: (question, options) => {
    const questions = getQuestionsFromFile();
    const newQuestion = {
      id: questions.length + 1,
      question,
      options,
    };
    questions.push(newQuestion);
    fs.writeFileSync(QUESTIONS_FILE, JSON.stringify(questions, null, 2));
    return newQuestion;
  },
  remove: (id) => {
    const questions = getQuestionsFromFile();
    const filteredQuestions = questions.filter((q) => q.id !== id);
    fs.writeFileSync(QUESTIONS_FILE, JSON.stringify(filteredQuestions, null, 2));
  },
};
