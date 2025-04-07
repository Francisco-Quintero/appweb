export async function initProveedores(estadoGlobal) {
    console.log('Inicializando módulo de proveedores...');
    // Renderizar los proveedores
    renderizarProveedores(estadoGlobal);

    // Configurar eventos del módulo
    configurarEventListeners(estadoGlobal);
}


// Función para renderizar los proveedores en la tabla
function renderizarProveedores(estadoGlobal) {
    const cuerpoTabla = document.getElementById('cuerpoTablaProveedores');
    if (!cuerpoTabla) {
        console.error('No se encontró el elemento cuerpoTablaProveedores');
        return;
    }

    const proveedores = estadoGlobal.proveedores;

    const contenidoTabla = proveedores.length === 0
        ? '<tr><td colspan="7" class="text-center">No hay proveedores registrados. Haga clic en "+" para agregar uno nuevo.</td></tr>'
        : proveedores.map(proveedor => `
            <tr>
                <td>${proveedor.idProveedor}</td>
                <td>${proveedor.nombreEmpresa}</td>
                <td>${proveedor.nombreContacto}</td>
                <td>${proveedor.correo}</td>
                <td>${proveedor.numeroContacto}</td>
                <td>${proveedor.frecuenciaAbastecimiento || 0}</td>
                <td>
                    <div class="acciones-tabla">
                        <button class="btn-editar" data-id="${proveedor.idProveedor}" title="Editar">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                        </button>
                        <button class="btn-eliminar" data-id="${proveedor.idProveedor}" title="Eliminar">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash-2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');

    cuerpoTabla.innerHTML = contenidoTabla;

    // Asignar eventos a los botones de edición y eliminación
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
        return;
    }

    // Cargar los datos del proveedor en el formulario
    document.getElementById('idProveedor').value = proveedor.idProveedor;
    document.getElementById('nombreEmpresa').value = proveedor.nombreEmpresa;
    document.getElementById('nombreContacto').value = proveedor.nombreContacto;
    document.getElementById('correoProveedor').value = proveedor.correo;
    document.getElementById('telefonoProveedor').value = proveedor.numeroContacto;

    // Mostrar el modal del formulario
    document.getElementById('modalProveedor').style.display = 'block';
}

// Función para eliminar un proveedor
async function eliminarProveedor(idProveedor, estadoGlobal) {
    if (!confirm('¿Estás seguro de que deseas eliminar este proveedor?')) {
        return;
    }

    try {
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
    } catch (error) {
        console.error('Error al eliminar proveedor:', error);
        alert('Hubo un error al eliminar el proveedor. Por favor, intenta de nuevo.');
    }
}
// Función para manejar el envío del formulario
async function manejarEnvioFormulario(e, estadoGlobal) {
    e.preventDefault();

    const id = document.getElementById('idProveedor')?.value;
    const proveedor = {
        idProveedor: id ? parseInt(id) : null,
        nombreEmpresa: document.getElementById('nombreEmpresa').value || '',
        nombreContacto: document.getElementById('nombreContacto').value || '',
        correo: document.getElementById('correoProveedor').value || '',
        numeroContacto: document.getElementById('telefonoProveedor').value || '',
        frecuenciaAbastecimiento: id ? (estadoGlobal.proveedores.find(p => p.idProveedor === parseInt(id))?.frecuenciaAbastecimiento || 0) : 1
    };

    await guardarProveedorEnAPI(proveedor, estadoGlobal);

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
    } catch (error) {
        console.error('Error al guardar proveedor en la API:', error);
        alert('Hubo un error al guardar el proveedor. Por favor, intenta de nuevo.');
    }
}

// Configurar eventos del módulo
function configurarEventListeners(estadoGlobal) {
    document.getElementById('btnAgregarProveedor')?.addEventListener('click', () => {
        document.getElementById('formularioProveedor').reset();
        document.getElementById('idProveedor').value = '';
        document.getElementById('modalProveedor').style.display = 'block';
    });

    document.getElementById('btnCancelar')?.addEventListener('click', () => {
        document.getElementById('modalProveedor').style.display = 'none';
    });

    document.getElementById('formularioProveedor')?.addEventListener('submit', (e) => manejarEnvioFormulario(e, estadoGlobal));
}
