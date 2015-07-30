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
	res.render('quizes/show', {quiz: req.quiz, errors: []});
};

//GET /quizes/:id/answer
exports.answer = function(req,res) {
	var resultado = 'Incorrecto';	
	if (req.query.respuesta === req.quiz.respuesta) {
		resultado = 'Correcto';
	}
	res.render('quizes/answer', { quiz: req.quiz, respuesta: resultado, errors: []});
};

//GET /quizes
exports.index = function( req, res ) {

  search = req.query.search;
  
	console.log(" search ======> " + search);
  if ( typeof search === "undefined") {
	models.Quiz.findAll().then(function(quizes) {
		res.render('quizes/index.ejs', {quizes : quizes, errors: []});
  	});
  }
  else {
	cadena = "%" +  search.replace(" ", "%") + "%";
	console.log("cadena de búsqueda" + cadena);
	models.Quiz.findAll({where: [ "pregunta like ?", cadena]})
		.then(function(quizes) {
			res.render('quizes/index.ejs', {quizes: quizes, errors: []});

	});
  }

}// fin exports.index


// GET /quizes/new
exports.new = function( req, res ) {
    var quiz = models.Quiz.build(
            { pregunta: "", respuesta: ""}
        );
    res.render('quizes/new', { quiz: quiz, errors: [] } );
}


// POST /quizes/create
exports.create = function( req, res ) {

    	// req.body.quiz ha sido construido por bodyparser al usar
    	// notacion pseudoJSON en los nombres de los campos (ver vista) - pag 6 - modulo 8
	
	var quiz = models.Quiz.build( req.body.quiz );
	var errors = quiz.validate().then(
		function(err)
		{
			if(err) 
			{
			    res.render('quizes/new', {quiz: quiz, errors: err.errors});
			} 
			else 
			{
			    console.log(" ====> Pregunta =====> " + quiz["pregunta"]);
			    console.log(" ====> Respuesta =====> " + quiz["respuesta"]);
			    quiz.save( {fields: ["pregunta", "respuesta"]} )
				.then( 
					function() {
						res.redirect("/quizes");
				      	}
				) //Redirección HTTP(URL relativo) lista de pregunta
			}
		} //Function error
	); // Fin then
}

