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
        if (!appState) return;
        
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

    function formatearEstadoPedido(estado) {
        if (!estado || typeof estado !== 'string') return '';
        return estado.charAt(0).toUpperCase() + estado.slice(1).toLowerCase();
    }

    function cargarHistorialPedidos(appState) {
        if (!appState) return;

        const pedidos = appState.pedidos || [];
        const listaPedidos = document.getElementById('lista-pedidos');
        
        if (!listaPedidos) {
            console.error('No se encontró el elemento lista-pedidos');
            return;
        }

        if (pedidos.length === 0) {
            listaPedidos.innerHTML = `
                <div class="pedido-empty">
                    <p>No hay pedidos en tu historial</p>
                </div>
            `;
            return;
        }

        listaPedidos.innerHTML = pedidos.map(pedido => {
            if (!pedido) return '';
            
            const fecha = pedido.fecha ? new Date(pedido.fecha).toLocaleDateString() : 'Fecha no disponible';
            const total = pedido.total ? pedido.total.toLocaleString() : '0';
            const estado = formatearEstadoPedido(pedido.estado);
            
            return `
                <div class="pedido-item">
                    <div class="pedido-fecha">Pedido #${pedido.id || 'N/A'} - ${fecha}</div>
                    <div class="pedido-detalles">
                        <span>Total: $${total}</span>
                        <span class="pedido-estado ${pedido.estado || ''}">${estado}</span>
                    </div>
                </div>
            `;
        }).join('');
    }

    function configurarEventListeners() {
        addEventListenerWithCleanup(
            document.getElementById('btn-editar-perfil'),
            'click',
            () => abrirModal('modal-editar-perfil')
        );
        
        addEventListenerWithCleanup(
            document.getElementById('btn-cambiar-contrasena'),
            'click',
            () => abrirModal('modal-cambiar-contrasena')
        );

        addEventListenerWithCleanup(
            document.getElementById('form-editar-perfil'),
            'submit',
            (e) => {
                e.preventDefault();
                console.log('Perfil actualizado');
                cerrarModal('modal-editar-perfil');
            }
        );

        addEventListenerWithCleanup(
            document.getElementById('form-cambiar-contrasena'),
            'submit',
            (e) => {
                e.preventDefault();
                console.log('Contraseña cambiada');
                cerrarModal('modal-cambiar-contrasena');
            }
        );
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
        if (!appState) {
            console.error('Estado de la aplicación no disponible');
            return;
        }
        
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