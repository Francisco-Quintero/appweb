// import { API_URL } from "../../JS/estadoGlobal";
import { websocketService } from "../../JS/webSocketService.js";

export async function initProductos(estadoGlobal) {
    console.log('Inicializando módulo de productos...');

    // Verificar si los datos de productos están disponibles en el estado global
    if (estadoGlobal.productos.length === 0) {
        console.log('Cargando productos desde la API...');
        await cargarProductosDesdeAPI(estadoGlobal);
    }

    // Renderizar los productos
    renderizarProductos(estadoGlobal);

    // Configurar eventos del módulo
    configurarEventListeners(estadoGlobal);

    // Inicializar iconos de Lucide
    if (window.lucide) {
        window.lucide.createIcons();
    }

    // Suscribirse a actualizaciones de WebSocket para productos
    websocketService.subscribe("/topic/productos", (mensaje) => {
        console.log("Actualización de productos recibida vía WebSocket:", mensaje);
        // Actualizar el estado global con los nuevos datos
        estadoGlobal.actualizarProductos(mensaje.datos);
        // Renderizar los productos actualizados
        renderizarProductos(estadoGlobal);
        // Mostrar notificación
        mostrarNotificacion("Lista de productos actualizada", "info");
    });
}

// Función para cargar productos desde la API y actualizar el estado global
async function cargarProductosDesdeAPI(estadoGlobal) {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // Timeout de 10 segundos
        
        const response = await fetch(`${API_URL}/productos`, {
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) throw new Error(`Error al obtener productos: ${response.statusText}`);
        const productos = await response.json();

        // Actualizar el estado global
        estadoGlobal.actualizarProductos(productos);

        console.log('Productos cargados desde la API:', productos.length);
        return productos;
    } catch (error) {
        if (error.name === 'AbortError') {
            console.error('La solicitud de productos ha excedido el tiempo de espera');
            mostrarNotificacion('Error de conexión. Intente nuevamente.', 'error');
        } else {
            console.error('Error al cargar productos desde la API:', error);
            mostrarNotificacion('Error al cargar productos', 'error');
        }
        return [];
    }
}

