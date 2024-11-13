document.addEventListener('DOMContentLoaded', function() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanes = document.querySelectorAll('.tab-pane');
    const productosLista = document.getElementById('productos-lista');
    const carritoLista = document.getElementById('carrito-lista');
    const itemsCount = document.getElementById('items-count');
    const subtotalElement = document.getElementById('subtotal');
    const totalElement = document.getElementById('total');

    const productos = [
        {
            id: 1,
            nombre: 'Zanahoria Primera',
            marca: 'Sin Marca',
            precioGramo: 4.99,
            precio: 4990,
            imagen: '/placeholder.svg',
            enCarrito: false,
            cantidad: 1
        },
        {
            id: 2,
            nombre: 'Cebolla Cabezona Roja',
            marca: 'Sin Marca',
            precioGramo: 4.8,
            precio: 4800,
            imagen: '/placeholder.svg',
            enCarrito: false,
            cantidad: 1
        }
    ];

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));

            button.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });

    function renderizarProducto(producto, enCarrito = false) {
        const productoElement = document.createElement('div');
        productoElement.className = 'producto-card';
        productoElement.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}" class="producto-imagen">
            <button class="btn-favorito" onclick="toggleFavorito(this)">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
            </button>
            <div class="producto-marca">${producto.marca}</div>
            <div class="producto-nombre">${producto.nombre}</div>
            <div class="producto-precio-gramo">Gramo a $${producto.precioGramo}</div>
            <div class="producto-precio">$${producto.precio}</div>
            ${enCarrito ? `
                <div class="cantidad-control">
                    <button class="btn-cantidad" onclick="actualizarCantidad(${producto.id}, -1)">-</button>
                    <input type="number" value="${producto.cantidad}" min="1" class="input-cantidad" 
                           onchange="actualizarCantidadDirecta(${producto.id}, this.value)">
                    <button class="btn-cantidad" onclick="actualizarCantidad(${producto.id}, 1)">+</button>
                </div>
            ` : `
                <button class="btn-agregar" onclick="agregarAlCarrito(${producto.id})">Agregar</button>
            `}
        `;
        return productoElement;
    }

    function renderizarProductos() {
        productosLista.innerHTML = '';
        productos.forEach(producto => {
            if (!producto.enCarrito) {
                productosLista.appendChild(renderizarProducto(producto));
            }
        });
    }

    function actualizarCarrito() {
        carritoLista.innerHTML = '';
        
        let subtotal = 0;
        let itemsTotal = 0;
        
        productos.forEach(producto => {
            if (producto.enCarrito) {
                itemsTotal += producto.cantidad;
                const itemTotal = producto.precio * producto.cantidad;
                subtotal += itemTotal;
                
                const itemElement = document.createElement('div');
                itemElement.className = 'carrito-item';
                itemElement.innerHTML = `
                    <img src="${producto.imagen}" alt="${producto.nombre}" class="item-imagen">
                    <div class="item-detalles">
                        <div class="item-nombre">${producto.nombre}</div>
                        <div class="item-precio">$${itemTotal.toLocaleString()}</div>
                        <div class="item-precio-gramo">Gramo a $${producto.precioGramo}</div>
                        <div class="cantidad-controles">
                            <button class="btn-cantidad" onclick="actualizarCantidad(${producto.id}, -1)">-</button>
                            <input type="number" value="${producto.cantidad}" min="1" 
                                   class="input-cantidad" 
                                   onchange="actualizarCantidadDirecta(${producto.id}, this.value)">
                            <button class="btn-cantidad" onclick="actualizarCantidad(${producto.id}, 1)">+</button>
                            <button class="btn-eliminar" onclick="eliminarDelCarrito(${producto.id})">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                `;
                carritoLista.appendChild(itemElement);
            }
        });
        
        itemsCount.textContent = `${itemsTotal} items agregados`;
        subtotalElement.textContent = `$${subtotal.toLocaleString()}`;
        totalElement.textContent = `$${subtotal.toLocaleString()}`;
    }

    window.toggleFavorito = function(button) {
        button.classList.toggle('active');
    };

    window.agregarAlCarrito = function(productoId) {
        const producto = productos.find(p => p.id === productoId);
        if (producto) {
            producto.enCarrito = true;
            producto.cantidad = 1;
            actualizarCarrito();
            renderizarProductos();
        }
    };

    window.actualizarCantidad = function(productoId, cambio) {
        const producto = productos.find(p => p.id === productoId);
        if (producto) {
            const nuevaCantidad = producto.cantidad + cambio;
            if (nuevaCantidad >= 1) {
                producto.cantidad = nuevaCantidad;
            } else {
                producto.enCarrito = false;
                producto.cantidad = 1;
            }
            actualizarCarrito();
            renderizarProductos();
        }
    };

    window.actualizarCantidadDirecta = function(productoId, nuevaCantidad) {
        const producto = productos.find(p => p.id === productoId);
        if (producto) {
            const cantidad = parseInt(nuevaCantidad);
            if (cantidad >= 1) {
                producto.cantidad = cantidad;
            } else {
                producto.enCarrito = false;
                producto.cantidad = 1;
            }
            actualizarCarrito();
            renderizarProductos();
        }
    };

    window.eliminarDelCarrito = function(productoId) {
        const producto = productos.find(p => p.id === productoId);
        if (producto) {
            producto.enCarrito = false;
            producto.cantidad = 1;
            actualizarCarrito();
            renderizarProductos();
        }
    };

    // Inicializar la vista
    renderizarProductos();
    actualizarCarrito();

    // Eventos para los botones
    document.getElementById('ir-a-pagar').addEventListener('click', () => {
        console.log('Procediendo al pago');
        // Aquí iría la lógica para proceder al pago
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