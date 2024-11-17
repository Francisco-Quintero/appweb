
lucide.createIcons();

// En scriptTienda.js
window.carrito = window.carrito || [];
window.pedidos = window.pedidos || [];
window.facturas = window.facturas || [];
window.inventario = window.inventario || [];

// Función para cambiar entre módulos
window.cambiarModulo = function(modulo) {
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    const botonModulo = document.querySelector(`[data-tab="${modulo}"]`);
    const contenidoModulo = document.getElementById(modulo);
    
    if (botonModulo && contenidoModulo) {
        botonModulo.classList.add('active');
        contenidoModulo.classList.add('active');
    }

    // Cargar el módulo correspondiente
    switch(modulo) {
        case 'catalogo':
            if (typeof window.initCatalogo === 'function') window.initCatalogo();
            break;
        case 'carrito':
            if (typeof window.initCarrito === 'function') window.initCarrito();
            break;
        case 'pedidos':
            if (typeof window.initPedidos === 'function') window.initPedidos();
            break;
        case 'facturas':
            if (typeof window.initFacturas === 'function') window.initFacturas();
            break;
    }
};

// Configurar event listeners para los botones de navegación
document.querySelectorAll('.tab-button').forEach(button => {
    button.addEventListener('click', () => {
        window.cambiarModulo(button.dataset.tab);
    });
});

// Función para cargar módulos
function loadModule(moduleName) {
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
                }
            };
            document.body.appendChild(script);
        })
        .catch(error => console.error(`Error al cargar el módulo ${moduleName}:`, error));
}

document.addEventListener('DOMContentLoaded', function() {
    // Manejar clics en los enlaces de navegación
    window.cambiarModulo('catalogo');
    document.querySelectorAll('[data-module]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const moduleName = this.getAttribute('data-module');
            loadModule(moduleName);
        });
    });

    // Cargar el catálogo por defecto
    loadModule('catalogo');

    // Inicializar los iconos de Lucide
    lucide.createIcons();
});


window.usuario = null;

// Funciones globales que pueden ser necesarias en múltiples módulos
window.generarIdUnico = function() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

window.calcularSubtotal = function() {
    return window.carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
};

window.calcularImpuestos = function(subtotal) {
    return subtotal * 0.19;
};

