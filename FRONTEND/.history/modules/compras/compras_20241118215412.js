(function() {
    console.log('Iniciando carga del módulo de compras');

    let comprasData = [];
    let proveedores = [];
    let productos = [];
    let variantes = [];
    let productosCompra = [];
    let indiceEditando = null;

    function esperarDOM() {
        return new Promise((resolve) => {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', resolve);
            } else {
                resolve();
            }
        });
    }

    function esperarDatosGlobales() {
        return new Promise((resolve) => {
            if (window.datosGlobales) {
                resolve();
            } else {
                window.addEventListener('datosGlobalesListo', resolve);
            }
        });
    }

    async function inicializarModulo() {
        try {
            console.log('Esperando carga del DOM y datos globales...');
            await Promise.all([esperarDOM(), esperarDatosGlobales()]);
            console.log('DOM y datos globales listos, iniciando módulo...');
            await cargarModuloCompras();
        } catch (error) {
            console.error('Error al inicializar el módulo:', error);
        }
    }

    async function cargarModuloCompras() {
        console.log('Inicializando módulo de compras');
        await cargarDatosIniciales();
        initCompras();
    }

    function initCompras() {
        console.log('Configurando event listeners');
        
        const elementos = {
            btnNuevaCompra: document.querySelector('#btnNuevaCompra'),
            btnBuscar: document.querySelector('#btnBuscar'),
            btnCerrarModal: document.querySelector('#btnCerrarModal'),
            btnCerrarFormulario: document.querySelector('#btnCerrarFormulario'),
            btnAgregarProducto: document.querySelector('#btnAgregarProducto'),
            btnGuardarCompra: document.querySelector('#btnGuardarCompra'),
            busquedaProducto: document.querySelector('#busquedaProducto'),
            impuesto: document.querySelector('#impuesto')
        };

        for (const [key, elemento] of Object.entries(elementos)) {
            if (!elemento) {
                console.error(`Elemento no encontrado: ${key}`);
                continue;
            }
            
            switch(key) {
                case 'btnNuevaCompra':
                    elemento.addEventListener('click', mostrarFormularioCompra);
                    break;
                case 'btnBuscar':
                    elemento.addEventListener('click', buscarCompras);
                    break;
                case 'btnCerrarModal':
                    elemento.addEventListener('click', cerrarModal);
                    break;
                case 'btnCerrarFormulario':
                    elemento.addEventListener('click', cerrarFormularioCompra);
                    break;
                case 'btnAgregarProducto':
                    elemento.addEventListener('click', agregarOEditarProducto);
                    break;
                case 'btnGuardarCompra':
                    elemento.addEventListener('click', guardarCompra);
                    break;
                case 'busquedaProducto':
                    elemento.addEventListener('input', buscarProductos);
                    break;
                case 'impuesto':
                    elemento.addEventListener('input', calcularTotales);
                    break;
            }
        }
    }

    async function cargarDatosIniciales() {
        if (window.datosGlobales) {
            comprasData = window.datosGlobales.compras || [];
            proveedores = window.datosGlobales.proveedores || [];
            productos = window.datosGlobales.productos || [];
            variantes = window.datosGlobales.variantes || [];
        } else {
            console.warn('datosGlobales no está disponible. Usando datos de respaldo.');
        }

        await cargarCompras();
        await cargarProveedores();
    }

    async function cargarCompras() {
        console.log('Cargando compras en la tabla');
        const cuerpoTabla = document.querySelector('#cuerpoTablaCompras');
        const comprasEmpty = document.querySelector('#compras-empty');
        
        if (!cuerpoTabla) {
            console.error('No se encontró el elemento cuerpoTablaCompras');
            return;
        }

        if (comprasData.length === 0) {
            cuerpoTabla.innerHTML = '';
            if (comprasEmpty) {
                comprasEmpty.style.display = 'block';
            }
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
                    <button onclick="window.verDetallesCompra(${compra.id})" class="btn btn-secundario">
                        Ver más
                    </button>
                </td>
            </tr>
        `).join('');
        
        console.log('Compras cargadas en la tabla');
    }

    async function cargarProveedores() {
        console.log('Cargando proveedores');
        const selectProveedor = document.querySelector('#proveedor');
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

    function mostrarFormularioCompra() {
        console.log('Mostrando formulario de compra');
        document.querySelector('#modalFormulario').style.display = 'block';
    }

    function cerrarFormularioCompra() {
        console.log('Cerrando formulario de compra');
        document.querySelector('#modalFormulario').style.display = 'none';
        limpiarFormularioCompra();
    }

    function limpiarFormularioCompra() {
        console.log('Limpiando formulario de compra');
        document.querySelector('#formularioCompra').reset();
        productosCompra = [];
        indiceEditando = null;
        actualizarTablaProductos();
        calcularTotales();
    }

    function buscarProductos() {
        console.log('Buscando productos');
        const termino = document.querySelector('#busquedaProducto').value.toLowerCase();
        
        const resultadosProductos = productos.filter(producto =>
            producto.Nombre.toLowerCase().includes(termino) ||
            producto.Descripcion.toLowerCase().includes(termino) ||
            producto.categoria.toLowerCase().includes(termino)
        );

        const resultadosVariantes = variantes.filter(variante =>
            variante.descripcion.toLowerCase().includes(termino) ||
            variante.unidad_medida.toLowerCase().includes(termino)
        );

        const resultadosCombinados = resultadosProductos.map(producto => {
            const variantesProducto = variantes.filter(v => v.id_producto === producto.idProducto);
            return {
                producto,
                variantes: variantesProducto
            };
        });

        mostrarResultadosBusqueda(resultadosCombinados);
    }

    function mostrarResultadosBusqueda(resultados) {
        console.log('Mostrando resultados de búsqueda');
        const divResultados = document.querySelector('#resultadosBusqueda');
        divResultados.innerHTML = '';
        
        resultados.forEach(resultado => {
            const productoDiv = document.createElement('div');
            productoDiv.className = 'producto-resultado';
            
            productoDiv.innerHTML = `
                <div class="producto-info">
                    <strong>${resultado.producto.Nombre}</strong>
                    <span class="categoria">${resultado.producto.categoria}</span>
                </div>
            `;

            const variantesDiv = document.createElement('div');
            variantesDiv.className = 'variantes-lista';
            
            resultado.variantes.forEach(variante => {
                const varianteDiv = document.createElement('div');
                varianteDiv.className = 'variante-item';
                varianteDiv.innerHTML = `
                    <span>${variante.descripcion}</span>
                    <span>${variante.unidad_medida}</span>
                    <span>$${variante.precio_unitario}</span>
                `;
                varianteDiv.onclick = () => seleccionarProducto(resultado.producto, variante);
                variantesDiv.appendChild(varianteDiv);
            });

            productoDiv.appendChild(variantesDiv);
            divResultados.appendChild(productoDiv);
        });
    }

    function seleccionarProducto(producto, variante) {
        console.log('Producto seleccionado:', producto.Nombre, 'Variante:', variante.descripcion);
        
        document.querySelector('#busquedaProducto').value = `${producto.Nombre} - ${variante.descripcion}`;
        
        document.querySelector('#busquedaProducto').dataset.productoId = producto.idProducto;
        document.querySelector('#busquedaProducto').dataset.varianteId = variante.id_variante;
        
        document.querySelector('#unidadMedida').value = variante.unidad_medida;
        
        document.querySelector('#resultadosBusqueda').innerHTML = '';
    }

    function agregarOEditarProducto() {
        console.log('Agregando o editando producto');
        const busquedaInput = document.querySelector('#busquedaProducto');
        const productoId = busquedaInput.dataset.productoId;
        const varianteId = busquedaInput.dataset.varianteId;
        const cantidad = parseInt(document.querySelector('#cantidad').value);
        const precioCompraTotal = parseFloat(document.querySelector('#precioCompraTotal').value);

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
        const impuesto = parseFloat(document.querySelector('#impuesto').value) || 0;
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
            document.querySelector('#btnAgregarProducto').textContent = 'Agregar Producto';
        } else {
            productosCompra.push(nuevoProducto);
        }

        actualizarTablaProductos();
        limpiarFormularioProducto();
    }

    function actualizarTablaProductos() {
        console.log('Actualizando tabla de productos');
        const tbody = document.querySelector('#tablaProductos tbody');
        tbody.innerHTML = '';
        productosCompra.forEach((producto, indice) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${producto.cantidad}</td>
                <td>${producto.unidad}</td>
                <td>${producto.nombre} - ${producto.descripcionVariante}</td>
                <td class="texto-derecha">$${producto.precioCompraTotal.toFixed(2)}</td>
                <td class="texto-derecha">$${producto.precioUnitarioFinal.toFixed(2)}</td>
                <td class="texto-derecha">
                    <button onclick="window.editarProducto(${indice})" class="btn btn-secundario">Editar</button>
                    <button onclick="window.eliminarProducto(${indice})" class="btn btn-peligro">Eliminar</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
        calcularTotales();
    }

    function limpiarFormularioProducto() {
        console.log('Limpiando formulario de producto');
        document.querySelector('#busquedaProducto').value = '';
        document.querySelector('#cantidad').value = '';
        document.querySelector('#precioCompraTotal').value = '';
        document.querySelector('#resultadosBusqueda').innerHTML = '';
    }

    function calcularTotales() {
        console.log('Calculando totales');
        const subtotal = productosCompra.reduce((sum, item) => sum + item.precioCompraTotal, 0);
        const impuesto = parseFloat(document.querySelector('#impuesto').value) || 0;
        const valorImpuesto = subtotal * (impuesto / 100);
        const total = subtotal + valorImpuesto;

        document.querySelector('#subtotal').textContent = `$${subtotal.toFixed(2)}`;
        document.querySelector('#valorImpuesto').textContent = `$${valorImpuesto.toFixed(2)}`;
        document.querySelector('#total').textContent = `$${total.toFixed(2)}`;
    }

    function guardarCompra() {
        console.log('Guardando compra');
        const proveedor = document.querySelector('#proveedor').value;
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
            subtotal: parseFloat(document.querySelector('#subtotal').textContent.slice(1)),
            impuesto: parseFloat(document.querySelector('#valorImpuesto').textContent.slice(1)),
            total: parseFloat(document.querySelector('#total').textContent.slice(1)),
            observaciones: document.querySelector('#observaciones').value,
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
        console.log('Buscando compras');
        const termino = document.querySelector('#busquedaCompra').value.toLowerCase();
        const comprasFiltradas = comprasData.filter(c => 
            c.proveedor.toLowerCase().includes(termino) ||
            c.fecha.includes(termino) ||
            c.estado.toLowerCase().includes(termino)
        );
        
        cargarCompras(comprasFiltradas);
    }

    function verDetallesCompra(id) {
        console.log('Viendo detalles de la compra:', id);
        const compra = comprasData.find(c => c.id === id);
        if (!compra) {
            console.error(`No se encontró la compra con id ${id}`);
            return;
        }

        const detallesCompra = document.querySelector('#detallesCompra');
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

        document.querySelector('#modalCompra').style.display = 'block';
    }

    function cerrarModal() {
        console.log('Cerrando modal');
        document.querySelector('#modalCompra').style.display = 'none';
    }

    function editarProducto(indice) {
        console.log('Editando producto en índice:', indice);
        const producto = productosCompra[indice];
        document.querySelector('#busquedaProducto').value = `${producto.nombre} - ${producto.descripcionVariante}`;
        document.querySelector('#cantidad').value = producto.cantidad;
        document.querySelector('#precioCompraTotal').value = producto.precioCompraTotal;
        indiceEditando = indice;
        document.querySelector('#btnAgregarProducto').textContent = 'Actualizar Producto';
    }

    function eliminarProducto(indice) {
        console.log('Eliminando producto en índice:', indice);
        productosCompra.splice(indice, 1);
        actualizarTablaProductos();
    }

    function guardarEnLocalStorage() {
        localStorage.setItem('datosGlobales', JSON.stringify(window.datosGlobales));
    }

    window.verDetallesCompra = verDetallesCompra;
    window.editarProducto = editarProducto;
    window.eliminarProducto = eliminarProducto;

    inicializarModulo().catch(console.error);
})();