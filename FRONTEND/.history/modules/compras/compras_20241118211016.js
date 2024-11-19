// compras.js
let datosGlobales;

function inicializarCompras(datos) {
    datosGlobales = datos;
    cargarCompras();
    configurarEventos();
}

function cargarCompras() {
    const cuerpoTabla = document.getElementById('cuerpoTablaCompras');
    const comprasEmpty = document.getElementById('compras-empty');
    
    if (datosGlobales.pedidos.length === 0) {
        cuerpoTabla.innerHTML = '';
        comprasEmpty.style.display = 'block';
    } else {
        comprasEmpty.style.display = 'none';
        cuerpoTabla.innerHTML = datosGlobales.pedidos.map(compra => `
            <tr>
                <td>${compra.id}</td>
                <td>${compra.fecha}</td>
                <td>${compra.proveedor}</td>
                <td>$${compra.total.toFixed(2)}</td>
                <td>${compra.estado}</td>
                <td>
                    <button class="btn-detalles" data-id="${compra.id}">Detalles</button>
                </td>
            </tr>
        `).join('');
    }
}

function configurarEventos() {
    const btnNuevaCompra = document.getElementById('btnNuevaCompra');
    const btnCerrarModal = document.getElementById('btnCerrarModal');
    const btnCerrarFormulario = document.getElementById('btnCerrarFormulario');
    const btnGuardarCompra = document.getElementById('btnGuardarCompra');
    const busquedaCompra = document.getElementById('busquedaCompra');
    const busquedaProducto = document.getElementById('busquedaProducto');
    const btnAgregarProducto = document.getElementById('btnAgregarProducto');

    btnNuevaCompra.addEventListener('click', abrirFormularioNuevaCompra);
    btnCerrarModal.addEventListener('click', cerrarModal);
    btnCerrarFormulario.addEventListener('click', cerrarFormularioCompra);
    btnGuardarCompra.addEventListener('click', guardarCompra);
    busquedaCompra.addEventListener('input', filtrarCompras);
    busquedaProducto.addEventListener('input', buscarProductos);
    btnAgregarProducto.addEventListener('click', agregarProductoACompra);

    document.getElementById('cuerpoTablaCompras').addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-detalles')) {
            mostrarDetallesCompra(e.target.dataset.id);
        }
    });
}

function abrirFormularioNuevaCompra() {
    const modalFormulario = document.getElementById('modalFormulario');
    modalFormulario.style.display = 'block';
    cargarProveedores();
}

function cerrarFormularioCompra() {
    const modalFormulario = document.getElementById('modalFormulario');
    modalFormulario.style.display = 'none';
}

function cargarProveedores() {
    const selectProveedor = document.getElementById('proveedor');
    selectProveedor.innerHTML = '<option value="">Seleccione un proveedor</option>';
    datosGlobales.proveedores.forEach(proveedor => {
        selectProveedor.innerHTML += `<option value="${proveedor.id}">${proveedor.nombre}</option>`;
    });
}

function buscarProductos() {
    const busqueda = document.getElementById('busquedaProducto').value.toLowerCase();
    const resultados = datosGlobales.productos.filter(producto => 
        producto.nombre.toLowerCase().includes(busqueda) ||
        producto.variante.toLowerCase().includes(busqueda)
    );
    mostrarResultadosBusqueda(resultados);
}

function mostrarResultadosBusqueda(resultados) {
    const contenedorResultados = document.getElementById('resultadosBusqueda');
    contenedorResultados.innerHTML = resultados.map(producto => `
        <div class="resultado-producto" data-id="${producto.id}">
            ${producto.nombre} - ${producto.variante}
        </div>
    `).join('');

    contenedorResultados.addEventListener('click', seleccionarProducto);
}

function seleccionarProducto(e) {
    if (e.target.classList.contains('resultado-producto')) {
        const productoId = e.target.dataset.id;
        const producto = datosGlobales.productos.find(p => p.id === productoId);
        document.getElementById('busquedaProducto').value = `${producto.nombre} - ${producto.variante}`;
        document.getElementById('unidadMedida').value = producto.unidadMedida;
        document.getElementById('resultadosBusqueda').innerHTML = '';
    }
}

function agregarProductoACompra() {
    const cantidad = document.getElementById('cantidad').value;
    const precioCompraTotal = document.getElementById('precioCompraTotal').value;
    const productoSeleccionado = document.getElementById('busquedaProducto').value;
    const unidadMedida = document.getElementById('unidadMedida').value;

    if (!cantidad || !precioCompraTotal || !productoSeleccionado) {
        alert('Por favor, complete todos los campos del producto.');
        return;
    }

    const tablaProductos = document.getElementById('tablaProductos').getElementsByTagName('tbody')[0];
    const nuevaFila = tablaProductos.insertRow();
    nuevaFila.innerHTML = `
        <td>${cantidad}</td>
        <td>${unidadMedida}</td>
        <td>${productoSeleccionado}</td>
        <td>$${parseFloat(precioCompraTotal).toFixed(2)}</td>
        <td>$${(parseFloat(precioCompraTotal) / parseFloat(cantidad)).toFixed(2)}</td>
        <td><button class="btn-eliminar">Eliminar</button></td>
    `;

    actualizarTotales();
    limpiarCamposProducto();
}

