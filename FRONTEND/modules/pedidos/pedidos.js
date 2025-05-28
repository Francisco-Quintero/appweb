// import { API_URL } from "../../JS/estadoGlobal";// Cambia esto por la URL de tu API

export async function initPedidos(estadoGlobal) {
    console.log('Inicializando módulo de Pedidos...');

    // Verificar si los pedidos ya están en el estado global
    if (estadoGlobal.pedidos.length === 0) {
        console.log('Cargando datos de pedidos desde la API...');
        try {
            const pedidos = await cargarDatosDesdeAPI();
            estadoGlobal.pedidos = pedidos;
        } catch (error) {
            console.error('Error al cargar los datos de pedidos:', error);
            return; // Detener la inicialización si ocurre un error
        }
    } else {
        console.log('Usando datos de pedidos almacenados en el estado global');
    }

    // Renderizar los pedidos
    renderizarPedidos(estadoGlobal);

    // Configurar eventos del módulo
    configurarEventListeners(estadoGlobal);

    console.log('Módulo de Pedidos cargado completamente');
}

// Cargar datos de pedidos desde la API
async function cargarDatosDesdeAPI() {
    try {
        const response = await fetch(`${API_URL}/pedidos`);
        if (!response.ok) {
            throw new Error(`Error al obtener datos: ${response.statusText}`);
        }
        const pedidos = await response.json();
        console.log('Datos de pedidos cargados desde la API:', pedidos);
        return pedidos;
    } catch (error) {
        console.error('Error al cargar datos desde la API:', error);
        throw error;
    }
}

function renderizarPedidos(estadoGlobal, pedidosFiltrados = null) {
    const pedidosLista = document.getElementById('pedidos-lista');
    const pedidosEmpty = document.getElementById('pedidos-empty');

    if (!pedidosLista || !pedidosEmpty) {
        console.error('No se encontraron los elementos necesarios para renderizar pedidos');
        return;
    }

    const pedidosAMostrar = pedidosFiltrados || estadoGlobal.pedidos;

    if (pedidosAMostrar.length === 0) {
        pedidosLista.style.display = 'none';
        pedidosEmpty.style.display = 'block';
        return;
    }

    pedidosLista.style.display = 'block';
    pedidosEmpty.style.display = 'none';

    pedidosLista.innerHTML = pedidosAMostrar.map(pedido => {
        // Renderizar los detalles del pedido
        const pedidoItems = pedido.detalles.map(detalle => {
            const producto = detalle.producto;
            return `
                <div class="pedido-item-detalle">
                    <span>${producto ? producto.nombre : 'Producto no encontrado'} x ${detalle.cantidad}</span>
                    <span>Descuento: ${detalle.descuento || 0}%</span>
                    <span>Precio unitario: $${producto ? producto.precioUnitario : 0}</span>
                </div>
            `;
        }).join('');

        // Renderizar el pedido completo
        return `
            <div class="pedido-item">
                <div class="pedido-header">
                    <span class="pedido-numero">Pedido ${pedido.idPedido}</span>
                    <span class="pedido-fecha">${formatearFecha(pedido.fechaPedido)}</span>
                    <span class="pedido-estado estado-${pedido.estadoPedido.replace(' ', '-')}">
                        ${pedido.estadoPedido.toUpperCase()}
                    </span>
                </div>
                <div class="pedido-cliente">
                    <strong>Cliente:</strong> ${pedido.usuario.nombre} ${pedido.usuario.apellido}
                    <br>
                    <strong>Dirección:</strong> ${pedido.usuario.direccion}
                    <br>
                    <strong>Correo:</strong> ${pedido.usuario.correo}
                </div>
                <div class="pedido-items">
                    ${pedidoItems}
                </div>
                <div class="pedido-total">
                    <strong>Costo de envío:</strong> $${pedido.costoEnvio}
                    <br>
                    <strong>Total:</strong> $${calcularTotalPedido(pedido)}
                </div>
            </div>
        `;
    }).join('');
}

function calcularTotalPedido(pedido) {
    return pedido.detalles.reduce((total, detalle) => {
        const producto = detalle.producto;
        const precioUnitario = producto ? producto.precioUnitario : 0;
        const descuento = detalle.descuento || 0;
        const precioConDescuento = precioUnitario * (1 - descuento / 100);
        return total + precioConDescuento * detalle.cantidad;
    }, pedido.costoEnvio || 0); // Incluye el costo de envío
}

// Formatear fecha
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

// Filtrar pedidos
function filtrarPedidos(estadoGlobal) {
    const busqueda = document.getElementById('busqueda-pedido')?.value.toLowerCase() || '';
    const desde = document.getElementById('fecha-desde')?.value || '';
    const hasta = document.getElementById('fecha-hasta')?.value || '';
    const estado = document.getElementById('estado-filtro')?.value || 'todos';

    const pedidosFiltrados = estadoGlobal.pedidos.filter(pedido => {
        const cumpleFecha = (!desde || new Date(pedido.fechaPedido) >= new Date(desde)) &&
            (!hasta || new Date(pedido.fechaPedido) <= new Date(hasta));
        const cumpleEstado = estado === 'todos' || pedido.estadoPedido === estado;
        const cumpleBusqueda = pedido.idPedido.toLowerCase().includes(busqueda) ||
            pedido.items.some(item => {
                const producto = estadoGlobal.inventario.find(p => p.idProducto === item.idProducto);
                return producto && producto.nombre.toLowerCase().includes(busqueda);
            });

        return cumpleFecha && cumpleEstado && cumpleBusqueda;
    });

    renderizarPedidos(estadoGlobal, pedidosFiltrados);
}

// Configurar eventos del módulo
function configurarEventListeners(estadoGlobal) {
    document.getElementById('busqueda-pedido')?.addEventListener('input', () => filtrarPedidos(estadoGlobal));
    document.getElementById('fecha-desde')?.addEventListener('change', () => filtrarPedidos(estadoGlobal));
    document.getElementById('fecha-hasta')?.addEventListener('change', () => filtrarPedidos(estadoGlobal));
    document.getElementById('estado-filtro')?.addEventListener('change', () => filtrarPedidos(estadoGlobal));
    document.getElementById('btn-aplicar-filtros')?.addEventListener('click', () => filtrarPedidos(estadoGlobal));
}