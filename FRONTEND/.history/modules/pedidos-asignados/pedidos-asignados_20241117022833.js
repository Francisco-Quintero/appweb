// Estado del módulo encapsulado
const pedidosAsignadosState = {
    pedidos: [],
    eventListeners: []
};

// Función para agregar event listeners y mantener un registro
function addEventListenerWithCleanup(element, event, handler) {
    if (element) {
        element.addEventListener(event, handler);
        pedidosAsignadosState.eventListeners.push({ element, event, handler });
    }
}

// Función de limpieza
function cleanup() {
    console.log('Limpiando módulo de Pedidos Asignados');
    pedidosAsignadosState.eventListeners.forEach(({ element, event, handler }) => {
        element.removeEventListener(event, handler);
    });
    pedidosAsignadosState.eventListeners = [];
    pedidosAsignadosState.pedidos = [];
}

function inicializarModuloPedidosAsignados() {
    console.log('Inicializando módulo de Pedidos Asignados');
    
    if (window.ModuleManager && window.ModuleManager.moduleStates['pedidos-asignados']) {
        window.ModuleManager.moduleStates['pedidos-asignados'].cleanup = cleanup;
    }
    
    cargarPedidosAsignados();
    configurarEventListeners();
}

function cargarPedidosAsignados() {
    console.log('Cargando pedidos asignados...');
    // Aquí deberías cargar los pedidos desde una API o base de datos
    pedidosAsignadosState.pedidos = [
        { id: 1, cliente: 'Juan Pérez', direccion: 'Calle 123 #45-67', estado: 'pendiente' },
        { id: 2, cliente: 'María López', direccion: 'Avenida 789 #12-34', estado: 'en-camino' },
        { id: 3, cliente: 'Carlos Rodríguez', direccion: 'Carrera 456 #78-90', estado: 'entregado' }
    ];
    console.log('Pedidos cargados:', pedidosAsignadosState.pedidos);
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
    
    if (pedidosAsignadosState.pedidos.length === 0) {
        tbody.innerHTML = '';
        sinPedidos.style.display = 'block';
        console.log('No hay pedidos para mostrar');
        return;
    }
    
    sinPedidos.style.display = 'none';
    tbody.innerHTML = pedidosAsignadosState.pedidos.map(pedido => `
        <tr>
            <td>${pedido.id}</td>
            <td>${pedido.cliente}</td>
            <td>${pedido.direccion}</td>
            <td>${pedido.estado}</td>
            <td>
                <button onclick="verDetallesPedido(${pedido.id})">Ver Detalles</button>
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
    const pedido = pedidosAsignadosState.pedidos.find(p => p.id === idPedido);
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
        `;
    }
    
    if (actualizarEstado) actualizarEstado.value = pedido.estado;
    if (modalDetallesPedido) modalDetallesPedido.style.display = 'block';
}

function actualizarEstadoPedido() {
    const idPedido = document.getElementById('id-pedido-detalle')?.textContent;
    const nuevoEstado = document.getElementById('actualizar-estado')?.value;
    
    console.log('Actualizando estado del pedido:', { idPedido, nuevoEstado });
    
    const pedido = pedidosAsignadosState.pedidos.find(p => p.id == idPedido);
    if (pedido) {
        pedido.estado = nuevoEstado;
        actualizarTablaPedidos();
        cerrarModalDetalles();
    } else {
        console.error('No se encontró el pedido para actualizar');
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

// No es necesario inicializar el módulo aquí, se hará cuando se cargue