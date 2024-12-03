(function() {
    console.log('Iniciando carga del módulo de Facturas');

    let facturas = [];
   // let pedidos = [];

    // function cargarDatosDesdeLocalStorage() {
    //     try {
    //         const datosGuardados = JSON.parse(localStorage.getItem('datosGlobales') || '{}');
    //         facturas = datosGuardados.facturas || [];
    //         pedidos = datosGuardados.pedidosPendientes || [];
    //         console.log('Datos de facturas cargados desde localStorage');
    //     } catch (error) {
    //         console.error('Error al cargar datos de facturas desde localStorage:', error);
    //     }
    // }

    
    async function cargarDatosDesdeAPI() {
        try {
            const response = await fetch('http://localhost:26209/api/pagos');
            if (!response.ok) {
                throw new Error(`Error al obtener datos: ${response.statusText}`);
            }
            facturas = await response.json();
            console.log('Datos de factura cargados desde la API:', facturas);
        } catch (error) {
            console.error('Error al cargar datos desde la API:', error);
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
                        <button class="pagar-button" onclick="mostrarSimulacionPago()">
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

            // Mostrar modal de simulación de pago
        function mostrarSimulacionPago() {
            document.getElementById('simulacionPagoModal').style.display = 'block';
        }

        // Cerrar modal de simulación
        function cerrarSimulacionPago() {
            document.getElementById('simulacionPagoModal').style.display = 'none';
        }

        // Manejar el formulario de simulación de pago
        document.getElementById('formSimulacionPago').addEventListener('submit', (e) => {
            e.preventDefault();

            const nombreCliente = document.getElementById('nombreCliente').value;
            const montoPago = parseFloat(document.getElementById('montoPago').value);
            const metodoPago = document.getElementById('metodoPago').value;

            // Simular la respuesta de la pasarela
            const exito = Math.random() > 0.2; // 80% de probabilidades de éxito

            if (exito) {
                alert(`¡Pago realizado con éxito! \nCliente: ${nombreCliente}\nMonto: $${montoPago}\nMétodo: ${metodoPago}`);
                cerrarSimulacionPago();
            } else {
                alert(`El pago ha fallado. Por favor, intente nuevamente.`);
            }
        });


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

    // async function procesarPago(idFactura) {
    //     const factura = facturas.find(f => f.idFactura === idFactura);
    //     if (!factura) return;

    //     if (factura.pago.metodoPago === 'transferencia') {
    //         try {
    //             const response = await fetch('https://api.ejemplo.com/pse', {
    //                 method: 'POST',
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                 },
    //                 body: JSON.stringify({
    //                     idFactura: factura.idFactura,
    //                     monto: factura.total,
    //                     // Otros datos necesarios para PSE
    //                 }),
    //             });

    //             if (response.ok) {
    //                 const result = await response.json();
    //                 // Redirigir al usuario a la página de pago de PSE
    //                 window.location.href = result.urlPago;
    //             } else {
    //                 throw new Error('Error en la respuesta del servidor');
    //             }
    //         } catch (error) {
    //             console.error('Error al procesar el pago por PSE:', error);
    //             alert('Hubo un error al procesar el pago. Por favor, intente nuevamente.');
    //         }
    //     } else if (factura.pago.metodoPago === 'efectivo') {
    //         alert('El pago se realizará contra entrega en efectivo');
    //     }

    //     factura.pago.estadoPago = 'procesando';
    //     guardarEnLocalStorage();
    //     renderizarFacturas();
    // }

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

    async function initFacturas() {
        console.log('Inicializando módulo de Facturas');
        await cargarDatosDesdeAPI();
        renderizarFacturas();
        configurarEventListeners();
        console.log('Módulo de Facturas cargado completamente');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initFacturas);
    } else {
        initFacturas();
    }


    // Exponer funciones necesarias globalmente
   // window.procesarPago = procesarPago;
    window.filtrarFacturas = filtrarFacturas;
    window.mostrarSimulacionPago = mostrarSimulacionPago;
    window.cerrarSimulacionPago = cerrarSimulacionPago;

})();