const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

// Registrar un nuevo usuario
exports.crearUsuario = async (req, res) => {
    // Revisar si hay errores de validación con el usuario
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
    }

    const { email, password } = req.body;

    try {
        // Validar que el usuario sea único
        let usuario = await Usuario.findOne({ email });
        if (usuario) {
            return res.status(400).json({ msg: 'El usuario ya existe' });
        }

        // Crear el nuevo usuario
        usuario = new Usuario(req.body);

        // Hashear la contraseña
        const salt = await bcryptjs.genSalt(10);
        usuario.password = await bcryptjs.hash(password, salt);

        // Guardar en la BD
        await usuario.save();

        // Crear y firmar el JWT
        const payload = { usuario: { id: usuario.id } };

        jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: 3600 // Una hora
        }, (error, token) => {
            if (error) throw error;
            res.json({ token, msg: 'Usuario creado correctamente' });
        });

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error al registrar el usuario');
    }   
};

// Autenticar / Login de usuario
exports.autenticarUsuario = async (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
    }

    const { email, password } = req.body;

    try {
        // Revisar que sea un usuario registrado
        let usuario = await Usuario.findOne({ email });
        if (!usuario) {
            return res.status(400).json({ msg: 'El usuario no existe' });
        }

        // Revisar la contraseña
        const passCorrecto = await bcryptjs.compare(password, usuario.password);
        if (!passCorrecto) {
            return res.status(400).json({ msg: 'Contraseña incorrecta' });
        }

        // Si todo esta correcto, crear y firmar el JWT
        const payload = { usuario: { id: usuario.id } };

        jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: 3600 // Una hora
        }, (error, token) => {
            if (error) throw error;
            res.json({ token, msg: 'Inicio de sesión exitoso' });
        });

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error en el servidor');
    }
};