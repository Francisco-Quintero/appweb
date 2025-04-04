export async function initProductos(estadoGlobal) {
    console.log('Inicializando módulo de productos...');

    // Verificar si los datos de productos están disponibles en el estado global
    if (estadoGlobal.productos.length === 0) {
        console.warn('El producto no está disponible en el estado global. Intentando cargar desde la API...');
        await cargarProductosDesdeAPI(estadoGlobal);
    }

    // Renderizar los productos
    renderizarProductos(estadoGlobal);

    // Configurar eventos del módulo
    configurarEventListeners(estadoGlobal);
}

// Función para cargar productos desde la API y actualizar el estado global
async function cargarProductosDesdeAPI(estadoGlobal) {
    try {
        const response = await fetch('http://localhost:26209/api/productos');
        if (!response.ok) throw new Error(`Error al obtener productos: ${response.statusText}`);
        const productos = await response.json();

        // Actualizar el estado global
        estadoGlobal.actualizarProductos(productos);

        console.log('Productos cargados desde la API y actualizados en el estado global:', productos);
    } catch (error) {
        console.error('Error al cargar productos desde la API:', error);
    }
}

// Función para renderizar los productos en la tabla
// Función para renderizar los productos en la tabla
function renderizarProductos(estadoGlobal) {
    const cuerpoTabla = document.getElementById('cuerpoTablaProductos');
    if (!cuerpoTabla) {
        console.error('No se encontró el elemento cuerpoTablaProductos');
        return;
    }

    const productos = estadoGlobal.productos;

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
                            <button class="btn-editar" data-id="${producto.idProducto}" title="Editar">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                            </button>
                            <button class="btn-eliminar" data-id="${producto.idProducto}" title="Eliminar">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash-2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');

    cuerpoTabla.innerHTML = contenidoTabla;

    // Asignar eventos a los botones de edición y eliminación
    cuerpoTabla.querySelectorAll('.btn-editar').forEach(button => {
        button.addEventListener('click', () => {
            const idProducto = parseInt(button.dataset.id);
            editarProducto(idProducto, estadoGlobal);
        });
    });

    cuerpoTabla.querySelectorAll('.btn-eliminar').forEach(button => {
        button.addEventListener('click', () => {
            const idProducto = parseInt(button.dataset.id);
            eliminarProducto(idProducto, estadoGlobal);
        });
    });
}

// Función para eliminar un producto
async function eliminarProducto(idProducto, estadoGlobal) {
    if (!confirm('¿Estás seguro de que deseas eliminar este producto?')) {
        return;
    }

    try {
        const response = await fetch(`http://localhost:26209/api/productos/${idProducto}`, {
            method: 'DELETE',
        });

        if (!response.ok) throw new Error(`Error al eliminar producto: ${response.statusText}`);

        console.log(`Producto con ID ${idProducto} eliminado correctamente`);

        // Actualizar el estado global
        estadoGlobal.productos = estadoGlobal.productos.filter(p => p.idProducto !== idProducto);

        // Notificar cambios en el estado global
        estadoGlobal.notificar('productosActualizados', estadoGlobal.productos);

        // Renderizar los productos actualizados
        renderizarProductos(estadoGlobal);
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        alert('Hubo un error al eliminar el producto. Por favor, intenta de nuevo.');
    }
}

// Función para editar un producto
function editarProducto(idProducto, estadoGlobal) {
    console.log('Editando producto con ID:', idProducto);

    // Buscar el producto en el estado global
    const producto = estadoGlobal.productos.find(p => p.idProducto === idProducto);
    if (!producto) {
        console.error('No se encontró el producto con el ID proporcionado');
        return;
    }

    // Cargar los datos del producto en el formulario
    document.getElementById('idProducto').value = producto.idProducto;
    document.getElementById('nombreProducto').value = producto.nombre;
    document.getElementById('descripcionProducto').value = producto.descripcion;
    document.getElementById('categoriaProducto').value = producto.categoria;
    document.getElementById('valorMedida').value = producto.cantidadMedida;
    document.getElementById('unidadMedida').value = producto.unidadMedida;
    document.getElementById('imagenProducto').value = producto.imagenProducto || '';

    // Mostrar el modal del formulario
    document.getElementById('modalProducto').style.display = 'block';
}

// Función para manejar el envío del formulario
function manejarEnvioFormulario(e, estadoGlobal) {
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
    guardarProductoEnAPI(producto, estadoGlobal);

    // Cerrar el modal
    document.getElementById('modalProducto').style.display = 'none';
}

// Función para guardar un producto en la API
async function guardarProductoEnAPI(producto, estadoGlobal) {
    try {
        const method = producto.idProducto ? 'PUT' : 'POST';
        const endpoint = producto.idProducto ? `http://localhost:26209/api/productos/${producto.idProducto}` : 'http://localhost:26209/api/productos';

        const response = await fetch(endpoint, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(producto)
        });

        if (!response.ok) throw new Error(`Error al guardar producto: ${response.statusText}`);

        console.log(`Producto ${producto.idProducto ? 'actualizado' : 'creado'} correctamente`);

        // Recargar los productos desde la API
        await cargarProductosDesdeAPI(estadoGlobal);

        
        // Notificar cambios en el estado global
        estadoGlobal.notificar('productosActualizados', estadoGlobal.productos);

        // Renderizar los productos actualizados
        renderizarProductos(estadoGlobal);
    } catch (error) {
        console.error('Error al guardar producto en la API:', error);
        alert('Hubo un error al guardar el producto. Por favor, intenta de nuevo.');
    }
}

// Configurar eventos del módulo
function configurarEventListeners(estadoGlobal) {
    document.getElementById('btnAgregarProducto').addEventListener('click', () => {
        document.getElementById('formularioProducto').reset();
        document.getElementById('idProducto').value = '';
        document.getElementById('modalProducto').style.display = 'block';
    });

    document.getElementById('btnCancelar').addEventListener('click', () => {
        document.getElementById('modalProducto').style.display = 'none';
    });

    document.getElementById('formularioProducto').addEventListener('submit', (e) => manejarEnvioFormulario(e, estadoGlobal));
}