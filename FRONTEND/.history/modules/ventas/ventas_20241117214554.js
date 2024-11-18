(function() {
    console.log('Iniciando carga del módulo de ventas');

    let ventasActivas = [
        { 
            id: 1, 
            fecha: '2023-05-20', 
            cliente: 'Juan Pérez', 
            total: 50000, 
            estado: 'Pendiente', 
            domiciliario: null,
            productos: [
                { nombre: 'Hamburguesa', cantidad: 2, precio: 15000 },
                { nombre: 'Papas fritas', cantidad: 1, precio: 5000 },
                { nombre: 'Refresco', cantidad: 2, precio: 7500 }
            ]
        },
        { 
            id: 2, 
            fecha: '2023-05-21', 
            cliente: 'María García', 
            total: 75000, 
            estado: 'En proceso', 
            domiciliario: 'Carlos Rodríguez',
            productos: [
                { nombre: 'Pizza familiar', cantidad: 1, precio: 45000 },
                { nombre: 'Alitas de pollo', cantidad: 2, precio: 15000 }
            ]
        },
    ];

    // Nuevo array para el historial de ventas con productos
    let historialVentas = [
        { 
            id: 3, 
            fecha: '2023-05-22', 
            cliente: 'Pedro López', 
            total: 100000, 
            estado: 'Completada', 
            domiciliario: 'Ana Martínez',
            productos: [
                { nombre: 'Ensalada César', cantidad: 1, precio: 25000 },
                { nombre: 'Pollo a la parrilla', cantidad: 2, precio: 35000 },
                { nombre: 'Postre del día', cantidad: 2, precio: 5000 }
            ]
        },
    ];

    // Datos de ejemplo para domiciliarios (sin cambios)
    const domiciliarios = [
        { id: 1, nombre: 'Carlos Rodríguez' },
        { id: 2, nombre: 'Ana Martínez' },
        { id: 3, nombre: 'Luis Sánchez' },
    ];

    function cargarModuloVentas() {
        console.log('Inicializando módulo de ventas');
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initVentas);
        } else {
            initVentas();
        }
        
        console.log('Módulo de ventas cargado completamente');
    }

    function initVentas() {
        console.log('Inicializando módulo de ventas');
        
        document.getElementById('btnBuscar')?.addEventListener('click', buscarVentas);
        document.getElementById('btnCerrarModal')?.addEventListener('click', cerrarModal);
        document.getElementById('btnCerrarModalAsignar')?.addEventListener('click', cerrarModalAsignar);
        document.getElementById('formAsignarDomiciliario')?.addEventListener('submit', asignarDomiciliario);
        document.getElementById('btnVerHistorial')?.addEventListener('click', mostrarHistorial);
        document.getElementById('btnVolverActivas')?.addEventListener('click', mostrarVentasActivas);

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

        if (ventasActivas.length === 0) {
            cuerpoTabla.innerHTML = '';
            if (ventasEmpty) {
                ventasEmpty.style.display = 'block';
            }
            return;
        }

        if (ventasEmpty) {
            ventasEmpty.style.display = 'none';
        }

        cuerpoTabla.innerHTML = ventasActivas.map(venta => `
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
                    ${venta.estado === 'En proceso' ? `
                        <button onclick="window.completarVenta(${venta.id})" class="btn btn-success">
                            <i data-lucide="check"></i>
                            Completar
                        </button>
                    ` : ''}
                </td>
            </tr>
        `).join('');

        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        
        console.log('Ventas cargadas en la tabla');
    }

    function cargarHistorial() {
        console.log('Cargando historial de ventas');
        const cuerpoTabla = document.getElementById('cuerpoTablaHistorial');
        const historialEmpty = document.getElementById('historial-empty');
        
        if (!cuerpoTabla) {
            console.error('No se encontró el elemento cuerpoTablaHistorial');
            return;
        }

        if (historialVentas.length === 0) {
            cuerpoTabla.innerHTML = '';
            if (historialEmpty) {
                historialEmpty.style.display = 'block';
            }
            return;
        }

        if (historialEmpty) {
            historialEmpty.style.display = 'none';
        }

        cuerpoTabla.innerHTML = historialVentas.map(venta => `
            <tr>
                <td>${venta.id}</td>
                <td>${venta.fecha}</td>
                <td>${venta.cliente}</td>
                <td>$${venta.total.toFixed(2)}</td>
                <td>${venta.domiciliario}</td>
                <td>
                    <button onclick="window.verDetallesVenta(${venta.id}, true)" class="btn btn-secundario">
                        <i data-lucide="eye"></i>
                        Ver más
                    </button>
                </td>
            </tr>
        `).join('');

        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        
        console.log('Historial de ventas cargado en la tabla');
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
        const ventasFiltradas = ventasActivas.filter(venta => 
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

    function verDetallesVenta(id, esHistorial = false) {
        const venta = esHistorial 
            ? historialVentas.find(v => v.id === id)
            : ventasActivas.find(v => v.id === id);
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
                <h4>Productos:</h4>
                <table class="tabla-productos">
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Cantidad</th>
                            <th>Precio Unitario</th>
                            <th>Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${venta.productos.map(producto => `
                            <tr>
                                <td>${producto.nombre}</td>
                                <td>${producto.cantidad}</td>
                                <td>$${producto.precio.toFixed(2)}</td>
                                <td>$${(producto.cantidad * producto.precio).toFixed(2)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
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
            const ventaIndex = ventasActivas.findIndex(v => v.id === ventaId);

            if (ventaIndex !== -1 && domiciliario) {
                ventasActivas[ventaIndex].domiciliario = domiciliario.nombre;
                ventasActivas[ventaIndex].estado = 'En proceso';
                cargarVentas();
                cerrarModalAsignar();
            }
        }
    }

    function completarVenta(id) {
        const ventaIndex = ventasActivas.findIndex(v => v.id === id);
        if (ventaIndex !== -1) {
            const venta = ventasActivas[ventaIndex];
            venta.estado = 'Completada';
            historialVentas.push(venta);
            ventasActivas.splice(ventaIndex, 1);
            cargarVentas();
        }
    }

    function mostrarHistorial() {
        document.getElementById('ventasActivas').style.display = 'none';
        document.getElementById('historialVentas').style.display = 'block';
        cargarHistorial();
    }

    function mostrarVentasActivas() {
        document.getElementById('historialVentas').style.display = 'none';
        document.getElementById('ventasActivas').style.display = 'block';
        cargarVentas();
    }

    window.cargarModuloVentas = cargarModuloVentas;
    window.verDetallesVenta = verDetallesVenta;
    window.asignarDomiciliarioModal = asignarDomiciliarioModal;
    window.completarVenta = completarVenta;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', cargarModuloVentas);
    } else {
        cargarModuloVentas();
    }

    console.log('Archivo ventas.js cargado completamente');
})();