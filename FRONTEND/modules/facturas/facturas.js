(function() {
    console.log('Iniciando carga del módulo de Facturas');

    let facturas = [];
    let pedidos = [];

    function cargarDatosDesdeLocalStorage() {
        try {
            const datosGuardados = JSON.parse(localStorage.getItem('datosGlobales') || '{}');
            facturas = datosGuardados.facturas || [];
            pedidos = datosGuardados.pedidos || [];
            console.log('Datos de facturas cargados desde localStorage');
        } catch (error) {
            console.error('Error al cargar datos de facturas desde localStorage:', error);
        }
    }

    function guardarEnLocalStorage() {
        try {
            const datosActuales = JSON.parse(localStorage.getItem('datosGlobales') || '{}');
            datosActuales.facturas = facturas;
            datosActuales.pedidos = pedidos;
            localStorage.setItem('datosGlobales', JSON.stringify(datosActuales));
            console.log('Datos de facturas guardados en localStorage');
        } catch (error) {
            console.error('Error al guardar datos de facturas en localStorage:', error);
        }
    }

    function sincronizarConDatosGlobales() {
        if (window.datosGlobales) {
            facturas = Array.isArray(window.datosGlobales.facturas) ? window.datosGlobales.facturas : [];
            pedidos = Array.isArray(window.datosGlobales.pedidos) ? window.datosGlobales.pedidos : [];
            renderizarFacturas();
            console.log('Datos de facturas sincronizados con datosGlobales');
        }
    }

    function renderizarFacturas(facturasFiltradas = null) {
        const facturasContainer = document.getElementById('lista-facturas');
        const facturasEmpty = document.getElementById('facturas-empty');
        
        if (!facturasContainer || !facturasEmpty) {
            console.error('No se encontraron los elementos necesarios para renderizar facturas');
            return;
        }

        const facturasAMostrar = facturasFiltradas || facturas;

        if (facturasAMostrar.length === 0) {
            facturasContainer.style.display = 'none';
            facturasEmpty.style.display = 'block';
            return;
        }

        facturasContainer.style.display = 'block';
        facturasEmpty.style.display = 'none';

        facturasContainer.innerHTML = facturasAMostrar.map(factura => {
            const pedido = pedidos.find(p => p.idPedido === factura.idPedido);
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
                            <div>Subtotal: $${factura.subtotal}</div>
                            <div>IVA (19%): $${factura.impuestos}</div>
                            <div>Envío: $${pedido.costoEnvio}</div>
                            <div class="factura-total">
                                Total: $${factura.total}
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
            btn.addEventListener('click', (e) => {
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

    async function procesarPago(idFactura) {
        const factura = facturas.find(f => f.idFactura === idFactura);
        if (!factura) return;

        if (factura.pago.metodoPago === 'transferencia') {
            try {
                const response = await fetch('https://api.ejemplo.com/pse', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        idFactura: factura.idFactura,
                        monto: factura.total,
                        // Otros datos necesarios para PSE
                    }),
                });

                if (response.ok) {
                    const result = await response.json();
                    // Redirigir al usuario a la página de pago de PSE
                    window.location.href = result.urlPago;
                } else {
                    throw new Error('Error en la respuesta del servidor');
                }
            } catch (error) {
                console.error('Error al procesar el pago por PSE:', error);
                alert('Hubo un error al procesar el pago. Por favor, intente nuevamente.');
            }
        } else if (factura.pago.metodoPago === 'efectivo') {
            alert('El pago se realizará contra entrega en efectivo');
        }

        factura.pago.estadoPago = 'procesando';
        guardarEnLocalStorage();
        renderizarFacturas();
    }

    function filtrarFacturas() {
        const estado = document.getElementById('filtro-estado')?.value || 'todos';
        const fecha = document.getElementById('filtro-fecha')?.value || '';

        const facturasFiltradas = facturas.filter(factura => {
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

    function initFacturas() {
        console.log('Inicializando módulo de Facturas');
        cargarDatosDesdeLocalStorage();
        renderizarFacturas();
        configurarEventListeners();
        
        window.addEventListener('datosGlobalesListo', sincronizarConDatosGlobales);
        
        if (window.datosGlobales) {
            sincronizarConDatosGlobales();
        }
        
        console.log('Módulo de Facturas cargado completamente');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initFacturas);
    } else {
        initFacturas();
    }

    window.addEventListener('load', renderizarFacturas);

    // Exponer funciones necesarias globalmente
    window.procesarPago = procesarPago;
    window.filtrarFacturas = filtrarFacturas;
})();