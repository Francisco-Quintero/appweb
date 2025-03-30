// proveedores.js
(function () {
    console.log('Iniciando carga del módulo de proveedores');

    let proveedores = [];
    const API_URL = 'http://localhost:26209/api/proveedores';


    async function cargarProveedoresDesdeAPI() {
        try {
            const respuesta = await fetch(API_URL);
            if (!respuesta.ok) throw new Error(`Error al obtener proveedores: ${respuesta.statusText}`);

            proveedores = await respuesta.json();
            cargarProveedores();
        } catch (error) {
            console.error('Error al obtener proveedores desde la API:', error);
        }
    }

    async function guardarProveedor(proveedor) {
        try {
            const method = proveedor.idProveedor ? 'PUT' : 'POST';
            const endpoint = proveedor.idProveedor ? `${API_URL}/${proveedor.idProveedor}` : API_URL;

            const response = await fetch(endpoint, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(proveedor)
            });

            if (!response.ok) throw new Error(`Error al guardar producto: ${response.statusText}`);

            console.log(`Producto ${proveedor.idProveedor ? 'actualizado' : 'creado'} correctamente`);
            cargarProveedoresDesdeAPI(); // Recargar proveedores después de guardar.
        } catch (error) {
            console.error('Error al guardar el proveedor:', error);
        }
    }

    async function eliminarProveedor(id) {
        try {
            const confirmacion = confirm("¿Estás seguro de que deseas eliminar este proveedor?");
            if (!confirmacion) {
                console.log("Eliminación cancelada por el usuario.");
                return; // Salir si el usuario cancela
            }
            const respuesta = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
            });
            if (!respuesta.ok) throw new Error(`Error al eliminar proveedor: ${respuesta.statusText}`);

            console.log(`Proveedor con ID ${id} eliminado con éxito`);
            cargarProveedoresDesdeAPI();
        } catch (error) {
            console.error('Error al eliminar el proveedor:', error);
        }
    }


    async function cargarProveedores(proveedoresFiltrados = proveedores) {
        const cuerpoTabla = document.getElementById('cuerpoTablaProveedores');
        if (!cuerpoTabla) {
            console.error('No se encontró el elemento cuerpoTablaProveedores');
            return;
        }

        const contenidoTabla = proveedoresFiltrados.length === 0
            ? '<tr><td colspan="7" class="text-center">No se encontraron proveedores que coincidan con la búsqueda.</td></tr>'
            : proveedoresFiltrados.map(proveedor => `
                <tr>
                    <td>${proveedor.idProveedor}</td>
                    <td>${proveedor.nombreEmpresa}</td>
                    <td>${proveedor.nombreContacto}</td>
                    <td>${proveedor.correo}</td>
                    <td>${proveedor.numeroContacto}</td>
                    <td>${proveedor.frecuenciaAbastecimiento || 0}</td>
                    <td>
                        <div class="acciones-tabla">
                            <button onclick="window.moduloProveedores.editar(${proveedor.idProveedor})" class="btn-icono" title="Editar">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                            </button>
                            <button onclick="window.moduloProveedores.eliminar(${proveedor.idProveedor})" class="btn-icono btn-icono-eliminar" title="Eliminar">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash-2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                            </button>
                        </div>
                    </td>
                </tr>
            `).join('');

        cuerpoTabla.innerHTML = contenidoTabla;
        console.log('Proveedores cargados en la tabla');
    }

    function configurarEventListeners() {
        document.getElementById('btnAgregarProveedor')?.addEventListener('click', () => {
            document.getElementById('formularioProveedor').reset();
            document.getElementById('idProveedor').value = '';
            document.getElementById('modalProveedor').style.display = 'block';
        });

        document.getElementById('btnCancelar')?.addEventListener('click', () => {
            document.getElementById('modalProveedor').style.display = 'none';
        });

        document.getElementById('formularioProveedor')?.addEventListener('submit', manejarEnvioFormulario);

        // Modificar el evento de búsqueda para que se active con cada pulsación de tecla
        document.getElementById('busquedaProveedor')?.addEventListener('input', buscarProveedores);
    }

    function validarFormulario() {
        const campos = [
            { id: 'nombreEmpresa', mensaje: 'El nombre de la empresa es obligatorio.' },
            { id: 'nombreContacto', mensaje: 'El nombre del contacto es obligatorio.' },
            { id: 'correoProveedor', mensaje: 'Por favor, ingrese un correo electrónico válido.', validador: validarCorreo },
            { id: 'telefonoProveedor', mensaje: 'Por favor, ingrese un número de teléfono válido.', validador: validarTelefono }
        ];

        for (const campo of campos) {
            const valor = document.getElementById(campo.id).value.trim();

            if (valor.length === 0 || (campo.validador && !campo.validador(valor))) {
                alert(campo.mensaje);
                return false;
            }
        }

        return true;
    }

    function validarCorreo(correo) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(correo);
    }

    function validarTelefono(telefono) {
        const re = /^\+?(\d{1,3})?[-. ]?\d{3}[-. ]?\d{3}[-. ]?\d{4}$/;
        return re.test(telefono);
    }


    async function manejarEnvioFormulario(e) {
        e.preventDefault();

        if (!validarFormulario()) return;

        const id = document.getElementById('idProveedor')?.value;
        const proveedor = {
            idProveedor: id ? parseInt(id) : null,
            nombreEmpresa: document.getElementById('nombreEmpresa').value || '',
            nombreContacto: document.getElementById('nombreContacto').value || '',
            correo: document.getElementById('correoProveedor').value || '',
            numeroContacto: document.getElementById('telefonoProveedor').value || '',
            frecuenciaAbastecimiento: id ? (proveedores.find(p => p.idProveedor === parseInt(id))?.frecuenciaAbastecimiento || 0) : 1
        };

        guardarProveedor(proveedor);

        document.getElementById('modalProveedor').style.display = 'none';
    }


    function buscarProveedores() {
        const termino = document.getElementById('busquedaProveedor')?.value.toLowerCase() || '';
        const proveedoresFiltrados = proveedores.filter(p =>
            p.nombreEmpresa.toLowerCase().includes(termino) ||
            p.nombreContacto.toLowerCase().includes(termino) ||
            p.correo.toLowerCase().includes(termino) ||
            p.telefono.includes(termino)
        );
        cargarProveedores(proveedoresFiltrados);
        console.log(`Se encontraron ${proveedoresFiltrados.length} proveedores`);
    }

    // Inicialización del módulo
    async function initProveedores() {
        console.log('Inicializando módulo de proveedores');
        cargarProveedoresDesdeAPI();
        configurarEventListeners();
    }


    window.moduloProveedores = {
        init: initProveedores,
        editar: function (id) {
            console.log('Editando proveedor con ID:', id);
            const proveedor = proveedores.find(p => p.idProveedor === id);
            if (proveedor) {
                document.getElementById('idProveedor').value = proveedor.idProveedor;
                document.getElementById('nombreEmpresa').value = proveedor.nombreEmpresa;
                document.getElementById('nombreContacto').value = proveedor.nombreContacto;
                document.getElementById('correoProveedor').value = proveedor.correo;
                document.getElementById('telefonoProveedor').value = proveedor.numeroContacto;
                document.getElementById('modalProveedor').style.display = 'block';
            }
        },
        eliminar: eliminarProveedor
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initProveedores);
    } else {
        initProveedores();
    }
})();

console.log('Archivo proveedores.js cargado completamente');

