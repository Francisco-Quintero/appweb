// En modules/ventas/ventas.js
(function() {
    console.log('Iniciando carga del módulo de ventas');

    // Datos de ejemplo para ventas
    const ventasData = [
        { id: 1, fecha: '2023-05-20', cliente: 'Juan Pérez', total: 50000, estado: 'Pendiente', domiciliario: null },
        { id: 2, fecha: '2023-05-21', cliente: 'María García', total: 75000, estado: 'En proceso', domiciliario: 'Carlos Rodríguez' },
        { id: 3, fecha: '2023-05-22', cliente: 'Pedro López', total: 100000, estado: 'Completada', domiciliario: 'Ana Martínez' },
    ];

    // Datos de ejemplo para domiciliarios
    const domiciliarios = [
        { id: 1, nombre: 'Carlos Rodríguez' },
        { id: 2, nombre: 'Ana Martínez' },
        { id: 3, nombre: 'Luis Sánchez' },
    ];

    function cargarModuloVentas() {
        console.log('Inicializando módulo de ventas');
        
        // Asegurarse de que el DOM esté cargado
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initVentas);
        } else {
            initVentas();
        }
        
        console.log('Módulo de ventas cargado completamente');
    }

    function initVentas() {
        console.log('Inicializando módulo de ventas');
        
        // Configurar event listeners
        document.getElementById('btnBuscar')?.addEventListener('click', buscarVentas);
        document.getElementById('btnCerrarModal')?.addEventListener('click', cerrarModal);
        document.getElementById('btnCerrarModalAsignar')?.addEventListener('click', cerrarModalAsignar);
        document.getElementById('formAsignarDomiciliario')?.addEventListener('submit', asignarDomiciliario);

        // Cargar datos iniciales
        cargarVentas();
        cargarDomiciliarios();
    }

    function cargarVentas() {
        console.log('Cargando ventas en la tabla');
        const cuerpoTabla = document.getElementById('cuerpoTablaVentas');
        const ventasEmpty = document.getElementById('ventas-empty');
        
        if (!cuerpoTabla) {
            console.error('No se encontró el elemento cuerpoTablaVentas');
            return;
        }

        if (ventasData.length === 0) {
            cuerpoTabla.innerHTML = '';
            if (ventasEmpty) {
                ventasEmpty.style.display = 'block';
            }
            return;
        }

        if (ventasEmpty) {
            ventasEmpty.style.display = 'none';
        }

        cuerpoTabla.innerHTML = ventasData.map(venta => `
            <tr>
                <td>${venta.id}</td>
                <td>${venta.fecha}</td>
                <td>${venta.cliente}</td>
                <td>$${venta.total.toFixed(2)}</td>
                <td>
                    <span class="estado-venta estado-${venta.estado.toLowerCase().replace(' ', '-')}">
                        ${venta.estado}
                    </span>
                </td>
                <td>${venta.domiciliario || 'No asignado'}</td>
                <td>
                    <button onclick="window.verDetallesVenta(${venta.id})" class="btn btn-secundario">
                        <i data-lucide="eye"></i>
                        Ver más
                    </button>
                    ${venta.estado === 'Pendiente' ? `
                        <button onclick="window.asignarDomiciliarioModal(${venta.id})" class="btn btn-primario">
                            <i data-lucide="user-plus"></i>
                            Asignar Domiciliario
                        </button>
                    ` : ''}
                </td>
            </tr>
        `).join('');

        // Reinicializar los iconos de Lucide
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        
        console.log('Ventas cargadas en la tabla');
    }

    function cargarDomiciliarios() {
        const selectDomiciliario = document.getElementById('selectDomiciliario');
        if (selectDomiciliario) {
            selectDomiciliario.innerHTML = `
                <option value="">Seleccione un domiciliario</option>
                ${domiciliarios.map(d => `<option value="${d.id}">${d.nombre}</option>`).join('')}
            `;
        }
    }

    function buscarVentas() {
        const busqueda = document.getElementById('busquedaVenta').value.toLowerCase();
        const ventasFiltradas = ventasData.filter(venta => 
            venta.cliente.toLowerCase().includes(busqueda) ||
            venta.id.toString().includes(busqueda) ||
            venta.fecha.includes(busqueda)
        );
        actualizarTablaVentas(ventasFiltradas);
    }

    function actualizarTablaVentas(ventas) {
        const cuerpoTabla = document.getElementById('cuerpoTablaVentas');
        const ventasEmpty = document.getElementById('ventas-empty');

        if (ventas.length === 0) {
            cuerpoTabla.innerHTML = '';
            ventasEmpty.style.display = 'block';
        } else {
            ventasEmpty.style.display = 'none';
            cargarVentas();
        }
    }

    function verDetallesVenta(id) {
        const venta = ventasData.find(v => v.id === id);
        if (venta) {
            const modalVenta = document.getElementById('modalVenta');
            const detallesVenta = document.getElementById('detallesVenta');
            detallesVenta.innerHTML = `
                <p><strong>ID Pedido:</strong> ${venta.id}</p>
                <p><strong>Fecha:</strong> ${venta.fecha}</p>
                <p><strong>Cliente:</strong> ${venta.cliente}</p>
                <p><strong>Total:</strong> $${venta.total.toFixed(2)}</p>
                <p><strong>Estado:</strong> ${venta.estado}</p>
                <p><strong>Domiciliario:</strong> ${venta.domiciliario || 'No asignado'}</p>
            `;
            modalVenta.style.display = 'block';
        }
    }

    function cerrarModal() {
        document.getElementById('modalVenta').style.display = 'none';
    }

    function asignarDomiciliarioModal(id) {
        const modalAsignar = document.getElementById('modalAsignarDomiciliario');
        modalAsignar.dataset.ventaId = id;
        modalAsignar.style.display = 'block';
    }

    function cerrarModalAsignar() {
        document.getElementById('modalAsignarDomiciliario').style.display = 'none';
    }

    function asignarDomiciliario(event) {
        event.preventDefault();
        const modalAsignar = document.getElementById('modalAsignarDomiciliario');
        const ventaId = parseInt(modalAsignar.dataset.ventaId);
        const domiciliarioId = document.getElementById('selectDomiciliario').value;

        if (domiciliarioId) {
            const domiciliario = domiciliarios.find(d => d.id === parseInt(domiciliarioId));
            const ventaIndex = ventasData.findIndex(v => v.id === ventaId);

            if (ventaIndex !== -1 && domiciliario) {
                ventasData[ventaIndex].domiciliario = domiciliario.nombre;
                ventasData[ventaIndex].estado = 'En proceso';
                cargarVentas();
                cerrarModalAsignar();
            }
        }
    }

    // Asegurarse de que las funciones estén disponibles globalmente
    window.cargarModuloVentas = cargarModuloVentas;
    window.verDetallesVenta = verDetallesVenta;
    window.asignarDomiciliarioModal = asignarDomiciliarioModal;

    // Iniciar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', cargarModuloVentas);
    } else {
        cargarModuloVentas();
    }

    console.log('Archivo ventas.js cargado completamente');
})();