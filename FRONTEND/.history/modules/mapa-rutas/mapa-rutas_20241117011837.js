// Estado del módulo encapsulado
const mapasRutasState = {
    mapa: null,
    rutaActual: null,
    marcadores: [],
    eventListeners: []
};

// Función para agregar event listeners y mantener un registro
function addEventListenerWithCleanup(element, event, handler) {
    if (element) {
        element.addEventListener(event, handler);
        mapasRutasState.eventListeners.push({ element, event, handler });
    }
}

// Función de limpieza
function cleanup() {
    console.log('Limpiando módulo de Mapas y Rutas');
    mapasRutasState.eventListeners.forEach(({ element, event, handler }) => {
        element.removeEventListener(event, handler);
    });
    mapasRutasState.eventListeners = [];
    if (mapasRutasState.mapa) {
        mapasRutasState.mapa.remove();
        mapasRutasState.mapa = null;
    }
}

// Función principal de inicialización
function inicializarModuloMapasRutas() {
    console.log('Inicializando módulo de Mapas y Rutas');
    
    // Registrar la función de limpieza
    if (window.ModuleManager) {
        window.ModuleManager.moduleStates['mapas-rutas'] = {
            cleanup: cleanup
        };
    }
    
    // Verificar si el elemento del mapa existe
    const mapaElement = document.getElementById('mapa');
    if (!mapaElement) {
        console.error('Elemento del mapa no encontrado');
        return;
    }

    try {
        cargarMapbox();
        configurarEventListeners();
    } catch (error) {
        console.error('Error al inicializar el módulo:', error);
    }
}

// Función para cargar Mapbox
function cargarMapbox() {
    // Aquí iría el código para inicializar el mapa de Mapbox
    console.log('Cargando Mapbox...');
    // Ejemplo: mapasRutasState.mapa = new mapboxgl.Map({ ... });
}

// Función para configurar los event listeners
function configurarEventListeners() {
    console.log('Configurando event listeners para Mapas y Rutas');
    const selectorRuta = document.getElementById('selector-ruta');
    const btnOptimizarRuta = document.getElementById('btn-optimizar-ruta');

    if (selectorRuta) addEventListenerWithCleanup(selectorRuta, 'change', cambiarRuta);
    if (btnOptimizarRuta) addEventListenerWithCleanup(btnOptimizarRuta, 'click', optimizarRuta);
}

// Función para cambiar la ruta seleccionada
function cambiarRuta() {
    console.log('Cambiando ruta...');
    // Implementar la lógica para cambiar la ruta
}

// Función para optimizar la ruta
function optimizarRuta() {
    console.log('Optimizando ruta...');
    // Implementar la lógica para optimizar la ruta
}

// IMPORTANTE: Asegurarnos de que la función esté disponible globalmente
window.inicializarModuloMapasRutas = inicializarModuloMapasRutas;

// Inicializar el módulo cuando se carga el script
inicializarModuloMapasRutas();