(function() {
    let comprasData = [];
    let proveedores = [];
    let productos = [];
    let variantes = [];
    let productosCompra = [];
    let proveedorSeleccionado = null;
    let productoSeleccionado = null;
    let varianteSeleccionada = null;

    // Función principal de inicialización
    async function initCompras() {
        console.log('Iniciando inicialización del módulo de compras');
        try {
            await cargarDatosIniciales();
            await configurarEventListeners();
            console.log('Inicialización del módulo de compras completada');
        } catch (error) {
            console.error('Error durante la inicialización:', error);
        }
    }

    // Cargar datos iniciales de forma asíncrona
    async function cargarDatosIniciales() {
        console.log('Cargando datos iniciales...');
        try {
            if (window.datosGlobales) {
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

                await cargarCompras();
                await cargarCategorias();
                console.log('Datos iniciales cargados correctamente');
            } else {
                throw new Error('datosGlobales no está disponible');
            }
        } catch (error) {
            console.error('Error al cargar datos iniciales:', error);
            throw error;
        }
    }

    // Cargar compras de forma asíncrona
    async function cargarCompras() {
        console.log('Cargando compras en la tabla');
        try {
            const cuerpoTabla = document.getElementById('cuerpoTablaCompras');
            const comprasEmpty = document.getElementById('compras-empty');
            
            if (!cuerpoTabla) {
                throw new Error('No se encontró el elemento cuerpoTablaCompras');
            }

            if (comprasData.length === 0) {
                cuerpoTabla.innerHTML = '';
                if (comprasEmpty) {
                    comprasEmpty.style.display = 'block';
                }
                console.log('No hay compras para mostrar');
                return;
            }

            if (comprasEmpty) {
                comprasEmpty.style.display = 'none';
            }

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
            
            console.log('Compras cargadas exitosamente');
        } catch (error) {
            console.error('Error al cargar compras:', error);
            throw error;
        }
    }

    // Configurar event listeners de forma asíncrona
    async function configurarEventListeners() {
        console.log('Configurando event listeners');
        try {
            const elementos = {
                btnNuevaCompra: document.getElementById('btnNuevaCompra'),
                btnCerrarFormulario: document.getElementById('btnCerrarFormulario'),
                btnAgregarProducto: document.getElementById('btnAgregarProducto'),
                btnGuardarCompra: document.getElementById('btnGuardarCompra'),
                busquedaProveedor: document.getElementById('busquedaProveedor'),
                busquedaProducto: document.getElementById('busquedaProducto'),
                categoriaFiltro: document.getElementById('categoriaFiltro'),
                impuesto: document.getElementById('impuesto')
            };

            // Verificar que todos los elementos existan
            Object.entries(elementos).forEach(([nombre, elemento]) => {
                if (!elemento) {
                    console.warn(`Elemento ${nombre} no encontrado`);
                }
            });

            // Configurar listeners solo para elementos que existen
            if (elementos.btnNuevaCompra) {
                elementos.btnNuevaCompra.addEventListener('click', mostrarFormularioCompra);
            }
            if (elementos.btnCerrarFormulario) {
                elementos.btnCerrarFormulario.addEventListener('click', cerrarFormularioCompra);
            }
            if (elementos.btnAgregarProducto) {
                elementos.btnAgregarProducto.addEventListener('click', agregarProductoACompra);
            }
            if (elementos.btnGuardarCompra) {
                elementos.btnGuardarCompra.addEventListener('click', guardarCompra);
            }
            if (elementos.busquedaProveedor) {
                elementos.busquedaProveedor.addEventListener('input', (e) => {
                    const termino = e.target.value.toLowerCase();
                    const resultados = proveedores.filter(p => 
                        p.nombre.toLowerCase().includes(termino) ||
                        p.numeroContacto.toString().includes(termino)
                    );
                    mostrarResultadosProveedor(resultados);
                });
            }
            if (elementos.busquedaProducto) {
                elementos.busquedaProducto.addEventListener('input', buscarProductos);
            }
            if (elementos.categoriaFiltro) {
                elementos.categoriaFiltro.addEventListener('change', buscarProductos);
            }
            if (elementos.impuesto) {
                elementos.impuesto.addEventListener('input', calcularTotales);
            }

            console.log('Event listeners configurados correctamente');
        } catch (error) {
            console.error('Error al configurar event listeners:', error);
            throw error;
        }
    }

    // Resto de funciones existentes...
    // (Mantener el resto del código igual, solo asegurándose de que todas las funciones
    // tengan manejo de errores y logging apropiado)

    // Inicialización con mejor manejo de estado del DOM
    async function comenzarInicializacion() {
        console.log('Comenzando inicialización del módulo');
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', async () => {
                console.log('DOM completamente cargado');
                await initCompras();
            });
        } else {
            console.log('DOM ya está cargado');
            await initCompras();
        }
    }

    // Comenzar la inicialización
    comenzarInicializacion();
})();