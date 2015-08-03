var models = require('../models/models.js');

// Autoload: se usa si ruta incluye :quizId

exports.load = function( req, res, next, quizId ) {
  models.Quiz.find({
	where: {id: Number(quizId)},
	include: [{model: models.Comment}]
	}).then (
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
            { pregunta: "", respuesta: "", genero : ""}
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
			    console.log(" ====> genero =====> " + quiz["genero"]);
			    quiz.save( {fields: ["pregunta", "respuesta", "genero"]} )
				.then( 
					function() {
						res.redirect("/quizes");
				      	}
				) //Redirección HTTP(URL relativo) lista de pregunta
			}
		} //Function error
	); // Fin then
}

//GET /quizes/:id/edit

//GET /quizes/:quizId/edit accede al formulario de edición de preguntas. El identificador de la pregunta en la tabla se extrae con (/:quizId(\\d+)/) para reconocer solo números. Como esta ruta incluye :quiId, autoload realiza la búsqueda en la tabla antes de invocar el controlador, ddejando el objeto en req.quiz, para poder inicializar el formulario con la pregunta y respuesta guardada en la tabla.
exports.edit = function(req,res) {
	var quiz = req.quiz; //autoload de instancia de quiz

	res.render('quizes/edit', {quiz: quiz, errors: []});
};


//como la ruta incluye el identificador (:quizId) de la pregunta en la tabla, autoload pre-carga el objeto en req.quiz antes de invocar el controlador update.
//El controlador actualiza las propiedades pregunta y respuesta de re.quiz con lo enviado en el formulario, actualiza la DB y redirecciona a la lista de preguntas con la preguntas ya corregida.

//PUT /quizes/:id
exports.update = function(req, res){
	req.quiz.pregunta = req.body.quiz.pregunta;
	req.quiz.respuesta = req.body.quiz.respuesta;
	req.quiz.genero = req.body.quiz.genero;

	req.quiz.validate().then(
		function (err){
			if (err) 
			{
				res.render('quizes/edit', {quiz: req.quiz, errors: err.errors});
			}
			else
			{
				req.quiz //save: guarda campos pregunta y respuesta en DB
					.save({fields: ["pregunta","respuesta", "genero"]})
					.then( function () 
					{
						res.redirect('/quizes');
					});
			} //else
		} //function
	); //then
};	


//DELTE /quizes/:id
//el controlador destroy se invoca al llegar DELETE /quizes/:quiId. Como la ruta incluye el identificador (:quizId) de la pregunta en la tabla, autoload pre-carga el objeto en req.quiz antes de invocar el controlador update. El método destroy() ordena la destrucción de la entrada de la tabla identificada por req.quiz. Cundo dicha entrada se ha elminado de la tabla se invoa el callback installado con then(..) que redirecciona a la lista de preguntas.
exports.destroy = function (req, res) {
	req.quiz.destroy().then ( 
		function () {
			res.redirect('/quizes');
		}
	).catch( 
		function (error) {
			next(error)
		}
	);
};			

