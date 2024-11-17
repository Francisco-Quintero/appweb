console.log('Cargando módulo de Mapas y Rutas');

// Estado del módulo
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

function inicializarModuloMapasRutas() {
    console.log('Inicializando módulo de Mapas y Rutas');
    
    if (window.ModuleManager && window.ModuleManager.moduleStates['mapas-rutas']) {
        window.ModuleManager.moduleStates['mapas-rutas'].cleanup = cleanup;
    }
    
    cargarMapbox();
    configurarEventListeners();
}

function cargarMapbox() {
    console.log('Cargando Mapbox');
    if (typeof mapboxgl === 'undefined') {
        console.error('Mapbox GL JS no está cargado');
        return;
    }

    mapboxgl.accessToken = 'TU_TOKEN_DE_MAPBOX';
    const mapaContainer = document.getElementById('mapa');
    if (!mapaContainer) {
        console.error('No se encontró el elemento del mapa');
        return;
    }
    mapasRutasState.mapa = new mapboxgl.Map({
        container: 'mapa',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [-74.0060, 40.7128], // Coordenadas de Nueva York como ejemplo
        zoom: 12
    });

    mapasRutasState.mapa.on('load', () => {
        console.log('Mapa cargado');
        cargarRutas();
    });
}

function configurarEventListeners() {
    console.log('Configurando event listeners');
    const selectorRuta = document.getElementById('selector-ruta');
    const btnOptimizarRuta = document.getElementById('btn-optimizar-ruta');

    if (selectorRuta) {
        addEventListenerWithCleanup(selectorRuta, 'change', cambiarRuta);
    } else {
        console.error('No se encontró el elemento selector-ruta');
    }

    if (btnOptimizarRuta) {
        addEventListenerWithCleanup(btnOptimizarRuta, 'click', optimizarRuta);
    } else {
        console.error('No se encontró el elemento btn-optimizar-ruta');
    }
}

function cargarRutas() {
    console.log('Cargando rutas de ejemplo');
    // Aquí normalmente harías una llamada a tu API para obtener las rutas
    // Por ahora, usaremos datos de ejemplo
    const rutas = [
        { id: 1, nombre: 'Ruta 1' },
        { id: 2, nombre: 'Ruta 2' },
        { id: 3, nombre: 'Ruta 3' }
    ];

    const selectorRuta = document.getElementById('selector-ruta');
    if (!selectorRuta) {
        console.error('No se encontró el elemento selector-ruta');
        return;
    }
    rutas.forEach(ruta => {
        const option = document.createElement('option');
        option.value = ruta.id;
        option.textContent = ruta.nombre;
        selectorRuta.appendChild(option);
    });
}

function cambiarRuta() {
    const selectorRuta = document.getElementById('selector-ruta');
    if (!selectorRuta) {
        console.error('No se encontró el elemento selector-ruta');
        return;
    }
    const rutaId = selectorRuta.value;
    if (!rutaId) return;

    console.log('Cambiando a la ruta:', rutaId);
    // Aquí normalmente harías una llamada a tu API para obtener los detalles de la ruta
    // Por ahora, usaremos datos de ejemplo
    const rutaEjemplo = {
        id: rutaId,
        paradas: [
            { nombre: 'Inicio', coordenadas: [-74.0060, 40.7128] },
            { nombre: 'Parada 1', coordenadas: [-73.9800, 40.7600] },
            { nombre: 'Parada 2', coordenadas: [-73.9500, 40.7800] },
            { nombre: 'Fin', coordenadas: [-74.0060, 40.7128] }
        ]
    };

    mostrarRutaEnMapa(rutaEjemplo);
    actualizarInfoRuta(rutaEjemplo);
    actualizarListaParadas(rutaEjemplo);
}

function mostrarRutaEnMapa(ruta) {
    console.log('Mostrando ruta en el mapa');
    if (!mapasRutasState.mapa) {
        console.error('El mapa no está inicializado');
        return;
    }

    // Limpiar marcadores y rutas anteriores
    mapasRutasState.marcadores.forEach(marcador => marcador.remove());
    mapasRutasState.marcadores = [];
    if (mapasRutasState.mapa.getLayer('ruta')) {
        mapasRutasState.mapa.removeLayer('ruta');
        mapasRutasState.mapa.removeSource('ruta');
    }

    // Añadir nuevos marcadores
    ruta.paradas.forEach(parada => {
        const marcador = new mapboxgl.Marker()
            .setLngLat(parada.coordenadas)
            .addTo(mapasRutasState.mapa);
        mapasRutasState.marcadores.push(marcador);
    });

    // Crear y añadir la nueva ruta
    const coordenadas = ruta.paradas.map(parada => parada.coordenadas);
    mapasRutasState.mapa.addSource('ruta', {
        type: 'geojson',
        data: {
            type: 'Feature',
            properties: {},
            geometry: {
                type: 'LineString',
                coordinates: coordenadas
            }
        }
    });

    mapasRutasState.mapa.addLayer({
        id: 'ruta',
        type: 'line',
        source: 'ruta',
        layout: {
            'line-join': 'round',
            'line-cap': 'round'
        },
        paint: {
            'line-color': '#888',
            'line-width': 8
        }
    });

    // Ajustar la vista del mapa para mostrar toda la ruta
    const bounds = new mapboxgl.LngLatBounds();
    coordenadas.forEach(coord => bounds.extend(coord));
    mapasRutasState.mapa.fitBounds(bounds, { padding: 50 });
}

function actualizarInfoRuta(ruta) {
    console.log('Actualizando información de la ruta');
    // Aquí normalmente calcularías la distancia y el tiempo basado en los datos reales de la ruta
    // Por ahora, usaremos valores de ejemplo
    const distanciaTotal = document.getElementById('distancia-total');
    const tiempoEstimado = document.getElementById('tiempo-estimado');
    
    if (distanciaTotal) {
        distanciaTotal.textContent = '15 km';
    } else {
        console.error('No se encontró el elemento distancia-total');
    }
    
    if (tiempoEstimado) {
        tiempoEstimado.textContent = '45 min';
    } else {
        console.error('No se encontró el elemento tiempo-estimado');
    }
}

function actualizarListaParadas(ruta) {
    console.log('Actualizando lista de paradas');
    const listaParadas = document.getElementById('lista-paradas');
    if (!listaParadas) {
        console.error('No se encontró el elemento lista-paradas');
        return;
    }
    listaParadas.innerHTML = '';
    ruta.paradas.forEach(parada => {
        const li = document.createElement('li');
        li.textContent = parada.nombre;
        listaParadas.appendChild(li);
    });
}

function optimizarRuta() {
    console.log('Optimización de ruta solicitada');
    // Aquí normalmente harías una llamada a tu API para optimizar la ruta
    // Por ahora, solo mostraremos un mensaje
    alert('Optimización de ruta solicitada. Esta función se implementará en el futuro.');
}

// Exponer funciones necesarias globalmente
window.inicializarModuloMapasRutas = inicializarModuloMapasRutas;

// Inicializar el módulo cuando se carga el script
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarModuloMapasRutas);
} else {
    inicializarModuloMapasRutas();
}