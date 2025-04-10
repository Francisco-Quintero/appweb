export async function initProveedores(estadoGlobal) {
    console.log('Inicializando módulo de proveedores...');
    
    // Verificar si los datos de proveedores están disponibles en el estado global
    if (estadoGlobal.proveedores.length === 0) {
        console.log('Cargando proveedores desde la API...');
        await cargarProveedoresDesdeAPI(estadoGlobal);
    }
    
    // Renderizar los proveedores
    renderizarProveedores(estadoGlobal);

    // Configurar eventos del módulo
    configurarEventListeners(estadoGlobal);
    
    // Inicializar iconos de Lucide
    if (window.lucide) {
        window.lucide.createIcons();
    }
}

// Función para cargar proveedores desde la API
async function cargarProveedoresDesdeAPI(estadoGlobal) {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // Timeout de 10 segundos
        
        const response = await fetch('http://localhost:26209/api/proveedores', {
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) throw new Error(`Error al obtener proveedores: ${response.statusText}`);
        const proveedores = await response.json();

        // Actualizar el estado global
        estadoGlobal.proveedores = proveedores;

        console.log('Proveedores cargados desde la API:', proveedores.length);
        return proveedores;
    } catch (error) {
        if (error.name === 'AbortError') {
            console.error('La solicitud de proveedores ha excedido el tiempo de espera');
            mostrarNotificacion('Error de conexión. Intente nuevamente.', 'error');
        } else {
            console.error('Error al cargar proveedores desde la API:', error);
            mostrarNotificacion('Error al cargar proveedores', 'error');
        }
        return [];
    }
}

