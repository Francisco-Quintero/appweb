(function() {
    console.log('Iniciando carga del módulo de Ruta de Entrega');

    let rutaEntregaState = {
        eventListeners: [],
        appStateRef: null,
        mapaInstancia: null
    };

    function addEventListenerWithCleanup(element, event, handler) {
        if (element) {
            element.addEventListener(event, handler);
            rutaEntregaState.eventListeners.push({ element, event, handler });
        }
    }

    function cleanup() {
        console.log('Limpiando módulo de Ruta de Entrega');
        rutaEntregaState.eventListeners.forEach(({ element, event, handler }) => {
            if (element) {
                element.removeEventListener(event, handler);
            }
        });
        rutaEntregaState.eventListeners = [];
        if (rutaEntregaState.mapaInstancia) {
            rutaEntregaState.mapaInstancia.remove();
            rutaEntregaState.mapaInstancia = null;
        }
        rutaEntregaState.appStateRef = null;
    }
    function renderizarRutaEntrega(appState) {
        console.log('Renderizando ruta de entrega');
        console.log('Estado completo de la aplicación:', appState);
        console.log('Pedidos en appState:', appState.pedidos);
    
        const rutaEntregaContainer = document.getElementById('ruta-entrega-container');
        if (!rutaEntregaContainer) {
            console.error('No se encontró el contenedor de ruta de entrega');
            return;
        }
    
        const pedidosPendientes = appState.pedidos.filter(pedido => 
            pedido.estadoPedido === 'pendiente' || pedido.estadoPedido === 'en camino'
        );
    
        console.log('Pedidos pendientes filtrados:', pedidosPendientes);
    
        if (pedidosPendientes.length === 0) {
            rutaEntregaContainer.innerHTML = '<p>No tienes pedidos pendientes en este momento.</p>';
            return;
        }
    
        let contenidoHTML = '<div id="mapa-ruta" style="height: 400px;"></div>';
        contenidoHTML += '<h3>Tus Pedidos en Camino:</h3>';
        contenidoHTML += '<ul class="lista-pedidos-pendientes">';
        
        pedidosPendientes.forEach(pedido => {
            contenidoHTML += `
                <li>
                    <strong>Pedido #${pedido.idPedido}</strong>
                    <p>Estado: ${pedido.estadoPedido}</p>
                    <p>Total: $${pedido.total.toLocaleString()}</p>
                    <p>Fecha: ${new Date(pedido.fechaPedido).toLocaleString()}</p>
                </li>
            `;
        });
        
        contenidoHTML += '</ul>';
        rutaEntregaContainer.innerHTML = contenidoHTML;
    
        inicializarMapa();
    }
    
    // ... (resto del código)
    
    // ... (resto del código)
    function inicializarMapa() {
        if (rutaEntregaState.mapaInstancia) {
            rutaEntregaState.mapaInstancia.remove();
        }

        rutaEntregaState.mapaInstancia = L.map('mapa-ruta').setView([4.6097, -74.0817], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(rutaEntregaState.mapaInstancia);

        // Aquí se añadirían los marcadores y rutas según los pedidos pendientes
        // Por ahora, solo añadiremos un marcador de ejemplo
        L.marker([4.6097, -74.0817]).addTo(rutaEntregaState.mapaInstancia)
            .bindPopup('Tu pedido está en camino')
            .openPopup();
    }

    function inicializarModuloRutaEntrega(appState) {  // Este es el nombre correcto
        console.log('Inicializando módulo de Ruta de Entrega');
        rutaEntregaState.appStateRef = appState;
        renderizarRutaEntrega(appState);
        return {
            cleanup: cleanup
        };
    }
    
    window.inicializarModuloRutaEntrega = inicializarModuloRutaEntrega;  

    console.log('Módulo de Ruta de Entrega cargado completamente');
})();