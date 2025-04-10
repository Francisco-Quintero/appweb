// Importar módulos
import { initDashboard } from "../modules/dashboard/dashboard.js"
import { initProductos } from "../modules/productos/productos.js"
import { initProveedores } from "../modules/Proveedores/proveedores.js"
import { initCompras } from "../modules/compras/compras.js"
import { initStock } from "../modules/stock/stock.js"
import { initUsuarios } from "../modules/Usuarios/Usuarios.js"
import { initVentas } from "../modules/ventas/ventas.js"
import estadoGlobal from "./estadoGlobal.js"

// Función para inicializar la gestión
export async function inicializarGestion() {
  console.log("Inicializando gestión...")

  // Inicializar Lucide icons
  if (window.lucide) {
    window.lucide.createIcons()
  } else {
    console.warn("Lucide no está disponible. Asegúrate de que el script está cargado correctamente.")
  }

  // Configurar eventos de usuario
  configurarEventosUsuario()

  // Configurar navegación responsiva
  configurarNavegacionResponsiva()

  // Configurar panel de notificaciones
  configurarPanelNotificaciones()

  // Asegurarse de que los datos iniciales estén cargados
  try {
    await estadoGlobal.cargarDatosIniciales()
    console.log("Datos iniciales cargados correctamente")
  } catch (error) {
    console.error("Error al cargar datos iniciales:", error)
    mostrarNotificacion("Error al cargar datos iniciales", "error")
  }

  // Escuchar cambios en el estado global y actualizar la interfaz según sea necesario
  estadoGlobal.registrarObservador("productosActualizados", (productos) => {
    console.log("Productos actualizados en gestión:", productos)
    actualizarInterfazUsuario()
  })

  estadoGlobal.registrarObservador("pedidosActualizados", (pedidos) => {
    console.log("Pedidos actualizados en gestión:", pedidos)
    actualizarInterfazUsuario()
  })

  estadoGlobal.registrarObservador("proveedoresActualizados", (proveedores) => {
    console.log("Proveedores actualizados en gestión:", proveedores)
    actualizarInterfazUsuario()
  })

  estadoGlobal.registrarObservador("usuariosActualizados", (usuarios) => {
    console.log("Usuarios actualizados en gestión:", usuarios)
    actualizarInterfazUsuario()
  })

  // Configurar navegación entre módulos
  document.querySelectorAll("[data-module]").forEach((enlace) => {
    enlace.addEventListener("click", (event) => {
      event.preventDefault()
      const nombreModulo = enlace.getAttribute("data-module")

      // Actualizar clase activa en la navegación
      document.querySelectorAll(".nav-item").forEach((item) => {
        item.classList.remove("active")
      })
      enlace.classList.add("active")

      // Actualizar título de la sección
      actualizarTituloSeccion(nombreModulo)

      // Cerrar menú móvil si está abierto
      const sidebar = document.getElementById("sidebar")
      if (sidebar.classList.contains("active")) {
        sidebar.classList.remove("active")
      }

      cambiarModulo(nombreModulo)
    })
  })

  // Cargar el módulo inicial (dashboard)
  await cambiarModulo("dashboard")
}

// Función para cambiar entre módulos
async function cambiarModulo(nombreModulo) {
  console.log(`Cambiando al módulo: ${nombreModulo}`)
  const contenedorPrincipal = document.getElementById("main-container")

  // Mostrar indicador de carga
  contenedorPrincipal.innerHTML = `
        <div class="loading-indicator">
            <div class="spinner"></div>
            <p>Cargando ${nombreModulo}...</p>
        </div>
    `

  try {
    // Cargar el HTML del módulo
    const response = await fetch(`modules/${nombreModulo}/${nombreModulo}.html`)
    if (!response.ok) {
      throw new Error(`Error al cargar el HTML del módulo ${nombreModulo}`)
    }
    const html = await response.text()
    contenedorPrincipal.innerHTML = html

    // Inicializar el módulo correspondiente
    switch (nombreModulo) {
      case "dashboard":
        await initDashboard(estadoGlobal)
        break
      case "productos":
        await initProductos(estadoGlobal)
        break
      case "proveedores":
        await initProveedores(estadoGlobal)
        break
      case "compras":
        await initCompras(estadoGlobal)
        break
      case "stock":
        await initStock(estadoGlobal)
        break
      case "Usuarios":
        await initUsuarios(estadoGlobal)
        break
      case "ventas":
        await initVentas(estadoGlobal)
        break
      default:
        console.error(`Módulo desconocido: ${nombreModulo}`)
        contenedorPrincipal.innerHTML = `
                    <div class="error-message">
                        <h2>Módulo no encontrado</h2>
                        <p>Lo sentimos, el módulo "${nombreModulo}" no está disponible.</p>
                        <button class="btn-primary" data-module="dashboard">Volver al dashboard</button>
                    </div>
                `

        // Agregar evento al botón de volver
        document.querySelector(".error-message .btn-primary").addEventListener("click", (e) => {
          e.preventDefault()
          cambiarModulo("dashboard")
        })
    }

    // Reinicializar los iconos después de cargar el nuevo contenido
    if (window.lucide) {
      window.lucide.createIcons()
    }
  } catch (error) {
    console.error("Error al cambiar de módulo:", error)
    contenedorPrincipal.innerHTML = `
            <div class="error-message">
                <h2>Error al cargar el módulo</h2>
                <p>${error.message}</p>
                <button class="btn-primary" data-module="dashboard">Volver al dashboard</button>
            </div>
        `

    // Agregar evento al botón de volver
    document.querySelector(".error-message .btn-primary").addEventListener("click", (e) => {
      e.preventDefault()
      cambiarModulo("dashboard")
    })
  }
}

