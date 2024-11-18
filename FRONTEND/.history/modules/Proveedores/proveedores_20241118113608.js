
// Versión mejorada de proveedores.js
(function() {
    console.log('Iniciando carga del módulo de proveedores');

    // Variables encapsuladas dentro del IIFE
    let proveedores = [
        { id: 1, nombre: 'Proveedor A', correo: 'proveedora@ejemplo.com', telefono: '123-456-7890' },
        { id: 2, nombre: 'Proveedor B', correo: 'proveedorb@ejemplo.com', telefono: '098-765-4321' }
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
                    <td>
                        <button onclick="window.moduloProveedores.editarProveedor(${proveedor.id})" class="btn btn-secundario">Editar</button>
                        <button onclick="window.moduloProveedores.eliminarProveedor(${proveedor.id})" class="btn btn-peligro">Eliminar</button>
                    </td>
                </tr>
            `;
            cuerpoTabla.innerHTML += fila;
        });
    }

    function configurarEventListeners() {
        console.log('Configurando event listeners');
        document.getElementById('btnAgregarProveedor')?.addEventListener('click', () => {
            document.getElementById('formularioProveedor').reset();
            document.getElementById('idProveedor').value = '';
            document.getElementById('modalProveedor').style.display = 'block';
        });

        document.getElementById('btnBuscar')?.addEventListener('click', buscarProveedores);
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
            const proveedor = proveedores.find(p => p.id === id);
            if (proveedor) {
                document.getElementById('idProveedor').value = proveedor.id;
                document.getElementById('nombreProveedor').value = proveedor.nombre;
                document.getElementById('correoProveedor').value = proveedor.correo;
                document.getElementById('telefonoProveedor').value = proveedor.telefono;
                document.getElementById('modalProveedor').style.display = 'block';
            }
        },
        eliminar: function(id) {
            if (confirm('¿Estás seguro de que quieres eliminar este proveedor?')) {
                proveedores = proveedores.filter(p => p.id !== id);
                cargarProveedores();
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




































