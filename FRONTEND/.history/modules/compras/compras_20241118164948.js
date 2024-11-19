(function() {
    let comprasData = [];
    let proveedores = [];
    let productos = [];
    let variantes = [];
    let productosCompra = [];
    let proveedorSeleccionado = null;
    let productoSeleccionado = null;
    let varianteSeleccionada = null;

    function initCompras() {
        if (!document.getElementById('categoriaFiltro')) {
            console.error('Elementos del formulario no encontrados. Verifica la carga del HTML.');
            return;
        }
        cargarDatosIniciales();
        configurarEventListeners();
    }

    function cargarDatosIniciales() {
        if (window.datosGlobales) {
            comprasData = window.datosGlobales.compras || [];
            proveedores = window.datosGlobales.proveedores || [];
            productos = window.datosGlobales.productos || [];
            variantes = window.datosGlobales.variantes || [];
            
            cargarCategorias();
            cargarCompras();
        }
    }

    function cargarCategorias() {
        const selectCategorias = document.getElementById('categoriaFiltro');
        if (!selectCategorias) {
            console.error('Elemento con id "categoriaFiltro" no encontrado. Verifica que exista en el HTML.');
            return;
        }
        
        try {
            const categorias = [...new Set(productos.map(p => p.categoria))].filter(Boolean);
            selectCategorias.innerHTML = '<option value="">Todas las categorías</option>';
            
            categorias.forEach(categoria => {
                if (categoria) {  // Solo agregar si la categoría existe
                    const option = document.createElement('option');
                    option.value = categoria;
                    option.textContent = categoria;
                    selectCategorias.appendChild(option);
                }
            });
        } catch (error) {
            console.error('Error al cargar categorías:', error);
        }
    }

    function configurarEventListeners() {
        // Búsqueda de proveedores
        document.getElementById('busquedaProveedor').addEventListener('input', (e) => {
            const termino = e.target.value.toLowerCase();
            const resultados = proveedores.filter(p => 
                p.nombre.toLowerCase().includes(termino) ||
                p.numeroContacto.toString().includes(termino)
            );
            mostrarResultadosProveedor(resultados);
        });

        // Búsqueda de productos
        document.getElementById('busquedaProducto').addEventListener('input', (e) => {
            buscarProductos();
        });

        document.getElementById('categoriaFiltro').addEventListener('change', () => {
            buscarProductos();
        });

        // Otros event listeners existentes...
        document.getElementById('btnNuevaCompra').addEventListener('click', mostrarFormularioCompra);
        document.getElementById('btnCerrarFormulario').addEventListener('click', cerrarFormularioCompra);
        document.getElementById('btnAgregarProducto').addEventListener('click', agregarProductoACompra);
        document.getElementById('btnGuardarCompra').addEventListener('click', guardarCompra);
        document.getElementById('impuesto').addEventListener('input', calcularTotales);
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