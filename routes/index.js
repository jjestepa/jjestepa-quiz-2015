
var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller.js');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz' });
});

// Autoload de comandos con :quizId
router.param('quizId', quizController.load); //Autoload :quizId

/* GET /quizes/question */
router.get('/quizes/:quizId(\\d+)', quizController.show);

/* GET answer. */
router.get('/quizes/:quizId(\\d+)/answer', quizController.answer);

router.get('/quizes', quizController.index);

module.exports = router;
