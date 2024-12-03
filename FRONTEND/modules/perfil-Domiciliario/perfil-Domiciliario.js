(function () {
    console.log('Iniciando carga del módulo de Perfil Domiciliario');

    let domiciliarioActual = null;

    function cargarDatosDesdeLocalStorage() {
        try {
            const sesionGuardada = localStorage.getItem('sesionDomiciliario');
            if (sesionGuardada) {
                domiciliarioActual = JSON.parse(sesionGuardada);
                actualizarInterfaz();
            }
        } catch (error) {
            console.error('Error al cargar datos del domiciliario desde localStorage:', error);
        }
    }

    async function validarCredencialesConAPI(user, password) {
        try {
            const response = await fetch('http://localhost:26209/api/usuarios', { // Cambia esta URL por la de tu API
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ user, password })
            });

            if (response.ok) {
                return await response.json(); // Devuelve los datos del domiciliario
            } else {
                console.warn('Credenciales incorrectas o error en la API');
                return null;
            }
        } catch (error) {
            console.error('Error al validar credenciales con la API:', error);
            return null;
        }
    }

    async function iniciarSesion(user, password) {
        const domiciliario = await validarCredencialesConAPI(user, password);
        if (domiciliario) {
            domiciliarioActual = domiciliario;
            localStorage.setItem('sesionDomiciliario', JSON.stringify(domiciliario));
            actualizarInterfaz();
            console.log('Sesión iniciada y guardada en localStorage:', domiciliarioActual);
            return true;
        } else {
            alert('Credenciales incorrectas');
            return false;
        }
    }

    function cerrarSesion() {
        domiciliarioActual = null;
        localStorage.removeItem('sesionDomiciliario');
        actualizarInterfaz();
        console.log('Sesión cerrada y datos eliminados de localStorage');
    }

    function actualizarInterfaz() {
        const loginContainer = document.getElementById('login-domiciliario-container');
        const perfilContainer = document.getElementById('perfil-domiciliario-container');

        if (domiciliarioActual) {
            loginContainer.style.display = 'none';
            perfilContainer.style.display = 'block';
            document.getElementById('nombre-domiciliario').textContent = domiciliarioActual.nombre;
            document.getElementById('email-domiciliario').textContent = domiciliarioActual.user;
            document.getElementById('estado-domiciliario').textContent = domiciliarioActual.estado || 'Disponible';
        } else {
            loginContainer.style.display = 'block';
            perfilContainer.style.display = 'none';
        }
    }

    function configurarEventListeners() {
        document.getElementById('form-login-domiciliario').addEventListener('submit', async (e) => {
            e.preventDefault();
            const user = document.getElementById('login-email-domiciliario').value;
            const password = document.getElementById('login-password-domiciliario').value;
            await iniciarSesion(user, password);
        });

        document.getElementById('btn-cerrar-sesion-domiciliario').addEventListener('click', cerrarSesion);
    }

    function initPerfilDomiciliario() {
        console.log('Inicializando módulo de Perfil Domiciliario');
        cargarDatosDesdeLocalStorage();
        configurarEventListeners();
        actualizarInterfaz();
        console.log('Módulo de Perfil Domiciliario cargado completamente');
    }

    // Inicializar el módulo cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPerfilDomiciliario);
    } else {
        initPerfilDomiciliario();
    }

    // Exponer funciones necesarias globalmente
    window.initPerfilDomiciliario = initPerfilDomiciliario;
    window.cerrarSesionDomiciliario = cerrarSesion;
    window.hayDomiciliarioLogueado = () => !!domiciliarioActual;
})();