function limpiarCamposProducto() {
    document.getElementById('busquedaProducto').value = '';
    document.getElementById('cantidad').value = '';
    document.getElementById('unidadMedida').value = '';
    document.getElementById('precioCompraTotal').value = '';
}

function actualizarTotales() {
    let subtotal = 0;
    const filas = document.getElementById('tablaProductos').getElementsByTagName('tbody')[0].rows;
    for (let i = 0; i < filas.length; i++) {
        subtotal += parseFloat(filas[i].cells[3].textContent.replace('$', ''));
    }

    const impuestoPorcentaje = parseFloat(document.getElementById('impuesto').value) || 0;
    const impuesto = subtotal * (impuestoPorcentaje / 100);
    const total = subtotal + impuesto;

    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('valorImpuesto').textContent = `$${impuesto.toFixed(2)}`;
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;
}

function guardarCompra() {
    const proveedor = document.getElementById('proveedor').value;
    const observaciones = document.getElementById('observaciones').value;
    const total = parseFloat(document.getElementById('total').textContent.replace('$', ''));

    if (!proveedor) {
        alert('Por favor, seleccione un proveedor.');
        return;
    }

    const nuevaCompra = {
        id: Date.now().toString(),
        fecha: new Date().toISOString().split('T')[0],
        proveedor: datosGlobales.proveedores.find(p => p.id === proveedor).nombre,
        total: total,
        estado: 'Pendiente',
        observaciones: observaciones,
        productos: obtenerProductosDeTabla()
    };

    datosGlobales.agregarPedido(nuevaCompra);
    cerrarFormularioCompra();
    cargarCompras();
}

function obtenerProductosDeTabla() {
    const productos = [];
    const filas = document.getElementById('tablaProductos').getElementsByTagName('tbody')[0].rows;
    for (let i = 0; i < filas.length; i++) {
        productos.push({
            cantidad: filas[i].cells[0].textContent,
            unidadMedida: filas[i].cells[1].textContent,
            producto: filas[i].cells[2].textContent,
            precioTotal: parseFloat(filas[i].cells[3].textContent.replace('$', '')),
            precioUnitario: parseFloat(filas[i].cells[4].textContent.replace('$', ''))
        });
    }
    return productos;
}

function mostrarDetallesCompra(id) {
    const compra = datosGlobales.pedidos.find(p => p.id === id);
    if (compra) {
        const detallesCompra = document.getElementById('detallesCompra');
        detallesCompra.innerHTML = `
            <p><strong>ID:</strong> ${compra.id}</p>
            <p><strong>Fecha:</strong> ${compra.fecha}</p>
            <p><strong>Proveedor:</strong> ${compra.proveedor}</p>
            <p><strong>Total:</strong> $${compra.total.toFixed(2)}</p>
            <p><strong>Estado:</strong> ${compra.estado}</p>
            <p><strong>Observaciones:</strong> ${compra.observaciones || 'N/A'}</p>
            <h4>Productos:</h4>
            <ul>
                ${compra.productos.map(p => `
                    <li>${p.cantidad} ${p.unidadMedida} de ${p.producto} - $${p.precioTotal.toFixed(2)}</li>
                `).join('')}
            </ul>
        `;
        document.getElementById('modalCompra').style.display = 'block';
    }
}

function cerrarModal() {
    document.getElementById('modalCompra').style.display = 'none';
}

function filtrarCompras() {
    const busqueda = document.getElementById('busquedaCompra').value.toLowerCase();
    const comprasFiltradas = datosGlobales.pedidos.filter(compra => 
        compra.id.toLowerCase().includes(busqueda) ||
        compra.proveedor.toLowerCase().includes(busqueda) ||
        compra.fecha.includes(busqueda)
    );
    actualizarTablaCompras(comprasFiltradas);
}

function actualizarTablaCompras(compras) {
    const cuerpoTabla = document.getElementById('cuerpoTablaCompras');
    cuerpoTabla.innerHTML = compras.map(compra => `
        <tr>
            <td>${compra.id}</td>
            <td>${compra.fecha}</td>
            <td>${compra.proveedor}</td>
            <td>$${compra.total.toFixed(2)}</td>
            <td>${compra.estado}</td>
            <td>
                <button class="btn-detalles" data-id="${compra.id}">Detalles</button>
            </td>
        </tr>
    `).join('');
}

// Asegúrate de que esta línea esté al final del archivo
window.inicializarCompras = inicializarCompras;