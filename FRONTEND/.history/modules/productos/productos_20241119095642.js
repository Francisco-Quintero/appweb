(function() {
    console.log('Iniciando carga del módulo de Productos');

    let productosState = {
        productos: [],
        variantes: []
    };

    function cargarProductos() {
        const cuerpoTabla = document.getElementById('cuerpoTablaProductos');
        if (!cuerpoTabla) {
            console.error('No se encontró el elemento cuerpoTablaProductos');
            return;
        }

        if (productosState.productos.length === 0) {
            cuerpoTabla.innerHTML = '<tr><td colspan="7" class="text-center">No hay productos registrados. Haga clic en "+" para agregar uno nuevo.</td></tr>';
            return;
        }

        cuerpoTabla.innerHTML = productosState.productos.map(producto => {
            const variantesProducto = productosState.variantes.filter(v => v.id_producto === producto.idProducto);
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
                        <div class="acciones-tabla">
                            <button onclick="editarProducto(${producto.idProducto})" class="btn-icono" title="Editar">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                            </button>
                            <button onclick="eliminarProducto(${producto.idProducto})" class="btn-icono btn-icono-eliminar" title="Eliminar">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash-2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                            </button>
                            <button onclick="gestionarVariantes(${producto.idProducto})" class="btn-icono" title="Gestionar Variantes">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-layers"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }

    function mostrarFormularioProducto() {
        document.getElementById('modalFormulario').style.display = 'block';
    }

    function cerrarFormularioProducto() {
        document.getElementById('modalFormulario').style.display = 'none';
        document.getElementById('formularioProducto').reset();
    }

    function guardarProducto(event) {
        event.preventDefault();
        const form = event.target;
        const nuevoProducto = {
            idProducto: productosState.productos.length + 1,
            Nombre: form.nombre.value,
            Descripcion: form.descripcion.value,
            categoria: form.categoria.value,
            imagenProducto: form.imagen.value || '/placeholder.jpg'
        };
        productosState.productos.push(nuevoProducto);
        cargarProductos();
        cerrarFormularioProducto();
    }

    function editarProducto(id) {
        console.log('Editando producto:', id);
        // Implementar lógica de edición
    }

    function eliminarProducto(id) {
        console.log('Eliminando producto:', id);
        productosState.productos = productosState.productos.filter(p => p.idProducto !== id);
        cargarProductos();
    }

    function gestionarVariantes(id) {
        console.log('Gestionando variantes del producto:', id);
        // Implementar lógica para gestionar variantes
    }

    function inicializarModuloProductos() {
        console.log('Inicializando módulo de Productos');
        
        // Cargar datos de ejemplo
        productosState.productos = [
            { idProducto: 1, Nombre: "Producto 1", Descripcion: "Descripción 1", categoria: "Categoría A", imagenProducto: "/placeholder.jpg" },
            { idProducto: 2, Nombre: "Producto 2", Descripcion: "Descripción 2", categoria: "Categoría B", imagenProducto: "/placeholder.jpg" }
        ];
        productosState.variantes = [
            { id: 1, id_producto: 1, descripcion: "Variante 1", unidad_medida: "kg", valor_medida: 1, precio_unitario: 10 },
            { id: 2, id_producto: 1, descripcion: "Variante 2", unidad_medida: "kg", valor_medida: 2, precio_unitario: 18 }
        ];

        cargarProductos();

        // Configurar event listeners
        document.getElementById('btnNuevoProducto').addEventListener('click', mostrarFormularioProducto);
        document.getElementById('btnCerrarFormulario').addEventListener('click', cerrarFormularioProducto);
        document.getElementById('formularioProducto').addEventListener('submit', guardarProducto);

        // Exponer funciones al ámbito global
        window.editarProducto = editarProducto;
        window.eliminarProducto = eliminarProducto;
        window.gestionarVariantes = gestionarVariantes;
    }

    // Inicializar el módulo cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', inicializarModuloProductos);
    } else {
        inicializarModuloProductos();
    }

    console.log('Módulo de Productos cargado completamente');
})();