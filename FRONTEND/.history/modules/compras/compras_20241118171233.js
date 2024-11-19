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
                <button onclick="verDetallesCompra(${compra.id})" class="btn btn-secundario">
                    Ver más
                </button>
            </td>
        </tr>
    `).join('');
    
    console.log('Compras cargadas en la tabla');
}

function cargarCategorias() {
    const selectCategorias = document.getElementById('categoriaFiltro');
    if (!selectCategorias) {
        console.error('No se encontró el elemento categoriaFiltro');
        return;
    }
    
    const categorias = [...new Set(productos.map(p => p.categoria))];
    selectCategorias.innerHTML = '<option value="">Todas las categorías</option>';
    
    categorias.forEach(categoria => {
        const option = document.createElement('option');
        option.value = categoria;
        option.textContent = categoria;
        selectCategorias.appendChild(option);
    });
}

function cargarDatosIniciales() {
    if (window.datosGlobales) {
        comprasData = window.datosGlobales.compras || [];
        proveedores = window.datosGlobales.proveedores || [];
        productos = window.datosGlobales.productos || [];
        variantes = window.datosGlobales.variantes || [];
        
        // Asegurarse de que las funciones estén definidas antes de llamarlas
        if (typeof cargarCompras === 'function') {
            cargarCompras();
        }
        if (typeof cargarCategorias === 'function') {
            cargarCategorias();
        }
    } else {
        console.warn('datosGlobales no está disponible');
    }
}

(function() {
    let comprasData = [];
    let proveedores = [];
    let productos = [];
    let variantes = [];
    let productosCompra = [];
    let proveedorSeleccionado = null;
    let productoSeleccionado = null;
    let varianteSeleccionada = null;

    function mostrarFormularioCompra() {
        console.log('Mostrando formulario de compra');
        const modalFormulario = document.getElementById('modalFormulario');
        if (modalFormulario) {
            modalFormulario.style.display = 'block';
        } else {
            console.error('No se encontró el elemento modalFormulario');
        }
    }

    function cerrarFormularioCompra() {
        console.log('Cerrando formulario de compra');
        const modalFormulario = document.getElementById('modalFormulario');
        if (modalFormulario) {
            modalFormulario.style.display = 'none';
            limpiarFormularioCompra();
        }
    }

    function limpiarFormularioCompra() {
        console.log('Limpiando formulario de compra');
        const formulario = document.getElementById('formularioCompra');
        if (formulario) {
            formulario.reset();
        }
        productosCompra = [];
        proveedorSeleccionado = null;
        productoSeleccionado = null;
        varianteSeleccionada = null;
        actualizarTablaProductos();
        calcularTotales();

        // Limpiar información del proveedor
        const infoProveedor = document.getElementById('infoProveedor');
        if (infoProveedor) {
            infoProveedor.style.display = 'none';
        }

        // Limpiar secciones de productos y variantes
        const seccionVariantes = document.getElementById('seccionVariantes');
        const formularioVariante = document.getElementById('formularioVariante');
        if (seccionVariantes) seccionVariantes.style.display = 'none';
        if (formularioVariante) formularioVariante.style.display = 'none';
    }


    function initCompras() {
        console.log('Inicializando módulo de compras');
        
        // Asegurar que el DOM esté completamente cargado
        if (document.readyState !== 'complete') {
            document.addEventListener('DOMContentLoaded', () => {
                cargarDatosIniciales();
                configurarEventListeners();
            });
        } else {
            cargarDatosIniciales();
            configurarEventListeners();
        }
    }


    function configurarEventListeners() {
        console.log('Configurando event listeners');
        
        // Botones principales
        const btnNuevaCompra = document.getElementById('btnNuevaCompra');
        if (btnNuevaCompra) {
            btnNuevaCompra.addEventListener('click', mostrarFormularioCompra);
        }

        const btnCerrarFormulario = document.getElementById('btnCerrarFormulario');
        if (btnCerrarFormulario) {
            btnCerrarFormulario.addEventListener('click', cerrarFormularioCompra);
        }
        // Búsqueda de proveedores
        const busquedaProveedor = document.getElementById('busquedaProveedor');
        if (busquedaProveedor) {
            busquedaProveedor.addEventListener('input', (e) => {
                const termino = e.target.value.toLowerCase();
                const resultados = proveedores.filter(p => 
                    p.nombre.toLowerCase().includes(termino) ||
                    p.numeroContacto.toString().includes(termino)
                );
                mostrarResultadosProveedor(resultados);
            });
        }

        // Búsqueda de productos
        const busquedaProducto = document.getElementById('busquedaProducto');
        if (busquedaProducto) {
            busquedaProducto.addEventListener('input', () => {
                buscarProductos();
            });
        }

        const categoriaFiltro = document.getElementById('categoriaFiltro');
        if (categoriaFiltro) {
            categoriaFiltro.addEventListener('change', () => {
                buscarProductos();
            });
        }

        const btnAgregarProducto = document.getElementById('btnAgregarProducto');
        if (btnAgregarProducto) {
            btnAgregarProducto.addEventListener('click', agregarProductoACompra);
        }

        const btnGuardarCompra = document.getElementById('btnGuardarCompra');
        if (btnGuardarCompra) {
            btnGuardarCompra.addEventListener('click', guardarCompra);
        }

        const impuesto = document.getElementById('impuesto');
        if (impuesto) {
            impuesto.addEventListener('input', calcularTotales);
        }
    }

    function mostrarResultadosProveedor(resultados) {
        const contenedor = document.getElementById('resultadosProveedor');
        contenedor.innerHTML = '';
        
        resultados.forEach(proveedor => {
            const div = document.createElement('div');
            div.className = 'resultado-item';
            div.innerHTML = `
                <strong>${proveedor.nombre}</strong>
                <br>
                Contacto: ${proveedor.numeroContacto}
            `;
            div.addEventListener('click', () => seleccionarProveedor(proveedor));
            contenedor.appendChild(div);
        });
        
        contenedor.style.display = resultados.length > 0 ? 'block' : 'none';
    }

    function seleccionarProveedor(proveedor) {
        proveedorSeleccionado = proveedor;
        
        document.getElementById('nombreProveedor').textContent = proveedor.nombre;
        document.getElementById('contactoProveedor').textContent = proveedor.numeroContacto;
        document.getElementById('frecuenciaProveedor').textContent = 
            `${proveedor.frecuenciaAbastecimiento} días`;
        
        document.getElementById('infoProveedor').style.display = 'block';
        document.getElementById('resultadosProveedor').style.display = 'none';
        document.getElementById('busquedaProveedor').value = proveedor.nombre;
    }

    function buscarProductos() {
        const termino = document.getElementById('busquedaProducto').value.toLowerCase();
        const categoria = document.getElementById('categoriaFiltro').value;
        
        let resultados = productos.filter(producto => {
            const coincideTermino = producto.Nombre.toLowerCase().includes(termino) ||
                                  producto.Descripcion.toLowerCase().includes(termino);
            const coincideCategoria = !categoria || producto.categoria === categoria;
            
            return coincideTermino && coincideCategoria;
        });

        mostrarResultadosProducto(resultados);
    }

    function mostrarResultadosProducto(resultados) {
        const contenedor = document.getElementById('resultadosProducto');
        contenedor.innerHTML = '';
        
        resultados.forEach(producto => {
            const div = document.createElement('div');
            div.className = 'resultado-item';
            div.innerHTML = `
                <strong>${producto.Nombre}</strong>
                <br>
                ${producto.Descripcion}
                <br>
                <small>Categoría: ${producto.categoria}</small>
            `;
            div.addEventListener('click', () => seleccionarProducto(producto));
            contenedor.appendChild(div);
        });
        
        contenedor.style.display = resultados.length > 0 ? 'block' : 'none';
        document.getElementById('seccionVariantes').style.display = 'none';
    }

    function seleccionarProducto(producto) {
        productoSeleccionado = producto;
        document.getElementById('busquedaProducto').value = producto.Nombre;
        document.getElementById('resultadosProducto').style.display = 'none';
        
        // Mostrar variantes del producto
        const variantesProducto = variantes.filter(v => v.id_producto === producto.idProducto);
        mostrarVariantes(variantesProducto);
    }

    function mostrarVariantes(variantesProducto) {
        const contenedor = document.getElementById('listaVariantes');
        contenedor.innerHTML = '';
        
        variantesProducto.forEach(variante => {
            const div = document.createElement('div');
            div.className = 'variante-item';
            div.innerHTML = `
                <div>${variante.descripcion}</div>
                <div>${variante.valor_medida} ${variante.unidad_medida}</div>
                <div>Precio: $${variante.precio_unitario}</div>
            `;
            div.addEventListener('click', () => seleccionarVariante(variante));
            contenedor.appendChild(div);
        });
        
        document.getElementById('seccionVariantes').style.display = 'block';
    }

    function seleccionarVariante(variante) {
        varianteSeleccionada = variante;
        document.getElementById('unidadMedida').textContent = variante.unidad_medida;
        document.getElementById('formularioVariante').style.display = 'block';
        
        // Resaltar variante seleccionada
        document.querySelectorAll('.variante-item').forEach(item => {
            item.classList.remove('seleccionado');
        });
        event.currentTarget.classList.add('seleccionado');
    }

    function agregarProductoACompra() {
        if (!productoSeleccionado || !varianteSeleccionada) {
            alert('Por favor, seleccione un producto y una variante');
            return;
        }

        const cantidad = parseFloat(document.getElementById('cantidad').value);
        const precioTotal = parseFloat(document.getElementById('precioCompraTotal').value);

        if (!cantidad || !precioTotal) {
            alert('Por favor, ingrese cantidad y precio');
            return;
        }

        const precioUnitario = precioTotal / cantidad;

        const productoCompra = {
            idProducto: productoSeleccionado.idProducto,
            idVariante: varianteSeleccionada.id_variante,
            nombre: productoSeleccionado.Nombre,
            descripcionVariante: varianteSeleccionada.descripcion,
            cantidad: cantidad,
            unidadMedida: varianteSeleccionada.unidad_medida,
            precioUnitario: precioUnitario,
            precioTotal: precioTotal
        };

        productosCompra.push(productoCompra);
        actualizarTablaProductos();
        limpiarFormularioProducto();
    }

    function actualizarTablaProductos() {
        const tbody = document.querySelector('#tablaProductos tbody');
        tbody.innerHTML = '';
        
        productosCompra.forEach((producto, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${producto.nombre}</td>
                <td>${producto.descripcionVariante}</td>
                <td>${producto.cantidad}</td>
                <td>${producto.unidadMedida}</td>
                <td>$${producto.precioUnitario.toFixed(2)}</td>
                <td>$${producto.precioTotal.toFixed(2)}</td>
                <td>
                    <button onclick="eliminarProducto(${index})" class="btn btn-peligro">Eliminar</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
        
        calcularTotales();
    }

    function limpiarFormularioProducto() {
        document.getElementById('busquedaProducto').value = '';
        document.getElementById('cantidad').value = '';
        document.getElementById('precioCompraTotal').value = '';
        document.getElementById('seccionVariantes').style.display = 'none';
        document.getElementById('formularioVariante').style.display = 'none';
        productoSeleccionado = null;
        varianteSeleccionada = null;
    }

    function calcularTotales() {
        const subtotal = productosCompra.reduce((sum, item) => sum + item.precioTotal, 0);
        const impuesto = parseFloat(document.getElementById('impuesto').value) || 0;
        const valorImpuesto = subtotal * (impuesto / 100);
        const total = subtotal + valorImpuesto;

        document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
        document.getElementById('valorImpuesto').textContent = `$${valorImpuesto.toFixed(2)}`;
        document.getElementById('total').textContent = `$${total.toFixed(2)}`;
    }

    function guardarCompra() {
        if (!proveedorSeleccionado) {
            alert('Por favor, seleccione un proveedor');
            return;
        }

        if (productosCompra.length === 0) {
            alert('Por favor, agregue al menos un producto');
            return;
        }

        const compra = {
            id: Date.now(),
            fecha: new Date().toISOString().split('T')[0],
            idProveedor: proveedorSeleccionado.id,
            proveedor: proveedorSeleccionado.nombre,
            productos: productosCompra,
            subtotal: parseFloat(document.getElementById('subtotal').textContent.slice(1)),
            impuesto: parseFloat(document.getElementById('valorImpuesto').textContent.slice(1)),
            total: parseFloat(document.getElementById('total').textContent.slice(1)),
            observaciones: document.getElementById('observaciones').value,
            estado: 'Pendiente'
        };

        comprasData.push(compra);
        
        if (window.datosGlobales) {
            window.datosGlobales.compras = comprasData;
            localStorage.setItem('datosGlobales', JSON.stringify(window.datosGlobales));
        }

        cargarCompras();
        cerrarFormularioCompra();
        alert('Compra guardada con éxito');
    }

    // Funciones auxiliares y exportación de funciones necesarias
    window.eliminarProducto = function(index) {
        productosCompra.splice(index, 1);
        actualizarTablaProductos();
    };

    // Inicialización
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCompras);
    } else {
        initCompras();
    }
})();