//definición del modelo de Quiz

module.exports = function (sequelize, Datatypes) {
	return sequelize.define('Quiz', 
	{ pregunta: DataTypes.STRING,
	  respuesta: DataTypes.STRING,
	});
}
