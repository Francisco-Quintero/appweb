// proveedores.js
(function() {
    console.log('Iniciando carga del módulo de proveedores');

    function esperarDatosGlobales() {
        return new Promise((resolve) => {
            if (window.datosGlobales) {
                resolve(window.datosGlobales);
            } else {
                window.addEventListener('datosGlobalesDisponibles', () => {
                    resolve(window.datosGlobales);
                });
            }
        });
    }

    function cargarProveedores() {
        console.log('Cargando proveedores en la tabla');
        const cuerpoTabla = document.getElementById('cuerpoTablaProveedores');
        if (!cuerpoTabla) {
            console.error('No se encontró el elemento cuerpoTablaProveedores');
            return;
        }
        cuerpoTabla.innerHTML = '';

        // Asegurarse de que proveedores existe y es un array
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
        
        // Configurar botón de agregar
        const btnAgregar = document.getElementById('btnAgregarProveedor');
        if (btnAgregar) {
            btnAgregar.addEventListener('click', () => {
                const formulario = document.getElementById('formularioProveedor');
                if (formulario) {
                    formulario.reset();
                }
                const idInput = document.getElementById('idProveedor');
                if (idInput) {
                    idInput.value = '';
                }
                const modal = document.getElementById('modalProveedor');
                if (modal) {
                    modal.style.display = 'block';
                }
            });
        }

        // Configurar botón de cancelar
        const btnCancelar = document.getElementById('btnCancelar');
        if (btnCancelar) {
            btnCancelar.addEventListener('click', () => {
                const modal = document.getElementById('modalProveedor');
                if (modal) {
                    modal.style.display = 'none';
                }
            });
        }

// Dentro del event listener del formulario en proveedores.js
document.getElementById('formularioProveedor')?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (!window.datosGlobales) {
        console.error('datosGlobales no está disponible');
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
        if (id) {
            if (typeof window.datosGlobales.actualizarProveedor === 'function') {
                window.datosGlobales.actualizarProveedor(parseInt(id), proveedor);
                console.log('Proveedor actualizado:', proveedor);
            } else {
                console.error('actualizarProveedor no es una función');
            }
        } else {
            if (typeof window.datosGlobales.agregarProveedor === 'function') {
                window.datosGlobales.agregarProveedor(proveedor);
                console.log('Nuevo proveedor agregado:', proveedor);
            } else {
                console.error('agregarProveedor no es una función');
            }
        }

        cargarProveedores();
        document.getElementById('modalProveedor').style.display = 'none';
    } catch (error) {
        console.error('Error al procesar el formulario:', error);
    }
});

        // Configurar botón de búsqueda
        const btnBuscar = document.getElementById('btnBuscar');
        if (btnBuscar) {
            btnBuscar.addEventListener('click', buscarProveedores);
        }
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
        
        if (!proveedoresMostrar || proveedoresMostrar.length === 0) {
            cuerpoTabla.innerHTML = '<tr><td colspan="6" class="text-center">No se encontraron proveedores que coincidan con la búsqueda.</td></tr>';
            return;
        }

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

    async function initProveedores() {
        console.log('Inicializando módulo de proveedores');
        try {
            await esperarDatosGlobales();
            cargarProveedores();
            configurarEventListeners();
            console.log('Módulo de proveedores cargado completamente');
        } catch (error) {
            console.error('Error al inicializar el módulo de proveedores:', error);
        }
    }

    // API pública del módulo
    window.moduloProveedores = {
        init: initProveedores,
        editar: function(id) {
            console.log('Editando proveedor con ID:', id);
            const proveedor = window.datosGlobales?.proveedores?.find(p => p.id === id);
            if (proveedor) {
                const elementos = {
                    id: document.getElementById('idProveedor'),
                    nombre: document.getElementById('nombreProveedor'),
                    correo: document.getElementById('correoProveedor'),
                    telefono: document.getElementById('telefonoProveedor'),
                    frecuencia: document.getElementById('frecuenciaAbastecimiento'),
                    modal: document.getElementById('modalProveedor')
                };

                if (elementos.id) elementos.id.value = proveedor.id;
                if (elementos.nombre) elementos.nombre.value = proveedor.nombre;
                if (elementos.correo) elementos.correo.value = proveedor.correo;
                if (elementos.telefono) elementos.telefono.value = proveedor.telefono;
                if (elementos.frecuencia) elementos.frecuencia.value = proveedor.frecuenciaAbastecimiento;
                if (elementos.modal) elementos.modal.style.display = 'block';
            } else {
                console.error('No se encontró el proveedor con ID:', id);
            }
        },
        eliminar: function(id) {
            console.log('Eliminando proveedor con ID:', id);
            if (confirm('¿Estás seguro de que quieres eliminar este proveedor?')) {
                window.datosGlobales?.eliminarProveedor(id);
                console.log('Proveedor eliminado con éxito');
                cargarProveedores();
            }
        }
    };

    // Inicialización del módulo
    initProveedores();
})();