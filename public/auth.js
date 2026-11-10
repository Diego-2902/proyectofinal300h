// ===== Utilidades compartidas =====
const API = '/api';

const getToken = () => localStorage.getItem('token');
const estaLogueado = () => Boolean(getToken());

function mostrarMensaje(div, texto, tipo) {
    div.style.display = 'block';
    div.className = `mt-3 p-2 rounded bg-black small text-${tipo} border border-${tipo}`;
    div.textContent = texto;
}

function textoError(resultado, porDefecto) {
    if (resultado.errores) return resultado.errores.map(e => e.msg).join('\n');
    return resultado.msg || porDefecto;
}

function cerrarModal(id) {
    bootstrap.Modal.getOrCreateInstance(document.getElementById(id)).hide();
}

function actualizarNavbar() {
    document.querySelectorAll('.solo-logueado').forEach(el => el.classList.toggle('d-none', !estaLogueado()));
    document.querySelectorAll('.solo-invitado').forEach(el => el.classList.toggle('d-none', estaLogueado()));
}

function cerrarSesion() {
    localStorage.removeItem('token');
    actualizarNavbar();
    document.dispatchEvent(new Event('sesion-cambiada'));
}

// ===== Registro =====
document.getElementById('formInscripcion').addEventListener('submit', async (e) => {
    e.preventDefault();
    const resDiv = document.getElementById('resInscripcion');

    const datos = {
        nombre: document.getElementById('logNombre').value,
        email: document.getElementById('logEmail').value,
        password: document.getElementById('logPassword').value
    };

    try {
        const respuesta = await fetch(`${API}/auth/registro`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });
        const resultado = await respuesta.json();

        if (respuesta.ok) {
            localStorage.setItem('token', resultado.token);
            mostrarMensaje(resDiv, '¡Registro exitoso! Ya iniciaste sesión.', 'success');
            e.target.reset();
            actualizarNavbar();
            document.dispatchEvent(new Event('sesion-cambiada'));
            setTimeout(() => cerrarModal('modalInscripcion'), 1200);
        } else {
            mostrarMensaje(resDiv, textoError(resultado, 'Error al registrarse'), 'danger');
        }
    } catch (error) {
        console.error(error);
        mostrarMensaje(resDiv, 'No se pudo conectar con el servidor.', 'warning');
    }
});

// ===== Login =====
document.getElementById('formLogin').addEventListener('submit', async (e) => {
    e.preventDefault();
    const resDiv = document.getElementById('resLogin');

    const datos = {
        email: document.getElementById('loginEmail').value,
        password: document.getElementById('loginPassword').value
    };

    try {
        const respuesta = await fetch(`${API}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });
        const resultado = await respuesta.json();

        if (respuesta.ok) {
            localStorage.setItem('token', resultado.token);
            e.target.reset();
            resDiv.style.display = 'none';
            cerrarModal('modalLogin');
            actualizarNavbar();
            document.dispatchEvent(new Event('sesion-cambiada'));
        } else {
            mostrarMensaje(resDiv, textoError(resultado, 'Error al iniciar sesión'), 'danger');
        }
    } catch (error) {
        console.error(error);
        mostrarMensaje(resDiv, 'No se pudo conectar con el servidor.', 'warning');
    }
});

// ===== Logout =====
document.getElementById('btnSalir').addEventListener('click', cerrarSesion);

actualizarNavbar();