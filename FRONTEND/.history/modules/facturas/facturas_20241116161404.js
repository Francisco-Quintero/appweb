// En modules/facturas/facturas.js

function initFacturas() {
    console.log('Módulo de facturas cargado');
    renderizarFacturas();
    configurarEventListeners();
}

function renderizarFacturas() {
    const facturasContainer = document.getElementById('lista-facturas');
    const facturasEmpty = document.getElementById('facturas-empty');
    
    if (!facturasContainer || !facturasEmpty) {
        console.error('No se encontraron los elementos necesarios para renderizar facturas');
        return;
    }

    if (!window.facturas || window.facturas.length === 0) {
        facturasContainer.style.display = 'none';
        facturasEmpty.style.display = 'block';
        return;
    }

    facturasContainer.style.display = 'block';
    facturasEmpty.style.display = 'none';

    facturasContainer.innerHTML = window.facturas.map(factura => {
        const pedido = window.pedidos.find(p => p.idPedido === factura.idPedido);
        if (!pedido) return '';
        
        return `
            <div class="factura-item">
                <div class="factura-header">
                    <div class="factura-info">
                        <h3>Factura #${factura.idFactura}</h3>
                        <span class="factura-fecha">
                            ${formatearFecha(factura.fechaEmision)}
                        </span>
                    </div>
                    <div class="factura-estado ${factura.estadoFactura.toLowerCase()}">
                        ${factura.estadoFactura.toUpperCase()}
                    </div>
                </div>
                <div class="factura-detalles">
                    <div class="factura-pedido">
                        <strong>Pedido:</strong> ${pedido.idPedido}
                        <span class="estado-pedido ${pedido.estadoPedido.toLowerCase()}">
                            ${pedido.estadoPedido.toUpperCase()}
                        </span>
                    </div>
                    <div class="factura-pago">
                        <strong>Método de pago:</strong> ${factura.pago.metodoPago}
                        <span class="estado-pago ${factura.pago.estadoPago.toLowerCase()}">
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

function procesarPago(idFactura) {
    const factura = window.facturas.find(f => f.idFactura === idFactura);
    if (!factura) return;

    if (factura.pago.metodoPago === 'pse') {
        alert('Redirigiendo a PSE...');
    } else {
        alert('El pago se realizará contra entrega');
    }

    factura.pago.estadoPago = 'procesando';
    renderizarFacturas();
}

function filtrarFacturas() {
    const estado = document.getElementById('filtro-estado')?.value || 'todos';
    const fecha = document.getElementById('filtro-fecha')?.value || '';

    if (!window.facturas) return;

    const facturasFiltradas = window.facturas.filter(factura => {
        const cumpleEstado = estado === 'todos' || factura.estadoFactura.toLowerCase() === estado;
        const cumpleFecha = !fecha || new Date(factura.fechaEmision).toLocaleDateString() === new Date(fecha).toLocaleDateString();

        return cumpleEstado && cumpleFecha;
    });

    renderizarFacturas(facturasFiltradas);
}

function configurarEventListeners() {
    document.getElementById('filtro-estado')?.addEventListener('change', filtrarFacturas);
    document.getElementById('filtro-fecha')?.addEventListener('change', filtrarFacturas);
    document.getElementById('btn-aplicar-filtros')?.addEventListener('click', filtrarFacturas);
}

// Hacer públicas las funciones necesarias
window.renderizarFacturas = renderizarFacturas;
window.procesarPago = procesarPago;
window.initFacturas = initFacturas;

// Inicializar el módulo
initFacturas();