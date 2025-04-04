export async function initCompras(estadoGlobal) {
    console.log('Inicializando módulo de compras...');

    // Verificar si los datos necesarios están disponibles en el estado global
    if (
        estadoGlobal.proveedores.length === 0 ||
        estadoGlobal.inventario.length === 0 ||
        estadoGlobal.productos.length === 0 ||
        estadoGlobal.suministros.length === 0
    ) {
        console.warn('Algunos datos no están disponibles en el estado global. Verifica la carga inicial.');
    }

    // Renderizar las compras
    cargarCompras(estadoGlobal);

    // Configurar eventos del módulo
    configurarEventListeners(estadoGlobal);
}

// Función para cargar las compras en la tabla
function cargarCompras(estadoGlobal) {
    console.log('Cargando compras en la tabla');
    const cuerpoTabla = document.getElementById('cuerpoTablaCompras');
    const comprasEmpty = document.getElementById('compras-empty');

    if (!cuerpoTabla) {
        console.error('No se encontró el elemento cuerpoTablaCompras');
        return;
    }

    const suministros = estadoGlobal.suministros;

    if (suministros.length === 0) {
        cuerpoTabla.innerHTML = '';
        if (comprasEmpty) {
            comprasEmpty.style.display = 'block';
        }
        return;
    }

    if (comprasEmpty) {
        comprasEmpty.style.display = 'none';
    }

    cuerpoTabla.innerHTML = suministros.map(suministro => `
        <tr>
            <td>${suministro.idSuministro}</td>
            <td>${suministro.fechaSuministro}</td>
            <td>${suministro.proveedor.nombreContacto}</td>
            <td>$${suministro.precioCompra}</td>
            <td>
                <span class="estado-compra estado-${suministro.estado}">
                    ${suministro.estado}
                </span>
            </td>
            <td>
                <button onclick="window.verDetallesCompra(${suministro.idSuministro})" class="btn-icono" title="Ver detalles">
                    <i data-lucide="eye"></i>
                </button>
            </td>
        </tr>
    `).join('');

    console.log('Compras cargadas en la tabla');
}

// Configurar eventos del módulo
function configurarEventListeners(estadoGlobal) {
    document.getElementById('btnNuevaCompra')?.addEventListener('click', mostrarFormularioCompra);
    document.getElementById('btnCerrarModal')?.addEventListener('click', cerrarModal);
    document.getElementById('btnCerrarFormulario')?.addEventListener('click', cerrarFormularioCompra);
    document.getElementById('btnAgregarProducto')?.addEventListener('click', () => agregarOEditarProducto(estadoGlobal));
    document.getElementById('btnGuardarCompra')?.addEventListener('click', () => guardarCompra(estadoGlobal));
    document.getElementById('busquedaProducto')?.addEventListener('input', (e) => {
        const resultados = buscarProductos(e.target.value, estadoGlobal);
        mostrarResultadosBusqueda(resultados);
    });

    const proveedorInput = document.getElementById('proveedor');
    if (proveedorInput) {
        proveedorInput.addEventListener('focus', () => mostrarListaProveedores(estadoGlobal));
        proveedorInput.addEventListener('input', (e) => {
            const resultados = buscarProveedor(e.target.value, estadoGlobal);
            mostrarResultadosProveedores(resultados);
        });
    }
}

function mostrarListaProveedores(estadoGlobal) {
    const proveedorInput = document.getElementById('proveedor');
    const datalistProveedores = document.getElementById('listaProveedores');
    if (proveedorInput && datalistProveedores) {
        datalistProveedores.innerHTML = estadoGlobal.proveedores.map(proveedor =>
            `<option value="${proveedor.nombreEmpresa} - ${proveedor.nombreContacto}" data-id="${proveedor.idProveedor}">`
        ).join('');
    }
}

function buscarProductos(termino, estadoGlobal) {
    console.log('Buscando productos:', termino);
    return estadoGlobal.productos.filter(producto =>
        producto.nombre.toLowerCase().includes(termino.toLowerCase()) ||
        producto.descripcion.toLowerCase().includes(termino.toLowerCase())
    );
}

function mostrarResultadosBusqueda(resultados) {
    console.log('Mostrando resultados de búsqueda');
    const divResultados = document.getElementById('resultadosBusqueda');
    divResultados.innerHTML = '';
    resultados.forEach(producto => {
        const div = document.createElement('div');
        div.textContent = `${producto.nombre} - ${producto.descripcion}`;
        div.onclick = () => seleccionarProducto(producto);
        divResultados.appendChild(div);
    });
}

function seleccionarProducto(producto) {
    console.log('Producto seleccionado:', producto.nombre);
    document.getElementById('busquedaProducto').value = producto.nombre;
    document.getElementById('resultadosBusqueda').innerHTML = '';
}

function agregarOEditarProducto(estadoGlobal) {
    console.log('Agregando o editando producto');
    const nombre = document.getElementById('busquedaProducto').value;
    const cantidad = parseInt(document.getElementById('cantidad').value);
    const precioCompraTotal = parseFloat(document.getElementById('precioCompraTotal').value);

    if (!nombre || isNaN(cantidad) || isNaN(precioCompraTotal) || cantidad <= 0 || precioCompraTotal <= 0) {
        alert('Por favor, complete todos los campos correctamente');
        return;
    }

    const producto = estadoGlobal.productos.find(p => p.nombre === nombre);
    if (!producto) {
        alert('Producto no encontrado');
        return;
    }

    const nuevoProducto = {
        idProducto: producto.idProducto,
        nombre: producto.nombre,
        cantidadMedida: producto.cantidadMedida,
        unidadMedida: producto.unidadMedida,
        cantidad: cantidad,
        precioCompraTotal: precioCompraTotal
    };

    estadoGlobal.suministros.push(nuevoProducto);
    actualizarTablaProductos(estadoGlobal);
    limpiarFormularioProducto();
}

