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

    // Ejemplo de carga de productos en el catálogo
    const productosLista = document.getElementById('productos-lista');
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
            <button onclick="agregarAlCarrito(${producto.id})">Agregar al carrito</button>
        `;
        productosLista.appendChild(productoElement);
    });

    // Función para agregar al carrito (ejemplo)
    window.agregarAlCarrito = function(productoId) {
        console.log(`Producto ${productoId} agregado al carrito`);
        // Aquí implementarías la lógica real para agregar al carrito
    };

    // Eventos para los botones
    document.getElementById('proceder-pago').addEventListener('click', () => {
        console.log('Procediendo al pago');
    });

    document.getElementById('ver-detalles').addEventListener('click', () => {
        console.log('Viendo detalles de pedidos');
    });

    document.getElementById('pagar-ahora').addEventListener('click', () => {
        console.log('Realizando pago');
    });

    document.getElementById('actualizar-ubicacion').addEventListener('click', () => {
        console.log('Actualizando ubicación del pedido');
    });
});