(function() {
    console.log('Iniciando carga del módulo de Mapa de Rutas');

    let pedidos = [];
    let clientes = [];
    let mapaInstancia = null;
    let rutaActual = null;

    function cargarDatosDesdeLocalStorage() {
        try {
            const datosGuardados = JSON.parse(localStorage.getItem('datosGlobales') || '{}');
            pedidos = datosGuardados.pedidos || [];
            clientes = datosGuardados.clientes || [];
            console.log('Datos de mapa de rutas cargados desde localStorage');
        } catch (error) {
            console.error('Error al cargar datos de mapa de rutas desde localStorage:', error);
        }
    }

    function sincronizarConDatosGlobales() {
        if (window.datosGlobales) {
            pedidos = Array.isArray(window.datosGlobales.pedidos) ? window.datosGlobales.pedidos : [];
            clientes = Array.isArray(window.datosGlobales.clientes) ? window.datosGlobales.clientes : [];
            console.log('Datos de mapa de rutas sincronizados con datosGlobales');
        }
    }

    async function obtenerRuta(origen, destino) {
        try {
            const response = await fetch(`https://api.openrouteservice.org/v2/directions/driving-car?api_key=YOUR_API_KEY&start=${origen.join(',')}&end=${destino.join(',')}`);
            if (!response.ok) {
                throw new Error('Error en la respuesta de la API');
            }
            const data = await response.json();
            return data.features[0].geometry.coordinates;
        } catch (error) {
            console.error('Error al obtener la ruta:', error);
            return null;
        }
    }

    function inicializarMapa() {
        console.log('Inicializando mapa');
        mapaInstancia = L.map('mapa').setView([4.6097, -74.0817], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(mapaInstancia);
    }

    function mostrarRutaEnMapa(ruta) {
        if (mapaInstancia) {
            if (rutaActual) {
                mapaInstancia.removeLayer(rutaActual);
            }
            rutaActual = L.polyline(ruta, {color: 'red'}).addTo(mapaInstancia);
            mapaInstancia.fitBounds(rutaActual.getBounds());
        }
    }

    async function mostrarRutaPedido(idPedido) {
        const pedido = pedidos.find(p => p.idPedido === idPedido);
        if (!pedido) {
            console.error('Pedido no encontrado');
            return;
        }

        const cliente = clientes.find(c => c.id === pedido.idCliente);
        if (!cliente) {
            console.error('Cliente no encontrado');
            return;
        }

        const origen = [4.6097, -74.0817]; // Coordenadas de la tienda (ejemplo)
        const destino = [cliente.latitud, cliente.longitud];

        const ruta = await obtenerRuta(origen, destino);
        if (ruta) {
            mostrarRutaEnMapa(ruta);
        }
    }

    function actualizarSelectorPedidos() {
        const selectorPedido = document.getElementById('selector-pedido');
        if (!selectorPedido) {
            console.error('No se encontró el elemento selector-pedido');
            return;
        }
        selectorPedido.innerHTML = '<option value="">Seleccionar pedido</option>';
        pedidos.forEach(pedido => {
            const option = document.createElement('option');
            option.value = pedido.idPedido;
            option.textContent = `Pedido ${pedido.idPedido}`;
            selectorPedido.appendChild(option);
        });
    }

    function configurarEventListeners() {
        console.log('Configurando event listeners');
        const selectorPedido = document.getElementById('selector-pedido');
        if (selectorPedido) {
            selectorPedido.addEventListener('change', (event) => {
                const idPedido = event.target.value;
                if (idPedido) {
                    mostrarRutaPedido(idPedido);
                }
            });
        }
    }

    function initMapaRutas() {
        console.log('Inicializando módulo de Mapa de Rutas');
        cargarDatosDesdeLocalStorage();
        inicializarMapa();
        actualizarSelectorPedidos();
        configurarEventListeners();
        
        window.addEventListener('datosGlobalesListo', sincronizarConDatosGlobales);
        
        if (window.datosGlobales) {
            sincronizarConDatosGlobales();
        }
        
        console.log('Módulo de Mapa de Rutas cargado completamente');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMapaRutas);
    } else {
        initMapaRutas();
    }

    // Exponer funciones necesarias globalmente
    window.mostrarRutaPedido = mostrarRutaPedido;
})();

