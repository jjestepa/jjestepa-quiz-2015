var models = require('../models/models.js');

// Autoload: se usa si ruta incluye :quizId

exports.load = function( req, res, next, quizId ) {
  models.Quiz.find(quizId).then (
    function( quiz ) {
      if( quiz ) {
        req.quiz = quiz;
        next();
      }
      else {
        next( new Error('No existe la pregunta ' + quizId ));
      }
    }
  ).catch( function(error) { next(error); });
}


//GET /quizes/:id
exports.show = function(req,res) {
	res.render('quizes/show', {quiz: req.quiz});
};

//GET /quizes/:id/answer
exports.answer = function(req,res) {
	var resultado = 'Incorrecto';	
	if (req.query.respuesta === req.quiz.respuesta) {
		resultado = 'Correcto';
	}
	res.render('quizes/answer', { quiz: req.quiz, respuesta: resultado});
};

//GET /quizes
exports.index = function( req, res ) {

  search = req.query.search;
  
	console.log(" search ======> " + search);
  if ( typeof search === "undefined") {
	models.Quiz.findAll().then(function(quizes) {
		res.render('quizes/index.ejs', {quizes : quizes});
  	});
  }
  else {
	cadena = "%" +  search.replace(" ", "%") + "%";
	console.log("cadena de búsqueda" + cadena);
	models.Quiz.findAll({where: [ "pregunta like ?", cadena]})
		.then(function(quizes) {
			res.render('quizes/index.ejs', {quizes: quizes});

	});
  }

}// fin exports.index
