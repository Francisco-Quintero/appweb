// En /FRONTEND/modules/pedidos/pedidos.js

function initPedidos() {
    console.log('Módulo de pedidos cargado');
    renderizarPedidos();
    configurarEventListeners();
}

function renderizarPedidos() {
    const pedidosLista = document.getElementById('pedidos-lista');
    const pedidosEmpty = document.getElementById('pedidos-empty');
    
    if (!pedidosLista || !pedidosEmpty) {
        console.error('No se encontraron los elementos necesarios para renderizar pedidos');
        return;
    }
    
    if (!window.pedidos || window.pedidos.length === 0) {
        pedidosLista.style.display = 'none';
        pedidosEmpty.style.display = 'block';
        return;
    }

    pedidosLista.style.display = 'block';
    pedidosEmpty.style.display = 'none';
    
    pedidosLista.innerHTML = window.pedidos.map(pedido => {
        const pedidoItems = pedido.items.map(item => {
            const producto = window.inventario.find(p => p.id === item.idProducto);
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
    const busqueda = document.getElementById('busqueda-pedido')?.value.toLowerCase() || '';
    const desde = document.getElementById('fecha-desde')?.value || '';
    const hasta = document.getElementById('fecha-hasta')?.value || '';
    const estado = document.getElementById('estado-filtro')?.value || 'todos';

    if (!window.pedidos) return;

    const pedidosFiltrados = window.pedidos.filter(pedido => {
        const cumpleFecha = (!desde || new Date(pedido.fechaPedido) >= new Date(desde)) && 
                          (!hasta || new Date(pedido.fechaPedido) <= new Date(hasta));
        const cumpleEstado = estado === 'todos' || pedido.estadoPedido === estado;
        const cumpleBusqueda = pedido.idPedido.toLowerCase().includes(busqueda) ||
                             pedido.items.some(item => {
                                 const producto = window.inventario?.find(p => p.id === item.idProducto);
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

    const btnVerCategorias = document.querySelector('.btn-ver-categorias');
    btnVerCategorias?.addEventListener('click', () => {
        window.cambiarModulo('catalogo');
    });
}

// Asegurarse de que las variables globales estén inicializadas
window.pedidos = window.pedidos || [];
window.inventario = window.inventario || [];

// Hacer públicas las funciones necesarias
window.renderizarPedidos = renderizarPedidos;
window.initPedidos = initPedidos;
window.filtrarPedidos = filtrarPedidos;

// Inicializar el módulo
initPedidos();