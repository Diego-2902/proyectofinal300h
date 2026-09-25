const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.crearUsuario = async (req, res) => {
    // Revisar si hay errores de express-validator
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
    }

    // Extraer datos del req.body (acepta 'nombre' o 'lider')
    const { nombre, lider, email, password } = req.body;

    try {
        // Asegurar que nombre tenga un valor
        const nombreFinal = nombre || lider;

        if (!nombreFinal) {
            return res.status(400).json({ msg: 'El nombre del líder es obligatorio' });
        }

        // Revisar que el usuario sea único
        let usuario = await Usuario.findOne({ email });
        if (usuario) {
            return res.status(400).json({ msg: 'El usuario ya existe con este correo' });
        }

        // Crear el nuevo usuario
        usuario = new Usuario({
            nombre: nombreFinal,
            email,
            password
        });

        // Hashear el password
        const salt = await bcryptjs.genSalt(10);
        usuario.password = await bcryptjs.hash(password, salt);

        // Guardar usuario en BD
        await usuario.save();

        // Crear y firmar el JWT
        const payload = {
            usuario: {
                id: usuario.id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: 3600 },
            (error, token) => {
                if (error) throw error;
                res.json({ token, msg: 'Usuario registrado con éxito' });
            }
        );

    } catch (error) {
        console.log(error);
        // Retornar JSON para que el frontend pueda leerlo adecuadamente
        res.status(500).json({ msg: 'Hubo un error al procesar el registro en el servidor' });
    }
};