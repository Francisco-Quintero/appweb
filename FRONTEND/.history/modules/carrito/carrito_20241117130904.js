(function() {
    console.log('Iniciando carga del módulo de Carrito');

    const carritoState = {
        eventListeners: []
    };

    function addEventListenerWithCleanup(element, event, handler) {
        if (element) {
            element.addEventListener(event, handler);
            carritoState.eventListeners.push({ element, event, handler });
        }
    }

    function cleanup() {
        console.log('Limpiando módulo de Carrito');
        carritoState.eventListeners.forEach(({ element, event, handler }) => {
            if (element) {
                element.removeEventListener(event, handler);
            }
        });
        carritoState.eventListeners = [];
    }

    function renderizarCarrito(appState) {
        const carritoContainer = document.getElementById('carrito-items');
        if (!carritoContainer) {
            console.error('No se encontró el contenedor del carrito');
            return;
        }
        carritoContainer.innerHTML = '';
        
        if (appState.carrito.length === 0) {
            carritoContainer.innerHTML = `
                <div class="carrito-vacio">
                    <p>Tu carrito está vacío</p>
                </div>
            `;
            return;
        }
        
        appState.carrito.forEach(item => {
            const itemElem = document.createElement('div');
            itemElem.className = 'carrito-item';
            const subtotalItem = item.precio * item.cantidad;
            
            itemElem.innerHTML = `
                <img src="${item.imagen}" alt="${item.nombre}" class="carrito-item-imagen">
                <div class="carrito-item-detalles">
                    <div class="carrito-item-nombre">${item.nombre}</div>
                    <div class="carrito-item-precio">$${subtotalItem.toLocaleString()}</div>
                    <div class="carrito-item-precio-unitario">
                        ${item.precioGramo ? `Gramo a $${item.precioGramo}` : ''}
                    </div>
                </div>
                <div class="carrito-item-controles">
                    <button class="btn-cantidad" data-action="restar" data-id="${item.id}" aria-label="Disminuir cantidad">-</button>
                    <input type="number" value="${item.cantidad}" 
                           class="input-cantidad" 
                           data-id="${item.id}"
                           aria-label="Cantidad del producto">
                    <button class="btn-cantidad" data-action="sumar" data-id="${item.id}" aria-label="Aumentar cantidad">+</button>
                </div>
                <button class="btn-eliminar" data-id="${item.id}" aria-label="Eliminar del carrito">
                    <i data-lucide="trash-2"></i>
                </button>
            `;
            carritoContainer.appendChild(itemElem);
        });
        
        // Reinicializar los iconos de Lucide
        lucide.createIcons();
    }

    function actualizarTotales(appState) {
        const subtotal = calcularSubtotal(appState.carrito);
        const costoEnvio = appState.carrito.length > 0 ? 2000 : 0;
        const total = subtotal + costoEnvio;
        
        document.getElementById('subtotal').textContent = `$${subtotal.toLocaleString()}`;
        document.getElementById('costo-envio').textContent = `$${costoEnvio.toLocaleString()}`;
        document.getElementById('total').textContent = `$${total.toLocaleString()}`;
    }

    function calcularSubtotal(carrito) {
        return carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    }

    function actualizarCantidad(appState, productoId, operacion) {
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
            renderizarCarrito(appState);
            actualizarTotales(appState);
        }
    }

    function actualizarCantidadDirecta(appState, productoId, nuevaCantidad) {
        nuevaCantidad = parseInt(nuevaCantidad);
        if (isNaN(nuevaCantidad) || nuevaCantidad < 0) nuevaCantidad = 0;
        
        if (nuevaCantidad === 0) {
            appState.carrito = appState.carrito.filter(item => item.id !== productoId);
        } else {
            const itemIndex = appState.carrito.findIndex(item => item.id === productoId);
            if (itemIndex !== -1) {
                appState.carrito[itemIndex].cantidad = nuevaCantidad;
            }
        }
        renderizarCarrito(appState);
        actualizarTotales(appState);
    }

    function eliminarDelCarrito(appState, productoId) {
        appState.carrito = appState.carrito.filter(item => item.id !== productoId);
        renderizarCarrito(appState);
        actualizarTotales(appState);
    }

    function generarPedido(appState) {
        if (appState.carrito.length === 0) {
            alert('El carrito está vacío');
            return;
        }

        const metodoPago = document.querySelector('input[name="metodoPago"]:checked').value;
        const costoEnvio = 2000; // Valor fijo para este ejemplo
        const subtotal = calcularSubtotal(appState.carrito);
        const total = subtotal + costoEnvio;

        const pedido = {
            idPedido: generarIdUnico(),
            fechaPedido: new Date(),
            estadoPedido: 'en espera',
            horaCreacion: new Date(),
            costoEnvio: costoEnvio,
            items: appState.carrito.map(item => ({
                idProducto: item.id,
                cantidad: item.cantidad,
                precioUnitario: item.precio,
                total: item.precio * item.cantidad,
                descuento: 0
            })),
            subtotal: subtotal,
            total: total
        };

        const factura = {
            idFactura: generarIdUnico(),
            fechaEmision: new Date(),
            idPedido: pedido.idPedido,
            subtotal: subtotal,
            impuestos: calcularImpuestos(subtotal),
            total: total,
            estadoFactura: 'pendiente',
            pago: {
                idPago: generarIdUnico(),
                metodoPago: metodoPago,
                estadoPago: metodoPago === 'contraentrega' ? 'pendiente' : 'procesando',
                monto: total,
                fechaPago: null
            }
        };

        appState.pedidos.push(pedido);
        appState.facturas.push(factura);

        // Limpiar el carrito
        appState.carrito = [];
        renderizarCarrito(appState);
        actualizarTotales(appState);

        alert('Pedido generado con éxito. ID del pedido: ' + pedido.idPedido);
    }

    function generarIdUnico() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    function calcularImpuestos(subtotal) {
        return subtotal * 0.19; // 19% de IVA
    }

    function configurarEventListeners(appState) {
        const carritoContainer = document.getElementById('carrito-items');
        const btnGenerarPedido = document.getElementById('btn-generar-pedido');
        
        addEventListenerWithCleanup(carritoContainer, 'click', (event) => {
            const target = event.target;
            if (target.classList.contains('btn-cantidad')) {
                const productoId = parseInt(target.dataset.id);
                const accion = target.dataset.action;
                actualizarCantidad(appState, productoId, accion);
            } else if (target.classList.contains('btn-eliminar')) {
                const productoId = parseInt(target.dataset.id);
                eliminarDelCarrito(appState, productoId);
            }
        });

        addEventListenerWithCleanup(carritoContainer, 'change', (event) => {
            const target = event.target;
            if (target.classList.contains('input-cantidad')) {
                const productoId = parseInt(target.dataset.id);
                const nuevaCantidad = parseInt(target.value);
                actualizarCantidadDirecta(appState, productoId, nuevaCantidad);
            }
        });

        addEventListenerWithCleanup(btnGenerarPedido, 'click', () => generarPedido(appState));
    }

    function inicializarModuloCarrito(appState) {
        console.log('Inicializando módulo de Carrito');
        renderizarCarrito(appState);
        actualizarTotales(appState);
        configurarEventListeners(appState);
        return {
            cleanup: cleanup
        };
    }

    // Exponer la función de inicialización al objeto global window
    window.inicializarModuloCarrito = inicializarModuloCarrito;

    console.log('Módulo de Carrito cargado completamente');
})();