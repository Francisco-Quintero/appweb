if (!window.moduloCompras) {

    // Only declare if it doesn't exist
    const moduloCompras = (function() {
        let productosCompra = [];
        let proveedores = [];
        let productos = [];
        let variantes = [];
        
        function inicializar() {
            console.log('Iniciando carga del módulo de compras');
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', cargarModulo);
            } else {
                cargarModulo();
            }
        }
        
        function cargarModulo() {
            if (typeof window.datosGlobales === 'undefined') {
                console.error('datosGlobales no está definido. Asegúrate de que datosGlobales.js se carga antes que compras.js');
                return;
            }
            cargarDatosIniciales();
            configurarEventListeners();
        }
        
        function cargarDatosIniciales() {
            proveedores = window.datosGlobales.proveedores || [];
            productos = window.datosGlobales.productos || [];
            variantes = window.datosGlobales.variantes || [];
            cargarProveedores();
        }
        
        function configurarEventListeners() {
            document.getElementById('busquedaProducto').addEventListener('input', buscarProductos);
            document.getElementById('btnAgregarProducto').addEventListener('click', agregarProductoALista);
            document.getElementById('resultadosBusqueda').addEventListener('click', seleccionarProducto);
        }
        
        function buscarProductos() {
            const termino = document.getElementById('busquedaProducto').value.toLowerCase();
            const resultados = productos.filter(producto =>
                producto.Nombre.toLowerCase().includes(termino) ||
                producto.Descripcion?.toLowerCase().includes(termino)
            );
            mostrarResultadosBusqueda(resultados);
        }
        
        function mostrarResultadosBusqueda(resultados) {
            const divResultados = document.getElementById('resultadosBusqueda');
            divResultados.innerHTML = resultados.map(producto => `
                <div class="producto-resultado" data-id-producto="${producto.idProducto}">
                    <strong>${producto.Nombre}</strong>
                    <div class="variantes-lista">
                        ${variantes
                            .filter(v => v.id_producto === producto.idProducto)
                            .map(variante => `
                                <div class="variante-item" data-id-variante="${variante.id_variante}">
                                    ${variante.descripcion} - ${variante.unidad_medida}
                                </div>
                            `).join('')}
                    </div>
                </div>
            `).join('');
        }
        
        function seleccionarProducto(event) {
            const varianteItem = event.target.closest('.variante-item');
            if (!varianteItem) return;
        
            const productoItem = varianteItem.closest('.producto-resultado');
            const idProducto = parseInt(productoItem.dataset.idProducto);
            const idVariante = parseInt(varianteItem.dataset.idVariante);
        
            const producto = productos.find(p => p.idProducto === idProducto);
            const variante = variantes.find(v => v.id_variante === idVariante);
        
            if (!producto || !variante) {
                console.error('Producto o variante no encontrado');
                return;
            }
        
            document.getElementById('busquedaProducto').value = `${producto.Nombre} - ${variante.descripcion}`;
            document.getElementById('unidadMedida').value = variante.unidad_medida;
            document.getElementById('cantidad').value = '';
            document.getElementById('precioCompraTotal').value = '';
        
            document.getElementById('cantidad').disabled = false;
            document.getElementById('precioCompraTotal').disabled = false;
            document.getElementById('btnAgregarProducto').disabled = false;
        
            document.getElementById('busquedaProducto').dataset.idProducto = idProducto;
            document.getElementById('busquedaProducto').dataset.idVariante = idVariante;
        
            document.getElementById('resultadosBusqueda').innerHTML = '';
        }
        
        function agregarProductoALista() {
            const idProducto = parseInt(document.getElementById('busquedaProducto').dataset.idProducto);
            const idVariante = parseInt(document.getElementById('busquedaProducto').dataset.idVariante);
            const cantidad = parseInt(document.getElementById('cantidad').value);
            const precioCompraTotal = parseFloat(document.getElementById('precioCompraTotal').value);
        
            if (!idProducto || !idVariante || isNaN(cantidad) || isNaN(precioCompraTotal)) {
                alert('Por favor, complete todos los campos correctamente');
                return;
            }
        
            const producto = productos.find(p => p.idProducto === idProducto);
            const variante = variantes.find(v => v.id_variante === idVariante);
        
            if (!producto || !variante) {
                alert('Producto o variante no encontrado');
                return;
            }
        
            const nuevoProducto = {
                idProducto: producto.idProducto,
                idVariante: variante.id_variante,
                nombre: producto.Nombre,
                descripcionVariante: variante.descripcion,
                unidad: variante.unidad_medida,
                cantidad: cantidad,
                precioCompraTotal: precioCompraTotal,
                precioUnitario: precioCompraTotal / cantidad
            };
        
            productosCompra.push(nuevoProducto);
            actualizarTablaProductos();
            limpiarFormularioProducto();
        }
        
        function actualizarTablaProductos() {
            const tbody = document.querySelector('#tablaProductos tbody');
            tbody.innerHTML = productosCompra.map((producto, index) => `
                <tr>
                    <td>${producto.cantidad}</td>
                    <td>${producto.unidad}</td>
                    <td>${producto.nombre} - ${producto.descripcionVariante}</td>
                    <td>$${producto.precioCompraTotal.toFixed(2)}</td>
                    <td>$${producto.precioUnitario.toFixed(2)}</td>
                    <td>
                        <button onclick="editarProducto(${index})" class="btn btn-secundario">Editar</button>
                        <button onclick="eliminarProducto(${index})" class="btn btn-peligro">Eliminar</button>
                    </td>
                </tr>
            `).join('');
            calcularTotales();
        }
        
        function limpiarFormularioProducto() {
            document.getElementById('busquedaProducto').value = '';
            document.getElementById('unidadMedida').value = '';
            document.getElementById('cantidad').value = '';
            document.getElementById('precioCompraTotal').value = '';
            document.getElementById('cantidad').disabled = true;
            document.getElementById('precioCompraTotal').disabled = true;
            document.getElementById('btnAgregarProducto').disabled = true;
            delete document.getElementById('busquedaProducto').dataset.idProducto;
            delete document.getElementById('busquedaProducto').dataset.idVariante;
        }
        
        function calcularTotales() {
            const subtotal = productosCompra.reduce((sum, producto) => sum + producto.precioCompraTotal, 0);
            const impuesto = parseFloat(document.getElementById('impuesto').value) || 0;
            const total = subtotal * (1 + impuesto / 100);
        
            document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
            document.getElementById('total').textContent = `$${total.toFixed(2)}`;
        }
        
        function editarProducto(index) {
            const producto = productosCompra[index];
            document.getElementById('busquedaProducto').value = `${producto.nombre} - ${producto.descripcionVariante}`;
            document.getElementById('unidadMedida').value = producto.unidad;
            document.getElementById('cantidad').value = producto.cantidad;
            document.getElementById('precioCompraTotal').value = producto.precioCompraTotal;
            document.getElementById('busquedaProducto').dataset.idProducto = producto.idProducto;
            document.getElementById('busquedaProducto').dataset.idVariante = producto.idVariante;
            document.getElementById('cantidad').disabled = false;
            document.getElementById('precioCompraTotal').disabled = false;
            document.getElementById('btnAgregarProducto').disabled = false;
            productosCompra.splice(index, 1);
            actualizarTablaProductos();
        }
        
        function eliminarProducto(index) {
            productosCompra.splice(index, 1);
            actualizarTablaProductos();
        }
        
        // Exponer funciones necesarias
        return {
            inicializar,
            seleccionarProducto,
            agregarProductoALista,
            editarProducto,
            eliminarProducto
        };

    
})();

window.moduloCompras = moduloCompras;
}
// Y esta línea al final del archivo, fuera de la definición del módulo
window.moduloCompras.seleccionarProducto = moduloCompras.seleccionarProducto;
window.verDetallesCompra = moduloCompras.verDetallesCompra.bind(moduloCompras);
window.editarProducto = moduloCompras.editarProducto.bind(moduloCompras);
window.eliminarProducto = moduloCompras.eliminarProducto.bind(moduloCompras);
window.seleccionarProducto = moduloCompras.seleccionarProducto.bind(moduloCompras);
