(function() {
    // Variables globales
    let comprasData = [];
    let proveedores = [];
    let productos = [];
    let variantes = [];
    let productosCompra = [];
    let proveedorSeleccionado = null;
    let productoSeleccionado = null;
    let varianteSeleccionada = null;

    // Función para verificar si el elemento existe
    function elementoExiste(id) {
        return document.getElementById(id) !== null;
    }

    // Función principal de inicialización
    function initCompras() {
        console.log('Iniciando módulo de compras');
        
        // Esperar a que el DOM esté completamente cargado
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', verificarYCargar);
        } else {
            verificarYCargar();
        }
    }

    // Función para verificar elementos y cargar datos
    function verificarYCargar() {
        // Verificar que los elementos necesarios existan
        if (!elementoExiste('cuerpoTablaCompras')) {
            console.error('Error: No se encontró el elemento cuerpoTablaCompras');
            return;
        }

        // Verificar datosGlobales
        if (!window.datosGlobales) {
            console.error('Error: datosGlobales no está disponible');
            return;
        }

        // Si todo está bien, proceder con la carga
        console.log('Elementos verificados, procediendo con la carga');
        cargarDatosIniciales();
        configurarEventListeners();
    }

    // Cargar datos iniciales
    function cargarDatosIniciales() {
        console.log('Cargando datos iniciales');
        
        // Cargar datos desde datosGlobales
        comprasData = window.datosGlobales.compras || [];
        proveedores = window.datosGlobales.proveedores || [];
        productos = window.datosGlobales.productos || [];
        variantes = window.datosGlobales.variantes || [];
        
        console.log('Datos cargados:', {
            compras: comprasData.length,
            proveedores: proveedores.length,
            productos: productos.length,
            variantes: variantes.length
        });

        // Cargar datos en la interfaz
        cargarCompras();
        cargarCategorias();
    }

    // Cargar compras en la tabla
    function cargarCompras() {
        const cuerpoTabla = document.getElementById('cuerpoTablaCompras');
        const comprasEmpty = document.getElementById('compras-empty');
        
        if (!cuerpoTabla) return;

        if (comprasData.length === 0) {
            cuerpoTabla.innerHTML = '';
            if (comprasEmpty) comprasEmpty.style.display = 'block';
            return;
        }

        if (comprasEmpty) comprasEmpty.style.display = 'none';

        cuerpoTabla.innerHTML = comprasData.map(compra => `
            <tr>
                <td>${compra.id}</td>
                <td>${compra.fecha}</td>
                <td>${compra.proveedor}</td>
                <td>$${compra.total.toFixed(2)}</td>
                <td>
                    <span class="estado-compra estado-${compra.estado.toLowerCase()}">
                        ${compra.estado}
                    </span>
                </td>
                <td>
                    <button onclick="verDetallesCompra(${compra.id})" class="btn btn-secundario">
                        Ver más
                    </button>
                </td>
            </tr>
        `).join('');
    }

    // Configurar event listeners
    function configurarEventListeners() {
        // Mapeo de elementos y sus event listeners
        const elementosYEventos = {
            'btnNuevaCompra': { evento: 'click', handler: mostrarFormularioCompra },
            'btnCerrarFormulario': { evento: 'click', handler: cerrarFormularioCompra },
            'btnAgregarProducto': { evento: 'click', handler: agregarProductoACompra },
            'btnGuardarCompra': { evento: 'click', handler: guardarCompra },
            'busquedaProveedor': { evento: 'input', handler: (e) => buscarProveedores(e.target.value) },
            'busquedaProducto': { evento: 'input', handler: buscarProductos },
            'categoriaFiltro': { evento: 'change', handler: buscarProductos },
            'impuesto': { evento: 'input', handler: calcularTotales }
        };

        // Configurar cada event listener
        Object.entries(elementosYEventos).forEach(([id, config]) => {
            const elemento = document.getElementById(id);
            if (elemento) {
                elemento.addEventListener(config.evento, config.handler);
            }
        });
    }

    // Exportar funciones necesarias al objeto window
    window.verDetallesCompra = function(id) {
        const compra = comprasData.find(c => c.id === id);
        if (!compra) return;
        // Implementar lógica de mostrar detalles
    };

    window.eliminarProducto = function(index) {
        productosCompra.splice(index, 1);
        actualizarTablaProductos();
    };

    // Iniciar el módulo
    console.log('Iniciando carga del módulo de compras');
    initCompras();
})();