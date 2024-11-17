(function() {
    console.log('Iniciando carga del módulo de Usuario');

    let usuarioState = {
        eventListeners: [],
        appStateRef: null
    };

    function addEventListenerWithCleanup(element, event, handler) {
        if (element) {
            element.addEventListener(event, handler);
            usuarioState.eventListeners.push({ element, event, handler });
        }
    }

    function cleanup() {
        console.log('Limpiando módulo de Usuario');
        usuarioState.eventListeners.forEach(({ element, event, handler }) => {
            if (element) {
                element.removeEventListener(event, handler);
            }
        });
        usuarioState.eventListeners = [];
        window.cerrarModal = undefined;
        usuarioState.appStateRef = null;
    }

    function cargarInformacionUsuario(appState) {
        // Asumimos que la información del usuario está en appState
        const usuario = appState.usuario || {
            id: 1,
            nombre: 'Juan Pérez',
            email: 'juan.perez@example.com',
            telefono: '123-456-7890',
            direccion: 'Calle Principal 123, Ciudad'
        };

        const usuarioInfo = document.getElementById('usuario-info');
        if (usuarioInfo) {
            usuarioInfo.innerHTML = `
                <h3>Información Personal</h3>
                <p><strong>Nombre:</strong> ${usuario.nombre}</p>
                <p><strong>Email:</strong> ${usuario.email}</p>
                <p><strong>Teléfono:</strong> ${usuario.telefono}</p>
                <p><strong>Dirección:</strong> ${usuario.direccion}</p>
            `;
        }
    }

    function cargarHistorialPedidos(appState) {
        const pedidos = appState.pedidos || [
            { id: 1, fecha: '2024-01-15', total: 50000, estado: 'entregado' },
            { id: 2, fecha: '2024-02-01', total: 75000, estado: 'enviado' },
            { id: 3, fecha: '2024-02-10', total: 100000, estado: 'pendiente' }
        ];

        const listaPedidos = document.getElementById('lista-pedidos');
        if (listaPedidos) {
            listaPedidos.innerHTML = pedidos.map(pedido => `
                <div class="pedido-item">
                    <div class="pedido-fecha">Pedido #${pedido.id} - ${pedido.fecha}</div>
                    <div class="pedido-detalles">
                        <span>Total: $${pedido.total.toLocaleString()}</span>
                        <span class="pedido-estado ${pedido.estado}">${pedido.estado.charAt(0).toUpperCase() + pedido.estado.slice(1)}</span>
                    </div>
                </div>
            `).join('');
        }
    }

    function configurarEventListeners() {
        addEventListenerWithCleanup(document.getElementById('btn-editar-perfil'), 'click', () => abrirModal('modal-editar-perfil'));
        addEventListenerWithCleanup(document.getElementById('btn-cambiar-contrasena'), 'click', () => abrirModal('modal-cambiar-contrasena'));

        addEventListenerWithCleanup(document.getElementById('form-editar-perfil'), 'submit', (e) => {
            e.preventDefault();
            // Aquí iría la lógica para actualizar el perfil
            console.log('Perfil actualizado');
            cerrarModal('modal-editar-perfil');
        });

        addEventListenerWithCleanup(document.getElementById('form-cambiar-contrasena'), 'submit', (e) => {
            e.preventDefault();
            // Aquí iría la lógica para cambiar la contraseña
            console.log('Contraseña cambiada');
            cerrarModal('modal-cambiar-contrasena');
        });
    }

    function abrirModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'block';
        }
    }

    function cerrarModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
        }
    }

    function inicializarModuloUsuario(appState) {
        console.log('Inicializando módulo de Usuario');
        usuarioState.appStateRef = appState;
        cargarInformacionUsuario(appState);
        cargarHistorialPedidos(appState);
        configurarEventListeners();
        window.cerrarModal = cerrarModal;
        return {
            cleanup: cleanup
        };
    }

    window.inicializarModuloUsuario = inicializarModuloUsuario;

    console.log('Módulo de Usuario cargado completamente');
})();