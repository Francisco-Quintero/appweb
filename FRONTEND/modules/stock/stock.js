
(function() {
    console.log('Iniciando carga del módulo de stock');

    let inventario = [];
    let productos = [];

    function cargarDatosDesdeLocalStorage() {
        try {
            const datosGuardados = JSON.parse(localStorage.getItem('datosGlobales') || '{}');
            inventario = datosGuardados.inventario || [];
            productos = datosGuardados.productos || [];
            console.log('inventario cargado desde localStorage');
        } catch (error) {
            console.error('Error al cargar datos desde localStorage:', error);
        }
    }

    function guardarEnLocalStorage() {
        try {
            const datosActuales = JSON.parse(localStorage.getItem('datosGlobales') || '{}');
            datosActuales.inventario = inventario;
            datosActuales.productos = productos;
            localStorage.setItem('datosGlobales', JSON.stringify(datosActuales));
            console.log('Datos guardados en localStorage');
        } catch (error) {
            console.error('Error al guardar en localStorage:', error);
        }
    }

    function guardarInventario(e) {
        e.preventDefault();
        const idInventario = parseInt(document.getElementById('idInventario').value);
        const puntoReorden = parseInt(document.getElementById('puntoReorden').value);
        const precioUnitario = parseFloat(document.getElementById('precioUnitario').value);
    
        const index = inventario.findIndex(i => i.idInventario === idInventario);
        if (index !== -1) {
            inventario[index].puntoReorden = puntoReorden;
            inventario[index].fechaActualizacion = new Date().toISOString().split('T')[0];
            console.log('Inventario actualizado:', inventario[index]);

        //Actualizar el producto relacionado
        const idProducto = inventario[index].idProducto;
        const productoIndex = productos.findIndex(p => p.idProducto === idProducto);

        if (productoIndex !== -1) {
            productos[productoIndex].precioUnitario = precioUnitario;
            console.log('Producto actualizado:', productos[productoIndex]);
        } else {
            console.warn('No se encontró un producto relacionado con idProducto:', idProducto);
        }
        }
    
        guardarEnLocalStorage();
        cargarInventario();
        document.getElementById('modalStock').style.display = 'none';
    }

    function cargarInventario() {
        console.log('Cargando inventario en la tabla');
        const cuerpoTabla = document.getElementById('cuerpoTablaStock');
        console.log(cuerpoTabla);
        if (!cuerpoTabla) {
            console.error('No se encontró el elemento cuerpoTablaStock');
            return;
        }
    
        const contenidoTabla = inventario.length === 0
            ? '<tr><td colspan="7" class="text-center">No hay inventario registrado. </td></tr>'
            : inventario.map(item => `
            <tr class="${item.stock <= item.puntoReorden ? 'alerta-stock' : ''}">
                <td>${item.idInventario}</td>
                <td>${item.nombreProducto}</td>
                <td>${item.stock}</td>
                <td>${item.puntoReorden}</td>
                <td>${item.fechaActualizacion}</td>
                <td>
                    <span class="estado-stock ${item.estado.toLowerCase().replace(' ', '-')}">
                        ${item.estado}
                    </span>
                </td>
                <td>
                    <button onclick="window.moduloStock.editarInventario(${item.idInventario})" class="btn-icono">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </button>
                </td>
            </tr>
        `).join('');
        cuerpoTabla.innerHTML = contenidoTabla;
    }
    function editarInventario(id) {
        console.log('Editando inventario para ID:', id);
    
        const item = inventario.find(i => i.idInventario === id);
        if (!item) {
            console.error('No se encontró el item de inventario');
            return;
        }
    
        document.getElementById('idInventario').value = item.idInventario;
        document.getElementById('nombreProducto').value = item.nombreProducto;
        document.getElementById('stockActual').value = item.stock;
        document.getElementById('stockActual').disabled = true; // No se puede editar el stock
        document.getElementById('puntoReorden').value = item.puntoReorden;
        document.getElementById('precioUnitario').value = item.precioUnitario;
        document.getElementById('modalStock').style.display = 'block';
    }

    function verificarAlertasReorden() {
        inventario.forEach(item => {
            if (item.stock <= item.puntoReorden) {
                console.log(`Alerta: Stock bajo para ${item.nombreProducto}`);
            }
        });
    }

    function actualizarStock(id) {
        console.log('Actualizando stock para ID:', id);

        const item = inventario.find(i => i.idInventario === id);
        if (!item) {
            console.error('No se encontró el item de inventario');
            return;
        }

        document.getElementById('idInventario').value = item.idInventario;
        const producto = productos.find(p => p.Nombre === item.nombreProducto);
        if (!producto) {
            alert('Producto no encontrado');
            return;
        }
        document.getElementById('busquedaProducto').value = producto.Nombre;
        document.getElementById('stockActual').value = item.stock;
        document.getElementById('puntoReorden').value = item.puntoReorden;
        document.getElementById('modalStock').style.display = 'block';
    }

    function buscarInventario() {
        console.log('Buscando en inventario');
        const termino = document.getElementById('busquedaStock').value.toLowerCase();
        const resultados = inventario.filter(item => 
            item.nombreProducto.toLowerCase().includes(termino) ||
            item.estado.toLowerCase().includes(termino)
        );

        
        const cuerpoTabla = document.getElementById('cuerpoTablaStock');
        cuerpoTabla.innerHTML = resultados.map(item => `
            <tr class="${item.stock <= item.puntoReorden ? 'alerta-stock' : ''}">
                <td>${item.idInventario}</td>
                <td>${item.nombreProducto}</td>
                <td>${item.stock}</td>
                <td>${item.puntoReorden}</td>
                <td>${item.fechaActualizacion}</td>
                <td>
                    <span class="estado-stock ${item.estado.toLowerCase().replace(' ', '-')}">
                        ${item.estado}
                    </span>
                </td>
                <td>
                    <button onclick="window.moduloStock.editarInventario(${item.idInventario})" class="btn-icono">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    function configurarEventListeners() {
        console.log('Configurando event listeners');
        
        document.getElementById('btnActualizarStock')?.addEventListener('click', () => {
            document.getElementById('modalStock').style.display = 'block';
        });

        document.getElementById('btnCerrarModal')?.addEventListener('click', cerrarModal);

        // Update or add this function
        function cerrarModal() {
            document.getElementById('modalStock').style.display = 'none';
        }
        

        document.getElementById('busquedaStock')?.addEventListener('input', buscarInventario);
        document.getElementById('btnBuscar')?.addEventListener('click', buscarInventario);
        document.getElementById('formularioStock')?.addEventListener('submit', guardarInventario);
    }



    function iniciarStock() {
        console.log('Inicializando módulo de stock');
        cargarDatosDesdeLocalStorage();
        cargarInventario();
        configurarEventListeners();
        verificarAlertasReorden();

        console.log('Módulo de stock cargado completamente');
    }


    // API pública del módulo
    window.moduloStock = {
        init: iniciarStock,
        actualizarStock: actualizarStock,
        buscarInventario: buscarInventario
    };

    // Inicialización del módulo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', iniciarStock);
    } else {
        iniciarStock();
    }

    function buscarProductos(termino) {
        console.log('Buscando productos:', termino);
        return productos.filter(producto => {
            try {
                return (
                    (producto.Nombre && producto.Nombre.toLowerCase().includes(termino.toLowerCase())) ||
                    (producto.Descripcion && producto.Descripcion.toLowerCase().includes(termino.toLowerCase()))
                );
            } catch (error) {
                console.error('Error en el producto:', producto, error);
                return false;
            }
        });
    }


    function seleccionarProducto(producto) {
        console.log('Producto seleccionado:', producto.Nombre);
        document.getElementById('busquedaProducto').value = producto.Nombre;
        document.getElementById('resultadosBusqueda').innerHTML = '';
    }

    console.log('Archivo stock.js cargado completamente');

    window.moduloStock = {
        init: iniciarStock,
        editarInventario: editarInventario,
        buscarInventario: buscarInventario
    };
})();

