(function() {
    console.log('Iniciando carga del script principal de la Tienda de Barrio');

    // Estado global de la aplicación
    const appState = {
        carrito: [],
        pedidos: [],
        facturas: [],
        inventario: [],
        usuario: null
    };

    // Gestor de módulos
    const ModuleManager = {
        moduleStates: {},
        loadedModules: {},

        loadModule: function(moduleName) {
            console.log(`Cargando módulo: ${moduleName}`);
            const mainContainer = document.getElementById('main-container');
            
            // Limpiar el módulo anterior si existe
            if (this.loadedModules[moduleName] && typeof this.loadedModules[moduleName].cleanup === 'function') {
                this.loadedModules[moduleName].cleanup();
            }

            // Eliminar scripts y estilos previos del módulo
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
                    script.onload = () => {
                        const initFunctionName = `inicializarModulo${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)}`;
                        if (typeof window[initFunctionName] === 'function') {
                            this.loadedModules[moduleName] = window[initFunctionName](appState);
                        }
                    };
                    document.body.appendChild(script);
                })
                .catch(error => console.error(`Error al cargar el módulo ${moduleName}:`, error));
        }
    };

    // Función para actualizar el estado global
    window.actualizarEstadoGlobal = function(nuevoEstado) {
        console.log('Actualizando estado global', nuevoEstado);
        // Actualizar el estado global
        Object.assign(appState, nuevoEstado);

        // Actualizar la interfaz de usuario
        actualizarUI();
    };

    // Función para actualizar la interfaz de usuario
    function actualizarUI() {
        // Actualizar el contador del carrito en el header
        const carritoCounter = document.getElementById('carrito-counter');
        if (carritoCounter) {
            const totalItems = appState.carrito.reduce((total, item) => total + item.cantidad, 0);
            carritoCounter.textContent = totalItems;
        }

        // Actualizar otros elementos de la UI que dependen del estado global
        // Por ejemplo, podrías actualizar un resumen del carrito si está visible
        const resumenCarrito = document.getElementById('resumen-carrito');
        if (resumenCarrito) {
            resumenCarrito.innerHTML = appState.carrito.map(item => `
                <div>${item.nombre} x ${item.cantidad}</div>
            `).join('');
        }

        // Si el módulo actual tiene una función de actualización, llámala
        const moduloActual = document.querySelector('.nav-item.active')?.dataset.module;
        if (moduloActual && ModuleManager.loadedModules[moduloActual] && typeof ModuleManager.loadedModules[moduloActual].actualizar === 'function') {
            ModuleManager.loadedModules[moduloActual].actualizar(appState);
        }
    }

    // Funciones globales
    window.generarIdUnico = function() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    };

    window.calcularSubtotal = function() {
        return appState.carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    };

    window.calcularImpuestos = function(subtotal) {
        return subtotal * 0.19;
    };

    // Configurar event listeners para la navegación
    document.addEventListener('DOMContentLoaded', function() {
        document.querySelectorAll('[data-module]').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const moduleName = this.getAttribute('data-module');
                ModuleManager.loadModule(moduleName);
                document.getElementById('section-title').textContent = this.textContent;
            });
        });

        // Cargar el módulo inicial (catálogo)
        ModuleManager.loadModule('catalogo');
    });

    // Inicializar los iconos de Lucide
    lucide.createIcons();

    console.log('Script principal de la Tienda de Barrio cargado completamente');
})();