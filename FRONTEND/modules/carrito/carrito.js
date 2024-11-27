(function() {
    console.log('Iniciando carga del módulo de Carrito');

    let carrito = [];
    let pedidos = [];
    let facturas = [];

    function cargarDatosDesdeLocalStorage() {
        try {
            const datosGuardados = JSON.parse(localStorage.getItem('datosGlobales') || '{}');
            carrito = datosGuardados.carrito || [];
            pedidos = datosGuardados.pedidosPendientes || [];
            facturas = datosGuardados.facturas || [];
            console.log('Datos del carrito cargados desde localStorage');
        } catch (error) {
            console.error('Error al cargar datos del carrito desde localStorage:', error);
        }
    }

    function guardarEnLocalStorage() {
        try {
            const datosActuales = JSON.parse(localStorage.getItem('datosGlobales') || '{}');
            datosActuales.carrito = carrito;
            datosActuales.pedidosPendientes = pedidos;
            datosActuales.facturas = facturas;
            localStorage.setItem('datosGlobales', JSON.stringify(datosActuales));
            console.log('Datos del carrito guardados en localStorage');
        } catch (error) {
            console.error('Error al guardar datos del carrito en localStorage:', error);
        }
    }

    function sincronizarConDatosGlobales() {
        if (window.datosGlobales) {
            carrito = Array.isArray(window.datosGlobales.carrito) ? window.datosGlobales.carrito : [];
            pedidos = Array.isArray(window.datosGlobales.pedidosPendientes) ? window.datosGlobales.pedidosPendientes : [];
            facturas = Array.isArray(window.datosGlobales.facturas) ? window.datosGlobales.facturas : [];
            renderizarCarrito();
            console.log('Datos del carrito sincronizados con datosGlobales');
        }
    }

    function renderizarCarrito() {
        const carritoContainer = document.getElementById('carrito-items');
        if (!carritoContainer) {
            console.error('No se encontró el contenedor del carrito');
            return;
        }
        carritoContainer.innerHTML = '';
        
        if (carrito.length === 0) {
            carritoContainer.innerHTML = `
                <div class="carrito-vacio">
                    <p>Tu carrito está vacío</p>
                </div>
            `;
            return;
        }
        
        carrito.forEach(item => {
            const itemElem = document.createElement('div');
            itemElem.className = 'carrito-item';
            const subtotalItem = item.precioUnitario * item.cantidad;
            
            itemElem.innerHTML = `
                <img src="${item.imagenProducto}" alt="${item.Nombre}" class="carrito-item-imagen">
                <div class="carrito-item-detalles">
                    <div class="carrito-item-nombre">${item.Nombre}</div>
                    <div class="carrito-item-precio">$${subtotalItem.toLocaleString()}</div>
                    <div class="carrito-item-precio-unitario">
                        ${item.precioGramo ? `Gramo a $${item.precioGramo}` : ''}
                    </div>
                </div>
                <div class="carrito-item-controles">
                    <button class="btn-cantidad" data-id="${item.idProducto}" data-action="restar" aria-label="Disminuir cantidad">-</button>
                    <input type="number" value="${item.cantidad}" 
                           class="input-cantidad" 
                           data-id="${item.idProducto}"
                           aria-label="Cantidad del producto">
                    <button class="btn-cantidad" data-id="${item.idProducto}" data-action="sumar" aria-label="Aumentar cantidad">+</button>
                </div>
                <button class="btn-eliminar" data-id="${item.idProducto}" aria-label="Eliminar del carrito">
                    <i data-lucide="trash-2"></i>
                </button>
            `;
            carritoContainer.appendChild(itemElem);
        });
        
        lucide.createIcons();
        actualizarTotales();
    }

    function actualizarTotales() {
        const subtotal = calcularSubtotal();
        const costoEnvio = carrito.length > 0 ? 2000 : 0;
        const total = subtotal + costoEnvio;
        
        document.getElementById('subtotal').textContent = `$${subtotal.toLocaleString()}`;
        document.getElementById('costo-envio').textContent = `$${costoEnvio.toLocaleString()}`;
        document.getElementById('total').textContent = `$${total.toLocaleString()}`;
    }

    function calcularSubtotal() {
        return carrito.reduce((sum, item) => sum + (item.precioUnitario * item.cantidad), 0);
    }

    function actualizarCantidad(productoId, operacion) {
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

    function actualizarCantidadDirecta(productoId, nuevaCantidad) {
        nuevaCantidad = parseInt(nuevaCantidad);
        if (isNaN(nuevaCantidad) || nuevaCantidad < 0) nuevaCantidad = 0;
        
        if (nuevaCantidad === 0) {
            carrito = carrito.filter(item => item.idProducto !== productoId);
        } else {
            const itemIndex = carrito.findIndex(item => item.idProducto === productoId);
            if (itemIndex !== -1) {
                carrito[itemIndex].cantidad = nuevaCantidad;
            }
        }
        actualizarCarrito();
    }

    function eliminarDelCarrito(productoId) {
        carrito = carrito.filter(item => item.idProducto !== productoId);
        actualizarCarrito();
    }

    function actualizarCarrito() {
        guardarEnLocalStorage();
        renderizarCarrito();
        actualizarCartCount();
        if (window.datosGlobales && typeof window.datosGlobales.actualizarCarrito === 'function') {
            window.datosGlobales.actualizarCarrito(carrito);
        }
        console.log('Carrito actualizado:', carrito);
    }

    function actualizarCartCount() {
        const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);
        const cartCountElement = document.querySelector('.cart-count');
        if (cartCountElement) {
            cartCountElement.textContent = totalItems;
        }
    }

    function generarPedido() {
        if (carrito.length === 0) {
            alert('El carrito está vacío');
            return;
        }

        if (!usuarioEstaLogueado()) {
            alert('Debe iniciar sesión para realizar un pedido');
            //redirijir al usuario
            return;
        }

        const metodoPagoElement = document.querySelector('input[name="metodoPago"]:checked');
        if (!metodoPagoElement) {
            alert('Por favor seleccione un método de pago');
            return;
        }

        const metodoPago = metodoPagoElement.value;
        const costoEnvio = 2000;
        const subtotal = calcularSubtotal();
        const total = subtotal + costoEnvio;

        const usuarioActual = obtenerUsuarioActual();
        if (!usuarioActual) {
            alert('Error al obtener la información del usuario');
            return;
        }

        const pedido = {
            idPedido: pedidos.length + 1,
            fechaPedido: new Date(),
            estadoPedido: 'en espera',
            costoEnvio: costoEnvio,
            items: carrito.map(item => ({
                idProducto: item.idProducto,
                nombre: item.Nombre,
                cantidad: item.cantidad,
                precioUnitario: item.precioUnitario,
                total: item.precioUnitario * item.cantidad,
                descuento: 0
            })),
            subtotal: subtotal,
            total: total,
            domiciliario: null,
            cliente: {
                id: usuarioActual.id,
                nombre: usuarioActual.nombre,
                direccion: usuarioActual.direccion
            }
        };

        const factura = {
            idFactura: facturas.length + 1,
            fechaEmision: new Date(),
            idPedido: pedido.idPedido,
            subtotal: subtotal,
            impuestos: calcularImpuestos(subtotal),
            total: total,
            estadoFactura: 'pendiente',
            pago: {
                idPago: facturas.length + 1,
                metodoPago: metodoPago,
                estadoPago: metodoPago === 'contraentrega' ? 'pendiente' : 'procesando',
                monto: total,
                fechaPago: null
            }
        };

        pedidos.push(pedido);
        facturas.push(factura);

        carrito = [];
        actualizarCarrito();

        console.log('Disparando evento actualizarCatalogo');
        // Añade esta línea para actualizar el catálogo
        window.dispatchEvent(new CustomEvent('actualizarCatalogo'));

    alert('Pedido generado con éxito. ID del pedido: ' + pedido.idPedido);

        alert('Pedido generado con éxito. ID del pedido: ' + pedido.idPedido);
    }

    function usuarioEstaLogueado() {
        return typeof window.verificarUsuarioParaPedido === 'function' && window.verificarUsuarioParaPedido();
    }

    function obtenerUsuarioActual() {
        return typeof window.obtenerUsuarioActual === 'function' ? window.obtenerUsuarioActual() : null;
    }

    function calcularImpuestos(subtotal) {
        return subtotal * 0.19; // 19% de impuestos
    }

    function configurarEventListeners() {
        const carritoContainer = document.getElementById('carrito-items');
        const btnGenerarPedido = document.getElementById('btn-generar-pedido');
        
        if (carritoContainer) {
            carritoContainer.addEventListener('click', (event) => {
                const target = event.target;
                if (target.classList.contains('btn-cantidad')) {
                    const productoId = parseInt(target.dataset.id);
                    const accion = target.dataset.action;
                    actualizarCantidad(productoId, accion);
                } else if (target.classList.contains('btn-eliminar')) {
                    const productoId = parseInt(target.dataset.id);
                    eliminarDelCarrito(productoId);
                }
            });

            carritoContainer.addEventListener('change', (event) => {
                const target = event.target;
                if (target.classList.contains('input-cantidad')) {
                    const productoId = parseInt(target.dataset.id);
                    const nuevaCantidad = parseInt(target.value);
                    actualizarCantidadDirecta(productoId, nuevaCantidad);
                }
            });
        }

        if (btnGenerarPedido) {
            btnGenerarPedido.addEventListener('click', generarPedido);
        }

        // Escuchar eventos de actualización del catálogo
        window.addEventListener('actualizacionCatalogo', function(event) {
            const { productoId, cantidad } = event.detail;
            actualizarCantidadDirecta(productoId, cantidad);
        });

        
    }

    function initCarrito() {
        console.log('Inicializando módulo de carrito');
        cargarDatosDesdeLocalStorage();
        renderizarCarrito();
        configurarEventListeners();
        
        window.addEventListener('datosGlobalesListo', sincronizarConDatosGlobales);
        
        if (window.datosGlobales) {
            sincronizarConDatosGlobales();
        }
        
        console.log('Módulo de carrito cargado completamente');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCarrito);
    } else {
        initCarrito();
    }

    window.addEventListener('load', renderizarCarrito);

    // Exponer funciones necesarias globalmente
    window.generarPedido = generarPedido;
    window.actualizarCantidadDirecta = actualizarCantidadDirecta;
})();

