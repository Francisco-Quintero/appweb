
// Función para cargar módulos
export function loadModule(moduleName) {
    const mainContainer = document.getElementById('main-container');
    
    // Primero, eliminar cualquier script y estilo previo del módulo
    document.querySelectorAll(`script[data-module="${moduleName}"]`).forEach(el => el.remove());
    document.querySelectorAll(`link[data-module="${moduleName}"]`).forEach(el => el.remove());

    fetch(`modules/${moduleName}/${moduleName}.html`)
        .then(response => response.text())
        .then(html => {
            mainContainer.innerHTML = html;
            
            // Cargar el CSS del módulo
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = `modules/${moduleName}/${moduleName}.css`;
            link.setAttribute('data-module', moduleName);
            document.head.appendChild(link);
            
            // Cargar el script del módulo
            const script = document.createElement('script');
            script.src = `modules/${moduleName}/${moduleName}.js`;
            script.setAttribute('data-module', moduleName);
            script.onload = function() {
                // Llamar a una función de inicialización si existe
                const initFunctionName = `init${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)}`;
                if (typeof window[initFunctionName] === 'function') {
                    window[initFunctionName]();
                } else if (typeof window[`cargarModulo${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)}`] === 'function') {
                    window[`cargarModulo${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)}`]();
                }
            };
            document.body.appendChild(script);
        })
        .catch(error => console.error(`Error al cargar el módulo ${moduleName}:`, error));
}

document.addEventListener('DOMContentLoaded', function() {
    const userMenuButton = document.getElementById('userMenuButton');
    const userDropdown = document.getElementById('userDropdown');

    // Manejar clics en los enlaces de navegación
    document.querySelectorAll('[data-module]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const moduleName = this.getAttribute('data-module');
            loadModule(moduleName);
        });
    });

    // Menú lateral
    userMenuButton.addEventListener('click', function() {
        userDropdown.classList.toggle('show');
    });

    document.addEventListener('click', function(event) {
        if (!userMenuButton.contains(event.target) && !userDropdown.contains(event.target)) {
            userDropdown.classList.remove('show');
        }
    });

    // Cargar el dashboard por defecto
    loadModule('dashboard');
});