// Función para renderizar los productos en la tabla
function renderizarProductos(estadoGlobal) {
    const cuerpoTabla = document.getElementById('cuerpoTablaProductos');
    const emptyState = document.getElementById('productos-empty');
    
    if (!cuerpoTabla) {
        console.error('No se encontró el elemento cuerpoTablaProductos');
        return;
    }

    const productos = estadoGlobal.productos;

    // Mostrar estado vacío si no hay productos
    if (productos.length === 0) {
        cuerpoTabla.innerHTML = '<tr><td colspan="8" class="text-center">No hay productos registrados</td></tr>';
        if (emptyState) emptyState.style.display = 'block';
        return;
    }

    // Ocultar estado vacío si hay productos
    if (emptyState) emptyState.style.display = 'none';

    // Crear fragmento para mejor rendimiento
    const fragmento = document.createDocumentFragment();
    
    // Crear filas de productos
    productos.forEach(producto => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
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
                    loading="lazy">
            </td>
            <td>
                <div class="acciones-tabla">
                    <button class="btn-editar" data-id="${producto.idProducto}" title="Editar">
                        <i data-lucide="edit"></i>
                    </button>
                    <button class="btn-eliminar" data-id="${producto.idProducto}" title="Eliminar">
                        <i data-lucide="trash-2"></i>
                    </button>
                </div>
            </td>
        `;
        fragmento.appendChild(fila);
    });

    // Limpiar y agregar todas las filas de una vez
    cuerpoTabla.innerHTML = '';
    cuerpoTabla.appendChild(fragmento);

    // Inicializar iconos de Lucide
    if (window.lucide) {
        window.lucide.createIcons();
    }

    // Asignar eventos a los botones de edición y eliminación
    asignarEventosBotones(cuerpoTabla, estadoGlobal);
}

// Función para asignar eventos a los botones de la tabla
function asignarEventosBotones(cuerpoTabla, estadoGlobal) {
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
        // Mostrar indicador de carga
        mostrarNotificacion('Eliminando producto...', 'info');
        
        const response = await fetch(`${API_URL}/productos/${idProducto}`, {
            method: 'DELETE',
        });

        if (!response.ok) throw new Error(`Error al eliminar producto: ${response.statusText}`);

        console.log(`Producto con ID ${idProducto} eliminado correctamente`);

        // Actualizar el estado global localmente (sin esperar WebSocket)
        estadoGlobal.productos = estadoGlobal.productos.filter(p => p.idProducto !== idProducto);

        // Notificar cambios en el estado global
        estadoGlobal.notificar('productosActualizados', estadoGlobal.productos);

        // Renderizar los productos actualizados
        renderizarProductos(estadoGlobal);
        
        // Mostrar notificación de éxito
        mostrarNotificacion('Producto eliminado correctamente', 'success');
        
        // El backend enviará la actualización vía WebSocket a todos los clientes
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        mostrarNotificacion('Error al eliminar el producto', 'error');
    }
}

// Función para editar un producto
function editarProducto(idProducto, estadoGlobal) {
    console.log('Editando producto con ID:', idProducto);

    // Buscar el producto en el estado global
    const producto = estadoGlobal.productos.find(p => p.idProducto === idProducto);
    if (!producto) {
        console.error('No se encontró el producto con el ID proporcionado');
        mostrarNotificacion('No se encontró el producto', 'error');
        return;
    }

    // Actualizar título del modal
    document.getElementById('tituloModal').innerHTML = '<i data-lucide="edit"></i> Editar Producto';
    
    // Cargar los datos del producto en el formulario
    document.getElementById('idProducto').value = producto.idProducto;
    document.getElementById('nombreProducto').value = producto.nombre;
    document.getElementById('descripcionProducto').value = producto.descripcion;
    document.getElementById('categoriaProducto').value = producto.categoria;
    document.getElementById('valorMedida').value = producto.cantidadMedida;
    document.getElementById('unidadMedida').value = producto.unidadMedida;
    document.getElementById('imagenProducto').value = producto.imagenProducto || '';

    // Inicializar iconos de Lucide
    if (window.lucide) {
        window.lucide.createIcons();
    }

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
        mostrarNotificacion('Por favor, completa todos los campos obligatorios', 'warning');
        return;
    }

    // Convertir valorMedida a número y validar
    const cantidadMedida = parseFloat(valorMedida);
    if (isNaN(cantidadMedida) || cantidadMedida <= 0) {
        mostrarNotificacion('El valor de medida debe ser un número positivo', 'warning');
        return;
    }

    // Mostrar indicador de carga
    mostrarNotificacion('Guardando producto...', 'info');

    // Crear el objeto producto con el formato correcto
    const producto = {
        idProducto: idProducto ? parseInt(idProducto) : null,
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
        const endpoint = producto.idProducto ? `${API_URL}/productos/${producto.idProducto}` : `${API_URL}/productos`;

        const response = await fetch(endpoint, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(producto)
        });

        if (!response.ok) throw new Error(`Error al guardar producto: ${response.statusText}`);

        // Obtener el producto actualizado/creado de la respuesta
        const productoActualizado = await response.json();
        console.log(`Producto ${producto.idProducto ? 'actualizado' : 'creado'} correctamente:`, productoActualizado);

        // Actualizar el estado global localmente (sin esperar WebSocket)
        if (producto.idProducto) {
            // Actualizar producto existente
            const index = estadoGlobal.productos.findIndex(p => p.idProducto === producto.idProducto);
            if (index !== -1) {
                estadoGlobal.productos[index] = productoActualizado;
            }
        } else {
            // Agregar nuevo producto
            estadoGlobal.productos.push(productoActualizado);
        }
        
        // Notificar cambios en el estado global
        estadoGlobal.notificar('productosActualizados', estadoGlobal.productos);

        // Renderizar los productos actualizados
        renderizarProductos(estadoGlobal);
        
        // Mostrar notificación de éxito
        mostrarNotificacion(`Producto ${producto.idProducto ? 'actualizado' : 'creado'} correctamente`, 'success');
        
        // El backend enviará la actualización vía WebSocket a todos los clientes
    } catch (error) {
        console.error('Error al guardar producto en la API:', error);
        mostrarNotificacion('Error al guardar el producto', 'error');
    }
}

function buscarProductos(estadoGlobal) {
    const terminoBusqueda = document.getElementById('busquedaProducto').value.trim().toLowerCase();
    
    if (!terminoBusqueda) {
        renderizarProductos(estadoGlobal);
        return;
    }
    
    const productosFiltrados = estadoGlobal.productos.filter(producto => 
        (producto.nombre || '').toLowerCase().includes(terminoBusqueda) ||
        (producto.descripcion || '').toLowerCase().includes(terminoBusqueda) ||
        (producto.categoria || '').toLowerCase().includes(terminoBusqueda)
    );
    
    const cuerpoTabla = document.getElementById('cuerpoTablaProductos');
    const emptyState = document.getElementById('productos-empty');
    
    if (productosFiltrados.length === 0) {
        cuerpoTabla.innerHTML = `<tr><td colspan="8" class="text-center">No se encontraron productos con el término "${terminoBusqueda}"</td></tr>`;
        if (emptyState) emptyState.style.display = 'none';
        return;
    }
    
    // Ocultar estado vacío si hay productos
    if (emptyState) emptyState.style.display = 'none';
    
    // Crear fragmento para mejor rendimiento
    const fragmento = document.createDocumentFragment();
    
    // Crear filas de productos filtrados
    productosFiltrados.forEach(producto => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
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
                    loading="lazy">
            </td>
            <td>
                <div class="acciones-tabla">
                    <button class="btn-editar" data-id="${producto.idProducto}" title="Editar">
                        <i data-lucide="edit"></i>
                    </button>
                    <button class="btn-eliminar" data-id="${producto.idProducto}" title="Eliminar">
                        <i data-lucide="trash-2"></i>
                    </button>
                </div>
            </td>
        `;
        fragmento.appendChild(fila);
    });
    
    // Limpiar y agregar todas las filas de una vez
    cuerpoTabla.innerHTML = '';
    cuerpoTabla.appendChild(fragmento);
    
    // Inicializar iconos de Lucide
    if (window.lucide) {
        window.lucide.createIcons();
    }
    
    // Asignar eventos a los botones
    asignarEventosBotones(cuerpoTabla, estadoGlobal);
    
    mostrarNotificacion(`Se encontraron ${productosFiltrados.length} productos`, 'info');
}

