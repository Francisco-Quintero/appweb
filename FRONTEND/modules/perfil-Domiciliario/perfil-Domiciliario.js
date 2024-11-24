(function() {
    console.log('Iniciando carga del módulo de Mi Perfil Domiciliario');

    let domiciliarios = [];
    let domiciliarioActual = null;

    function cargarDatosDesdeLocalStorage() {
        try {
            const datosGuardados = JSON.parse(localStorage.getItem('datosGlobales') || '{}');
            domiciliarios = datosGuardados.domiciliarios || [];
            domiciliarioActual = datosGuardados.domiciliarioActual || null;
            console.log('Datos de domiciliarios cargados desde localStorage');
        } catch (error) {
            console.error('Error al cargar datos desde localStorage:', error);
        }
    }

    function guardarEnLocalStorage() {
        try {
            const datosActuales = JSON.parse(localStorage.getItem('datosGlobales') || '{}');
            datosActuales.domiciliarios = domiciliarios;
            datosActuales.domiciliarioActual = domiciliarioActual;
            localStorage.setItem('datosGlobales', JSON.stringify(datosActuales));
            console.log('Datos de domiciliarios guardados en localStorage');
        } catch (error) {
            console.error('Error al guardar en localStorage:', error);
        }
    }

    function actualizarInterfazDomiciliario() {
        const contenedorPerfil = document.querySelector('.perfil-domiciliario-container');
        const contenedorLogin = document.getElementById('login-domiciliario-container');
        
        if (domiciliarioActual) {
            if (contenedorPerfil) contenedorPerfil.style.display = 'block';
            if (contenedorLogin) contenedorLogin.style.display = 'none';
            cargarInformacionDomiciliario();
        } else {
            if (contenedorPerfil) contenedorPerfil.style.display = 'none';
            if (contenedorLogin) contenedorLogin.style.display = 'block';
        }
    }

    function configurarEventListenersLogin() {
        const formLogin = document.getElementById('form-login-domiciliario');
        if (formLogin) {
            formLogin.addEventListener('submit', (e) => {
                e.preventDefault();
                iniciarSesion();
            });
        }

        const btnCerrarSesion = document.getElementById('btn-cerrar-sesion-domiciliario');
        if (btnCerrarSesion) {
            btnCerrarSesion.addEventListener('click', cerrarSesion);
        }
    }

    function iniciarSesion() {
        const username = document.getElementById('login-usuario-domiciliario').value;
        const password = document.getElementById('login-password-domiciliario').value;

        domiciliarioActual = domiciliarios.find(d => d.usuario === username && d.password === password);

        if (domiciliarioActual) {
            console.log('Inicio de sesión exitoso');
            domiciliarioActual.ultimoLogin = new Date().toISOString();
            guardarEnLocalStorage();
            actualizarInterfazDomiciliario();
            window.dispatchEvent(new Event('domiciliarioLogueado'));
        } else {
            alert('Usuario o contraseña incorrectos');
        }
    }

    function cerrarSesion() {
        if (domiciliarioActual) {
            domiciliarioActual.ultimoLogout = new Date().toISOString();
            guardarEnLocalStorage();
        }
        domiciliarioActual = null;
        actualizarInterfazDomiciliario();
        window.dispatchEvent(new Event('domiciliarioDeslogueado'));
    }

    function cargarInformacionDomiciliario() {
        if (!domiciliarioActual) return;
        
        const domiciliarioInfo = document.getElementById('domiciliario-info');
        if (domiciliarioInfo) {
            domiciliarioInfo.innerHTML = `
                <h3>Información del Domiciliario</h3>
                <p><strong>Nombre:</strong> ${domiciliarioActual.nombre} ${domiciliarioActual.apellido || ''}</p>
                <p><strong>Usuario:</strong> ${domiciliarioActual.usuario}</p>
                <p><strong>Teléfono:</strong> ${domiciliarioActual.telefono || ''}</p>
                <p><strong>Último inicio de sesión:</strong> ${domiciliarioActual.ultimoLogin ? new Date(domiciliarioActual.ultimoLogin).toLocaleString() : 'N/A'}</p>
                <p><strong>Último cierre de sesión:</strong> ${domiciliarioActual.ultimoLogout ? new Date(domiciliarioActual.ultimoLogout).toLocaleString() : 'N/A'}</p>
            `;
        }
    }

    function verificarDomiciliarioLogueado() {
        return domiciliarioActual !== null;
    }

    function obtenerDomiciliarioActual() {
        return domiciliarioActual;
    }

    function initMiPerfilDomiciliario() {
        console.log('Inicializando módulo de Mi Perfil Domiciliario');
        cargarDatosDesdeLocalStorage();
        actualizarInterfazDomiciliario();
        configurarEventListenersLogin();
        console.log('Módulo de Mi Perfil Domiciliario cargado completamente');
    }

    // Inicializar el módulo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMiPerfilDomiciliario);
    } else {
        initMiPerfilDomiciliario();
    }

    // Exponer funciones necesarias globalmente
    window.verificarDomiciliarioLogueado = verificarDomiciliarioLogueado;
    window.obtenerDomiciliarioActual = obtenerDomiciliarioActual;
    window.initMiPerfilDomiciliario = initMiPerfilDomiciliario;
})();