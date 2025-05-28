// Importar módulos
import { initCatalogo } from "../modules/catalogo/catalogo.js"
import { initCarrito } from "../modules/carrito/carrito.js"
import { initPedidos } from "../modules/pedidos/pedidos.js"
import { initFacturas } from "../modules/facturas/facturas.js"


import estadoGlobal from "./estadoGlobal.js"
// Eliminamos la importación de lucide

// import { API_URL } from "../../JS/estadoGlobal";

// Función para inicializar la tienda
export async function inicializarTienda() {
    console.log("Inicializando tienda...")

    // Verificar el estado de sesión
    verificarEstadoSesion();

    // Inicializar Lucide icons - usamos la variable global
    if (window.lucide) {
        window.lucide.createIcons()
    } else {
        console.warn("Lucide no está disponible. Asegúrate de que el script está cargado correctamente.")
    }

    // Configurar eventos de usuario
    configurarEventosUsuario()

    // Configurar eventos de navegación responsiva
    configurarNavegacionResponsiva()

    // Configurar modal de login
    configurarModalLogin()

    // Asegurarse de que los datos iniciales estén cargados
    await estadoGlobal.cargarDatosIniciales()

    // Escuchar cambios en el estado global y actualizar la interfaz según sea necesario
    estadoGlobal.registrarObservador("inventarioActualizado", (inventario) => {
        console.log("Inventario actualizado en tienda:", inventario)
        actualizarInterfazUsuario()
    })

    estadoGlobal.registrarObservador("pedidosActualizados", (pedidos) => {
        console.log("Pedidos actualizados en tienda:", pedidos)
        actualizarInterfazUsuario()
    })

    estadoGlobal.registrarObservador("facturasActualizadas", (facturas) => {
        console.log("Facturas actualizadas en tienda:", facturas)
        actualizarInterfazUsuario()
    })

    estadoGlobal.registrarObservador("proveedoresActualizados", (proveedores) => {
        console.log("Proveedores actualizados en tienda:", proveedores)
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

            // Cerrar menú móvil si está abierto
            const mainNav = document.getElementById("mainNav")
            if (mainNav.classList.contains("active")) {
                mainNav.classList.remove("active")
            }

            cambiarModulo(nombreModulo)
        })
    })

    // Cargar el módulo inicial
    await cambiarModulo("catalogo")
}

