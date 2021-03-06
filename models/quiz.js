//definición del modelo de Quiz

module.exports = function( sequelize, DataTypes ) {
  return sequelize.define(
	'Quiz', 
	      { pregunta: { 
			type: DataTypes.STRING,
			validate: { 
				notEmpty: {msg: "-> Falta Pregunta"}
				}
			},
        	respuesta: {
			type: DataTypes.STRING, 
			validate: { 
				notEmpty: {msg: "-> Falta Respuesta"}
				}
			},
		genero: { 
		type: DataTypes.STRING,
			validate: { 
				notEmpty: {msg: "-> Falta Género"}
				}
			} 
      	}
   );
}
