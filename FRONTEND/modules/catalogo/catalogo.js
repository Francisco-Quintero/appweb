(function() {
    console.log('Iniciando carga del módulo de Catálogo');

    let inventario = [];
    let productos = [];
    let carrito = [];

    function cargarDatosDesdeLocalStorage() {
        try {
            const datosGuardados = JSON.parse(localStorage.getItem('datosGlobales') || '{}');
            inventario = datosGuardados.inventario || [];
            productos = datosGuardados.productos || [];
            carrito = datosGuardados.carrito || [];
            console.log('Datos cargados desde localStorage');
        } catch (error) {
            console.error('Error al cargar datos desde localStorage:', error);
        }
    }

    function guardarEnLocalStorage() {
        try {
            const datosActuales = JSON.parse(localStorage.getItem('datosGlobales') || '{}');
            datosActuales.productos = productos;
            datosActuales.inventario = inventario;
            datosActuales.carrito = carrito;
            localStorage.setItem('datosGlobales', JSON.stringify(datosActuales));
            console.log('Datos guardados en localStorage');
        } catch (error) {
            console.error('Error al guardar en localStorage:', error);
        }
    }

    function sincronizarConDatosGlobales() {
        if (window.datosGlobales) {
            inventario = Array.isArray(window.datosGlobales.inventario) ? window.datosGlobales.inventario : [];
            productos = Array.isArray(window.datosGlobales.productos) ? window.datosGlobales.productos : [];
            carrito = Array.isArray(window.datosGlobales.carrito) ? window.datosGlobales.carrito : [];
            renderizarCatalogo();
            console.log('Datos sincronizados con datosGlobales');
        }
    }

    function renderizarCatalogo() {
        console.log('Renderizando catálogo');
        console.log(inventario);
        const catalogoContainer = document.getElementById('catalogo-productos');
        if (!catalogoContainer) {
            console.error('No se encontró el contenedor del catálogo');
            return;
        }
    
        const productosMap = new Map(productos.map(p => [p.idProducto, p]));
        const fragment = document.createDocumentFragment();
    
        inventario.forEach(itemInventario => {
            if (itemInventario.stock > 0) {
                const producto = productosMap.get(itemInventario.idProducto);
                
                if (producto) {
                    const productoCard = document.createElement('div');
                    productoCard.className = 'producto-card';
                    const cantidadEnCarrito = obtenerCantidadEnCarrito(producto.idProducto);
    
                    productoCard.innerHTML = `
                        <img src="${producto.imagenProducto}" alt="${producto.Nombre}" class="producto-imagen">
                        <div class="producto-header">
                            <div>
                                <div class="producto-marca">${producto.categoria}</div>
                                <div class="producto-nombre">${producto.Nombre}</div>
                            </div>
                            <button class="producto-favorito" aria-label="Agregar a favoritos">
                                <i data-lucide="heart"></i>
                            </button>
                        </div>
                        <div class="producto-precio-gramo">Gramo a ${producto.valorMedida}" alt="${producto.unidadMedida}</div>
                        <div class="producto-precio">$${producto.precioUnitario}</div>
                        ${cantidadEnCarrito > 0 ? `
                            <div class="producto-cantidad">
                                <button class="btn-cantidad" data-id="${producto.idProducto}" data-action="restar" aria-label="Disminuir cantidad">-</button>
                                <input type="number" value="${cantidadEnCarrito}"
                                       class="input-cantidad"
                                       data-id="${producto.idProducto}"
                                       aria-label="Cantidad del producto">
                                <button class="btn-cantidad" data-id="${producto.idProducto}" data-action="sumar" aria-label="Aumentar cantidad">+</button>
                            </div>
                        ` : `
                            <button class="btn-agregar" data-id="${producto.idProducto}">
                                Agregar
                            </button>
                        `}
                    `;
                    fragment.appendChild(productoCard);
                }
            }
        });
    
        catalogoContainer.innerHTML = '';
        catalogoContainer.appendChild(fragment);
    
        lucide.createIcons();
    }
    
    function obtenerCantidadEnCarrito(productoId) {
        const productoEnCarrito = carrito.find(item => item.idProducto === productoId);
        return productoEnCarrito ? productoEnCarrito.cantidad : 0;
    }
    
    function actualizarCantidadDesdeProducto(productoId, operacion) {
        const itemIndex = carrito.findIndex(item => item.idProducto === productoId);
        if (itemIndex !== -1) {
            if (operacion === 'sumar') {
                carrito[itemIndex].cantidad++;
            } else if (operacion === 'restar') {
                if (carrito[itemIndex].cantidad > 1) {
                    carrito[itemIndex].cantidad--;
                } else {
                    carrito.splice(itemIndex, 1);
                }
            }
            actualizarCarrito();
        }
    }

    function actualizarCantidadDirectaDesdeProducto(productoId, nuevaCantidad) {
        nuevaCantidad = parseInt(nuevaCantidad);
        if (isNaN(nuevaCantidad) || nuevaCantidad < 0) nuevaCantidad = 0;

        if (nuevaCantidad === 0) {
            carrito = carrito.filter(item => item.idProducto !== productoId);
        } else {
            const itemIndex = carrito.findIndex(item => item.idProducto === productoId);
            if (itemIndex !== -1) {
                carrito[itemIndex].cantidad = nuevaCantidad;
            } else {
                const producto = productos.find(p => p.idProducto === productoId);
                if (producto) {
                    carrito.push({...producto, cantidad: nuevaCantidad});
                }
            }
        }
        actualizarCarrito();
    }

    function agregarAlCarrito(productoId) {
        const producto = productos.find(p => p.idProducto === productoId);
        if (producto) {
            const itemExistente = carrito.find(item => item.idProducto === productoId);
            if (itemExistente) {
                itemExistente.cantidad++;
            } else {
                carrito.push({...producto, cantidad: 1});
            }
            actualizarCarrito();
        }
    }

    function actualizarCarrito() {
        guardarEnLocalStorage();
        renderizarCatalogo();
        actualizarCartCount();
        if (window.datosGlobales && typeof window.datosGlobales.actualizarCarrito === 'function') {
            window.datosGlobales.actualizarCarrito(carrito);
        }
        console.log('Carrito actualizado:', carrito);

        const event = new CustomEvent('actualizacionCatalogo', { 
            detail: { productoId: productoId, cantidad: nuevaCantidad }
        });
        window.dispatchEvent(event);
    }

    function actualizarCartCount() {
        const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);
        const cartCountElement = document.querySelector('.cart-count');
        if (cartCountElement) {
            cartCountElement.textContent = totalItems;
        }
    }

    function configurarEventListeners() {
        console.log('Configurando event listeners del catálogo');
        const catalogoContainer = document.getElementById('catalogo-productos');

        catalogoContainer.addEventListener('click', (event) => {
            const target = event.target;
            if (target.classList.contains('btn-cantidad')) {
                const productoId = parseInt(target.dataset.id);
                const accion = target.dataset.action;
                actualizarCantidadDesdeProducto(productoId, accion);
            } else if (target.classList.contains('btn-agregar')) {
                const productoId = parseInt(target.dataset.id);
                agregarAlCarrito(productoId);
            }
        });

        catalogoContainer.addEventListener('change', (event) => {
            const target = event.target;
            if (target.classList.contains('input-cantidad')) {
                const productoId = parseInt(target.dataset.id);
                const nuevaCantidad = parseInt(target.value);
                actualizarCantidadDirectaDesdeProducto(productoId, nuevaCantidad);
            }
        });
    }

    function initCatalogo() {
        console.log('Inicializando módulo de catalogo');
        cargarDatosDesdeLocalStorage();
        renderizarCatalogo();
        configurarEventListeners();
        
        window.addEventListener('datosGlobalesListo', sincronizarConDatosGlobales);
        
        if (window.datosGlobales) {
            sincronizarConDatosGlobales();
        }
        
        console.log('Módulo de catalogo cargado completamente');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCatalogo);
    } else {
        initCatalogo();
    }

    window.addEventListener('load', renderizarCatalogo);
})();

