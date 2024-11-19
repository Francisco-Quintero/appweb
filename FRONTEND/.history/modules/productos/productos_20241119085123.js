// Modificación de las estructuras de datos
const productosVariantes = [
    { 
        id_variante: 1,
        id_producto: 1,
        descripcion: 'Deslactosada',
        unidad_medida: 'litro',
        valor_medida: 1.0,
        precio_unitario: 22000
    },
    { 
        id_variante: 2,
        id_producto: 1,
        descripcion: 'Entera',
        unidad_medida: 'litro',
        valor_medida: 1.0,
        precio_unitario: 20000
    }
];

const productos = [
    { 
        id: 1, 
        nombre: 'Leche', 
        descripcion: 'Leche líquida', 
        imagenProducto: '/placeholder.svg?height=100&width=100',
        categoria: 'Lácteos'
    },
    { 
        id: 2, 
        nombre: 'Queso', 
        descripcion: 'Queso fresco', 
        imagenProducto: '/placeholder.svg?height=100&width=100',
        categoria: 'Lácteos'
    }
];

// Modificar la función de búsqueda de productos para incluir variantes
function buscarProductos() {
    const termino = document.getElementById('busquedaProducto').value.toLowerCase();
    const resultados = productos.flatMap(producto => {
        const variantes = productosVariantes.filter(v => v.id_producto === producto.id);
        return variantes.map(variante => ({
            ...producto,
            ...variante,
            nombreCompleto: `${producto.nombre} - ${variante.descripcion}`
        }));
    }).filter(item => 
        item.nombreCompleto.toLowerCase().includes(termino) ||
        item.descripcion.toLowerCase().includes(termino)
    );
    mostrarResultadosBusqueda(resultados);
}

// Modificar la función de mostrar resultados para incluir variantes
function mostrarResultadosBusqueda(resultados) {
    const divResultados = document.getElementById('resultadosBusqueda');
    divResultados.innerHTML = '';
    resultados.forEach(item => {
        const div = document.createElement('div');
        div.textContent = `${item.nombreCompleto} (${item.valor_medida}${item.unidad_medida})`;
        div.onclick = () => seleccionarProductoVariante(item);
        divResultados.appendChild(div);
    });
}

// Nueva función para seleccionar producto con variante
function seleccionarProductoVariante(item) {
    document.getElementById('busquedaProducto').value = item.nombreCompleto;
    document.getElementById('resultadosBusqueda').innerHTML = '';
    // Guardar el ID de la variante seleccionada para usarlo al agregar el producto
    document.getElementById('busquedaProducto').dataset.varianteId = item.id_variante;
}

// Modificar la función de agregar producto para trabajar con variantes
function agregarOEditarProducto() {
    const varianteId = document.getElementById('busquedaProducto').dataset.varianteId;
    const cantidad = parseInt(document.getElementById('cantidad').value);
    const precioCompraTotal = parseFloat(document.getElementById('precioCompraTotal').value);

    if (!varianteId || isNaN(cantidad) || isNaN(precioCompraTotal)) {
        alert('Por favor, complete todos los campos correctamente');
        return;
    }

    const variante = productosVariantes.find(v => v.id_variante === parseInt(varianteId));
    const producto = productos.find(p => p.id === variante.id_producto);

    if (!variante || !producto) {
        alert('Producto o variante no encontrado');
        return;
    }

    const precioCompraUnitario = precioCompraTotal / cantidad;
    const impuesto = parseFloat(document.getElementById('impuesto').value) || 0;
    const precioConIva = precioCompraUnitario * (1 + impuesto / 100);
    const precioUnitarioFinal = precioConIva * 1.2; // 20% de ganancia

    const nuevoProducto = {
        id_variante: variante.id_variante,
        id_producto: producto.id,
        nombre: `${producto.nombre} - ${variante.descripcion}`,
        unidad: variante.unidad_medida,
        valor_medida: variante.valor_medida,
        cantidad: cantidad,
        precioCompraTotal: precioCompraTotal,
        precioUnitarioFinal: precioUnitarioFinal
    };

    if (indiceEditando !== null) {
        productosCompra[indiceEditando] = nuevoProducto;
        indiceEditando = null;
        document.getElementById('btnAgregarProducto').textContent = 'Agregar Producto';
    } else {
        productosCompra.push(nuevoProducto);
    }

    actualizarTablaProductos();
    limpiarFormularioProducto();
}

// Modificar la función de guardar compra para actualizar la frecuencia de abastecimiento
function guardarCompra() {
    const proveedorId = document.getElementById('proveedor').value;
    if (!proveedorId || productosCompra.length === 0) {
        alert('Por favor, seleccione un proveedor y agregue al menos un producto');
        return;
    }

    // Actualizar la frecuencia de abastecimiento del proveedor
    const proveedor = proveedores.find(p => p.id == proveedorId);
    if (proveedor) {
        proveedor.frecuenciaAbastecimiento = (proveedor.frecuenciaAbastecimiento || 0) + 1;
    }

    const compra = {
        id: comprasData.length + 1,
        fecha: new Date().toISOString().split('T')[0],
        proveedor: proveedor.nombre,
        productos: productosCompra,
        subtotal: parseFloat(document.getElementById('subtotal').textContent.slice(1)),
        impuesto: parseFloat(document.getElementById('valorImpuesto').textContent.slice(1)),
        total: parseFloat(document.getElementById('total').textContent.slice(1)),
        observaciones: document.getElementById('observaciones').value,
        estado: 'Pendiente'
    };

    comprasData.push(compra);
    cargarCompras();
    cerrarFormularioCompra();
    alert('Compra guardada con éxito');
}

function actualizarTablaProductos() {
    const tbody = document.querySelector('#tablaProductos tbody');
    tbody.innerHTML = '';
    productosCompra.forEach((producto, indice) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${producto.cantidad}</td>
            <td>${producto.unidad}</td>
            <td>${producto.nombre}</td>
            <td class="texto-derecha">$${producto.precioCompraTotal.toFixed(2)}</td>
            <td class="texto-derecha">$${producto.precioUnitarioFinal.toFixed(2)}</td>
            <td>
                <div class="acciones-tabla">
                    <button onclick="editarProducto(${indice})" class="btn-accion" title="Editar">
                        <i data-lucide="pencil"></i>
                    </button>
                    <button onclick="eliminarProducto(${indice})" class="btn-accion" title="Eliminar">
                        <i data-lucide="trash-2"></i>
                    </button>
                    <button onclick="verVariantes(${indice})" class="btn-accion" title="Variantes">
                        <i data-lucide="layers"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    });
    calcularTotales();
}