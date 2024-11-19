// Envolvemos todo el código en una IIFE (Immediately Invoked Function Expression)
(function() {
    // Esperamos a que el DOM esté completamente cargado
    document.addEventListener('DOMContentLoaded', function() {
        // Verificamos que todos los elementos necesarios existan
        const elementos = {
            btnNuevaCompra: document.getElementById('btnNuevaCompra'),
            btnCerrarFormulario: document.getElementById('btnCerrarFormulario'),
            btnAgregarVariante: document.getElementById('btnAgregarVariante'),
            btnGuardarCompra: document.getElementById('btnGuardarCompra'),
            busquedaProducto: document.getElementById('busquedaProducto'),
            modalFormulario: document.getElementById('modalFormulario'),
            proveedor: document.getElementById('proveedor'),
            observaciones: document.getElementById('observaciones'),
            cuerpoTablaCompras: document.getElementById('cuerpoTablaCompras'),
            tablaVariantes: document.getElementById('tablaVariantes'),
            resultadosBusqueda: document.getElementById('resultadosBusqueda'),
            variantesContainer: document.getElementById('variantesContainer')
        };

        // Verificamos que todos los elementos existan antes de continuar
        for (const [key, element] of Object.entries(elementos)) {
            if (!element) {
                console.error(`Error: No se encontró el elemento ${key}`);
                return; // Salimos si falta algún elemento
            }
        }

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

        // Event Listeners
        elementos.btnNuevaCompra.addEventListener('click', mostrarFormularioCompra);
        elementos.btnCerrarFormulario.addEventListener('click', cerrarFormularioCompra);
        elementos.btnAgregarVariante.addEventListener('click', () => mostrarSeleccionVariante(productos[0])); // Default to first product
        elementos.btnGuardarCompra.addEventListener('click', guardarCompra);
        elementos.busquedaProducto.addEventListener('input', buscarProductos);

        // Inicialización
        cargarProveedores();
        cargarCompras();

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
                        <button onclick="verDetallesCompra(${compra.id})" class="btn btn-secundario">Ver más</button>
                    </td>
                `;
                elementos.cuerpoTablaCompras.appendChild(fila);
            });
        }

        function mostrarFormularioCompra() {
            elementos.modalFormulario.style.display = 'block';
        }

        function cerrarFormularioCompra() {
            elementos.modalFormulario.style.display = 'none';
            limpiarFormulario();
        }

        function limpiarFormulario() {
            document.getElementById('formularioCompra').reset();
            variantesSeleccionadas = [];
            actualizarTablaVariantes();
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
                    <button class="btn btn-primario" onclick="agregarVariante(${JSON.stringify(variante).replace(/"/g, '&quot;')}, ${producto.id})">
                        Agregar
                    </button>
                `;
                elementos.variantesContainer.appendChild(div);
            });
        }

        // Funciones globales necesarias
        window.agregarVariante = function(variante, productoId) {
            const cantidad = parseInt(document.getElementById(`cantidad-${variante.id}`).value);
            const producto = productos.find(p => p.id === productoId);
            variantesSeleccionadas.push({
                productoId: productoId,
                productoNombre: producto.nombre,
                varianteId: variante.id,
                varianteDescripcion: variante.descripcion,
                cantidad: cantidad,
                precioUnitario: variante.precioUnitario,
                subtotal: cantidad * variante.precioUnitario
            });
            actualizarTablaVariantes();
        };

        window.eliminarVariante = function(index) {
            variantesSeleccionadas.splice(index, 1);
            actualizarTablaVariantes();
        };

        window.verDetallesCompra = function(id) {
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

            alert(detallesHTML); // Temporal, deberías usar un modal real
        };

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
                        <button onclick="eliminarVariante(${index})" class="btn btn-peligro">Eliminar</button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
            actualizarTotal();
        }

        function actualizarTotal() {
            const total = variantesSeleccionadas.reduce((sum, item) => sum + item.subtotal, 0);
            document.getElementById('total').textContent = `$${total.toFixed(2)}`;
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
    });
})();