// proveedores.js
(function() {
    console.log('Iniciando carga del módulo de proveedores');

    let proveedores = [];

    function cargarProveedoresDesdeLocalStorage() {
        try {
            const datosGuardados = JSON.parse(localStorage.getItem('datosGlobales') || '{}');
            proveedores = datosGuardados.proveedores || [];
            console.log('Proveedores cargados desde localStorage');
        } catch (error) {
            console.error('Error al cargar proveedores desde localStorage:', error);
        }
    }

    function guardarEnLocalStorage() {
        try {
            const datosActuales = JSON.parse(localStorage.getItem('datosGlobales') || '{}');
            datosActuales.proveedores = proveedores;
            localStorage.setItem('datosGlobales', JSON.stringify(datosActuales));
            console.log('Datos guardados en localStorage');
        } catch (error) {
            console.error('Error al guardar en localStorage:', error);
        }
    }

    function sincronizarConDatosGlobales() {
        if (window.datosGlobales && Array.isArray(window.datosGlobales.proveedores)) {
            proveedores = window.datosGlobales.proveedores;
            cargarProveedores();
            console.log('Datos sincronizados con datosGlobales');
        }
    }

    function cargarProveedores() {
        const cuerpoTabla = document.getElementById('cuerpoTablaProveedores');
        if (!cuerpoTabla) {
            console.error('No se encontró el elemento cuerpoTablaProveedores');
            return;
        }

        const contenidoTabla = proveedores.length === 0
            ? '<tr><td colspan="6" class="text-center">No hay proveedores registrados. Haga clic en "+" para agregar uno nuevo.</td></tr>'
            : proveedores.map(proveedor => `
                <tr>
                    <td>${proveedor.id}</td>
                    <td>${proveedor.nombre}</td>
                    <td>${proveedor.correo}</td>
                    <td>${proveedor.telefono}</td>
                    <td>${proveedor.frecuenciaAbastecimiento}</td>
                    <td>
                        <div class="acciones-tabla">
                            <button onclick="window.moduloProveedores.editar(${proveedor.id})" class="btn-icono" title="Editar">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                            </button>
                            <button onclick="window.moduloProveedores.eliminar(${proveedor.id})" class="btn-icono btn-icono-eliminar" title="Eliminar">
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
        document.getElementById('btnBuscar')?.addEventListener('click', buscarProveedores);
    }

    function manejarEnvioFormulario(e) {
        e.preventDefault();
        
        const id = document.getElementById('idProveedor')?.value;
        const proveedor = {
            id: id ? parseInt(id) : Date.now(),
            nombre: document.getElementById('nombreProveedor')?.value || '',
            correo: document.getElementById('correoProveedor')?.value || '',
            telefono: document.getElementById('telefonoProveedor')?.value || '',
            frecuenciaAbastecimiento: parseInt(document.getElementById('frecuenciaAbastecimiento')?.value || '0')
        };

        if (id) {
            const index = proveedores.findIndex(p => p.id === parseInt(id));
            if (index !== -1) {
                proveedores[index] = proveedor;
                console.log('Proveedor actualizado:', proveedor);
            }
        } else {
            proveedores.push(proveedor);
            console.log('Nuevo proveedor agregado:', proveedor);
        }

        guardarEnLocalStorage();
        cargarProveedores();
        document.getElementById('modalProveedor').style.display = 'none';
    }

    function buscarProveedores() {
        const termino = document.getElementById('busquedaProveedor')?.value.toLowerCase() || '';
        const proveedoresFiltrados = proveedores.filter(p => 
            p.nombre.toLowerCase().includes(termino) ||
            p.correo.toLowerCase().includes(termino) ||
            p.telefono.includes(termino) ||
            p.frecuenciaAbastecimiento.toString().includes(termino)
        );
        cargarProveedores(proveedoresFiltrados);
        console.log(`Se encontraron ${proveedoresFiltrados.length} proveedores`);
    }

    function initProveedores() {
        console.log('Inicializando módulo de proveedores');
        cargarProveedoresDesdeLocalStorage();
        cargarProveedores();
        configurarEventListeners();
        
        window.addEventListener('datosGlobalesListo', sincronizarConDatosGlobales);
        
        if (window.datosGlobales) {
            sincronizarConDatosGlobales();
        }
        
        console.log('Módulo de proveedores cargado completamente');
    }

    window.moduloProveedores = {
        init: initProveedores,
        editar: function(id) {
            console.log('Editando proveedor con ID:', id);
            const proveedor = proveedores.find(p => p.id === id);
            if (proveedor) {
                document.getElementById('idProveedor').value = proveedor.id;
                document.getElementById('nombreProveedor').value = proveedor.nombre;
                document.getElementById('correoProveedor').value = proveedor.correo;
                document.getElementById('telefonoProveedor').value = proveedor.telefono;
                document.getElementById('frecuenciaAbastecimiento').value = proveedor.frecuenciaAbastecimiento;
                document.getElementById('modalProveedor').style.display = 'block';
            } else {
                console.error('No se encontró el proveedor con ID:', id);
            }
        },
        eliminar: function(id) {
            console.log('Eliminando proveedor con ID:', id);
            if (confirm('¿Estás seguro de que quieres eliminar este proveedor?')) {
                proveedores = proveedores.filter(p => p.id !== id);
                guardarEnLocalStorage();
                cargarProveedores();
                console.log('Proveedor eliminado con éxito');
            }
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initProveedores);
    } else {
        initProveedores();
    }
})();

console.log('Archivo proveedores.js cargado completamente');