// En modules/proveedores/proveedores.js
function initProveedores() {
    console.log('Módulo de proveedores cargado');

    let proveedores = [
        { id: 1, nombre: 'Proveedor A', correo: 'proveedora@ejemplo.com', telefono: '123-456-7890' },
        { id: 2, nombre: 'Proveedor B', correo: 'proveedorb@ejemplo.com', telefono: '098-765-4321' },
    ];

    function cargarProveedores() {
        const cuerpoTabla = document.getElementById('cuerpoTablaProveedores');
        cuerpoTabla.innerHTML = '';
        proveedores.forEach(proveedor => {
            const fila = `
                <tr>
                    <td>${proveedor.id}</td>
                    <td>${proveedor.nombre}</td>
                    <td>${proveedor.correo}</td>
                    <td>${proveedor.telefono}</td>
                    <td>
                        <button onclick="editarProveedor(${proveedor.id})" class="btn btn-secundario">Editar</button>
                        <button onclick="eliminarProveedor(${proveedor.id})" class="btn btn-peligro">Eliminar</button>
                    </td>
                </tr>
            `;
            cuerpoTabla.innerHTML += fila;
        });
    }

    function agregarProveedor(proveedor) {
        proveedores.push(proveedor);
        cargarProveedores();
    }

    function editarProveedor(id) {
        const proveedor = proveedores.find(p => p.id === id);
        if (proveedor) {
            document.getElementById('idProveedor').value = proveedor.id;
            document.getElementById('nombreProveedor').value = proveedor.nombre;
            document.getElementById('correoProveedor').value = proveedor.correo;
            document.getElementById('telefonoProveedor').value = proveedor.telefono;
            document.getElementById('modalProveedor').style.display = 'block';
        }
    }

    function eliminarProveedor(id) {
        if (confirm('¿Estás seguro de que quieres eliminar este proveedor?')) {
            proveedores = proveedores.filter(p => p.id !== id);
            cargarProveedores();
        }
    }

    function buscarProveedores() {
        const termino = document.getElementById('busquedaProveedor').value.toLowerCase();
        const proveedoresFiltrados = proveedores.filter(p => 
            p.nombre.toLowerCase().includes(termino) ||
            p.correo.toLowerCase().includes(termino) ||
            p.telefono.includes(termino)
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
                        <button onclick="editarProveedor(${proveedor.id})" class="btn btn-secundario">Editar</button>
                        <button onclick="eliminarProveedor(${proveedor.id})" class="btn btn-peligro">Eliminar</button>
                    </td>
                </tr>
            `;
            cuerpoTabla.innerHTML += fila;
        });
    }

    // Configurar event listeners
    document.getElementById('btnAgregarProveedor').addEventListener('click', () => {
        document.getElementById('formularioProveedor').reset();
        document.getElementById('modalProveedor').style.display = 'block';
    });

    document.getElementById('btnCancelar').addEventListener('click', () => {
        document.getElementById('modalProveedor').style.display = 'none';
    });

    document.getElementById('formularioProveedor').addEventListener('submit', (e) => {
        e.preventDefault();
        const proveedor = {
            id: document.getElementById('idProveedor').value || Date.now(),
            nombre: document.getElementById('nombreProveedor').value,
            correo: document.getElementById('correoProveedor').value,
            telefono: document.getElementById('telefonoProveedor').value
        };
        if (proveedor.id === Date.now()) {
            agregarProveedor(proveedor);
        } else {
            const index = proveedores.findIndex(p => p.id == proveedor.id);
            if (index !== -1) {
                proveedores[index] = proveedor;
                cargarProveedores();
            }
        }
        document.getElementById('modalProveedor').style.display = 'none';
    });

    document.getElementById('btnBuscar').addEventListener('click', buscarProveedores);

    // Cargar proveedores iniciales
    cargarProveedores();
}

// Asegúrate de que la función initProveedores esté disponible globalmente
window.initProveedores = initProveedores;