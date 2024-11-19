(function() {
    console.log('Iniciando carga del módulo de pedidos asignados');

    const pedidosAsignadosState = {
        pedidosActivos: [],
        eventListeners: []
    };

    function addEventListenerWithCleanup(element, event, handler) {
        if (element) {
            element.addEventListener(event, handler);
            pedidosAsignadosState.eventListeners.push({ element, event, handler });
        }
    }

    function cleanup() {
        console.log('Limpiando módulo de Pedidos Asignados');
        pedidosAsignadosState.eventListeners.forEach(({ element, event, handler }) => {
            if (element) {
                element.removeEventListener(event, handler);
            }
        });
        pedidosAsignadosState.eventListeners = [];
        pedidosAsignadosState.pedidosActivos = [];
    }

    function inicializarModuloPedidosAsignados() {
        console.log('Inicializando módulo de Pedidos Asignados');
        cargarPedidosAsignados();
        configurarEventListeners();
    }

    function cargarPedidosAsignados() {
        console.log('Cargando pedidos asignados...');
        // Aquí deberías cargar los pedidos desde una API o base de datos
        pedidosAsignadosState.pedidosActivos = [
            { id: 1, cliente: 'Juan Pérez', direccion: 'Calle 123 #45-67', estado: 'pendiente', productos: [
                { nombre: 'Pizza Margherita', cantidad: 1, precio: 12000 },
                { nombre: 'Refresco', cantidad: 2, precio: 2500 }
            ]},
            { id: 2, cliente: 'María López', direccion: 'Avenida 789 #12-34', estado: 'en-camino', productos: [
                { nombre: 'Hamburguesa Clásica', cantidad: 2, precio: 15000 },
                { nombre: 'Papas Fritas', cantidad: 1, precio: 5000 }
            ]}
        ];
        console.log('Pedidos cargados:', pedidosAsignadosState.pedidosActivos);
        actualizarTablaPedidos();
    }

    function actualizarTablaPedidos() {
        console.log('Actualizando tabla de pedidos');
        const tbody = document.getElementById('cuerpo-tabla-pedidos');
        const sinPedidos = document.getElementById('sin-pedidos');
        
        if (!tbody || !sinPedidos) {
            console.error('No se encontraron elementos necesarios en el DOM');
            return;
        }
        
        if (pedidosAsignadosState.pedidosActivos.length === 0) {
            tbody.innerHTML = '';
            sinPedidos.style.display = 'block';
            console.log('No hay pedidos activos para mostrar');
            return;
        }
        
        sinPedidos.style.display = 'none';
        tbody.innerHTML = pedidosAsignadosState.pedidosActivos.map(pedido => `
            <tr>
                <td>${pedido.id}</td>
                <td>${pedido.cliente}</td>
                <td>${pedido.direccion}</td>
                <td>${pedido.estado}</td>
                <td>
                    <button onclick="verDetallesPedido(${pedido.id})">Ver Detalles</button>
                    ${pedido.estado !== 'entregado' ? `<button onclick="marcarComoEntregado(${pedido.id})">Marcar como Entregado</button>` : ''}
                </td>
            </tr>
        `).join('');
        console.log('Tabla de pedidos actualizada');
    }

    function configurarEventListeners() {
        console.log('Configurando event listeners');
        const btnFiltrar = document.getElementById('btn-filtrar');
        const btnActualizarEstado = document.getElementById('btn-actualizar-estado');
        const cerrarModal = document.querySelector('.cerrar-modal');

        if (btnFiltrar) addEventListenerWithCleanup(btnFiltrar, 'click', filtrarPedidos);
        if (btnActualizarEstado) addEventListenerWithCleanup(btnActualizarEstado, 'click', actualizarEstadoPedido);
        if (cerrarModal) addEventListenerWithCleanup(cerrarModal, 'click', cerrarModalDetalles);
    }

    function filtrarPedidos() {
        const estado = document.getElementById('filtro-estado')?.value;
        const fecha = document.getElementById('filtro-fecha')?.value;
        
        console.log('Filtrando pedidos:', { estado, fecha });
        // Implementar lógica de filtrado aquí
        actualizarTablaPedidos();
    }

    function verDetallesPedido(idPedido) {
        console.log('Viendo detalles del pedido:', idPedido);
        const pedido = pedidosAsignadosState.pedidosActivos.find(p => p.id === idPedido);
        if (!pedido) {
            console.error('No se encontró el pedido con ID:', idPedido);
            return;
        }
        
        const idPedidoDetalle = document.getElementById('id-pedido-detalle');
        const detallesPedido = document.getElementById('detalles-pedido');
        const actualizarEstado = document.getElementById('actualizar-estado');
        const modalDetallesPedido = document.getElementById('modal-detalles-pedido');
        
        if (idPedidoDetalle) idPedidoDetalle.textContent = pedido.id;
        if (detallesPedido) {
            detallesPedido.innerHTML = `
                <p><strong>Cliente:</strong> ${pedido.cliente}</p>
                <p><strong>Dirección:</strong> ${pedido.direccion}</p>
                <p><strong>Estado:</strong> ${pedido.estado}</p>
                <h4>Productos:</h4>
                <table class="tabla-productos">
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Cantidad</th>
                            <th>Precio Unitario</th>
                            <th>Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${pedido.productos.map(producto => `
                            <tr>
                                <td>${producto.nombre}</td>
                                <td>${producto.cantidad}</td>
                                <td>$${producto.precio.toFixed(2)}</td>
                                <td>$${(producto.cantidad * producto.precio).toFixed(2)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
        }
        
        if (actualizarEstado) {
            actualizarEstado.value = pedido.estado;
        }
        if (modalDetallesPedido) modalDetallesPedido.style.display = 'block';
    }

    function actualizarEstadoPedido() {
        const idPedido = parseInt(document.getElementById('id-pedido-detalle')?.textContent);
        const nuevoEstado = document.getElementById('actualizar-estado')?.value;
        
        console.log('Actualizando estado del pedido:', { idPedido, nuevoEstado });
        
        const pedido = pedidosAsignadosState.pedidosActivos.find(p => p.id === idPedido);
        if (pedido) {
            pedido.estado = nuevoEstado;
            if (nuevoEstado === 'entregado') {
                pedidosAsignadosState.pedidosActivos = pedidosAsignadosState.pedidosActivos.filter(p => p.id !== idPedido);
            }
            actualizarTablaPedidos();
            cerrarModalDetalles();
        } else {
            console.error('No se encontró el pedido para actualizar');
        }
    }

    function marcarComoEntregado(idPedido) {
        const pedido = pedidosAsignadosState.pedidosActivos.find(p => p.id === idPedido);
        if (pedido) {
            pedido.estado = 'entregado';
            pedidosAsignadosState.pedidosActivos = pedidosAsignadosState.pedidosActivos.filter(p => p.id !== idPedido);
            actualizarTablaPedidos();
        } else {
            console.error('No se encontró el pedido para marcar como entregado');
        }
    }

    function cerrarModalDetalles() {
        console.log('Cerrando modal de detalles');
        const modalDetallesPedido = document.getElementById('modal-detalles-pedido');
        if (modalDetallesPedido) modalDetallesPedido.style.display = 'none';
    }

    // Exponer funciones necesarias globalmente
    window.inicializarModuloPedidosAsignados = inicializarModuloPedidosAsignados;
    window.verDetallesPedido = verDetallesPedido;
    window.filtrarPedidos = filtrarPedidos;
    window.actualizarEstadoPedido = actualizarEstadoPedido;
    window.cerrarModalDetalles = cerrarModalDetalles;
    window.marcarComoEntregado = marcarComoEntregado;

    console.log('Módulo de pedidos asignados cargado completamente');
})();