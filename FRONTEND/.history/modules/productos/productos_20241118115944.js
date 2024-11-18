// productos.js
(function() {
    console.log('Iniciando carga del módulo de productos');

    let productos = [
        { id: 1, nombre: 'suero klarents', descripcion: 'Descripción del Producto A', precio: 19.99, proveedorId: 1, proveedor: 'Proveedor A' },
        { id: 2, nombre: 'Jugo del Valle', descripcion: 'Rico juego artificial sabor a naranja', precio: 3500, proveedorId: 2, proveedor: 'Coca Cola' },
    ];

    let proveedores = [
        { id: 1, nombre: 'Klarents', numeroContacto: 3502874505 },
        { id: 2, nombre: 'Coca Cola', numeroContacto: 3006742872 },
        { id: 3, nombre: 'Postobón', numeroContacto: 3217894576},
    ];

    function cargarProveedores() {
        const selectProveedor = document.getElementById('proveedorProducto');
        if (selectProveedor) {
            selectProveedor.innerHTML = '<option value="">Seleccione un proveedor</option>';
            proveedores.forEach(proveedor => {
                selectProveedor.innerHTML += `<option value="${proveedor.id}">${proveedor.nombre}</option>`;
            });
        }
    }

    function cargarProductos() {
        const cuerpoTabla = document.getElementById('cuerpoTablaProductos');
        if (cuerpoTabla) {
            cuerpoTabla.innerHTML = '';
            productos.forEach(producto => {
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
        const proveedor = proveedores.find(p => p.id == producto.proveedorId);
        producto.proveedor = proveedor ? proveedor.nombre : 'Desconocido';
        producto.id = Date.now(); // Asignar un nuevo ID único
        productos.push(producto);
        cargarProductos();
    }

    function editarProducto(id) {
        const producto = productos.find(p => p.id === id);
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
            productos = productos.filter(p => p.id !== id);
            cargarProductos();
        }
    }

    function buscarProductos() {
        const termino = document.getElementById('busquedaProducto').value.toLowerCase();
        const productosFiltrados = productos.filter(p => 
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
                const index = productos.findIndex(p => p.id == idProducto);
                if (index !== -1) {
                    const proveedor = proveedores.find(p => p.id == producto.proveedorId);
                    producto.proveedor = proveedor ? proveedor.nombre : 'Desconocido';
                    producto.id = parseInt(idProducto);
                    productos[index] = producto;
                    cargarProductos();
                }
            }
            document.getElementById('modalProducto').style.display = 'none';
        });

        document.getElementById('btnBuscar')?.addEventListener('click', buscarProductos);
    }

    function initProductos() {
        console.log('Inicializando módulo de productos');
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