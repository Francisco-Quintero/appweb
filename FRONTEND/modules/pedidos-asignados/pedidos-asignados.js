// Módulo de Pedidos Asignados
console.log("Inicializando módulo de pedidos asignados...")

let mapa
let marcador

// Función para inicializar el módulo
function inicializarModuloPedidosAsignados() {
  console.log("Inicializando vista de pedidos asignados")

  // Mostrar estado de carga
  mostrarEstadoCarga(true)

  // Cargar datos del domiciliario actual
  const sesionDomiciliario = obtenerSesionDomiciliario()
  if (!sesionDomiciliario) {
    console.error("No hay sesión de domiciliario activa")
    mostrarError("No hay sesión de domiciliario activa. Por favor, inicie sesión.")
    return
  }

  // Cargar datos de pedidos asignados
  cargarPedidosAsignados(sesionDomiciliario)
    .then(() => {
      // Ocultar estado de carga
      mostrarEstadoCarga(false)

      // Configurar eventos del módulo
      configurarEventos()
    })
    .catch((error) => {
      console.error("Error al cargar pedidos asignados:", error)
      mostrarError("Error al cargar los pedidos asignados.")
    })
}

// Función para obtener la sesión del domiciliario
function obtenerSesionDomiciliario() {
  try {
    const sesionGuardada = localStorage.getItem("sesionDomiciliario")
    if (sesionGuardada) {
      return JSON.parse(sesionGuardada)
    }
    return null
  } catch (error) {
    console.error("Error al obtener sesión del domiciliario:", error)
    return null
  }
}

// Función para cargar los pedidos asignados al domiciliario
async function cargarPedidosAsignados(domiciliario) {
  try {
    // Cargar datos desde localStorage (en producción sería desde una API)
    const datosGuardados = JSON.parse(localStorage.getItem("datosGlobales") || "{}")
    const pedidosPendientes = datosGuardados.pedidosPendientes || []

    // Filtrar pedidos asignados a este domiciliario
    const pedidosAsignados = pedidosPendientes.filter(
      (pedido) => pedido.domiciliario && pedido.domiciliario.id === domiciliario.id,
    )

    console.log("Pedidos asignados cargados:", pedidosAsignados.length)

    // Guardar los pedidos en una variable global del módulo
    window.pedidosAsignados = pedidosAsignados

    // Renderizar la tabla de pedidos
    renderizarTablaPedidos(pedidosAsignados)

    return pedidosAsignados
  } catch (error) {
    console.error("Error al cargar pedidos asignados:", error)
    throw error
  }
}

// Función para renderizar la tabla de pedidos
function renderizarTablaPedidos(pedidos) {
  const tablaPedidos = document.getElementById("cuerpo-tabla-pedidos")
  const sinPedidos = document.getElementById("sin-pedidos")

  if (!tablaPedidos || !sinPedidos) {
    console.error("No se encontraron elementos necesarios en el DOM")
    return
  }

  if (!pedidos || pedidos.length === 0) {
    tablaPedidos.innerHTML = ""
    sinPedidos.style.display = "flex"
    return
  }

  sinPedidos.style.display = "none"

  tablaPedidos.innerHTML = pedidos
    .map(
      (pedido) => `
    <tr>
      <td>${pedido.idPedido}</td>
      <td>${pedido.cliente ? pedido.cliente.nombre : "Cliente no especificado"}</td>
      <td>${pedido.cliente ? pedido.cliente.direccion : "Dirección no especificada"}</td>
      <td>
        <span class="estado-pedido estado-${pedido.estadoPedido || "pendiente"}">
          ${formatearEstadoPedido(pedido.estadoPedido || "pendiente")}
        </span>
      </td>
      <td>
        <button class="btn-detalles" data-id="${pedido.idPedido}" onclick="verDetallesPedido(${pedido.idPedido})">
          <i data-lucide="eye"></i>
          <span>Ver Detalles</span>
        </button>
        ${
          pedido.estadoPedido !== "entregado"
            ? `
          <button class="btn-entregado" data-id="${pedido.idPedido}" onclick="marcarComoEntregado(${pedido.idPedido})">
            <i data-lucide="check"></i>
            <span>Marcar Entregado</span>
          </button>
        `
            : ""
        }
      </td>
    </tr>
  `,
    )
    .join("")

  // Inicializar iconos
  if (window.lucide) {
    window.lucide.createIcons()
  }
}

// Función para formatear el estado del pedido
function formatearEstadoPedido(estado) {
  switch (estado) {
    case "pendiente":
      return "Pendiente"
    case "en-camino":
      return "En Camino"
    case "entregado":
      return "Entregado"
    default:
      return estado.charAt(0).toUpperCase() + estado.slice(1)
  }
}

