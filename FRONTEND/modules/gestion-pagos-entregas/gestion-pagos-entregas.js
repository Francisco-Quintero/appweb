(function() {
    console.log('Iniciando carga del módulo de Gestión de Pagos y Entregas');

    let entregas = [];
    let historialVentas = [];

    function inicializarModuloGestionPagosEntregas() {
        console.log('Inicializando módulo de Gestión de Pagos y Entregas');
        cargarDatos();
        configurarEventListeners();
    }

    function cargarDatos() {
        console.log('Cargando datos de pedidos pendientes e historial de ventas desde localStorage...');
        try {
            const datosGlobales = JSON.parse(localStorage.getItem('datosGlobales')) || {};
            entregas = datosGlobales.pedidosPendientes || [];
            historialVentas = datosGlobales.historialVentas || [];
            console.log('Datos cargados:', { entregas, historialVentas });
        } catch (error) {
            console.error('Error al cargar datos desde localStorage:', error);
            entregas = [];
            historialVentas = [];
        }
        actualizarTablaEntregas();
        actualizarTablaHistorial();
        actualizarResumen();
    }

    function guardarDatos() {
        console.log('Guardando datos en localStorage...');
        try {
            const datosGlobales = JSON.parse(localStorage.getItem('datosGlobales')) || {};
            datosGlobales.pedidosPendientes = entregas;
            datosGlobales.historialVentas = historialVentas;
            localStorage.setItem('datosGlobales', JSON.stringify(datosGlobales));
            console.log('Datos guardados en localStorage');
        } catch (error) {
            console.error('Error al guardar datos en localStorage:', error);
        }
    }

    function configurarEventListeners() {
        console.log('Configurando event listeners');
        const formRegistroPago = document.getElementById('form-registro-pago');
        const btnCerrarModal = document.getElementById('cerrar-modal');

        if (formRegistroPago) formRegistroPago.addEventListener('submit', registrarPago);
        if (btnCerrarModal) btnCerrarModal.addEventListener('click', cerrarModalRegistroPago);
    }

    function actualizarTablaEntregas() {
        console.log('Actualizando tabla de entregas pendientes');
        const tbody = document.getElementById('cuerpo-tabla-entregas');
        if (!tbody) {
            console.error('No se encontró el elemento cuerpo-tabla-entregas');
            return;
        }
        const entregasFiltradas = entregas.filter(entrega => entrega.domiciliario && entrega.domiciliario.nombre);
        tbody.innerHTML = entregasFiltradas.map(entrega => `
            <tr>
                <td>${entrega.idPedido}</td>
                <td>${entrega.cliente.nombre}</td>
                <td>$${entrega.total.toFixed(2)}</td>
                <td>${entrega.efectivo}</td>
                <td>${entrega.transferencia}</td>
                <td>${entrega.estadoPedido}</td>                
                <td>
                    <button onclick="window.abrirModalRegistroPago(${entrega.idPedido})" class="btn-registrar-pago" aria-label="Registrar Pago">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-dollar-sign">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="6" x2="12" y2="18"></line>
                            <path d="M16 10H9.5a2.5 2.5 0 0 0 0 5H16"></path>
                        </svg>
                    </button>
                </td>
            </tr>
        `).join('');
        console.log('Tabla de entregas pendientes actualizada');
    }

    function actualizarTablaHistorial() {
        console.log('Actualizando tabla de historial de ventas');
        const tbody = document.getElementById('cuerpo-tabla-historial');
        if (!tbody) {
            console.error('No se encontró el elemento cuerpo-tabla-historial');
            return;
        }
        tbody.innerHTML = historialVentas.map(venta => `
            <tr>
                <td>${venta.idPedido}</td>
                <td>${venta.cliente.nombre}</td>
                <td>$${venta.total}</td>
                <td>$${(venta.efectivo || 0)}</td>
                <td>$${(venta.transferencia || 0)}</td>
                <td>${new Date(venta.fechaPedido).toLocaleDateString()}</td>
            </tr>
        `).join('');
        console.log('Tabla de historial de ventas actualizada');
    }

    function actualizarResumen() {
        console.log('Actualizando resumen de pagos');
        const resumen = historialVentas.reduce((acc, venta) => {
            acc.totalRecaudado += venta.total;
            acc.totalEfectivo += venta.efectivo || 0;
            acc.totalTransferencias += venta.transferencia || 0;
            return acc;
        }, { totalRecaudado: 0, totalEfectivo: 0, totalTransferencias: 0 });
        
        document.getElementById('monto-total').textContent = resumen.totalRecaudado.toFixed(2);
        document.getElementById('monto-efectivo').textContent = resumen.totalEfectivo.toFixed(2);
        document.getElementById('monto-transferencias').textContent = resumen.totalTransferencias.toFixed(2);
        
        console.log('Resumen actualizado:', resumen);
    }

    function abrirModalRegistroPago(idPedido) {
        console.log('Abriendo modal para registrar pago de entrega:', idPedido);
        const entrega = entregas.find(e => e.idPedido == idPedido);
        if (!entrega) {
            console.error('No se encontró la entrega con ID:', idPedido);
            return;
        }

        const modal = document.getElementById('modal-registro-pago');
        document.getElementById('id-pedido').value = idPedido;
        document.getElementById('monto-efectivo').value = '';
        document.getElementById('monto-transferencia').value = '';
        document.getElementById('numero-pedido').textContent = idPedido;
        modal.style.display = 'block';
    }

    function registrarPago(event) {
        event.preventDefault();
        console.log('Registrando pago...');

        const formData = new FormData(event.target);
        const idPedido = formData.get('id-pedido');
        const montoEfectivo = parseFloat(formData.get('monto-efectivo')) || 0;
        const montoTransferencia = parseFloat(formData.get('monto-transferencia')) || 0;
        
        console.log('Datos del pago:', { idPedido, montoEfectivo, montoTransferencia });

        const entregaIndex = entregas.findIndex(e => e.idPedido == idPedido);
        if (entregaIndex !== -1) {
            const entrega = entregas[entregaIndex];
            entrega.efectivo = montoEfectivo;
            entrega.transferencia = montoTransferencia;
            entrega.estadoPedido = 'Entregado';
            
            // Mover la entrega al historial de ventas
            historialVentas.push(entrega);
            entregas.splice(entregaIndex, 1);
            
            console.log('Entrega actualizada y movida al historial:', entrega);
            
            guardarDatos();
            actualizarTablaEntregas();
            actualizarTablaHistorial();
            actualizarResumen();
            cerrarModalRegistroPago();
            mostrarConfirmacion(`Pago registrado con éxito para el pedido #${idPedido}`);
        } else {
            console.error('No se encontró la entrega con ID:', idPedido);
        }
    }

    function cerrarModalRegistroPago() {
        console.log('Cerrando modal de registro de pago');
        const modal = document.getElementById('modal-registro-pago');
        if (modal) modal.style.display = 'none';
    }

    function mostrarConfirmacion(mensaje) {
        console.log('Mostrando confirmación:', mensaje);
        const confirmacion = document.createElement('div');
        confirmacion.className = 'confirmacion';
        confirmacion.textContent = mensaje;
        document.body.appendChild(confirmacion);
        
        setTimeout(() => {
            confirmacion.remove();
        }, 3000);
    }

    window.inicializarModuloGestionPagosEntregas = inicializarModuloGestionPagosEntregas;
    window.abrirModalRegistroPago = abrirModalRegistroPago;
    window.registrarPago = registrarPago;
    window.cerrarModalRegistroPago = cerrarModalRegistroPago;

    console.log('Módulo de Gestión de Pagos y Entregas cargado completamente');
})();