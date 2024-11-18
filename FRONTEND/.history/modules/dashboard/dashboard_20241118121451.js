// modules/dashboard/dashboard.js
(function() {
    console.log('Iniciando carga del módulo de dashboard');

    function crearGraficoVentas() {
        const ctx = document.getElementById('sales-chart');
        if (ctx) {
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
                    datasets: [{
                        label: 'Ventas',
                        data: [12, 19, 3, 5, 2, 3],
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

    function actualizarEstadisticas() {
        // Aquí puedes agregar lógica para actualizar las estadísticas en las tarjetas
        console.log('Actualizando estadísticas...');
    }

    function initDashboard() {
        console.log('Inicializando módulo de dashboard');
        crearGraficoVentas();
        actualizarEstadisticas();
        console.log('Módulo de dashboard cargado completamente');
    }

    // API pública del módulo
    window.moduloDashboard = {
        init: initDashboard
    };

    console.log('Módulo de dashboard cargado');
})();