// Datos de ejemplo
const comprasData = [
    { id: 1, fecha: '2023-05-15', proveedor: 'Proveedor A', total: 1500.00, estado: 'Completada' },
    { id: 2, fecha: '2023-05-16', proveedor: 'Proveedor B', total: 2000.00, estado: 'Pendiente' },
];

// Función para cargar el módulo de compras
async function cargarModuloCompras() {
    try {
        console.log('Cargando módulo de compras');
        
        // Cargar el CSS
        await cargarCSS('/FRONTEND/modules/compras/compras.css');
        
        // Inicializar el módulo
        initCompras();
        
        console.log('Módulo de compras cargado completamente');
    } catch (error) {
        console.error('Error al cargar el módulo de compras:', error);
    }
}

// Función para cargar CSS
function cargarCSS(url) {
    return new Promise((resolve, reject) => {
        if (document.querySelector(`link[href="${url}"]`)) {
            resolve();
            return;
        }
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = url;
        link.onload = () => {
            console.log(`CSS cargado: ${url}`);
            resolve();
        };
        link.onerror = () => reject(new Error(`No se pudo cargar el CSS: ${url}`));
        document.head.appendChild(link);
    });
}

// Función para cargar script
function cargarScript(url) {
    return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${url}"]`)) {
            resolve();
            return;
        }
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;
        script.onload = () => {
            console.log(`Script cargado: ${url}`);
            resolve();
        };
        script.onerror = () => reject(new Error(`No se pudo cargar el script: ${url}`));
        document.body.appendChild(script);
    });
}

// Inicialización del módulo
function initCompras() {
    console.log('Inicializando módulo de compras');
    
    // Configurar event listeners
    const btnNuevaCompra = document.getElementById('btnNuevaCompra');
    if (btnNuevaCompra) {
        btnNuevaCompra.addEventListener('click', async () => {
            await cargarFormularioCompra();
        });
    }

    const btnBuscar = document.getElementById('btnBuscar');
    if (btnBuscar) {
        btnBuscar.addEventListener('click', buscarCompras);
    }

    const btnCerrarModal = document.getElementById('btnCerrarModal');
    if (btnCerrarModal) {
        btnCerrarModal.addEventListener('click', cerrarModal);
    }

    // Cargar datos iniciales
    cargarCompras();
}

// Cargar compras en la tabla
function cargarCompras() {
    console.log('Cargando compras en la tabla');
    const cuerpoTabla = document.getElementById('cuerpoTablaCompras');
    if (!cuerpoTabla) {
        console.error('No se encontró el elemento cuerpoTablaCompras');
        return;
    }

    cuerpoTabla.innerHTML = comprasData.map(compra => `
        <tr>
            <td>${compra.id}</td>
            <td>${compra.fecha}</td>
            <td>${compra.proveedor}</td>
            <td>$${compra.total.toFixed(2)}</td>
            <td>${compra.estado}</td>
            <td>
                <button onclick="window.verDetallesCompra(${compra.id})" class="btn btn-secundario">Ver más</button>
            </td>
        </tr>
    `).join('');
    
    console.log('Compras cargadas en la tabla');
}

// Cargar el formulario de compra
async function cargarFormularioCompra() {
    try {
        console.log('Cargando formulario de compra');
        const moduloCompras = document.getElementById('modulo-compras');
        if (!moduloCompras) {
            throw new Error('No se encontró el elemento modulo-compras');
        }

        // Crear o obtener el contenedor del formulario
        let contenedor = document.getElementById('contenedorFormularioCompra');
        if (!contenedor) {
            contenedor = document.createElement('div');
            contenedor.id = 'contenedorFormularioCompra';
            moduloCompras.appendChild(contenedor);
        }

        // Cargar el HTML del formulario
        const respuesta = await fetch('/FRONTEND/modules/compras/formulario-compra.html');
        if (!respuesta.ok) {
            throw new Error(`Error al cargar el HTML del formulario: ${respuesta.status}`);
        }
        const contenido = await respuesta.text();
        contenedor.innerHTML = contenido;

        // Cargar el CSS del formulario
        await cargarCSS('/FRONTEND/modules/compras/formulario-compra.css');
        console.log('CSS del formulario cargado');

        // Cargar el JS del formulario
        await cargarScript('/FRONTEND/modules/compras/formulario-compra.js');
        console.log('JS del formulario cargado');

        // Mostrar el formulario
        contenedor.style.display = 'block';
        moduloCompras.classList.add('formulario-activo');

        // Configurar el botón de cerrar del formulario
        const btnCerrarFormulario = document.getElementById('btnCerrarFormulario');
        if (btnCerrarFormulario) {
            btnCerrarFormulario.addEventListener('click', () => {
                contenedor.style.display = 'none';
                moduloCompras.classList.remove('formulario-activo');
            });
        }

        console.log('Formulario de compra cargado completamente');
    } catch (error) {
        console.error('Error al cargar el formulario de compra:', error);
    }
}

// Función de búsqueda
function buscarCompras() {
    console.log('Realizando búsqueda de compras');
    const termino = document.getElementById('busquedaCompra')?.value.toLowerCase() || '';
    const comprasFiltradas = comprasData.filter(c => 
        c.proveedor.toLowerCase().includes(termino) ||
        c.fecha.includes(termino) ||
        c.estado.toLowerCase().includes(termino)
    );
    
    const cuerpoTabla = document.getElementById('cuerpoTablaCompras');
    if (!cuerpoTabla) {
        console.error('No se encontró el elemento cuerpoTablaCompras');
        return;
    }

    cuerpoTabla.innerHTML = comprasFiltradas.map(compra => `
        <tr>
            <td>${compra.id}</td>
            <td>${compra.fecha}</td>
            <td>${compra.proveedor}</td>
            <td>$${compra.total.toFixed(2)}</td>
            <td>${compra.estado}</td>
            <td>
                <button onclick="window.verDetallesCompra(${compra.id})" class="btn btn-secundario">Ver más</button>
            </td>
        </tr>
    `).join('');
    console.log('Búsqueda completada');
}

// Ver detalles de una compra
function verDetallesCompra(id) {
    console.log(`Mostrando detalles de la compra ${id}`);
    const compra = comprasData.find(c => c.id === id);
    if (!compra) {
        console.error(`No se encontró la compra con id ${id}`);
        return;
    }

    const detallesCompra = document.getElementById('detallesCompra');
    if (!detallesCompra) {
        console.error('No se encontró el elemento detallesCompra');
        return;
    }

    detallesCompra.innerHTML = `
        <h4>Compra #${compra.id}</h4>
        <p><strong>Fecha:</strong> ${compra.fecha}</p>
        <p><strong>Proveedor:</strong> ${compra.proveedor}</p>
        <p><strong>Total:</strong> $${compra.total.toFixed(2)}</p>
        <p><strong>Estado:</strong> ${compra.estado}</p>
    `;

    const modalCompra = document.getElementById('modalCompra');
    if (modalCompra) {
        modalCompra.style.display = 'block';
    }
}

// Cerrar modal
function cerrarModal() {
    const modalCompra = document.getElementById('modalCompra');
    if (modalCompra) {
        modalCompra.style.display = 'none';
    }
}

// Hacer las funciones disponibles globalmente
window.cargarModuloCompras = cargarModuloCompras;
window.verDetallesCompra = verDetallesCompra;
window.buscarCompras = buscarCompras;
window.cerrarModal = cerrarModal;

// Iniciar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM cargado, iniciando módulo de compras');
    cargarModuloCompras();
});

console.log('Archivo compras.js cargado');