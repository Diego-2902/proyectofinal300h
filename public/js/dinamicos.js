//Escuchador de evento: Formulario de inscripción de equipo
document.getElementById('formInscripcion').addEventListener('submit', async (e) => {
    e.preventDefault();

    //Captura de los valores introducidos en el formulario de registro de equipo
    const datosEquipo = {
        equipo: document.getElementById('logEquipo').value,    
        nombre: document.getElementById('logNombre').value,
        celular: document.getElementById('logCelular').value,
        email: document.getElementById('logEmail').value,
        integrantes: document.getElementById('logIntegrantes').value,
        password: document.getElementById('logPassword').value
    };

    const resDiv = document.getElementById('resInscripcion');

    try {
        //Envio de los datos mediante una petición POST al servidor backend
        const respuesta = await fetch('http://127.0.0.1:4000/api/auth/registro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosEquipo)
        });

        const resultado = await respuesta.json();

        //Muestra de la respuesta en el recuadro informativo del módulo
        resDiv.style.display = 'block';

        if (respuesta.ok) {
            // 1. Guardas el token en segundo plano (sin mostrarlo en pantalla)
            localStorage.setItem('token', resultado.token);

            // 2. Muestras solo un mensaje claro y bonito
            resDiv.className = 'mt-3 p-2 rounded bg-black text-success border border-success small';
            resDiv.textContent = '¡Equipo registrado exitosamente!';

            // 3. Limpias los campos del formulario
            document.getElementById('formInscripcion').reset();
        } else {
            // Si ocurre un error de validación o del backend
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