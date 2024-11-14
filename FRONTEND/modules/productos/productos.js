// En modules/productos/productos.js
function initProductos() {
    console.log('Módulo de productos cargado');

    let productos = [
        { id: 1, nombre: 'Producto A', descripcion: 'Descripción del Producto A', precio: 19.99, stock: 100, proveedorId: 1, proveedor: 'Proveedor A' },
        { id: 2, nombre: 'Producto B', descripcion: 'Descripción del Producto B', precio: 29.99, stock: 50, proveedorId: 2, proveedor: 'Proveedor B' },
    ];

    let proveedores = [
        { id: 1, nombre: 'Proveedor A' },
        { id: 2, nombre: 'Proveedor B' },
        { id: 3, nombre: 'Proveedor C' },
    ];

    function cargarProveedores() {
        const selectProveedor = document.getElementById('proveedorProducto');
        selectProveedor.innerHTML = '<option value="">Seleccione un proveedor</option>';
        proveedores.forEach(proveedor => {
            selectProveedor.innerHTML += `<option value="${proveedor.id}">${proveedor.nombre}</option>`;
        });
    }

    function cargarProductos() {
        const cuerpoTabla = document.getElementById('cuerpoTablaProductos');
        cuerpoTabla.innerHTML = '';
        productos.forEach(producto => {
            const fila = `
                <tr>
                    <td>${producto.id}</td>
                    <td>${producto.nombre}</td>
                    <td>${producto.descripcion}</td>
                    <td>$${producto.precio.toFixed(2)}</td>
                    <td>${producto.stock}</td>
                    <td>${producto.proveedor || 'N/A'}</td>
                    <td>
                        <button onclick="editarProducto(${producto.id})" class="btn btn-secundario">Editar</button>
                        <button onclick="eliminarProducto(${producto.id})" class="btn btn-peligro">Eliminar</button>
                    </td>
                </tr>
            `;
            cuerpoTabla.innerHTML += fila;
        });
    }

    function agregarProducto(producto) {
        const proveedor = proveedores.find(p => p.id == producto.proveedorId);
        producto.proveedor = proveedor ? proveedor.nombre : 'Desconocido';
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
            document.getElementById('stockProducto').value = producto.stock;
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
        cuerpoTabla.innerHTML = '';
        productosFiltrados.forEach(producto => {
            const fila = `
                <tr>
                    <td>${producto.id}</td>
                    <td>${producto.nombre}</td>
                    <td>${producto.descripcion}</td>
                    <td>$${producto.precio.toFixed(2)}</td>
                    <td>${producto.stock}</td>
                    <td>${producto.proveedor || 'N/A'}</td>
                    <td>
                        <button onclick="editarProducto(${producto.id})" class="btn btn-secundario">Editar</button>
                        <button onclick="eliminarProducto(${producto.id})" class="btn btn-peligro">Eliminar</button>
                    </td>
                </tr>
            `;
            cuerpoTabla.innerHTML += fila;
        });
    }

    // Configurar event listeners
    document.getElementById('btnAgregarProducto').addEventListener('click', () => {
        document.getElementById('formularioProducto').reset();
        document.getElementById('modalProducto').style.display = 'block';
    });

    document.getElementById('btnCancelar').addEventListener('click', () => {
        document.getElementById('modalProducto').style.display = 'none';
    });

    document.getElementById('formularioProducto').addEventListener('submit', (e) => {
        e.preventDefault();
        const producto = {
            id: document.getElementById('idProducto').value || Date.now(),
            nombre: document.getElementById('nombreProducto').value,
            descripcion: document.getElementById('descripcionProducto').value,
            precio: parseFloat(document.getElementById('precioProducto').value),
            stock: parseInt(document.getElementById('stockProducto').value),
            proveedorId: document.getElementById('proveedorProducto').value
        };
        if (producto.id === Date.now()) {
            agregarProducto(producto);
        } else {
            const index = productos.findIndex(p => p.id == producto.id);
            if (index !== -1) {
                const proveedor = proveedores.find(p => p.id == producto.proveedorId);
                producto.proveedor = proveedor ? proveedor.nombre : 'Desconocido';
                productos[index] = producto;
                cargarProductos();
            }
        }
        document.getElementById('modalProducto').style.display = 'none';
    });

    document.getElementById('btnBuscar').addEventListener('click', buscarProductos);

    // Exponer funciones necesarias globalmente
    window.editarProducto = editarProducto;
    window.eliminarProducto = eliminarProducto;

    // Inicialización
    cargarProductos();
    cargarProveedores();
}

// Asegúrate de que la función initProductos esté disponible globalmente
window.initProductos = initProductos;