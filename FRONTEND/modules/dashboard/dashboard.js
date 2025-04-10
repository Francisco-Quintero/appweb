export async function initDashboard(estadoGlobal) {
    console.log('Inicializando módulo de dashboard');
    actualizarTarjetas(estadoGlobal);
    actualizarActividadesRecientes(estadoGlobal);
    actualizarGraficoVentas(estadoGlobal);
    console.log('Módulo de dashboard cargado completamente');
}

// Actualizar las tarjetas del dashboard
function actualizarTarjetas(estadoGlobal) {
    const pedidosPendientes = estadoGlobal.pedidosPendientes || [];
    const historialVentas = estadoGlobal.historialVentas || [];
    const proveedores = estadoGlobal.proveedores || [];

    document.querySelector('.card:nth-child(1) .card-value').textContent = pedidosPendientes.length;
    document.querySelector('.card:nth-child(2) .card-value').textContent = historialVentas.length;
    document.querySelector('.card:nth-child(3) .card-value').textContent = historialVentas.reduce((total, venta) => total + venta.total, 0).toFixed(2);
    document.querySelector('.card:nth-child(4) .card-value').textContent = proveedores.length;
}

// Actualizar la tabla de actividades recientes
function actualizarActividadesRecientes(estadoGlobal) {
    const tbody = document.querySelector('.activity-table tbody');
    const actividades = [];

    const todosPedidos = [...(estadoGlobal.pedidosPendientes || []), ...(estadoGlobal.historialVentas || [])];
    todosPedidos.sort((a, b) => new Date(b.fechaPedido) - new Date(a.fechaPedido));

    todosPedidos.slice(0, 5).forEach(pedido => {
        actividades.push({
            fecha: new Date(pedido.fechaPedido).toLocaleDateString(),
            actividad: `Pedido #${pedido.idPedido}`,
            usuario: pedido.cliente ? pedido.cliente.nombre : 'Cliente no registrado',
            estado: pedido.estadoPedido
        });
    });

    tbody.innerHTML = actividades.map(actividad => `
        <tr>
            <td>${actividad.fecha}</td>
            <td>${actividad.actividad}</td>
            <td>${actividad.usuario}</td>
            <td><span class="status-badge status-${actividad.estado.toLowerCase().replace(' ', '-')}">${actividad.estado}</span></td>
        </tr>
    `).join('');
}

// Actualizar el gráfico de ventas
function actualizarGraficoVentas(estadoGlobal) {
    const historialVentas = estadoGlobal.historialVentas || [];
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