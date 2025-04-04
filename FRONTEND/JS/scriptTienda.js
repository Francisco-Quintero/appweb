// Importar módulos
import { initCatalogo } from '../modules/catalogo/catalogo.js';
import { initCarrito } from '../modules/carrito/carrito.js';
import { initPedidos } from '../modules/pedidos/pedidos.js';
import { initFacturas } from '../modules/facturas/facturas.js';
import estadoGlobal from './estadoGlobal.js';

// Función para inicializar la tienda
export async function inicializarTienda() {
    console.log('Inicializando tienda...');

    // Configurar eventos de usuario
    configurarEventosUsuario();

    // Asegurarse de que los datos iniciales estén cargados
    await estadoGlobal.cargarDatosIniciales();

    // Escuchar cambios en el estado global y actualizar la interfaz según sea necesario
    estadoGlobal.registrarObservador('inventarioActualizado', (inventario) => {
        console.log('Inventario actualizado en tienda:', inventario);
    });

    estadoGlobal.registrarObservador('pedidosActualizados', (pedidos) => {
        console.log('Pedidos actualizados en tienda:', pedidos);
    });

    estadoGlobal.registrarObservador('facturasActualizadas', (facturas) => {
        console.log('Facturas actualizadas en tienda:', facturas);
    });

    estadoGlobal.registrarObservador('proveedoresActualizados', (proveedores) => {
        console.log('Proveedores actualizados en tienda:', proveedores);
    });

    // Configurar navegación entre módulos
    document.querySelectorAll('[data-module]').forEach((enlace) => {
        enlace.addEventListener('click', (event) => {
            event.preventDefault();
            const nombreModulo = enlace.getAttribute('data-module');
            cambiarModulo(nombreModulo);
        });
    });

    // Cargar el módulo inicial
    await cambiarModulo('catalogo');
}

// Función para cambiar entre módulos
async function cambiarModulo(nombreModulo) {
    console.log(`Cambiando al módulo: ${nombreModulo}`);
    const contenedorPrincipal = document.getElementById('contenedor-principal');

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
        case 'catalogo':
            await initCatalogo(estadoGlobal);
            break;
        case 'carrito':
            await initCarrito(estadoGlobal);
            break;
        case 'pedidos':
            await initPedidos(estadoGlobal);
            break;
        case 'facturas':
            await initFacturas(estadoGlobal);
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

// Inicializar la tienda cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    inicializarTienda();
});