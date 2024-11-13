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
            cantidad: 0
        },
        {
            id: 2,
            nombre: 'Cebolla Cabezona Roja',
            marca: 'Sin Marca',
            precioGramo: 4.8,
            precio: 4800,
            imagen: '/placeholder.svg',
            cantidad: 0
        },
        {
            id: 3,
            nombre: 'Carbon negro',
            marca: 'Sin Marca',
            precioGramo: 8.0,
            precio: 2200,
            imagen: '/placeholder.svg',
            cantidad: 0
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
            ${producto.cantidad === 0 ? `
                <button class="btn-agregar" onclick="agregarAlCarrito(${producto.id})">Agregar al carrito</button>
            ` : `
                <div class="cantidad-control">
                    <button class="btn-cantidad" onclick="actualizarCantidad(${producto.id}, -1)">-</button>
                    <input type="number" value="${producto.cantidad}" min="0" class="input-cantidad" 
                           onchange="actualizarCantidadDirecta(${producto.id}, this.value)">
                    <button class="btn-cantidad" onclick="actualizarCantidad(${producto.id}, 1)">+</button>
                </div>
            `}
            ${enCarrito ? `
                <button class="btn-eliminar" onclick="eliminarDelCarrito(${producto.id})">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
                    </svg>
                </button>
            ` : ''}
        `;
        return productoElement;
    }

    function renderizarProductos() {
        productosLista.innerHTML = '';
        productos.forEach(producto => {
            productosLista.appendChild(renderizarProducto(producto));
        });
    }

    function actualizarCarrito() {
        carritoLista.innerHTML = '';
        
        let subtotal = 0;
        let itemsTotal = 0;
        
        productos.forEach(producto => {
            if (producto.cantidad > 0) {
                itemsTotal += producto.cantidad;
                const itemTotal = producto.precio * producto.cantidad;
                subtotal += itemTotal;
                
                carritoLista.appendChild(renderizarProducto(producto, true));
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
            producto.cantidad = 1;
            actualizarCarrito();
            renderizarProductos();
        }
    };

    window.actualizarCantidad = function(productoId, cambio) {
        const producto = productos.find(p => p.id === productoId);
        if (producto) {
            const nuevaCantidad = producto.cantidad + cambio;
            if (nuevaCantidad >= 0) {
                producto.cantidad = nuevaCantidad;
                actualizarCarrito();
                renderizarProductos();
            }
        }
    };

    window.actualizarCantidadDirecta = function(productoId, nuevaCantidad) {
        const producto = productos.find(p => p.id === productoId);
        if (producto) {
            const cantidad = parseInt(nuevaCantidad);
            if (cantidad >= 0) {
                producto.cantidad = cantidad;
                actualizarCarrito();
                renderizarProductos();
            }
        }
    };

    window.eliminarDelCarrito = function(productoId) {
        const producto = productos.find(p => p.id === productoId);
        if (producto) {
            producto.cantidad = 0;
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

// Agregar estas funciones al archivo JavaScript existente

function inicializarPedidos() {
    const pedidosLista = document.getElementById('pedidos-lista');
    const pedidosEmpty = document.getElementById('pedidos-empty');
    const fechaDesde = document.getElementById('fecha-desde');
    const fechaHasta = document.getElementById('fecha-hasta');
    
    // Ejemplo de pedidos (en una aplicación real, estos vendrían de una base de datos)
    const pedidos = [
        {
            numero: 'PED-001',
            fecha: '2024-01-15',
            estado: 'pendiente',
            total: 25000,
            items: [
                { nombre: 'Zanahoria Primera', cantidad: 2, precio: 4990 },
                { nombre: 'Cebolla Cabezona Roja', cantidad: 3, precio: 4800 }
            ]
        },
        {
            numero: 'PED-002',
            fecha: '2024-02-02',
            estado: 'enviado',
            total: 2000,
            items: [
                { nombre: 'Pan de queso', cantidad: 1, precio: 500 },
                { nombre: 'Pan de mantequilla', cantidad: 3, precio: 1500 }
            ]
        }
        // Aquí irían más pedidos
    ];

    function renderizarPedidos(pedidosFiltrados = pedidos) {
        if (pedidosFiltrados.length === 0) {
            pedidosLista.style.display = 'none';
            pedidosEmpty.style.display = 'block';
        } else {
            pedidosLista.style.display = 'block';
            pedidosEmpty.style.display = 'none';
            
            pedidosLista.innerHTML = pedidosFiltrados.map(pedido => `
                <div class="pedido-item">
                    <div class="pedido-header">
                        <span class="pedido-numero">Pedido ${pedido.numero}</span>
                        <span class="pedido-fecha">${formatearFecha(pedido.fecha)}</span>
                        <span class="pedido-estado estado-${pedido.estado}">${
                            pedido.estado.charAt(0).toUpperCase() + pedido.estado.slice(1)
                        }</span>
                    </div>
                    <div class="pedido-items">
                        ${pedido.items.map(item => `
                            <div class="pedido-item-detalle">
                                <span>${item.nombre} x ${item.cantidad}</span>
                                <span>$${(item.precio * item.cantidad).toLocaleString()}</span>
                            </div>
                        `).join('')}
                    </div>
                    <div class="pedido-total">
                        <strong>Total: $${pedido.total.toLocaleString()}</strong>
                    </div>
                </div>
            `).join('');
        }
    }

    function formatearFecha(fecha) {
        return new Date(fecha).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    // Eventos para los filtros
    fechaDesde.addEventListener('change', filtrarPedidos);
    fechaHasta.addEventListener('change', filtrarPedidos);
    document.querySelector('.estado-select').addEventListener('change', filtrarPedidos);
    document.querySelector('.busqueda-input').addEventListener('input', filtrarPedidos);

    function filtrarPedidos() {
        const desde = fechaDesde.value;
        const hasta = fechaHasta.value;
        const estado = document.querySelector('.estado-select').value;
        const busqueda = document.querySelector('.busqueda-input').value.toLowerCase();

        const pedidosFiltrados = pedidos.filter(pedido => {
            const cumpleFecha = (!desde || pedido.fecha >= desde) && 
                              (!hasta || pedido.fecha <= hasta);
            const cumpleEstado = estado === 'todos' || pedido.estado === estado;
            const cumpleBusqueda = pedido.numero.toLowerCase().includes(busqueda) ||
                                 pedido.items.some(item => 
                                     item.nombre.toLowerCase().includes(busqueda)
                                 );

            return cumpleFecha && cumpleEstado && cumpleBusqueda;
        });

        renderizarPedidos(pedidosFiltrados);
    }

    // Inicializar la vista
    renderizarPedidos();

    // Evento para el botón "Ver categorías"
    document.querySelector('.btn-ver-categorias').addEventListener('click', () => {
        // Cambiar a la pestaña de catálogo
        document.querySelector('[data-tab="catalogo"]').click();
    });
}

// Agregar la inicialización de pedidos al DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    // ... código existente ...
    inicializarPedidos();
});