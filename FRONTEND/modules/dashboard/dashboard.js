(function() {
    console.log('Iniciando carga del módulo de dashboard');

    let datosGlobales = {};

    function cargarDatosDesdeLocalStorage() {
        try {
            datosGlobales = JSON.parse(localStorage.getItem('datosGlobales')) || {};
            
            console.log('Datos cargados desde localStorage:', datosGlobales);
        } catch (error) {
            console.error('Error al cargar datos desde localStorage:', error);
        }
    }

    function actualizarTarjetas() {
        const pedidosPendientes = datosGlobales.pedidosPendientes || [];
        const historialVentas = datosGlobales.historialVentas || [];
        const proveedores = datosGlobales.proveedores || [];

        document.querySelector('.card:nth-child(1) .card-value').textContent = pedidosPendientes.length;
        document.querySelector('.card:nth-child(2) .card-value').textContent = historialVentas.length;
        document.querySelector('.card:nth-child(3) .card-value').textContent = historialVentas.reduce((total, venta) => total + venta.total, 0).toFixed(2);
        document.querySelector('.card:nth-child(4) .card-value').textContent = proveedores.length;
    }

    function actualizarActividadesRecientes() {
        const tbody = document.querySelector('.activity-table tbody');
        const actividades = [];

        // Combinar y ordenar pedidos pendientes e historial de ventas
        const todosPedidos = [...(datosGlobales.pedidosPendientes || []), ...(datosGlobales.historialVentas || [])];
        todosPedidos.sort((a, b) => new Date(b.fechaPedido) - new Date(a.fechaPedido));

        // Tomar las 5 actividades más recientes
        todosPedidos.slice(0, 5).forEach(pedido => {
            actividades.push({
                fecha: new Date(pedido.fechaPedido).toLocaleDateString(),
                actividad: `Pedido #${pedido.idPedido}`,
                usuario: pedido.cliente ? pedido.cliente.nombre : 'Cliente no registrado',
                estado: pedido.estadoPedido
            });
        });

        // Actualizar la tabla de actividades
        tbody.innerHTML = actividades.map(actividad => `
            <tr>
                <td>${actividad.fecha}</td>
                <td>${actividad.actividad}</td>
                <td>${actividad.usuario}</td>
                <td><span class="status-badge status-${actividad.estado.toLowerCase().replace(' ', '-')}">${actividad.estado}</span></td>
            </tr>
        `).join('');
    }

    function actualizarGraficoVentas() {
        const historialVentas = datosGlobales.historialVentas || [];
        const ventasPorMes = {};

        historialVentas.forEach(venta => {
            const fecha = new Date(venta.fechaPedido);
            const mes = fecha.toLocaleString('default', { month: 'short' });
            ventasPorMes[mes] = (ventasPorMes[mes] || 0) + venta.total;
        });

        const labels = Object.keys(ventasPorMes);
        const data = Object.values(ventasPorMes);

        const ctx = document.getElementById('sales-chart');
        if (ctx) {
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Ventas',
                        data: data,
                        borderColor: 'rgb(75, 192, 192)',
                        tension: 0.1
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        } else {
            console.error('No se encontró el elemento canvas para el gráfico de ventas');
        }
    }

    function initDashboard() {
        console.log('Inicializando módulo de dashboard');
        cargarDatosDesdeLocalStorage();
        actualizarTarjetas();
        actualizarActividadesRecientes();
        actualizarGraficoVentas();
        console.log('Módulo de dashboard cargado completamente');
    }

    // API pública del módulo
    window.moduloDashboard = {
        init: initDashboard,
        actualizarDashboard: function() {
            cargarDatosDesdeLocalStorage();
            actualizarTarjetas();
            actualizarActividadesRecientes();
            actualizarGraficoVentas();
        }
    };

    // Inicialización del módulo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initDashboard);
    } else {
        initDashboard();
    }

    console.log('Módulo de dashboard cargado');
})();