// Función para configurar eventos del módulo
function configurarEventos() {
  // Evento para filtrar pedidos
  const btnFiltrar = document.getElementById("btn-filtrar")
  if (btnFiltrar) {
    btnFiltrar.addEventListener("click", filtrarPedidos)
  }

  // Evento para cerrar el modal
  const cerrarModal = document.querySelector(".cerrar-modal")
  if (cerrarModal) {
    cerrarModal.addEventListener("click", () => {
      const modalDetalles = document.getElementById("modal-detalles-pedido")
      if (modalDetalles) {
        modalDetalles.style.display = "none"
      }
    })
  }

  // Evento para actualizar estado del pedido
  const btnActualizarEstado = document.getElementById("btn-actualizar-estado")
  if (btnActualizarEstado) {
    btnActualizarEstado.addEventListener("click", actualizarEstadoPedido)
  }

  // Cerrar modal al hacer clic fuera de él
  window.addEventListener("click", (event) => {
    const modalDetalles = document.getElementById("modal-detalles-pedido")
    if (event.target === modalDetalles) {
      modalDetalles.style.display = "none"
    }
  })
}

// Función para filtrar pedidos
function filtrarPedidos() {
  // Obtener valores de filtros
  const estado = document.getElementById("filtro-estado").value
  const fecha = document.getElementById("filtro-fecha").value

  console.log("Filtrando pedidos por:", { estado, fecha })

  // Si no hay pedidos asignados, no hay nada que filtrar
  if (!window.pedidosAsignados || window.pedidosAsignados.length === 0) {
    return
  }

  // Filtrar pedidos según los criterios
  let pedidosFiltrados = [...window.pedidosAsignados]

  // Filtrar por estado
  if (estado && estado !== "todos") {
    pedidosFiltrados = pedidosFiltrados.filter((pedido) => pedido.estadoPedido === estado)
  }

  // Filtrar por fecha
  if (fecha) {
    const fechaSeleccionada = new Date(fecha)
    fechaSeleccionada.setHours(0, 0, 0, 0)

    pedidosFiltrados = pedidosFiltrados.filter((pedido) => {
      const fechaPedido = new Date(pedido.fechaPedido)
      fechaPedido.setHours(0, 0, 0, 0)
      return fechaPedido.getTime() === fechaSeleccionada.getTime()
    })
  }

  // Renderizar los pedidos filtrados
  renderizarTablaPedidos(pedidosFiltrados)
}

// Función para ver detalles de un pedido
function verDetallesPedido(idPedido) {
  // Buscar el pedido por su ID
  const pedido = window.pedidosAsignados.find((p) => p.idPedido === idPedido)
  if (!pedido) {
    console.error("No se encontró el pedido con ID:", idPedido)
    return
  }

  console.log("Mostrando detalles del pedido:", idPedido)

  // Actualizar elementos del modal
  const idPedidoDetalle = document.getElementById("id-pedido-detalle")
  const detallesPedido = document.getElementById("detalles-pedido")
  const selectEstado = document.getElementById("actualizar-estado")
  const modalDetalles = document.getElementById("modal-detalles-pedido")

  if (idPedidoDetalle) {
    idPedidoDetalle.textContent = pedido.idPedido
  }

  if (detallesPedido) {
    // Formatear fecha del pedido
    const fechaPedido = pedido.fechaPedido ? new Date(pedido.fechaPedido) : new Date()
    const fechaFormateada = fechaPedido.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })

    // Calcular totales si no existen
    const subtotal = pedido.subtotal || pedido.items.reduce((total, item) => total + item.total, 0)
    const costoEnvio = pedido.costoEnvio || 0
    const total = pedido.total || subtotal + costoEnvio

    // Renderizar detalles
    detallesPedido.innerHTML = `
      <p><strong>Fecha del pedido:</strong> ${fechaFormateada}</p>
      <p><strong>Cliente:</strong> ${pedido.cliente ? pedido.cliente.nombre : "Cliente no especificado"}</p>
      <p><strong>Teléfono:</strong> ${pedido.cliente && pedido.cliente.telefono ? pedido.cliente.telefono : "No especificado"}</p>
      <p><strong>Dirección:</strong> ${pedido.cliente ? pedido.cliente.direccion : "Dirección no especificada"}</p>
      <p><strong>Estado actual:</strong> 
        <span class="estado-pedido estado-${pedido.estadoPedido || "pendiente"}">
          ${formatearEstadoPedido(pedido.estadoPedido || "pendiente")}
        </span>
      </p>
      
      <h4>Productos</h4>
      <table class="tabla-productos">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Precio</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${pedido.items
            .map(
              (item) => `
            <tr>
              <td>${item.nombre}</td>
              <td>${item.cantidad}</td>
              <td>$${item.precioUnitario.toFixed(2)}</td>
              <td>$${item.total.toFixed(2)}</td>
            </tr>
          `,
            )
            .join("")}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="3" style="text-align: right;"><strong>Subtotal:</strong></td>
            <td>$${subtotal.toFixed(2)}</td>
          </tr>
          <tr>
            <td colspan="3" style="text-align: right;"><strong>Costo de envío:</strong></td>
            <td>$${costoEnvio.toFixed(2)}</td>
          </tr>
          <tr>
            <td colspan="3" style="text-align: right;"><strong>Total:</strong></td>
            <td>$${total.toFixed(2)}</td>
          </tr>
        </tfoot>
      </table>
      
      ${
        pedido.observaciones
          ? `
        <h4>Observaciones</h4>
        <p>${pedido.observaciones}</p>
      `
          : ""
      }
    `

    // Inicializar mapa si hay coordenadas
    setTimeout(() => {
      inicializarMapa(pedido.cliente && pedido.cliente.coordenadas)
    }, 300)
  }

  if (selectEstado) {
    selectEstado.value = pedido.estadoPedido || "pendiente"
  }

  if (modalDetalles) {
    modalDetalles.style.display = "block"
  }

  // Inicializar iconos
  if (window.lucide) {
    window.lucide.createIcons()
  }
}

