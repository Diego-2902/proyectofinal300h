const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authController = require('../controllers/authController');

// Ruta de usuario: api/auth/registro
router.post(
    '/registro',
    [
        check('email', 'Agrega un email válido').isEmail(),
        check('password', 'El password debe ser de al menos 6 caracteres').isLength({ min: 6 })
    ],
    authController.crearUsuario
);

module.exports = router;