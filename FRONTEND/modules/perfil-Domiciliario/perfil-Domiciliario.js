(function() {
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

    function iniciarSesion(email, password) {
        const usuarios = JSON.parse(localStorage.getItem('usuariosSistema') || '[]');
        const domiciliario = usuarios.find(u => u.email === email && u.password === password && u.rol === 'domiciliario');
        if (domiciliario) {
            domiciliarioActual = domiciliario;
            localStorage.setItem('sesionDomiciliario', JSON.stringify(domiciliario));
            actualizarInterfaz();
            return true;
        }
        return false;
    }

    function cerrarSesion() {
        domiciliarioActual = null;
        localStorage.removeItem('sesionDomiciliario');
        actualizarInterfaz();
        // Redirigir al módulo de perfil domiciliario
        window.dispatchEvent(new CustomEvent('redirigirAPerfilDomiciliario'));
    }

    function actualizarInterfaz() {
        const loginContainer = document.getElementById('login-domiciliario-container');
        const perfilContainer = document.getElementById('perfil-domiciliario-container');

        if (domiciliarioActual) {
            loginContainer.style.display = 'none';
            perfilContainer.style.display = 'block';
            document.getElementById('nombre-domiciliario').textContent = domiciliarioActual.nombre;
            document.getElementById('email-domiciliario').textContent = domiciliarioActual.email;
            document.getElementById('estado-domiciliario').textContent = domiciliarioActual.estado || 'Disponible';
        } else {
            loginContainer.style.display = 'block';
            perfilContainer.style.display = 'none';
        }
    }

    function configurarEventListeners() {
        document.getElementById('form-login-domiciliario').addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email-domiciliario').value;
            const password = document.getElementById('login-password-domiciliario').value;
            if (iniciarSesion(email, password)) {
                console.log('Sesión iniciada con éxito');
            } else {
                alert('Credenciales incorrectas');
            }
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