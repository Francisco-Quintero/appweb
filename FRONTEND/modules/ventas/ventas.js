// import { API_URL } from "../../JS/estadoGlobal";
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
    
    // Inicializar iconos de Lucide
    if (window.lucide) {
        window.lucide.createIcons();
    }

    console.log('Módulo de ventas cargado completamente');
}

// Función para filtrar y cargar ventas activas
function cargarVentasActivas(estadoGlobal) {
    const estadosActivos = ['Pendiente', 'en proceso', 'en camino'];
    const ventasActivas = estadoGlobal.pedidos.filter(pedido => estadosActivos.includes(pedido.estadoPedido));
    estadoGlobal.actualizarVentasActivas(ventasActivas);
    console.log(`Ventas activas cargadas: ${ventasActivas.length}`);
}

// Función para filtrar y cargar historial de ventas
function cargarHistorialVentas(estadoGlobal) {
    const historialVentas = estadoGlobal.pedidos.filter(pedido => pedido.estadoPedido === 'completado');
    estadoGlobal.actualizarHistorialVentas(historialVentas);
    console.log(`Historial de ventas cargado: ${historialVentas.length}`);
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
        ventasEmpty.style.display = 'flex';
        return;
    }

    ventasEmpty.style.display = 'none';
    
    // Crear fragmento para mejor rendimiento
    const fragmento = document.createDocumentFragment();
    
    // Crear filas de ventas activas
    ventasActivas.forEach(venta => {
        const fila = document.createElement('tr');
        
        // Determinar la clase de estado
        let estadoClase = '';
        switch(venta.estadoPedido.toLowerCase()) {
            case 'pendiente':
                estadoClase = 'estado-pendiente';
                break;
            case 'en proceso':
                estadoClase = 'estado-en-proceso';
                break;
            case 'en camino':
                estadoClase = 'estado-en-camino';
                break;
            case 'completado':
                estadoClase = 'estado-completado';
                break;
            default:
                estadoClase = '';
        }
        
        fila.innerHTML = `
            <td>${venta.idPedido}</td>
            <td>${new Date(venta.fechaPedido).toLocaleDateString()} ${venta.horaCreacion || ''}</td>
            <td>${venta.usuario ? `${venta.usuario.nombre} ${venta.usuario.apellido}` : 'Sin cliente'}</td>
            <td>$${venta.costoEnvio}</td>
            <td><span class="${estadoClase}">${venta.estadoPedido}</span></td>
            <td>${venta.domiciliario ? venta.domiciliario.nombre : 'No asignado'}</td>
            <td>
                <button class="btn-detalles" data-id="${venta.idPedido}">
                    <i data-lucide="eye"></i> Detalles
                </button>
                ${!venta.domiciliario ? `
                    <button class="btn-asignar" data-id="${venta.idPedido}">
                        <i data-lucide="user-plus"></i> Asignar
                    </button>
                ` : ''}
            </td>
        `;
        fragmento.appendChild(fila);
    });

    // Limpiar y agregar todas las filas de una vez
    cuerpoTablaVentas.innerHTML = '';
    cuerpoTablaVentas.appendChild(fragmento);
    
    // Inicializar iconos de Lucide
    if (window.lucide) {
        window.lucide.createIcons();
    }

    // Asignar eventos a los botones
    asignarEventosBotonesVentasActivas(cuerpoTablaVentas, estadoGlobal);
}