// Función para inicializar el mapa
function inicializarMapa(coordenadas) {
  const mapaEntrega = document.getElementById("mapa-entrega")
  if (!mapaEntrega) return

  // Coordenadas por defecto si no hay coordenadas específicas
  const latitud = coordenadas ? coordenadas.lat : 4.6097
  const longitud = coordenadas ? coordenadas.lng : -74.0817

  try {
    // Verificar si Leaflet está disponible
    if (typeof L !== "undefined") {
      // Si ya existe un mapa, eliminarlo
      if (mapa) {
        mapa.remove()
      }

      // Inicializar mapa
      mapa = L.map(mapaEntrega).setView([latitud, longitud], 15)

      // Añadir capa de mapa
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapa)

      // Añadir marcador
      marcador = L.marker([latitud, longitud]).addTo(mapa).bindPopup("Ubicación de entrega").openPopup()

      // Asegurar que el mapa se renderice correctamente
      setTimeout(() => {
        mapa.invalidateSize()
      }, 100)
    } else {
      console.error("Leaflet no está disponible")
      mapaEntrega.innerHTML = '<p class="error-mapa">No se pudo cargar el mapa</p>'
    }
  } catch (error) {
    console.error("Error al inicializar el mapa:", error)
    mapaEntrega.innerHTML = '<p class="error-mapa">Error al cargar el mapa</p>'
  }
}

// Función para actualizar el estado de un pedido
function actualizarEstadoPedido() {
  const idPedidoElement = document.getElementById("id-pedido-detalle")
  const selectEstado = document.getElementById("actualizar-estado")

  if (!idPedidoElement || !selectEstado) {
    console.error("No se encontraron elementos necesarios para actualizar el estado")
    return
  }

  const idPedido = Number.parseInt(idPedidoElement.textContent)
  const nuevoEstado = selectEstado.value

  console.log("Actualizando estado del pedido:", { idPedido, nuevoEstado })

  // Buscar el pedido
  const pedidoIndex = window.pedidosAsignados.findIndex((p) => p.idPedido === idPedido)
  if (pedidoIndex === -1) {
    console.error("No se encontró el pedido para actualizar")
    mostrarNotificacion("No se encontró el pedido", "error")
    return
  }

  // Actualizar el estado
  window.pedidosAsignados[pedidoIndex].estadoPedido = nuevoEstado

  // Si el estado es "entregado", manejar la entrega
  if (nuevoEstado === "entregado") {
    marcarComoEntregado(idPedido)
  } else {
    // Guardar cambios en localStorage
    guardarCambios()

    // Actualizar la interfaz
    renderizarTablaPedidos(window.pedidosAsignados)

    // Mostrar notificación
    mostrarNotificacion(`Pedido #${idPedido} actualizado a ${formatearEstadoPedido(nuevoEstado)}`, "success")

    // Cerrar modal
    const modalDetalles = document.getElementById("modal-detalles-pedido")
    if (modalDetalles) {
      modalDetalles.style.display = "none"
    }
  }
}

// Función para marcar un pedido como entregado
function marcarComoEntregado(idPedido) {
  console.log("Marcando pedido como entregado:", idPedido)

  // Buscar el pedido
  const pedidoIndex = window.pedidosAsignados.findIndex((p) => p.idPedido === idPedido)
  if (pedidoIndex === -1) {
    console.error("No se encontró el pedido para marcar como entregado")
    mostrarNotificacion("No se encontró el pedido", "error")
    return
  }

  // Obtener el pedido
  const pedido = window.pedidosAsignados[pedidoIndex]

  // Cambiar el estado a "entregado"
  pedido.estadoPedido = "entregado"
  pedido.fechaEntrega = new Date().toISOString()

  // Eliminar el pedido de pedidos asignados
  window.pedidosAsignados.splice(pedidoIndex, 1)

  // Guardar cambios en localStorage
  guardarCambios(pedido)

  // Actualizar la interfaz
  renderizarTablaPedidos(window.pedidosAsignados)

  // Mostrar notificación
  mostrarNotificacion(`Pedido #${idPedido} marcado como entregado`, "success")

  // Cerrar modal si está abierto
  const modalDetalles = document.getElementById("modal-detalles-pedido")
  if (modalDetalles) {
    modalDetalles.style.display = "none"
  }
}

