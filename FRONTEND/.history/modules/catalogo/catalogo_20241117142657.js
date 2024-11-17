(function() {
    console.log('Iniciando carga del módulo de Catálogo');

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

    let catalogoState = {
        eventListeners: [],
        appStateRef: null,
        actualizando: false
    };

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
        const appState = catalogoState.appStateRef;
        if (!appState) {
            console.error('Estado de la aplicación no disponible');
            return;
        }

        const catalogoContainer = document.getElementById('catalogo-productos');
        if (!catalogoContainer) {
            console.error('No se encontró el contenedor del catálogo');
            return;
        }
        catalogoContainer.innerHTML = '';
        
        inventario.forEach(producto => {
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
                ${cantidadEnCarrito > 0 ? `
                    <div class="producto-cantidad">
                        <button class="btn-cantidad" data-action="restar" data-id="${producto.id}" aria-label="Disminuir cantidad">-</button>
                        <input type="number" value="${cantidadEnCarrito}" 
                               class="input-cantidad" 
                               data-id="${producto.id}"
                               aria-label="Cantidad del producto">
                        <button class="btn-cantidad" data-action="sumar" data-id="${producto.id}" aria-label="Aumentar cantidad">+</button>
                    </div>
                ` : `
                    <button class="btn-agregar" data-id="${producto.id}">
                        Agregar
                    </button>
                `}
            `;
            catalogoContainer.appendChild(productoCard);
        });
        
        lucide.createIcons();
        configurarEventListeners();
    }

    function configurarEventListeners() {
        const catalogoContainer = document.getElementById('catalogo-productos');
        
        addEventListenerWithCleanup(catalogoContainer, 'click', (event) => {
            const target = event.target;
            if (target.classList.contains('btn-agregar')) {
                const productoId = parseInt(target.dataset.id);
                agregarAlCarrito(productoId);
            } else if (target.classList.contains('btn-cantidad')) {
                const productoId = parseInt(target.dataset.id);
                const accion = target.dataset.action;
                actualizarCantidadDesdeProducto(productoId, accion);
            }
        });

        addEventListenerWithCleanup(catalogoContainer, 'change', (event) => {
            const target = event.target;
            if (target.classList.contains('input-cantidad')) {
                const productoId = parseInt(target.dataset.id);
                const nuevaCantidad = parseInt(target.value);
                actualizarCantidadDirectaDesdeProducto(productoId, nuevaCantidad);
            }
        });
    }

    function obtenerCantidadEnCarrito(appState, productoId) {
        const item = appState.carrito.find(item => item.id === productoId);
        return item ? item.cantidad : 0;
    }

    function actualizarCantidadDesdeProducto(productoId, operacion) {
        const appState = catalogoState.appStateRef;
        if (!appState) {
            console.error('Estado de la aplicación no disponible');
            return;
        }

        const itemIndex = appState.carrito.findIndex(item => item.id === productoId);
        if (itemIndex !== -1) {
            if (operacion === 'sumar') {
                appState.carrito[itemIndex].cantidad += 1;
            } else if (operacion === 'restar') {
                if (appState.carrito[itemIndex].cantidad > 1) {
                    appState.carrito[itemIndex].cantidad -= 1;
                } else {
                    appState.carrito.splice(itemIndex, 1);
                }
            }
        } else if (operacion === 'sumar') {
            const producto = inventario.find(p => p.id === productoId);
            if (producto) {
                appState.carrito.push({...producto, cantidad: 1});
            }
        }
        actualizarEstadoGlobal(appState);
    }

    function actualizarCantidadDirectaDesdeProducto(productoId, nuevaCantidad) {
        const appState = catalogoState.appStateRef;
        if (!appState) {
            console.error('Estado de la aplicación no disponible');
            return;
        }

        nuevaCantidad = parseInt(nuevaCantidad);
        if (isNaN(nuevaCantidad) || nuevaCantidad < 0) nuevaCantidad = 0;
        
        if (nuevaCantidad === 0) {
            appState.carrito = appState.carrito.filter(item => item.id !== productoId);
        } else {
            const itemIndex = appState.carrito.findIndex(item => item.id === productoId);
            if (itemIndex !== -1) {
                appState.carrito[itemIndex].cantidad = nuevaCantidad;
            } else {
                const producto = inventario.find(p => p.id === productoId);
                if (producto) {
                    appState.carrito.push({...producto, cantidad: nuevaCantidad});
                }
            }
        }
        actualizarEstadoGlobal(appState);
    }

    function agregarAlCarrito(productoId) {
        const appState = catalogoState.appStateRef;
        if (!appState) {
            console.error('Estado de la aplicación no disponible');
            return;
        }

        const itemIndex = appState.carrito.findIndex(item => item.id === productoId);
        if (itemIndex !== -1) {
            appState.carrito[itemIndex].cantidad += 1;
        } else {
            const producto = inventario.find(p => p.id === productoId);
            if (producto) {
                appState.carrito.push({...producto, cantidad: 1});
            }
        }
        actualizarEstadoGlobal(appState);
    }

    function actualizarEstadoGlobal(nuevoEstado) {
        if (catalogoState.actualizando) {
            return;
        }
        catalogoState.actualizando = true;

        if (typeof window.actualizarEstadoGlobal === 'function') {
            window.actualizarEstadoGlobal(nuevoEstado);
        } else {
            console.error('La función actualizarEstadoGlobal no está disponible');
        }

        setTimeout(() => {
            renderizarCatalogo();
            catalogoState.actualizando = false;
        }, 0);
    }

    function inicializarModuloCatalogo(appState) {
        console.log('Inicializando módulo de Catálogo');
        catalogoState.appStateRef = appState;
        renderizarCatalogo();
        return {
            cleanup: cleanup
        };
    }

    window.inicializarModuloCatalogo = inicializarModuloCatalogo;

    console.log('Módulo de Catálogo cargado completamente');
})();