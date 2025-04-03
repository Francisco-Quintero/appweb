export async function initUsuarios(estadoGlobal) {
    console.log('Inicializando módulo de usuarios...');

    // Verificar si los datos de usuarios están disponibles en el estado global
    if (estadoGlobal.usuarios.length === 0) {
        console.warn('Los usuarios no están disponibles en el estado global. Verifica la carga inicial.');
    }

    // Renderizar las listas de usuarios
    actualizarListaUsuarios(estadoGlobal);

    // Configurar eventos del módulo
    configurarEventListeners(estadoGlobal);
}

function actualizarListaUsuarios(estadoGlobal) {
    const listaUsuarios = document.getElementById('lista-usuarios');
    const listaDomiciliarios = document.getElementById('lista-domiciliarios');
    const listaClientes = document.getElementById('lista-clientes'); // Nueva referencia para clientes

    if (!listaUsuarios || !listaDomiciliarios || !listaClientes) return;

    // Limpiar listas
    listaUsuarios.innerHTML = '';
    listaDomiciliarios.innerHTML = '';
    listaClientes.innerHTML = ''; // Limpiar la lista de clientes

    estadoGlobal.usuarios.forEach(usuario => {
        const card = crearUsuarioCard(usuario, estadoGlobal);

        if (usuario.rol.nombre === 'domiciliario') {
            listaDomiciliarios.appendChild(card);
        } else if (usuario.rol.nombre === 'cliente') {
            listaClientes.appendChild(card); // Ahora los clientes se agregan a la lista de clientes
        } else {
            listaUsuarios.appendChild(card); // Otros roles (como administrador) se agregan a la lista de usuarios del sistema
        }
    });
}
// Función para crear una tarjeta de usuario
function crearUsuarioCard(usuario, estadoGlobal) {
    const card = document.createElement('div');
    card.className = 'usuario-card';

    const info = document.createElement('div');
    info.className = 'usuario-info';

    const nombre = document.createElement('strong');
    nombre.textContent = usuario.nombre;

    const email = document.createElement('p');
    email.textContent = usuario.email;

    info.appendChild(nombre);
    info.appendChild(email);

    // Agregar estado si es domiciliario
    if (usuario.rol.nombre === 'domiciliario') {
        const estado = document.createElement('span');
        estado.className = `estado-badge estado-${usuario.estado || 'disponible'}`;
        estado.textContent = usuario.estado || 'disponible';
        info.appendChild(estado);
    }

    const acciones = document.createElement('div');
    acciones.className = 'usuario-acciones';

    // Botón ver detalles
    const btnVer = document.createElement('button');
    btnVer.className = 'btn-accion btn-ver';
    btnVer.innerHTML = '<i class="fas fa-eye"></i>';
    btnVer.onclick = () => mostrarDetallesUsuario(usuario);

    acciones.appendChild(btnVer);

    // Si es domiciliario, agregar botones de editar y eliminar
    if (usuario.rol.nombre === 'domiciliario') {
        const btnEditar = document.createElement('button');
        btnEditar.className = 'btn-accion btn-editar';
        btnEditar.innerHTML = '<i class="fas fa-edit"></i>';
        btnEditar.onclick = () => editarDomiciliario(usuario, estadoGlobal);

        const btnEliminar = document.createElement('button');
        btnEliminar.className = 'btn-accion btn-eliminar';
        btnEliminar.innerHTML = '<i class="fas fa-trash"></i>';
        btnEliminar.onclick = () => eliminarDomiciliario(usuario.id, estadoGlobal);

        acciones.appendChild(btnEditar);
        acciones.appendChild(btnEliminar);
    }

    card.appendChild(info);
    card.appendChild(acciones);

    return card;
}

// Función para mostrar detalles de un usuario
function mostrarDetallesUsuario(usuario) {
    const modal = document.getElementById('usuario-modal');
    const form = document.getElementById('usuario-form');
    const title = document.getElementById('modal-title');
    const domiciliarioFields = document.querySelectorAll('.domiciliario-fields');

    title.textContent = 'Detalles del Usuario';
    document.getElementById('modal-nombre').value = usuario.nombre;
    document.getElementById('modal-email').value = usuario.email;

    // Mostrar/ocultar campos específicos de domiciliario
    domiciliarioFields.forEach(field => {
        field.style.display = usuario.rol.nombre === 'domiciliario' ? 'block' : 'none';
    });

    if (usuario.rol.nombre === 'domiciliario') {
        document.getElementById('modal-estado').value = usuario.estado || 'disponible';
        document.getElementById('modal-activo').checked = usuario.activo !== false;
    }

    // Solo lectura para usuarios no domiciliarios
    const readonly = usuario.rol.nombre !== 'domiciliario';
    document.getElementById('modal-nombre').readOnly = readonly;
    document.getElementById('modal-email').readOnly = readonly;

    modal.style.display = 'block';

    // Configurar el formulario
    form.onsubmit = (e) => {
        e.preventDefault();
        if (usuario.rol.nombre === 'domiciliario') {
            guardarCambiosDomiciliario(usuario.id, estadoGlobal);
        }
        modal.style.display = 'none';
    };
}

