(function() {
    console.log('Iniciando carga del módulo de pedidos asignados');

    let pedidosActivos = [];
    let domiciliarioActual = null;

    function inicializarModuloPedidosAsignados() {
        console.log('Inicializando módulo de Pedidos Asignados');
        cargarPedidosAsignados();
        configurarEventListeners();
    }

    function cargarPedidosAsignados() {
        console.log('Cargando pedidos asignados...');
        const datosGuardados = JSON.parse(localStorage.getItem('datosGlobales') || '{}');
        pedidosActivos = datosGuardados.pedidosPendientes || [];
        productos = datosGuardados.productos || [];
        const sesionGuardada = localStorage.getItem('sesionDomiciliario');
            if (sesionGuardada) {
                domiciliarioActual = JSON.parse(sesionGuardada);
            }             
        console.log('Pedidos cargados:', pedidosActivos);
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
        
        if (pedidosActivos.length === 0) {
            tbody.innerHTML = '';
            sinPedidos.style.display = 'block';
            console.log('No hay pedidos activos para mostrar');
            return;
        }
        const pedidosFiltrados = pedidosActivos.filter(pedido => 
            pedido.domiciliario && pedido.domiciliario.id === domiciliarioActual.id
        );
        
        sinPedidos.style.display = 'none';
        tbody.innerHTML = pedidosFiltrados.map(pedido => `
            <tr>
                <td>${pedido.idPedido}</td>
                <td>${pedido.cliente ? pedido.cliente.nombre : "sin nombre"}</td>
                <td>${pedido.cliente ? pedido.cliente.direccion : "sin dirreccion"}</td>
                <td>${pedido.estadoPedido}</td>
                <td>
                    <button onclick="verDetallesPedido(${pedido.idPedido})">Ver Detalles</button>
                    ${pedido.estadoPedido !== 'entregado' ? `<button onclick="marcarComoEntregado(${pedido.idPedido})">Marcar como Entregado</button>` : ''}
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

        if (btnFiltrar) btnFiltrar.addEventListener('click', filtrarPedidos);
        if (btnActualizarEstado) btnActualizarEstado.addEventListener('click', actualizarEstadoPedido);
        if (cerrarModal) cerrarModal.addEventListener('click', cerrarModalDetalles);
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
        const pedido = pedidosActivos.find(p => p.idPedido === idPedido);
        if (!pedido) {
            console.error('No se encontró el pedido con ID:', idPedido);
            return;
        }
        
        const idPedidoDetalle = document.getElementById('id-pedido-detalle');
        const detallesPedido = document.getElementById('detalles-pedido');
        const actualizarEstado = document.getElementById('actualizar-estado');
        const modalDetallesPedido = document.getElementById('modal-detalles-pedido');
        
        if (idPedidoDetalle) idPedidoDetalle.textContent = pedido.idPedido;
        if (detallesPedido) {
            detallesPedido.innerHTML = `
                <p><strong>Cliente:</strong> ${pedido.cliente ? pedido.cliente.nombre : "sin nombre"}</p>
                <p><strong>Dirección:</strong> ${pedido.cliente ? pedido.cliente.direccion : "sin direccion"}</p>
                <p><strong>Estado:</strong> ${pedido.estadoPedido}</p>
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
                        ${pedido.items.map(item => `
                            <tr>
                                <td>${item.nombre}</td>
                                <td>${item.cantidad}</td>
                                <td>$${item.precioUnitario}</td>
                                <td>$${item.total}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                <p><strong>Subtotal:</strong> $${pedido.subtotal}</p>
                <p><strong>Costo de envío:</strong> $${pedido.costoEnvio}</p>
                <p><strong>Total:</strong> $${pedido.total}</p>
            `;
        }
        
        if (actualizarEstado) {
            actualizarEstado.value = pedido.estadoPedido;
        }
        if (modalDetallesPedido) modalDetallesPedido.style.display = 'block';
    }

    function actualizarEstadoPedido() {
        const idPedido = parseInt(document.getElementById('id-pedido-detalle')?.textContent);
        const nuevoEstado = document.getElementById('actualizar-estado')?.value;
        
        console.log('Actualizando estado del pedido:', { idPedido, nuevoEstado });
        
        const pedido = pedidosActivos.find(p => p.idPedido === idPedido);
        if (pedido) {
            pedido.estadoPedido = nuevoEstado;
            if (nuevoEstado === 'entregado') {
                marcarComoEntregado(idPedido);
            } else {
                guardarEnLocalStorage();
                actualizarTablaPedidos();
            }
            cerrarModalDetalles();
        } else {
            console.error('No se encontró el pedido para actualizar');
        }
    }

    function marcarComoEntregado(idPedido) {
        const pedidoIndex = pedidosActivos.findIndex(p => p.idPedido === idPedido);
        if (pedidoIndex !== -1) {
            const pedido = pedidosActivos[pedidoIndex];
            pedido.estadoPedido = 'entregado';
            
            // Mover el pedido a historialVentas
            const datosGuardados = JSON.parse(localStorage.getItem('datosGlobales') || '{}');
            datosGuardados.historialVentas = datosGuardados.historialVentas || [];
            datosGuardados.historialVentas.push(pedido);
            
            // Eliminar el pedido de pedidosPendientes
            pedidosActivos.splice(pedidoIndex, 1);
            datosGuardados.pedidosPendientes = pedidosActivos;
            
            localStorage.setItem('datosGlobales', JSON.stringify(datosGuardados));
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

    function guardarEnLocalStorage() {
        try {
            const datosGuardados = JSON.parse(localStorage.getItem('datosGlobales') || '{}');
            datosGuardados.pedidosPendientes = pedidosActivos;
            localStorage.setItem('datosGlobales', JSON.stringify(datosGuardados));
            console.log('Datos de pedidos guardados en localStorage');
        } catch (error) {
            console.error('Error al guardar datos de pedidos en localStorage:', error);
        }
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