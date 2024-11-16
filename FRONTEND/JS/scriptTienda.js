// Inicializar los iconos de Lucide
lucide.createIcons();

// Agregar estas variables globales
let pedidos = [];
let facturas = [];

// Función para generar un pedido
function generarPedido() {
    if (carrito.length === 0) {
        alert('El carrito está vacío');
        return;
    }

    const metodoPago = document.querySelector('input[name="metodoPago"]:checked').value;
    const costoEnvio = 2000; // Valor fijo para este ejemplo
    const subtotal = calcularSubtotal();
    const total = subtotal + costoEnvio;

    const pedido = {
        idPedido: generarIdUnico(),
        fechaPedido: new Date(),
        estadoPedido: 'en espera',
        horaCreacion: new Date(),
        costoEnvio: costoEnvio,
        items: carrito.map(item => ({
            idProducto: item.id,
            cantidad: item.cantidad,
            precioUnitario: item.precio,
            total: item.precio * item.cantidad,
            descuento: 0
        })),
        subtotal: subtotal,
        total: total
    };

    const factura = {
        idFactura: generarIdUnico(),
        fechaEmision: new Date(),
        idPedido: pedido.idPedido,
        subtotal: subtotal,
        impuestos: calcularImpuestos(subtotal),
        total: total,
        estadoFactura: 'pendiente',
        pago: {
            idPago: generarIdUnico(),
            metodoPago: metodoPago,
            estadoPago: metodoPago === 'contraentrega' ? 'pendiente' : 'procesando',
            monto: total,
            fechaPago: null
        }
    };

    pedidos.push(pedido);
    facturas.push(factura);

    // Limpiar el carrito
    carrito = [];
    renderizarCarrito();
    actualizarTotales();

    // Redirigir a la pestaña de facturas
    document.querySelector('[data-tab="facturas"]').click();
    
    // Renderizar la nueva factura
    renderizarFacturas();
}

// Función para calcular subtotal
function calcularSubtotal() {
    return carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
}

// Función para calcular impuestos (19% IVA)
function calcularImpuestos(subtotal) {
    return subtotal * 0.19;
}

// Función para generar ID único
function generarIdUnico() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Actualizar los datos simulados en el inventario
// Opción 1: Usar URLs de imágenes base64 (funcionará sin necesidad de archivos externos)
let inventario = [
    {
        id: 1,
        nombre: 'Zanahoria Primera',
        marca: 'Sin Marca',
        precio: 4990,
        precioGramo: 4.99,
        stock: 100,
        imagen: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNFNUU3RUIiLz48L3N2Zz4='
    },
    {
        id: 2,
        nombre: 'Cebolla Cabezona Roja',
        marca: 'Sin Marca',
        precio: 4800,
        precioGramo: 4.8,
        stock: 50,
        imagen: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNFNUU3RUIiLz48L3N2Zz4='
    }
];


let carrito = [];
let usuario = null;


// Funciones de utilidad
function $(id) {
    return document.getElementById(id);
}

function crearElemento(tag, className, textContent) {
    const elem = document.createElement(tag);
    if (className) elem.className = className;
    if (textContent) elem.textContent = textContent;
    return elem;
}

// Manejo de pestañas
document.querySelectorAll('.tab-button').forEach(button => {
    button.addEventListener('click', () => {
        document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        button.classList.add('active');
        $(button.dataset.tab).classList.add('active');

        if (button.dataset.tab === 'pedidos') {
            renderizarPedidos();
        }
    });
});


