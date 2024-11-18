// dashboard.js
(function() {
    console.log('Iniciando carga del módulo de dashboard');

    // Datos de ejemplo para el gráfico
    const datosVentas = {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
        datasets: [{
            label: 'Ventas',
            data: [12, 19, 3, 5, 2, 3],
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
        }]
    };

    function crearGraficoVentas() {
        const ctx = document.getElementById('sales-chart');
        if (ctx) {
            new Chart(ctx, {
                type: 'line',
                data: datosVentas,
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

    function cargarEstadisticasResumen() {
        // Aquí puedes agregar lógica para cargar estadísticas resumidas
        console.log('Cargando estadísticas resumen...');
        // Ejemplo:
        document.getElementById('total-ventas')?.textContent = '$10,000';
        document.getElementById('total-pedidos')?.textContent = '50';
        document.getElementById('clientes-nuevos')?.textContent = '10';
    }

    function actualizarDashboard() {
        crearGraficoVentas();
        cargarEstadisticasResumen();
    }

    function initDashboard() {
        console.log('Inicializando módulo de dashboard');
        actualizarDashboard();
        // Aquí puedes agregar más lógica de inicialización si es necesario
        console.log('Módulo de dashboard cargado completamente');
    }

    // API pública del módulo
    window.moduloDashboard = {
        init: initDashboard,
        actualizar: actualizarDashboard
    };

    // Inicialización del módulo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initDashboard);
    } else {
        initDashboard();
    }

    console.log('Módulo de dashboard cargado');
})();