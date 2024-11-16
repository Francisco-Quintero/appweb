// En /FRONTEND/modules/usuario/usuario.js

function initUsuario() {
    console.log('Módulo de usuario cargado');
    cargarInformacionUsuario();
    cargarHistorialPedidos();
    configurarEventListeners();
}

function cargarInformacionUsuario() {
    // Simulamos obtener la información del usuario
    const usuario = {
        id: 1,
        nombre: 'Juan Pérez',
        email: 'juan.perez@example.com',
        telefono: '123-456-7890',
        direccion: 'Calle Principal 123, Ciudad'
    };

    const usuarioInfo = document.getElementById('usuario-info');
    usuarioInfo.innerHTML = `
        <h3>Información Personal</h3>
        <p><strong>Nombre:</strong> ${usuario.nombre}</p>
        <p><strong>Email:</strong> ${usuario.email}</p>
        <p><strong>Teléfono:</strong> ${usuario.telefono}</p>
        <p><strong>Dirección:</strong> ${usuario.direccion}</p>
    `;
}

function cargarHistorialPedidos() {
    // Simulamos obtener el historial de pedidos
    const pedidos = [
        { id: 1, fecha: '2024-01-15', total: 50000, estado: 'entregado' },
        { id: 2, fecha: '2024-02-01', total: 75000, estado: 'enviado' },
        { id: 3, fecha: '2024-02-10', total: 100000, estado: 'pendiente' }
    ];

    const listaPedidos = document.getElementById('lista-pedidos');
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

function configurarEventListeners() {
    document.getElementById('btn-editar-perfil').addEventListener('click', () => abrirModal('modal-editar-perfil'));
    document.getElementById('btn-cambiar-contrasena').addEventListener('click', () => abrirModal('modal-cambiar-contrasena'));

    document.getElementById('form-editar-perfil').addEventListener('submit', (e) => {
        e.preventDefault();
        // Aquí iría la lógica para actualizar el perfil
        console.log('Perfil actualizado');
        cerrarModal('modal-editar-perfil');
    });

    document.getElementById('form-cambiar-contrasena').addEventListener('submit', (e) => {
        e.preventDefault();
        // Aquí iría la lógica para cambiar la contraseña
        console.log('Contraseña cambiada');
        cerrarModal('modal-cambiar-contrasena');
    });
}

function abrirModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

function cerrarModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Hacer públicas las funciones necesarias
window.cerrarModal = cerrarModal;

// Inicializar el módulo
initUsuario();