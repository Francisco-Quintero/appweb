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

async function iniciarSesionDomiciliario(credenciales) {
    try {
        const response = await fetch('http://localhost:26209/api/usuarios/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credenciales),
        });

        if (response.ok) {
            const usuario = await response.json();
            if (usuario.rol.nombre === "domiciliario") {
                alert("¡Autenticación exitosa!");
                domiciliarioActual = usuario;
                localStorage.setItem('sesionDomiciliario', JSON.stringify(domiciliarioActual));
                actualizarInterfaz();
                console.log('Sesión iniciada y guardada en localStorage:', domiciliarioActual);
            } else {
                alert("El usuario no tiene el rol de domiciliario.");
            }
        } else {
            alert("Credenciales incorrectas.");
        }
    } catch (error) {
        console.error("Error al autenticar:", error);
    }
}

function cerrarSesionDomiciliario() {
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
        const credenciales = {
            username: document.getElementById('login-email-domiciliario').value,
            password: document.getElementById('login-password-domiciliario').value,
        };
        await iniciarSesionDomiciliario(credenciales);
    });

    document.getElementById('btn-cerrar-sesion-domiciliario').addEventListener('click', cerrarSesionDomiciliario);
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
window.cerrarSesionDomiciliario = cerrarSesionDomiciliario;
window.hayDomiciliarioLogueado = () => !!domiciliarioActual;