// Función para guardar cambios en localStorage
function guardarCambios(pedidoEntregado = null) {
  try {
    // Obtener datos actuales
    const datosGuardados = JSON.parse(localStorage.getItem("datosGlobales") || "{}")

    // Actualizar pedidos pendientes
    const pedidosPendientes = datosGuardados.pedidosPendientes || []

    // Si hay un pedido entregado, moverlo al historial de ventas
    if (pedidoEntregado) {
      // Eliminar el pedido de pedidos pendientes
      const pedidoIndex = pedidosPendientes.findIndex((p) => p.idPedido === pedidoEntregado.idPedido)
      if (pedidoIndex !== -1) {
        pedidosPendientes.splice(pedidoIndex, 1)
      }

      // Añadir al historial de ventas
      datosGuardados.historialVentas = datosGuardados.historialVentas || []
      datosGuardados.historialVentas.push(pedidoEntregado)
    } else {
      // Actualizar los estados de los pedidos pendientes
      window.pedidosAsignados.forEach((pedidoActualizado) => {
        const pedidoIndex = pedidosPendientes.findIndex((p) => p.idPedido === pedidoActualizado.idPedido)
        if (pedidoIndex !== -1) {
          pedidosPendientes[pedidoIndex] = pedidoActualizado
        }
      })
    }

    // Actualizar los datos
    datosGuardados.pedidosPendientes = pedidosPendientes

    // Guardar en localStorage
    localStorage.setItem("datosGlobales", JSON.stringify(datosGuardados))

    console.log("Cambios guardados en localStorage")
  } catch (error) {
    console.error("Error al guardar cambios en localStorage:", error)
    mostrarNotificacion("Error al guardar los cambios", "error")
  }
}

// Función para mostrar el estado de carga
function mostrarEstadoCarga(mostrar) {
  const estadoCarga = document.getElementById("estado-carga")
  const tablaPedidos = document.getElementById("pedidos-activos")

  if (estadoCarga) {
    estadoCarga.style.display = mostrar ? "flex" : "none"
  }

  if (tablaPedidos) {
    tablaPedidos.style.display = mostrar ? "none" : "block"
  }
}

// Función para mostrar un mensaje de error
function mostrarError(mensaje) {
  console.error(mensaje)

  // Ocultar estado de carga
  mostrarEstadoCarga(false)

  // Mostrar mensaje de error en la interfaz
  const sinPedidos = document.getElementById("sin-pedidos")
  if (sinPedidos) {
    sinPedidos.innerHTML = `
      <i data-lucide="alert-circle"></i>
      <p>${mensaje}</p>
    `
    sinPedidos.style.display = "flex"
  }

  // Inicializar iconos
  if (window.lucide) {
    window.lucide.createIcons()
  }
}

// Función para mostrar notificaciones
function mostrarNotificacion(mensaje, tipo) {
  // Crear elemento de notificación
  const notificacion = document.createElement("div")
  notificacion.className = `notificacion ${tipo}`
  notificacion.innerHTML = `
    <div class="notificacion-contenido">
      <i data-lucide="${tipo === "success" ? "check-circle" : tipo === "error" ? "alert-circle" : "info"}"></i>
      <span>${mensaje}</span>
    </div>
  `

  // Añadir al DOM
  document.body.appendChild(notificacion)

  // Inicializar iconos
  if (window.lucide) {
    window.lucide.createIcons()
  }

  // Mostrar notificación
  setTimeout(() => {
    notificacion.classList.add("visible")
  }, 10)

  // Eliminar después de un tiempo
  setTimeout(() => {
    notificacion.classList.remove("visible")
    setTimeout(() => {
      document.body.removeChild(notificacion)
    }, 300)
  }, 3000)
}

// Exponer funciones necesarias a nivel global
window.inicializarModuloPedidosAsignados = inicializarModuloPedidosAsignados
window.verDetallesPedido = verDetallesPedido
window.marcarComoEntregado = marcarComoEntregado
window.filtrarPedidos = filtrarPedidos

// Inicializar el módulo cuando se carga el script
document.addEventListener("pedidos-asignadosCargado", inicializarModuloPedidosAsignados)

// Import Leaflet library
var L = require("leaflet")
