(function () {
    console.log('Iniciando carga del módulo de productos');

    let productos = [];


    const API_URL = 'http://localhost:26209/api/productos'; 

    async function cargarProductosDesdeAPI() {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error(`Error al obtener productos: ${response.statusText}`);
            productos = await response.json();
            console.log('Productos cargados desde la API:', productos);
            cargarProductos(); 
        } catch (error) {
            console.error('Error al cargar productos desde la API:', error);
        }
    }

    async function guardarProductoEnAPI(producto) {
        try {
            const method = producto.idProducto ? 'PUT' : 'POST';
            const endpoint = producto.idProducto ? `${API_URL}/${producto.idProducto}` : API_URL;
    
            // Crear una copia del objeto producto sin el campo idProducto si es un POST
            const productoParaEnviar = { ...producto };
            if (!producto.idProducto) {
                delete productoParaEnviar.idProducto; // Eliminar idProducto para creación
            }
    
            const response = await fetch(endpoint, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productoParaEnviar)
            });
    
            if (!response.ok) throw new Error(`Error al guardar producto: ${response.statusText}`);
    
            console.log(`Producto ${producto.idProducto ? 'actualizado' : 'creado'} correctamente`);
            cargarProductosDesdeAPI(); // Recargar productos después de guardar.
        } catch (error) {
            console.error('Error al guardar producto en la API:', error);
            alert('Hubo un error al guardar el producto. Por favor, intenta de nuevo.');
        }
    }

    async function eliminarProductoEnAPI(idProducto) {
        try {
            // Mostrar mensaje de confirmación
            const confirmacion = confirm("¿Estás seguro de que deseas eliminar este producto?");
            if (!confirmacion) {
                console.log("Eliminación cancelada por el usuario.");
                return; // Salir si el usuario cancela
            }
    
            const response = await fetch(`${API_URL}/${idProducto}`, {
                method: 'DELETE',
            });
    
            if (!response.ok) throw new Error(`Error al eliminar producto: ${response.statusText}`);
    
            console.log("Producto eliminado correctamente");
            cargarProductosDesdeAPI(); // Recargar productos después de eliminar.
        } catch (error) {
            console.error("Error al eliminar producto en la API:", error);
        }
    }
    

    function cargarProductos() {
        const cuerpoTabla = document.getElementById('cuerpoTablaProductos');
        if (!cuerpoTabla) {
            console.error('No se encontró el elemento cuerpoTablaProductos');
            return;
        }

        const contenidoTabla = productos.length === 0
            ? '<tr><td colspan="6" class="text-center">No hay productos registrados. Haga clic en "+" para agregar uno nuevo.</td></tr>'
            : productos.map(producto => {
                return `
                    <tr>
                        <td>${producto.idProducto}</td>
                        <td>${producto.nombre}</td>
                        <td>${producto.descripcion}</td>
                        <td>${producto.categoria}</td>
                        <td>${producto.cantidadMedida}</td>
                        <td>${producto.unidadMedida}</td>
                        <td>
                            <img src="${producto.imagenProducto || '/placeholder.jpg'}" 
                                alt="${producto.nombre}" 
                                class="producto-imagen"
                                style="max-width: 50px; height: auto;">
                        </td>
                        <td>
                            <div class="acciones-tabla">
                                <button onclick="window.moduloProductos.editarProducto(${producto.idProducto})" 
                                        class="btn-icono" title="Editar">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                </button>
                                <button onclick="window.moduloProductos.eliminarProducto(${producto.idProducto})" 
                                        class="btn-icono btn-icono-eliminar" title="Eliminar">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash-2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                </button>
                            </div>
                        </td>
                    </tr>
                `;
            }).join('');

        cuerpoTabla.innerHTML = contenidoTabla;
    }
    
    function manejarEnvioFormulario(e) {
        e.preventDefault();
    
        // Obtener los valores del formulario
        const idProducto = document.getElementById('idProducto').value || null;
        const nombre = document.getElementById('nombreProducto').value.trim();
        const descripcion = document.getElementById('descripcionProducto').value.trim();
        const categoria = document.getElementById('categoriaProducto').value.trim();
        const valorMedida = document.getElementById('valorMedida').value;
        const unidadMedida = document.getElementById('unidadMedida').value.trim();
        const imagenProducto = document.getElementById('imagenProducto').value.trim();
    
        // Validar los campos
        if (!nombre || !descripcion || !categoria || !valorMedida || !unidadMedida) {
            alert('Por favor, completa todos los campos obligatorios.');
            return;
        }
    
        // Convertir valorMedida a número y validar
        const cantidadMedida = parseFloat(valorMedida);
        if (isNaN(cantidadMedida) || cantidadMedida <= 0) {
            alert('El valor de medida debe ser un número positivo.');
            return;
        }
    
        // Crear el objeto producto con el formato correcto
        const producto = {
            idProducto: idProducto,
            nombre: nombre,
            descripcion: descripcion,
            precioUnitario: 2000, // Asumiendo un valor fijo por ahora
            categoria: categoria,
            cantidadMedida: cantidadMedida,
            unidadMedida: unidadMedida,
            imagenProducto: imagenProducto || null // Si no se proporciona una imagen, se envía null
        };
    
        // Enviar el producto a la API
        guardarProductoEnAPI(producto);
    
        // Cerrar el modal
        document.getElementById('modalProducto').style.display = 'none';
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

        document.getElementById('formularioProducto').addEventListener('submit', manejarEnvioFormulario);
    }

    function initProductos() {
        console.log('Inicializando módulo de productos');
        cargarProductosDesdeAPI();
        configurarEventListeners();
    }

    window.moduloProductos = {
        init: initProductos,
        editarProducto: function (idProducto) {
            const producto = productos.find(p => p.idProducto === idProducto);
            if (producto) {
                document.getElementById('idProducto').value = producto.idProducto;
                document.getElementById('nombreProducto').value = producto.nombre;
                document.getElementById('descripcionProducto').value = producto.descripcion;
                document.getElementById('categoriaProducto').value = producto.categoria;
                document.getElementById('imagenProducto').value = producto.imagenProducto;
                document.getElementById('valorMedida').value = producto.cantidadMedida;
                document.getElementById('unidadMedida').value = producto.unidadMedida;
                document.getElementById('modalProducto').style.display = 'block';
            }
        },
        eliminarProducto: eliminarProductoEnAPI
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initProductos);
    } else {
        initProductos();
    }
})();
