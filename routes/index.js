var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller');
//var author = require('../controllers/author');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz' });
});

/* GET /quizes/question */
router.get('/quizes/question', quizController.question);

/* GET answer. */
router.get('/quizes/answer', quizController.answer);

/* GET creditos */
router.get('/author', quizController.author);

module.exports = router;
