(function() {
    console.log('Iniciando carga del módulo de Historial de Entregas');

    const historialEntregasState = {
        entregas: [],
        filtros: {
            fechaInicio: null,
            fechaFin: null,
            estado: 'todos'
        },
        paginaActual: 1,
        entradasPorPagina: 10
    };

    function inicializarModuloHistorialEntregas() {
        console.log('Inicializando módulo de Historial de Entregas');
        cargarEntregas();
        configurarEventListeners();
    }

    function cargarEntregas() {
        const datosGlobales = JSON.parse(localStorage.getItem('datosGlobales') || '{}');
        const usuarioActual = JSON.parse(localStorage.getItem('sesionDomiciliario') || '{}');

        if (usuarioActual.rol === 'domiciliario') {
            historialEntregasState.entregas = (datosGlobales.historialVentas || []).filter(venta => 
                venta.domiciliario && venta.domiciliario.id === usuarioActual.id
            );
        } 

        console.log('Entregas cargadas:', historialEntregasState.entregas);
        actualizarTablaHistorial();
    }

    function configurarEventListeners() {
        const btnFiltrar = document.getElementById('btn-filtrar');
        const fechaInicio = document.getElementById('fecha-inicio');
        const fechaFin = document.getElementById('fecha-fin');
        const filtroEstado = document.getElementById('filtro-estado');
        const cerrarModal = document.querySelector('.cerrar-modal');

        if (btnFiltrar) btnFiltrar.addEventListener('click', aplicarFiltros);
        if (fechaInicio) fechaInicio.addEventListener('change', actualizarFiltros);
        if (fechaFin) fechaFin.addEventListener('change', actualizarFiltros);
        if (filtroEstado) filtroEstado.addEventListener('change', actualizarFiltros);
        if (cerrarModal) cerrarModal.addEventListener('click', cerrarModalDetalles);
    }

    function actualizarFiltros() {
        historialEntregasState.filtros.fechaInicio = document.getElementById('fecha-inicio').value;
        historialEntregasState.filtros.fechaFin = document.getElementById('fecha-fin').value;
        historialEntregasState.filtros.estado = document.getElementById('filtro-estado').value;
    }

    function aplicarFiltros() {
        actualizarFiltros();
        historialEntregasState.paginaActual = 1;
        actualizarTablaHistorial();
    }

    function actualizarTablaHistorial() {
        const entregasFiltradas = filtrarEntregas();
        const entregasPaginadas = paginarEntregas(entregasFiltradas);
        
        const tbody = document.getElementById('cuerpo-tabla-historial');
        if (tbody) {
            tbody.innerHTML = entregasPaginadas.map(entrega => `
                <tr>
                    <td>${entrega.idPedido}</td>
                    <td>${new Date(entrega.fechaPedido).toLocaleDateString()}</td>
                    <td>${entrega.cliente ? entrega.cliente.nombre : 'N/A'}</td>
                    <td>${entrega.cliente ? entrega.cliente.direccion : 'N/A'}</td>
                    <td>$${entrega.total}</td>
                    <td>${entrega.estadoPedido}</td>
                    <td>
                        <button onclick="window.verDetallesEntrega(${entrega.idPedido})" class="btn-ver-detalles">
                            Ver Detalles
                        </button>
                    </td>
                </tr>
            `).join('');
        }
        
        actualizarPaginacion(entregasFiltradas.length);
    }

    function filtrarEntregas() {
        return historialEntregasState.entregas.filter(entrega => {
            const fechaEntrega = new Date(entrega.fechaPedido);
            const cumpleFechaInicio = !historialEntregasState.filtros.fechaInicio || fechaEntrega >= new Date(historialEntregasState.filtros.fechaInicio);
            const cumpleFechaFin = !historialEntregasState.filtros.fechaFin || fechaEntrega <= new Date(historialEntregasState.filtros.fechaFin);
            const cumpleEstado = historialEntregasState.filtros.estado === 'todos' || entrega.estadoPedido === historialEntregasState.filtros.estado;
            return cumpleFechaInicio && cumpleFechaFin && cumpleEstado;
        });
    }

    function paginarEntregas(entregas) {
        const inicio = (historialEntregasState.paginaActual - 1) * historialEntregasState.entradasPorPagina;
        const fin = inicio + historialEntregasState.entradasPorPagina;
        return entregas.slice(inicio, fin);
    }

    function actualizarPaginacion(totalEntregas) {
        const totalPaginas = Math.ceil(totalEntregas / historialEntregasState.entradasPorPagina);
        const paginacion = document.getElementById('paginacion');
        if (paginacion) {
            paginacion.innerHTML = '';
            
            if (totalPaginas > 1) {
                const btnAnterior = document.createElement('button');
                btnAnterior.textContent = 'Anterior';
                btnAnterior.disabled = historialEntregasState.paginaActual === 1;
                btnAnterior.addEventListener('click', () => cambiarPagina(historialEntregasState.paginaActual - 1));
                paginacion.appendChild(btnAnterior);
                
                for (let i = 1; i <= totalPaginas; i++) {
                    const btnPagina = document.createElement('button');
                    btnPagina.textContent = i;
                    btnPagina.classList.toggle('activa', i === historialEntregasState.paginaActual);
                    btnPagina.addEventListener('click', () => cambiarPagina(i));
                    paginacion.appendChild(btnPagina);
                }
                
                const btnSiguiente = document.createElement('button');
                btnSiguiente.textContent = 'Siguiente';
                btnSiguiente.disabled = historialEntregasState.paginaActual === totalPaginas;
                btnSiguiente.addEventListener('click', () => cambiarPagina(historialEntregasState.paginaActual + 1));
                paginacion.appendChild(btnSiguiente);
            }
        }
    }

    function cambiarPagina(nuevaPagina) {
        historialEntregasState.paginaActual = nuevaPagina;
        actualizarTablaHistorial();
    }

    function verDetallesEntrega(idEntrega) {
        const entrega = historialEntregasState.entregas.find(e => e.idPedido === idEntrega);
        if (entrega) {
            const detallesEntrega = document.getElementById('detalles-entrega');
            if (detallesEntrega) {
                detallesEntrega.innerHTML = `
                    <p><strong>ID Pedido:</strong> ${entrega.idPedido}</p>
                    <p><strong>Fecha:</strong> ${new Date(entrega.fechaPedido).toLocaleString()}</p>
                    <p><strong>Cliente:</strong> ${entrega.cliente ? entrega.cliente.nombre : 'N/A'}</p>
                    <p><strong>Dirección:</strong> ${entrega.cliente ? entrega.cliente.direccion : 'N/A'}</p>
                    <p><strong>Total:</strong> $${entrega.total.toFixed(2)}</p>
                    <p><strong>Estado:</strong> ${entrega.estadoPedido}</p>
                    <h4>Productos:</h4>
                    <ul>
                        ${entrega.items.map(item => `
                            <li>${item.cantidad} x ${item.nombre} - $${item.total}</li>
                        `).join('')}
                    </ul>
                `;
            }
            const modalDetalles = document.getElementById('modal-detalles');
            if (modalDetalles) modalDetalles.style.display = 'block';
        }
    }

    function cerrarModalDetalles() {
        const modalDetalles = document.getElementById('modal-detalles');
        if (modalDetalles) modalDetalles.style.display = 'none';
    }

    window.inicializarModuloHistorialEntregas = inicializarModuloHistorialEntregas;
    window.verDetallesEntrega = verDetallesEntrega;
    window.cerrarModalDetalles = cerrarModalDetalles;

    console.log('Módulo de Historial de Entregas cargado completamente');
})();

