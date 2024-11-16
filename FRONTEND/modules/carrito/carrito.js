// En /FRONTEND/modules/carrito/carrito.js

function initCarrito() {
    console.log('Módulo de carrito cargado');
    renderizarCarrito();
    actualizarTotales();
}

function renderizarCarrito() {
    const carritoContainer = document.getElementById('carrito-items');
    carritoContainer.innerHTML = '';
    
    if (window.carrito.length === 0) {
        carritoContainer.innerHTML = `
            <div class="carrito-vacio">
                <p>Tu carrito está vacío</p>
            </div>
        `;
        return;
    }
    
    window.carrito.forEach(item => {
        const itemElem = document.createElement('div');
        itemElem.className = 'carrito-item';
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
                <button class="btn-cantidad" onclick="actualizarCantidad(${item.id}, 'restar')" aria-label="Disminuir cantidad">-</button>
                <input type="number" value="${item.cantidad}" 
                       class="input-cantidad" 
                       onchange="actualizarCantidadDirecta(${item.id}, this.value)"
                       aria-label="Cantidad del producto">
                <button class="btn-cantidad" onclick="actualizarCantidad(${item.id}, 'sumar')" aria-label="Aumentar cantidad">+</button>
            </div>
            <button class="btn-eliminar" onclick="eliminarDelCarrito(${item.id})" aria-label="Eliminar del carrito">
                <i data-lucide="trash-2"></i>
            </button>
        `;
        carritoContainer.appendChild(itemElem);
    });
    
    // Reinicializar los iconos de Lucide
    lucide.createIcons();
}

function actualizarCantidad(productoId, operacion) {
    const itemIndex = window.carrito.findIndex(item => item.id === productoId);
    if (itemIndex !== -1) {
        if (operacion === 'sumar') {
            window.carrito[itemIndex].cantidad++;
        } else if (operacion === 'restar') {
            if (window.carrito[itemIndex].cantidad > 1) {
                window.carrito[itemIndex].cantidad--;
            } else {
                window.carrito.splice(itemIndex, 1);
            }
        }
        renderizarCarrito();
        actualizarTotales();
    }
}

function actualizarCantidadDirecta(productoId, nuevaCantidad) {
    nuevaCantidad = parseInt(nuevaCantidad);
    if (isNaN(nuevaCantidad) || nuevaCantidad < 0) nuevaCantidad = 0;
    
    if (nuevaCantidad === 0) {
        window.carrito = window.carrito.filter(item => item.id !== productoId);
    } else {
        const itemIndex = window.carrito.findIndex(item => item.id === productoId);
        if (itemIndex !== -1) {
            window.carrito[itemIndex].cantidad = nuevaCantidad;
        }
    }
    renderizarCarrito();
    actualizarTotales();
}

function eliminarDelCarrito(productoId) {
    window.carrito = window.carrito.filter(item => item.id !== productoId);
    renderizarCarrito();
    actualizarTotales();
}

function actualizarTotales() {
    const subtotal = window.calcularSubtotal();
    const costoEnvio = window.carrito.length > 0 ? 2000 : 0;
    const total = subtotal + costoEnvio;
    
    document.getElementById('subtotal').textContent = `$${subtotal.toLocaleString()}`;
    document.getElementById('costo-envio').textContent = `$${costoEnvio.toLocaleString()}`;
    document.getElementById('total').textContent = `$${total.toLocaleString()}`;
}

function generarPedido() {
    if (window.carrito.length === 0) {
        alert('El carrito está vacío');
        return;
    }

    const metodoPago = document.querySelector('input[name="metodoPago"]:checked').value;
    const costoEnvio = 2000; // Valor fijo para este ejemplo
    const subtotal = window.calcularSubtotal();
    const total = subtotal + costoEnvio;

    const pedido = {
        idPedido: window.generarIdUnico(),
        fechaPedido: new Date(),
        estadoPedido: 'en espera',
        horaCreacion: new Date(),
        costoEnvio: costoEnvio,
        items: window.carrito.map(item => ({
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
        idFactura: window.generarIdUnico(),
        fechaEmision: new Date(),
        idPedido: pedido.idPedido,
        subtotal: subtotal,
        impuestos: window.calcularImpuestos(subtotal),
        total: total,
        estadoFactura: 'pendiente',
        pago: {
            idPago: window.generarIdUnico(),
            metodoPago: metodoPago,
            estadoPago: metodoPago === 'contraentrega' ? 'pendiente' : 'procesando',
            monto: total,
            fechaPago: null
        }
    };

    window.pedidos.push(pedido);
    window.facturas.push(factura);

    // Limpiar el carrito
    window.carrito = [];
    renderizarCarrito();
    actualizarTotales();

    alert('Pedido generado con éxito. ID del pedido: ' + pedido.idPedido);
    // Aquí podrías redirigir a la pestaña de facturas o mostrar un resumen del pedido
}

// Asegúrate de que estas funciones estén disponibles globalmente
window.actualizarCantidad = actualizarCantidad;
window.actualizarCantidadDirecta = actualizarCantidadDirecta;
window.eliminarDelCarrito = eliminarDelCarrito;
window.generarPedido = generarPedido;

// Inicializar el módulo
initCarrito();