// Función para mostrar notificaciones
function mostrarNotificacion(mensaje, tipo) {
    // Verificar si ya existe un contenedor de notificaciones
    let contenedorNotificaciones = document.querySelector('.notificaciones-container');
    
    if (!contenedorNotificaciones) {
        contenedorNotificaciones = document.createElement('div');
        contenedorNotificaciones.className = 'notificaciones-container';
        document.body.appendChild(contenedorNotificaciones);
        
        // Agregar estilos para el contenedor de notificaciones
        const estilos = document.createElement('style');
        estilos.textContent = `
            .notificaciones-container {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 9999;
                display: flex;
                flex-direction: column;
                gap: 10px;
                max-width: 350px;
            }
            
            .notificacion {
                padding: 12px 16px;
                border-radius: var(--radius);
                background-color: hsl(var(--background));
                color: hsl(var(--primary));
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                display: flex;
                align-items: center;
                gap: 12px;
                transform: translateX(120%);
                transition: transform 0.3s ease;
                animation: slideIn 0.3s forwards, fadeOut 0.3s 2.7s forwards;
            }
            
            @keyframes slideIn {
                to { transform: translateX(0); }
            }
            
            @keyframes fadeOut {
                to { opacity: 0; transform: translateX(120%); }
            }
            
            .notificacion.success { border-left: 4px solid #10b981; }
            .notificacion.error { border-left: 4px solid #ef4444; }
            .notificacion.warning { border-left: 4px solid #f59e0b; }
            .notificacion.info { border-left: 4px solid #3b82f6; }
            
            .notificacion i {
                width: 20px;
                height: 20px;
            }
            
            .notificacion.success i { color: #10b981; }
            .notificacion.error i { color: #ef4444; }
            .notificacion.warning i { color: #f59e0b; }
            .notificacion.info i { color: #3b82f6; }
        `;
        document.head.appendChild(estilos);
    }
    
    // Crear la notificación
    const notificacion = document.createElement('div');
    notificacion.className = `notificacion ${tipo}`;
    
    // Determinar el icono según el tipo
    let icono = 'info';
    if (tipo === 'success') icono = 'check-circle';
    else if (tipo === 'error') icono = 'alert-circle';
    else if (tipo === 'warning') icono = 'alert-triangle';
    
    notificacion.innerHTML = `
        <i data-lucide="${icono}"></i>
        <span>${mensaje}</span>
    `;
    
    // Agregar al contenedor
    contenedorNotificaciones.appendChild(notificacion);
    
    // Inicializar iconos de Lucide
    if (window.lucide) {
        window.lucide.createIcons();
    }
    
    // Eliminar después de 3 segundos
    setTimeout(() => {
        notificacion.remove();
    }, 3000);
}

