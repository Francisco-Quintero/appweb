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

    // Función principal de inicialización
    async function initCompras() {
        try {
            console.log('Iniciando inicialización del módulo de compras');
            await cargarDatosIniciales();
            await configurarEventListeners();
            console.log('Inicialización del módulo de compras completada');
        } catch (error) {
            console.error('Error durante la inicialización:', error);
        }
    }

    // Cargar datos iniciales de forma asíncrona
    async function cargarDatosIniciales() {
        console.log('Cargando datos iniciales...');
        try {
            if (window.datosGlobales) {
                comprasData = window.datosGlobales.compras || [];
                proveedores = window.datosGlobales.proveedores || [];
                productos = window.datosGlobales.productos || [];
                variantes = window.datosGlobales.variantes || [];
                
                console.log('Datos cargados:', {
                    compras: comprasData.length,
                    proveedores: proveedores.length,
                    productos: productos.length,
                    variantes: variantes.length
                });

                await cargarCompras();
                await cargarCategorias();
                console.log('Datos iniciales cargados correctamente');
            } else {
                throw new Error('datosGlobales no está disponible');
            }
        } catch (error) {
            console.error('Error al cargar datos iniciales:', error);
            throw error;
        }
    }

    // Cargar compras de forma asíncrona
    async function cargarCompras() {
        console.log('Cargando compras en la tabla');
        try {
            const cuerpoTabla = document.getElementById('cuerpoTablaCompras');
            const comprasEmpty = document.getElementById('compras-empty');
            
            if (!cuerpoTabla) {
                throw new Error('No se encontró el elemento cuerpoTablaCompras');
            }

            if (comprasData.length === 0) {
                cuerpoTabla.innerHTML = '';
                if (comprasEmpty) {
                    comprasEmpty.style.display = 'block';
                }
                console.log('No hay compras para mostrar');
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
            
            console.log('Compras cargadas exitosamente');
        } catch (error) {
            console.error('Error al cargar compras:', error);
            throw error;
        }
    }

    // Configurar event listeners de forma asíncrona
    async function configurarEventListeners() {
        console.log('Configurando event listeners');
        try {
            const elementos = {
                btnNuevaCompra: document.getElementById('btnNuevaCompra'),
                btnCerrarFormulario: document.getElementById('btnCerrarFormulario'),
                btnAgregarProducto: document.getElementById('btnAgregarProducto'),
                btnGuardarCompra: document.getElementById('btnGuardarCompra'),
                busquedaProveedor: document.getElementById('busquedaProveedor'),
                busquedaProducto: document.getElementById('busquedaProducto'),
                categoriaFiltro: document.getElementById('categoriaFiltro'),
                impuesto: document.getElementById('impuesto')
            };

            // Verificar que todos los elementos existan
            Object.entries(elementos).forEach(([nombre, elemento]) => {
                if (!elemento) {
                    console.warn(`Elemento ${nombre} no encontrado`);
                }
            });

            // Configurar listeners solo para elementos que existen
            if (elementos.btnNuevaCompra) {
                elementos.btnNuevaCompra.addEventListener('click', mostrarFormularioCompra);
            }
            if (elementos.btnCerrarFormulario) {
                elementos.btnCerrarFormulario.addEventListener('click', cerrarFormularioCompra);
            }
            if (elementos.btnAgregarProducto) {
                elementos.btnAgregarProducto.addEventListener('click', agregarProductoACompra);
            }
            if (elementos.btnGuardarCompra) {
                elementos.btnGuardarCompra.addEventListener('click', guardarCompra);
            }
            if (elementos.busquedaProveedor) {
                elementos.busquedaProveedor.addEventListener('input', (e) => {
                    const termino = e.target.value.toLowerCase();
                    const resultados = proveedores.filter(p => 
                        p.nombre.toLowerCase().includes(termino) ||
                        p.numeroContacto.toString().includes(termino)
                    );
                    mostrarResultadosProveedor(resultados);
                });
            }
            if (elementos.busquedaProducto) {
                elementos.busquedaProducto.addEventListener('input', buscarProductos);
            }
            if (elementos.categoriaFiltro) {
                elementos.categoriaFiltro.addEventListener('change', buscarProductos);
            }
            if (elementos.impuesto) {
                elementos.impuesto.addEventListener('input', calcularTotales);
            }

            console.log('Event listeners configurados correctamente');
        } catch (error) {
            console.error('Error al configurar event listeners:', error);
            throw error;
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

    // Inicialización con mejor manejo de estado del DOM
    function comenzarInicializacion() {
        console.log('Comenzando inicialización del módulo');
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                console.log('DOM completamente cargado');
                initCompras();
            });
        } else {
            console.log('DOM ya está cargado');
            initCompras();
        }
    }

    // Comenzar la inicialización
    comenzarInicializacion();
})();