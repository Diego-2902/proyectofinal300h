const { Router } = require('express');
const { check, validationResult } = require('express-validator');
const Reserva = require('../models/Reserva');
const router = Router();


// OBTENER TODAS LAS RESERVAS

router.get('/', async (req, res) => {
    try {
        const reservas = await Reserva.find();
        res.json({ ok: true, reservas });
    } catch (error) {
        console.log(error);
        res.status(500).json({ ok: false, msg: 'Error al obtener las reservas' });
    }
});


// CREAR RESERVA (CREATE)

router.post('/crear', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('fecha', 'La fecha es obligatoria').not().isEmpty(),
    check('email', 'Agrega un email válido').isEmail(),
    check('celular', 'El celular es obligatorio').not().isEmpty(),
    check('personas', 'Indica la cantidad de personas').isNumeric(),
    check('zona', 'Selecciona una zona').not().isEmpty()
], async (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ ok: false, errores: errores.array() });
    }

    try {
        const nuevaReserva = new Reserva(req.body);
        await nuevaReserva.save();
        res.status(201).json({
            ok: true,
            msg: '¡Reserva creada exitosamente!',
            reserva: nuevaReserva
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ ok: false, msg: 'Hable con el administrador' });
    }
});


// ACTUALIZAR RESERVA (UPDATE)

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const reservaActualizada = await Reserva.findByIdAndUpdate(id, req.body, { new: true });
        
        if (!reservaActualizada) {
            return res.status(404).json({ ok: false, msg: 'No se encontró la reserva con ese ID' });
        }

        res.json({
            ok: true,
            msg: '¡Reserva actualizada con éxito!',
            reserva: reservaActualizada
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ ok: false, msg: 'Error al actualizar la reserva' });
    }
});


// ELIMINAR RESERVA (DELETE)

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const reservaEliminada = await Reserva.findByIdAndDelete(id);

        if (!reservaEliminada) {
            return res.status(404).json({ ok: false, msg: 'No se encontró la reserva con ese ID' });
        }

        res.json({
            ok: true,
            msg: '¡Reserva eliminada correctamente!'
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ ok: false, msg: 'Error al eliminar la reserva' });
    }
});

module.exports = router;