// Configurar eventos del módulo
function configurarEventListeners(estadoGlobal) {
    // Botón para agregar producto
    document.getElementById('btnAgregarProducto').addEventListener('click', () => {
        document.getElementById('formularioProducto').reset();
        document.getElementById('idProducto').value = '';
        document.getElementById('tituloModal').innerHTML = '<i data-lucide="package-plus"></i> Añadir Producto';
        document.getElementById('modalProducto').style.display = 'block';
        
        // Inicializar iconos de Lucide
        if (window.lucide) {
            window.lucide.createIcons();
        }
    });
    
    // Botón para agregar producto desde estado vacío
    const btnAgregarProductoEmpty = document.getElementById('btnAgregarProductoEmpty');
    if (btnAgregarProductoEmpty) {
        btnAgregarProductoEmpty.addEventListener('click', () => {
            document.getElementById('formularioProducto').reset();
            document.getElementById('idProducto').value = '';
            document.getElementById('tituloModal').innerHTML = '<i data-lucide="package-plus"></i> Añadir Producto';
            document.getElementById('modalProducto').style.display = 'block';
            
            // Inicializar iconos de Lucide
            if (window.lucide) {
                window.lucide.createIcons();
            }
        });
    }

    // Botones para cerrar modal
    document.getElementById('btnCancelar').addEventListener('click', () => {
        document.getElementById('modalProducto').style.display = 'none';
    });
    
    const btnCerrarModal = document.getElementById('btnCerrarModal');
    if (btnCerrarModal) {
        btnCerrarModal.addEventListener('click', () => {
            document.getElementById('modalProducto').style.display = 'none';
        });
    }

    // Cerrar modal al hacer clic fuera del contenido
    const modal = document.getElementById('modalProducto');
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Formulario de producto
    document.getElementById('formularioProducto').addEventListener('submit', (e) => manejarEnvioFormulario(e, estadoGlobal));
    
    // Búsqueda de productos
    const btnBuscar = document.getElementById('btnBuscar');
    if (btnBuscar) {
        btnBuscar.addEventListener('click', () => buscarProductos(estadoGlobal));
    }
    
    const busquedaProducto = document.getElementById('busquedaProducto');
    if (busquedaProducto) {
        busquedaProducto.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                buscarProductos(estadoGlobal);
            }
        });
    }
    
    // Limpiar suscripciones WebSocket al desmontar el módulo
    const limpiarSuscripciones = () => {
        websocketService.unsubscribe("/topic/productos");
    };
    
    // Limpiar al cambiar de módulo o cerrar la página
    window.addEventListener('beforeunload', limpiarSuscripciones);
    
    // Almacenar la función de limpieza para que pueda ser llamada cuando se cambie de módulo
    window.limpiarSuscripcionesProductos = limpiarSuscripciones;
}

// Exportar funciones que podrían ser útiles para otros módulos
export { renderizarProductos, cargarProductosDesdeAPI, mostrarNotificacion };