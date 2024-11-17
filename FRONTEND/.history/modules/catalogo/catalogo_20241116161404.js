// En /FRONTEND/modules/catalogo/catalogo.js

function initCatalogo() {
    console.log('Módulo de catálogo cargado');
    renderizarCatalogo();
}

// Datos de ejemplo para el inventario
let inventario = [
    {
        id: 1,
        nombre: 'Zanahoria Primera',
        marca: 'Sin Marca',
        precio: 4990,
        precioGramo: 4.99,
        stock: 100,
        imagen: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNFNUU3RUIiLz48L3N2Zz4='
    },
    {
        id: 2,
        nombre: 'Cebolla Cabezona Roja',
        marca: 'Sin Marca',
        precio: 4800,
        precioGramo: 4.8,
        stock: 50,
        imagen: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNFNUU3RUIiLz48L3N2Zz4='
    }
];

function renderizarCatalogo() {
    const catalogoContainer = document.getElementById('catalogo-productos');
    catalogoContainer.innerHTML = '';
    
    inventario.forEach(producto => {
        const productoCard = document.createElement('div');
        productoCard.className = 'producto-card';
        const cantidadEnCarrito = obtenerCantidadEnCarrito(producto.id);
        
        productoCard.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}" class="producto-imagen">
            <div class="producto-header">
                <div>
                    <div class="producto-marca">${producto.marca}</div>
                    <div class="producto-nombre">${producto.nombre}</div>
                </div>
                <button class="producto-favorito" aria-label="Agregar a favoritos">
                    <i data-lucide="heart"></i>
                </button>
            </div>
            <div class="producto-precio-gramo">Gramo a $${producto.precioGramo}</div>
            <div class="producto-precio">$${producto.precio.toLocaleString()}</div>
            ${cantidadEnCarrito > 0 ? `
                <div class="producto-cantidad">
                    <button class="btn-cantidad" onclick="actualizarCantidadDesdeProducto(${producto.id}, 'restar')" aria-label="Disminuir cantidad">-</button>
                    <input type="number" value="${cantidadEnCarrito}" 
                           class="input-cantidad" 
                           onchange="actualizarCantidadDirectaDesdeProducto(${producto.id}, this.value)"
                           aria-label="Cantidad del producto">
                    <button class="btn-cantidad" onclick="actualizarCantidadDesdeProducto(${producto.id}, 'sumar')" aria-label="Aumentar cantidad">+</button>
                </div>
            ` : `
                <button class="btn-agregar" onclick="agregarAlCarrito(${producto.id})">
                    Agregar
                </button>
            `}
        `;
        catalogoContainer.appendChild(productoCard);
    });
    
    // Reinicializar los iconos de Lucide
    lucide.createIcons();
}

function obtenerCantidadEnCarrito(productoId) {
    const item = window.carrito.find(item => item.id === productoId);
    return item ? item.cantidad : 0;
}

function actualizarCantidadDesdeProducto(productoId, operacion) {
    const itemIndex = window.carrito.findIndex(item => item.id === productoId);
    if (itemIndex !== -1) {
        if (operacion === 'sumar') {
            window.carrito[itemIndex].cantidad++;
        } else if (operacion === 'restar') {
            if (window.carrito[itemIndex].cantidad > 1) {
                window.carrito[itemIndex].cantidad--;
            } else {
                window.carrito.splice(itemIndex, 1);
            }
        }
        renderizarCatalogo();
        // Aquí deberías llamar a una función para actualizar el carrito en la interfaz
        // Por ejemplo: actualizarInterfazCarrito();
    }
}

function actualizarCantidadDirectaDesdeProducto(productoId, nuevaCantidad) {
    nuevaCantidad = parseInt(nuevaCantidad);
    if (isNaN(nuevaCantidad) || nuevaCantidad < 0) nuevaCantidad = 0;
    
    if (nuevaCantidad === 0) {
        window.carrito = window.carrito.filter(item => item.id !== productoId);
    } else {
        const itemIndex = window.carrito.findIndex(item => item.id === productoId);
        if (itemIndex !== -1) {
            window.carrito[itemIndex].cantidad = nuevaCantidad;
        } else {
            const producto = inventario.find(p => p.id === productoId);
            if (producto) {
                window.carrito.push({...producto, cantidad: nuevaCantidad});
            }
        }
    }
    renderizarCatalogo();
    // Aquí deberías llamar a una función para actualizar el carrito en la interfaz
    // Por ejemplo: actualizarInterfazCarrito();
}

function agregarAlCarrito(productoId) {
    const producto = inventario.find(p => p.id === productoId);
    if (producto) {
        const itemExistente = window.carrito.find(item => item.id === productoId);
        if (itemExistente) {
            itemExistente.cantidad++;
        } else {
            window.carrito.push({...producto, cantidad: 1});
        }
        renderizarCatalogo();
        // Aquí deberías llamar a una función para actualizar el carrito en la interfaz
        // Por ejemplo: actualizarInterfazCarrito();
    }
}

// Asegúrate de que estas funciones estén disponibles globalmente
window.actualizarCantidadDesdeProducto = actualizarCantidadDesdeProducto;
window.actualizarCantidadDirectaDesdeProducto = actualizarCantidadDirectaDesdeProducto;
window.agregarAlCarrito = agregarAlCarrito;
window.inventario = inventario;

// Inicializar el módulo
initCatalogo();