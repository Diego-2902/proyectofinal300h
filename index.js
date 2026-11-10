require('dotenv').config();
const express = require('express');
const conectarDB = require('./config/db');
const cors = require('cors');

// Servidor
const app = express();

// Base de datos
conectarDB();

// Middlewares
app.use(cors());
app.use(express.static('public'));
app.use(express.json());

// Puerto al que se conecto
const PORT = process.env.PORT || 4000;

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('¡Hola! El servidor backend está funcionando.');
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/reservas', require('./routes/reservas'));

// Inicio del servidor (siempre al final)
app.listen(PORT, () => {
    console.log(`El servidor está corriendo en el puerto ${PORT}`);
});