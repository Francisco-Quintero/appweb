function inicializarDomiciliario() {
    const userMenuButton = document.getElementById('userMenuButton');
    const userDropdown = document.getElementById('userDropdown');

    // Función para verificar si hay un domiciliario logueado
    function verificarSesionDomiciliario() {
        const sesionDomiciliario = localStorage.getItem('sesionDomiciliario');
        return !!sesionDomiciliario;
    }

    // Añade la siguiente función cargarLibreriaEmailJS() justo después de la declaración de verificarSesionDomiciliario()
    function cargarLibreriaEmailJS() {
        return new Promise((resolve, reject) => {
            if (window.emailjs) {
                resolve();
            } else {
                const script = document.createElement('script');
                script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
                script.onload = () => {
                    emailjs.init('R6MTXZtcPcos0kbQw');
                    resolve();
                };
                script.onerror = reject;
                document.head.appendChild(script);
            }
        });
    }

    // Función para cargar módulos
    function cargarModulo(nombreModulo) {
        if (!verificarSesionDomiciliario() && nombreModulo !== 'perfil-domiciliario') {
            alert('Debe iniciar sesión para acceder a este módulo.');
            cargarModulo('perfil-domiciliario');
            return;
        }

        const contenedorPrincipal = document.getElementById('main-container');
        
        // Eliminar scripts y estilos previos del módulo
        document.querySelectorAll(`script[data-module="${nombreModulo}"]`).forEach(el => el.remove());
        document.querySelectorAll(`link[data-module="${nombreModulo}"]`).forEach(el => el.remove());

        cargarLibreriaEmailJS()
            .then(() => fetch(`modules/${nombreModulo}/${nombreModulo}.html`))
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
                    console.log("Cargando el módulo de " + nombreModulo);
                    if (typeof lucide !== 'undefined') {
                        lucide.createIcons();
                    }
                    // Llamar a una función de inicialización si existe
                    const initFunctionName = `inicializarModulo${nombreModulo.split('-').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)).join('')}`;
                    if (typeof window[initFunctionName] === 'function') {
                        window[initFunctionName]();
                    }
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
        enlace.addEventListener('click', function(e) {
            e.preventDefault();
            const nombreModulo = this.getAttribute('data-module');
            cargarModulo(nombreModulo);
            const sectionTitle = document.getElementById('section-title');
            if (sectionTitle) {
                sectionTitle.textContent = this.textContent;
            }
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

    // Escuchar evento de cierre de sesión
    window.addEventListener('redirigirAPerfilDomiciliario', function() {
        cargarModulo('perfil-domiciliario');
    });

    // Cargar el módulo inicial
    cargarModulo('perfil-domiciliario');
}

// Esperar a que los datos globales estén disponibles
if (typeof window.datosGlobales !== 'undefined') {
    inicializarDomiciliario();
} else {
    window.addEventListener('datosGlobalesDisponibles', inicializarDomiciliario);
}

document.addEventListener('DOMContentLoaded', function() {
    // Si los datos globales ya están disponibles, inicializar inmediatamente
    if (typeof window.datosGlobales !== 'undefined') {
        inicializarDomiciliario();
    }
    // Si no, el evento 'datosGlobalesDisponibles' se encargará de la inicialización
});

