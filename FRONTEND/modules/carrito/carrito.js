export async function initCarrito(estadoGlobal) {
    console.log('Inicializando módulo de carrito...');

    // Cargar datos desde localStorage
    cargarDatosDesdeLocalStorage(estadoGlobal);

    // Renderizar el carrito
    renderizarCarrito(estadoGlobal);

    // Configurar eventos del carrito
    configurarEventListeners(estadoGlobal);

    console.log('Módulo de carrito cargado completamente');
}

// Cargar datos desde localStorage
function cargarDatosDesdeLocalStorage(estadoGlobal) {
    try {
        const datosGuardados = JSON.parse(localStorage.getItem('datosGlobales') || '{}');
        estadoGlobal.carrito = datosGuardados.carrito || [];
        console.log('Datos del carrito cargados desde localStorage');
    } catch (error) {
        console.error('Error al cargar datos del carrito desde localStorage:', error);
    }
}

// Guardar datos en localStorage
function guardarEnLocalStorage(estadoGlobal) {
    try {
        const datosActuales = JSON.parse(localStorage.getItem('datosGlobales') || '{}');
        datosActuales.carrito = estadoGlobal.carrito;
        localStorage.setItem('datosGlobales', JSON.stringify(datosActuales));
        console.log('Datos del carrito guardados en localStorage');
    } catch (error) {
        console.error('Error al guardar datos del carrito en localStorage:', error);
    }
}

// Renderizar el carrito
function renderizarCarrito(estadoGlobal) {
    const carritoContainer = document.getElementById('carrito-items');
    if (!carritoContainer) {
        console.error('No se encontró el contenedor del carrito');
        return;
    }

    carritoContainer.innerHTML = '';

    if (estadoGlobal.carrito.length === 0) {
        carritoContainer.innerHTML = `
            <div class="carrito-vacio">
                <p>Tu carrito está vacío</p>
            </div>
        `;
        actualizarTotales(estadoGlobal);
        return;
    }

    const fragment = document.createDocumentFragment();

    estadoGlobal.carrito.forEach((item) => {
        const itemElem = document.createElement('div');
        itemElem.className = 'carrito-item';
        const subtotalItem = item.producto.precioUnitario * item.cantidad;

        itemElem.innerHTML = `
            <img src="${item.producto.imagenProducto}" alt="${item.producto.nombre}" class="carrito-item-imagen">
            <div class="carrito-item-detalles">
                <div class="carrito-item-nombre">${item.producto.nombre}</div>
                <div class="carrito-item-precio">$${subtotalItem}</div>
                <div class="carrito-item-precio-unitario">
                    ${item.producto.cantidadMedida ? `Gramo a $${item.producto.cantidadMedida}` : ''}
                </div>
            </div>
            <div class="carrito-item-controles">
                <button class="btn-cantidad" data-id="${item.producto.idProducto}" data-action="restar" aria-label="Disminuir cantidad">-</button>
                <input type="number" value="${item.cantidad}" 
                       class="input-cantidad" 
                       data-id="${item.producto.idProducto}"
                       aria-label="Cantidad del producto">
                <button class="btn-cantidad" data-id="${item.producto.idProducto}" data-action="sumar" aria-label="Aumentar cantidad">+</button>
                <button class="btn-eliminar" data-id="${item.producto.idProducto}" aria-label="Eliminar del carrito">
                    <i data-lucide="trash-2"></i>
                </button>
            </div>  
        `;
        fragment.appendChild(itemElem);
    });

    carritoContainer.appendChild(fragment);

    actualizarTotales(estadoGlobal);
}

// Actualizar los totales del carrito
function actualizarTotales(estadoGlobal) {
    const subtotal = calcularSubtotal(estadoGlobal);
    const costoEnvio = estadoGlobal.carrito.length > 0 ? 2000 : 0;
    const total = subtotal + costoEnvio;

    document.getElementById('subtotal').textContent = `$${subtotal.toLocaleString()}`;
    document.getElementById('costo-envio').textContent = `$${costoEnvio.toLocaleString()}`;
    document.getElementById('total').textContent = `$${total.toLocaleString()}`;
}

