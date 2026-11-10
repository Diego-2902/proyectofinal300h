const { Schema, model } = require('mongoose');

const ReservaSchema = Schema({
    nombre:   { type: String, required: true, trim: true },
    fecha:    { type: String, required: true },
    hora:     { type: String, required: true },
    email:    { type: String, required: true, trim: true, lowercase: true },
    celular:  { type: String, required: true, trim: true },
    personas: { type: Number, required: true, min: 1 },
    zona:     { type: String, required: true },
    usuario:  { type: Schema.Types.ObjectId, ref: 'Usuario', required: true }
}, { timestamps: true });

module.exports = model('Reserva', ReservaSchema);