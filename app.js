var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var methodOverride = require('method-override');
var session = require('express-session');

var routes = require('./routes/index.js');



function autologout( req, res, next ) {

	var timeout = 120*1000;

	// Si el usuario está autenticado, calculamos la hora actual
	if( typeof req.session !== "undefined" && typeof req.session.user !== "undefined" )
	{
		var now = new Date().getTime();

		// Si es la primera visita (no hay variable ultimaVisita rellena)
		if( typeof req.session.ultimaVisita === "undefined" )
		{
			//console.debug("primera visita de --> " + req.session.user);
			//console.debug("en el momento --> " + now);			
			req.session.ultimaVisita = now;
		}
    		else
		{
			var ultimaVisita = req.session.ultimaVisita;
			if( (now - ultimaVisita) > timeout )
			{
				//console.debug("sesión expirada para  --> " + req.session.user);
        			delete req.session.user;
			}
			else
			{
				//console.debug("última visita de --> " + req.session.user);
				//console.debug("en el momento --> " + req.session.ultimaVisita);
				//console.debug("actualizamos sesión con --> " + now);
			        req.session.ultimaVisita = now;
			}
		}
	}

	// Si no está conectado o ya hemos terminado, seguimos
	next();
}

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Use partials
app.use(partials());

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded( { extended: true }));
app.use(cookieParser('Quiz jjestepa 2015')); //el parámetro es la semilla para cifrar la cookie
app.use(session()); //instala el Middleware session
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(autologout);

//Módulo 9
//Helpers dinámicos:
app.use(function(req,res,next) {
	//guardar path en session.redir para despues de login/logout
	if(!req.path.match(/\/login|\/logout/)) {
		req.session.redir = req.path;
	}

	//Hacer visible req.session en las vistas
	res.locals.session = req.session; //copia la sesión que está accesible en req.session en
					// res.locals.session para que esté accesible en las vistas.
	next();
});

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
	    errors: []
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
	errors: []
    });
});

module.exports = app;

