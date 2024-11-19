// productos.js
(function() {
    console.log('Iniciando carga del módulo de productos');

    // Función para guardar los cambios en los datos globales
    function guardarCambios() {
        if (typeof window.guardarDatosGlobales === 'function') {
            window.guardarDatosGlobales(window.datosGlobales);
        } else {
            console.error('La función guardarDatosGlobales no está disponible');
        }
    }

    function cargarProveedores() {
        const selectProveedor = document.getElementById('proveedorProducto');
        if (selectProveedor) {
            selectProveedor.innerHTML = '<option value="">Seleccione un proveedor</option>';
            window.datosGlobales.proveedores.forEach(proveedor => {
                selectProveedor.innerHTML += `<option value="${proveedor.id}">${proveedor.nombre}</option>`;
            });
        }
    }

    function cargarProductos() {
        const cuerpoTabla = document.getElementById('cuerpoTablaProductos');
        if (cuerpoTabla) {
            cuerpoTabla.innerHTML = '';
            window.datosGlobales.productos.forEach(producto => {
                const fila = `
                    <tr>
                        <td>${producto.id}</td>
                        <td>${producto.nombre}</td>
                        <td>${producto.descripcion}</td>
                        <td>$${producto.precio.toFixed(2)}</td>
                        <td>${producto.proveedor || 'N/A'}</td>
                        <td>
                            <button onclick="window.moduloProductos.editarProducto(${producto.id})" class="btn btn-secundario">Editar</button>
                            <button onclick="window.moduloProductos.eliminarProducto(${producto.id})" class="btn btn-peligro">Eliminar</button>
                        </td>
                    </tr>
                `;
                cuerpoTabla.innerHTML += fila;
            });
        }
    }

    function agregarProducto(producto) {
        const proveedor = window.datosGlobales.proveedores.find(p => p.id == producto.proveedorId);
        producto.proveedor = proveedor ? proveedor.nombre : 'Desconocido';
        producto.id = Date.now(); // Asignar un nuevo ID único
        window.datosGlobales.productos.push(producto);
        guardarCambios();
        cargarProductos();
    }

    function editarProducto(id) {
        const producto = window.datosGlobales.productos.find(p => p.id === id);
        if (producto) {
            document.getElementById('idProducto').value = producto.id;
            document.getElementById('nombreProducto').value = producto.nombre;
            document.getElementById('descripcionProducto').value = producto.descripcion;
            document.getElementById('precioProducto').value = producto.precio;
            document.getElementById('proveedorProducto').value = producto.proveedorId || '';
            document.getElementById('modalProducto').style.display = 'block';
        }
    }

    function eliminarProducto(id) {
        if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
            window.datosGlobales.productos = window.datosGlobales.productos.filter(p => p.id !== id);
            guardarCambios();
            cargarProductos();
        }
    }

    function buscarProductos() {
        const termino = document.getElementById('busquedaProducto').value.toLowerCase();
        const productosFiltrados = window.datosGlobales.productos.filter(p => 
            p.nombre.toLowerCase().includes(termino) ||
            p.descripcion.toLowerCase().includes(termino) ||
            p.proveedor.toLowerCase().includes(termino)
        );
        const cuerpoTabla = document.getElementById('cuerpoTablaProductos');
        if (cuerpoTabla) {
            cuerpoTabla.innerHTML = '';
            productosFiltrados.forEach(producto => {
                const fila = `
                    <tr>
                        <td>${producto.id}</td>
                        <td>${producto.nombre}</td>
                        <td>${producto.descripcion}</td>
                        <td>$${producto.precio.toFixed(2)}</td>
                        <td>${producto.proveedor || 'N/A'}</td>
                        <td>
                            <button onclick="window.moduloProductos.editarProducto(${producto.id})" class="btn btn-secundario">Editar</button>
                            <button onclick="window.moduloProductos.eliminarProducto(${producto.id})" class="btn btn-peligro">Eliminar</button>
                        </td>
                    </tr>
                `;
                cuerpoTabla.innerHTML += fila;
            });
        }
    }

    function configurarEventListeners() {
        document.getElementById('btnAgregarProducto')?.addEventListener('click', () => {
            document.getElementById('formularioProducto').reset();
            document.getElementById('idProducto').value = ''; // Limpiar el ID para nuevo producto
            document.getElementById('modalProducto').style.display = 'block';
        });

        document.getElementById('btnCancelar')?.addEventListener('click', () => {
            document.getElementById('modalProducto').style.display = 'none';
        });

        document.getElementById('formularioProducto')?.addEventListener('submit', (e) => {
            e.preventDefault();
            const idProducto = document.getElementById('idProducto').value;
            const producto = {
                nombre: document.getElementById('nombreProducto').value,
                descripcion: document.getElementById('descripcionProducto').value,
                precio: parseFloat(document.getElementById('precioProducto').value),
                proveedorId: document.getElementById('proveedorProducto').value
            };
            
            if (!idProducto) {
                // Es un nuevo producto
                agregarProducto(producto);
            } else {
                // Es una edición de un producto existente
                const index = window.datosGlobales.productos.findIndex(p => p.id == idProducto);
                if (index !== -1) {
                    const proveedor = window.datosGlobales.proveedores.find(p => p.id == producto.proveedorId);
                    producto.proveedor = proveedor ? proveedor.nombre : 'Desconocido';
                    producto.id = parseInt(idProducto);
                    window.datosGlobales.productos[index] = producto;
                    guardarCambios();
                    cargarProductos();
                }
            }
            document.getElementById('modalProducto').style.display = 'none';
        });

        document.getElementById('btnBuscar')?.addEventListener('click', buscarProductos);
    }

    function initProductos() {
        console.log('Inicializando módulo de productos');
        if (!window.datosGlobales || !Array.isArray(window.datosGlobales.productos)) {
            console.error('Error: Los datos globales de productos no están disponibles');
            return;
        }
        cargarProductos();
        cargarProveedores();
        configurarEventListeners();
        console.log('Módulo de productos cargado completamente');
    }

    // API pública del módulo
    window.moduloProductos = {
        init: initProductos,
        editarProducto: editarProducto,
        eliminarProducto: eliminarProducto,
        buscarProductos: buscarProductos
    };

    // Inicialización del módulo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initProductos);
    } else {
        initProductos();
    }

    console.log('Módulo de productos cargado');
})();