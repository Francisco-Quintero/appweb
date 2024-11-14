

(function() {
    console.log('Módulo de proveedores cargado');

    let proveedores = [
        { id: 1, nombre: 'Proveedor A', correo: 'proveedora@ejemplo.com', telefono: '123-456-7890' },
        { id: 2, nombre: 'Proveedor B', correo: 'proveedorb@ejemplo.com', telefono: '098-765-4321' },
    ];

    function iniciarProveedores() {
        console.log('Iniciando proveedores...');
        cargarProveedores();
        configurarEventListeners();
    }

    function cargarProveedores() {
        console.log('Cargando proveedores...');
        const cuerpoTabla = document.getElementById('cuerpoTablaProveedores');
        if (!cuerpoTabla) {
            console.error('No se encontró el elemento cuerpoTablaProveedores');
            return;
        }
        cuerpoTabla.innerHTML = '';
        proveedores.forEach(proveedor => {
            console.log('Añadiendo proveedor:', proveedor);
            const fila = `
                <tr>
                    <td>${proveedor.id}</td>
                    <td>${proveedor.nombre}</td>
                    <td>${proveedor.correo}</td>
                    <td>${proveedor.telefono}</td>
                    <td>
                        <button onclick="window.editarProveedor(${proveedor.id})" class="btn btn-secundario">Editar</button>
                        <button onclick="window.eliminarProveedor(${proveedor.id})" class="btn btn-peligro">Eliminar</button>
                    </td>
                </tr>
            `;
            cuerpoTabla.innerHTML += fila;
        });
    }

    function configurarEventListeners() {
        console.log('Configurando event listeners...');
        const btnAgregar = document.getElementById('btnAgregarProveedor');
        if (!btnAgregar) {
            console.error('No se encontró el botón Agregar Proveedor');
            return;
        }
        btnAgregar.addEventListener('click', () => abrirModal());
        document.getElementById('formularioProveedor').addEventListener('submit', manejarEnvioFormulario);
        document.getElementById('btnCancelar').addEventListener('click', cerrarModal);
        document.getElementById('btnBuscar').addEventListener('click', buscarProveedores);
    }

    // ... (resto del código sin cambios)

    function abrirModal(proveedor = null) {
        const modal = document.getElementById('modalProveedor');
        const tituloModal = document.getElementById('tituloModal');
        const formulario = document.getElementById('formularioProveedor');

        if (proveedor) {
            tituloModal.textContent = 'Editar Proveedor';
            formulario.idProveedor.value = proveedor.id;
            formulario.nombreProveedor.value = proveedor.nombre;
            formulario.correoProveedor.value = proveedor.correo;
            formulario.telefonoProveedor.value = proveedor.telefono;
        } else {
            tituloModal.textContent = 'Añadir Proveedor';
            formulario.reset();
        }

        modal.style.display = 'block';
    }

    function cerrarModal() {
        document.getElementById('modalProveedor').style.display = 'none';
    }

    function manejarEnvioFormulario(e) {
        e.preventDefault();
        const formulario = e.target;
        const proveedor = {
            id: formulario.idProveedor.value ? parseInt(formulario.idProveedor.value) : Date.now(),
            nombre: formulario.nombreProveedor.value,
            correo: formulario.correoProveedor.value,
            telefono: formulario.telefonoProveedor.value
        };

        if (formulario.idProveedor.value) {
            actualizarProveedor(proveedor);
        } else {
            agregarProveedor(proveedor);
        }

        cerrarModal();
        cargarProveedores();
    }

    function agregarProveedor(proveedor) {
        proveedores.push(proveedor);
    }

    function actualizarProveedor(proveedorActualizado) {
        const indice = proveedores.findIndex(p => p.id === proveedorActualizado.id);
        if (indice !== -1) {
            proveedores[indice] = proveedorActualizado;
        }
    }

    function editarProveedor(id) {
        const proveedor = proveedores.find(p => p.id === id);
        if (proveedor) {
            abrirModal(proveedor);
        }
    }

    function eliminarProveedor(id) {
        if (confirm('¿Estás seguro de que quieres eliminar este proveedor?')) {
            proveedores = proveedores.filter(p => p.id !== id);
            cargarProveedores();
        }
    }

    function buscarProveedores() {
        const terminoBusqueda = document.getElementById('busquedaProveedor').value.toLowerCase();
        const proveedoresFiltrados = proveedores.filter(proveedor => 
            proveedor.nombre.toLowerCase().includes(terminoBusqueda) ||
            proveedor.correo.toLowerCase().includes(terminoBusqueda) ||
            proveedor.telefono.includes(terminoBusqueda)
        );
        
        const cuerpoTabla = document.getElementById('cuerpoTablaProveedores');
        cuerpoTabla.innerHTML = '';
        proveedoresFiltrados.forEach(proveedor => {
            const fila = `
                <tr>
                    <td>${proveedor.id}</td>
                    <td>${proveedor.nombre}</td>
                    <td>${proveedor.correo}</td>
                    <td>${proveedor.telefono}</td>
                    <td>
                        <button onclick="editarProveedor(${proveedor.id})" class="btn btn-secundario">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                        </button>
                        <button onclick="eliminarProveedor(${proveedor.id})" class="btn btn-peligro">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash-2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                        </button>
                    </td>
                </tr>
            `;
            cuerpoTabla.innerHTML += fila;
        });
    }

    // Asegúrate de que estas funciones estén disponibles globalmente
    window.editarProveedor = editarProveedor;
    window.eliminarProveedor = eliminarProveedor;

    // Iniciar el módulo cuando el DOM esté completamente cargado
    document.addEventListener('DOMContentLoaded', iniciarProveedores);

    // Alternativa: si el evento DOMContentLoaded no funciona, intenta esto:
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', iniciarProveedores);
    } else {
        iniciarProveedores();
    }

    console.log('Fin del script de proveedores');
})();