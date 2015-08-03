
var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller.js');
var commentController = require('../controllers/comment_controller');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz', errors: [] });
});

// Autoload de comandos con :quizId
router.param('quizId', quizController.load); //Autoload :quizId

router.get('/quizes/:quizId(\\d+)', quizController.show);/* GET /quizes/question */
router.get('/quizes/:quizId(\\d+)/answer', quizController.answer); /* GET answer. */

//Modulo 8 /* Quiz: new */
router.get('/quizes/new', quizController.new );
router.post('/quizes/create', quizController.create ); /* Quiz: post new */
router.get('/quizes/:quizId(\\d+)/edit', quizController.edit);
router.put('/quizes/:quizId(\\d+)', quizController.update);
router.delete('/quizes/:quizId(\\d+)', quizController.destroy);
//Modulo 8

//Módulo 9
//Accede al formulario de crear comenteario, asociado al quiz :id
router.get('/quizes/:quizId(\\d+)/comments/new', commentController.new);
//crea una entrada en la tabla comments, asociada a :quizId en Quiz
router.post('/quizes/:quizId(\\d+)/comments', commentController.create);
//Módulo 9

router.get('/quizes', quizController.index);

module.exports = router;
