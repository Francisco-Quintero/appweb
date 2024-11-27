// Definición de datos globales iniciales
const datosGlobalesInicial = {
    usuarios: [],
    productos: [],
    inventario: [],
    carrito: [],
    pedidosPendientes: [],
    pedidosEntregados: [],
    facturas: [],
    domiciliarios: []
};

// Función para inicializar los datos si no existen en localStorage
function inicializarDatosGlobales() {
    const datosAlmacenados = localStorage.getItem('datosGlobales');
    if (!datosAlmacenados) {
        localStorage.setItem('datosGlobales', JSON.stringify(datosGlobalesInicial));
        console.log('Datos globales inicializados');
        return datosGlobalesInicial;
    }
    return JSON.parse(datosAlmacenados);
}

// Función para guardar datos globales
function guardarDatosGlobales(datos) {
    localStorage.setItem('datosGlobales', JSON.stringify(datos));
    console.log('Datos globales guardados');
}

// Función para obtener datos globales actuales
function obtenerDatosGlobales() {
    return JSON.parse(localStorage.getItem('datosGlobales')) || datosGlobalesInicial;
}

// Inicializar datos globales cuando se carga el script
window.datosGlobales = inicializarDatosGlobales();

// Exponer funciones globalmente
window.inicializarDatosGlobales = inicializarDatosGlobales;
window.guardarDatosGlobales = guardarDatosGlobales;
window.obtenerDatosGlobales = obtenerDatosGlobales;
window.datosGlobalesInicial = datosGlobalesInicial;



// Función para ver datos en localStorage
function verDatosLocalStorage() {
    console.log('Contenido de localStorage:');
    console.log('-------------------------');

    const datosGuardados = localStorage.getItem('datosGlobales');
    if (datosGuardados) {
        const datos = JSON.parse(datosGuardados);
        Object.keys(datos).forEach(clave => {
            console.log(`${clave}:`);
            console.log(datos[clave]);
            console.log('-------------------------');
        });
    } else {
        console.log('No hay datos almacenados en datosGlobales');
    }
}

function verDatosUsuarios() {
    console.log('Contenido de localStorage:');
    console.log('-------------------------');

    const datosGuardados = localStorage.getItem('usuariosSistema');
    if (datosGuardados) {
        const datos = JSON.parse(datosGuardados);
        Object.keys(datos).forEach(clave => {
            console.log(`${clave}:`);
            console.log(datos[clave]);
            console.log('-------------------------');
        });
    } else {
        console.log('No hay datos almacenados en datosGlobales');
    }
}
function verUsuarioActual(usuario) {
    console.log('Contenido de localStorage:');
    console.log('-------------------------');

    const datosGuardados = localStorage.getItem(usuario);
    if (datosGuardados) {
        const datos = JSON.parse(datosGuardados);
        Object.keys(datos).forEach(clave => {
            console.log(`${clave}:`);
            console.log(datos[clave]);
            console.log('-------------------------');
        });
    } else {
        console.log('No hay datos almacenados en datosGlobales');
    }
}

function eliminarDatos(){
    const datosGlobales = JSON.parse(localStorage.getItem('datosGlobales'));

if (datosGlobales && datosGlobales.compras) {
    delete datosGlobales.compras; // Elimina la propiedad inventario
    localStorage.setItem('datosGlobales', JSON.stringify(datosGlobales)); // Actualiza el localStorage
    console.log('La propiedad inventario ha sido eliminada de datosGlobales.');
} else {
    console.log('No se encontró la propiedad inventario en datosGlobales.');
}
}

// Agregar esta función al objeto global window para poder llamarla desde la consola
window.verDatosLocalStorage = verDatosLocalStorage;
window.eliminarDatos = eliminarDatos;

