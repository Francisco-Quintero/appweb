// productos.js
(function() {
    console.log('Iniciando carga del módulo de productos');

    let productos = [];
    let variantes = [];

            // Función para generar los botones de acción con iconos
            function generarBotonesAccion(idProducto) {
                return `
                    <div class="acciones">
                        <button onclick="editarProducto(${idProducto})" class="btn btn-icon btn-secundario" title="Editar">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit-2"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                        </button>
                        <button onclick="eliminarProducto(${idProducto})" class="btn btn-icon btn-peligro" title="Eliminar">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash-2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                        </button>
                        <button onclick="mostrarVariantes(${idProducto})" class="btn btn-icon btn-primario" title="Variantes">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-layers"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
                        </button>
                    </div>
                `;
            }

    function cargarDatosDesdeLocalStorage() {
        try {
            const datosGuardados = JSON.parse(localStorage.getItem('datosGlobales') || '{}');
            productos = datosGuardados.productos || [];
            variantes = datosGuardados.variantes || [];
            console.log('Productos y variantes cargados desde localStorage');
        } catch (error) {
            console.error('Error al cargar datos desde localStorage:', error);
        }
    }

    function guardarEnLocalStorage() {
        try {
            const datosActuales = JSON.parse(localStorage.getItem('datosGlobales') || '{}');
            datosActuales.productos = productos;
            datosActuales.variantes = variantes;
            localStorage.setItem('datosGlobales', JSON.stringify(datosActuales));
            console.log('Datos guardados en localStorage');
        } catch (error) {
            console.error('Error al guardar en localStorage:', error);
        }
    }

    function sincronizarConDatosGlobales() {
        if (window.datosGlobales) {
            if (Array.isArray(window.datosGlobales.productos)) {
                productos = window.datosGlobales.productos;
            }
            if (Array.isArray(window.datosGlobales.variantes)) {
                variantes = window.datosGlobales.variantes;
            }
            cargarProductos();
            console.log('Datos sincronizados con datosGlobales');
        }
    }

    function cargarProductos() {
        const cuerpoTabla = document.getElementById('cuerpoTablaProductos');
        if (!cuerpoTabla) {
            console.error('No se encontró el elemento cuerpoTablaProductos');
            return;
        }

        const contenidoTabla = productos.length === 0
            ? '<tr><td colspan="7" class="text-center">No hay productos registrados. Haga clic en "+" para agregar uno nuevo.</td></tr>'
            : productos.map(producto => {
                const variantesProducto = variantes.filter(v => v.id_producto === producto.idProducto);
                const variantesHTML = variantesProducto.map(v => `
                    <div class="variante-item">
                        ${v.descripcion} - ${v.unidad_medida} ${v.valor_medida} - $${v.precio_unitario}
                    </div>
                `).join('');

                return `
                    <tr>
                        <td>${producto.idProducto}</td>
                        <td>${producto.Nombre}</td>
                        <td>${producto.Descripcion}</td>
                        <td>${producto.categoria}</td>
                        <td>
                            <img src="${producto.imagenProducto || '/placeholder.jpg'}" 
                                alt="${producto.Nombre}" 
                                class="producto-imagen"
                                style="max-width: 50px; height: auto;">
                        </td>
                        <td>${variantesHTML}</td>
                        <td>
                            <button onclick="window.moduloProductos.editarProducto(${producto.idProducto})" 
                                    class="btn btn-secundario">Editar</button>
                            <button onclick="window.moduloProductos.eliminarProducto(${producto.idProducto})" 
                                    class="btn btn-peligro">Eliminar</button>
                            <button onclick="window.moduloProductos.gestionarVariantes(${producto.idProducto})" 
                                    class="btn btn-primario">Variantes</button>
                        </td>
                    </tr>
                `;
            }).join('');

        cuerpoTabla.innerHTML = contenidoTabla;
    }

    function manejarEnvioFormulario(e) {
        e.preventDefault();
        
        const idProducto = document.getElementById('idProducto').value;
        const producto = {
            idProducto: idProducto ? parseInt(idProducto) : Date.now(),
            Nombre: document.getElementById('nombreProducto').value,
            Descripcion: document.getElementById('descripcionProducto').value,
            categoria: document.getElementById('categoriaProducto').value,
            imagenProducto: document.getElementById('imagenProducto').value
        };

        if (idProducto) {
            const index = productos.findIndex(p => p.idProducto === parseInt(idProducto));
            if (index !== -1) {
                productos[index] = producto;
                console.log('Producto actualizado:', producto);
            }
        } else {
            productos.push(producto);
            console.log('Nuevo producto agregado:', producto);
        }

        guardarEnLocalStorage();
        cargarProductos();
        document.getElementById('modalProducto').style.display = 'none';
    }

    function manejarEnvioFormularioVariante(e) {
        e.preventDefault();
        
        const idVariante = document.getElementById('idVariante').value;
        const variante = {
            id_variante: idVariante ? parseInt(idVariante) : Date.now(),
            id_producto: parseInt(document.getElementById('idProductoVariante').value),
            descripcion: document.getElementById('descripcionVariante').value,
            unidad_medida: document.getElementById('unidadMedida').value,
            valor_medida: parseFloat(document.getElementById('valorMedida').value),
            precio_unitario: parseFloat(document.getElementById('precioUnitario').value)
        };

        if (idVariante) {
            const index = variantes.findIndex(v => v.id_variante === parseInt(idVariante));
            if (index !== -1) {
                variantes[index] = variante;
                console.log('Variante actualizada:', variante);
            }
        } else {
            variantes.push(variante);
            console.log('Nueva variante agregada:', variante);
        }

        guardarEnLocalStorage();
        cargarProductos();
        document.getElementById('modalVariante').style.display = 'none';
    }

    function configurarEventListeners() {
        document.getElementById('btnAgregarProducto').addEventListener('click', () => {
            document.getElementById('formularioProducto').reset();
            document.getElementById('idProducto').value = '';
            document.getElementById('modalProducto').style.display = 'block';
        });

        document.getElementById('btnCancelar').addEventListener('click', () => {
            document.getElementById('modalProducto').style.display = 'none';
        });

        document.getElementById('btnCancelarVariante').addEventListener('click', () => {
            document.getElementById('modalVariante').style.display = 'none';
        });

        document.getElementById('formularioProducto').addEventListener('submit', manejarEnvioFormulario);
        document.getElementById('formularioVariante').addEventListener('submit', manejarEnvioFormularioVariante);
        document.getElementById('btnBuscar').addEventListener('click', buscarProductos);
    }

    function buscarProductos() {
        const termino = document.getElementById('busquedaProducto').value.toLowerCase();
        const productosFiltrados = productos.filter(p => 
            p.Nombre.toLowerCase().includes(termino) ||
            p.Descripcion.toLowerCase().includes(termino) ||
            p.categoria.toLowerCase().includes(termino)
        );
        cargarProductos(productosFiltrados);
    }

    function initProductos() {
        console.log('Inicializando módulo de productos');
        cargarDatosDesdeLocalStorage();
        cargarProductos();
        configurarEventListeners();
        
        window.addEventListener('datosGlobalesListo', sincronizarConDatosGlobales);
        
        if (window.datosGlobales) {
            sincronizarConDatosGlobales();
        }
        
        console.log('Módulo de productos cargado completamente');
    }

    window.moduloProductos = {
        init: initProductos,
        editarProducto: function(idProducto) {
            const producto = productos.find(p => p.idProducto === idProducto);
            if (producto) {
                document.getElementById('idProducto').value = producto.idProducto;
                document.getElementById('nombreProducto').value = producto.Nombre;
                document.getElementById('descripcionProducto').value = producto.Descripcion;
                document.getElementById('categoriaProducto').value = producto.categoria;
                document.getElementById('imagenProducto').value = producto.imagenProducto;
                document.getElementById('modalProducto').style.display = 'block';
            }
        },
        eliminarProducto: function(idProducto) {
            if (confirm('¿Estás seguro de que quieres eliminar este producto y todas sus variantes?')) {
                productos = productos.filter(p => p.idProducto !== idProducto);
                variantes = variantes.filter(v => v.id_producto !== idProducto);
                guardarEnLocalStorage();
                cargarProductos();
            }
        },
        gestionarVariantes: function(idProducto) {
            document.getElementById('idProductoVariante').value = idProducto;
            document.getElementById('formularioVariante').reset();
            document.getElementById('idVariante').value = '';
            document.getElementById('modalVariante').style.display = 'block';
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initProductos);
    } else {
        initProductos();
    }
})();

console.log('Archivo productos.js cargado completamente');