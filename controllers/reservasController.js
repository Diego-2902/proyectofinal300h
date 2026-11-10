const Reserva = require('../models/Reserva');

const camposPermitidos = (body) => {
    const { nombre, fecha, hora, email, celular, personas, zona } = body;
    return { nombre, fecha, hora, email, celular, personas, zona };
};

exports.crearReserva = async (req, res) => {
    try {
        const reserva = new Reserva({ ...camposPermitidos(req.body), usuario: req.usuarioId });
        await reserva.save();
        res.status(201).json({ ok: true, msg: '¡Reserva creada exitosamente!', reserva });
    } catch (error) {
        console.log(error);
        res.status(500).json({ ok: false, msg: 'Hable con el administrador' });
    }
};

exports.listarReservas = async (req, res) => {
    try {
        const reservas = await Reserva.find({ usuario: req.usuarioId }).sort({ fecha: 1, hora: 1 });
        res.json({ ok: true, reservas });
    } catch (error) {
        console.log(error);
        res.status(500).json({ ok: false, msg: 'Hable con el administrador' });
    }
};

exports.obtenerReserva = async (req, res) => {
    try {
        const reserva = await Reserva.findOne({ _id: req.params.id, usuario: req.usuarioId });
        if (!reserva) return res.status(404).json({ ok: false, msg: 'Reserva no encontrada' });
        res.json({ ok: true, reserva });
    } catch (error) {
        console.log(error);
        res.status(500).json({ ok: false, msg: 'Hable con el administrador' });
    }
};

exports.actualizarReserva = async (req, res) => {
    try {
        const reserva = await Reserva.findOneAndUpdate(
            { _id: req.params.id, usuario: req.usuarioId },
            camposPermitidos(req.body),
            { new: true, runValidators: true }
        );
        if (!reserva) return res.status(404).json({ ok: false, msg: 'Reserva no encontrada' });
        res.json({ ok: true, msg: 'Reserva actualizada', reserva });
    } catch (error) {
        console.log(error);
        res.status(500).json({ ok: false, msg: 'Hable con el administrador' });
    }
};

exports.eliminarReserva = async (req, res) => {
    try {
        const reserva = await Reserva.findOneAndDelete({ _id: req.params.id, usuario: req.usuarioId });
        if (!reserva) return res.status(404).json({ ok: false, msg: 'Reserva no encontrada' });
        res.json({ ok: true, msg: 'Reserva eliminada' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ ok: false, msg: 'Hable con el administrador' });
    }
};