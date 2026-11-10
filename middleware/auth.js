const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ ok: false, msg: 'No hay token, permiso no válido' });
    }
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.usuarioId = payload.usuario.id;
        next();
    } catch (error) {
        res.status(401).json({ ok: false, msg: 'Token no válido o expirado' });
    }
};