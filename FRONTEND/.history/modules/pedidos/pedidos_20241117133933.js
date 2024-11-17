(function() {
    console.log('Iniciando carga del módulo de Pedidos');

    let pedidosState = {
        eventListeners: [],
        appStateRef: null
    };

    function addEventListenerWithCleanup(element, event, handler) {
        if (element) {
            element.addEventListener(event, handler);
            pedidosState.eventListeners.push({ element, event, handler });
        }
    }

    function cleanup() {
        console.log('Limpiando módulo de Pedidos');
        pedidosState.eventListeners.forEach(({ element, event, handler }) => {
            if (element) {
                element.removeEventListener(event, handler);
            }
        });
        pedidosState.eventListeners = [];
        pedidosState.appStateRef = null;
    }

    function renderizarPedidos(appState) {
        const pedidosLista = document.getElementById('pedidos-lista');
        const pedidosEmpty = document.getElementById('pedidos-empty');
        
        if (!pedidosLista || !pedidosEmpty) {
            console.error('No se encontraron los elementos necesarios para renderizar pedidos');
            return;
        }
        
        if (!appState.pedidos || appState.pedidos.length === 0) {
            pedidosLista.style.display = 'none';
            pedidosEmpty.style.display = 'block';
            return;
        }

        pedidosLista.style.display = 'block';
        pedidosEmpty.style.display = 'none';
        
        pedidosLista.innerHTML = appState.pedidos.map(pedido => {
            const pedidoItems = pedido.items.map(item => {
                const producto = appState.inventario.find(p => p.id === item.idProducto);
                return `
                    <div class="pedido-item-detalle">
                        <span>${producto ? producto.nombre : 'Producto no encontrado'} x ${item.cantidad}</span>
                        <span>$${item.total.toLocaleString()}</span>
                    </div>
                `;
            }).join('');

            return `
                <div class="pedido-item">
                    <div class="pedido-header">
                        <span class="pedido-numero">Pedido ${pedido.idPedido}</span>
                        <span class="pedido-fecha">${formatearFecha(pedido.fechaPedido)}</span>
                        <span class="pedido-estado estado-${pedido.estadoPedido.replace(' ', '-')}">
                            ${pedido.estadoPedido.toUpperCase()}
                        </span>
                    </div>
                    <div class="pedido-items">
                        ${pedidoItems}
                    </div>
                    <div class="pedido-total">
                        <strong>Total: $${pedido.total.toLocaleString()}</strong>
                    </div>
                </div>
            `;
        }).join('');
    }

    function formatearFecha(fecha) {
        try {
            return new Date(fecha).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch (error) {
            console.error('Error al formatear fecha:', error);
            return 'Fecha no válida';
        }
    }

    function filtrarPedidos() {
        const appState = pedidosState.appStateRef;
        if (!appState) {
            console.error('Estado de la aplicación no disponible');
            return;
        }

        const busqueda = document.getElementById('busqueda-pedido')?.value.toLowerCase() || '';
        const desde = document.getElementById('fecha-desde')?.value || '';
        const hasta = document.getElementById('fecha-hasta')?.value || '';
        const estado = document.getElementById('estado-filtro')?.value || 'todos';

        if (!appState.pedidos) return;

        const pedidosFiltrados = appState.pedidos.filter(pedido => {
            const cumpleFecha = (!desde || new Date(pedido.fechaPedido) >= new Date(desde)) && 
                              (!hasta || new Date(pedido.fechaPedido) <= new Date(hasta));
            const cumpleEstado = estado === 'todos' || pedido.estadoPedido === estado;
            const cumpleBusqueda = pedido.idPedido.toLowerCase().includes(busqueda) ||
                                 pedido.items.some(item => {
                                     const producto = appState.inventario?.find(p => p.id === item.idProducto);
                                     return producto && producto.nombre.toLowerCase().includes(busqueda);
                                 });

            return cumpleFecha && cumpleEstado && cumpleBusqueda;
        });

        renderizarPedidos({ ...appState, pedidos: pedidosFiltrados });
    }

    function configurarEventListeners() {
        addEventListenerWithCleanup(document.getElementById('busqueda-pedido'), 'input', filtrarPedidos);
        addEventListenerWithCleanup(document.getElementById('fecha-desde'), 'change', filtrarPedidos);
        addEventListenerWithCleanup(document.getElementById('fecha-hasta'), 'change', filtrarPedidos);
        addEventListenerWithCleanup(document.getElementById('estado-filtro'), 'change', filtrarPedidos);
        addEventListenerWithCleanup(document.getElementById('btn-aplicar-filtros'), 'click', filtrarPedidos);
    }

    function inicializarModuloPedidos(appState) {
        console.log('Inicializando módulo de Pedidos');
        pedidosState.appStateRef = appState;
        renderizarPedidos(appState);
        configurarEventListeners();
        return {
            cleanup: cleanup
        };
    }

    window.inicializarModuloPedidos = inicializarModuloPedidos;

    console.log('Módulo de Pedidos cargado completamente');
})();