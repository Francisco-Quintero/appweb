(function() {
    console.log('Iniciando carga del módulo de Pedidos');

    let pedidos = [];
    let inventario = [];

    function cargarDatosDesdeLocalStorage() {
        try {
            const datosGuardados = JSON.parse(localStorage.getItem('datosGlobales') || '{}');
            pedidos = datosGuardados.pedidos || [];
            inventario = datosGuardados.inventario || [];
            console.log('Datos de pedidos cargados desde localStorage');
        } catch (error) {
            console.error('Error al cargar datos de pedidos desde localStorage:', error);
        }
    }

    function guardarEnLocalStorage() {
        try {
            const datosActuales = JSON.parse(localStorage.getItem('datosGlobales') || '{}');
            datosActuales.pedidos = pedidos;
            localStorage.setItem('datosGlobales', JSON.stringify(datosActuales));
            console.log('Datos de pedidos guardados en localStorage');
        } catch (error) {
            console.error('Error al guardar datos de pedidos en localStorage:', error);
        }
    }

    function sincronizarConDatosGlobales() {
        if (window.datosGlobales) {
            pedidos = Array.isArray(window.datosGlobales.pedidos) ? window.datosGlobales.pedidos : [];
            inventario = Array.isArray(window.datosGlobales.inventario) ? window.datosGlobales.inventario : [];
            renderizarPedidos();
            console.log('Datos de pedidos sincronizados con datosGlobales');
        }
    }

    function renderizarPedidos(pedidosFiltrados = null) {
        const pedidosLista = document.getElementById('pedidos-lista');
        const pedidosEmpty = document.getElementById('pedidos-empty');
        
        if (!pedidosLista || !pedidosEmpty) {
            console.error('No se encontraron los elementos necesarios para renderizar pedidos');
            return;
        }
        
        const pedidosAMostrar = pedidosFiltrados || pedidos;

        if (pedidosAMostrar.length === 0) {
            pedidosLista.style.display = 'none';
            pedidosEmpty.style.display = 'block';
            return;
        }

        pedidosLista.style.display = 'block';
        pedidosEmpty.style.display = 'none';
        
        pedidosLista.innerHTML = pedidosAMostrar.map(pedido => {
            const pedidoItems = pedido.items.map(item => {
                const producto = inventario.find(p => p.id === item.idProducto);
                return `
                    <div class="pedido-item-detalle">
                        <span>${producto ? producto.nombre : 'Producto no encontrado'} x ${item.cantidad}</span>
                        <span>$${item.total}</span>
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
                        <strong>Total: $${pedido.total}</strong>
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
        const busqueda = document.getElementById('busqueda-pedido')?.value.toLowerCase() || '';
        const desde = document.getElementById('fecha-desde')?.value || '';
        const hasta = document.getElementById('fecha-hasta')?.value || '';
        const estado = document.getElementById('estado-filtro')?.value || 'todos';

        const pedidosFiltrados = pedidos.filter(pedido => {
            const cumpleFecha = (!desde || new Date(pedido.fechaPedido) >= new Date(desde)) && 
                              (!hasta || new Date(pedido.fechaPedido) <= new Date(hasta));
            const cumpleEstado = estado === 'todos' || pedido.estadoPedido === estado;
            const cumpleBusqueda = pedido.idPedido.toLowerCase().includes(busqueda) ||
                                 pedido.items.some(item => {
                                     const producto = inventario.find(p => p.id === item.idProducto);
                                     return producto && producto.nombre.toLowerCase().includes(busqueda);
                                 });

            return cumpleFecha && cumpleEstado && cumpleBusqueda;
        });

        renderizarPedidos(pedidosFiltrados);
    }

    function configurarEventListeners() {
        document.getElementById('busqueda-pedido')?.addEventListener('input', filtrarPedidos);
        document.getElementById('fecha-desde')?.addEventListener('change', filtrarPedidos);
        document.getElementById('fecha-hasta')?.addEventListener('change', filtrarPedidos);
        document.getElementById('estado-filtro')?.addEventListener('change', filtrarPedidos);
        document.getElementById('btn-aplicar-filtros')?.addEventListener('click', filtrarPedidos);
    }

    function initPedidos() {
        console.log('Inicializando módulo de Pedidos');
        cargarDatosDesdeLocalStorage();
        renderizarPedidos();
        configurarEventListeners();
        
        window.addEventListener('datosGlobalesListo', sincronizarConDatosGlobales);
        
        if (window.datosGlobales) {
            sincronizarConDatosGlobales();
        }
        
        console.log('Módulo de Pedidos cargado completamente');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPedidos);
    } else {
        initPedidos();
    }

    window.addEventListener('load', renderizarPedidos);

    // Exponer funciones necesarias globalmente
    window.filtrarPedidos = filtrarPedidos;
})();

