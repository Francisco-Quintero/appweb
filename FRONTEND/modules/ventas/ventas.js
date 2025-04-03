export async function initVentas(estadoGlobal) {
    console.log('Inicializando módulo de ventas');

    // Filtrar y cargar datos iniciales
    cargarVentasActivas(estadoGlobal);
    cargarHistorialVentas(estadoGlobal);
    renderizarVentasActivas(estadoGlobal);
    renderizarHistorialVentas(estadoGlobal);

    // Configurar eventos
    configurarEventListeners(estadoGlobal);
    configurarFormularioAsignarDomiciliario(estadoGlobal);

    console.log('Módulo de ventas cargado completamente');
}

// Función para filtrar y cargar ventas activas
function cargarVentasActivas(estadoGlobal) {
    const estadosActivos = ['Pendiente', 'en proceso', 'en camino'];
    const ventasActivas = estadoGlobal.pedidos.filter(pedido => estadosActivos.includes(pedido.estadoPedido));
    estadoGlobal.actualizarVentasActivas(ventasActivas);
}

// Función para filtrar y cargar historial de ventas
function cargarHistorialVentas(estadoGlobal) {
    const historialVentas = estadoGlobal.pedidos.filter(pedido => pedido.estadoPedido === 'completado');
    estadoGlobal.actualizarHistorialVentas(historialVentas);
}

// Función para renderizar ventas activas
function renderizarVentasActivas(estadoGlobal) {
    const cuerpoTablaVentas = document.getElementById('cuerpoTablaVentas');
    const ventasEmpty = document.getElementById('ventas-empty');

    if (!cuerpoTablaVentas || !ventasEmpty) {
        console.error('No se encontraron los elementos necesarios para renderizar ventas activas');
        return;
    }

    const ventasActivas = estadoGlobal.ventasActivas;

    if (ventasActivas.length === 0) {
        cuerpoTablaVentas.innerHTML = '';
        ventasEmpty.style.display = 'block';
        return;
    }

    ventasEmpty.style.display = 'none';
    cuerpoTablaVentas.innerHTML = ventasActivas.map(venta => `
        <tr>
            <td>${venta.idPedido}</td>
            <td>${new Date(venta.fechaPedido).toLocaleDateString()} ${venta.horaCreacion}</td>
            <td>${venta.usuario ? `${venta.usuario.nombre} ${venta.usuario.apellido}` : 'Sin cliente'}</td>
            <td>$${venta.costoEnvio}</td>
            <td>${venta.estadoPedido}</td>
            <td>${venta.domiciliario ? venta.domiciliario.nombre : 'No asignado'}</td>
            <td>
                <button class="btn-detalles" data-id="${venta.idPedido}">Detalles</button>
                ${!venta.domiciliario ? `
                    <button class="btn-asignar" data-id="${venta.idPedido}">Asignar Domiciliario</button>
                ` : ''}
            </td>
        </tr>
    `).join('');

    // Asignar eventos a los botones de "Detalles"
    const botonesDetalles = cuerpoTablaVentas.querySelectorAll('.btn-detalles');
    botonesDetalles.forEach(boton => {
        boton.addEventListener('click', (event) => {
            const idPedido = event.target.getAttribute('data-id');
            mostrarDetallesVenta(idPedido, estadoGlobal);
        });
    });

    // Asignar eventos a los botones de "Asignar Domiciliario"
    const botonesAsignar = cuerpoTablaVentas.querySelectorAll('.btn-asignar');
    botonesAsignar.forEach(boton => {
        boton.addEventListener('click', (event) => {
            const idPedido = event.target.getAttribute('data-id');
            abrirModalAsignarDomiciliario(idPedido,estadoGlobal);
        });
    });
}
// Función para renderizar historial de ventas
function renderizarHistorialVentas(estadoGlobal) {
    const cuerpoTablaHistorial = document.getElementById('cuerpoTablaHistorial');
    const historialEmpty = document.getElementById('historial-empty');

    if (!cuerpoTablaHistorial || !historialEmpty) {
        console.error('No se encontraron los elementos necesarios para renderizar historial de ventas');
        return;
    }

    const historialVentas = estadoGlobal.historialVentas;

    if (historialVentas.length === 0) {
        cuerpoTablaHistorial.innerHTML = '';
        historialEmpty.style.display = 'block';
        return;
    }

    historialEmpty.style.display = 'none';
    cuerpoTablaHistorial.innerHTML = historialVentas.map(venta => `
        <tr>
            <td>${venta.idPedido}</td>
            <td>${new Date(venta.fechaPedido).toLocaleDateString()} ${venta.horaCreacion}</td>
            <td>${venta.usuario ? `${venta.usuario.nombre} ${venta.usuario.apellido}` : 'Sin cliente'}</td>
            <td>${venta.detalles.map(detalle => `
                <div>
                    <strong>${detalle.producto.nombre}</strong> (${detalle.cantidad} x $${detalle.producto.precioUnitario})
                </div>
            `).join('')}</td>
            <td>$${venta.costoEnvio}</td>
            <td>${venta.domiciliario ? venta.domiciliario.nombre : 'No asignado'}</td>
            <td>
                <button onclick="mostrarDetallesVenta(${venta.idPedido})" class="btn-detalles">Detalles</button>
            </td>
        </tr>
    `).join('');
}

