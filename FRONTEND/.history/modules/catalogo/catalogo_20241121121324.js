(function() {
    console.log('Iniciando carga del módulo de Catálogo');

    // let catalogoState = {
    //     eventListeners: [],
    //     appStateRef: null
    // };

    let inventario = [];
    let productos = [];

    function cargarDatosDesdeLocalStorage() {
        try {
            const datosGuardados = JSON.parse(localStorage.getItem('datosGlobales') || '{}');
            inventario = datosGuardados.inventario || [];
            productos = datosGuardados.productos || [] ;            console.log('Inventario cargado desde localStorage');
        } catch (error) {
            console.error('Error al cargar datos desde localStorage:', error);
        }
    }

    // function guardarEnLocalStorage() {
    //     try {
    //         const datosActuales = JSON.parse(localStorage.getItem('datosGlobales') || '{}');
    //         datosActuales.productos = productos;
    //         localStorage.setItem('datosGlobales', JSON.stringify(datosActuales));
    //         console.log('Datos guardados en localStorage');
    //     } catch (error) {
    //         console.error('Error al guardar en localStorage:', error);
    //     }
    // }

    function sincronizarConDatosGlobales() {
        if (window.datosGlobales) {
            if (Array.isArray(window.datosGlobales.inventario)) {
                inventario = window.datosGlobales.inventario;
            }
            if (Array.isArray(window.datosGlobales.productos)) {
                productos = window.datosGlobales.productos;
            }
            renderizarCatalogo();
            console.log('Datos sincronizados con datosGlobales');
        }
    }





    function addEventListenerWithCleanup(element, event, handler) {
        if (element) {
            element.addEventListener(event, handler);
            catalogoState.eventListeners.push({ element, event, handler });
        }
    }

    function cleanup() {
        console.log('Limpiando módulo de Catálogo');
        catalogoState.eventListeners.forEach(({ element, event, handler }) => {
            if (element) {
                element.removeEventListener(event, handler);
            }
        });
        catalogoState.eventListeners = [];
        catalogoState.appStateRef = null;
    }

    function renderizarCatalogo() {
        console.log('Renderizando catálogo');
        const catalogoContainer = document.getElementById('catalogo-productos');
        if (!catalogoContainer) {
            console.error('No se encontró el contenedor del catálogo');
            return;
        }
    
        // Crear un mapa de productos para búsqueda rápida
        const productosMap = new Map(productos.map(p => [p.idProducto, p]));
    
        // Usar un fragmento de documento para reducir manipulaciones del DOM
        const fragment = document.createDocumentFragment();
    
        inventario.forEach(itemInventario => {
            if (itemInventario.cantidad > 0) {
                const producto = productosMap.get(itemInventario.idProducto);
                
                if (producto) {
                    const productoCard = document.createElement('div');
                    productoCard.className = 'producto-card';
                    const cantidadEnCarrito = obtenerCantidadEnCarrito(appState, producto.id);
    
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
                        <div class="producto-inventario">Disponible: ${itemInventario.cantidad}</div>
                        ${cantidadEnCarrito > 0 ? `
                            <div class="producto-cantidad">
                                <button class="btn-cantidad" data-id="${producto.id}" data-action="restar" aria-label="Disminuir cantidad">-</button>
                                <input type="number" value="${cantidadEnCarrito}"
                                       class="input-cantidad"
                                       data-id="${producto.id}"
                                       aria-label="Cantidad del producto">
                                <button class="btn-cantidad" data-id="${producto.id}" data-action="sumar" aria-label="Aumentar cantidad">+</button>
                            </div>
                        ` : `
                            <button class="btn-agregar" data-id="${producto.id}">
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
    
        // Reinicializar los iconos de Lucide
        lucide.createIcons();
    }
    
    function obtenerCantidadEnCarrito(appState, productoId) {
        const productoEnCarrito = appState.carrito.find(item => item.id === productoId);
        return productoEnCarrito ? productoEnCarrito.cantidad : 0;
    }
    
    

    function obtenerCantidadEnCarrito(appState, productoId) {
        const item = appState.carrito.find(item => item.id === productoId);
        return item ? item.cantidad : 0;
    }

    function actualizarCantidadDesdeProducto(appState, productoId, operacion) {
        const itemIndex = appState.carrito.findIndex(item => item.id === productoId);
        if (itemIndex !== -1) {
            if (operacion === 'sumar') {
                appState.carrito[itemIndex].cantidad++;
            } else if (operacion === 'restar') {
                if (appState.carrito[itemIndex].cantidad > 1) {
                    appState.carrito[itemIndex].cantidad--;
                } else {
                    appState.carrito.splice(itemIndex, 1);
                }
            }
            renderizarCatalogo(appState);
            // Aquí deberías llamar a una función para actualizar el carrito en la interfaz
            // Por ejemplo: actualizarInterfazCarrito(appState);
        }
    }

    function actualizarCantidadDirectaDesdeProducto(appState, productoId, nuevaCantidad) {
        nuevaCantidad = parseInt(nuevaCantidad);
        if (isNaN(nuevaCantidad) || nuevaCantidad < 0) nuevaCantidad = 0;

        if (nuevaCantidad === 0) {
            appState.carrito = appState.carrito.filter(item => item.id !== productoId);
        } else {
            const itemIndex = appState.carrito.findIndex(item => item.id === productoId);
            if (itemIndex !== -1) {
                appState.carrito[itemIndex].cantidad = nuevaCantidad;
            } else {
                const producto = appState.inventario.find(p => p.id === productoId);
                if (producto) {
                    appState.carrito.push({...producto, cantidad: nuevaCantidad});
                }
            }
        }
        renderizarCatalogo(appState);
        // Aquí deberías llamar a una función para actualizar el carrito en la interfaz
        // Por ejemplo: actualizarInterfazCarrito(appState);
    }

    function agregarAlCarrito(appState, productoId) {
        const producto = appState.inventario.find(p => p.id === productoId);
        if (producto) {
            const itemExistente = appState.carrito.find(item => item.id === productoId);
            if (itemExistente) {
                itemExistente.cantidad++;
            } else {
                appState.carrito.push({...producto, cantidad: 1});
            }
            renderizarCatalogo(appState);
            // Aquí deberías llamar a una función para actualizar el carrito en la interfaz
            // Por ejemplo: actualizarInterfazCarrito(appState);
        }
    }

    function configurarEventListeners(appState) {
        console.log('Configurando event listeners del catálogo');
        const catalogoContainer = document.getElementById('catalogo-productos');

        addEventListenerWithCleanup(catalogoContainer, 'click', (event) => {
            const target = event.target;
            if (target.classList.contains('btn-cantidad')) {
                const productoId = parseInt(target.dataset.id);
                const accion = target.dataset.action;
                actualizarCantidadDesdeProducto(appState, productoId, accion);
            } else if (target.classList.contains('btn-agregar')) {
                const productoId = parseInt(target.dataset.id);
                agregarAlCarrito(appState, productoId);
            }
        });

        addEventListenerWithCleanup(catalogoContainer, 'change', (event) => {
            const target = event.target;
            if (target.classList.contains('input-cantidad')) {
                const productoId = parseInt(target.dataset.id);
                const nuevaCantidad = parseInt(target.value);
                actualizarCantidadDirectaDesdeProducto(appState, productoId, nuevaCantidad);
            }
        });
    }

    function inicializarModuloCatalogo(appState) {
        console.log('Inicializando módulo de Catálogo');
        catalogoState.appStateRef = appState;
        renderizarCatalogo(appState);
        configurarEventListeners(appState);
        return {
            cleanup: cleanup
        };
    }

    // Exponer la función de inicialización al objeto global window
    window.inicializarModuloCatalogo = inicializarModuloCatalogo;

    console.log('Módulo de Catálogo cargado completamente');
})();