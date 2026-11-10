const listaReservas = document.getElementById('listaReservas');
const formReserva = document.getElementById('formRegistro');
const resReserva = document.getElementById('resRegistro');

let reservas = [];
let reservaActual = null;     // la que se ve en el detalle
let reservaEditandoId = null; // null = modo crear

// ===== Petición con token =====
async function peticion(ruta, opciones = {}) {
    const respuesta = await fetch(`${API}${ruta}`, {
        ...opciones,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getToken()}`
        }
    });
    const data = await respuesta.json();
    if (respuesta.status === 401) cerrarSesion(); // token vencido
    return { ok: respuesta.ok, data };
}

// Evita inyectar HTML (XSS) al pintar datos del usuario
const escapar = (texto) => String(texto).replace(/[&<>"']/g, c => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
));

// ===== READ: listar y pintar cards =====
async function cargarReservas() {
    if (!estaLogueado()) { listaReservas.innerHTML = ''; return; }
    const { ok, data } = await peticion('/reservas');
    if (!ok) return;
    reservas = data.reservas;
    pintarCards();
}

function pintarCards() {
    if (reservas.length === 0) {
        listaReservas.innerHTML = '<p class="text-center text-secondary">Aún no tienes reservas.</p>';
        return;
    }
    listaReservas.innerHTML = reservas.map(r => `
        <div class="col-12 col-md-6 col-lg-4">
            <div class="card bg-dark text-white tarjeta-estares h-100 card-reserva" data-id="${r._id}">
                <div class="card-body">
                    <h5 class="card-title text-info">${escapar(r.nombre)}</h5>
                    <p class="mb-1">${escapar(r.fecha)} · ${escapar(r.hora)}</p>
                    <p class="mb-0">${escapar(r.zona)} · ${escapar(r.personas)} personas</p>
                </div>
            </div>
        </div>`).join('');
}

// ===== Ver contenido de una card =====
listaReservas.addEventListener('click', (e) => {
    const card = e.target.closest('.card-reserva');
    if (!card) return;
    reservaActual = reservas.find(r => r._id === card.dataset.id);
    document.getElementById('detalleContenido').innerHTML = `
        <p><strong>Nombre:</strong> ${escapar(reservaActual.nombre)}</p>
        <p><strong>Fecha:</strong> ${escapar(reservaActual.fecha)}</p>
        <p><strong>Hora:</strong> ${escapar(reservaActual.hora)}</p>
        <p><strong>Zona:</strong> ${escapar(reservaActual.zona)}</p>
        <p><strong>Personas:</strong> ${escapar(reservaActual.personas)}</p>
        <p><strong>Correo:</strong> ${escapar(reservaActual.email)}</p>
        <p class="mb-0"><strong>Celular:</strong> ${escapar(reservaActual.celular)}</p>`;
    bootstrap.Modal.getOrCreateInstance(document.getElementById('modalDetalle')).show();
});

// ===== CREATE / UPDATE =====
formReserva.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!estaLogueado()) {
        mostrarMensaje(resReserva, 'Debes iniciar sesión para reservar.', 'warning');
        return;
    }

    const datos = {
        nombre: document.getElementById('nombreReserva').value,
        fecha: document.getElementById('fechaReserva').value,
        email: document.getElementById('regEmail').value,
        celular: document.getElementById('regCelular').value,
        personas: document.getElementById('regEquipo').value,
        hora: document.getElementById('regHora').value,
        zona: document.getElementById('regZona').value
    };

    const editando = Boolean(reservaEditandoId);
    try {
        const { ok, data } = await peticion(
            editando ? `/reservas/${reservaEditandoId}` : '/reservas',
            { method: editando ? 'PUT' : 'POST', body: JSON.stringify(datos) }
        );

        if (ok) {
            mostrarMensaje(resReserva, editando
                ? 'Reserva actualizada correctamente.'
                : '¡Gracias por reservar! Por favor llegar 15 minutos antes de la hora reservada.', 'success');
            formReserva.reset();
            document.getElementById('formulario-reserva').reset();
            reservaEditandoId = null;
            cargarReservas();
        } else {
            mostrarMensaje(resReserva, textoError(data, 'Error al procesar la reserva'), 'danger');
        }
    } catch (error) {
        console.error(error);
        mostrarMensaje(resReserva, 'No se pudo conectar con el servidor.', 'warning');
    }
});

// ===== Abrir el formulario en modo edición =====
document.getElementById('btnEditar').addEventListener('click', () => {
    reservaEditandoId = reservaActual._id;

    document.getElementById('nombreReserva').value = reservaActual.nombre;
    document.getElementById('fechaReserva').value = reservaActual.fecha;
    document.getElementById('regEmail').value = reservaActual.email;
    document.getElementById('regCelular').value = reservaActual.celular;
    document.getElementById('regEquipo').value = reservaActual.personas;
    document.getElementById('regHora').value = reservaActual.hora;
    document.getElementById('regZona').value = reservaActual.zona;
    document.getElementById('tituloReserva').textContent = 'Editar reserva';
    document.getElementById('btnGuardarReserva').textContent = 'Guardar cambios';

    cerrarModal('modalDetalle');
    bootstrap.Modal.getOrCreateInstance(document.getElementById('modalRegistro')).show();
});

// Al cerrar el modal de reserva, vuelve al modo "crear"
document.getElementById('modalRegistro').addEventListener('hidden.bs.modal', () => {
    reservaEditandoId = null;
    resReserva.style.display = 'none';
    document.getElementById('tituloReserva').textContent = 'Haz tu reserva para Rana Spawn';
    document.getElementById('btnGuardarReserva').textContent = 'Reservar';
});

// ===== DELETE =====
document.getElementById('btnEliminar').addEventListener('click', async () => {
    if (!confirm('¿Seguro que quieres eliminar esta reserva?')) return;
    const { ok, data } = await peticion(`/reservas/${reservaActual._id}`, { method: 'DELETE' });
    if (ok) {
        cerrarModal('modalDetalle');
        cargarReservas();
    } else {
        alert(textoError(data, 'No se pudo eliminar'));
    }
});

// Recarga las cards al iniciar/cerrar sesión
document.addEventListener('sesion-cambiada', cargarReservas);
cargarReservas();