// Función para editar un domiciliario
function editarDomiciliario(domiciliario, estadoGlobal) {
    mostrarDetallesUsuario(domiciliario);
}

// Función para guardar cambios de un domiciliario
function guardarCambiosDomiciliario(id, estadoGlobal) {
    const usuario = estadoGlobal.usuarios.find(u => u.id === id);
    if (!usuario) return;

    usuario.nombre = document.getElementById('modal-nombre').value;
    usuario.email = document.getElementById('modal-email').value;
    usuario.estado = document.getElementById('modal-estado').value;
    usuario.activo = document.getElementById('modal-activo').checked;

    actualizarListaUsuarios(estadoGlobal);
}

// Función para eliminar un domiciliario
function eliminarDomiciliario(id, estadoGlobal) {
    if (!confirm('¿Está seguro de eliminar este domiciliario?')) return;

    estadoGlobal.usuarios = estadoGlobal.usuarios.filter(u => u.id !== id);
    actualizarListaUsuarios(estadoGlobal);
}

// Configurar eventos del módulo
function configurarEventListeners(estadoGlobal) {
    document.getElementById('nuevo-domiciliario')?.addEventListener('click', () => {
        const modal = document.getElementById('usuario-modal');
        const form = document.getElementById('usuario-form');
        const title = document.getElementById('modal-title');
        const domiciliarioFields = document.querySelectorAll('.domiciliario-fields');

        title.textContent = 'Registrar Nuevo Domiciliario';
        form.reset();
        domiciliarioFields.forEach(field => field.style.display = 'block');
        document.getElementById('modal-nombre').readOnly = false;
        document.getElementById('modal-email').readOnly = false;

        modal.style.display = 'block';

        form.onsubmit = (e) => {
            e.preventDefault();
            const nombre = document.getElementById('modal-nombre').value;
            const email = document.getElementById('modal-email').value;
            const password = document.getElementById('modal-password').value;
            registrarDomiciliario(nombre, email, password, estadoGlobal);
            modal.style.display = 'none';
        };
    });

    // Botón cerrar (x)
    document.getElementById('modal-cerrar')?.addEventListener('click', cerrarModal);

    // Botón cancelar
    document.getElementById('modal-cancelar')?.addEventListener('click', cerrarModal);
}

// Función para registrar un nuevo domiciliario
async function registrarDomiciliario(nombre, email, password, estadoGlobal) {
    const apellido = document.getElementById('modal-apellido').value;
    const telefono = document.getElementById('modal-telefono').value;
    const direccion = document.getElementById('modal-direccion').value;
    const username = document.getElementById('modal-username').value;

    const nuevoDomiciliario = {
        username: username, // Usamos el email como nombre de usuario
        password: password,
        nombre: nombre,
        apellido: apellido,
        telefono: telefono,
        direccion: direccion,
        email: email,
    };
    console.log(JSON.stringify(nuevoDomiciliario));
    try {
        const response = await fetch('http://localhost:26209/api/usuarios/registrar-domiciliario', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nuevoDomiciliario)
        });

        if (!response.ok) {
            const error = await response.json();
            alert(`Error al registrar domiciliario: ${error.error}`);
            return;
        }

        const domiciliarioGuardado = await response.json();
        estadoGlobal.usuarios.push(domiciliarioGuardado); // Actualizamos el estado global
        actualizarListaUsuarios(estadoGlobal); // Actualizamos la lista en la interfaz
        alert('Domiciliario registrado con éxito');
    } catch (error) {
        console.error('Error al registrar domiciliario:', error);
        alert('Hubo un error al registrar el domiciliario. Intenta nuevamente.');
    }
}



// Función para cerrar el modal
function cerrarModal() {
    const modal = document.getElementById('usuario-modal');
    modal.style.display = 'none';
}