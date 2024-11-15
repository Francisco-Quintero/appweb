// formulario-compra.js
console.log('Iniciando carga de formulario-compra.js');

function iniciarFormularioCompra() {
    console.log('Función iniciarFormularioCompra llamada');

    // Datos de prueba
    const proveedores = [
        { id: 1, nombre: 'Alqueria' },
        { id: 2, nombre: 'Colanta' },
    ];

    const productos = [
        { id: 1, nombre: 'Leche', descripcion: '900ml', precioUnitario: 20000, unidad: 'und' },
        { id: 2, nombre: 'Queso crema', descripcion: '70g', precioUnitario: 15900, unidad: 'und' },
    ];

    console.log('Datos de prueba cargados:', { proveedores, productos });

    let productosCompra = [];
    let indiceEditando = null;

    // Función para obtener elementos del DOM
    function getElement(id) {
        const element = document.getElementById(id);
        if (!element) {
            console.error(`Elemento con id '${id}' no encontrado`);
        }
        return element;
    }

    // Elementos del DOM
    const elements = {
        selectProveedor: getElement('proveedor'),
        inputBusquedaProducto: getElement('busquedaProducto'),
        divResultadosBusqueda: getElement('resultadosBusqueda'),
        inputCantidad: getElement('cantidad'),
        inputPrecioCompraTotal: getElement('precioCompraTotal'),
        btnAgregarProducto: getElement('btnAgregarProducto'),
        tablaProductos: getElement('tablaProductos'),
        inputImpuesto: getElement('impuesto'),
        spanSubtotal: getElement('subtotal'),
        spanValorImpuesto: getElement('valorImpuesto'),
        spanTotal: getElement('total'),
        btnGuardarCompra: getElement('btnGuardarCompra'),
        btnCerrarFormulario: getElement('btnCerrarFormulario')
    };

    console.log('Elementos del DOM obtenidos:', elements);

    // Cargar proveedores
    function cargarProveedores() {
        console.log('Cargando proveedores');
        if (elements.selectProveedor) {
            elements.selectProveedor.innerHTML = '<option value="">Seleccione un proveedor</option>';
            proveedores.forEach(proveedor => {
                const option = document.createElement('option');
                option.value = proveedor.id;
                option.textContent = proveedor.nombre;
                elements.selectProveedor.appendChild(option);
            });
            console.log('Proveedores cargados en el select');
        }
    }

    // Buscar productos
    function buscarProductos() {
        console.log('Buscando productos');
        const termino = elements.inputBusquedaProducto.value.toLowerCase();
        const resultados = productos.filter(producto =>
            producto.nombre.toLowerCase().includes(termino) ||
            producto.descripcion.toLowerCase().includes(termino)
        );
        mostrarResultadosBusqueda(resultados);
    }

    // Mostrar resultados de búsqueda
    function mostrarResultadosBusqueda(resultados) {
        console.log('Mostrando resultados de búsqueda:', resultados);
        elements.divResultadosBusqueda.innerHTML = '';
        resultados.forEach(producto => {
            const div = document.createElement('div');
            div.textContent = `${producto.nombre} - ${producto.descripcion}`;
            div.onclick = () => seleccionarProducto(producto);
            elements.divResultadosBusqueda.appendChild(div);
        });
    }

    // Seleccionar producto
    function seleccionarProducto(producto) {
        console.log('Producto seleccionado:', producto);
        elements.inputBusquedaProducto.value = producto.nombre;
        elements.divResultadosBusqueda.innerHTML = '';
        elements.inputCantidad.focus();
    }

    // Agregar o editar producto
    function agregarOEditarProducto() {
        console.log('Agregando o editando producto');
        const nombre = elements.inputBusquedaProducto.value;
        const cantidad = parseInt(elements.inputCantidad.value);
        const precioCompraTotal = parseFloat(elements.inputPrecioCompraTotal.value);

        if (!nombre || isNaN(cantidad) || isNaN(precioCompraTotal)) {
            console.error('Datos del producto incompletos o inválidos');
            alert('Por favor, complete todos los campos correctamente');
            return;
        }

        const producto = productos.find(p => p.nombre === nombre);
        if (!producto) {
            console.error('Producto no encontrado');
            alert('Producto no encontrado');
            return;
        }

        const precioCompraUnitario = precioCompraTotal / cantidad;
        const impuesto = parseFloat(elements.inputImpuesto.value) || 0;
        const precioConIva = precioCompraUnitario * (1 + impuesto / 100);
        const precioUnitarioFinal = precioConIva * 1.2; // 20% de ganancia

        const nuevoProducto = {
            id: producto.id,
            nombre: producto.nombre,
            unidad: producto.unidad,
            cantidad: cantidad,
            precioCompraTotal: precioCompraTotal,
            precioUnitarioFinal: precioUnitarioFinal
        };

        if (indiceEditando !== null) {
            productosCompra[indiceEditando] = nuevoProducto;
            indiceEditando = null;
            elements.btnAgregarProducto.textContent = 'Agregar';
        } else {
            productosCompra.push(nuevoProducto);
        }

        actualizarTablaProductos();
        limpiarFormularioProducto();
    }

    // Actualizar tabla de productos
    function actualizarTablaProductos() {
        console.log('Actualizando tabla de productos');
        if (elements.tablaProductos) {
            const tbody = elements.tablaProductos.querySelector('tbody') || elements.tablaProductos;
            tbody.innerHTML = '';
            productosCompra.forEach((producto, indice) => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${producto.cantidad}</td>
                    <td>${producto.unidad}</td>
                    <td>${producto.nombre}</td>
                    <td class="texto-derecha">$${producto.precioCompraTotal.toFixed(2)}</td>
                    <td class="texto-derecha">$${producto.precioUnitarioFinal.toFixed(2)}</td>
                    <td class="texto-derecha">
                        <button class="btn btn-fantasma" onclick="editarProducto(${indice})">Editar</button>
                        <button class="btn btn-fantasma" onclick="eliminarProducto(${indice})">Eliminar</button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        }
        calcularTotales();
    }

    // Limpiar formulario de producto
    function limpiarFormularioProducto() {
        elements.inputBusquedaProducto.value = '';
        elements.inputCantidad.value = '';
        elements.inputPrecioCompraTotal.value = '';
        elements.divResultadosBusqueda.innerHTML = '';
    }

    // Calcular totales
    function calcularTotales() {
        console.log('Calculando totales');
        const subtotal = productosCompra.reduce((sum, item) => sum + item.precioCompraTotal, 0);
        const impuesto = parseFloat(elements.inputImpuesto.value) || 0;
        const valorImpuesto = subtotal * (impuesto / 100);
        const total = subtotal + valorImpuesto;

        elements.spanSubtotal.textContent = `$${subtotal.toFixed(2)}`;
        elements.spanValorImpuesto.textContent = `$${valorImpuesto.toFixed(2)}`;
        elements.spanTotal.textContent = `$${total.toFixed(2)}`;
    }

    // Guardar compra
    function guardarCompra() {
        console.log('Guardando compra');
        if (!elements.selectProveedor.value || productosCompra.length === 0) {
            alert('Por favor, seleccione un proveedor y agregue al menos un producto');
            return;
        }

        const compra = {
            proveedor: elements.selectProveedor.value,
            productos: productosCompra,
            subtotal: parseFloat(elements.spanSubtotal.textContent.slice(1)),
            impuesto: parseFloat(elements.spanValorImpuesto.textContent.slice(1)),
            total: parseFloat(elements.spanTotal.textContent.slice(1)),
            observaciones: document.getElementById('observaciones')?.value || '',
            fecha: new Date().toISOString()
        };

        console.log('Compra a guardar:', compra);
        alert('Compra guardada con éxito');
        cerrarFormulario();
    }

    // Cerrar formulario
    function cerrarFormulario() {
        console.log('Cerrando formulario');
        const contenedor = document.getElementById('contenedorFormularioCompra');
        if (contenedor) {
            contenedor.style.display = 'none';
        }
        document.getElementById('modulo-compras')?.classList.remove('formulario-activo');
    }

    // Event Listeners
    function setupEventListeners() {
        console.log('Configurando event listeners');
        elements.inputBusquedaProducto?.addEventListener('input', buscarProductos);
        elements.btnAgregarProducto?.addEventListener('click', agregarOEditarProducto);
        elements.inputImpuesto?.addEventListener('input', calcularTotales);
        elements.btnGuardarCompra?.addEventListener('click', guardarCompra);
        elements.btnCerrarFormulario?.addEventListener('click', cerrarFormulario);
    }

    // Inicialización
    function init() {
        console.log('Inicializando formulario de compra');
        cargarProveedores();
        setupEventListeners();
        console.log('Formulario de compra inicializado');
    }

    // Exponer funciones al ámbito global
    window.editarProducto = function(indice) {
        console.log('Editando producto en índice:', indice);
        const producto = productosCompra[indice];
        elements.inputBusquedaProducto.value = producto.nombre;
        elements.inputCantidad.value = producto.cantidad;
        elements.inputPrecioCompraTotal.value = producto.precioCompraTotal;
        indiceEditando = indice;
        elements.btnAgregarProducto.textContent = 'Actualizar';
    };

    window.eliminarProducto = function(indice) {
        console.log('Eliminando producto en índice:', indice);
        productosCompra.splice(indice, 1);
        actualizarTablaProductos();
    };

    // Iniciar
    init();
}

// Lógica de inicialización
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciarFormularioCompra);
} else {
    iniciarFormularioCompra();
}

console.log('Archivo formulario-compra.js cargado completamente');