
(function() {
    console.log('Iniciando carga del módulo de stock');

    // let inventario = [
    //     { 
    //         idInventario: 1,
    //         idProducto: 1,
    //         nombreProducto: 'Leche',
    //         stock: 100,
    //         puntoReorden: 20,
    //         fechaActualizacion: '2024-01-15',
    //         estado: 'Normal'
    //     },
    //     { 
    //         idInventario: 2,
    //         idProducto: 2,
    //         nombreProducto: 'Queso crema',
    //         stock: 15,
    //         puntoReorden: 25,
    //         fechaActualizacion: '2024-01-15',
    //         estado: 'Bajo stock'
    //     }
    // ];


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
            localStorage.setItem('datosGlobales', JSON.stringify(datosActuales));
            console.log('Datos guardados en localStorage');
        } catch (error) {
            console.error('Error al guardar en localStorage:', error);
        }
    }

    function guardarInventario(e){
        e.preventDefault();

        // const idInventario = parseInt(document.getElementById('idInventario').value);
        // const producto = document.getElementById('busquedaProducto').value;
        // const stockActual = parseInt(document.getElementById('stockActual').value);
        // const puntoReorden = parseInt(document.getElementById('puntoReorden').value);

        // const index = inventario.findIndex(i => i.idInventario === idInventario);
        // if (index !== -1) {
        //     inventario[index] = {
        //         ...inventario[index],
        //         stock: stockActual,
        //         producto: producto.Nombre,
        //         puntoReorden: puntoReorden,
        //         fechaActualizacion: new Date().toISOString().split('T')[0],
        //         estado: stockActual <= puntoReorden ? 'Bajo stock' : 'Normal'
        //     };
        //     console.log('Stock actualizado:', inventario[index]);
        // }

        // guardarEnLocalStorage();
        // cargarInventario();
        // verificarAlertasReorden();
        // document.getElementById('modalStock').style.display = 'none';


        e.preventDefault();
        
        const idPructo = document.getElementById('idInventario').value;
        const producto = {
            idProducto: idProducto ? parseInt(idProducto) : Date.now(),
            Nombre: document.getElementById('nombreProducto').value,
            Descripcion: document.getElementById('descripcionProducto').value,
            categoria: document.getElementById('categoriaProducto').value,
            imagenProducto: document.getElementById('imagenProducto').value,
            unidadMedida: document.getElementById('unidadMedida').value,
            valorMedida: document.getElementById('valorMedida').value
        };

        if (idProducto) {
            const index = productos.findIndex(p => p.idProducto === parseInt(idProducto));
            if (index !== -1) {
                productos[index] = producto;
                console.log('Producto actualizado:', producto);
            }
        } else {
            productos.push(producto);
            console.log('Nuevo producto agregado:', producto);
        }

        guardarEnLocalStorage();
        cargarProductos();
        document.getElementById('modalProducto').style.display = 'none';

    }

    function sincronizarConDatosGlobales() {
        if (window.datosGlobales) {
            if (Array.isArray(window.datosGlobales.inventario)) {
                inventario = window.datosGlobales.inventario;
            }
            if (Array.isArray(window.datosGlobales.productos)) {
                productos = window.datosGlobales.productos;
            }
            cargarInventario();
            console.log('Datos sincronizados con datosGlobales');
        }
    }

    function cargarInventario() {
        console.log('Cargando inventario en la tabla');
        const cuerpoTabla = document.getElementById('cuerpoTablaStock');
        if (!cuerpoTabla) {
            console.error('No se encontró el elemento cuerpoTablaStock');
            return;
        }


        const contenidoTabla = inventario.length === 0
            ? '<tr><td colspan="7" class="text-center">No hay inventario registrados. </td></tr>'
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
                    <button onclick="window.moduloStock.actualizarStock(${item.idInventario})" class="btn btn-secundario">
                        Actualizar
                    </button>
                </td>
            </tr>
        `).join('');
        cuerpoTabla.innerHTML = contenidoTabla;
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
        document.getElementById('idProducto').value = item.idProducto;
        document.getElementById('nombreProducto').value = item.nombreProducto;
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
                    <button onclick="window.moduloStock.actualizarStock(${item.idInventario})" class="btn btn-secundario">
                        Actualizar
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

        document.getElementById('Guardar')?.addEventListener('click', () => {
            guardarInventario();
        })

        document.getElementById('btnCerrarModal')?.addEventListener('click', () => {
            document.getElementById('modalStock').style.display = 'none';
        });
        document.getElementById('busquedaProducto')?.addEventListener('input', (e) => {
            const resultados = buscarProductos(e.target.value);
            mostrarResultadosBusqueda(resultados);
        });

        document.getElementById('btnBuscar')?.addEventListener('click', buscarInventario);
        document.getElementById('formularioStock').addEventListener('submit', guardarInventario);

    }

    function initStock() {
        console.log('Inicializando módulo de stock');
        cargarDatosDesdeLocalStorage();
        cargarInventario();
        configurarEventListeners();
        verificarAlertasReorden();

        window.addEventListener('datosGlobalesListo', sincronizarConDatosGlobales);
        
        if (window.datosGlobales) {
            sincronizarConDatosGlobales();
        }


        console.log('Módulo de stock cargado completamente');
    }

    // API pública del módulo
    window.moduloStock = {
        init: initStock,
        actualizarStock: actualizarStock,
        buscarInventario: buscarInventario
    };

    // Inicialización del módulo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initStock);
    } else {
        initStock();
    }

    function buscarProductos(termino) {
        console.log('Buscando productos:', termino);
        return productos.filter(producto =>{
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

    function mostrarResultadosBusqueda(resultados) {
        console.log('Mostrando resultados de búsqueda');
        const divResultados = document.getElementById('resultadosBusqueda');
        divResultados.innerHTML = '';
        resultados.forEach(producto => {
            const div = document.createElement('div');
            div.textContent = `${producto.Nombre} - ${producto.Descripcion} `;
            div.onclick = () => seleccionarProducto(producto);
            divResultados.appendChild(div);
        });
    }

    function seleccionarProducto(producto) {
        console.log('Producto seleccionado:', producto.Nombre);
        document.getElementById('busquedaProducto').value = producto.Nombre;
        document.getElementById('resultadosBusqueda').innerHTML = '';
    }

    console.log('Archivo stock.js cargado completamente');
})();