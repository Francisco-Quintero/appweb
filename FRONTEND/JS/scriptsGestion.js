// Importar módulos
import { initDashboard } from '../modules/dashboard/dashboard.js';

// Estado global centralizado
const estadoGlobal = {
    usuarioLogueado: false,
    usuario: null,
    carrito: [],
    inventario: [],
    pedidosPendientes: [],
    historialVentas: [],
    proveedores: [],

    setUsuarioLogueado(logueado, usuario = null) {
        this.usuarioLogueado = logueado;
        this.usuario = usuario;
        document.body.classList.toggle('usuario-logueado', logueado);
    },
    actualizarInventario(nuevoInventario) {
        this.inventario = nuevoInventario;
        console.log('Inventario actualizado:', this.inventario);
    },
    actualizarPedidosPendientes(nuevosPedidos) {
        this.pedidosPendientes = nuevosPedidos;
        console.log('Pedidos pendientes actualizados:', this.pedidosPendientes);
    },
    actualizarHistorialVentas(nuevoHistorial) {
        this.historialVentas = nuevoHistorial;
        console.log('Historial de ventas actualizado:', this.historialVentas);
    },
    actualizarProveedores(nuevosProveedores) {
        this.proveedores = nuevosProveedores;
        console.log('Proveedores actualizados:', this.proveedores);
    }
};

// Función para inicializar la gestión
export async function inicializarGestion() {
    console.log('Inicializando gestión...');

    // Configurar eventos de usuario
    configurarEventosUsuario();

    // Cargar la información del usuario desde el localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        estadoGlobal.setUsuarioLogueado(true, user);
    }

    // Obtener datos iniciales desde la base de datos
    await cargarDatosIniciales();

    document.querySelectorAll('[data-module]').forEach((enlace) => {
        enlace.addEventListener('click', (event) => {
            event.preventDefault();
            const nombreModulo = enlace.getAttribute('data-module');
            cambiarModulo(nombreModulo);
        });
    });

    // Cargar el módulo inicial (dashboard)
    await cambiarModulo('dashboard');
}

// Función para cargar datos iniciales desde la base de datos
async function cargarDatosIniciales() {
    try {
        const [inventario, pedidosPendientes, historialVentas, proveedores] = await Promise.all([
            fetch('http://localhost:26209/api/inventario').then(res => res.json()),
            fetch('http://localhost:26209/api/pedidos/pendientes').then(res => res.json()),
            fetch('http://localhost:26209/api/ventas/historial').then(res => res.json()),
            fetch('http://localhost:26209/api/proveedores').then(res => res.json())
        ]);

        estadoGlobal.actualizarInventario(inventario);
        estadoGlobal.actualizarPedidosPendientes(pedidosPendientes);
        estadoGlobal.actualizarHistorialVentas(historialVentas);
        estadoGlobal.actualizarProveedores(proveedores);

        console.log('Datos iniciales cargados desde la base de datos');
    } catch (error) {
        console.error('Error al cargar datos iniciales desde la base de datos:', error);
    }
}

// Función para cambiar entre módulos
async function cambiarModulo(nombreModulo) {
    console.log(`Cambiando al módulo: ${nombreModulo}`);
    const contenedorPrincipal = document.getElementById('main-container');

    // Limpiar el contenedor principal
    contenedorPrincipal.innerHTML = '';

    // Cargar el HTML del módulo
    const response = await fetch(`modules/${nombreModulo}/${nombreModulo}.html`);
    if (!response.ok) {
        throw new Error(`Error al cargar el HTML del módulo ${nombreModulo}`);
    }
    const html = await response.text();
    contenedorPrincipal.innerHTML = html;

    // Inicializar el módulo correspondiente
    switch (nombreModulo) {
        case 'dashboard':
            await initDashboard(estadoGlobal);
            break;
        default:
            console.error(`Módulo desconocido: ${nombreModulo}`);
    }
}

// Configurar eventos relacionados con el usuario
function configurarEventosUsuario() {
    const userMenuButton = document.getElementById('userMenuButton');
    const userDropdown = document.getElementById('userDropdown');

    if (userMenuButton && userDropdown) {
        userMenuButton.addEventListener('click', () => {
            userDropdown.classList.toggle('show');
        });

        document.addEventListener('click', (event) => {
            if (!userMenuButton.contains(event.target) && !userDropdown.contains(event.target)) {
                userDropdown.classList.remove('show');
            }
        });
    }

    // Escuchar eventos de login y logout
    window.addEventListener('usuarioLogueado', () => {
        console.log('Usuario ha iniciado sesión');
        estadoGlobal.setUsuarioLogueado(true);
    });

    window.addEventListener('usuarioDeslogueado', () => {
        console.log('Usuario ha cerrado sesión');
        estadoGlobal.setUsuarioLogueado(false);
    });
}

// Inicializar la gestión cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    inicializarGestion();
});