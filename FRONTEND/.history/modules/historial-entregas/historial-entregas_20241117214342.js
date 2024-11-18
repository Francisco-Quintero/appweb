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
        entradasPorPagina: 10,
        eventListeners: []
    };

    function addEventListenerWithCleanup(element, event, handler) {
        if (element) {
            element.addEventListener(event, handler);
            historialEntregasState.eventListeners.push({ element, event, handler });
        }
    }

    function cleanup() {
        console.log('Limpiando módulo de Historial de Entregas');
        historialEntregasState.eventListeners.forEach(({ element, event, handler }) => {
            if (element) {
                element.removeEventListener(event, handler);
            }
        });
        historialEntregasState.eventListeners = [];
        historialEntregasState.entregas = [];
    }

    function inicializarModuloHistorialEntregas() {
        console.log('Inicializando módulo de Historial de Entregas');
        cargarEntregas();
        configurarEventListeners();
    }

    function cargarEntregas() {

        historialEntregasState.entregas = [
            { id: 1, fecha: '2023-05-15', cliente: 'Juan Pérez', direccion: 'Calle 123 #45-67', monto: 50000, estado: 'Entregado' },
            { id: 2, fecha: '2023-05-16', cliente: 'María López', direccion: 'Avenida 789 #12-34', monto: 75000, estado: 'Entregado' },
            { id: 3, fecha: '2023-05-17', cliente: 'Carlos Rodríguez', direccion: 'Carrera 456 #78-90', monto: 100000, estado: 'Cancelado' }, 
        ];
        actualizarTablaHistorial();
    }

    function configurarEventListeners() {
        const btnFiltrar = document.getElementById('btn-filtrar');
        const fechaInicio = document.getElementById('fecha-inicio');
        const fechaFin = document.getElementById('fecha-fin');
        const filtroEstado = document.getElementById('filtro-estado');
        const cerrarModal = document.querySelector('.cerrar-modal');

        addEventListenerWithCleanup(btnFiltrar, 'click', aplicarFiltros);
        addEventListenerWithCleanup(fechaInicio, 'change', actualizarFiltros);
        addEventListenerWithCleanup(fechaFin, 'change', actualizarFiltros);
        addEventListenerWithCleanup(filtroEstado, 'change', actualizarFiltros);
        addEventListenerWithCleanup(cerrarModal, 'click', cerrarModalDetalles);
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
        tbody.innerHTML = entregasPaginadas.map(entrega => `
            <tr>
                <td>${entrega.id}</td>
                <td>${entrega.fecha}</td>
                <td>${entrega.cliente}</td>
                <td>${entrega.direccion}</td>
                <td>$${entrega.monto.toFixed(2)}</td>
                <td>${entrega.estado}</td>
                <td><button onclick="window.verDetallesEntrega(${entrega.id})">Ver Detalles</button></td>
            </tr>
        `).join('');
        
        actualizarPaginacion(entregasFiltradas.length);
    }

    function filtrarEntregas() {
        return historialEntregasState.entregas.filter(entrega => {
            const cumpleFechaInicio = !historialEntregasState.filtros.fechaInicio || entrega.fecha >= historialEntregasState.filtros.fechaInicio;
            const cumpleFechaFin = !historialEntregasState.filtros.fechaFin || entrega.fecha <= historialEntregasState.filtros.fechaFin;
            const cumpleEstado = historialEntregasState.filtros.estado === 'todos' || entrega.estado === historialEntregasState.filtros.estado;
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

    function cambiarPagina(nuevaPagina) {
        historialEntregasState.paginaActual = nuevaPagina;
        actualizarTablaHistorial();
    }

    function verDetallesEntrega(idEntrega) {
        const entrega = historialEntregasState.entregas.find(e => e.id === idEntrega);
        if (entrega) {
            const detallesEntrega = document.getElementById('detalles-entrega');
            detallesEntrega.innerHTML = `
                <p><strong>ID Pedido:</strong> ${entrega.id}</p>
                <p><strong>Fecha:</strong> ${entrega.fecha}</p>
                <p><strong>Cliente:</strong> ${entrega.cliente}</p>
                <p><strong>Dirección:</strong> ${entrega.direccion}</p>
                <p><strong>Monto:</strong> $${entrega.monto.toFixed(2)}</p>
                <p><strong>Estado:</strong> ${entrega.estado}</p>
            `;
            document.getElementById('modal-detalles').style.display = 'block';
        }
    }

    function cerrarModalDetalles() {
        document.getElementById('modal-detalles').style.display = 'none';
    }

    window.inicializarModuloHistorialEntregas = inicializarModuloHistorialEntregas;
    window.verDetallesEntrega = verDetallesEntrega;
    window.cerrarModalDetalles = cerrarModalDetalles;

    console.log('Módulo de Historial de Entregas cargado completamente');
})();