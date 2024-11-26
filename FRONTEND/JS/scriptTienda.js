function inicializarTienda() {
    const userMenuButton = document.getElementById('userMenuButton');
    const userDropdown = document.getElementById('userDropdown');

    // Verificar si hay un usuario logueado al iniciar
    if (window.verificarUsuarioParaPedido && window.verificarUsuarioParaPedido()) {
        console.log('Usuario ya logueado');
        document.body.classList.add('usuario-logueado');
    } else {
        console.log('Usuario no logueado');
        document.body.classList.remove('usuario-logueado');
    }

    // Escuchar eventos de login y logout
    window.addEventListener('usuarioLogueado', function() {
        console.log('Usuario ha iniciado sesión');
        document.body.classList.add('usuario-logueado');
    });

    window.addEventListener('usuarioDeslogueado', function() {
        console.log('Usuario ha cerrado sesión');
        document.body.classList.remove('usuario-logueado');
    });

    // Función para cargar módulos
    function cargarModulo(nombreModulo) {
        const contenedorPrincipal = document.getElementById('contenedor-principal');

        // Eliminar scripts y estilos previos del módulo
        document.querySelectorAll(`script[data-module="${nombreModulo}"]`).forEach(el => el.remove());
        document.querySelectorAll(`link[data-module="${nombreModulo}"]`).forEach(el => el.remove());

        fetch(`modules/${nombreModulo}/${nombreModulo}.html`)
            .then(response => response.text())
            .then(html => {
                contenedorPrincipal.innerHTML = html;
                
                // Cargar el CSS del módulo
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = `modules/${nombreModulo}/${nombreModulo}.css`;
                link.setAttribute('data-module', nombreModulo);
                document.head.appendChild(link);
                
                // Cargar el script del módulo
                const script = document.createElement('script');
                script.src = `modules/${nombreModulo}/${nombreModulo}.js`;
                script.setAttribute('data-module', nombreModulo);
                script.onload = function() {
                    console.log("cargando el modulo de " + nombreModulo);
                    if (nombreModulo === 'catalogo' && typeof renderizarCatalogo === 'function' && typeof window.datosGlobales !== 'undefined') {
                        renderizarCatalogo(window.datosGlobales);
                    }
                };
                document.body.appendChild(script);
            })
            .catch(error => console.error(`Error al cargar el módulo ${nombreModulo}:`, error));
    }

    // Configurar navegación
    document.querySelectorAll('[data-module]').forEach(enlace => {
        enlace.addEventListener('click', function(e) {
            e.preventDefault();
            const nombreModulo = this.getAttribute('data-module');
            cargarModulo(nombreModulo);
        });
    });

    // Configurar menú de usuario
    if (userMenuButton && userDropdown) {
        userMenuButton.addEventListener('click', function() {
            userDropdown.classList.toggle('show');
        });

        document.addEventListener('click', function(event) {
            if (!userMenuButton.contains(event.target) && !userDropdown.contains(event.target)) {
                userDropdown.classList.remove('show');
            }
        });
    }

    // Cargar el módulo inicial
    cargarModulo('catalogo');
}

// Esperar a que los datos globales estén disponibles
if (typeof window.datosGlobales !== 'undefined') {
    inicializarTienda();
} else {
    window.addEventListener('datosGlobalesDisponibles', inicializarTienda);
}