// Configurar eventos relacionados con el usuario
function configurarEventosUsuario() {
  const userMenuButton = document.getElementById("userMenuButton")
  const userDropdown = document.getElementById("userDropdown")

  if (userMenuButton && userDropdown) {
    userMenuButton.addEventListener("click", () => {
      userDropdown.classList.toggle("show")
    })

    document.addEventListener("click", (event) => {
      if (!userMenuButton.contains(event.target) && !userDropdown.contains(event.target)) {
        userDropdown.classList.remove("show")
      }
    })
  }

  // Escuchar eventos de login y logout
  window.addEventListener("usuarioLogueado", () => {
    console.log("Usuario ha iniciado sesión")
    estadoGlobal.setUsuarioLogueado(true)
    actualizarInterfazUsuario()
  })

  window.addEventListener("usuarioDeslogueado", () => {
    console.log("Usuario ha cerrado sesión")
    estadoGlobal.setUsuarioLogueado(false)
    actualizarInterfazUsuario()
  })
}

// Configurar navegación responsiva
function configurarNavegacionResponsiva() {
  const sidebarToggle = document.getElementById("sidebarToggle")
  const closeSidebar = document.getElementById("closeSidebar")
  const sidebar = document.getElementById("sidebar")

  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener("click", () => {
      sidebar.classList.add("active")
    })
  }

  if (closeSidebar && sidebar) {
    closeSidebar.addEventListener("click", () => {
      sidebar.classList.remove("active")
    })
  }

  // Cerrar sidebar al hacer clic fuera
  document.addEventListener("click", (event) => {
    if (
      sidebar &&
      sidebar.classList.contains("active") &&
      !sidebar.contains(event.target) &&
      !sidebarToggle.contains(event.target)
    ) {
      sidebar.classList.remove("active")
    }
  })
}

// Configurar panel de notificaciones
function configurarPanelNotificaciones() {
  const notificationsButton = document.getElementById("notificationsButton")
  const notificationsPanel = document.getElementById("notificationsPanel")
  const closeNotifications = document.getElementById("closeNotifications")

  if (notificationsButton && notificationsPanel) {
    notificationsButton.addEventListener("click", () => {
      notificationsPanel.classList.toggle("show")
    })
  }

  if (closeNotifications && notificationsPanel) {
    closeNotifications.addEventListener("click", () => {
      notificationsPanel.classList.remove("show")
    })
  }

  // Cerrar panel al hacer clic fuera
  document.addEventListener("click", (event) => {
    if (
      notificationsPanel &&
      notificationsPanel.classList.contains("show") &&
      !notificationsPanel.contains(event.target) &&
      !notificationsButton.contains(event.target)
    ) {
      notificationsPanel.classList.remove("show")
    }
  })
}

// Función para actualizar el título de la sección
function actualizarTituloSeccion(nombreModulo) {
  const sectionTitle = document.getElementById("section-title")
  if (sectionTitle) {
    switch (nombreModulo) {
      case "dashboard":
        sectionTitle.textContent = "Dashboard de Inventario"
        break
      case "productos":
        sectionTitle.textContent = "Gestión de Productos"
        break
      case "proveedores":
        sectionTitle.textContent = "Gestión de Proveedores"
        break
      case "compras":
        sectionTitle.textContent = "Registro de Compras"
        break
      case "stock":
        sectionTitle.textContent = "Control de Stock"
        break
      case "Usuarios":
        sectionTitle.textContent = "Administración de Usuarios"
        break
      case "ventas":
        sectionTitle.textContent = "Registro de Ventas"
        break
      default:
        sectionTitle.textContent = "Sistema de Inventario"
    }
  }
}

// Función para actualizar la interfaz de usuario según el estado
function actualizarInterfazUsuario() {
  // Actualizar elementos de la interfaz según el estado global
  // Por ejemplo, mostrar/ocultar elementos según permisos de usuario
  console.log("Actualizando interfaz de usuario")
}

// Función para mostrar notificaciones
function mostrarNotificacion(mensaje, tipo) {
  // Crear elemento de notificación
  const notificacion = document.createElement("div")
  notificacion.className = `notificacion ${tipo}`
  notificacion.innerHTML = `
        <div class="notificacion-contenido">
            <i data-lucide="${tipo === "success" ? "check-circle" : tipo === "warning" ? "alert-triangle" : "alert-circle"}"></i>
            <span>${mensaje}</span>
        </div>
    `

  // Agregar al DOM
  document.body.appendChild(notificacion)

  // Inicializar iconos
  if (window.lucide) {
    window.lucide.createIcons()
  }

  // Mostrar con animación
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

// Inicializar la gestión cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
  inicializarGestion()
})