// Calcular el subtotal del carrito
function calcularSubtotal(estadoGlobal) {
    return estadoGlobal.carrito.reduce((sum, item) => sum + (item.producto.precioUnitario * item.cantidad), 0);
}

// Configurar eventos del carrito
function configurarEventListeners(estadoGlobal) {
    const carritoContainer = document.getElementById('carrito-items');
    const btnGenerarPedido = document.getElementById('btn-generar-pedido');

    if (carritoContainer) {
        carritoContainer.addEventListener('click', (event) => {
            const target = event.target;
            if (target.classList.contains('btn-cantidad')) {
                const productoId = parseInt(target.dataset.id);
                const accion = target.dataset.action;
                actualizarCantidad(productoId, accion, estadoGlobal);
            } else if (target.classList.contains('btn-eliminar')) {
                const productoId = parseInt(target.dataset.id);
                eliminarDelCarrito(productoId, estadoGlobal);
            }
        });

        carritoContainer.addEventListener('change', (event) => {
            const target = event.target;
            if (target.classList.contains('input-cantidad')) {
                const productoId = parseInt(target.dataset.id);
                const nuevaCantidad = parseInt(target.value);
                actualizarCantidadDirecta(productoId, nuevaCantidad, estadoGlobal);
            }
        });
    }

    if (btnGenerarPedido) {
        btnGenerarPedido.addEventListener('click', () => generarPedido(estadoGlobal));
    }
}

// Actualizar la cantidad de un producto en el carrito
function actualizarCantidad(productoId, accion, estadoGlobal) {
    const itemIndex = estadoGlobal.carrito.findIndex((item) => item.producto.idProducto === productoId);
    if (itemIndex !== -1) {
        if (accion === 'sumar') {
            estadoGlobal.carrito[itemIndex].cantidad++;
        } else if (accion === 'restar') {
            if (estadoGlobal.carrito[itemIndex].cantidad > 1) {
                estadoGlobal.carrito[itemIndex].cantidad--;
            } else {
                estadoGlobal.carrito.splice(itemIndex, 1);
            }
        }
        guardarEnLocalStorage(estadoGlobal);
        renderizarCarrito(estadoGlobal);
    }
}

// Actualizar la cantidad directamente
function actualizarCantidadDirecta(productoId, nuevaCantidad, estadoGlobal) {
    nuevaCantidad = parseInt(nuevaCantidad);
    if (isNaN(nuevaCantidad) || nuevaCantidad < 0) nuevaCantidad = 0;

    if (nuevaCantidad === 0) {
        estadoGlobal.carrito = estadoGlobal.carrito.filter((item) => item.producto.idProducto !== productoId);
    } else {
        const itemIndex = estadoGlobal.carrito.findIndex((item) => item.producto.idProducto === productoId);
        if (itemIndex !== -1) {
            estadoGlobal.carrito[itemIndex].cantidad = nuevaCantidad;
        }
    }
    guardarEnLocalStorage(estadoGlobal);
    renderizarCarrito(estadoGlobal);
}

// Eliminar un producto del carrito
function eliminarDelCarrito(productoId, estadoGlobal) {
    estadoGlobal.carrito = estadoGlobal.carrito.filter((item) => item.producto.idProducto !== productoId);
    guardarEnLocalStorage(estadoGlobal);
    renderizarCarrito(estadoGlobal);
}

// Generar un pedido
function generarPedido(estadoGlobal) {
    if (estadoGlobal.carrito.length === 0) {
        alert('El carrito está vacío');
        return;
    }

    // Aquí puedes implementar la lógica para generar un pedido
    console.log('Pedido generado:', estadoGlobal.carrito);

    // Vaciar el carrito después de generar el pedido
    estadoGlobal.carrito = [];
    guardarEnLocalStorage(estadoGlobal);
    renderizarCarrito(estadoGlobal);
}