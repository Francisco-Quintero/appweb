// Inicializar el módulo de catálogo
export async function initCatalogo(estadoGlobal) {
    console.log('Inicializando módulo de catálogo...');


    // Esperar a que el contenedor esté disponible
    const catalogoContainer = document.getElementById('catalogo-productos');
    if (!catalogoContainer) {
        console.error('El contenedor del catálogo no está disponible.');
        return;
    }

    // Verificar si los datos del inventario ya están en el estado global
    // if (estadoGlobal.inventario.length === 0) {
    //     console.log('Cargando datos del inventario desde la API...');
    //     try {
    //         const inventario = await cargarDatosDesdeAPI();
    //         estadoGlobal.actualizarInventario(inventario);
    //     } catch (error) {
    //         console.error('Error al cargar los datos del inventario:', error);
    //         return; // Detener la inicialización si ocurre un error
    //     }
    // } else {
    //     console.log('Usando datos del inventario almacenados en el estado global');
    // }

    cargarDatosDesdeLocalStorage(estadoGlobal);
    // Renderizar el catálogo
    renderizarCatalogo(estadoGlobal);

    // Configurar eventos del catálogo
    configurarEventosCatalogo(estadoGlobal);
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

// Cargar datos del inventario desde la API
// async function cargarDatosDesdeAPI() {
//     try {
//         const response = await fetch(`${API_URL}/inventarios`);
//         if (!response.ok) {
//             throw new Error('Error al cargar los datos desde la API');
//         }
//         return await response.json();
//     } catch (error) {
//         console.error('Error al cargar datos desde la API:', error);
//         return [];
//     }
// }

// Renderizar el catálogo
export function renderizarCatalogo(estadoGlobal) {
    const catalogoContainer = document.getElementById('catalogo-productos');
    if (!catalogoContainer) {
        console.error('No se encontró el contenedor del catálogo');
        return;
    }

    const fragment = document.createDocumentFragment();

    if (estadoGlobal.inventario.length === 0) {
        catalogoContainer.innerHTML = '<p>No hay productos disponibles en este momento.</p>';
        return;
    }

    catalogoContainer.innerHTML = '';

    estadoGlobal.inventario.forEach((itemInventario) => {
        const productoCard = crearProductoCard(itemInventario, estadoGlobal);
        fragment.appendChild(productoCard);
    });
    catalogoContainer.appendChild(fragment);
}

// Crear una tarjeta de producto
function crearProductoCard(itemInventario, estadoGlobal) {
    const productoCard = document.createElement('div');
    productoCard.className = 'producto-card';

    const cantidadEnCarrito = obtenerCantidadEnCarrito(itemInventario.producto.idProducto, estadoGlobal);

    productoCard.innerHTML = `
        <img src="${itemInventario.producto.imagenProducto}" alt="${itemInventario.producto.nombre}" class="producto-imagen">
        <div class="producto-header">
            <div>
                <div class="producto-marca">${itemInventario.producto.categoria}</div>
                <div class="producto-nombre">${itemInventario.producto.nombre}</div>
            </div>
        </div>
        <div class="producto-precio-gramo">Gramo a ${itemInventario.producto.cantidadMedida} ${itemInventario.producto.unidadMedida}</div>
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

    return productoCard;
}

// Obtener la cantidad de un producto en el carrito
function obtenerCantidadEnCarrito(idProducto, estadoGlobal) {
    const productoEnCarrito = estadoGlobal.carrito.find((item) => item.idProducto === idProducto);
    return productoEnCarrito ? productoEnCarrito.cantidad : 0;
}

// Configurar eventos del catálogo
function configurarEventosCatalogo(estadoGlobal) {
    const catalogoContainer = document.getElementById('catalogo-productos');

    if (!catalogoContainer) {
        console.error('No se encontró el contenedor del catálogo');
        return;
    }

    catalogoContainer.addEventListener('click', (event) => {
        const button = event.target.closest('button');
        if (!button) return;

        const idProducto = parseInt(button.dataset.id, 10);
        const action = button.dataset.action;

        if (action === 'sumar') {
            agregarProductoAlCarrito(idProducto, estadoGlobal);
        } else if (action === 'restar') {
            restarProductoDelCarrito(idProducto, estadoGlobal);
        } else if (button.classList.contains('btn-agregar')) {
            agregarProductoAlCarrito(idProducto, estadoGlobal);
        }
    });
}

// Agregar un producto al carrito
function agregarProductoAlCarrito(idProducto, estadoGlobal) {
    const productoEnCarrito = estadoGlobal.carrito.find((item) => item.idProducto === idProducto);

    if (productoEnCarrito) {
        productoEnCarrito.cantidad += 1;
    } else {
        const producto = estadoGlobal.inventario.find((item) => item.producto.idProducto === idProducto);
        if (producto) {
            estadoGlobal.carrito.push({ idProducto, cantidad: 1, producto: producto.producto });
        }
    }

    console.log('Producto agregado al carrito:', idProducto);
    guardarEnLocalStorage(estadoGlobal);
    renderizarCatalogo(estadoGlobal);
    renderizarCarrito(estadoGlobal);
}

// Restar un producto del carrito
function restarProductoDelCarrito(idProducto, estadoGlobal) {
    const productoEnCarrito = estadoGlobal.carrito.find((item) => item.idProducto === idProducto);

    if (productoEnCarrito) {
        productoEnCarrito.cantidad -= 1;
        if (productoEnCarrito.cantidad <= 0) {
            estadoGlobal.carrito = estadoGlobal.carrito.filter((item) => item.idProducto !== idProducto);
        }
    }

    console.log('Producto restado del carrito:', idProducto);

    // Guardar en localStorage y sincronizar módulos
    guardarEnLocalStorage(estadoGlobal);
    renderizarCatalogo(estadoGlobal);
    renderizarCarrito(estadoGlobal);
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