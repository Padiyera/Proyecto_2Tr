//cargo los elementos del DOM
window.addEventListener('load', () => {
    //const del form de inicio
    const formLog = document.getElementsByClassName('container-Login')[0];
    const BtnCambiarPass = document.getElementById('cambiarPass');

    //Const de el form de cambiar passswd
    const formCambiarPass = document.getElementsByClassName('container-CambiarPass')[0];
    const BtnVolverPass = document.getElementById('volverPas');

    //formularioo login
    let button = document.getElementById('formLogin');
    let usuario = document.getElementById('usuario');
    let password = document.getElementById('password');
    let alert = document.getElementById('alerta');

    // Añadir estilos para la animación de giro
    const style = document.createElement('style');
    style.innerHTML = `
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    `;
    document.head.appendChild(style);

    //funcion que envia estos datos mediante fetch
    function data() {
        let datos = new FormData();
        datos.append("usuario", usuario.value);
        datos.append("password", password.value);

        fetch('Controlador/login.php', {
            method: 'POST',
            body: datos
        })
            .then(response => response.text()) // Cambiar a text() para depurar
            .then(text => {
                console.log(text); // Verificar el contenido de la respuesta
                try {
                    const jsonResponse = JSON.parse(text);
                    if (jsonResponse.success === 1) {
                        ocultarAll();
                        logUserLogin(usuario.value);
                        showTimelapse();
                    } else {
                        alertaFail();
                    }
                } catch (error) {
                    console.error('Error parsing JSON:', error);
                    alertaFail();
                }
            })
            .catch(error => {
                console.error('Fetch error:', error);
                alerta();
            });
    }

    function logUserLogin(usuario) {
        // Crear un objeto con los datos del usuario
        const data = {
            usuario: usuario
        };
    
        // Enviar los datos al servidor usando fetch
        fetch('Modelo/log_login.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            // Verificar si la respuesta es OK (código 200)
            if (!response.ok) {
                throw new Error('Error en la solicitud: ' + response.statusText);
            }
            return response.text(); // Leer la respuesta como texto primero
        })
        .then(text => {
            console.log('Respuesta del servidor:', text); // Mostrar la respuesta en la consola
            try {
                const result = JSON.parse(text); // Intentar analizar la respuesta como JSON
                if (result.status === 'success') {
                    console.log('Log de inicio de sesión guardado correctamente');
                } else {
                    console.error('Error al guardar el log de inicio de sesión:', result.message);
                }
            } catch (error) {
                console.error('Error al analizar la respuesta JSON:', error);
                console.error('Respuesta del servidor (texto):', text);
            }
        })
        .catch(error => {
            console.error('Error en la solicitud fetch:', error);
        });
    }

    //funcion que muestra la imagen y la hace girar
    function showTimelapse() {
        const timelapseContainer = document.createElement('div');
        timelapseContainer.style.position = 'fixed';
        timelapseContainer.style.top = '50%';
        timelapseContainer.style.left = '50%';
        timelapseContainer.style.transform = 'translate(-50%, -50%)';
        timelapseContainer.style.zIndex = '1000';

        const img = document.createElement('img');
        img.src = "images/wheel.png";
        img.style.width = '100px';
        img.style.height = '100px';
        img.style.animation = 'spin 5s linear infinite';

        timelapseContainer.appendChild(img);
        document.body.appendChild(timelapseContainer);
        setTimeout(() => {
            document.body.removeChild(timelapseContainer);
            location.href = 'Vista/adminGrua.php';
        }, 1000);
    }

    //al darle al boton de enviar este llama a la funcion de data
    button.addEventListener('submit', (e) => {
        e.preventDefault();
        if (usuario.value !== '' && password.value !== '') {
            data();
        } else {
            alertaVacio();
        }
    });

    function alerta() {
        alert.innerHTML = `
      <div class="alert alert-danger alert-dismissible fade show" role="alert">
      <strong>Intentelo de nuevo más tarde</strong>
    </div>
      `;
        ocultarAlertaConTemporizador(alert.querySelector('.alert'));
    }

    function alertaFail() {
        alert.innerHTML = `
      <div class="alert alert-danger alert-dismissible fade show" role="alert">
      <strong>Usuario o contraseña incorrectos</strong>
    </div>
      `;
        ocultarAlertaConTemporizador(alert.querySelector('.alert'));
    }

    function alertaVacio() {
        alert.innerHTML = `
      <div class="alert alert-danger alert-dismissible fade show" role="alert">
      <strong>Complete todos los campos</strong>
    </div>
      `;
        ocultarAlertaConTemporizador(alert.querySelector('.alert'));
    }

    //envio de email
    const formChangePassword = document.getElementById('formChangePassword');
    const correoInput = document.getElementById('correo');
    const alertaEmail = document.getElementById('alertaEmail');

    formChangePassword.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = correoInput.value;

        if (email !== '') {
            if (esCorreoValido(email)) {

                fetch('Modelo/findEmail.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: `correo=${encodeURIComponent(email)}`
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success === 1) {
                            alertaCorreo(`Correo encontrado.`);
                            // Create a hidden input with the password
                            const passwordInput = document.createElement('input');
                            passwordInput.type = 'hidden';
                            passwordInput.name = 'password';
                            passwordInput.value = data.password;
                            formChangePassword.appendChild(passwordInput);
                            formChangePassword.action = `https://formsubmit.co/${email}`;
                            formChangePassword.submit();
                        } else {
                            alertaCorreo('El correo no esta registrado');
                        }
                    })
                    .catch(error => {
                        alertaCorreo('Error al buscar el correo.');
                    });
            } else {
                alertaCorreo('El correo no es válido.');
            }
        } else {
            alertaCorreo('Complete todos los campos.');
        }
    });

    function alertaCorreo(mensaje) {
        alertaEmail.innerHTML = `
          <div class="alert alert-danger alert-dismissible fade show" role="alert">
          <strong>${mensaje}</strong>
        </div>
        `;
        ocultarAlertaConTemporizador(alertaEmail.querySelector('.alert'));
    }


    //Función para ocultar los alerts
    function ocultarAlertaConTemporizador(alertElement) {
        if (!alertElement) return;

        setTimeout(() => {
            alertElement.classList.add('fade-out');
            setTimeout(() => {
                alertElement.classList.add('hidden');
                setTimeout(() => {
                    if (alertElement.parentNode) {
                        alertElement.parentNode.removeChild(alertElement);
                    }
                }, 2000); // Tiempo de la transición
            }, 2000); // Tiempo de la transición
        }, 1000);
    }

    function esCorreoValido(correo) {
        const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regexCorreo.test(correo);
    }

    //Ocultos de primeras
    formCambiarPass.classList.add('hidden');

    //formCambiarPass aparece y formLog hide/ lo llamo en login
    function updateEstadoPassw() {
        formCambiarPass.classList.toggle('hidden');
        formLog.classList.add('hidden');
    }

    //formLog aparece y formCambiarpass desaparece/ lo llamo en formPass
    function returnLogP() {
        formLog.classList.toggle('hidden');
        formCambiarPass.classList.toggle('hidden');

    }

    function ocultarAll(){
        formLog.classList.toggle('hidden');
    }

    // Añadir event listeners a los botones
    BtnCambiarPass.addEventListener('click', updateEstadoPassw);
    BtnVolverPass.addEventListener('click', returnLogP);
});