// Actualizar la función de renderizar catálogo
function renderizarCatalogo() {
    const catalogoContainer = $('catalogo-productos');
    catalogoContainer.innerHTML = '';
    
    inventario.forEach(producto => {
        const productoCard = crearElemento('div', 'producto-card');
        const cantidadEnCarrito = obtenerCantidadEnCarrito(producto.id);
        
        productoCard.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}" class="producto-imagen">
            <div class="producto-header">
                <div>
                    <div class="producto-marca">${producto.marca}</div>
                    <div class="producto-nombre">${producto.nombre}</div>
                </div>
                <button class="producto-favorito">
                    <i data-lucide="heart"></i>
                </button>
            </div>
            <div class="producto-precio-gramo">Gramo a $${producto.precioGramo}</div>
            <div class="producto-precio">$${producto.precio.toLocaleString()}</div>
            ${cantidadEnCarrito > 0 ? `
                <div class="producto-cantidad">
                    <button class="btn-cantidad" onclick="actualizarCantidadDesdeProducto(${producto.id}, 'restar')">-</button>
                    <input type="number" value="${cantidadEnCarrito}" 
                           class="input-cantidad" 
                           onchange="actualizarCantidadDirectaDesdeProducto(${producto.id}, this.value)">
                    <button class="btn-cantidad" onclick="actualizarCantidadDesdeProducto(${producto.id}, 'sumar')">+</button>
                </div>
            ` : `
                <button class="btn-agregar" onclick="agregarAlCarrito(${producto.id})">
                    Agregar
                </button>
            `}
        `;
        catalogoContainer.appendChild(productoCard);
    });
    
    // Reinicializar los iconos de Lucide
    lucide.createIcons();
}
// Función para actualizar la cantidad desde el producto en el catálogo
function actualizarCantidadDesdeProducto(productoId, operacion) {
    actualizarCantidad(productoId, operacion);
    renderizarCatalogo();
}

// Función para actualizar la cantidad directamente desde el producto en el catálogo
function actualizarCantidadDirectaDesdeProducto(productoId, nuevaCantidad) {
    actualizarCantidadDirecta(productoId, nuevaCantidad);
    renderizarCatalogo();
}

function obtenerCantidadEnCarrito(productoId) {
    const item = carrito.find(item => item.id === productoId);
    return item ? item.cantidad : 0;
}
// Actualizar la función de actualizar cantidad
function actualizarCantidad(productoId, operacion) {
    const itemIndex = carrito.findIndex(item => item.id === productoId);
    if (itemIndex !== -1) {
        if (operacion === 'sumar') {
            carrito[itemIndex].cantidad++;
        } else if (operacion === 'restar') {
            if (carrito[itemIndex].cantidad > 1) {
                carrito[itemIndex].cantidad--;
            } else {
                carrito.splice(itemIndex, 1);
            }
        }
        renderizarCatalogo();
        renderizarCarrito();
        actualizarTotales();
    }
}

// Actualizar la función de actualizar cantidad directa
function actualizarCantidadDirecta(productoId, nuevaCantidad) {
    nuevaCantidad = parseInt(nuevaCantidad);
    if (isNaN(nuevaCantidad) || nuevaCantidad < 0) nuevaCantidad = 0;
    
    if (nuevaCantidad === 0) {
        carrito = carrito.filter(item => item.id !== productoId);
    } else {
        const itemIndex = carrito.findIndex(item => item.id === productoId);
        if (itemIndex !== -1) {
            carrito[itemIndex].cantidad = nuevaCantidad;
        } else {
            const producto = inventario.find(p => p.id === productoId);
            if (producto) {
                carrito.push({...producto, cantidad: nuevaCantidad});
            }
        }
    }
    renderizarCatalogo();
    renderizarCarrito();
    actualizarTotales();
}

// Actualizar la función de eliminar del carrito
function eliminarDelCarrito(productoId) {
    carrito = carrito.filter(item => item.id !== productoId);
    renderizarCatalogo();
    renderizarCarrito();
    actualizarTotales();
}

// Asegúrate de llamar a renderizarCatalogo cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    renderizarCatalogo();
    renderizarCarrito();
    actualizarTotales();
});

function renderizarCarrito() {
    const carritoContainer = $('carrito-items');
    const contadorElement = $('carrito-contador');
    const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    
    contadorElement.textContent = `${totalItems} items agregados`;
    
    carritoContainer.innerHTML = '';
    
    if (carrito.length === 0) {
        carritoContainer.innerHTML = `
            <div class="carrito-vacio">
                <p>Tu carrito está vacío</p>
            </div>
        `;
        return;
    }
    
    carrito.forEach(item => {
        const itemElem = crearElemento('div', 'carrito-item');
        const subtotalItem = item.precio * item.cantidad;
        
        itemElem.innerHTML = `
            <img src="${item.imagen}" alt="${item.nombre}" class="carrito-item-imagen">
            <div class="carrito-item-detalles">
                <div class="carrito-item-nombre">${item.nombre}</div>
                <div class="carrito-item-precio">$${subtotalItem.toLocaleString()}</div>
                <div class="carrito-item-precio-unitario">
                    ${item.precioGramo ? `Gramo a $${item.precioGramo}` : ''}
                </div>
            </div>
            <div class="carrito-item-controles">
                <button class="btn-cantidad" onclick="actualizarCantidad(${item.id}, 'restar')">-</button>
                <input type="number" value="${item.cantidad}" 
                       class="input-cantidad" 
                       onchange="actualizarCantidadDirecta(${item.id}, this.value)">
                <button class="btn-cantidad" onclick="actualizarCantidad(${item.id}, 'sumar')">+</button>
            </div>
            <button class="btn-eliminar" onclick="eliminarDelCarrito(${item.id})">
                <i data-lucide="trash-2"></i>
            </button>
        `;
        carritoContainer.appendChild(itemElem);
    });
    
    // Reinicializar los iconos de Lucide
    lucide.createIcons();
}

function actualizarTotales() {
    const subtotal = calcularSubtotal();
    const costoEnvio = carrito.length > 0 ? 2000 : 0;
    const total = subtotal + costoEnvio;
    
    $('subtotal').textContent = `$${subtotal.toLocaleString()}`;
    $('costo-envio').textContent = `$${costoEnvio.toLocaleString()}`;
    $('total').textContent = `$${total.toLocaleString()}`;
}

function irAPagar() {
    if (carrito.length === 0) {
        alert('Tu carrito está vacío');
        return;
    }
    // Aquí iría la lógica para proceder al pago
    alert('Procediendo al pago...');
}




// Actualizar la función de agregar al carrito
function agregarAlCarrito(productoId) {
    const producto = inventario.find(p => p.id === productoId);
    if (producto) {
        const itemExistente = carrito.find(item => item.id === productoId);
        if (itemExistente) {
            itemExistente.cantidad++;
        } else {
            carrito.push({...producto, cantidad: 1});
        }
        renderizarCatalogo();
        renderizarCarrito();
        actualizarTotales();
    }
}

// Registrar usuario
function registrarUsuario() {
    const nombre = $('nombre-usuario').value;
    const email = $('email-usuario').value;
    if (nombre && email) {
        usuario = { nombre, email };
        alert(`Usuario ${nombre} registrado con éxito!`);
    } else {
        alert('Por favor, completa todos los campos.');
    }
}

// Procesar pago
function procesarPago(metodo) {
    if (carrito.length === 0) {
        alert('El carrito está vacío.');
        return;
    }
    const nuevaFactura = {
        id: facturas.length + 1,
        items: [...carrito],
        total: carrito.reduce((sum, item) => sum + item.precio, 0),
        metodo
    };
    facturas.push(nuevaFactura);
    carrito = [];
    renderizarCarrito();
    renderizarFacturas();
    alert(`Pago procesado con éxito. Método: ${metodo}`);
}

// Renderizar facturas
// Actualizar la función de renderizar facturas
function renderizarFacturas() {
    const facturasContainer = $('lista-facturas');
    facturasContainer.innerHTML = '';

    if (facturas.length === 0) {
        facturasContainer.innerHTML = `
            <div class="facturas-vacio">
                <p>No hay facturas disponibles</p>
            </div>
        `;
        return;
    }

    facturas.forEach(factura => {
        const facturaElem = crearElemento('div', 'factura-item');
        const pedido = pedidos.find(p => p.idPedido === factura.idPedido);
        
        facturaElem.innerHTML = `
            <div class="factura-header">
                <div class="factura-info">
                    <h3>Factura #${factura.idFactura}</h3>
                    <span class="factura-fecha">
                        ${new Date(factura.fechaEmision).toLocaleDateString()}
                    </span>
                </div>
                <div class="factura-estado ${factura.estadoFactura}">
                    ${factura.estadoFactura.toUpperCase()}
                </div>
            </div>
            <div class="factura-detalles">
                <div class="factura-pedido">
                    <strong>Pedido:</strong> ${pedido.idPedido}
                    <span class="estado-pedido ${pedido.estadoPedido}">
                        ${pedido.estadoPedido.toUpperCase()}
                    </span>
                </div>
                <div class="factura-pago">
                    <strong>Método de pago:</strong> ${factura.pago.metodoPago}
                    <span class="estado-pago ${factura.pago.estadoPago}">
                        ${factura.pago.estadoPago.toUpperCase()}
                    </span>
                </div>
                <div class="factura-montos">
                    <div>Subtotal: $${factura.subtotal.toLocaleString()}</div>
                    <div>IVA (19%): $${factura.impuestos.toLocaleString()}</div>
                    <div>Envío: $${pedido.costoEnvio.toLocaleString()}</div>
                    <div class="factura-total">
                        Total: $${factura.total.toLocaleString()}
                    </div>
                </div>
            </div>
            ${factura.pago.estadoPago === 'pendiente' ? `
                <div class="factura-acciones">
                    <button class="btn-pagar" onclick="procesarPago('${factura.idFactura}')">
                        Pagar ahora
                    </button>
                </div>
            ` : ''}
        `;
        
        facturasContainer.appendChild(facturaElem);
    });
}

// Función para procesar el pago
function procesarPago(idFactura) {
    const factura = facturas.find(f => f.idFactura === idFactura);
    if (!factura) return;

    if (factura.pago.metodoPago === 'pse') {
        // Aquí iría la integración con PSE
        alert('Redirigiendo a PSE...');
    } else {
        alert('El pago se realizará contra entrega');
    }

    factura.pago.estadoPago = 'procesando';
    renderizarFacturas();
}
function renderizarPedidos() {
    const pedidosLista = $('pedidos-lista');
    const pedidosEmpty = $('pedidos-empty');
    
    if (pedidos.length === 0) {
        pedidosLista.style.display = 'none';
        pedidosEmpty.style.display = 'block';
    } else {
        pedidosLista.style.display = 'block';
        pedidosEmpty.style.display = 'none';
        
        pedidosLista.innerHTML = pedidos.map(pedido => `
            <div class="pedido-item">
                <div class="pedido-header">
                    <span class="pedido-numero">Pedido ${pedido.idPedido}</span>
                    <span class="pedido-fecha">${formatearFecha(pedido.fechaPedido)}</span>
                    <span class="pedido-estado estado-${pedido.estadoPedido}">${
                        pedido.estadoPedido.charAt(0).toUpperCase() + pedido.estadoPedido.slice(1)
                    }</span>
                </div>
                <div class="pedido-items">
                    ${pedido.items.map(item => `
                        <div class="pedido-item-detalle">
                            <span>${inventario.find(p => p.id === item.idProducto).nombre} x ${item.cantidad}</span>
                            <span>$${item.total.toLocaleString()}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="pedido-total">
                    <strong>Total: $${pedido.total.toLocaleString()}</strong>
                </div>
            </div>
        `).join('');
    }
}
function formatearFecha(fecha) {
    return new Date(fecha).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Filtrar pedidos
function filtrarPedidos() {
    const busqueda = $('busqueda-pedido').value.toLowerCase();
    const desde = $('fecha-desde').value;
    const hasta = $('fecha-hasta').value;
    const estado = $('estado-filtro').value;

    const pedidosFiltrados = pedidos.filter(pedido => {
        const cumpleFecha = (!desde || pedido.fecha >= desde) && 
                          (!hasta || pedido.fecha <= hasta);
        const cumpleEstado = estado === 'todos' || pedido.estado === estado;
        const cumpleBusqueda = pedido.numero.toLowerCase().includes(busqueda) ||
                             pedido.items.some(item => 
                                 item.nombre.toLowerCase().includes(busqueda)
                             );

        return cumpleFecha && cumpleEstado && cumpleBusqueda;
    });

    renderizarPedidos(pedidosFiltrados);
}

// Eventos para los filtros
$('busqueda-pedido').addEventListener('input', filtrarPedidos);
$('fecha-desde').addEventListener('change', filtrarPedidos);
$('fecha-hasta').addEventListener('change', filtrarPedidos);
$('estado-filtro').addEventListener('change', filtrarPedidos);

// Evento para el botón "Ver categorías"
$('pedidos').querySelector('.btn-ver-categorias').addEventListener('click', () => {
    document.querySelector('[data-tab="catalogo"]').click();
});

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    renderizarCatalogo();
    renderizarCarrito();
    renderizarFacturas();
    renderizarPedidos();
    actualizarTotales();
});

