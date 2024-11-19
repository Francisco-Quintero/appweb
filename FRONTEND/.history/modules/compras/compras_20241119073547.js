
(function() {
    console.log('Iniciando carga del módulo de compras');

    const comprasData = [
        { id: 1, fecha: '2023-05-15', proveedor: 'Alqueria', total: 1500.00, estado: 'Completada' },
        { id: 2, fecha: '2023-05-16', proveedor: 'Colanta', total: 2000.00, estado: 'Pendiente' },
    ];

    const proveedores = [
        { id: 1, nombre: 'Alqueria', numeroContacto: 3502874505, frecuenciaAbastecimiento: 2 },
        { id: 2, nombre: 'Colanta' , numeroContacto: 3205689480, frecuenciaAbastecimiento: 3 },
    ];

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


    let productosCompra = [];
    let indiceEditando = null;

    function cargarModuloCompras() {
        console.log('Inicializando módulo de compras');
        
        // Asegurarse de que el DOM esté cargado
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initCompras);
        } else {
            initCompras();
        }
        
        console.log('Módulo de compras cargado completamente');
    }

    function initCompras() {
        console.log('Inicializando módulo de compras');
        
        // Configurar event listeners
        document.getElementById('btnNuevaCompra')?.addEventListener('click', mostrarFormularioCompra);
        document.getElementById('btnBuscar')?.addEventListener('click', buscarCompras);
        document.getElementById('btnCerrarModal')?.addEventListener('click', cerrarModal);
        document.getElementById('btnCerrarFormulario')?.addEventListener('click', cerrarFormularioCompra);
        document.getElementById('btnAgregarProducto')?.addEventListener('click', agregarOEditarProducto);
        document.getElementById('btnGuardarCompra')?.addEventListener('click', guardarCompra);
        document.getElementById('busquedaProducto')?.addEventListener('input', buscarProductos);
        document.getElementById('impuesto')?.addEventListener('input', calcularTotales);

        // Cargar datos iniciales
        cargarCompras();
        cargarProveedores();
    }

    function cargarCompras() {
        console.log('Cargando compras en la tabla');
        const cuerpoTabla = document.getElementById('cuerpoTablaCompras');
        const comprasEmpty = document.getElementById('compras-empty');
        
        if (!cuerpoTabla) {
            console.error('No se encontró el elemento cuerpoTablaCompras');
            return;
        }

        if (comprasData.length === 0) {
            cuerpoTabla.innerHTML = '';
            if (comprasEmpty) {
                comprasEmpty.style.display = 'block';
            }
            return;
        }

        if (comprasEmpty) {
            comprasEmpty.style.display = 'none';
        }

        cuerpoTabla.innerHTML = comprasData.map(compra => `
            <tr>
                <td>${compra.id}</td>
                <td>${compra.fecha}</td>
                <td>${compra.proveedor}</td>
                <td>$${compra.total.toFixed(2)}</td>
                <td>
                    <span class="estado-compra estado-${compra.estado.toLowerCase()}">
                        ${compra.estado}
                    </span>
                </td>
                <td>
                    <button onclick="window.verDetallesCompra(${compra.id})" class="btn btn-secundario">
                        <i data-lucide="eye"></i>
                        Ver más
                    </button>
                </td>
            </tr>
        `).join('');

        // Reinicializar los iconos de Lucide
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        
        console.log('Compras cargadas en la tabla');
    }

// Cargar compras en la tabla
function cargarCompras() {
    console.log('Cargando compras en la tabla');
    const cuerpoTabla = document.getElementById('cuerpoTablaCompras');
    if (!cuerpoTabla) {
        console.error('No se encontró el elemento cuerpoTablaCompras');
        return;
    }
    cuerpoTabla.innerHTML = comprasData.map(compra => `
        <tr>
            <td>${compra.id}</td>
            <td>${compra.fecha}</td>
            <td>${compra.proveedor}</td>
            <td>$${compra.total.toFixed(2)}</td>
            <td>${compra.estado}</td>
            <td>
                <button onclick="verDetallesCompra(${compra.id})" class="btn btn-secundario">Ver más</button>
            </td>
        </tr>
    `).join('');
    console.log('Compras cargadas en la tabla');
}

// Cargar proveedores
function cargarProveedores() {
    console.log('Cargando proveedores');
    const selectProveedor = document.getElementById('proveedor');
    if (!selectProveedor) {
        console.error('No se encontró el elemento select de proveedores');
        return;
    }
    selectProveedor.innerHTML = '<option value="">Seleccione un proveedor</option>';
    proveedores.forEach(proveedor => {
        const option = document.createElement('option');
        option.value = proveedor.id;
        option.textContent = proveedor.nombre;
        selectProveedor.appendChild(option);
    });
    console.log('Proveedores cargados en el select');
}

// Mostrar el formulario de compra
function mostrarFormularioCompra() {
    console.log('Mostrando formulario de compra');
    document.getElementById('modalFormulario').style.display = 'block';
}

// Cerrar el formulario de compra
function cerrarFormularioCompra() {
    console.log('Cerrando formulario de compra');
    document.getElementById('modalFormulario').style.display = 'none';
    limpiarFormularioCompra();
}

