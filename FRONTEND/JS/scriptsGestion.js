// En js/main.js
document.addEventListener('DOMContentLoaded', function() {
    const mainContainer = document.getElementById('main-container');
    
    // Función para cargar módulos
    function loadModule(moduleName) {
        fetch(`modules/${moduleName}/${moduleName}.html`)
            .then(response => response.text())
            .then(html => {
                mainContainer.innerHTML = html;
                // Cargar el CSS del módulo
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = `modules/${moduleName}/${moduleName}.css`;
                document.head.appendChild(link);
                // Cargar el script del módulo
                const script = document.createElement('script');
                script.src = `modules/${moduleName}/${moduleName}.js`;
                script.onload = function() {
                    // Llamar a una función de inicialización si existe
                    if (typeof window[`init${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)}`] === 'function') {
                        window[`init${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)}`]();
                    }
                };
                document.body.appendChild(script);
            })
            .catch(error => console.error(`Error al cargar el módulo ${moduleName}:`, error));
    }

    // Manejar clics en los enlaces de navegación
    document.querySelectorAll('[data-module]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const moduleName = this.getAttribute('data-module');
            loadModule(moduleName);
        });
    });

    // Cargar el dashboard por defecto
    loadModule('dashboard');
});