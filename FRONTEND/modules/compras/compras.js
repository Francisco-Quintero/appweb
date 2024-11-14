// En modules/purchases/purchases.js
function initCompras() {
    console.log('Módulo de compras cargado');

    let compras = [
        { id: 1, fecha: '2023-05-15', proveedor: 'Proveedor A', total: 1500.00, estado: 'Completada' },
        { id: 2, fecha: '2023-05-16', proveedor: 'Proveedor B', total: 2000.00, estado: 'Pendiente' },
    ];

    function cargarCompras() {
        const cuerpoTabla = document.getElementById('cuerpoTablaCompras');
        cuerpoTabla.innerHTML = '';
        compras.forEach(compra => {
            const fila = `
                <tr>
                    <td>${compra.id}</td>
                    <td>${compra.fecha}</td>
                    <td>${compra.proveedor}</td>
                    <td>$${compra.total.toFixed(2)}</td>
                    <td>${compra.estado}</td>
                    <td>
                        <button onclick="verDetallesCompra(${compra.id})" class="btn btn-secundario">Ver más</button>
                    </td>
                </tr>
            `;
            cuerpoTabla.innerHTML += fila;
        });
    }

    function verDetallesCompra(id) {
        const compra = compras.find(c => c.id === id);
        if (compra) {
            const detallesCompra = document.getElementById('detallesCompra');
            detallesCompra.innerHTML = `
                <h4>Compra #${compra.id}</h4>
                <p><strong>Fecha:</strong> ${compra.fecha}</p>
                <p><strong>Proveedor:</strong> ${compra.proveedor}</p>
                <p><strong>Total:</strong> $${compra.total.toFixed(2)}</p>
                <p><strong>Estado:</strong> ${compra.estado}</p>
                <h4>Suministros</h4>
                <table>
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Cantidad</th>
                            <th>Precio Unitario</th>
                            <th>Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Producto A</td>
                            <td>10</td>
                            <td>$50.00</td>
                            <td>$500.00</td>
                        </tr>
                        <tr>
                            <td>Producto B</td>
                            <td>20</td>
                            <td>$25.00</td>
                            <td>$500.00</td>
                        </tr>
                        <!-- Aquí puedes agregar más filas de suministros -->
                    </tbody>
                </table>
            `;
            document.getElementById('modalCompra').style.display = 'block';
        }
    }

    function buscarCompras() {
        const termino = document.getElementById('busquedaCompra').value.toLowerCase();
        const comprasFiltradas = compras.filter(c => 
            c.proveedor.toLowerCase().includes(termino) ||
            c.fecha.includes(termino) ||
            c.estado.toLowerCase().includes(termino)
        );
        const cuerpoTabla = document.getElementById('cuerpoTablaCompras');
        cuerpoTabla.innerHTML = '';
        comprasFiltradas.forEach(compra => {
            const fila = `
                <tr>
                    <td>${compra.id}</td>
                    <td>${compra.fecha}</td>
                    <td>${compra.proveedor}</td>
                    <td>$${compra.total.toFixed(2)}</td>
                    <td>${compra.estado}</td>
                    <td>
                        <button onclick="verDetallesCompra(${compra.id})" class="btn btn-secundario">Ver más</button>
                    </td>
                </tr>
            `;
            cuerpoTabla.innerHTML += fila;
        });
    }

    // Configurar event listeners
    document.getElementById('btnNuevaCompra').addEventListener('click', () => {
        alert('Funcionalidad de nueva compra aún no implementada');
    });

    document.getElementById('btnCerrarModal').addEventListener('click', () => {
        document.getElementById('modalCompra').style.display = 'none';
    });

    document.getElementById('btnBuscar').addEventListener('click', buscarCompras);

    // Exponer funciones necesarias globalmente
    window.verDetallesCompra = verDetallesCompra;

    // Cargar compras iniciales
    cargarCompras();
}

// Asegúrate de que la función initPurchases esté disponible globalmente
window.initPurchases = initPurchases;