function inicializarGestion() {
    const userMenuButton = document.getElementById('userMenuButton');
    const userDropdown = document.getElementById('userDropdown');

    // Función para cargar módulos
    function cargarModulo(nombreModulo) {
        const contenedorPrincipal = document.getElementById('main-container');
        
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
                        const nombreFuncionInit = `inicializar${nombreModulo.charAt(0).toUpperCase() + nombreModulo.slice(1)}`;
                        if (typeof window[nombreFuncionInit] === 'function') {
                            window[nombreFuncionInit](window.datosGlobales);
                        } else if (nombreModulo === 'stock' && typeof window.moduloStock.inicializar === 'function') {
                            window.moduloStock.inicializar(window.datosGlobales);
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
            document.getElementById('section-title').textContent = this.textContent;
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
    cargarModulo('dashboard');
}

// Esperar a que los datos globales estén disponibles
if (typeof window.datosGlobales !== 'undefined') {
    inicializarGestion();
} else {
    window.addEventListener('datosGlobalesDisponibles', inicializarGestion);
}