// Función para cambiar entre módulos
async function cambiarModulo(nombreModulo) {
    console.log(`Cambiando al módulo: ${nombreModulo}`)
    const contenedorPrincipal = document.getElementById("contenedor-principal")

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
            case "catalogo":
                await initCatalogo(estadoGlobal)
                break
            case "carrito":
                await initCarrito(estadoGlobal)
                break
            case "pedidos":
                await initPedidos(estadoGlobal)
                break
            case "facturas":
                await initFacturas(estadoGlobal)
                break
            case "ofertas":
                // Implementar cuando se cree el módulo de ofertas
                contenedorPrincipal.innerHTML = `
                    <div class="module-header">
                        <h2>Ofertas Especiales</h2>
                        <p>Descubre nuestras mejores ofertas y promociones.</p>
                    </div>
                    <div class="module-content">
                        <p>Módulo de ofertas en desarrollo...</p>
                    </div>
                `
                break
            case "contacto":
                // Implementar cuando se cree el módulo de contacto
                contenedorPrincipal.innerHTML = `
                    <div class="module-header">
                        <h2>Ayuda y Contacto</h2>
                        <p>¿Necesitas ayuda? Estamos aquí para asistirte.</p>
                    </div>
                    <div class="module-content">
                        <p>Módulo de ayuda en desarrollo...</p>
                    </div>
                `
                break
            default:
                console.error(`Módulo desconocido: ${nombreModulo}`)
                contenedorPrincipal.innerHTML = `
                    <div class="error-message">
                        <h2>Módulo no encontrado</h2>
                        <p>Lo sentimos, el módulo "${nombreModulo}" no está disponible.</p>
                        <button class="btn-primary" data-module="catalogo">Volver al catálogo</button>
                    </div>
                `

                // Agregar evento al botón de volver
                document.querySelector(".error-message .btn-primary").addEventListener("click", (e) => {
                    e.preventDefault()
                    cambiarModulo("catalogo")
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
                <button class="btn-primary" data-module="catalogo">Volver al catálogo</button>
            </div>
        `

        // Agregar evento al botón de volver
        document.querySelector(".error-message .btn-primary").addEventListener("click", (e) => {
            e.preventDefault()
            cambiarModulo("catalogo")
        })
    }
}

// Configurar eventos relacionados con el usuario
function configurarEventosUsuario() {
    const loginButton = document.getElementById("loginButton");

    if (loginButton) {
        loginButton.addEventListener("click", () => {
            // Verificar si hay un usuario en el localStorage
            const usuarioGuardado = localStorage.getItem('user');
            if (usuarioGuardado) {
                const usuario = JSON.parse(usuarioGuardado);
                console.log(`Usuario logueado: ${usuario.username}`);
                mostrarMenuUsuario(usuario); // Mostrar menú de usuario
            } else {
                console.log("No hay usuario logueado. Mostrando modal de login.");
                mostrarModal(); // Mostrar modal de login
            }
        });
    }
}

// Configurar navegación responsiva
function configurarNavegacionResponsiva() {
    const menuToggle = document.getElementById("menuToggle")
    const mainNav = document.getElementById("mainNav")

    if (menuToggle && mainNav) {
        menuToggle.addEventListener("click", () => {
            mainNav.classList.toggle("active")
        })

        // Cerrar menú al hacer clic fuera
        document.addEventListener("click", (event) => {
            if (
                !mainNav.contains(event.target) &&
                !menuToggle.contains(event.target) &&
                mainNav.classList.contains("active")
            ) {
                mainNav.classList.remove("active")
            }
        })
    }
}

// Configurar modal de login
function configurarModalLogin() {
    const loginButton = document.getElementById("loginButton")
    const loginModal = document.getElementById("loginModal")
    const closeModal = document.querySelector(".close-modal")
    const loginForm = document.getElementById("loginForm")

    if (loginButton && loginModal) {
        loginButton.addEventListener("click", () => {
            loginModal.style.display = "flex"
        })

        closeModal.addEventListener("click", () => {
            loginModal.style.display = "none"
        })

        // Cerrar modal al hacer clic fuera
        window.addEventListener("click", (event) => {
            if (event.target === loginModal) {
                loginModal.style.display = "none"
            }
        })


        // Manejar envío del formulario
        loginForm.addEventListener("submit", (event) => {
            event.preventDefault()
            const username = document.getElementById("username").value
            const password = document.getElementById("password").value

            console.log("Intentando iniciar sesión con:", username)

            // Simulación de inicio de sesión
            setTimeout(async () => {
                // Aquí se conectaría con el backend para autenticar

                const response = await fetch(`${API_URL}/usuarios/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });

                if (response.ok) {
                    // Disparar evento de usuario logueado
                    const user = await response.json();
                    localStorage.setItem('user', JSON.stringify(user));
                    window.dispatchEvent(new Event("usuarioLogueado"))

                    // Cerrar modal
                    loginModal.style.display = "none"

                    // Limpiar formulario
                    loginForm.reset()

                    // Mostrar mensaje de éxito
                    mostrarNotificacion("¡Bienvenido de nuevo!", "success")
                } else {
                    // Mostrar error
                    mostrarNotificacion("Credenciales incorrectas", "error")
                }
            }, 1000)
        })
    }
}

function verificarEstadoSesion() {
    const usuarioGuardado = localStorage.getItem('user');
    if (usuarioGuardado) {
        const usuario = JSON.parse(usuarioGuardado);
        console.log(`Usuario logueado: ${usuario.username}`);
        actualizarInterfazUsuario(true, usuario);
    } else {
        console.log('No hay usuario logueado.');
        actualizarInterfazUsuario(false);
    }
}

// Función para actualizar la interfaz de usuario según el estado
function actualizarInterfazUsuario(estaLogueado, usuario = null) {
    const loginButton = document.getElementById("loginButton");

    if (estaLogueado) {
        // Usuario logueado
        if (loginButton) {
            loginButton.innerHTML = `
                <i data-lucide="user-check"></i>
                <span class="action-text">Mi Cuenta</span>
            `;

            // Cambiar comportamiento del botón
            loginButton.onclick = () => mostrarMenuUsuario(usuario);
        }
    } else {
        // Usuario no logueado
        if (loginButton) {
            loginButton.innerHTML = `
                <i data-lucide="user"></i>
                <span class="action-text">Iniciar Sesión</span>
            `;

            // Restaurar comportamiento del botón
            loginButton.onclick = mostrarModal;
        }
    }

    // Reinicializar iconos
    if (window.lucide) {
        window.lucide.createIcons();
    }
}
// Función para mostrar el modal de login
function mostrarModal() {
    const loginModal = document.getElementById("loginModal")
    loginModal.style.display = "flex"
}

// Función para mostrar el menú de usuario
function mostrarMenuUsuario() {
    // Aquí se implementaría la lógica para mostrar opciones de usuario
    console.log("Mostrando menú de usuario")
}

// Función para mostrar notificaciones
function mostrarNotificacion(mensaje, tipo) {
    // Crear elemento de notificación
    const notificacion = document.createElement("div")
    notificacion.className = `notificacion ${tipo}`
    notificacion.innerHTML = `
        <div class="notificacion-contenido">
            <i data-lucide="${tipo === "success" ? "check-circle" : "alert-circle"}"></i>
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

// Inicializar la tienda cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
    inicializarTienda()
})

