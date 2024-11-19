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
                    <div class="pedido-acciones">
                        <button class="btn-icono" title="Ver detalles" onclick="verDetallesPedido(${pedido.idPedido})">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-eye"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                        </button>
                        <button class="btn-icono" title="Editar pedido" onclick="editarPedido(${pedido.idPedido})">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                        </button>
                        <button class="btn-icono btn-icono-eliminar" title="Eliminar pedido" onclick="eliminarPedido(${pedido.idPedido})">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash-2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                        </button>
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

    // Funciones para manejar acciones de pedidos
    window.verDetallesPedido = function(idPedido) {
        console.log('Ver detalles del pedido:', idPedido);
        // Implementar lógica para ver detalles
    };

    window.editarPedido = function(idPedido) {
        console.log('Editar pedido:', idPedido);
        // Implementar lógica para editar pedido
    };

    window.eliminarPedido = function(idPedido) {
        console.log('Eliminar pedido:', idPedido);
        // Implementar lógica para eliminar pedido
    };

    window.inicializarModuloPedidos = inicializarModuloPedidos;

    console.log('Módulo de Pedidos cargado completamente');
})();