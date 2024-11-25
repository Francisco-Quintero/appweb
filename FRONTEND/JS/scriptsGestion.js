function inicializarGestion() {
    const userMenuButton = document.getElementById('userMenuButton');
    const userDropdown = document.getElementById('userDropdown');

    function cargarModulo(nombreModulo) {
        if (!window.hayUsuarioLogueado() && nombreModulo !== 'usuarios') {
            alert('Debe iniciar sesión para acceder a este módulo.');
            cargarModulo('usuarios');
            return;
        }

        const contenedorPrincipal = document.getElementById('main-container');

        // Eliminar scripts y estilos previos del módulo
        document.querySelectorAll('script[data-module]').forEach(el => {
            if (!el.hasAttribute('data-global')) {
                el.remove();
            }
        });
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

                // Cargar librería externa si no está cargada
                if (!document.querySelector('script[src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"]')) {
                    const scriptLibreria = document.createElement('script');
                    scriptLibreria.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
                    scriptLibreria.onload = () => emailjs.init('R6MTXZtcPcos0kbQw');
                    document.head.appendChild(scriptLibreria);
                }

                // Cargar el script del módulo
                const script = document.createElement('script');
                script.src = `modules/${nombreModulo}/${nombreModulo}.js`;
                script.setAttribute('data-module', nombreModulo);
                script.onload = function () {
                    console.log("Módulo cargado:", nombreModulo);
                    // Despachar evento personalizado cuando el módulo se cargue
                    const event = new Event(`${nombreModulo}Cargado`);
                    document.dispatchEvent(event);
                };
                document.body.appendChild(script);
            })
            .catch(error => console.error(`Error al cargar el módulo ${nombreModulo}:`, error));
    }

    // Configurar navegación
    document.querySelectorAll('[data-module]').forEach(enlace => {
        enlace.addEventListener('click', function (e) {
            e.preventDefault();
            const nombreModulo = this.getAttribute('data-module');
            cargarModulo(nombreModulo);
            document.getElementById('section-title').textContent = this.textContent;
        });
    });

    // Configurar menú de usuario
    if (userMenuButton && userDropdown) {
        userMenuButton.addEventListener('click', function () {
            userDropdown.classList.toggle('show');
        });

        document.addEventListener('click', function (event) {
            if (!userMenuButton.contains(event.target) && !userDropdown.contains(event.target)) {
                userDropdown.classList.remove('show');
            }
        });
    }

    // Escuchar evento de cierre de sesión
    window.addEventListener('redirigirAUsuarios', function() {
        cargarModulo('usuarios');
    });

    // Cargar el módulo inicial
    cargarModulo('usuarios');
}

// Esperar a que los datos globales estén disponibles
if (typeof window.datosGlobales !== 'undefined') {
    inicializarGestion();
} else {
    window.addEventListener('datosGlobalesDisponibles', inicializarGestion);
}