
document.addEventListener('DOMContentLoaded', inicializarModuloCompras);

function inicializarModuloCompras() {
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
    document.getElementById('btnNuevaCompra').addEventListener('click', mostrarFormularioCompra);
    document.getElementById('btnCerrarFormulario').addEventListener('click', cerrarFormularioCompra);
    document.getElementById('btnAgregarVariante').addEventListener('click', mostrarSeleccionVariante);
    document.getElementById('btnGuardarCompra').addEventListener('click', guardarCompra);
    document.getElementById('busquedaProducto').addEventListener('input', buscarProductos);

    cargarProveedores();
    cargarCompras();

    function cargarProveedores() {
        const selectProveedor = document.getElementById('proveedor');
        proveedores.forEach(proveedor => {
            const option = document.createElement('option');
            option.value = proveedor.id;
            option.textContent = `${proveedor.nombre} (Freq: ${proveedor.frecuenciaAbastecimiento})`;
            selectProveedor.appendChild(option);
        });
    }

    function cargarCompras() {
        const cuerpoTabla = document.getElementById('cuerpoTablaCompras');
        cuerpoTabla.innerHTML = '';
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
            cuerpoTabla.appendChild(fila);
        });
    }

    function mostrarFormularioCompra() {
        document.getElementById('modalFormulario').style.display = 'block';
    }

    function cerrarFormularioCompra() {
        document.getElementById('modalFormulario').style.display = 'none';
        limpiarFormulario();
    }

    function limpiarFormulario() {
        document.getElementById('formularioCompra').reset();
        variantesSeleccionadas = [];
        actualizarTablaVariantes();
    }

    function buscarProductos() {
        const termino = document.getElementById('busquedaProducto').value.toLowerCase();
        const resultados = productos.filter(producto =>
            producto.nombre.toLowerCase().includes(termino) ||
            producto.descripcion.toLowerCase().includes(termino)
        );
        mostrarResultadosBusqueda(resultados);
    }

    function mostrarResultadosBusqueda(resultados) {
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
        document.getElementById('busquedaProducto').value = producto.nombre;
        document.getElementById('resultadosBusqueda').innerHTML = '';
        mostrarSeleccionVariante(producto);
    }

    function mostrarSeleccionVariante(producto) {
        const variantesContainer = document.getElementById('variantesContainer');
        variantesContainer.innerHTML = '';
        producto.variantes.forEach(variante => {
            const div = document.createElement('div');
            div.innerHTML = `
                <p>${variante.descripcion}</p>
                <p>Precio: $${variante.precioUnitario}</p>
                <input type="number" min="1" value="1" id="cantidad-${variante.id}">
                <button onclick="agregarVariante(${JSON.stringify(variante).replace(/"/g, '&quot;')}, ${producto.id})">Agregar</button>
            `;
            variantesContainer.appendChild(div);
        });
    }

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
    }

    function actualizarTablaVariantes() {
        const tbody = document.querySelector('#tablaVariantes tbody');
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

    window.eliminarVariante = function(index) {
        variantesSeleccionadas.splice(index, 1);
        actualizarTablaVariantes();
    }

    function actualizarTotal() {
        const total = variantesSeleccionadas.reduce((sum, item) => sum + item.subtotal, 0);
        document.getElementById('total').textContent = `$${total.toFixed(2)}`;
    }

    function guardarCompra() {
        const proveedor = document.getElementById('proveedor').value;
        if (!proveedor || variantesSeleccionadas.length === 0) {
            alert('Por favor, seleccione un proveedor y agregue al menos una variante de producto');
            return;
        }

        const proveedorSeleccionado = proveedores.find(p => p.id == proveedor);
        proveedorSeleccionado.frecuenciaAbastecimiento++;

        const compra = {
            id: comprasData.length + 1,
            fecha: new Date().toISOString().split('T')[0],
            proveedor: proveedorSeleccionado.nombre,
            variantes: variantesSeleccionadas,
            total: variantesSeleccionadas.reduce((sum, item) => sum + item.subtotal, 0),
            observaciones: document.getElementById('observaciones').value,
            estado: 'Pendiente'
        };

        comprasData.push(compra);
        cargarCompras();
        cerrarFormularioCompra();
        alert('Compra guardada con éxito');
    }

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

        // Aquí deberías mostrar estos detalles en un modal o en alguna parte de tu página
        alert(detallesHTML); // Esto es solo un ejemplo, deberías usar un modal real
    }
}