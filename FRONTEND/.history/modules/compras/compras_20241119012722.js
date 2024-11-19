if (!window.moduloCompras) {

    const moduloCompras = (function() {
        
    let comprasData = [];
    let proveedores = [];
    let productos = [];
    let variantes = [];
    let productosCompra = [];
    let indiceEditando = null;

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
        comprasData = window.datosGlobales.compras || [];
        proveedores = window.datosGlobales.proveedores || [];
        productos = window.datosGlobales.productos || [];
        variantes = window.datosGlobales.variantes || [];
        cargarCompras();
        cargarProveedores();
    }

    function configurarEventListeners() {
        document.getElementById('btnNuevaCompra')?.addEventListener('click', mostrarFormularioCompra);
        document.getElementById('btnBuscar')?.addEventListener('click', buscarCompras);
        document.getElementById('btnCerrarModal')?.addEventListener('click', cerrarModal);
        document.getElementById('btnCerrarFormulario')?.addEventListener('click', cerrarFormularioCompra);
        document.getElementById('btnAgregarProducto')?.addEventListener('click', agregarOEditarProducto);
        document.getElementById('btnGuardarCompra')?.addEventListener('click', guardarCompra);
        document.getElementById('busquedaProducto')?.addEventListener('input', buscarProductos);
        document.getElementById('impuesto')?.addEventListener('input', calcularTotales);

        const busquedaProducto = document.getElementById('busquedaProducto');
    if (busquedaProducto) {
        busquedaProducto.addEventListener('focus', function() {
            this.readOnly = false;
        });
        
        busquedaProducto.addEventListener('input', function() {
            if (this.value.length > 0) {
                buscarProductos();
            } else {
                document.getElementById('resultadosBusqueda').innerHTML = '';
            }
        });
        
        // Cerrar resultados al hacer clic fuera
        document.addEventListener('click', function(e) {
            if (!busquedaProducto.contains(e.target) && 
                !document.getElementById('resultadosBusqueda').contains(e.target)) {
                document.getElementById('resultadosBusqueda').innerHTML = '';
            }
        });
    }
    }

    function cargarCompras() {
        const cuerpoTabla = document.getElementById('cuerpoTablaCompras');
        const comprasEmpty = document.getElementById('compras-empty');
        
        if (!cuerpoTabla) {
            console.error('No se encontró el elemento cuerpoTablaCompras');
            return;
        }

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
                <td><span class="estado-compra estado-${compra.estado.toLowerCase()}">${compra.estado}</span></td>
                <td><button onclick="moduloCompras.verDetallesCompra(${compra.id})" class="btn btn-secundario">Ver más</button></td>
            </tr>
        `).join('');
    }

    function cargarProveedores() {
        const selectProveedor = document.getElementById('proveedor');
        if (!selectProveedor) {
            console.error('No se encontró el elemento select de proveedores');
            return;
        }
        selectProveedor.innerHTML = '<option value="">Seleccione un proveedor</option>' + 
            proveedores.map(proveedor => `<option value="${proveedor.id}">${proveedor.nombre}</option>`).join('');
    }

    function mostrarFormularioCompra() {
        document.getElementById('modalFormulario').style.display = 'block';
    }

    function cerrarFormularioCompra() {
        document.getElementById('modalFormulario').style.display = 'none';
        limpiarFormularioCompra();
    }

    function limpiarFormularioCompra() {
        document.getElementById('formularioCompra').reset();
        productosCompra = [];
        indiceEditando = null;
        actualizarTablaProductos();
        calcularTotales();
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

   /* function agregarOEditarProducto() {
        const busquedaInput = document.getElementById('busquedaProducto');
        const productoId = busquedaInput.dataset.productoId;
        const varianteId = busquedaInput.dataset.varianteId;
        const cantidad = parseInt(document.getElementById('cantidad').value);
        const precioCompraTotal = parseFloat(document.getElementById('precioCompraTotal').value);

        if (!productoId || !varianteId || isNaN(cantidad) || isNaN(precioCompraTotal)) {
            alert('Por favor, complete todos los campos correctamente');
            return;
        }

        const producto = productos.find(p => p.idProducto === parseInt(productoId));
        const variante = variantes.find(v => v.id_variante === parseInt(varianteId));

        if (!producto || !variante) {
            alert('Producto o variante no encontrado');
            return;
        }

        const precioCompraUnitario = precioCompraTotal / cantidad;
        const impuesto = parseFloat(document.getElementById('impuesto').value) || 0;
        const precioConIva = precioCompraUnitario * (1 + impuesto / 100);
        const precioUnitarioFinal = precioConIva * 1.2; // 20% de ganancia

        const nuevoProducto = {
            idProducto: producto.idProducto,
            idVariante: variante.id_variante,
            nombre: producto.Nombre,
            descripcionVariante: variante.descripcion,
            unidad: variante.unidad_medida,
            valorMedida: variante.valor_medida,
            cantidad: cantidad,
            precioCompraTotal: precioCompraTotal,
            precioUnitarioFinal: precioUnitarioFinal
        };

        if (indiceEditando !== null) {
            productosCompra[indiceEditando] = nuevoProducto;
            indiceEditando = null;
            document.getElementById('btnAgregarProducto').textContent = 'Agregar Producto';
        } else {
            productosCompra.push(nuevoProducto);
        }

        actualizarTablaProductos();
        limpiarFormularioProducto();
    }  */

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
        document.getElementById('cantidad').value = '';
        document.getElementById('precioCompraTotal').value = '';
        document.getElementById('resultadosBusqueda').innerHTML = '';
    }

    

    function calcularTotales() {
        const subtotal = productosCompra.reduce((sum, item) => sum + item.precioCompraTotal, 0);
        const impuesto = parseFloat(document.getElementById('impuesto').value) || 0;
        const valorImpuesto = subtotal * (impuesto / 100);
        const total = subtotal + valorImpuesto;

        document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
        document.getElementById('valorImpuesto').textContent = `$${valorImpuesto.toFixed(2)}`;
        document.getElementById('total').textContent = `$${total.toFixed(2)}`;
    }

    function guardarCompra() {
        const proveedor = document.getElementById('proveedor').value;
        if (!proveedor || productosCompra.length === 0) {
            alert('Por favor, seleccione un proveedor y agregue al menos un producto');
            return;
        }

        const compra = {
            id: comprasData.length + 1,
            fecha: new Date().toISOString().split('T')[0],
            idProveedor: parseInt(proveedor),
            proveedor: proveedores.find(p => p.id == proveedor).nombre,
            productos: productosCompra.map(p => ({
                ...p,
                fechaSuministro: new Date().toISOString(),
                estado: 'Pendiente'
            })),
            subtotal: parseFloat(document.getElementById('subtotal').textContent.slice(1)),
            impuesto: parseFloat(document.getElementById('valorImpuesto').textContent.slice(1)),
            total: parseFloat(document.getElementById('total').textContent.slice(1)),
            observaciones: document.getElementById('observaciones').value,
            estado: 'Pendiente'
        };

        comprasData.push(compra);
        
        if (window.datosGlobales) {
            window.datosGlobales.compras = comprasData;
            guardarEnLocalStorage();
        }

        cargarCompras();
        cerrarFormularioCompra();
        alert('Compra guardada con éxito');
    }

    function buscarCompras() {
        const termino = document.getElementById('busquedaCompra').value.toLowerCase();
        const comprasFiltradas = comprasData.filter(c => 
            c.proveedor.toLowerCase().includes(termino) ||
            c.fecha.includes(termino) ||
            c.estado.toLowerCase().includes(termino)
        );
        
        cargarCompras(comprasFiltradas);
    }

    function verDetallesCompra(id) {
        const compra = comprasData.find(c => c.id === id);
        if (!compra) {
            console.error(`No se encontró la compra con id ${id}`);
            return;
        }

        const detallesCompra = document.getElementById('detallesCompra');
        detallesCompra.innerHTML = `
            <h4>Compra #${compra.id}</h4>
            <p><strong>Fecha:</strong> ${compra.fecha}</p>
            <p><strong>Proveedor:</strong> ${compra.proveedor}</p>
            <p><strong>Total:</strong> $${compra.total.toFixed(2)}</p>
            <p><strong>Estado:</strong> ${compra.estado}</p>
            <h5>Productos:</h5>
            <ul>
                ${compra.productos.map(p => `
                    <li>${p.cantidad} ${p.unidad} de ${p.nombre} - ${p.descripcionVariante} - $${p.precioCompraTotal.toFixed(2)}</li>
                `).join('')}
            </ul>
            <p><strong>Observaciones:</strong> ${compra.observaciones || 'N/A'}</p>
        `;

        document.getElementById('modalCompra').style.display = 'block';
    }

    function cerrarModal() {
        document.getElementById('modalCompra').style.display = 'none';
    }

    function editarProducto(indice) {
        const producto = productosCompra[indice];
        document.getElementById('busquedaProducto').value = `${producto.nombre} - ${producto.descripcionVariante}`;
        document.getElementById('cantidad').value = producto.cantidad;
        document.getElementById('precioCompraTotal').value = producto.precioCompraTotal;
        indiceEditando = indice;
        document.getElementById('btnAgregarProducto').textContent = 'Actualizar Producto';
    }

    function eliminarProducto(indice) {
        productosCompra.splice(indice, 1);
        actualizarTablaProductos();
    }

    function guardarEnLocalStorage() {
        localStorage.setItem('datosGlobales', JSON.stringify(window.datosGlobales));
    }

    return {
        inicializar,
        verDetallesCompra,
        editarProducto,
        eliminarProducto,
        seleccionarProducto
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
