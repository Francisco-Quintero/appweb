(function() {
    console.log('Iniciando carga del módulo de Catálogo');

    let inventario = [];
    //let productos = [];
    let carrito = [];

    async function cargarDatosDesdeAPI() {
        try {
            const response = await fetch('http://localhost:26209/api/inventarios'); // Cambia esta URL por la de tu API
            if (!response.ok) {
                throw new Error('Error al cargar los datos desde la API');
            }
            const datos = await response.json();
            inventario = datos || [];
            console.log('Datos cargados desde la API');
            renderizarCatalogo();
        } catch (error) {
            console.error('Error al cargar datos desde la API:', error);
        }
    }

    function cargarDatosDesdeLocalStorage() {
        try {
            const datosGuardados = JSON.parse(localStorage.getItem('datosGlobales') || '{}');
            carrito = datosGuardados.carrito || [];
            console.log('Datos cargados desde localStorage');
        } catch (error) {
            console.error('Error al cargar datos desde localStorage:', error);
        }
    }

    function guardarEnLocalStorage() {
        try {
            const datosActuales = JSON.parse(localStorage.getItem('datosGlobales') || '{}');
            datosActuales.carrito = carrito;
            localStorage.setItem('datosGlobales', JSON.stringify(datosActuales));
            console.log('Datos guardados en localStorage');
        } catch (error) {
            console.error('Error al guardar en localStorage:', error);
        }
    }

    function renderizarCatalogo() {
        console.log('Renderizando catálogo'+ inventario);
        const catalogoContainer = document.getElementById('catalogo-productos');
        if (!catalogoContainer) {
            console.error('No se encontró el contenedor del catálogo');
            return;
        }
    
        const fragment = document.createDocumentFragment();
    
        inventario.forEach(itemInventario => {
            if (itemInventario.stock > 0) {
                if (itemInventario) {
                    const productoCard = document.createElement('div');
                    productoCard.className = 'producto-card';
                    const cantidadEnCarrito = obtenerCantidadEnCarrito(itemInventario.producto.idProducto);
                    productoCard.innerHTML = `
                        <img src="${itemInventario.producto.imagenProducto}" alt="${itemInventario.producto.nombre}" class="producto-imagen">
                        <div class="producto-header">
                            <div>
                                <div class="producto-marca">${itemInventario.producto.categoria}</div>
                                <div class="producto-nombre">${itemInventario.producto.nombre}</div>
                            </div>
                        </div>
                        <div class="producto-precio-gramo">Gramo a ${itemInventario.producto.cantidadMedida}" alt="${itemInventario.producto.unidadMedida}</div>
                        <div class="producto-precio">$${itemInventario.producto.precioUnitario}</div>
                        ${cantidadEnCarrito > 0 ? `
                            <div class="producto-cantidad">
                                <button class="btn-cantidad" data-id="${itemInventario.producto.idProducto}" data-action="restar" aria-label="Disminuir cantidad">-</button>
                                <input type="number" value="${cantidadEnCarrito}"
                                       class="input-cantidad"
                                       data-id="${itemInventario.producto.idProducto}"
                                       aria-label="Cantidad del producto">
                                <button class="btn-cantidad" data-id="${itemInventario.producto.idProducto}" data-action="sumar" aria-label="Aumentar cantidad">+</button>
                            </div>
                        ` : `
                            <button class="btn-agregar" data-id="${itemInventario.producto.idProducto}">
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
        const producto = inventario.producto.find(p => p.idProducto === productoId);
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
        if (window.datosGlobales && typeof window.datosGlobales.actualizarCarrito === 'function') {
            window.datosGlobales.actualizarCarrito(carrito);
        }
        // Aquí puedes agregar código para actualizar la interfaz del carrito si es necesario
        console.log('Carrito actualizado:', carrito);
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

    async function initCatalogo() {
        console.log('Inicializando módulo de catalogo');
        await cargarDatosDesdeAPI();
        cargarDatosDesdeLocalStorage();
        renderizarCatalogo();
        configurarEventListeners();
        console.log('Módulo de catalogo cargado completamente');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCatalogo);
    } else {
        initCatalogo();
    }

    window.addEventListener('load', renderizarCatalogo);
})();