// Función para renderizar los proveedores en la tabla
function renderizarProveedores(estadoGlobal) {
    const cuerpoTabla = document.getElementById('cuerpoTablaProveedores');
    const emptyState = document.getElementById('proveedores-empty');
    
    if (!cuerpoTabla) {
        console.error('No se encontró el elemento cuerpoTablaProveedores');
        return;
    }

    const proveedores = estadoGlobal.proveedores;

    // Mostrar estado vacío si no hay proveedores
    if (proveedores.length === 0) {
        cuerpoTabla.innerHTML = '<tr><td colspan="7" class="text-center">No hay proveedores registrados</td></tr>';
        if (emptyState) emptyState.style.display = 'block';
        return;
    }

    // Ocultar estado vacío si hay proveedores
    if (emptyState) emptyState.style.display = 'none';

    // Crear fragmento para mejor rendimiento
    const fragmento = document.createDocumentFragment();
    
    // Crear filas de proveedores
    proveedores.forEach(proveedor => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${proveedor.idProveedor}</td>
            <td>${proveedor.nombreEmpresa}</td>
            <td>${proveedor.nombreContacto}</td>
            <td>${proveedor.correo}</td>
            <td>${proveedor.numeroContacto}</td>
            <td>${proveedor.frecuenciaAbastecimiento || 0}</td>
            <td>
                <div class="acciones-tabla">
                    <button class="btn-editar" data-id="${proveedor.idProveedor}" title="Editar">
                        <i data-lucide="edit"></i>
                    </button>
                    <button class="btn-eliminar" data-id="${proveedor.idProveedor}" title="Eliminar">
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
}

// Función para asignar eventos a los botones de la tabla
function asignarEventosBotones(cuerpoTabla, estadoGlobal) {
    cuerpoTabla.querySelectorAll('.btn-editar').forEach(button => {
        button.addEventListener('click', () => {
            const idProveedor = parseInt(button.dataset.id);
            editarProveedor(idProveedor, estadoGlobal);
        });
    });

    cuerpoTabla.querySelectorAll('.btn-eliminar').forEach(button => {
        button.addEventListener('click', () => {
            const idProveedor = parseInt(button.dataset.id);
            eliminarProveedor(idProveedor, estadoGlobal);
        });
    });
}

// Función para editar un proveedor
function editarProveedor(idProveedor, estadoGlobal) {
    console.log('Editando proveedor con ID:', idProveedor);

    // Buscar el proveedor en el estado global
    const proveedor = estadoGlobal.proveedores.find(p => p.idProveedor === idProveedor);
    if (!proveedor) {
        console.error('No se encontró el proveedor con el ID proporcionado');
        mostrarNotificacion('No se encontró el proveedor', 'error');
        return;
    }

    // Actualizar título del modal
    document.getElementById('tituloModal').innerHTML = '<i data-lucide="edit"></i> Editar Proveedor';
    
    // Cargar los datos del proveedor en el formulario
    document.getElementById('idProveedor').value = proveedor.idProveedor;
    document.getElementById('nombreEmpresa').value = proveedor.nombreEmpresa;
    document.getElementById('nombreContacto').value = proveedor.nombreContacto;
    document.getElementById('correoProveedor').value = proveedor.correo;
    document.getElementById('telefonoProveedor').value = proveedor.numeroContacto;

    // Inicializar iconos de Lucide
    if (window.lucide) {
        window.lucide.createIcons();
    }

    // Mostrar el modal del formulario
    document.getElementById('modalProveedor').style.display = 'block';
}

// Función para eliminar un proveedor
async function eliminarProveedor(idProveedor, estadoGlobal) {
    if (!confirm('¿Estás seguro de que deseas eliminar este proveedor?')) {
        return;
    }

    try {
        // Mostrar indicador de carga
        mostrarNotificacion('Eliminando proveedor...', 'info');
        
        const response = await fetch(`http://localhost:26209/api/proveedores/${idProveedor}`, {
            method: 'DELETE',
        });

        if (!response.ok) throw new Error(`Error al eliminar proveedor: ${response.statusText}`);

        console.log(`Proveedor con ID ${idProveedor} eliminado correctamente`);

        // Actualizar el estado global
        estadoGlobal.proveedores = estadoGlobal.proveedores.filter(p => p.idProveedor !== idProveedor);

        // Notificar cambios en el estado global
        estadoGlobal.notificar('proveedoresActualizados', estadoGlobal.proveedores);

        // Renderizar los proveedores actualizados
        renderizarProveedores(estadoGlobal);
        
        // Mostrar notificación de éxito
        mostrarNotificacion('Proveedor eliminado correctamente', 'success');
    } catch (error) {
        console.error('Error al eliminar proveedor:', error);
        mostrarNotificacion('Error al eliminar el proveedor', 'error');
    }
}

// Función para manejar el envío del formulario
async function manejarEnvioFormulario(e, estadoGlobal) {
    e.preventDefault();

    // Obtener los valores del formulario
    const id = document.getElementById('idProveedor')?.value;
    const nombreEmpresa = document.getElementById('nombreEmpresa').value.trim();
    const nombreContacto = document.getElementById('nombreContacto').value.trim();
    const correo = document.getElementById('correoProveedor').value.trim();
    const numeroContacto = document.getElementById('telefonoProveedor').value.trim();

    // Validar los campos
    if (!nombreEmpresa || !nombreContacto || !correo || !numeroContacto) {
        mostrarNotificacion('Por favor, completa todos los campos obligatorios', 'warning');
        return;
    }

    // Mostrar indicador de carga
    mostrarNotificacion('Guardando proveedor...', 'info');

    const proveedor = {
        idProveedor: id ? parseInt(id) : null,
        nombreEmpresa: nombreEmpresa,
        nombreContacto: nombreContacto,
        correo: correo,
        numeroContacto: numeroContacto,
        frecuenciaAbastecimiento: id ? (estadoGlobal.proveedores.find(p => p.idProveedor === parseInt(id))?.frecuenciaAbastecimiento || 0) : 1
    };

    await guardarProveedorEnAPI(proveedor, estadoGlobal);

    // Cerrar el modal
    document.getElementById('modalProveedor').style.display = 'none';
}

// Función para guardar un proveedor en la API
async function guardarProveedorEnAPI(proveedor, estadoGlobal) {
    const API_URL = 'http://localhost:26209/api/proveedores';
    try {
        const method = proveedor.idProveedor ? 'PUT' : 'POST';
        const endpoint = proveedor.idProveedor ? `${API_URL}/${proveedor.idProveedor}` : API_URL;

        const response = await fetch(endpoint, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(proveedor)
        });

        if (!response.ok) throw new Error(`Error al guardar proveedor: ${response.statusText}`);

        console.log(`Proveedor ${proveedor.idProveedor ? 'actualizado' : 'creado'} correctamente`);

        // Recargar los proveedores desde la API
        await cargarProveedoresDesdeAPI(estadoGlobal);

        // Notificar cambios en el estado global
        estadoGlobal.notificar('proveedoresActualizados', estadoGlobal.proveedores);

        // Renderizar los proveedores actualizados
        renderizarProveedores(estadoGlobal);
        
        // Mostrar notificación de éxito
        mostrarNotificacion(`Proveedor ${proveedor.idProveedor ? 'actualizado' : 'creado'} correctamente`, 'success');
    } catch (error) {
        console.error('Error al guardar proveedor en la API:', error);
        mostrarNotificacion('Error al guardar el proveedor', 'error');
    }
}

