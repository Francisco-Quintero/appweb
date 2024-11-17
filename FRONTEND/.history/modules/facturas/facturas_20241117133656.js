(function() {
    console.log('Iniciando carga del módulo de Facturas');

    let facturasState = {
        eventListeners: [],
        appStateRef: null
    };

    function addEventListenerWithCleanup(element, event, handler) {
        if (element) {
            element.addEventListener(event, handler);
            facturasState.eventListeners.push({ element, event, handler });
        }
    }

    function cleanup() {
        console.log('Limpiando módulo de Facturas');
        facturasState.eventListeners.forEach(({ element, event, handler }) => {
            if (element) {
                element.removeEventListener(event, handler);
            }
        });
        facturasState.eventListeners = [];
        window.procesarPago = undefined;
        facturasState.appStateRef = null;
    }

    function renderizarFacturas(appState) {
        const facturasContainer = document.getElementById('lista-facturas');
        const facturasEmpty = document.getElementById('facturas-empty');
        
        if (!facturasContainer || !facturasEmpty) {
            console.error('No se encontraron los elementos necesarios para renderizar facturas');
            return;
        }

        if (!appState.facturas || appState.facturas.length === 0) {
            facturasContainer.style.display = 'none';
            facturasEmpty.style.display = 'block';
            return;
        }

        facturasContainer.style.display = 'block';
        facturasEmpty.style.display = 'none';

        facturasContainer.innerHTML = appState.facturas.map(factura => {
            const pedido = appState.pedidos.find(p => p.idPedido === factura.idPedido);
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
                            <button class="btn-pagar" data-id-factura="${factura.idFactura}">
                                Pagar ahora
                            </button>
                        </div>
                    ` : ''}
                </div>
            `;
        }).join('');

        // Agregar event listeners a los botones de pago
        document.querySelectorAll('.btn-pagar').forEach(btn => {
            addEventListenerWithCleanup(btn, 'click', (e) => {
                const idFactura = e.target.getAttribute('data-id-factura');
                procesarPago(idFactura);
            });
        });
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
        const appState = facturasState.appStateRef;
        if (!appState) {
            console.error('Estado de la aplicación no disponible');
            return;
        }

        const factura = appState.facturas.find(f => f.idFactura === idFactura);
        if (!factura) return;

        if (factura.pago.metodoPago === 'pse') {
            alert('Redirigiendo a PSE...');
        } else {
            alert('El pago se realizará contra entrega');
        }

        factura.pago.estadoPago = 'procesando';
        renderizarFacturas(appState);
    }

    function filtrarFacturas() {
        const appState = facturasState.appStateRef;
        if (!appState) {
            console.error('Estado de la aplicación no disponible');
            return;
        }

        const estado = document.getElementById('filtro-estado')?.value || 'todos';
        const fecha = document.getElementById('filtro-fecha')?.value || '';

        if (!appState.facturas) return;

        const facturasFiltradas = appState.facturas.filter(factura => {
            const cumpleEstado = estado === 'todos' || factura.estadoFactura.toLowerCase() === estado;
            const cumpleFecha = !fecha || new Date(factura.fechaEmision).toLocaleDateString() === new Date(fecha).toLocaleDateString();

            return cumpleEstado && cumpleFecha;
        });

        renderizarFacturas({ ...appState, facturas: facturasFiltradas });
    }

    function configurarEventListeners() {
        addEventListenerWithCleanup(document.getElementById('filtro-estado'), 'change', filtrarFacturas);
        addEventListenerWithCleanup(document.getElementById('filtro-fecha'), 'change', filtrarFacturas);
        addEventListenerWithCleanup(document.getElementById('btn-aplicar-filtros'), 'click', filtrarFacturas);
    }

    function inicializarModuloFacturas(appState) {
        console.log('Inicializando módulo de Facturas');
        facturasState.appStateRef = appState;
        renderizarFacturas(appState);
        configurarEventListeners();
        window.procesarPago = procesarPago;
        return {
            cleanup: cleanup
        };
    }

    window.inicializarModuloFacturas = inicializarModuloFacturas;

    console.log('Módulo de Facturas cargado completamente');
})();