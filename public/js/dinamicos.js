//Primer formulario
//Evento: Formulario de inscripción de equipo
document.getElementById('formInscripcion').addEventListener('submit', async (e) => {
    e.preventDefault();

    //Formulario de registro de equipo
    const datosEquipo = {
        equipo: document.getElementById('logEquipo').value,    
        nombre: document.getElementById('logNombre').value,
        celular: document.getElementById('logCelular').value,
        email: document.getElementById('logEmail').value,
        integrantes: document.getElementById('logIntegrantes').value,
        password: document.getElementById('logPassword').value,
    };

    const resDiv = document.getElementById('resInscripcion');

    try {
        //Envio de datos al servidor backend
        const respuesta = await fetch('http://127.0.0.1:4000/api/auth/registro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosEquipo)
        });

        const resultado = await respuesta.json();

        resDiv.style.display = 'block';

        if (respuesta.ok) {
            localStorage.setItem('token', resultado.token);

            resDiv.className = 'mt-3 p-2 rounded bg-black text-success border border-success small';
            resDiv.textContent = '¡Equipo registrado exitosamente!';

            document.getElementById('formInscripcion').reset();
        } else {
            resDiv.className = 'mt-3 p-2 rounded bg-black text-danger border border-danger small';
            resDiv.textContent = resultado.msg || 'Error al realizar la inscripción';
        }
    } catch (error) {
        console.error('Error de conexión:', error);
        resDiv.style.display = 'block';
        resDiv.className = 'mt-3 p-2 rounded bg-black text-warning border border-warning small';
        resDiv.textContent = 'Error: No se pudo conectar con el servidor backend (revisa que Node.js esté corriendo en el puerto 4000).';
    }
});

//Segundo formulario

//Evento: Formulario de reserva
document.getElementById('formRegistro').addEventListener('submit', async (e) => {
    e.preventDefault();

    //Alerta (reserva)
    const resDiv = document.getElementById('resRegistro');

    const datosReserva = {
        nombre: document.getElementById('nombreReserva').value, 
        fecha: document.getElementById('fechaReserva').value,   
        email: document.getElementById('regEmail').value,      
        celular: document.getElementById('regCelular').value, 
        personas: document.getElementById('regEquipo').value,
        zona: document.getElementById('regZona').value,     
    };

    try {
        const respuesta = await fetch('http://127.0.0.1:4000/api/reservas/crear', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosReserva)
        });

        const resultado = await respuesta.json();

        resDiv.style.display = 'block';

        if (respuesta.ok) {
            resDiv.className = 'mt-3 p-2 rounded bg-black text-success border border-success small';
            resDiv.textContent = '¡Gracias por reservar! Por favor llegar 15 minutos antes de la hora reservada. Te esperamos.';
            document.getElementById('formRegistro').reset();
        } else {
            resDiv.className = 'mt-3 p-2 rounded bg-black text-danger border border-danger small';
            resDiv.textContent = resultado.msg || 'Error al procesar la reserva';
        }
    } catch (error) {
        console.error('Error de conexión:', error);
        resDiv.style.display = 'block';
        resDiv.className = 'mt-3 p-2 rounded bg-black text-warning border border-warning small';
        resDiv.textContent = 'Error: No se pudo conectar con el servidor backend.';
    }
});