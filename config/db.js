const mongoose = require('mongoose');

const conectarDB = async () => {
    try {
        /* Prueba de funcionamiento
         
        console.log('Valor de MONGO_URI:', process.env.MONGO_URI); */

        await mongoose.connect(process.env.MONGO_URI);
        console.log('Base de datos MongoDB conectada exitosamente');
    } catch (error) {
        console.log('Hubo un error al conectar a la BD');
        console.log(error);
        process.exit(1);
    }
}

module.exports = conectarDB;