// Función para mostrar detalles de una venta
function mostrarDetallesVenta(idPedido, estadoGlobal) {
    const venta = estadoGlobal.pedidos.find(pedido => pedido.idPedido === parseInt(idPedido));
    if (!venta) {
        alert('No se encontró la venta seleccionada');
        return;
    }

    const modal = document.getElementById('modalVenta');
    const modalContent = document.getElementById('detallesVenta');

    modalContent.innerHTML = `
        <h3>Detalles de la Venta</h3>
        <p><strong>ID Pedido:</strong> ${venta.idPedido}</p>
        <p><strong>Fecha:</strong> ${new Date(venta.fechaPedido).toLocaleDateString()} ${venta.horaCreacion}</p>
        <p><strong>Cliente:</strong> ${venta.usuario ? `${venta.usuario.nombre} ${venta.usuario.apellido}` : 'Sin cliente'}</p>
        <p><strong>Estado:</strong> ${venta.estadoPedido}</p>
        <p><strong>Costo de Envío:</strong> $${venta.costoEnvio}</p>
        <h4>Productos:</h4>
        <ul>
            ${venta.detalles.map(detalle => `
                <li>
                    <strong>${detalle.producto.nombre}</strong> - ${detalle.cantidad} x $${detalle.producto.precioUnitario}
                </li>
            `).join('')}
        </ul>
    `;

    modal.style.display = 'block';
}

// Configurar eventos
function configurarEventListeners(estadoGlobal) {
    document.getElementById('btnBuscar').addEventListener('click', () => buscarVentas(estadoGlobal));
    document.getElementById('btnCerrarModal').addEventListener('click', () => {
        document.getElementById('modalVenta').style.display = 'none';
    });
    document.getElementById('btnCerrarModalAsignar').addEventListener('click', () => {
        document.getElementById('modalAsignarDomiciliario').style.display = 'none';
    });
}

function abrirModalAsignarDomiciliario(idPedido, estadoGlobal) {
    cargarDomiciliarios(estadoGlobal); // Cargar los domiciliarios en el select
    const modal = document.getElementById('modalAsignarDomiciliario');
    modal.style.display = 'block';

    // Guardar el ID del pedido en un atributo del formulario para usarlo al asignar
    const formAsignarDomiciliario = document.getElementById('formAsignarDomiciliario');
    formAsignarDomiciliario.setAttribute('data-id-pedido', idPedido);
}
function cargarDomiciliarios(estadoGlobal) {
    const selectDomiciliario = document.getElementById('selectDomiciliario');
    if (!selectDomiciliario) {
        console.error('No se encontró el elemento select para los domiciliarios');
        return;
    }

    // Filtrar usuarios con rol "domiciliario"
    const domiciliarios = estadoGlobal.usuarios.filter(usuario => usuario.rol && usuario.rol.nombre === 'domiciliario');

    // Limpiar el select antes de agregar opciones
    selectDomiciliario.innerHTML = '<option value="">Seleccione un domiciliario</option>';

    // Agregar las opciones al select
    domiciliarios.forEach(domiciliario => {
        const option = document.createElement('option');
        option.value = domiciliario.id;
        option.textContent = `${domiciliario.nombre} ${domiciliario.apellido}`;
        selectDomiciliario.appendChild(option);
    });
}

function configurarFormularioAsignarDomiciliario(estadoGlobal) {
    const formAsignarDomiciliario = document.getElementById('formAsignarDomiciliario');
    formAsignarDomiciliario.addEventListener('submit', (event) => {
        event.preventDefault();

        const idPedido = formAsignarDomiciliario.getAttribute('data-id-pedido');
        const idDomiciliario = document.getElementById('selectDomiciliario').value;

        if (!idDomiciliario) {
            alert('Debe seleccionar un domiciliario');
            return;
        }

        // Actualizar el estado localmente (puedes reemplazar esto con una llamada al backend)
        const pedido = estadoGlobal.pedidos.find(p => p.idPedido === parseInt(idPedido));
        if (pedido) {
            const domiciliario = estadoGlobal.usuarios.find(u => u.id === parseInt(idDomiciliario));
            pedido.domiciliario = domiciliario;

            // Actualizar las tablas
            renderizarVentasActivas(estadoGlobal);
            renderizarHistorialVentas(estadoGlobal);

            alert(`Domiciliario asignado: ${domiciliario.nombre} ${domiciliario.apellido}`);
        }

        // Cerrar el modal
        document.getElementById('modalAsignarDomiciliario').style.display = 'none';
    });
}