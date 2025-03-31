// Importar módulos
import { initCatalogo } from '../modules/catalogo/catalogo.js';
import { initCarrito } from '../modules/carrito/carrito.js'; 
import { initPedidos } from '../modules/pedidos/pedidos.js';
import { initFacturas } from '../modules/facturas/facturas.js';

// Estado global centralizado
const estadoGlobal = {
    usuarioLogueado: false,
    carrito: [],
    inventario: [],
    setUsuarioLogueado(logueado) {
        this.usuarioLogueado = logueado;
        document.body.classList.toggle('usuario-logueado', logueado);
    },
    actualizarCarrito(nuevoCarrito) {
        this.carrito = nuevoCarrito;
        console.log('Carrito actualizado:', this.carrito);
    },
    actualizarInventario(nuevoInventario) {
        this.inventario = nuevoInventario;
        console.log('Inventario actualizado:', this.inventario);
    }
};

// Función para inicializar la tienda
export async function inicializarTienda() {
    console.log('Inicializando tienda...');

    // Configurar eventos de usuario
    configurarEventosUsuario();

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

    switch (nombreModulo) {
        case 'catalogo':
            await initCatalogo(estadoGlobal);
            break;
        case 'carrito':
            await initCarrito(estadoGlobal); // Inicializar el módulo carrito
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