// Función para asignar eventos a los botones de ventas activas
function asignarEventosBotonesVentasActivas(cuerpoTabla, estadoGlobal) {
    // Asignar eventos a los botones de "Detalles"
    cuerpoTabla.querySelectorAll('.btn-detalles').forEach(boton => {
        boton.addEventListener('click', () => {
            const idPedido = parseInt(boton.dataset.id);
            mostrarDetallesVenta(idPedido, estadoGlobal);
        });
    });

    // Asignar eventos a los botones de "Asignar Domiciliario"
    cuerpoTabla.querySelectorAll('.btn-asignar').forEach(boton => {
        boton.addEventListener('click', () => {
            const idPedido = parseInt(boton.dataset.id);
            abrirModalAsignarDomiciliario(idPedido, estadoGlobal);
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
        historialEmpty.style.display = 'flex';
        return;
    }

    historialEmpty.style.display = 'none';
    
    // Crear fragmento para mejor rendimiento
    const fragmento = document.createDocumentFragment();
    
    // Crear filas de historial de ventas
    historialVentas.forEach(venta => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${venta.idPedido}</td>
            <td>${new Date(venta.fechaPedido).toLocaleDateString()} ${venta.horaCreacion || ''}</td>
            <td>${venta.usuario ? `${venta.usuario.nombre} ${venta.usuario.apellido}` : 'Sin cliente'}</td>
            <td>${venta.detalles.map(detalle => `
                <div class="producto-item">
                    ${detalle.producto.nombre} (${detalle.cantidad} x $${detalle.producto.precioUnitario})
                </div>
            `).join('')}</td>
            <td>$${venta.costoEnvio}</td>
            <td>${venta.domiciliario ? venta.domiciliario.nombre : 'No asignado'}</td>
            <td>
                <button class="btn-detalles" data-id="${venta.idPedido}">
                    <i data-lucide="eye"></i> Detalles
                </button>
            </td>
        `;
        fragmento.appendChild(fila);
    });

    // Limpiar y agregar todas las filas de una vez
    cuerpoTablaHistorial.innerHTML = '';
    cuerpoTablaHistorial.appendChild(fragmento);
    
    // Inicializar iconos de Lucide
    if (window.lucide) {
        window.lucide.createIcons();
    }

    // Asignar eventos a los botones de "Detalles"
    cuerpoTablaHistorial.querySelectorAll('.btn-detalles').forEach(boton => {
        boton.addEventListener('click', () => {
            const idPedido = parseInt(boton.dataset.id);
            mostrarDetallesVenta(idPedido, estadoGlobal);
        });
    });
}

// Función para mostrar detalles de una venta
function mostrarDetallesVenta(idPedido, estadoGlobal) {
    const venta = estadoGlobal.pedidos.find(pedido => pedido.idPedido === idPedido);
    if (!venta) {
        mostrarNotificacion('No se encontró la venta seleccionada', 'error');
        return;
    }

    const modal = document.getElementById('modalVenta');
    const modalContent = document.getElementById('detallesVenta');
    
    // Calcular el total de la venta
    const subtotal = venta.detalles.reduce((total, detalle) => {
        return total + (detalle.cantidad * detalle.producto.precioUnitario);
    }, 0);
    
    const total = subtotal + venta.costoEnvio;

    modalContent.innerHTML = `
        <div class="detalles-grid">
            <p><strong>ID Pedido:</strong> ${venta.idPedido}</p>
            <p><strong>Fecha:</strong> ${new Date(venta.fechaPedido).toLocaleDateString()} ${venta.horaCreacion || ''}</p>
            <p><strong>Cliente:</strong> ${venta.usuario ? `${venta.usuario.nombre} ${venta.usuario.apellido}` : 'Sin cliente'}</p>
            <p><strong>Estado:</strong> <span class="estado-${venta.estadoPedido.toLowerCase().replace(' ', '-')}">${venta.estadoPedido}</span></p>
            <p><strong>Domiciliario:</strong> ${venta.domiciliario ? venta.domiciliario.nombre : 'No asignado'}</p>
            <p><strong>Dirección de entrega:</strong> ${venta.direccionEntrega || 'No especificada'}</p>
        </div>
        
        <h4>Productos</h4>
        <ul>
            ${venta.detalles.map(detalle => `
                <li>
                    <span>${detalle.producto.nombre} (${detalle.cantidad} x $${detalle.producto.precioUnitario})</span>
                    <span>$${detalle.cantidad * detalle.producto.precioUnitario}</span>
                </li>
            `).join('')}
        </ul>
        
        <div class="total">
            <p>Subtotal: $${subtotal}</p>
            <p>Costo de envío: $${venta.costoEnvio}</p>
            <p><strong>Total: $${total}</strong></p>
        </div>
    `;

    modal.style.display = 'block';
    
    // Inicializar iconos de Lucide
    if (window.lucide) {
        window.lucide.createIcons();
    }
}

// Función para abrir el modal de asignar domiciliario
function abrirModalAsignarDomiciliario(idPedido, estadoGlobal) {
    cargarDomiciliarios(estadoGlobal); // Cargar los domiciliarios en el select
    const modal = document.getElementById('modalAsignarDomiciliario');
    modal.style.display = 'block';

    // Guardar el ID del pedido en un atributo del formulario para usarlo al asignar
    const formAsignarDomiciliario = document.getElementById('formAsignarDomiciliario');
    formAsignarDomiciliario.setAttribute('data-id-pedido', idPedido);
    
    // Inicializar iconos de Lucide
    if (window.lucide) {
        window.lucide.createIcons();
    }
}

// Función para cargar domiciliarios en el select
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

// Función para configurar el formulario de asignar domiciliario
function configurarFormularioAsignarDomiciliario(estadoGlobal) {
    const formAsignarDomiciliario = document.getElementById('formAsignarDomiciliario');
    if (!formAsignarDomiciliario) {
        console.error('No se encontró el formulario para asignar domiciliario');
        return;
    }
    
    formAsignarDomiciliario.addEventListener('submit', async (event) => {
        event.preventDefault();

        const idPedido = formAsignarDomiciliario.getAttribute('data-id-pedido');
        const idDomiciliario = document.getElementById('selectDomiciliario').value;

        if (!idDomiciliario) {
            mostrarNotificacion('Debe seleccionar un domiciliario', 'warning');
            return;
        }

        try {
            // Mostrar indicador de carga
            mostrarNotificacion('Asignando domiciliario...', 'info');
            
            console.log(JSON.stringify({ idDomiciliario: parseInt(idDomiciliario) }));
            // Actualizar el pedido en el backend
            const response = await fetch(`${API_URL}/pedidos/${idPedido}/asignar-domiciliario`, {
                method: 'PUT',                                                      
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ idDomiciliario: parseInt(idDomiciliario) }),
            });

            if (!response.ok) {
                throw new Error(`Error al asignar domiciliario: ${response.statusText}`);
            }

            const pedidoActualizado = await response.json();

            // Actualizar el estado global
            const index = estadoGlobal.pedidos.findIndex(p => p.idPedido === parseInt(idPedido));
            if (index !== -1) {
                estadoGlobal.pedidos[index] = pedidoActualizado;
            }

            // Notificar cambios en el estado global
            estadoGlobal.notificar('pedidosActualizados', estadoGlobal.pedidos);

            // Actualizar las tablas
            cargarVentasActivas(estadoGlobal);
            cargarHistorialVentas(estadoGlobal);
            renderizarVentasActivas(estadoGlobal);
            renderizarHistorialVentas(estadoGlobal);

            mostrarNotificacion(`Domiciliario asignado correctamente: ${pedidoActualizado.domiciliario.nombre}`, 'success');
        } catch (error) {
            console.error('Error al asignar domiciliario:', error);
            mostrarNotificacion('Error al asignar el domiciliario', 'error');
        }

        // Cerrar el modal
        document.getElementById('modalAsignarDomiciliario').style.display = 'none';
    });
}

// Función para buscar ventas
function buscarVentas(estadoGlobal) {
    const terminoBusqueda = document.getElementById('busquedaVenta').value.trim().toLowerCase();
    const panelActivo = document.getElementById('ventasActivas').style.display !== 'none' ? 'activas' : 'historial';
    
    if (!terminoBusqueda) {
        if (panelActivo === 'activas') {
            renderizarVentasActivas(estadoGlobal);
        } else {
            renderizarHistorialVentas(estadoGlobal);
        }
        return;
    }
    
    // Filtrar ventas según el panel activo
    const ventas = panelActivo === 'activas' ? estadoGlobal.ventasActivas : estadoGlobal.historialVentas;
    
    const ventasFiltradas = ventas.filter(venta => 
        venta.idPedido.toString().includes(terminoBusqueda) ||
        (venta.usuario && `${venta.usuario.nombre} ${venta.usuario.apellido}`.toLowerCase().includes(terminoBusqueda)) ||
        venta.estadoPedido.toLowerCase().includes(terminoBusqueda) ||
        (venta.domiciliario && venta.domiciliario.nombre.toLowerCase().includes(terminoBusqueda))
    );
    
    // Renderizar resultados según el panel activo
    if (panelActivo === 'activas') {
        const cuerpoTablaVentas = document.getElementById('cuerpoTablaVentas');
        const ventasEmpty = document.getElementById('ventas-empty');
        
        if (ventasFiltradas.length === 0) {
            cuerpoTablaVentas.innerHTML = `<tr><td colspan="7" class="text-center">No se encontraron ventas con el término "${terminoBusqueda}"</td></tr>`;
            ventasEmpty.style.display = 'none';
            return;
        }
        
        ventasEmpty.style.display = 'none';
        
        // Crear fragmento para mejor rendimiento
        const fragmento = document.createDocumentFragment();
        
        // Crear filas de ventas filtradas
        ventasFiltradas.forEach(venta => {
            const fila = document.createElement('tr');
            
            // Determinar la clase de estado
            let estadoClase = '';
            switch(venta.estadoPedido.toLowerCase()) {
                case 'pendiente':
                    estadoClase = 'estado-pendiente';
                    break;
                case 'en proceso':
                    estadoClase = 'estado-en-proceso';
                    break;
                case 'en camino':
                    estadoClase = 'estado-en-camino';
                    break;
                case 'completado':
                    estadoClase = 'estado-completado';
                    break;
                default:
                    estadoClase = '';
            }
            
            fila.innerHTML = `
                <td>${venta.idPedido}</td>
                <td>${new Date(venta.fechaPedido).toLocaleDateString()} ${venta.horaCreacion || ''}</td>
                <td>${venta.usuario ? `${venta.usuario.nombre} ${venta.usuario.apellido}` : 'Sin cliente'}</td>
                <td>$${venta.costoEnvio}</td>
                <td><span class="${estadoClase}">${venta.estadoPedido}</span></td>
                <td>${venta.domiciliario ? venta.domiciliario.nombre : 'No asignado'}</td>
                <td>
                    <button class="btn-detalles" data-id="${venta.idPedido}">
                        <i data-lucide="eye"></i> Detalles
                    </button>
                    ${!venta.domiciliario ? `
                        <button class="btn-asignar" data-id="${venta.idPedido}">
                            <i data-lucide="user-plus"></i> Asignar
                        </button>
                    ` : ''}
                </td>
            `;
            fragmento.appendChild(fila);
        });
        
        // Limpiar y agregar todas las filas de una vez
        cuerpoTablaVentas.innerHTML = '';
        cuerpoTablaVentas.appendChild(fragmento);
        
        // Inicializar iconos de Lucide
        if (window.lucide) {
            window.lucide.createIcons();
        }
        
        // Asignar eventos a los botones
        asignarEventosBotonesVentasActivas(cuerpoTablaVentas, estadoGlobal);
    } else {
        const cuerpoTablaHistorial = document.getElementById('cuerpoTablaHistorial');
        const historialEmpty = document.getElementById('historial-empty');
        
        if (ventasFiltradas.length === 0) {
            cuerpoTablaHistorial.innerHTML = `<tr><td colspan="7" class="text-center">No se encontraron ventas con el término "${terminoBusqueda}"</td></tr>`;
            historialEmpty.style.display = 'none';
            return;
        }
        
        historialEmpty.style.display = 'none';
        
        // Crear fragmento para mejor rendimiento
        const fragmento = document.createDocumentFragment();
        
        // Crear filas de historial de ventas filtradas
        ventasFiltradas.forEach(venta => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${venta.idPedido}</td>
                <td>${new Date(venta.fechaPedido).toLocaleDateString()} ${venta.horaCreacion || ''}</td>
                <td>${venta.usuario ? `${venta.usuario.nombre} ${venta.usuario.apellido}` : 'Sin cliente'}</td>
                <td>${venta.detalles.map(detalle => `
                    <div class="producto-item">
                        ${detalle.producto.nombre} (${detalle.cantidad} x $${detalle.producto.precioUnitario})
                    </div>
                `).join('')}</td>
                <td>$${venta.costoEnvio}</td>
                <td>${venta.domiciliario ? venta.domiciliario.nombre : 'No asignado'}</td>
                <td>
                    <button class="btn-detalles" data-id="${venta.idPedido}">
                        <i data-lucide="eye"></i> Detalles
                    </button>
                </td>
            `;
            fragmento.appendChild(fila);
        });
        
        // Limpiar y agregar todas las filas de una vez
        cuerpoTablaHistorial.innerHTML = '';
        cuerpoTablaHistorial.appendChild(fragmento);
        
        // Inicializar iconos de Lucide
        if (window.lucide) {
            window.lucide.createIcons();
        }
        
        // Asignar eventos a los botones de "Detalles"
        cuerpoTablaHistorial.querySelectorAll('.btn-detalles').forEach(boton => {
            boton.addEventListener('click', () => {
                const idPedido = parseInt(boton.dataset.id);
                mostrarDetallesVenta(idPedido, estadoGlobal);
            });
        });
    }
    
    mostrarNotificacion(`Se encontraron ${ventasFiltradas.length} ventas`, 'info');
}

// Función para mostrar notificaciones
function mostrarNotificacion(mensaje, tipo) {
    // Verificar si ya existe un contenedor de notificaciones
    let contenedorNotificaciones = document.querySelector('.notificaciones-container');
    
    if (!contenedorNotificaciones) {
        contenedorNotificaciones = document.createElement('div');
        contenedorNotificaciones.className = 'notificaciones-container';
        document.body.appendChild(contenedorNotificaciones);
    }
    
    // Crear la notificación
    const notificacion = document.createElement('div');
    notificacion.className = `notificacion ${tipo}`;
    
    // Determinar el icono según el tipo
    let icono = 'info';
    if (tipo === 'success') icono = 'check-circle';
    else if (tipo === 'error') icono = 'alert-circle';
    else if (tipo === 'warning') icono = 'alert-triangle';
    
    notificacion.innerHTML = `
        <i data-lucide="${icono}"></i>
        <span>${mensaje}</span>
    `;
    
    // Agregar al contenedor
    contenedorNotificaciones.appendChild(notificacion);
    
    // Inicializar iconos de Lucide
    if (window.lucide) {
        window.lucide.createIcons();
    }
    
    // Eliminar después de 3 segundos
    setTimeout(() => {
        notificacion.remove();
    }, 3000);
}

// Configurar eventos
function configurarEventListeners(estadoGlobal) {
    // Botón de búsqueda
    const btnBuscar = document.getElementById('btnBuscar');
    if (btnBuscar) {
        btnBuscar.addEventListener('click', () => buscarVentas(estadoGlobal));
    }
    
    // Búsqueda con Enter
    const busquedaVenta = document.getElementById('busquedaVenta');
    if (busquedaVenta) {
        busquedaVenta.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                buscarVentas(estadoGlobal);
            }
        });
    }
    
    // Botones para cerrar modales
    document.getElementById('btnCerrarModal').addEventListener('click', () => {
        document.getElementById('modalVenta').style.display = 'none';
    });
    
    document.getElementById('btnCerrarModalAsignar').addEventListener('click', () => {
        document.getElementById('modalAsignarDomiciliario').style.display = 'none';
    });
    
    // Cerrar modales al hacer clic fuera del contenido
    const modales = document.querySelectorAll('.modal');
    modales.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    });
    
    // Cambio entre ventas activas e historial
    const btnVerHistorial = document.getElementById('btnVerHistorial');
    if (btnVerHistorial) {
        btnVerHistorial.addEventListener('click', () => {
            document.getElementById('ventasActivas').style.display = 'none';
            document.getElementById('historialVentas').style.display = 'block';
        });
    }
    
    const btnVolverActivas = document.getElementById('btnVolverActivas');
    if (btnVolverActivas) {
        btnVolverActivas.addEventListener('click', () => {
            document.getElementById('historialVentas').style.display = 'none';
            document.getElementById('ventasActivas').style.display = 'block';
        });
    }
}