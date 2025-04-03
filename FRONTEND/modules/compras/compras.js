

    console.log('Iniciando carga del módulo de compras');
    const apiUrlProveedores = "http://localhost:26209/api/proveedores";
    const apiUrlProductos = "http://localhost:26209/api/productos";
    const apiUrlSuminnistros = "http://localhost:26209/api/suministros";
    const apiUrlInventario = "http://localhost:26209/api/inventarios";
    let indiceEditando = null;
    let listaSuministros = [];
    let suministros = [];
    let listaProductos = [];
    let listaProveedores = [];
    let listaInventario = [];

    async function cargarDatosDesdeAPI(apiUrl, listaDestino, mensajeError) {
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error(`Error al obtener datos: ${response.statusText}`);
            const datos = await response.json();
            listaDestino.length = 0; // Limpia la lista antes de llenarla
            listaDestino.push(...datos); // Agrega los nuevos datos
        } catch (error) {
            console.error(mensajeError || 'Error al cargar datos desde la API:', error);
        }
    }

    async function inicializarDatos() {
        try {
            await Promise.all([
                cargarDatosDesdeAPI(apiUrlProveedores, listaProveedores, 'Error al cargar proveedores'),
                cargarDatosDesdeAPI(apiUrlInventario, listaInventario, 'Error al cargar inventarios'),
                cargarDatosDesdeAPI(apiUrlProductos, listaProductos, 'Error al cargar productos'),
                cargarDatosDesdeAPI(apiUrlSuminnistros, listaSuministros, 'Error al cargar suministros')
            ]);
            console.log("Datos iniciales cargados.");
        } catch (error) {
            console.error("Error al cargar los datos:", error);
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

        if (listaSuministros.length === 0) {
            cuerpoTabla.innerHTML = '';
            if (comprasEmpty) {
                comprasEmpty.style.display = 'block';
            }
            return;
        }
        if (comprasEmpty) {
            comprasEmpty.style.display = 'none';
        }

        cuerpoTabla.innerHTML = listaSuministros.map(suministro => `
            <tr>
                <td>${suministro.idSuministro}</td>
                <td>${suministro.fechaSuministro}</td>
                <td>${suministro.proveedor.nombreContacto}</td>
                <td>$${suministro.precioCompra}</td>
                <td>
                    <span class="estado-compra estado-${suministro.estado}">
                        ${suministro.estado}
                    </span>
                </td>
                <td>
                    <button onclick="window.verDetallesCompra(${suministro.idSuministro})" class="btn-icono" title="Ver detalles">
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

    function configurarEventListeners() {
        document.getElementById('btnNuevaCompra')?.addEventListener('click', mostrarFormularioCompra);
        //document.getElementById('busquedaCompra')?.addEventListener('input', buscarCompras);
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

    function mostrarListaProveedores() {
        const proveedorInput = document.getElementById('proveedor');
        const datalistProveedores = document.getElementById('listaProveedores');
        if (proveedorInput && datalistProveedores) {
            proveedorInput.setAttribute('list', 'listaProveedores');
        }
    }

    async function initCompras() {
        console.log('Inicializando módulo de compras');
        // await cargarDatosDesdeAPI();
        await inicializarDatos();
        cargarCompras();
        configurarEventListeners();
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
        listaSuministros = [];
        actualizarTablaProductos();
    }

    function buscarProductos(termino) {
        console.log('Buscando productos:', termino);
        return listaProductos.filter(producto =>
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
            div.textContent = `${producto.nombre} - ${producto.descripcion}`;
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

        if (!nombre || isNaN(cantidad) || isNaN(precioCompraTotal) || cantidad <= 0 || precioCompraTotal <= 0) {
            alert('Por favor, complete todos los campos correctamente');
            return;
        }

        const producto = listaProductos.find(p => p.nombre === nombre);
        if (!producto) {
            alert('Producto no encontrado');
            return;
        }

        function redondearArriba(precio) {
            const factor = Math.pow(10, Math.floor(Math.log10(precio)) - 1);
            return Math.ceil(precio / factor) * factor;
        }

        const precioUnitarioFinal = (precioCompraTotal *0.2) / cantidad;
        const precioRedondeado = redondearArriba(precioUnitarioFinal);

        const nuevoProducto = {
            idProducto: producto.idProducto,
            nombre: producto.nombre,
            cantidadMedida: producto.cantidadMedida,
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
                <td>${suministro.nombre}</td>
                <td class="texto-derecha">$${suministro.precioCompraTotal}</td>
                <td class="texto-derecha">$${suministro.precioUnitarioFinal}</td>
                <td>
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

    async function guardarSuministrosBatch(suministros) {
        try {
            const response = await fetch(`${apiUrlSuminnistros}/batch`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(suministros)
            });
    
            if (!response.ok) throw new Error(`Error al guardar suministros: ${response.statusText}`);
            alert('Suministros guardados con éxito');
        } catch (error) {
            console.error('Error al guardar suministros en batch:', error);
            alert('Hubo un error al guardar los suministros. Por favor, intenta de nuevo.');
        }
    }

    function guardarCompra() {
        console.log('Guardando compra');
        const proveedorInput = document.getElementById('proveedor');
        const proveedorSeleccionado = proveedorInput.value;
    
        if (!proveedorSeleccionado || suministros.length === 0) {
            alert('Por favor, seleccione un proveedor y agregue al menos un producto');
            return;
        }
    
        // Buscar el proveedor seleccionado por su nombre
        const proveedor = listaProveedores.find(p => `${p.nombreEmpresa} - ${p.nombreContacto}` === proveedorSeleccionado);
        if (!proveedor) {
            alert('Proveedor no encontrado');
            return;
        }
    
        // Crear un array de suministros con solo los IDs necesarios
        const listaSuministros = suministros.map(producto => ({
            fechaSuministro: new Date().toISOString().split('T')[0],
            proveedor: { idProveedor: proveedor.idProveedor }, // Solo el ID del proveedor
            producto: { idProducto: producto.idProducto }, // Solo el ID del producto
            precioCompra: producto.precioCompraTotal,
            cantidad: producto.cantidad
        }));
    
        // Enviar los suministros al backend en batch
        guardarSuministrosBatch(listaSuministros);
    
        suministros.forEach(producto => {
            actualizarInventario(producto);
        });

        incrementarComprasProveedor(proveedor);
    
        // Recargar la tabla de compras y cerrar el formulario
        cargarCompras();
        cerrarFormularioCompra();
        alert('Compra guardada con éxito');
    }

    async function actualizarEnAPI(inventario) {
        try {
            const response = await fetch(`${apiUrlInventario}/${inventario.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    stock: inventario.stock,
                    //fechaActualizacion: inventario.fechaActualizacion
                })
            });

            if (!response.ok) {
                throw new Error(`Error al actualizar el inventario: ${response.statusText}`);
            }

            const inventarioActualizado = await response.json();
            console.log('Inventario actualizado en el backend:', inventarioActualizado);

            // Actualizar la lista local con los datos del backend
            const index = listaInventario.findIndex(item => item.idInventario === inventario.idInventario);
            if (index !== -1) {
                listaInventario[index] = inventarioActualizado;
            }
        } catch (error) {
            console.error('Error al actualizar el inventario en el backend:', error);
        }
    }

    async function crearInventario(inventario) {
        try {
            const response = await fetch(apiUrlInventario, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(inventario)
            });

            if (!response.ok) {
                throw new Error(`Error al crear el inventario: ${response.statusText}`);
            }

            const inventarioCreado = await response.json();
            console.log('Inventario creado en el backend:', inventarioCreado);

            // Agregar el nuevo inventario a la lista local
            listaInventario.push(inventarioCreado);
        } catch (error) {
            console.error('Error al crear el inventario en el backend:', error);
        }
    }


    async function actualizarInventario(producto) {
        console.log('Actualizando inventario para:', producto);

        let inventarioExistente = listaInventario.find(item =>
            (item.producto.idProducto === producto.idProducto)
        );

        if (inventarioExistente) {
            console.log('Inventario existente encontrado:', inventarioExistente);
            inventarioExistente.stock = (inventarioExistente.stock || 0) + producto.cantidad;
            //inventarioExistente.fechaActualizacion = new Date().toISOString().split('T')[0];
            await actualizarEnAPI(inventarioExistente);
        } else {
            console.log('Creando nuevo item de inventario');
            const nuevoInventario = {
                producto: { idProducto: producto.idProducto }, 
                stock: producto.cantidad,
                puntoReorden: 0,
                // fechaActualizacion: new Date().toISOString().split('T')[0],
                // estado: 'Normal'
            };

            await crearInventario(nuevoInventario);
        }
        // const productoDeLista = listaProductos.find(p => p.idProducto === producto.idProducto);
        // if (productoDeLista) {
        //     productoDeLista.precioUnitario = producto.precioUnitarioFinal;
        //     console.log('Producto actualizado en la lista:', productoDeLista);
        // } else {
        //     console.error('Producto no encontrado en la lista de productos:', producto.idProducto);
        // }
    }

    async function incrementarComprasProveedor(proveedor) {
        try {
            // Incrementar la frecuencia localmente
            proveedor.frecuenciaAbastecimiento = (proveedor.frecuenciaAbastecimiento || 0) + 1;

            // Construir el cuerpo de la petición
            const body = {
                frecuenciaAbastecimiento: proveedor.frecuenciaAbastecimiento
            };

            const response = await fetch(`${apiUrlProveedores}/${proveedor.idProveedor}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                throw new Error(`Error al actualizar el proveedor: ${response.statusText}`);
            }

            const data = await response.json();
            const index = listaProveedores.findIndex(p => p.idProveedor == proveedor.idProveedor);
            if (index !== -1) {
                listaProveedores[index] = data;
            }

            console.log('Proveedor actualizado correctamente:', data);
        } catch (error) {
            console.error('Error al actualizar el proveedor:', error);
        }
    }

    function verDetallesCompra(id) {
        console.log('Viendo detalles de la compra:', id);
        const compra = listaSuministros.find(c => c.idSuministro === id);
        if (!compra) {
            console.error(`No se encontró la compra con id ${id}`);
            return;
        }

        const detallesCompra = document.getElementById('detallesCompra');
        detallesCompra.innerHTML = `
            <h4>Compra #${compra.idSuministro}</h4>
            <p><strong>Fecha:</strong> ${compra.fechaSuministro}</p>
            <p><strong>Proveedor:</strong> ${compra.proveedor.nombreContacto}</p>
            <p><strong>Total:</strong> $${compra.precioCompra}</p>
            <p><strong>Estado:</strong> ${compra.estado}</p>
            <h5>Productos:</h5>
            <p><strong>Observaciones:</strong> ${compra.observaciones || 'N/A'}</p>
        `;

        document.getElementById('modalCompra').style.display = 'block';
    }

    function cerrarModal() {
        console.log('Cerrando modal');
        document.getElementById('modalCompra').style.display = 'none';
    }

    function eliminarProducto(indice) {
        console.log('Eliminando producto en índice:', indice);
        suministros.splice(indice, 1);
        actualizarTablaProductos();
    }

    function buscarProveedor(termino) {
        console.log('Buscando proveedor:', termino);
        return listaProveedores.filter(proveedor =>
            `${proveedor.nombreEmpresa} ${proveedor.nombreContacto}`.toLowerCase().includes(termino.toLowerCase())
        );
    }

    function mostrarResultadosProveedores(resultados) {
        const datalistProveedores = document.getElementById('listaProveedores');
        if (datalistProveedores) {
            datalistProveedores.innerHTML = resultados.map(proveedor =>
                `<option value="${proveedor.nombreEmpresa} - ${proveedor.nombreContacto}" data-id="${proveedor.idProveedor}">`
            ).join('');
        }
    }

    window.verDetallesCompra = verDetallesCompra;
    window.eliminarProducto = eliminarProducto;

    // Iniciar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCompras);
    } else {
        initCompras();
    }

    console.log('Archivo compras.js cargado completamente');


