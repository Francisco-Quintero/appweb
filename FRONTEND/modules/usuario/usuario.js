(function() {
    console.log('Iniciando carga del módulo de Usuario');

    let usuarios = [];
    let usuarioActual = null;
    let pedidos = [];

    function cargarDatosDesdeLocalStorage() {
        try {
            const datosGuardados = JSON.parse(localStorage.getItem('datosGlobales') || '{}');
            usuarios = datosGuardados.usuarios || [];
            pedidos = datosGuardados.pedidos || [];
            usuarioActual = datosGuardados.usuarioActual || null;
            console.log('Datos de usuarios y pedidos cargados desde localStorage');
        } catch (error) {
            console.error('Error al cargar datos desde localStorage:', error);
        }
    }

    function guardarEnLocalStorage() {
        try {
            const datosActuales = JSON.parse(localStorage.getItem('datosGlobales') || '{}');
            datosActuales.usuarios = usuarios;
            datosActuales.usuarioActual = usuarioActual;
            localStorage.setItem('datosGlobales', JSON.stringify(datosActuales));
            console.log('Datos de usuarios guardados en localStorage');
        } catch (error) {
            console.error('Error al guardar en localStorage:', error);
        }
    }

    function actualizarInterfazUsuario() {
        const contenedorUsuario = document.querySelector('.usuario-container');
        const contenedorLogin = document.getElementById('login-registro-container');
        
        if (usuarioActual) {
            if (contenedorUsuario) contenedorUsuario.style.display = 'block';
            if (contenedorLogin) contenedorLogin.style.display = 'none';
            cargarInformacionUsuario();
            cargarHistorialPedidos();
        } else {
            if (contenedorUsuario) contenedorUsuario.style.display = 'none';
            if (contenedorLogin) contenedorLogin.style.display = 'block';
        }
    }

    function configurarEventListenersLoginRegistro() {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tabId = e.target.dataset.tab;
                cambiarTab(tabId);
            });
        });

        const formLogin = document.getElementById('form-login');
        if (formLogin) {
            formLogin.addEventListener('submit', (e) => {
                e.preventDefault();
                iniciarSesion();
            });
        }

        const formRegistro = document.getElementById('form-registro');
        if (formRegistro) {
            formRegistro.addEventListener('submit', (e) => {
                e.preventDefault();
                registrarUsuario();
            });
        }

        const btnCerrarSesion = document.getElementById('btn-cerrar-sesion');
        if (btnCerrarSesion) {
            btnCerrarSesion.addEventListener('click', cerrarSesion);
        }
    }

    function cambiarTab(tabId) {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabId);
        });
        document.querySelectorAll('.form-container').forEach(form => {
            form.classList.toggle('active', form.id === `${tabId}-form`);
        });
    }

    function iniciarSesion() {
        const username = document.getElementById('login-usuario').value;
        const password = document.getElementById('login-password').value;

        usuarioActual = usuarios.find(u => u.usuario === username && u.password === password);

        if (usuarioActual) {
            console.log('Inicio de sesión exitoso');
            guardarEnLocalStorage();
            actualizarInterfazUsuario();
            window.dispatchEvent(new Event('usuarioLogueado'));
        } else {
            alert('Usuario o contraseña incorrectos');
        }
    }

    function cerrarSesion() {
        usuarioActual = null;
        guardarEnLocalStorage();
        actualizarInterfazUsuario();
        window.dispatchEvent(new Event('usuarioDeslogueado'));
    }

    function registrarUsuario() {
        const nuevoUsuario = {
            id: Date.now(),
            nombre: document.getElementById('registro-nombre').value,
            apellido: document.getElementById('registro-apellido').value,
            identificacion: document.getElementById('registro-identificacion').value,
            telefono: document.getElementById('registro-telefono').value,
            direccion: document.getElementById('registro-direccion').value,
            correo: document.getElementById('registro-correo').value,
            usuario: document.getElementById('registro-usuario').value,
            password: document.getElementById('registro-password').value,
        };

        if (usuarios.some(u => u.usuario === nuevoUsuario.usuario)) {
            alert('El nombre de usuario ya existe. Por favor, elija otro.');
            return;
        }

        usuarios.push(nuevoUsuario);
        usuarioActual = nuevoUsuario;
        guardarEnLocalStorage();
        console.log('Usuario registrado exitosamente');
        actualizarInterfazUsuario();
        window.dispatchEvent(new Event('usuarioLogueado'));
    }

    function cargarInformacionUsuario() {
        if (!usuarioActual) return;
        
        const usuarioInfo = document.getElementById('usuario-info');
        if (usuarioInfo) {
            usuarioInfo.innerHTML = `
                <h3>Información Personal</h3>
                <p><strong>Nombre:</strong> ${usuarioActual.nombre} ${usuarioActual.apellido || ''}</p>
                <p><strong>Identificación:</strong> ${usuarioActual.identificacion || ''}</p>
                <p><strong>Teléfono:</strong> ${usuarioActual.telefono || ''}</p>
                <p><strong>Dirección:</strong> ${usuarioActual.direccion || ''}</p>
                <p><strong>Correo:</strong> ${usuarioActual.correo || ''}</p>
            `;
        }
    }

    function cargarHistorialPedidos() {
        const listaPedidos = document.getElementById('lista-pedidos');
        if (!listaPedidos || !usuarioActual) return;

        const pedidosUsuario = pedidos.filter(pedido => pedido.idUsuario === usuarioActual.id);

        if (pedidosUsuario.length === 0) {
            listaPedidos.innerHTML = `
                <div class="pedido-empty">
                    <p>No hay pedidos en tu historial</p>
                </div>
            `;
            return;
        }

        listaPedidos.innerHTML = pedidosUsuario
            .map(pedido => `
                <div class="pedido-item">
                    <div class="pedido-fecha">Pedido #${pedido.idPedido} - ${new Date(pedido.fecha).toLocaleDateString()}</div>
                    <div class="pedido-detalles">
                        <span>Total: $${pedido.total.toLocaleString()}</span>
                        <span class="pedido-estado ${pedido.estado}">${pedido.estado}</span>
                    </div>
                </div>
            `).join('');
    }

    function verificarUsuarioParaPedido() {
        return usuarioActual !== null;
    }

    function obtenerUsuarioActual() {
        return usuarioActual;
    }

    function initUsuario() {
        console.log('Inicializando módulo de Usuario');
        cargarDatosDesdeLocalStorage();
        actualizarInterfazUsuario();
        configurarEventListenersLoginRegistro();
        console.log('Módulo de Usuario cargado completamente');
    }

    // Inicializar el módulo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initUsuario);
    } else {
        initUsuario();
    }

    // Exponer funciones necesarias globalmente
    window.verificarUsuarioParaPedido = verificarUsuarioParaPedido;
    window.obtenerUsuarioActual = obtenerUsuarioActual;
    window.initUsuario = initUsuario;
})();

