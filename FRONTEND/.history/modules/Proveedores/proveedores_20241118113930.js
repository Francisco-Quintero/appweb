// Código mejorado de proveedores con funciones adicionales
(function() {
    console.log('Iniciando carga del módulo de proveedores');

    let proveedores = [
        { id: 1, nombre: 'Proveedor A', correo: 'proveedora@ejemplo.com', telefono: '123-456-7890', frecuenciaAbastecimiento: 2 },
        { id: 2, nombre: 'Proveedor B', correo: 'proveedorb@ejemplo.com', telefono: '098-765-4321', frecuenciaAbastecimiento: 5 },
    ];

    function cargarProveedores() {
        console.log('Cargando proveedores en la tabla');
        const cuerpoTabla = document.getElementById('cuerpoTablaProveedores');
        if (!cuerpoTabla) {
            console.error('No se encontró el elemento cuerpoTablaProveedores');
            return;
        }
        cuerpoTabla.innerHTML = '';
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
            const id = document.getElementById('idProveedor').value;
            const proveedor = {
                id: id ? parseInt(id) : Date.now(),
                nombre: document.getElementById('nombreProveedor').value,
                correo: document.getElementById('correoProveedor').value,
                telefono: document.getElementById('telefonoProveedor').value,
                frecuenciaAbastecimiento: parseInt(document.getElementById('frecuenciaAbastecimiento').value)
            };
            if (id) {
                const index = proveedores.findIndex(p => p.id == id);
                if (index !== -1) {
                    proveedores[index] = proveedor;
                    console.log('Proveedor actualizado:', proveedor);
                } else {
                    console.error('No se encontró el proveedor para actualizar');
                }
            } else {
                proveedores.push(proveedor);
                console.log('Nuevo proveedor agregado:', proveedor);
            }
            cargarProveedores();
            document.getElementById('modalProveedor').style.display = 'none';
        });

        document.getElementById('btnBuscar')?.addEventListener('click', buscarProveedores);
    }

    function buscarProveedores() {
        console.log('Buscando proveedores');
        const termino = document.getElementById('busquedaProveedor').value.toLowerCase();
        const proveedoresFiltrados = proveedores.filter(p => 
            p.nombre.toLowerCase().includes(termino) ||
            p.correo.toLowerCase().includes(termino) ||
            p.telefono.includes(termino)
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

    function initProveedores() {
        console.log('Inicializando módulo de proveedores');
        cargarProveedores();
        configurarEventListeners();
        console.log('Módulo de proveedores cargado completamente');
    }

    // API pública del módulo
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
                const cantidadAnterior = proveedores.length;
                proveedores = proveedores.filter(p => p.id !== id);
                if (proveedores.length < cantidadAnterior) {
                    console.log('Proveedor eliminado con éxito');
                    cargarProveedores();
                } else {
                    console.error('No se pudo eliminar el proveedor con ID:', id);
                }
            }
        },
        agregar: function(proveedor) {
            console.log('Agregando nuevo proveedor:', proveedor);
            proveedores.push(proveedor);
            cargarProveedores();
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