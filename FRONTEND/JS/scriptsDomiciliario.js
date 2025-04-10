// Importar módulos
import estadoGlobal from "./estadoGlobal.js"

// Función para inicializar la vista de domiciliario
export async function inicializarDomiciliario() {
  console.log("Inicializando vista de domiciliario...")

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

  // Verificar sesión del domiciliario
  const sesionDomiciliario = verificarSesionDomiciliario()
  if (!sesionDomiciliario) {
    console.log("No hay sesión de domiciliario activa, redirigiendo a perfil")
    cambiarModulo("perfil-domiciliario")
  }

  // Configurar navegación entre módulos
  document.querySelectorAll("[data-module]").forEach((enlace) => {
    enlace.addEventListener("click", (event) => {
      event.preventDefault()
      const nombreModulo = enlace.getAttribute("data-module")

      // Si no hay sesión y no es el módulo de perfil, redirigir a perfil
      if (!verificarSesionDomiciliario() && nombreModulo !== "perfil-domiciliario") {
        mostrarNotificacion("Debe iniciar sesión para acceder a este módulo", "warning")
        cambiarModulo("perfil-domiciliario")
        return
      }

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

  // Cargar el módulo inicial
  if (sesionDomiciliario) {
    await cambiarModulo("pedidos-asignados")
  } else {
    await cambiarModulo("perfil-domiciliario")
  }
}

// Función para verificar si hay un domiciliario logueado
function verificarSesionDomiciliario() {
  try {
    const sesionDomiciliario = localStorage.getItem("sesionDomiciliario")
    return sesionDomiciliario ? JSON.parse(sesionDomiciliario) : null
  } catch (error) {
    console.error("Error al verificar sesión del domiciliario:", error)
    return null
  }
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

    // Cargar el CSS del módulo si no está cargado
    if (!document.querySelector(`link[href="modules/${nombreModulo}/${nombreModulo}.css"]`)) {
      const link = document.createElement("link")
      link.rel = "stylesheet"
      link.href = `modules/${nombreModulo}/${nombreModulo}.css`
      document.head.appendChild(link)
    }

    // Cargar el script del módulo
    try {
      const scriptModule = await import(`../modules/${nombreModulo}/${nombreModulo}.js`)
      if (scriptModule && typeof scriptModule.init === "function") {
        await scriptModule.init(estadoGlobal)
      }
    } catch (scriptError) {
      console.error(`Error al cargar el script del módulo ${nombreModulo}:`, scriptError)

      // Intentar cargar el script de forma tradicional si el import falla
      const script = document.createElement("script")
      script.src = `modules/${nombreModulo}/${nombreModulo}.js`
      script.onload = () => {
        console.log(`Script del módulo ${nombreModulo} cargado correctamente`)

        // Despachar evento personalizado cuando el módulo se cargue
        const event = new Event(`${nombreModulo}Cargado`)
        document.dispatchEvent(event)
      }
      document.body.appendChild(script)
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
                <button class="btn-primary" data-module="pedidos-asignados">Volver a Pedidos Asignados</button>
            </div>  data-module="pedidos-asignados">Volver a Pedidos Asignados</button>
            </div>
        `

    // Agregar evento al botón de volver
    document.querySelector(".error-message .btn-primary").addEventListener("click", (e) => {
      e.preventDefault()
      cambiarModulo("pedidos-asignados")
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

  // Configurar botón de cerrar sesión
  const btnCerrarSesion = document.getElementById("btnCerrarSesion")
  if (btnCerrarSesion) {
    btnCerrarSesion.addEventListener("click", (e) => {
      e.preventDefault()
      cerrarSesion()
    })
  }
}

// Función para cerrar sesión
function cerrarSesion() {
  // Eliminar datos de sesión
  localStorage.removeItem("sesionDomiciliario")

  // Mostrar notificación
  mostrarNotificacion("Sesión cerrada correctamente", "success")

  // Redirigir al perfil
  cambiarModulo("perfil-domiciliario")
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
      case "pedidos-asignados":
        sectionTitle.textContent = "Pedidos Asignados"
        break
      case "gestion-pagos":
        sectionTitle.textContent = "Gestión de Pagos"
        break
      case "historial-entregas":
        sectionTitle.textContent = "Historial de Entregas"
        break
      case "perfil-domiciliario":
        sectionTitle.textContent = "Mi Perfil"
        break
      default:
        sectionTitle.textContent = "Panel de Domiciliario"
    }
  }
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

// Inicializar la vista de domiciliario cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
  // Verificar si los datos globales ya están disponibles
  if (typeof window.datosGlobales !== "undefined") {
    inicializarDomiciliario()
  } else {
    // Si no están disponibles, esperar a que se carguen
    window.addEventListener("datosGlobalesDisponibles", inicializarDomiciliario)

    // Intentar inicializar después de un tiempo si el evento no se dispara
    setTimeout(() => {
      if (typeof window.datosGlobales === "undefined") {
        console.log("Inicializando sin datos globales...")
        inicializarDomiciliario()
      }
    }, 2000)
  }
})

// Exportar funciones necesarias
export { cambiarModulo, mostrarNotificacion }
