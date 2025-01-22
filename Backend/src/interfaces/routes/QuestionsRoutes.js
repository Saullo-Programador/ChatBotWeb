const express = require('express');
const questionsController = require('../../app/controllers/questionsController');

const router = express.Router();

router.get('/', questionsController.getQuestions);
router.post('/', questionsController.addQuestion);
router.delete('/:id', questionsController.deleteQuestion);

module.exports = router;
