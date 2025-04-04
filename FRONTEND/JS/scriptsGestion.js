// Importar módulos
import { initDashboard } from '../modules/dashboard/dashboard.js';
import { initProductos } from '../modules/productos/productos.js';
import { initProveedores } from '../modules/Proveedores/proveedores.js';
import { initCompras } from '../modules/compras/compras.js';
import { initStock } from '../modules/stock/stock.js';
import { initUsuarios } from '../modules/Usuarios/Usuarios.js';
import { initVentas } from '../modules/ventas/ventas.js';
import estadoGlobal from './estadoGlobal.js'

// Función para inicializar la gestión
export async function inicializarGestion() {
    console.log('Inicializando gestión...');

    // Configurar eventos de usuario
    configurarEventosUsuario();

    // Asegurarse de que los datos iniciales estén cargados
    await estadoGlobal.cargarDatosIniciales();

    // Escuchar cambios en el estado global y actualizar la interfaz según sea necesario
    estadoGlobal.registrarObservador('productosActualizados', (productos) => {
        console.log('Productos actualizados en gestión:', productos);
        // Aquí puedes actualizar la interfaz de usuario si es necesario
    });

    estadoGlobal.registrarObservador('pedidosActualizados', (pedidos) => {
        console.log('Pedidos actualizados en gestión:', pedidos);
    });

    estadoGlobal.registrarObservador('proveedoresActualizados', (proveedores) => {
        console.log('Proveedores actualizados en gestión:', proveedores);
    });

    estadoGlobal.registrarObservador('usuariosActualizados', (usuarios) => {
        console.log('Usuarios actualizados en gestión:', usuarios);
    });

    // Configurar navegación entre módulos
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