// Limpiar el formulario de compra
function limpiarFormularioCompra() {
    console.log('Limpiando formulario de compra');
    document.getElementById('formularioCompra').reset();
    productosCompra = [];
    indiceEditando = null;
    actualizarTablaProductos();
    calcularTotales();
}

// Buscar productos
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

// Mostrar resultados de búsqueda
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

// Seleccionar producto
function seleccionarProducto(producto) {
    console.log('Producto seleccionado:', producto.nombre);
    document.getElementById('busquedaProducto').value = producto.nombre;
    document.getElementById('resultadosBusqueda').innerHTML = '';
}

// Agregar o editar producto
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

// Actualizar tabla de productos
function actualizarTablaProductos() {
    console.log('Actualizando tabla de productos');
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
            <td class="texto-derecha">
                <button onclick="editarProducto(${indice})" class="btn btn-secundario">Editar</button>
                <button onclick="eliminarProducto(${indice})" class="btn btn-peligro">Eliminar</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
    calcularTotales();
}

// Limpiar formulario de producto
function limpiarFormularioProducto() {
    console.log('Limpiando formulario de producto');
    document.getElementById('busquedaProducto').value = '';
    document.getElementById('cantidad').value = '';
    document.getElementById('precioCompraTotal').value = '';
    document.getElementById('resultadosBusqueda').innerHTML = '';
}

// Calcular totales
function calcularTotales() {
    console.log('Calculando totales');
    const subtotal = productosCompra.reduce((sum, item) => sum + item.precioCompraTotal, 0);
    const impuesto = parseFloat(document.getElementById('impuesto').value) || 0;
    const valorImpuesto = subtotal * (impuesto / 100);
    const total = subtotal + valorImpuesto;

    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('valorImpuesto').textContent = `$${valorImpuesto.toFixed(2)}`;
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;
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

// Función de búsqueda
function buscarCompras() {
    console.log('Buscando compras');
    const termino = document.getElementById('busquedaCompra').value.toLowerCase();
    const comprasFiltradas = comprasData.filter(c => 
        c.proveedor.toLowerCase().includes(termino) ||
        c.fecha.includes(termino) ||
        c.estado.toLowerCase().includes(termino)
    );
    
    const cuerpoTabla = document.getElementById('cuerpoTablaCompras');
    cuerpoTabla.innerHTML = comprasFiltradas.map(compra => `
        <tr>
            <td>${compra.id}</td>
            <td>${compra.fecha}</td>
            <td>${compra.proveedor}</td>
            <td>$${compra.total.toFixed(2)}</td>
            <td>${compra.estado}</td>
            <td>
                <button onclick="verDetallesCompra(${compra.id})" class="btn btn-secundario">Ver más</button>
            </td>
        </tr>
    `).join('');
}

// Ver detalles de una compra
function verDetallesCompra(id) {
    console.log('Viendo detalles de la compra:', id);
    const compra = comprasData.find(c => c.id === id);
    if (!compra) {
        console.error(`No se encontró la compra con id ${id}`);
        return;
    }

    const detallesCompra = document.getElementById('detallesCompra');
    detallesCompra.innerHTML = `
        <h4>Compra #${compra.id}</h4>
        <p><strong>Fecha:</strong> ${compra.fecha}</p>
        <p><strong>Proveedor:</strong> ${compra.proveedor}</p>
        <p><strong>Total:</strong> $${compra.total.toFixed(2)}</p>
        <p><strong>Estado:</strong> ${compra.estado}</p>
        <h5>Productos:</h5>
        <ul>
            ${compra.productos && compra.productos.length > 0 ? 
                compra.productos.map(p => `
                    <li>${p.cantidad} ${p.unidad} de ${p.nombre} - $${p.precioCompraTotal.toFixed(2)}</li>
                `).join('') : 
                '<li>No hay productos registrados</li>'
            }
        </ul>
        <p><strong>Observaciones:</strong> ${compra.observaciones || 'N/A'}</p>
    `;

    document.getElementById('modalCompra').style.display = 'block';
}

// Cerrar modal
function cerrarModal() {
    console.log('Cerrando modal');
    document.getElementById('modalCompra').style.display = 'none';
}

// Editar producto
function editarProducto(indice) {
    console.log('Editando producto en índice:', indice);
    const producto = productosCompra[indice];
    document.getElementById('busquedaProducto').value = producto.nombre;
    document.getElementById('cantidad').value = producto.cantidad;
    document.getElementById('precioCompraTotal').value = producto.precioCompraTotal;
    indiceEditando = indice;
    document.getElementById('btnAgregarProducto').textContent = 'Actualizar Producto';
}

// Eliminar producto
function eliminarProducto(indice) {
    console.log('Eliminando producto en índice:', indice);
    productosCompra.splice(indice, 1);
    actualizarTablaProductos();
}



// Iniciar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', cargarModuloCompras);


    // Asegurarse de que las funciones estén disponibles globalmente
    window.cargarModuloCompras = cargarModuloCompras;
    window.verDetallesCompra = verDetallesCompra;
    window.editarProducto = editarProducto;
    window.eliminarProducto = eliminarProducto;

    // Iniciar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', cargarModuloCompras);
    } else {
        cargarModuloCompras();
    }

    console.log('Archivo compras.js cargado completamente');
})();


