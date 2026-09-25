const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { check } = require('express-validator');

// Punto final: api/auth/registro
router.post('/registro', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'Agrega un email válido').isEmail(),
    check('password', 'El password debe ser de mínimo 6 caracteres').isLength({ min: 6 })
], authController.crearUsuario);

// Punto final: api/auth/login
router.post('/login', [
    check('email', 'Agrega un email válido').isEmail(),
    check('password', 'El password debe ser de mínimo 6 caracteres').isLength({ min: 6 })
], authController.autenticarUsuario);

module.exports = router;