// En modules/compras/compras.js
(function() {
    console.log('Iniciando carga del módulo de compras');

    let productos = [];
    let proveedores = [];
    let compras = [];
    let indiceEditando = null;

    function cargarDatosDesdeLocalStorage() {
        try {
            const datosGuardados = JSON.parse(localStorage.getItem('datosGlobales') || '{}');
            productos = datosGuardados.productos || [];
            proveedores = datosGuardados.proveedores || [];
            compras = datosGuardados.compras || [];
            console.log('Datos cargados desde localStorage');
        } catch (error) {
            console.error('Error al cargar datos desde localStorage:', error);
        }
    }

    function guardarEnLocalStorage() {
        try {
            const comprasActuales = JSON.parse(localStorage.getItem('datosGlobales') || '{}');
            comprasActuales.compras = compras;
            localStorage.setItem('datosGlobales', JSON.stringify(comprasActuales));
            console.log('Compras guardadas en localStorage');
        } catch (error) {
            console.error('Error al guardar en localStorage:', error);
        }
    }
    
    function sincronizarConDatosGlobales() {
        if (window.datosGlobales) {
            if (Array.isArray(window.datosGlobales.productos)) {
                productos = window.datosGlobales.productos;
            }
            if (Array.isArray(window.datosGlobales.proveedores)) {
                proveedores = window.datosGlobales.proveedores;
            }
            if (Array.isArray(window.datosGlobales.compras)) {
                compras = window.datosGlobales.compras;
            }
            cargarCompras();
            console.log('Datos sincronizados con datosGlobales');
        }
    }

    function cargarCompras() { //el que estaba
        console.log('Cargando compras en la tabla');
        const comprasEmpty = document.getElementById('compras-empty');
        const cuerpoTabla = document.getElementById('cuerpoTablaCompras');

        
        if (!cuerpoTabla) {
           console.error('No se encontró el elemento cuerpoTablaCompras');
           return;
        }
        if (comprasEmpty) {
            comprasEmpty.style.display = 'none';
        }

        const contenidoTabla = compras.length === 0
            ? '<tr><td colspan="6" class="text-center">No hay compras registrados. Haga clic en "+" para agregar uno nuevo.</td></tr>'
            : compras.map(compra => {`
            <tr>
                <td>${compra.id}</td>
                <td>${compra.fecha}</td>
                <td>${compra.proveedor}</td>
                <td>${compra.producto}</td>
                <td>$${compra.total.toFixed(2)}</td>
                <td>
                    <span class="estado-compra estado-${compra.estado.toLowerCase()}">
                        ${compra.estado}
                    </span>
                </td>
                <td>
                    <button onclick="window.verDetallesCompra(${compra.id})" class="btn btn-secundario">
                        <i data-lucide="eye"></i>
                        Ver más
                    </button>
                </td>
            </tr>

        // Reinicializar los iconos de Lucide
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        
        console.log('Compras cargadas en la tabla');
    }

    function cargarProveedores() {
        c
        `}).join('');
        console.log('Cargando proveedores');
        const selectProveedor = document.getElementById('proveedor');
        if (!selectProveedor) {
            console.error('No se encontró el elemento select de proveedores');
            return;
        }
        selectProveedor.innerHTML = '<option value="">Seleccione un proveedor</option>';
        proveedores.forEach(proveedor => {
            const option = document.createElement('option');
            option.value = proveedor.id;
            option.textContent = proveedor.nombre;
            selectProveedor.appendChild(option);
        });
        console.log('Proveedores cargados en el select');
    }

    function initProductos() {
        console.log('Inicializando módulo de productos');
        cargarDatosDesdeLocalStorage();
        cargarProductos();
        configurarEventListeners();
        
        window.addEventListener('datosGlobalesListo', sincronizarConDatosGlobales);
        
        if (window.datosGlobales) {
            sincronizarConDatosGlobales();
        }
        
        console.log('Módulo de productos cargado completamente');
    }

    function configurarEventListeners()


    function initCompras() {
        console.log('Inicializando módulo de compras');
        
        // Cargar datos iniciales
        cargarDatosDesdeLocalStorage();
        cargarCompras();
        configurarEventListeners();
        sincronizarConDatosGlobales();
    }


    function mostrarFormularioCompra() {
        console.log('Mostrando formulario de compra');
        document.getElementById('modalFormulario').style.display = 'block';
    }

    function cerrarFormularioCompra() {
        console.log('Cerrando formulario de compra');
        document.getElementById('modalFormulario').style.display = 'none';
        limpiarFormularioCompra();
    }

    function limpiarFormularioCompra() {
        console.log('Limpiando formulario de compra');
        document.getElementById('formularioCompra').reset();
        indiceEditando = null;
        actualizarTablaProductos();
        calcularTotales();
    }

    function buscarProductos(termino) {
        console.log('Buscando productos:', termino);
        return productos.filter(producto =>
            producto.nombre.toLowerCase().includes(termino.toLowerCase()) ||
            producto.descripcion.toLowerCase().includes(termino.toLowerCase())
        );
    }

    function mostrarResultadosBusqueda(resultados) {
        console.log('Mostrando resultados de búsqueda');
        const divResultados = document.getElementById('resultadosBusqueda');
        divResultados.innerHTML = '';
        resultados.forEach(producto => {
            const div = document.createElement('div');
            div.textContent = `${producto.nombre} - ${producto.descripcion} - ${producto.unidadMedida} - ${producto.valorMedida}`;
            div.onclick = () => seleccionarProducto(producto);
            divResultados.appendChild(div);
        });
    }

    function seleccionarProducto(producto) {
        console.log('Producto seleccionado:', producto.nombre);
        document.getElementById('busquedaProducto').value = producto.nombre;
        document.getElementById('resultadosBusqueda').innerHTML = '';
    }

    function agregarOEditarProducto() {
        console.log('Agregando o editando producto');
        const nombre = document.getElementById('busquedaProducto').value;
        const cantidad = parseInt(document.getElementById('cantidad').value);
        const precioCompraTotal = parseFloat(document.getElementById('precioCompraTotal').value);

        if (!nombre || isNaN(cantidad) || isNaN(precioCompraTotal)) {
            alert('Por favor, complete todos los campos correctamente');
            return;
        }

        const producto = productos.find(p => p.nombre === nombre);
        if (!producto) {
            alert('Producto no encontrado');
            return;
        }

        const precioCompraUnitario = precioCompraTotal / cantidad;
        const impuesto = parseFloat(document.getElementById('impuesto').value) || 0;
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
            document.getElementById('btnAgregarProducto').textContent = 'Agregar Producto';
        } else {
            productosCompra.push(nuevoProducto);
        }

        actualizarTablaProductos();
        limpiarFormularioProducto();
    }

    // function actualizarTablaProductos() {
    //     console.log('Actualizando tabla de productos');
    //     const tbody = document.querySelector('#tablaProductos tbody');
    //     tbody.innerHTML = '';
    //     compras.forEach((productos, indice) => {
    //         const tr = document.createElement('tr');
    //         tr.innerHTML = `
    //             <td>${productos.cantidad}</td>
    //             <td>${productos.unidadMedida}</td>
    //             <td>${productos.valorMedida}</td>
    //             <td>${productos.nombre}</td>
    //             <td class="texto-derecha">$${productos.precioCompraTotal.toFixed(2)}</td>
    //             <td class="texto-derecha">$${productos.precioUnitarioFinal.toFixed(2)}</td>
    //             <td class="texto-derecha">
    //                 <button onclick="window.editarProducto(${indice})" class="btn btn-secundario">Editar</button>
    //                 <button onclick="window.eliminarProducto(${indice})" class="btn btn-peligro">Eliminar</button>
    //             </td>
    //         `;
    //         tbody.appendChild(tr);
    //     });
    //     calcularTotales();
    // }

    function limpiarFormularioProducto() {
        console.log('Limpiando formulario de producto');
        document.getElementById('busquedaProducto').value = '';
        document.getElementById('cantidad').value = '';
        document.getElementById('precioCompraTotal').value = '';
        document.getElementById('resultadosBusqueda').innerHTML = '';
    }

    function calcularTotales() {
        console.log('Calculando totales');
        const subtotal = productosCompra.reduce((sum, item) => sum + item.precioCompraTotal, 0);
        const impuesto = parseFloat(document.getElementById('impuesto').value) || 0;
        const valorImpuesto = subtotal * (impuesto / 100);
        const total = subtotal + valorImpuesto;

        document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
        document.getElementById('valorImpuesto').textContent = `$${valorImpuesto.toFixed(2)}`;
        document.getElementById('total').textContent = `$${total.toFixed(2)}`;
    }

    function guardarCompra() {
        console.log('Guardando compra');
        const proveedor = document.getElementById('proveedor').value;
        if (!proveedor || productosCompra.length === 0) {
            alert('Por favor, seleccione un proveedor y agregue al menos un producto');
            return;
        }

        const compra = {
            id: comprasData.length + 1,
            fecha: new Date().toISOString().split('T')[0],
            proveedor: proveedores.find(p => p.id == proveedor).nombre,
            productos: productosCompra,
            subtotal: parseFloat(document.getElementById('subtotal').textContent.slice(1)),
            impuesto: parseFloat(document.getElementById('valorImpuesto').textContent.slice(1)),
            total: parseFloat(document.getElementById('total').textContent.slice(1)),
            observaciones: document.getElementById('observaciones').value,
            estado: 'Pendiente'
        };

        comprasData.push(compra);
        cargarCompras();
        cerrarFormularioCompra();
        alert('Compra guardada con éxito');
    }

    function buscarCompras() {
        console.log('Buscando compras');
        const termino = document.getElementById('busquedaCompra').value.toLowerCase();
        const comprasFiltradas = compras.filter(c => 
            c.proveedor.toLowerCase().includes(termino) ||
            c.fecha.includes(termino) ||
            c.estado.toLowerCase().includes(termino)
        );
        
        const cuerpoTabla = document.getElementById('cuerpoTablaCompras');
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
    }

    function verDetallesCompra(id) {
        console.log('Viendo detalles de la compra:', id);
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
                ${compra.productos && compra.productos.length > 0 ? 
                    compra.productos.map(p => `
                        <li>${p.cantidad} ${p.unidad} de ${p.nombre} - $${p.precioCompraTotal.toFixed(2)}</li>
                    `).join('') : 
                    '<li>No hay productos registrados</li>'
                }
            </ul>
            <p><strong>Observaciones:</strong> ${compra.observaciones || 'N/A'}</p>
        `;

        document.getElementById('modalCompra').style.display = 'block';
    }

    function cerrarModal() {
        console.log('Cerrando modal');
        document.getElementById('modalCompra').style.display = 'none';
    }

    function editarProducto(indice) {
        console.log('Editando producto en índice:', indice);
        const producto = productosCompra[indice];
        document.getElementById('busquedaProducto').value = producto.nombre;
        document.getElementById('cantidad').value = producto.cantidad;
        document.getElementById('precioCompraTotal').value = producto.precioCompraTotal;
        indiceEditando = indice;
        document.getElementById('btnAgregarProducto').textContent = 'Actualizar Producto';
    }

    function eliminarProducto(indice) {
        console.log('Eliminando producto en índice:', indice);
        productosCompra.splice(indice, 1);
        actualizarTablaProductos();
    }

    // Nuevas funciones para la búsqueda de proveedores
    function buscarProveedor(termino) {
        console.log('Buscando proveedor:', termino);
        return proveedores.filter(proveedor => 
            proveedor.nombre.toLowerCase().includes(termino.toLowerCase())
        );
    }

    function mostrarResultadosProveedores(resultados) {
        const listaProveedores = document.getElementById('listaProveedores');
        listaProveedores.innerHTML = '';
        resultados.forEach(proveedor => {
            const li = document.createElement('li');
            li.textContent = proveedor.nombre;
            li.onclick = () => seleccionarProveedor(proveedor);
            listaProveedores.appendChild(li);
        });
    }

    function seleccionarProveedor(proveedor) {
        document.getElementById('proveedor').value = proveedor.id;
        document.getElementById('busquedaProveedor').value = proveedor.nombre;
        document.getElementById('listaProveedores').innerHTML = '';
    }

    // Asegurarse de que las funciones estén disponibles globalmente
    window.cargarModuloCompras = cargarModuloCompras;
    window.verDetallesCompra = verDetallesCompra;
    window.editarProducto = editarProducto;
    window.eliminarProducto = eliminarProducto;
    function cargarModuloCompras() {
        console.log('Inicializando módulo de compras');
        
        // Asegurarse de que el DOM esté cargado
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initCompras);
        } else {
            initCompras();
        }
        
        console.log('Módulo de compras cargado completamente');
    }
    


    // Iniciar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', cargarModuloCompras);
    } else {
        cargarModuloCompras();
    }

    console.log('Archivo compras.js cargado completamente');
})();