require('dotenv').config();
const express = require('express');
const conectarDB = require('./config/db');
const cors = require('cors');

// Servidor creado
const app = express();

// Conexión a la base de datos
conectarDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Puerto de la app a la que se conecto
const PORT = process.env.PORT || 4000;

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('¡Hola! El servidor backend está funcionando.');
});

// Definición de las rutas de la aplicación
app.use('/api/auth', require('./routes/auth'));

// Inicio del servidor
app.listen(PORT, () => {
    console.log(`El servidor está corriendo en el puerto ${PORT}`);
});