// Función para buscar proveedores
function buscarProveedores(estadoGlobal) {
    const terminoBusqueda = document.getElementById('busquedaProveedor').value.trim().toLowerCase();
    
    if (!terminoBusqueda) {
        renderizarProveedores(estadoGlobal);
        return;
    }
    
    const proveedoresFiltrados = estadoGlobal.proveedores.filter(proveedor => 
        proveedor.nombreEmpresa.toLowerCase().includes(terminoBusqueda) ||
        proveedor.nombreContacto.toLowerCase().includes(terminoBusqueda) ||
        proveedor.correo.toLowerCase().includes(terminoBusqueda) ||
        proveedor.numeroContacto.toLowerCase().includes(terminoBusqueda)
    );
    
    const cuerpoTabla = document.getElementById('cuerpoTablaProveedores');
    const emptyState = document.getElementById('proveedores-empty');
    
    if (proveedoresFiltrados.length === 0) {
        cuerpoTabla.innerHTML = `<tr><td colspan="7" class="text-center">No se encontraron proveedores con el término "${terminoBusqueda}"</td></tr>`;
        if (emptyState) emptyState.style.display = 'none';
        return;
    }
    
    // Ocultar estado vacío si hay proveedores
    if (emptyState) emptyState.style.display = 'none';
    
    // Crear fragmento para mejor rendimiento
    const fragmento = document.createDocumentFragment();
    
    // Crear filas de proveedores filtrados
    proveedoresFiltrados.forEach(proveedor => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${proveedor.idProveedor}</td>
            <td>${proveedor.nombreEmpresa}</td>
            <td>${proveedor.nombreContacto}</td>
            <td>${proveedor.correo}</td>
            <td>${proveedor.numeroContacto}</td>
            <td>${proveedor.frecuenciaAbastecimiento || 0}</td>
            <td>
                <div class="acciones-tabla">
                    <button class="btn-editar" data-id="${proveedor.idProveedor}" title="Editar">
                        <i data-lucide="edit"></i>
                    </button>
                    <button class="btn-eliminar" data-id="${proveedor.idProveedor}" title="Eliminar">
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
    
    mostrarNotificacion(`Se encontraron ${proveedoresFiltrados.length} proveedores`, 'info');
}

// Función para mostrar notificaciones
function mostrarNotificacion(mensaje, tipo) {
    // Verificar si ya existe un contenedor de notificaciones
    let contenedorNotificaciones = document.querySelector('.notificaciones-container');
    
    if (!contenedorNotificaciones) {
        contenedorNotificaciones = document.createElement('div');
        contenedorNotificaciones.className = 'notificaciones-container';
        document.body.appendChild(contenedorNotificaciones);
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
    // Botón para agregar proveedor
    const btnAgregarProveedor = document.getElementById('btnAgregarProveedor');
    if (btnAgregarProveedor) {
        btnAgregarProveedor.addEventListener('click', () => {
            document.getElementById('formularioProveedor').reset();
            document.getElementById('idProveedor').value = '';
            document.getElementById('tituloModal').innerHTML = '<i data-lucide="user-plus"></i> Añadir Proveedor';
            document.getElementById('modalProveedor').style.display = 'block';
            
            // Inicializar iconos de Lucide
            if (window.lucide) {
                window.lucide.createIcons();
            }
        });
    }
    
    // Botón para agregar proveedor desde estado vacío
    const btnAgregarProveedorEmpty = document.getElementById('btnAgregarProveedorEmpty');
    if (btnAgregarProveedorEmpty) {
        btnAgregarProveedorEmpty.addEventListener('click', () => {
            document.getElementById('formularioProveedor').reset();
            document.getElementById('idProveedor').value = '';
            document.getElementById('tituloModal').innerHTML = '<i data-lucide="user-plus"></i> Añadir Proveedor';
            document.getElementById('modalProveedor').style.display = 'block';
            
            // Inicializar iconos de Lucide
            if (window.lucide) {
                window.lucide.createIcons();
            }
        });
    }

    // Botones para cerrar modal
    const btnCancelar = document.getElementById('btnCancelar');
    if (btnCancelar) {
        btnCancelar.addEventListener('click', () => {
            document.getElementById('modalProveedor').style.display = 'none';
        });
    }
    
    const btnCerrarModal = document.getElementById('btnCerrarModal');
    if (btnCerrarModal) {
        btnCerrarModal.addEventListener('click', () => {
            document.getElementById('modalProveedor').style.display = 'none';
        });
    }

    // Cerrar modal al hacer clic fuera del contenido
    const modal = document.getElementById('modalProveedor');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }

    // Formulario de proveedor
    const formularioProveedor = document.getElementById('formularioProveedor');
    if (formularioProveedor) {
        formularioProveedor.addEventListener('submit', (e) => manejarEnvioFormulario(e, estadoGlobal));
    }
    
    // Búsqueda de proveedores
    const btnBuscar = document.getElementById('btnBuscar');
    if (btnBuscar) {
        btnBuscar.addEventListener('click', () => buscarProveedores(estadoGlobal));
    }
    
    const busquedaProveedor = document.getElementById('busquedaProveedor');
    if (busquedaProveedor) {
        busquedaProveedor.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                buscarProveedores(estadoGlobal);
            }
        });
    }
}