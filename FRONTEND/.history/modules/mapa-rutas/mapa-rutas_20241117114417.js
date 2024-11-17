(function() {
    console.log('Iniciando carga del módulo de Mapa de Rutas');

    const mapaRutasState = {
        rutas: [],
        mapaInstancia: null,
        rutaActual: null,
        eventListeners: []
    };

    function addEventListenerWithCleanup(element, event, handler) {
        if (element) {
            element.addEventListener(event, handler);
            mapaRutasState.eventListeners.push({ element, event, handler });
        }
    }

    function cleanup() {
        console.log('Limpiando módulo de Mapa de Rutas');
        mapaRutasState.eventListeners.forEach(({ element, event, handler }) => {
            if (element) {
                element.removeEventListener(event, handler);
            }
        });
        mapaRutasState.eventListeners = [];
        if (mapaRutasState.mapaInstancia) {
            mapaRutasState.mapaInstancia.remove();
            mapaRutasState.mapaInstancia = null;
        }
        mapaRutasState.rutas = [];
        mapaRutasState.rutaActual = null;
    }

    function inicializarModuloMapaRutas() {
        console.log('Inicializando módulo de Mapa de Rutas');
        
        if (mapaRutasState.mapaInstancia) {
            mapaRutasState.mapaInstancia.remove();
            mapaRutasState.mapaInstancia = null;
        }
        mapaRutasState.rutas = [];
        mapaRutasState.rutaActual = null;
        
        cargarRutas();
        inicializarMapa();
        configurarEventListeners();
    }

    function cargarRutas() {
        console.log('Cargando rutas...');
        mapaRutasState.rutas = [
            { id: 1, nombre: 'Ruta Norte', coordenadas: [[4.6097, -74.0817], [4.6261, -74.0737]] },
            { id: 2, nombre: 'Ruta Sur', coordenadas: [[4.5709, -74.1263], [4.5981, -74.0760]] },
            { id: 3, nombre: 'Ruta Este', coordenadas: [[4.6486, -74.0628], [4.6280, -74.0633]] }
        ];
        actualizarSelectorRutas();
    }

    function inicializarMapa() {
        console.log('Inicializando mapa');
        mapaRutasState.mapaInstancia = L.map('mapa').setView([4.6097, -74.0817], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(mapaRutasState.mapaInstancia);
    }

    function configurarEventListeners() {
        console.log('Configurando event listeners');
        const selectorRuta = document.getElementById('selector-ruta');
        const btnIniciarRuta = document.getElementById('btn-iniciar-ruta');

        if (selectorRuta) addEventListenerWithCleanup(selectorRuta, 'change', seleccionarRuta);
        if (btnIniciarRuta) addEventListenerWithCleanup(btnIniciarRuta, 'click', iniciarRuta);
    }

    function actualizarSelectorRutas() {
        const selectorRuta = document.getElementById('selector-ruta');
        if (!selectorRuta) {
            console.error('No se encontró el elemento selector-ruta');
            return;
        }
        selectorRuta.innerHTML = '<option value="">Seleccionar ruta</option>';
        mapaRutasState.rutas.forEach(ruta => {
            const option = document.createElement('option');
            option.value = ruta.id;
            option.textContent = ruta.nombre;
            selectorRuta.appendChild(option);
        });
    }

    function seleccionarRuta(event) {
        const rutaId = event.target.value;
        mapaRutasState.rutaActual = mapaRutasState.rutas.find(r => r.id == rutaId);
        if (mapaRutasState.rutaActual) {
            mostrarRutaEnMapa(mapaRutasState.rutaActual);
        } else {
            limpiarRutaEnMapa();
        }
    }

    function mostrarRutaEnMapa(ruta) {
        limpiarRutaEnMapa();
        if (mapaRutasState.mapaInstancia) {
            const polyline = L.polyline(ruta.coordenadas, {color: 'red'}).addTo(mapaRutasState.mapaInstancia);
            mapaRutasState.mapaInstancia.fitBounds(polyline.getBounds());
            actualizarInfoRuta(ruta);
        }
    }

    function limpiarRutaEnMapa() {
        if (mapaRutasState.mapaInstancia) {
            mapaRutasState.mapaInstancia.eachLayer(layer => {
                if (layer instanceof L.Polyline) {
                    mapaRutasState.mapaInstancia.removeLayer(layer);
                }
            });
        }
        document.getElementById('distancia-ruta').textContent = '-';
        document.getElementById('tiempo-ruta').textContent = '-';
    }

    function actualizarInfoRuta(ruta) {
        const distancia = calcularDistancia(ruta.coordenadas);
        const tiempo = Math.round(distancia / 50 * 60); // Asumiendo una velocidad promedio de 50 km/h
        document.getElementById('distancia-ruta').textContent = `${distancia.toFixed(2)} km`;
        document.getElementById('tiempo-ruta').textContent = `${tiempo} minutos`;
    }

    function calcularDistancia(coordenadas) {
        let distancia = 0;
        for (let i = 1; i < coordenadas.length; i++) {
            distancia += mapaRutasState.mapaInstancia.distance(coordenadas[i-1], coordenadas[i]);
        }
        return distancia / 1000; // Convertir a kilómetros
    }

    function iniciarRuta() {
        if (mapaRutasState.rutaActual) {
            console.log(`Iniciando ruta: ${mapaRutasState.rutaActual.nombre}`);
            // Aquí irían las acciones para iniciar la navegación real
            alert(`Ruta iniciada: ${mapaRutasState.rutaActual.nombre}`);
        } else {
            alert('Por favor, selecciona una ruta primero.');
        }
    }

    // Exponer funciones necesarias globalmente
    window.inicializarModuloMapaRutas = inicializarModuloMapaRutas;
    window.seleccionarRuta = seleccionarRuta;
    window.iniciarRuta = iniciarRuta;

    console.log('Módulo de Mapa de Rutas cargado completamente');
})();