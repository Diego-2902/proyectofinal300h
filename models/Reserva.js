const { Schema, model } = require('mongoose');

const ReservaSchema = Schema({
    nombre: { type: String, required: true },
    fecha: { type: String, required: true },
    email: { type: String, required: true },
    celular: { type: String, required: true },
    personas: { type: Number, required: true },
    zona: { type: String, required: true }
});

module.exports = model('Reserva', ReservaSchema);