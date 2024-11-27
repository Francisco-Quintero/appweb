(function() {
    
    console.log('Iniciando carga del módulo de compras');

    let productos = [];
    let proveedores = [];
    let compras = [];
    let inventario = [];
    let suministros = [];
    let indiceEditando = null;

    function cargarDatosDesdeLocalStorage() {
        try {
            const datosGuardados = JSON.parse(localStorage.getItem('datosGlobales') || '{}');
            productos = datosGuardados.productos || [];
            proveedores = datosGuardados.proveedores || [];
            compras = datosGuardados.compras || [];
            inventario = datosGuardados.inventario || [];
            console.log('Datos cargados desde localStorage');
        } catch (error) {
            console.error('Error al cargar datos desde localStorage:', error);
        }
    }
    function guardarEnLocalStorage() {
        try {
            const datosActuales = JSON.parse(localStorage.getItem('datosGlobales') || '{}');
            datosActuales.compras = compras;
            datosActuales.inventario = inventario;
            localStorage.setItem('datosGlobales', JSON.stringify(datosActuales));
            console.log('Compras e inventario guardados en localStorage');
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
            cargarProveedores();
            console.log('Datos sincronizados con datosGlobales');
        }
    }

    function cargarCompras() { 
        console.log('Cargando compras en la tabla');
        const cuerpoTabla = document.getElementById('cuerpoTablaCompras');
        const comprasEmpty = document.getElementById('compras-empty');
        
        if (!cuerpoTabla) {
            console.error('No se encontró el elemento cuerpoTablaCompras');
            return;
        }

        if (compras.length === 0) {
            cuerpoTabla.innerHTML = '';
            if (comprasEmpty) {
                comprasEmpty.style.display = 'block';
            }
            return;
        }
        if (comprasEmpty) {
            comprasEmpty.style.display = 'none';
        }

        cuerpoTabla.innerHTML = compras.map(compra => `
            <tr>
                <td>${compra.id}</td>
                <td>${compra.fechaSuministro}</td>
                <td>${compra.proveedor}</td>
                <td>$${compra.total.toFixed(2)}</td>
                <td>
                    <span class="estado-compra estado-${compra.estado.toLowerCase()}">
                        ${compra.estado}
                    </span>
                </td>
                <td>
                    <button onclick="window.verDetallesCompra(${compra.id})" class="btn-icono" title="Ver detalles">
                        <i data-lucide="eye"></i>
                    </button>
                </td>
            </tr>
        `).join('');

        // Reinicializar los iconos de Lucide
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        
        console.log('Compras cargadas en la tabla');
    }

    function configurarEventListeners(){
        document.getElementById('btnNuevaCompra')?.addEventListener('click', mostrarFormularioCompra);
        document.getElementById('busquedaCompra')?.addEventListener('input', buscarCompras);
        document.getElementById('btnCerrarModal')?.addEventListener('click', cerrarModal);
        document.getElementById('btnCerrarFormulario')?.addEventListener('click', cerrarFormularioCompra);
        document.getElementById('btnAgregarProducto')?.addEventListener('click', agregarOEditarProducto);
        document.getElementById('btnGuardarCompra')?.addEventListener('click', guardarCompra);
        document.getElementById('busquedaProducto')?.addEventListener('input', (e) => {
            const resultados = buscarProductos(e.target.value);
            mostrarResultadosBusqueda(resultados);
        });
        
        const proveedorInput = document.getElementById('proveedor');
        if (proveedorInput) {
            proveedorInput.addEventListener('focus', mostrarListaProveedores);
            proveedorInput.addEventListener('input', (e) => {
                const resultados = buscarProveedor(e.target.value);
                mostrarResultadosProveedores(resultados);
            });
        }
    }

    function cargarProveedores() {
        console.log('Cargando proveedores');
        const datalistProveedores = document.getElementById('listaProveedores');
        if (datalistProveedores) {
            datalistProveedores.innerHTML = proveedores.map(proveedor => 
                `<option value="${proveedor.nombreEmpresa} - ${proveedor.nombreContacto}" data-id="${proveedor.id}">`
            ).join('');
        }
    }

    function mostrarListaProveedores() {
        const proveedorInput = document.getElementById('proveedor');
        const datalistProveedores = document.getElementById('listaProveedores');
        if (proveedorInput && datalistProveedores) {
            proveedorInput.setAttribute('list', 'listaProveedores');
        }
    }

    function initCompras() {
        console.log('Inicializando módulo de compras');
        cargarDatosDesdeLocalStorage();
        cargarCompras();
        cargarProveedores();
        configurarEventListeners();

        window.addEventListener('datosGlobalesListo', sincronizarConDatosGlobales);
        if(window.datosGlobales){
            sincronizarConDatosGlobales();
        }
        console.log('Módulo de compras cargado completamente');
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
        suministros = [];
        actualizarTablaProductos();
    }

    function buscarProductos(termino) {
        console.log('Buscando productos:', termino);
        return productos.filter(producto => 
            producto.Nombre.toLowerCase().includes(termino.toLowerCase()) ||
            producto.Descripcion.toLowerCase().includes(termino.toLowerCase())
        );
    }

    function mostrarResultadosBusqueda(resultados) {
        console.log('Mostrando resultados de búsqueda');
        const divResultados = document.getElementById('resultadosBusqueda');
        divResultados.innerHTML = '';
        resultados.forEach(producto => {
            const div = document.createElement('div');
            div.textContent = `${producto.Nombre} - ${producto.Descripcion}`;
            div.onclick = () => seleccionarProducto(producto);
            divResultados.appendChild(div);
        });
    }

    function seleccionarProducto(producto) {
        console.log('Producto seleccionado:', producto.Nombre);
        document.getElementById('busquedaProducto').value = producto.Nombre;
        document.getElementById('resultadosBusqueda').innerHTML = '';
    }

    function agregarOEditarProducto() {
        console.log('Agregando o editando producto');
        const nombre = document.getElementById('busquedaProducto').value;
        const cantidad = parseInt(document.getElementById('cantidad').value);
        const precioCompraTotal = parseFloat(document.getElementById('precioCompraTotal').value);
    
        if (!nombre || isNaN(cantidad) || isNaN(precioCompraTotal) || cantidad <= 0 || precioCompraTotal <= 0) {
            alert('Por favor, complete todos los campos correctamente');
            return;
        }
    
        const producto = productos.find(p => p.Nombre === nombre);
        if (!producto) {
            alert('Producto no encontrado');
            return;
        }
    
        function redondearArriba(precio) {
            const factor = Math.pow(10, Math.floor(Math.log10(precio)) - 1); 
            return Math.ceil(precio / factor) * factor; 
        }
        
        const precioUnitarioFinal = precioCompraTotal / cantidad;
        const precioRedondeado = redondearArriba(precioUnitarioFinal);
    
        const nuevoProducto = {
            id: producto.idProducto, // Usar idProducto en lugar de id
            idProducto: producto.idProducto, // Añadir también idProducto para consistencia
            Nombre: producto.Nombre,
            valorMedida: producto.valorMedida,
            unidadMedida: producto.unidadMedida,
            cantidad: cantidad,
            precioCompraTotal: precioCompraTotal,
            precioUnitarioFinal: precioRedondeado
        };
    
        if (indiceEditando !== null) {
            suministros[indiceEditando] = nuevoProducto;
            indiceEditando = null;
            document.getElementById('btnAgregarProducto').textContent = 'Agregar Producto';
        } else {
            suministros.push(nuevoProducto);
        }
    
        actualizarTablaProductos();
        limpiarFormularioProducto();
    }

    function actualizarTablaProductos() {
        console.log('Actualizando tabla de productos');
        const tbody = document.querySelector('#tablaProductos tbody');
        tbody.innerHTML = '';

        suministros.forEach((suministro, indice) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${suministro.cantidad}</td>
                <td>${suministro.unidadMedida}</td>
                <td>${suministro.Nombre}</td>
                <td class="texto-derecha">$${suministro.precioCompraTotal.toFixed(2)}</td>
                <td class="texto-derecha">$${suministro.precioUnitarioFinal.toFixed(2)}</td>
                <td>
                    <button onclick="window.editarProducto(${indice})" class="btn-icono" title="Editar">
                        <i data-lucide="edit"></i>
                    </button>
                    <button onclick="window.eliminarProducto(${indice})" class="btn-icono btn-icono-eliminar" title="Eliminar">
                        <i data-lucide="trash-2"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
        calcularTotales();

        // Reinicializar los iconos de Lucide
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    function limpiarFormularioProducto() {
        console.log('Limpiando formulario de producto');
        document.getElementById('busquedaProducto').value = '';
        document.getElementById('cantidad').value = '';
        document.getElementById('precioCompraTotal').value = '';
        document.getElementById('resultadosBusqueda').innerHTML = '';
    }

    function calcularTotales() {
        console.log('Calculando totales');
        const subtotal = suministros.reduce((sum, item) => sum + item.precioCompraTotal, 0);
        const ganancia = subtotal * 0.2; // 20% de ganancia
        const total = subtotal + ganancia;

        document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
        document.getElementById('ganancia').textContent = `$${ganancia.toFixed(2)}`;
        document.getElementById('total').textContent = `$${total.toFixed(2)}`;
    }

    function guardarCompra() {
        console.log('Guardando compra');
        const proveedorInput = document.getElementById('proveedor');
        const proveedorSeleccionado = proveedorInput.value;
        const observaciones = document.getElementById('observaciones').value;
    
        if (!proveedorSeleccionado || suministros.length === 0) {
            alert('Por favor, seleccione un proveedor y agregue al menos un producto');
            return;
        }
    
        const proveedor = proveedores.find(p => `${p.nombreEmpresa} - ${p.nombreContacto}` === proveedorSeleccionado);
        if (!proveedor) {
            alert('Proveedor no encontrado');
            return;
        }
    
        const compra = {
            id: compras.length + 1,
            fechaSuministro: new Date().toISOString().split('T')[0],
            proveedor: proveedorSeleccionado,
            productos: suministros.map(suministro => ({
                ...suministro,
                id: suministro.id // Asegurarse de que el ID del producto esté presente
            })),
            total: parseFloat(document.getElementById('total').textContent.slice(1)),
            estado: 'Pendiente',
            observaciones: observaciones
        };
    
        compras.push(compra);
        incrementarComprasProveedor(proveedor.id);
        
        // Actualizar inventario para cada producto
        compra.productos.forEach(producto => {
            actualizarInventario(producto);
        });
    
        guardarEnLocalStorage();
        cargarCompras();
        cerrarFormularioCompra();
        alert('Compra guardada con éxito');
    }
    
    function actualizarInventario(producto) {
        console.log('Actualizando inventario para:', producto);
        
        let inventarioExistente = inventario.find(item => 
            (item.idProducto && item.idProducto === producto.idProducto) || 
            (item.nombreProducto && item.nombreProducto.toLowerCase() === producto.Nombre.toLowerCase())
        );

        if (inventarioExistente) {
            console.log('Inventario existente encontrado:', inventarioExistente);
            inventarioExistente.stock = (inventarioExistente.stock || 0) + producto.cantidad;
            inventarioExistente.precioUnitario = producto.precioUnitarioFinal;
            inventarioExistente.fechaActualizacion = new Date().toISOString().split('T')[0];
            inventarioExistente.idProducto = producto.idProducto;
        } else {
            console.log('Creando nuevo item de inventario');
            const nuevoInventario = {
                idInventario: Date.now(),
                idProducto: producto.idProducto,
                nombreProducto: producto.Nombre,
                stock: producto.cantidad,
                precioUnitario: producto.precioUnitarioFinal,
                puntoReorden: 0,
                fechaActualizacion: new Date().toISOString().split('T')[0],
                estado: 'Normal'
            };
            inventario.push(nuevoInventario);
        }

        console.log('Inventario después de actualización:', inventario);
        guardarEnLocalStorage();
        
        // Emitir evento para la actualización del inventario
        if (window.sistemaEventos) {
            window.sistemaEventos.emitir('inventarioActualizado', inventario);
        } else {
            console.error('Sistema de eventos no disponible');
        }
    }
    
    function incrementarComprasProveedor(proveedorID) {
        const proveedor = proveedores.find(p => p.id == proveedorID);
        if (proveedor) {
            proveedor.comprasRealizadas = (proveedor.comprasRealizadas || 0) + 1;
            // Actualizar en localStorage
            const datosActuales = JSON.parse(localStorage.getItem('datosGlobales') || '{}');
            const index = datosActuales.proveedores.findIndex(p => p.id == proveedorID);
            if (index !== -1) {
                datosActuales.proveedores[index] = proveedor;
                localStorage.setItem('datosGlobales', JSON.stringify(datosActuales));
            }
        }
    }

    function buscarCompras() {
        console
.log('Buscando compras');
        const termino = document.getElementById('busquedaCompra').value.toLowerCase();
        const comprasFiltradas = compras.filter(c => 
            c.proveedor.toLowerCase().includes(termino) ||
            c.fechaSuministro.includes(termino) ||
            c.estado.toLowerCase().includes(termino)
        );
        
        const cuerpoTabla = document.getElementById('cuerpoTablaCompras');
        cuerpoTabla.innerHTML = comprasFiltradas.map(compra => `
            <tr>
                <td>${compra.id}</td>
                <td>${compra.fechaSuministro}</td>
                <td>${compra.proveedor}</td>
                <td>$${compra.total.toFixed(2)}</td>
                <td>
                    <span class="estado-compra estado-${compra.estado.toLowerCase()}">
                        ${compra.estado}
                    </span>
                </td>
                <td>
                    <button onclick="window.verDetallesCompra(${compra.id})" class="btn-icono" title="Ver detalles">
                        <i data-lucide="eye"></i>
                    </button>
                    <button onclick="window.editarCompra(${compra.id})" class="btn-icono" title="Editar">
                        <i data-lucide="edit"></i>
                    </button>
                    <button onclick="window.eliminarCompra(${compra.id})" class="btn-icono btn-icono-eliminar" title="Eliminar">
                        <i data-lucide="trash-2"></i>
                    </button>
                </td>
            </tr>
        `).join('');

        // Reinicializar los iconos de Lucide
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    function verDetallesCompra(id) {
        console.log('Viendo detalles de la compra:', id);
        const compra = compras.find(c => c.id === id);
        if (!compra) {
            console.error(`No se encontró la compra con id ${id}`);
            return;
        }

        const detallesCompra = document.getElementById('detallesCompra');
        detallesCompra.innerHTML = `
            <h4>Compra #${compra.id}</h4>
            <p><strong>Fecha:</strong> ${compra.fechaSuministro}</p>
            <p><strong>Proveedor:</strong> ${compra.proveedor}</p>
            <p><strong>Total:</strong> $${compra.total.toFixed(2)}</p>
            <p><strong>Estado:</strong> ${compra.estado}</p>
            <h5>Productos:</h5>
            <ul>
                ${compra.productos.map(p => `
                    <li>${p.cantidad} ${p.unidadMedida} de ${p.Nombre} - $${p.precioCompraTotal.toFixed(2)}</li>
                `).join('')}
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
        const producto = suministros[indice];
        document.getElementById('busquedaProducto').value = producto.Nombre;
        document.getElementById('cantidad').value = producto.cantidad;
        document.getElementById('precioCompraTotal').value = producto.precioCompraTotal;
        indiceEditando = indice;
        document.getElementById('btnAgregarProducto').textContent = 'Actualizar Producto';
    }

    function eliminarProducto(indice) {
        console.log('Eliminando producto en índice:', indice);
        suministros.splice(indice, 1);
        actualizarTablaProductos();
    }

    function buscarProveedor(termino) {
        console.log('Buscando proveedor:', termino);
        return proveedores.filter(proveedor => 
            `${proveedor.nombreEmpresa} ${proveedor.nombreContacto}`.toLowerCase().includes(termino.toLowerCase())
        );
    }

    function mostrarResultadosProveedores(resultados) {
        const datalistProveedores = document.getElementById('listaProveedores');
        if (datalistProveedores) {
            datalistProveedores.innerHTML = resultados.map(proveedor => 
                `<option value="${proveedor.nombreEmpresa} - ${proveedor.nombreContacto}" data-id="${proveedor.id}">`
            ).join('');
        }
    }

    window.verDetallesCompra = verDetallesCompra;
    window.editarProducto = editarProducto;
    window.eliminarProducto = eliminarProducto;

    // Iniciar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCompras);
    } else {
        initCompras();
    }

    console.log('Archivo compras.js cargado completamente');
})();

