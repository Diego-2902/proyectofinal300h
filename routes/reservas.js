const { Router } = require('express');
const { check, param } = require('express-validator');
const auth = require('../middleware/auth');
const validar = require('../middleware/validar');
const {
    crearReserva, listarReservas, obtenerReserva, actualizarReserva, eliminarReserva
} = require('../controllers/reservasController');

const router = Router();

const validacionesReserva = [
    check('nombre', 'El nombre es obligatorio').trim().notEmpty(),
    check('fecha', 'La fecha no es válida (AAAA-MM-DD)').isISO8601(),
    check('hora', 'La hora no es válida (HH:MM)').matches(/^([01]\d|2[0-3]):[0-5]\d$/),
    check('email', 'Agrega un email válido').isEmail(),
    check('celular', 'El celular debe tener entre 7 y 15 dígitos').matches(/^\d{7,15}$/),
    check('personas', 'Personas debe ser un número entre 1 y 10').isInt({ min: 1, max: 10 }),
    check('zona', 'Selecciona una zona válida').isIn(['Estar Clásico', 'Estar VIP'])
];

const validarId = param('id', 'ID no válido').isMongoId();

router.use(auth); // todas las rutas de reservas requieren token

router.post('/', validacionesReserva, validar, crearReserva);
router.get('/', listarReservas);
router.get('/:id', validarId, validar, obtenerReserva);
router.put('/:id', validarId, validacionesReserva, validar, actualizarReserva);
router.delete('/:id', validarId, validar, eliminarReserva);

module.exports = router;