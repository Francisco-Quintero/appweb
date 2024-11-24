(function() {
    console.log('Iniciando carga del módulo de ventas');

    let ventasActivas = [];
    let historialVentas = [];
    let domiciliarios = [];

    function cargarDatosDesdeLocalStorage() {
        try {
            const datosGuardados = JSON.parse(localStorage.getItem('datosGlobales') || '{}');
            ventasActivas = datosGuardados.pedidosPendientes || [];
            historialVentas = datosGuardados.historialVentas || [];
            domiciliarios = datosGuardados.domiciliarios || [];
            console.log('Datos de ventas cargados desde localStorage');
        } catch (error) {
            console.error('Error al cargar datos de ventas desde localStorage:', error);
        }
    }

    function guardarEnLocalStorage() {
        try {
            const datosActuales = JSON.parse(localStorage.getItem('datosGlobales') || '{}');
            datosActuales.pedidosPendientes = ventasActivas;
            datosActuales.historialVentas = historialVentas;
            localStorage.setItem('datosGlobales', JSON.stringify(datosActuales));
            console.log('Datos de ventas guardados en localStorage');
        } catch (error) {
            console.error('Error al guardar datos de ventas en localStorage:', error);
        }
    }

    function sincronizarConDatosGlobales() {
        if (window.datosGlobales) {
            ventasActivas = Array.isArray(window.datosGlobales.pedidosPendientes) ? window.datosGlobales.pedidosPendientes : [];
            historialVentas = Array.isArray(window.datosGlobales.historialVentas) ? window.datosGlobales.historialVentas : [];
            domiciliarios = Array.isArray(window.datosGlobales.domiciliarios) ? window.datosGlobales.domiciliarios : [];
            renderizarVentasActivas();
            console.log('Datos de ventas sincronizados con datosGlobales');
        }
    }

    function renderizarVentasActivas() {
        const cuerpoTablaVentas = document.getElementById('cuerpoTablaVentas');
        const ventasEmpty = document.getElementById('ventas-empty');
        
        if (!cuerpoTablaVentas || !ventasEmpty) {
            console.error('No se encontraron los elementos necesarios para renderizar ventas activas');
            return;
        }

        if (ventasActivas.length === 0) {
            cuerpoTablaVentas.innerHTML = '';
            ventasEmpty.style.display = 'block';
            return;
        }

        ventasEmpty.style.display = 'none';
        cuerpoTablaVentas.innerHTML = ventasActivas.map(venta => `
            <tr>
                <td>${venta.idPedido}</td>
                <td>${venta.fecha}</td>
                <td>${venta.cliente}</td>
                <td>$${venta.total.toFixed(2)}</td>
                <td>${venta.estado}</td>
                <td>${venta.domiciliario || 'No asignado'}</td>
                <td>
                    <button onclick="mostrarDetallesVenta(${venta.idPedido})" class="btn-detalles">Detalles</button>
                    ${!venta.domiciliario ? `
                        <button onclick="mostrarModalAsignarDomiciliario(${venta.idPedido})" class="btn-asignar">Asignar Domiciliario</button>
                    ` : ''}
                    ${venta.domiciliario && venta.estado !== 'Completada' ? `
                        <button onclick="completarVenta(${venta.idPedido})" class="btn-completar">Completar Venta</button>
                    ` : ''}
                </td>
            </tr>
        `).join('');
    }

    function renderizarHistorialVentas() {
        const cuerpoTablaHistorial = document.getElementById('cuerpoTablaHistorial');
        const historialEmpty = document.getElementById('historial-empty');
        
        if (!cuerpoTablaHistorial || !historialEmpty) {
            console.error('No se encontraron los elementos necesarios para renderizar historial de ventas');
            return;
        }

        if (historialVentas.length === 0) {
            cuerpoTablaHistorial.innerHTML = '';
            historialEmpty.style.display = 'block';
            return;
        }

        historialEmpty.style.display = 'none';
        cuerpoTablaHistorial.innerHTML = historialVentas.map(venta => `
            <tr>
                <td>${venta.idPedido}</td>
                <td>${venta.fecha}</td>
                <td>${venta.cliente}</td>
                <td>$${venta.total.toFixed(2)}</td>
                <td>${venta.domiciliario}</td>
                <td>
                    <button onclick="mostrarDetallesVenta(${venta.idPedido})" class="btn-detalles">Detalles</button>
                </td>
            </tr>
        `).join('');
    }

    function asignarDomiciliario(ventaId, domiciliarioId) {
        const ventaIndex = ventasActivas.findIndex(v => v.idPedido === ventaId);
        const domiciliario = domiciliarios.find(d => d.id === parseInt(domiciliarioId));

        if (ventaIndex !== -1 && domiciliario) {
            ventasActivas[ventaIndex].domiciliario = domiciliario.nombre;
            ventasActivas[ventaIndex].estado = 'En proceso';
            guardarEnLocalStorage();
            renderizarVentasActivas();
            cerrarModalAsignarDomiciliario();
        }
    }

    function completarVenta(ventaId) {
        const ventaIndex = ventasActivas.findIndex(v => v.idPedido === ventaId);
        if (ventaIndex !== -1) {
            const ventaCompletada = {...ventasActivas[ventaIndex], estado: 'Completada'};
            historialVentas.push(ventaCompletada);
            ventasActivas.splice(ventaIndex, 1);
            guardarEnLocalStorage();
            renderizarVentasActivas();
            renderizarHistorialVentas();
        }
    }

    function buscarVentas() {
        const busqueda = document.getElementById('busquedaVenta').value.toLowerCase();
        const ventasFiltradas = ventasActivas.filter(venta => 
            venta.cliente.toLowerCase().includes(busqueda) ||
            venta.idPedido.toString().includes(busqueda) ||
            venta.fecha.includes(busqueda)
        );
        renderizarVentasActivas(ventasFiltradas);
    }

    function toggleVista() {
        const ventasActivasContainer = document.getElementById('ventasActivas');
        const historialVentasContainer = document.getElementById('historialVentas');
        const btnVerHistorial = document.getElementById('btnVerHistorial');

        if (ventasActivasContainer.style.display !== 'none') {
            ventasActivasContainer.style.display = 'none';
            historialVentasContainer.style.display = 'block';
            btnVerHistorial.textContent = 'Ver Ventas Activas';
            renderizarHistorialVentas();
        } else {
            ventasActivasContainer.style.display = 'block';
            historialVentasContainer.style.display = 'none';
            btnVerHistorial.textContent = 'Ver Historial';
            renderizarVentasActivas();
        }
    }

    function mostrarDetallesVenta(ventaId) {
        const venta = ventasActivas.find(v => v.idPedido === ventaId) || historialVentas.find(v => v.idPedido === ventaId);
        if (venta) {
            const detallesVenta = document.getElementById('detallesVenta');
            detallesVenta.innerHTML = `
                <p><strong>ID Pedido:</strong> ${venta.idPedido}</p>
                <p><strong>Fecha:</strong> ${venta.fecha}</p>
                <p><strong>Cliente:</strong> ${venta.cliente}</p>
                <p><strong>Total:</strong> $${venta.total.toFixed(2)}</p>
                <p><strong>Estado:</strong> ${venta.estado}</p>
                <p><strong>Domiciliario:</strong> ${venta.domiciliario || 'No asignado'}</p>
                <!-- Aquí puedes agregar más detalles si es necesario -->
            `;
            document.getElementById('modalVenta').style.display = 'block';
        }
    }

    function mostrarModalAsignarDomiciliario(ventaId) {
        const selectDomiciliario = document.getElementById('selectDomiciliario');
        selectDomiciliario.innerHTML = '<option value="">Seleccione un domiciliario</option>' +
            domiciliarios.map(d => `<option value="${d.id}">${d.nombre}</option>`).join('');
        
        document.getElementById('formAsignarDomiciliario').onsubmit = function(e) {
            e.preventDefault();
            asignarDomiciliario(ventaId, selectDomiciliario.value);
        };

        document.getElementById('modalAsignarDomiciliario').style.display = 'block';
    }

    function cerrarModalAsignarDomiciliario() {
        document.getElementById('modalAsignarDomiciliario').style.display = 'none';
    }

    function initVentas() {
        console.log('Inicializando módulo de ventas');
        cargarDatosDesdeLocalStorage();
        renderizarVentasActivas();
        
        document.getElementById('busquedaVenta').addEventListener('input', buscarVentas);
        document.getElementById('btnBuscar').addEventListener('click', buscarVentas);
        document.getElementById('btnVerHistorial').addEventListener('click', toggleVista);
        document.getElementById('btnVolverActivas').addEventListener('click', toggleVista);
        document.getElementById('btnCerrarModal').addEventListener('click', () => {
            document.getElementById('modalVenta').style.display = 'none';
        });
        document.getElementById('btnCerrarModalAsignar').addEventListener('click', cerrarModalAsignarDomiciliario);
        
        window.addEventListener('datosGlobalesListo', sincronizarConDatosGlobales);
        
        if (window.datosGlobales) {
            sincronizarConDatosGlobales();
        }
        
        console.log('Módulo de ventas cargado completamente');
    }

    // Exponer funciones necesarias globalmente
    window.mostrarDetallesVenta = mostrarDetallesVenta;
    window.mostrarModalAsignarDomiciliario = mostrarModalAsignarDomiciliario;
    window.completarVenta = completarVenta;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initVentas);
    } else {
        initVentas();
    }

    console.log('Archivo ventas.js cargado completamente');
})();

