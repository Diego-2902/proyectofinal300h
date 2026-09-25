const { Router } = require('express');
const { check } = require('express-validator');
const Reserva = require('../models/Reserva');
const router = Router();

router.post('/crear', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('fecha', 'La fecha es obligatoria').not().isEmpty(),
    check('email', 'Agrega un email válido').isEmail(),
    check('celular', 'El celular es obligatorio').not().isEmpty(),
    check('personas', 'Indica la cantidad de personas').isNumeric(),
    check('zona', 'Selecciona una zona').not().isEmpty()
], async (req, res) => {
    try {
        const nuevaReserva = new Reserva(req.body);
        await nuevaReserva.save();
        res.status(201).json({
            ok: true,
            msg: '¡Reserva creada exitosamente!'
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ ok: false, msg: 'Hable con el administrador' });
    }
});

module.exports = router;