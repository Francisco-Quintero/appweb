// Estado del módulo encapsulado
const gestionPagosEntregasState = {
    entregas: [],
    eventListeners: []
};

// Función para agregar event listeners y mantener un registro
function addEventListenerWithCleanup(element, event, handler) {
    if (element) {
        element.addEventListener(event, handler);
        gestionPagosEntregasState.eventListeners.push({ element, event, handler });
    }
}

// Función de limpieza
function cleanup() {
    console.log('Limpiando módulo de Gestión de Pagos y Entregas');
    gestionPagosEntregasState.eventListeners.forEach(({ element, event, handler }) => {
        element.removeEventListener(event, handler);
    });
    gestionPagosEntregasState.eventListeners = [];
    gestionPagosEntregasState.entregas = [];
}

function inicializarModuloGestionPagosEntregas() {
    console.log('Inicializando módulo de Gestión de Pagos y Entregas');
    
    if (window.ModuleManager && window.ModuleManager.moduleStates['gestion-pagos-entregas']) {
        window.ModuleManager.moduleStates['gestion-pagos-entregas'].cleanup = cleanup;
    }
    
    cargarEntregas();
    configurarEventListeners();
}

function cargarEntregas() {
    console.log('Cargando entregas...');
    // Aquí deberías cargar las entregas desde una API o base de datos
    gestionPagosEntregasState.entregas = [
        { id: 1, cliente: 'Juan Pérez', montoTotal: 50000, efectivo: 0, transferencia: 0, estado: 'Pendiente' },
        { id: 2, cliente: 'María López', montoTotal: 75000, efectivo: 0, transferencia: 0, estado: 'Pendiente' },
        { id: 3, cliente: 'Carlos Rodríguez', montoTotal: 100000, efectivo: 100000, transferencia: 0, estado: 'Entregado' }
    ];
    console.log('Entregas cargadas:', gestionPagosEntregasState.entregas);
    actualizarTablaEntregas();
    actualizarResumen();
}

function configurarEventListeners() {
    console.log('Configurando event listeners');
    const formRegistroPago = document.getElementById('form-registro-pago');
    const btnCerrarModal = document.getElementById('cerrar-modal');

    if (formRegistroPago) addEventListenerWithCleanup(formRegistroPago, 'submit', registrarPago);
    if (btnCerrarModal) addEventListenerWithCleanup(btnCerrarModal, 'click', cerrarModalRegistroPago);
}

function actualizarTablaEntregas() {
    console.log('Actualizando tabla de entregas');
    const tbody = document.getElementById('cuerpo-tabla-entregas');
    if (!tbody) {
        console.error('No se encontró el elemento cuerpo-tabla-entregas');
        return;
    }
    tbody.innerHTML = gestionPagosEntregasState.entregas.map(entrega => `
        <tr>
            <td>${entrega.id}</td>
            <td>${entrega.cliente}</td>
            <td>$${entrega.montoTotal.toFixed(2)}</td>
            <td>$${entrega.efectivo.toFixed(2)}</td>
            <td>$${entrega.transferencia.toFixed(2)}</td>
            <td>${entrega.estado}</td>
            <td>
                ${entrega.estado === 'Pendiente' 
                    ? `<button onclick="abrirModalRegistroPago(${entrega.id})">Registrar Pago</button>`
                    : `<span class="pago-registrado">Pago Registrado</span>`
                }
            </td>
        </tr>
    `).join('');
    console.log('Tabla de entregas actualizada');
}

function actualizarResumen() {
    console.log('Actualizando resumen de pagos');
    const { totalRecaudado, totalEfectivo, totalTransferencias } = gestionPagosEntregasState.entregas.reduce((acc, entrega) => {
        acc.totalRecaudado += entrega.efectivo + entrega.transferencia;
        acc.totalEfectivo += entrega.efectivo;
        acc.totalTransferencias += entrega.transferencia;
        return acc;
    }, { totalRecaudado: 0, totalEfectivo: 0, totalTransferencias: 0 });
    
    document.getElementById('monto-total').textContent = totalRecaudado.toFixed(2);
    document.getElementById('monto-efectivo').textContent = totalEfectivo.toFixed(2);
    document.getElementById('monto-transferencias').textContent = totalTransferencias.toFixed(2);
    
    console.log('Resumen actualizado:', { totalRecaudado, totalEfectivo, totalTransferencias });
}

function abrirModalRegistroPago(idEntrega) {
    console.log('Abriendo modal para registrar pago de entrega:', idEntrega);
    const entrega = gestionPagosEntregasState.entregas.find(e => e.id == idEntrega);
    if (!entrega) {
        console.error('No se encontró la entrega con ID:', idEntrega);
        return;
    }

    const modal = document.getElementById('modal-registro-pago');
    document.getElementById('id-pedido').value = idEntrega;
    document.getElementById('monto-efectivo').value = '';
    document.getElementById('monto-transferencia').value = '';
    document.getElementById('numero-pedido').textContent = idEntrega;
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

    const entrega = gestionPagosEntregasState.entregas.find(e => e.id == idPedido);
    if (entrega) {
        entrega.efectivo = montoEfectivo;
        entrega.transferencia = montoTransferencia;
        entrega.estado = 'Entregado';
        console.log('Entrega actualizada:', entrega);
        
        actualizarTablaEntregas();
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

// Exponer funciones necesarias globalmente
window.inicializarModuloGestionPagosEntregas = inicializarModuloGestionPagosEntregas;
window.abrirModalRegistroPago = abrirModalRegistroPago;
window.registrarPago = registrarPago;
window.cerrarModalRegistroPago = cerrarModalRegistroPago;

// No es necesario inicializar el módulo aquí, se hará cuando se cargue