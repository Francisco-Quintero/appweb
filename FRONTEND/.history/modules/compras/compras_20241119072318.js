// Módulo de Compras utilizando patrón IIFE para encapsulamiento
const ModuloCompras = (function() {
    // Estado interno del módulo
    let initialized = false;
    let elementos = null;
    
    // Datos de la aplicación
    const comprasData = [];
    const proveedores = [
        { id: 1, nombre: "Alqueria", numeroContacto: 3502874505, frecuenciaAbastecimiento: 2 },
        { id: 2, nombre: "Colanta", numeroContacto: 3205689480, frecuenciaAbastecimiento: 3 },
    ];
    const productos = [
        { 
            id: 1, 
            nombre: "Leche", 
            descripcion: "Leche entera", 
            categoria: "Lácteos",
            variantes: [
                { id: 1, descripcion: "900ml", unidadMedida: "ml", valorMedida: 900, precioUnitario: 20000 },
                { id: 2, descripcion: "1.1L", unidadMedida: "L", valorMedida: 1.1, precioUnitario: 24000 }
            ]
        },
        { 
            id: 2, 
            nombre: "Queso crema", 
            descripcion: "Queso crema untable", 
            categoria: "Lácteos",
            variantes: [
                { id: 3, descripcion: "70g", unidadMedida: "g", valorMedida: 70, precioUnitario: 15900 },
                { id: 4, descripcion: "150g", unidadMedida: "g", valorMedida: 150, precioUnitario: 28000 }
            ]
        },
    ];
    let variantesSeleccionadas = [];

    // Función para verificar y obtener elementos del DOM
    function inicializarElementos() {
        try {
            elementos = {
                btnNuevaCompra: document.querySelector('#btnNuevaCompra'),
                btnCerrarFormulario: document.querySelector('#btnCerrarFormulario'),
                btnAgregarVariante: document.querySelector('#btnAgregarVariante'),
                btnGuardarCompra: document.querySelector('#btnGuardarCompra'),
                busquedaProducto: document.querySelector('#busquedaProducto'),
                modalFormulario: document.querySelector('#modalFormulario'),
                proveedor: document.querySelector('#proveedor'),
                observaciones: document.querySelector('#observaciones'),
                cuerpoTablaCompras: document.querySelector('#cuerpoTablaCompras'),
                tablaVariantes: document.querySelector('#tablaVariantes'),
                resultadosBusqueda: document.querySelector('#resultadosBusqueda'),
                variantesContainer: document.querySelector('#variantesContainer'),
                total: document.querySelector('#total')
            };

            // Verificar que todos los elementos existan
            for (const [key, element] of Object.entries(elementos)) {
                if (!element) {
                    throw new Error(`Elemento no encontrado: ${key}`);
                }
            }

            return true;
        } catch (error) {
            console.error('Error al inicializar elementos:', error);
            return false;
        }
    }

    // Función para inicializar event listeners
    function inicializarEventListeners() {
        elementos.btnNuevaCompra.addEventListener('click', mostrarFormularioCompra);
        elementos.btnCerrarFormulario.addEventListener('click', cerrarFormularioCompra);
        elementos.btnAgregarVariante.addEventListener('click', () => mostrarSeleccionVariante(productos[0]));
        elementos.btnGuardarCompra.addEventListener('click', guardarCompra);
        elementos.busquedaProducto.addEventListener('input', buscarProductos);
    }

    // Funciones principales del módulo
    function mostrarFormularioCompra() {
        elementos.modalFormulario.style.display = 'block';
    }

    function cerrarFormularioCompra() {
        elementos.modalFormulario.style.display = 'none';
        limpiarFormulario();
    }

    function limpiarFormulario() {
        elementos.proveedor.value = '';
        elementos.busquedaProducto.value = '';
        elementos.observaciones.value = '';
        variantesSeleccionadas = [];
        actualizarTablaVariantes();
    }

    function cargarProveedores() {
        elementos.proveedor.innerHTML = '<option value="">Seleccione un proveedor</option>';
        proveedores.forEach(proveedor => {
            const option = document.createElement('option');
            option.value = proveedor.id;
            option.textContent = `${proveedor.nombre} (Freq: ${proveedor.frecuenciaAbastecimiento})`;
            elementos.proveedor.appendChild(option);
        });
    }

    function cargarCompras() {
        elementos.cuerpoTablaCompras.innerHTML = '';
        comprasData.forEach(compra => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${compra.id}</td>
                <td>${compra.fecha}</td>
                <td>${compra.proveedor}</td>
                <td>$${compra.total.toFixed(2)}</td>
                <td>${compra.estado}</td>
                <td>
                    <button onclick="ModuloCompras.verDetallesCompra(${compra.id})" class="btn btn-secundario">
                        Ver más
                    </button>
                </td>
            `;
            elementos.cuerpoTablaCompras.appendChild(fila);
        });
    }

    function buscarProductos() {
        const termino = elementos.busquedaProducto.value.toLowerCase();
        const resultados = productos.filter(producto =>
            producto.nombre.toLowerCase().includes(termino) ||
            producto.descripcion.toLowerCase().includes(termino)
        );
        mostrarResultadosBusqueda(resultados);
    }

    function mostrarResultadosBusqueda(resultados) {
        elementos.resultadosBusqueda.innerHTML = '';
        resultados.forEach(producto => {
            const div = document.createElement('div');
            div.textContent = `${producto.nombre} - ${producto.descripcion}`;
            div.onclick = () => seleccionarProducto(producto);
            elementos.resultadosBusqueda.appendChild(div);
        });
    }

    function seleccionarProducto(producto) {
        elementos.busquedaProducto.value = producto.nombre;
        elementos.resultadosBusqueda.innerHTML = '';
        mostrarSeleccionVariante(producto);
    }

    function mostrarSeleccionVariante(producto) {
        elementos.variantesContainer.innerHTML = '';
        producto.variantes.forEach(variante => {
            const div = document.createElement('div');
            div.className = 'variante-item';
            div.innerHTML = `
                <p>${variante.descripcion}</p>
                <p>Precio: $${variante.precioUnitario}</p>
                <input type="number" min="1" value="1" id="cantidad-${variante.id}">
                <button class="btn btn-primario" onclick="ModuloCompras.agregarVariante(${variante.id}, ${producto.id})">
                    Agregar
                </button>
            `;
            elementos.variantesContainer.appendChild(div);
        });
    }

    function agregarVariante(varianteId, productoId) {
        const producto = productos.find(p => p.id === productoId);
        const variante = producto.variantes.find(v => v.id === varianteId);
        const cantidad = parseInt(document.getElementById(`cantidad-${varianteId}`).value);

        variantesSeleccionadas.push({
            productoId,
            productoNombre: producto.nombre,
            varianteId,
            varianteDescripcion: variante.descripcion,
            cantidad,
            precioUnitario: variante.precioUnitario,
            subtotal: cantidad * variante.precioUnitario
        });

        actualizarTablaVariantes();
    }

    function actualizarTablaVariantes() {
        const tbody = elementos.tablaVariantes.querySelector('tbody');
        tbody.innerHTML = '';
        variantesSeleccionadas.forEach((item, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${item.productoNombre}</td>
                <td>${item.varianteDescripcion}</td>
                <td>${item.cantidad}</td>
                <td>$${item.precioUnitario.toFixed(2)}</td>
                <td>$${item.subtotal.toFixed(2)}</td>
                <td>
                    <button onclick="ModuloCompras.eliminarVariante(${index})" class="btn btn-peligro">
                        Eliminar
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
        actualizarTotal();
    }

    function actualizarTotal() {
        const total = variantesSeleccionadas.reduce((sum, item) => sum + item.subtotal, 0);
        elementos.total.textContent = `$${total.toFixed(2)}`;
    }

    function eliminarVariante(index) {
        variantesSeleccionadas.splice(index, 1);
        actualizarTablaVariantes();
    }

    function guardarCompra() {
        const proveedorId = elementos.proveedor.value;
        if (!proveedorId || variantesSeleccionadas.length === 0) {
            alert('Por favor, seleccione un proveedor y agregue al menos una variante de producto');
            return;
        }

        const proveedorSeleccionado = proveedores.find(p => p.id == proveedorId);
        proveedorSeleccionado.frecuenciaAbastecimiento++;

        const compra = {
            id: comprasData.length + 1,
            fecha: new Date().toISOString().split('T')[0],
            proveedor: proveedorSeleccionado.nombre,
            variantes: variantesSeleccionadas,
            total: variantesSeleccionadas.reduce((sum, item) => sum + item.subtotal, 0),
            observaciones: elementos.observaciones.value,
            estado: 'Pendiente'
        };

        comprasData.push(compra);
        cargarCompras();
        cerrarFormularioCompra();
        alert('Compra guardada con éxito');
    }

    function verDetallesCompra(id) {
        const compra = comprasData.find(c => c.id === id);
        if (!compra) return;

        let detallesHTML = `
            <h4>Compra #${compra.id}</h4>
            <p><strong>Fecha:</strong> ${compra.fecha}</p>
            <p><strong>Proveedor:</strong> ${compra.proveedor}</p>
            <p><strong>Total:</strong> $${compra.total.toFixed(2)}</p>
            <p><strong>Estado:</strong> ${compra.estado}</p>
            <h5>Productos:</h5>
            <ul>
        `;

        compra.variantes.forEach(v => {
            detallesHTML += `<li>${v.cantidad} ${v.varianteDescripcion} de ${v.productoNombre} - $${v.subtotal.toFixed(2)}</li>`;
        });

        detallesHTML += `
            </ul>
            <p><strong>Observaciones:</strong> ${compra.observaciones || 'N/A'}</p>
        `;

        alert(detallesHTML); // Temporal, idealmente usar un modal
    }

    // Función de inicialización principal
    function inicializar() {
        if (initialized) {
            console.warn('El módulo de compras ya está inicializado');
            return;
        }

        console.log('Inicializando módulo de compras...');

        if (!inicializarElementos()) {
            console.error('No se pudo inicializar el módulo de compras');
            return;
        }

        try {
            inicializarEventListeners();
            cargarProveedores();
            cargarCompras();
            initialized = true;
            console.log('Módulo de compras inicializado correctamente');
        } catch (error) {
            console.error('Error al inicializar el módulo de compras:', error);
        }
    }

    // API pública del módulo
    return {
        inicializar,
        agregarVariante,
        eliminarVariante,
        verDetallesCompra
    };
})();

// Inicializar el módulo cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    ModuloCompras.inicializar();
});