document.addEventListener('DOMContentLoaded', function() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));

            button.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Ejemplo de carga de productos en el catálogo del admin
    const productosAdminLista = document.getElementById('productos-admin-lista');
    const productos = [
        { id: 1, nombre: 'Manzanas', precio: 2.5, stock: 100 },
        { id: 2, nombre: 'Leche', precio: 1.8, stock: 50 },
        { id: 3, nombre: 'Pan', precio: 1.2, stock: 30 },
    ];

    productos.forEach(producto => {
        const productoElement = document.createElement('div');
        productoElement.innerHTML = `
            <h3>${producto.nombre}</h3>
            <p>Precio: $${producto.precio.toFixed(2)}</p>
            <p>Stock: ${producto.stock}</p>
            <button onclick="editarProducto(${producto.id})">Editar</button>
            <button onclick="eliminarProducto(${producto.id})">Eliminar</button>
        `;
        productosAdminLista.appendChild(productoElement);
    });

    // Funciones para gestión de productos (ejemplos)
    window.editarProducto = function(productoId) {
        console.log(`Editando producto ${productoId}`);
        // Aquí implementarías la lógica real para editar un producto
    };

    window.eliminarProducto = function(productoId) {
        console.log(`Eliminando producto ${productoId}`);
        // Aquí implementarías la lógica real para eliminar un producto
    };

    // Eventos para los botones
    document.getElementById('anadir-producto').addEventListener('click', () => {
        console.log('Añadiendo nuevo producto');
    });

    document.getElementById('generar-reporte').addEventListener('click', () => {
        console.log('Generando reporte de ventas');
    });

    document.getElementById('generar-factura').addEventListener('click', () => {
        console.log('Generando nueva factura');
    });
});