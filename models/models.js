var path = require("path");

var Sequelize = require("sequelize");

var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name  = (url[6] || null);
var user     = (url[2] || null);
var pwd      = (url[3] || null);
var protocol = (url[1] || null);
var dialect  = (url[1] || null);
var port     = (url[5] || null);
var host     = (url[4] || null);
var storage  = process.env.DATABASE_STORAGE;

var sequelize = new Sequelize( DB_name, user, pwd,
    { 
      dialect: protocol,
      protocol: protocol,
      port: port,
      host: host,
      storage: storage,
      omitNull: true
    } 
    );

var Quiz = sequelize.import(path.join(__dirname,'quiz'));
exports.Quiz = Quiz;


//sequelize.sync() crea e inicializa tabla de preguntas en DB
sequelize.sync().then(function() {
	// sucess(..) ejecuta el manejador una vez creada la tabla
	Quiz.count().then(function (count){
		if(count == 0) { //La tabla se inicializa solo si está vacía
			Quiz.create({pregunta: 'Capital de Italia',
					respuesta: 'Roma'
			}).then(function(){console.log('Base de datos inicializada')});
		};
		
	});
});

