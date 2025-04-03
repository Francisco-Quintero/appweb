// Importar módulos
import { initDashboard } from '../modules/dashboard/dashboard.js';
import { initProductos } from '../modules/productos/productos.js';
import { initProveedores } from '../modules/Proveedores/proveedores.js';
import { initCompras } from '../modules/compras/compras.js';
import { initStock } from '../modules/stock/stock.js';
import { initUsuarios } from '../modules/Usuarios/Usuarios.js';
import { initVentas } from '../modules/ventas/ventas.js';

// Estado global centralizado
const estadoGlobal = {
    usuarioLogueado: false,
    usuario: null,
    carrito: [],
    inventario: [],
    productos: [], // Nueva propiedad para productos
    pedidos: [], // Cambiado de pedidosPendientes a pedidos
    historialVentas: [],
    proveedores: [],
    suministros: [],
    usuarios: [],
    ventasActivas: [],

    setUsuarioLogueado(logueado, usuario = null) {
        this.usuarioLogueado = logueado;
        this.usuario = usuario;
        document.body.classList.toggle('usuario-logueado', logueado);
    },
    actualizarInventario(nuevoInventario) {
        this.inventario = nuevoInventario;
        console.log('Inventario actualizado:', this.inventario);
    },
    actualizarProductos(nuevosProductos) { // Nueva función para productos
        this.productos = nuevosProductos;
        console.log('Productos actualizados:', this.productos);
    },
    actualizarPedidos(nuevosPedidos) { // Cambiado de actualizarPedidosPendientes
        this.pedidos = nuevosPedidos;
        console.log('Pedidos actualizados:', this.pedidos);
    },
    actualizarHistorialVentas(nuevoHistorial) {
        this.historialVentas = nuevoHistorial;
        console.log('Historial de ventas actualizado:', this.historialVentas);
    },
    actualizarProveedores(nuevosProveedores) {
        this.proveedores = nuevosProveedores;
        console.log('Proveedores actualizados:', this.proveedores);
    },
    actualizarSuministros(nuevosSuministros) { // Nueva función para suministros
        this.suministros = nuevosSuministros;
        console.log('Suministros actualizados:', this.suministros);
    },
    actualizarUsuarios(nuevosUsuarios) { // Nueva función para usuarios
        this.usuarios = nuevosUsuarios;
        console.log('Usuarios actualizados:', this.usuarios);
    },
    actualizarVentasActivas(nuevasVentas) {
        this.ventasActivas = nuevasVentas;
        console.log('Ventas activas actualizadas:', this.ventasActivas);
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
        const [productos, pedidos, proveedores, inventario, suministros, usuarios] = await Promise.all([
            fetch('http://localhost:26209/api/productos').then(res => res.json()),
            fetch('http://localhost:26209/api/pedidos').then(res => res.json()),
            fetch('http://localhost:26209/api/proveedores').then(res => res.json()),
            fetch('http://localhost:26209/api/inventarios').then(res => res.json()),
            fetch('http://localhost:26209/api/suministros').then(res => res.json()),
            fetch('http://localhost:26209/api/usuarios').then(res => res.json()) // Nueva llamada para usuarios
        ]);

        estadoGlobal.actualizarProductos(productos);
        estadoGlobal.actualizarPedidos(pedidos);
        estadoGlobal.actualizarProveedores(proveedores);
        estadoGlobal.actualizarInventario(inventario);
        estadoGlobal.actualizarSuministros(suministros);
        estadoGlobal.actualizarUsuarios(usuarios); // Actualizar usuarios

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
        case 'productos':
            await initProductos(estadoGlobal);
            break;
        case 'proveedores':
            await initProveedores(estadoGlobal);
            break;
        case 'compras':
            await initCompras(estadoGlobal);
            break;
        case 'stock':
            await initStock(estadoGlobal);
            break;
        case 'Usuarios':
            await initUsuarios(estadoGlobal);
            break;
        case 'ventas':
            await initVentas(estadoGlobal);
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