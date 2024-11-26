// productos.js
(function () {
    console.log('Iniciando carga del módulo de productos');

    let productos = [];

    function cargarDatosDesdeLocalStorage() {
        try {
            const datosGuardados = JSON.parse(localStorage.getItem('datosGlobales') || '{}');
            productos = datosGuardados.productos || [];
            console.log('Productos cargados desde localStorage');
        } catch (error) {
            console.error('Error al cargar datos desde localStorage:', error);
        }
    }

    function guardarEnLocalStorage() {
        try {
            const datosActuales = JSON.parse(localStorage.getItem('datosGlobales') || '{}');
            datosActuales.productos = productos;
            localStorage.setItem('datosGlobales', JSON.stringify(datosActuales));
            console.log('Datos guardados en localStorage');
        } catch (error) {
            console.error('Error al guardar en localStorage:', error);
        }
    }

    function sincronizarConDatosGlobales() {
        if (window.datosGlobales) {
            if (Array.isArray(window.datosGlobales.productos)) {
                productos = window.datosGlobales.productos;
            }
            cargarProductos();
            console.log('Datos sincronizados con datosGlobales');
        }
    }

    function cargarProductos() {
        const cuerpoTabla = document.getElementById('cuerpoTablaProductos');
        if (!cuerpoTabla) {
            console.error('No se encontró el elemento cuerpoTablaProductos');
            return;
        }

        const contenidoTabla = productos.length === 0
            ? '<tr><td colspan="6" class="text-center">No hay productos registrados. Haga clic en "+" para agregar uno nuevo.</td></tr>'
            : productos.map(producto => {
                return `
                    <tr>
                        <td>${producto.idProducto}</td>
                        <td>${producto.Nombre}</td>
                        <td>${producto.Descripcion}</td>
                        <td>${producto.categoria}</td>
                        <td>${producto.valorMedida}</td>
                        <td>${producto.unidadMedida}</td>
                        <td>
                            <img src="${producto.imagenProducto || '/placeholder.jpg'}" 
                                alt="${producto.Nombre}" 
                                class="producto-imagen"
                                style="max-width: 50px; height: auto;">
                        </td>
                        <td>
                            <div class="acciones-tabla">
                                <button onclick="window.moduloProductos.editarProducto(${producto.idProducto})" 
                                        class="btn-icono" title="Editar">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                </button>
                                <button onclick="window.moduloProductos.eliminarProducto(${producto.idProducto})" 
                                        class="btn-icono btn-icono-eliminar" title="Eliminar">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash-2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                </button>
                            </div>
                        </td>
                    </tr>
                `;
            }).join('');

        cuerpoTabla.innerHTML = contenidoTabla;
    }function validarFormulario() {
        const campos = [
            { id: 'nombreProducto', mensaje: 'El nombre del producto es obligatorio.' },
            { id: 'descripcionProducto', mensaje: 'La descripción del producto es obligatoria.' },
            { id: 'categoriaProducto', mensaje: 'La categoría del producto es obligatoria.' },
            { id: 'unidadMedida', mensaje: 'La unidad de medida es obligatoria.' }
        ];
    
        // Validar campos obligatorios
        for (const campo of campos) {
            const valor = document.getElementById(campo.id).value.trim();
            if (valor.length === 0) {
                alert(campo.mensaje);
                return false;
            }
        }
    
        // Validar unidad de medida no numérica
        const unidadMedida = document.getElementById('unidadMedida').value.trim();
        if (/\d/.test(unidadMedida)) {
            alert('La unidad de medida no debe contener números.');
            return false;
        }
    
        // Validar valor de medida
        const valorMedida = document.getElementById('valorMedida').value.trim();
        if (!isPositiveNumber(valorMedida)) {
            alert('El valor de medida debe ser un número positivo.');
            return false;
        }
    
        // Validar URL de imagen
        const imagenProducto = document.getElementById('imagenProducto').value.trim();
        if (imagenProducto.length > 0 && !isValidURL(imagenProducto)) {
            alert('La URL de la imagen no es válida.');
            return false;
        }
    
        return true;
    }
    
    // Función para validar números positivos
    function isPositiveNumber(value) {
        const number = parseFloat(value);
        return !isNaN(number) && number > 0;
    }
    
    // Función para validar URLs
    function isValidURL(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }
    

    function manejarEnvioFormulario(e) {
        e.preventDefault();

        if(!validarFormulario()){
            return;
        }
        const idProducto = document.getElementById('idProducto').value;
        const producto = {
            idProducto: idProducto ? parseInt(idProducto) : productos.length + 1,
            Nombre: document.getElementById('nombreProducto').value,
            Descripcion: document.getElementById('descripcionProducto').value,
            //precioUnitario: document.getElementById('precio').value,
            categoria: document.getElementById('categoriaProducto').value,
            valorMedida: document.getElementById('valorMedida').value,
            unidadMedida: document.getElementById('unidadMedida').value,
            imagenProducto: document.getElementById('imagenProducto').value
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


    function configurarEventListeners() {
        document.getElementById('btnAgregarProducto').addEventListener('click', () => {
            document.getElementById('formularioProducto').reset();
            document.getElementById('idProducto').value = '';
            document.getElementById('modalProducto').style.display = 'block';
        });

        document.getElementById('btnCancelar').addEventListener('click', () => {
            document.getElementById('modalProducto').style.display = 'none';
        });

        document.getElementById('formularioProducto').addEventListener('submit', manejarEnvioFormulario);
        document.getElementById('btnBuscar').addEventListener('click', buscarProductos);
        document.getElementById('unidadMedida').addEventListener('input', function(e) {
            if (/\d/.test(this.value)) {
                this.setCustomValidity('La unidad de medida no debe contener números.');
            } else {
                this.setCustomValidity('');
            }
        });

        document.getElementById('valorMedida').addEventListener('input', function(e) {
            if (isNaN(parseFloat(this.value)) || parseFloat(this.value) <= 0) {
                this.setCustomValidity('El valor de medida debe ser un número positivo.');
            } else {
                this.setCustomValidity('');
            }
        });

        document.getElementById('imagenProducto').addEventListener('change', function(e) {
            if (this.value.trim().length > 0 && !isValidURL(this.value)) {
                this.setCustomValidity('La URL de la imagen no es válida.');
            } else {
                this.setCustomValidity('');
            }
        });
    }

    function buscarProductos() {  //funcion para revisar bien en la busqueda de productos
        const termino = document.getElementById('busquedaProducto').value.toLowerCase();
        const productosFiltrados = productos.filter(p =>
            p.Nombre.toLowerCase().includes(termino) ||
            p.Descripcion.toLowerCase().includes(termino) ||
            p.categoria.toLowerCase().includes(termino)
        );
        cargarProductos(productosFiltrados);
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

    window.moduloProductos = {
        init: initProductos,
        editarProducto: function (idProducto) {
            const producto = productos.find(p => p.idProducto === idProducto);
            if (producto) {
                document.getElementById('idProducto').value = producto.idProducto;
                document.getElementById('nombreProducto').value = producto.Nombre;
                //document.getElementById('categoriaProducto').value = producto.precioUnitario;
                document.getElementById('descripcionProducto').value = producto.Descripcion;
                document.getElementById('categoriaProducto').value = producto.categoria;
                document.getElementById('imagenProducto').value = producto.imagenProducto;
                document.getElementById('valorMedida').value = producto.valorMedida;
                document.getElementById('unidadMedida').value = producto.unidadMedida;
                document.getElementById('modalProducto').style.display = 'block';
            }
        },
        eliminarProducto: function (idProducto) {
            if (confirm('¿Estás seguro de que quieres eliminar este producto ?')) {
                productos = productos.filter(p => p.idProducto !== idProducto);
                guardarEnLocalStorage();
                cargarProductos();
            }
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initProductos);
    } else {
        initProductos();
    }

    window.onload = cargarProductos;

})();

console.log('Archivo productos.js cargado completamente');