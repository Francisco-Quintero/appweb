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

    function cargarChartJS(callback) {
        if (typeof Chart === 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
            script.onload = callback;
            document.head.appendChild(script);
        } else {
            callback();
        }
    }

    function crearElementoCanvas() {
        const contenedor = document.getElementById('dashboard-container');
        if (!contenedor) {
            console.error('No se encontró el contenedor del dashboard');
            return null;
        }
        const canvas = document.createElement('canvas');
        canvas.id = 'sales-chart';
        canvas.width = 400;
        canvas.height = 200;
        contenedor.appendChild(canvas);
        return canvas;
    }

    function crearGraficoVentas() {
        const canvas = document.getElementById('sales-chart') || crearElementoCanvas();
        if (!canvas) {
            console.error('No se pudo crear o encontrar el elemento canvas para el gráfico de ventas');
            return;
        }

        new Chart(canvas.getContext('2d'), {
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
    }

    function cargarEstadisticasResumen() {
        console.log('Cargando estadísticas resumen...');
        const contenedor = document.getElementById('dashboard-container');
        if (contenedor) {
            contenedor.innerHTML += `
                <div class="estadisticas-resumen">
                    <div class="estadistica">
                        <h3>Total Ventas</h3>
                        <p id="total-ventas">$10,000</p>
                    </div>
                    <div class="estadistica">
                        <h3>Total Pedidos</h3>
                        <p id="total-pedidos">50</p>
                    </div>
                    <div class="estadistica">
                        <h3>Clientes Nuevos</h3>
                        <p id="clientes-nuevos">10</p>
                    </div>
                </div>
            `;
        } else {
            console.error('No se encontró el contenedor del dashboard para las estadísticas');
        }
    }

    function actualizarDashboard() {
        cargarChartJS(() => {
            crearGraficoVentas();
            cargarEstadisticasResumen();
        });
    }

    function initDashboard() {
        console.log('Inicializando módulo de dashboard');
        const contenedor = document.getElementById('main-container');
        if (contenedor) {
            contenedor.innerHTML = '<div id="dashboard-container"></div>';
            actualizarDashboard();
        } else {
            console.error('No se encontró el contenedor principal para el dashboard');
        }
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