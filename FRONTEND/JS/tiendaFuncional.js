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

// Actualizar la función actualizarTotales
function actualizarTotales() {
    const subtotal = calcularSubtotal();
    const costoEnvio = carrito.length > 0 ? 2000 : 0;
    const total = subtotal + costoEnvio;
    
    $('subtotal').textContent = `$${subtotal.toLocaleString()}`;
    $('costo-envio').textContent = `$${costoEnvio.toLocaleString()}`;
    $('total').textContent = `$${total.toLocaleString()}`;
}