// proveedores.js
(function() {
    console.log('Iniciando carga del módulo de proveedores');

    function cargarProveedores() {
        console.log('Cargando proveedores en la tabla');
        const cuerpoTabla = document.getElementById('cuerpoTablaProveedores');
        if (!cuerpoTabla) {
            console.error('No se encontró el elemento cuerpoTablaProveedores');
            return;
        }
        cuerpoTabla.innerHTML = '';

        const proveedores = window.datosGlobales?.proveedores || [];
        
        if (proveedores.length === 0) {
            cuerpoTabla.innerHTML = '<tr><td colspan="6" class="text-center">No hay proveedores registrados. Haga clic en "+" para agregar uno nuevo.</td></tr>';
        } else {
            proveedores.forEach(proveedor => {
                const fila = `
                    <tr>
                        <td>${proveedor.id}</td>
                        <td>${proveedor.nombre}</td>
                        <td>${proveedor.correo}</td>
                        <td>${proveedor.telefono}</td>
                        <td>${proveedor.frecuenciaAbastecimiento}</td>
                        <td>
                            <button onclick="window.moduloProveedores.editar(${proveedor.id})" class="btn btn-secundario">Editar</button>
                            <button onclick="window.moduloProveedores.eliminar(${proveedor.id})" class="btn btn-peligro">Eliminar</button>
                        </td>
                    </tr>
                `;
                cuerpoTabla.innerHTML += fila;
            });
        }
        console.log('Proveedores cargados en la tabla');
    }

    function configurarEventListeners() {
        console.log('Configurando event listeners');
        
        document.getElementById('btnAgregarProveedor')?.addEventListener('click', () => {
            document.getElementById('formularioProveedor').reset();
            document.getElementById('idProveedor').value = '';
            document.getElementById('modalProveedor').style.display = 'block';
        });

        document.getElementById('btnCancelar')?.addEventListener('click', () => {
            document.getElementById('modalProveedor').style.display = 'none';
        });

        document.getElementById('formularioProveedor')?.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (!window.datosGlobales) {
                console.error('Error: datosGlobales no está disponible');
                return;
            }

            const id = document.getElementById('idProveedor')?.value;
            const proveedor = {
                id: id ? parseInt(id) : Date.now(),
                nombre: document.getElementById('nombreProveedor')?.value || '',
                correo: document.getElementById('correoProveedor')?.value || '',
                telefono: document.getElementById('telefonoProveedor')?.value || '',
                frecuenciaAbastecimiento: parseInt(document.getElementById('frecuenciaAbastecimiento')?.value || '0')
            };

            try {
                if (!Array.isArray(window.datosGlobales.proveedores)) {
                    window.datosGlobales.proveedores = [];
                }

                if (id) {
                    const index = window.datosGlobales.proveedores.findIndex(p => p.id === parseInt(id));
                    if (index !== -1) {
                        window.datosGlobales.proveedores[index] = proveedor;
                        console.log('Proveedor actualizado:', proveedor);
                    }
                } else {
                    window.datosGlobales.proveedores.push(proveedor);
                    console.log('Nuevo proveedor agregado:', proveedor);
                }

                guardarEnLocalStorage();
                cargarProveedores();
                document.getElementById('modalProveedor').style.display = 'none';
            } catch (error) {
                console.error('Error al procesar el formulario:', error);
            }
        });

        document.getElementById('btnBuscar')?.addEventListener('click', buscarProveedores);
    }

    function buscarProveedores() {
        console.log('Buscando proveedores');
        const termino = document.getElementById('busquedaProveedor')?.value.toLowerCase() || '';
        const proveedores = window.datosGlobales?.proveedores || [];
        const proveedoresFiltrados = proveedores.filter(p => 
            p.nombre.toLowerCase().includes(termino) ||
            p.correo.toLowerCase().includes(termino) ||
            p.telefono.includes(termino) ||
            p.frecuenciaAbastecimiento.toString().includes(termino)
        );
        actualizarTablaProveedores(proveedoresFiltrados);
        console.log(`Se encontraron ${proveedoresFiltrados.length} proveedores`);
    }

    function actualizarTablaProveedores(proveedoresMostrar) {
        const cuerpoTabla = document.getElementById('cuerpoTablaProveedores');
        if (!cuerpoTabla) {
            console.error('No se encontró el elemento cuerpoTablaProveedores');
            return;
        }
        cuerpoTabla.innerHTML = '';
        
        if (proveedoresMostrar.length === 0) {
            cuerpoTabla.innerHTML = '<tr><td colspan="6" class="text-center">No se encontraron proveedores que coincidan con la búsqueda.</td></tr>';
        } else {
            proveedoresMostrar.forEach(proveedor => {
                const fila = `
                    <tr>
                        <td>${proveedor.id}</td>
                        <td>${proveedor.nombre}</td>
                        <td>${proveedor.correo}</td>
                        <td>${proveedor.telefono}</td>
                        <td>${proveedor.frecuenciaAbastecimiento}</td>
                        <td>
                            <button onclick="window.moduloProveedores.editar(${proveedor.id})" class="btn btn-secundario">Editar</button>
                            <button onclick="window.moduloProveedores.eliminar(${proveedor.id})" class="btn btn-peligro">Eliminar</button>
                        </td>
                    </tr>
                `;
                cuerpoTabla.innerHTML += fila;
            });
        }
    }

// El resto de las funciones permanecen igual, solo modificamos guardarEnLocalStorage
function guardarEnLocalStorage() {
    if (typeof window.datosGlobales?.guardarEnLocalStorage === 'function') {
        console.log('Usando función global guardarEnLocalStorage');
        window.datosGlobales.guardarEnLocalStorage();
    } else {
        console.error('La función guardarEnLocalStorage no está disponible. Implementando respaldo.');
        try {
            const datosActuales = JSON.parse(localStorage.getItem('datosGlobales') || '{}');
            datosActuales.proveedores = window.datosGlobales.proveedores;
            localStorage.setItem('datosGlobales', JSON.stringify(datosActuales));
            console.log('Datos guardados en localStorage (respaldo)');
        } catch (error) {
            console.error('Error al guardar en localStorage (respaldo):', error);
        }
    }
}


    function initProveedores() {
        console.log('Inicializando módulo de proveedores');
        if (!window.datosGlobales) {
            console.error('Error: datosGlobales no está disponible');
            return;
        }
        if (!Array.isArray(window.datosGlobales.proveedores)) {
            window.datosGlobales.proveedores = [];
        }
        cargarProveedores();
        configurarEventListeners();
        console.log('Módulo de proveedores cargado completamente');
    }

    // API pública del módulo
    window.moduloProveedores = {
        init: initProveedores,
        editar: function(id) {
            console.log('Editando proveedor con ID:', id);
            const proveedor = window.datosGlobales?.proveedores?.find(p => p.id === id);
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
                if (window.datosGlobales && Array.isArray(window.datosGlobales.proveedores)) {
                    window.datosGlobales.proveedores = window.datosGlobales.proveedores.filter(p => p.id !== id);
                    guardarEnLocalStorage();
                    console.log('Proveedor eliminado con éxito');
                    cargarProveedores();
                } else {
                    console.error('Error: No se pudo acceder a los datos de proveedores');
                }
            }
        }
    };

    // Inicialización del módulo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initProveedores);
    } else {
        initProveedores();
    }
})();

console.log('Archivo proveedores.js cargado completamente');