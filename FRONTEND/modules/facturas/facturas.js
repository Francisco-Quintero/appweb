export async function initFacturas(estadoGlobal) {
    console.log('Inicializando módulo de Facturas...');

    // Verificar si las facturas ya están en el estado global
    if (estadoGlobal.facturas.length === 0) {
        console.log('Cargando datos de facturas desde la API...');
        try {
            const facturas = await cargarDatosDesdeAPI();
            estadoGlobal.facturas = facturas;
        } catch (error) {
            console.error('Error al cargar los datos de facturas:', error);
            return; // Detener la inicialización si ocurre un error
        }
    } else {
        console.log('Usando datos de facturas almacenados en el estado global');
    }

    // Renderizar las facturas
    renderizarFacturas(estadoGlobal);

    // Configurar eventos del módulo
    configurarEventListeners(estadoGlobal);

    console.log('Módulo de Facturas cargado completamente');
}

// Cargar datos de facturas desde la API
async function cargarDatosDesdeAPI() {
    try {
        const response = await fetch('http://localhost:26209/api/pagos');
        if (!response.ok) {
            throw new Error(`Error al obtener datos: ${response.statusText}`);
        }
        const facturas = await response.json();
        console.log('Datos de facturas cargados desde la API:', facturas);
        return facturas;
    } catch (error) {
        console.error('Error al cargar datos desde la API:', error);
        throw error;
    }
}

// Renderizar las facturas
function renderizarFacturas(estadoGlobal, facturasFiltradas = null) {
    const facturasContainer = document.getElementById('lista-facturas');
    const facturasEmpty = document.getElementById('facturas-empty');

    if (!facturasContainer || !facturasEmpty) {
        console.error('No se encontraron los elementos necesarios para renderizar facturas');
        return;
    }

    const facturasAMostrar = facturasFiltradas || estadoGlobal.facturas;

    if (facturasAMostrar.length === 0) {
        facturasContainer.style.display = 'none';
        facturasEmpty.style.display = 'block';
        return;
    }

    facturasContainer.style.display = 'block';
    facturasEmpty.style.display = 'none';

    facturasContainer.innerHTML = facturasAMostrar.map(pago => {
        return `
            <div class="factura-item">
                <div class="factura-header">
                    <div class="factura-info">
                        <h3>Factura #${pago.factura.id_factura}</h3>
                        <span class="factura-fecha">
                            ${formatearFecha(pago.factura.fecha_emision)}
                        </span>
                    </div>
                    <div class="factura-estado ${pago.factura.estadoFactura}">
                        ${pago.factura.estadoFactura}
                    </div>
                </div>
                <div class="factura-detalles">
                    <div class="factura-pedido">
                        <strong>Pedido:</strong> ${pago.factura.pedido.idPedido}
                        <span class="estado-pedido ${pago.factura.pedido.estadoPedido}">
                            ${pago.factura.pedido.estadoPedido}
                        </span>
                    </div>
                    <div class="factura-pago">
                        <strong>Método de pago:</strong> ${pago.metodoPago}
                        <span class="estado-pago ${pago.estadoPago}">
                            ${pago.estadoPago}
                        </span>
                    </div>
                    <div class="factura-montos">
                        <div>Envío: $${pago.factura.pedido.costoEnvio}</div>
                        <div class="factura-total">
                            Total: $${pago.factura.total}
                        </div>
                    </div>
                </div>
                ${pago.estadoPago === 'pendiente' ? `
                    <div class="factura-acciones">
                        <button class="pagar-button" data-id-factura="${pago.factura.id_factura}">
                            Pagar ahora
                        </button>
                    </div>
                ` : ''}
            </div>
        `;
    }).join('');

    // Configurar eventos de los botones de pago
    document.querySelectorAll('.pagar-button').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const idFactura = e.target.getAttribute('data-id-factura');
            mostrarSimulacionPago(idFactura);
        });
    });
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

// Mostrar modal de simulación de pago
function mostrarSimulacionPago(idFactura) {
    console.log(`Simulando pago para la factura #${idFactura}`);
    document.getElementById('simulacionPagoModal').style.display = 'block';
}

// Configurar eventos del módulo
function configurarEventListeners(estadoGlobal) {
    document.getElementById('filtro-estado')?.addEventListener('change', () => filtrarFacturas(estadoGlobal));
    document.getElementById('filtro-fecha')?.addEventListener('change', () => filtrarFacturas(estadoGlobal));
    document.getElementById('btn-aplicar-filtros')?.addEventListener('click', () => filtrarFacturas(estadoGlobal));
}

// Filtrar facturas
function filtrarFacturas(estadoGlobal) {
    const estado = document.getElementById('filtro-estado')?.value || 'todos';
    const fecha = document.getElementById('filtro-fecha')?.value || '';

    const facturasFiltradas = estadoGlobal.facturas.filter(factura => {
        const cumpleEstado = estado === 'todos' || factura.factura.estadoFactura.toLowerCase() === estado;
        const cumpleFecha = !fecha || new Date(factura.factura.fecha_emision).toLocaleDateString() === new Date(fecha).toLocaleDateString();

        return cumpleEstado && cumpleFecha;
    });

    renderizarFacturas(estadoGlobal, facturasFiltradas);
}