function actualizarTablaProductos(estadoGlobal) {
    console.log('Actualizando tabla de productos');
    const tbody = document.querySelector('#tablaProductos tbody');
    tbody.innerHTML = '';

    estadoGlobal.suministros.forEach((suministro, indice) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${suministro.cantidad}</td>
            <td>${suministro.unidadMedida}</td>
            <td>${suministro.nombre}</td>
            <td class="texto-derecha">$${suministro.precioCompraTotal}</td>
            <td>
                <button onclick="window.eliminarProducto(${indice})" class="btn-icono btn-icono-eliminar" title="Eliminar">
                    <i data-lucide="trash-2"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function limpiarFormularioProducto() {
    console.log('Limpiando formulario de producto');
    document.getElementById('busquedaProducto').value = '';
    document.getElementById('cantidad').value = '';
    document.getElementById('precioCompraTotal').value = '';
    document.getElementById('resultadosBusqueda').innerHTML = '';
}

// Guardar una compra
async function guardarCompra(estadoGlobal) {
    console.log('Guardando compra');
    const proveedorInput = document.getElementById('proveedor');
    const proveedorSeleccionado = proveedorInput.value;

    if (!proveedorSeleccionado || estadoGlobal.suministros.length === 0) {
        alert('Por favor, seleccione un proveedor y agregue al menos un producto');
        return;
    }

    const proveedor = estadoGlobal.proveedores.find(p => `${p.nombreEmpresa} - ${p.nombreContacto}` === proveedorSeleccionado);
    if (!proveedor) {
        alert('Proveedor no encontrado');
        return;
    }

    // Construir el objeto de la compra
    const compra = {
        fechaSuministro: new Date().toISOString(),
        proveedor: proveedor,
        productos: estadoGlobal.suministros.map(suministro => ({
            idProducto: suministro.idProducto,
            cantidad: suministro.cantidad,
            precioCompraTotal: suministro.precioCompraTotal
        }))
    };

    try {
        // Enviar la compra al backend
        const response = await fetch('http://localhost:26209/api/suministros', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(compra)
        });

        if (!response.ok) {
            const error = await response.json();
            alert(`Error al guardar la compra: ${error.message}`);
            return;
        }

        const compraGuardada = await response.json();
        console.log('Compra guardada:', compraGuardada);

        // Actualizar el estado global
        estadoGlobal.actualizarSuministros([...estadoGlobal.suministros, compraGuardada]);

        // Actualizar el inventario para cada producto de la compra
        compraGuardada.productos.forEach(producto => {
            const inventarioExistente = estadoGlobal.inventario.find(i => i.producto.idProducto === producto.idProducto);

            if (inventarioExistente) {
                // Si el inventario ya existe, actualizar el stock
                inventarioExistente.stock += producto.cantidad;
            } else {
                // Si no existe, crear un nuevo inventario
                estadoGlobal.inventario.push({
                    producto: producto,
                    stock: producto.cantidad
                });
            }
        });

        // Notificar cambios en el inventario
        estadoGlobal.notificar('inventarioActualizado', estadoGlobal.inventario);

        alert('Compra guardada exitosamente');
    } catch (error) {
        console.error('Error al guardar la compra:', error);
        alert('Ocurrió un error al guardar la compra');
    }
}

window.eliminarProducto = function (indice) {
    console.log('Eliminando producto en índice:', indice);
    estadoGlobal.suministros.splice(indice, 1);
    actualizarTablaProductos(estadoGlobal);
};

// Mostrar el formulario para agregar una nueva compra
function mostrarFormularioCompra() {
    console.log('Mostrando formulario de nueva compra');
    const modal = document.getElementById('modalNuevaCompra');
    if (modal) {
        modal.style.display = 'block';
    } else {
        console.error('No se encontró el modal para nueva compra');
    }
}

// Cerrar el modal de nueva compra
function cerrarModal() {
    console.log('Cerrando modal de nueva compra');
    const modal = document.getElementById('modalNuevaCompra');
    if (modal) {
        modal.style.display = 'none';
    } else {
        console.error('No se encontró el modal para cerrar');
    }
}

// Cerrar el formulario de nueva compra
function cerrarFormularioCompra() {
    console.log('Cerrando formulario de nueva compra');
    const modal = document.getElementById('modalNuevaCompra');
    if (modal) {
        // Limpiar los campos del formulario
        document.getElementById('proveedor').value = '';
        document.getElementById('busquedaProducto').value = '';
        document.getElementById('cantidad').value = '';
        document.getElementById('precioCompraTotal').value = '';
        document.getElementById('resultadosBusqueda').innerHTML = '';
        document.querySelector('#tablaProductos tbody').innerHTML = '';

        // Vaciar los suministros en el estado global
        estadoGlobal.suministros = [];

        // Cerrar el modal
        modal.style.display = 'none';
    } else {
        console.error('No se encontró el modal para cerrar');
    }
}