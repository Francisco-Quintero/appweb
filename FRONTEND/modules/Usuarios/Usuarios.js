(function() {
    console.log('Iniciando carga del módulo de Usuarios del Sistema');

    let usuarios = [];
    let usuarioActual = null;
    let codigoEnviado = null;

    function cargarDatosDesdeLocalStorage() {
        try {
            const datosGuardados = JSON.parse(localStorage.getItem('usuariosSistema') || '[]');
            usuarios = datosGuardados;
            console.log('Datos de usuarios del sistema cargados desde localStorage');

            // Cargar la sesión del usuario si existe
            const sesionGuardada = localStorage.getItem('sesionUsuario');
            if (sesionGuardada) {
                usuarioActual = JSON.parse(sesionGuardada);
                actualizarInterfaz();
            }
        } catch (error) {
            console.error('Error al cargar datos de usuarios del sistema desde localStorage:', error);
        }
    }

    function guardarEnLocalStorage() {
        try {
            localStorage.setItem('usuariosSistema', JSON.stringify(usuarios));
            console.log('Datos de usuarios del sistema guardados en localStorage');
        } catch (error) {
            console.error('Error al guardar datos de usuarios del sistema en localStorage:', error);
        }
    }

    function iniciarSesion(email, password) {
        const usuario = usuarios.find(u => u.email === email && u.password === password);
        if (usuario) {
            usuarioActual = usuario;
            localStorage.setItem('sesionUsuario', JSON.stringify(usuario));
            actualizarInterfaz();
            return true;
        }
        return false;
    }

    function cerrarSesion() {
        usuarioActual = null;
        actualizarInterfaz();
    }

    function registrarUsuario(nombre, email, password, codigo) {
        if (codigo !== codigoEnviado) {
            alert('Código de registro inválido');
            return false;
        }
        const nuevoUsuario = {
            id: usuarios.length + 1,
            nombre,
            email,
            password,
            rol: 'admin'
        };
        usuarios.push(nuevoUsuario);
        guardarEnLocalStorage();
        codigoEnviado = null;
        return true;
    }

    function registrarDomiciliario(nombre, email, password) {
        const nuevoDomiciliario = {
            id: usuarios.length + 1,
            nombre,
            email,
            password,
            rol: 'domiciliario',
            estado: 'disponible',
            activo: true
        };
        usuarios.push(nuevoDomiciliario);
        guardarEnLocalStorage();
        actualizarListaUsuarios();
        return true;
    }

    function actualizarInterfaz() {
        const loginRegistroContainer = document.getElementById('login-registro-container');
        const panelAdmin = document.getElementById('panel-admin');

        if (usuarioActual) {
            loginRegistroContainer.style.display = 'none';
            panelAdmin.style.display = 'block';
            document.getElementById('bienvenida').textContent = `Bienvenido, ${usuarioActual.nombre}`;
            actualizarListaUsuarios();
            if (usuarioActual.rol !== 'admin') {
                document.getElementById('registro-domiciliario').style.display = 'none';
            } else {
                document.getElementById('registro-domiciliario').style.display = 'block';
            }
            // Notificar al sistema de gestión que el usuario ha iniciado sesión
            window.dispatchEvent(new CustomEvent('usuarioLogueado', { detail: usuarioActual }));
        } else {
            loginRegistroContainer.style.display = 'block';
            panelAdmin.style.display = 'none';
            // Notificar al sistema de gestión que el usuario ha cerrado sesión
            window.dispatchEvent(new CustomEvent('usuarioCerroSesion'));
        }
    }

    function actualizarListaUsuarios() {
        const listaUsuarios = document.getElementById('lista-usuarios');
        const listaDomiciliarios = document.getElementById('lista-domiciliarios');
        
        if (!listaUsuarios || !listaDomiciliarios) return;

        // Limpiar listas
        listaUsuarios.innerHTML = '';
        listaDomiciliarios.innerHTML = '';

        usuarios.forEach(usuario => {
            const card = crearUsuarioCard(usuario);
            
            if (usuario.rol === 'domiciliario') {
                listaDomiciliarios.appendChild(card);
            } else if (usuario.rol === 'admin') {
                listaUsuarios.appendChild(card);
            }
        });
    }

    function crearUsuarioCard(usuario) {
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
        if (usuario.rol === 'domiciliario') {
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
        if (usuario.rol === 'domiciliario') {
            const btnEditar = document.createElement('button');
            btnEditar.className = 'btn-accion btn-editar';
            btnEditar.innerHTML = '<i class="fas fa-edit"></i>';
            btnEditar.onclick = () => editarDomiciliario(usuario);

            const btnEliminar = document.createElement('button');
            btnEliminar.className = 'btn-accion btn-eliminar';
            btnEliminar.innerHTML = '<i class="fas fa-trash"></i>';
            btnEliminar.onclick = () => eliminarDomiciliario(usuario.id);

            acciones.appendChild(btnEditar);
            acciones.appendChild(btnEliminar);
        }

        card.appendChild(info);
        card.appendChild(acciones);

        return card;
    }

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
            field.style.display = usuario.rol === 'domiciliario' ? 'block' : 'none';
        });

        if (usuario.rol === 'domiciliario') {
            document.getElementById('modal-estado').value = usuario.estado || 'disponible';
            document.getElementById('modal-activo').checked = usuario.activo !== false;
        }

        // Solo lectura para usuarios no domiciliarios
        const readonly = usuario.rol !== 'domiciliario';
        document.getElementById('modal-nombre').readOnly = readonly;
        document.getElementById('modal-email').readOnly = readonly;

        modal.style.display = 'block';
        
        // Configurar el formulario
        form.onsubmit = (e) => {
            e.preventDefault();
            if (usuario.rol === 'domiciliario') {
                guardarCambiosDomiciliario(usuario.id);
            }
            modal.style.display = 'none';
        };
    }

    function editarDomiciliario(domiciliario) {
        mostrarDetallesUsuario(domiciliario);
    }

    function guardarCambiosDomiciliario(id) {
        const usuario = usuarios.find(u => u.id === id);
        if (!usuario) return;

        usuario.nombre = document.getElementById('modal-nombre').value;
        usuario.email = document.getElementById('modal-email').value;
        usuario.estado = document.getElementById('modal-estado').value;
        usuario.activo = document.getElementById('modal-activo').checked;

        guardarEnLocalStorage();
        actualizarListaUsuarios();
    }

    function eliminarDomiciliario(id) {
        if (!confirm('¿Está seguro de eliminar este domiciliario?')) return;

        usuarios = usuarios.filter(u => u.id !== id);
        guardarEnLocalStorage();
        actualizarListaUsuarios();
    }

    function configurarEventListeners() {
        document.getElementById('tab-login').addEventListener('click', () => cambiarTab('login'));
        document.getElementById('tab-register').addEventListener('click', () => cambiarTab('register'));

        document.getElementById('form-login').addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            if (iniciarSesion(email, password)) {
                actualizarInterfaz();
            } else {
                alert('Credenciales incorrectas');
            }
        });
        
        document.getElementById('generar-codigo').addEventListener('click', function() {
            codigoEnviado = Math.random().toString(36).substr(2, 8);
            const button = this;
            button.textContent = 'Enviando...';

            const serviceID = 'default_service';
            const templateID = 'template_y4r04nt';
            const templateParams = {
                codigo: codigoEnviado,
            };

            emailjs.send(serviceID, templateID, templateParams)
                .then(() => {
                    button.textContent = 'Código Enviado';
                    document.getElementById('codigo-container').style.display = 'block';
                    alert('Correo enviado exitosamente. Por favor, revise su bandeja de entrada.');
                })
                .catch((error) => {
                    button.textContent = 'Solicitar Código de Registro';
                    alert('Ocurrió un error: ' + JSON.stringify(error));
                });
        });

        document.getElementById('verificar-codigo').addEventListener('click', function() {
            const codigoIngresado = document.getElementById('codigo-input').value;
            if (codigoIngresado === codigoEnviado) {
                document.getElementById('form-registro').style.display = 'block';
                document.getElementById('codigo-container').style.display = 'none';
            } else {
                alert('El código ingresado no es correcto. Por favor, intente nuevamente.');
            }
        });

        document.getElementById('form-registro').addEventListener('submit', (e) => {
            e.preventDefault();
            const nombre = document.getElementById('reg-nombre').value;
            const email = document.getElementById('reg-email').value;
            const password = document.getElementById('reg-password').value;
            const codigo = document.getElementById('reg-codigo').value;
            if (registrarUsuario(nombre, email, password, codigo)) {
                alert('Usuario registrado con éxito');
                cambiarTab('login');
            }
        });

        document.getElementById('nuevo-domiciliario').addEventListener('click', () => {
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
                const password = 'password123'; // Contraseña por defecto, debería cambiarse después
                if (registrarDomiciliario(nombre, email, password)) {
                    alert('Domiciliario registrado con éxito');
                    modal.style.display = 'none';
                }
            };
        });

        document.getElementById('cerrar-sesion').addEventListener('click', cerrarSesion);

        // Configurar búsqueda de clientes
        document.getElementById('buscar-cliente').addEventListener('input', function(e) {
            const busqueda = e.target.value.toLowerCase();
            const listaClientes = document.getElementById('lista-clientes');
            const clientes = listaClientes.getElementsByClassName('usuario-card');

            Array.from(clientes).forEach((cliente) => {
                const nombre = cliente.querySelector('strong').textContent.toLowerCase();
                const email = cliente.querySelector('p').textContent.toLowerCase();
                if (nombre.includes(busqueda) || email.includes(busqueda)) {
                    cliente.style.display = '';
                } else {
                    cliente.style.display = 'none';
                }
            });
        });
    }

    function cambiarTab(tab) {
        document.getElementById('tab-login').classList.toggle('active', tab === 'login');
        document.getElementById('tab-register').classList.toggle('active', tab === 'register');
        document.getElementById('login-form').style.display = tab === 'login' ? 'block' : 'none';
        document.getElementById('register-form').style.display = tab === 'register' ? 'block' : 'none';
    }

    function configurarModal() {
        const modal = document.getElementById('usuario-modal');
        const closeBtn = document.querySelector('.close');
        const cancelBtn = document.getElementById('modal-cancelar');

        closeBtn.onclick = () => modal.style.display = 'none';
        cancelBtn.onclick = () => modal.style.display = 'none';

        window.onclick = (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        };
    }

    function initUsuariosSistema() {
        console.log('Inicializando módulo de Usuarios del Sistema');
        cargarDatosDesdeLocalStorage();
        configurarEventListeners();
        configurarModal();
        actualizarInterfaz();
        console.log('Módulo de Usuarios del Sistema cargado completamente');
    }

    // Inicializar el módulo cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initUsuariosSistema);
    } else {
        initUsuariosSistema();
    }

    // Exponer funciones necesarias globalmente
    window.initUsuariosSistema = initUsuariosSistema;
    window.cerrarSesion = cerrarSesion;
    window.obtenerUsuarioActual = () => usuarioActual;
})();