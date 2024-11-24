function inicializarTienda() {
    const userMenuButton = document.getElementById('userMenuButton');
    const userDropdown = document.getElementById('userDropdown');

    // Verificar si hay un usuario logueado al iniciar
    if (window.verificarUsuarioParaPedido && window.verificarUsuarioParaPedido()) {
        console.log('Usuario ya logueado');
        document.body.classList.add('usuario-logueado');
    } else {
        console.log('Usuario no logueado');
        document.body.classList.remove('usuario-logueado');
    }

    // Escuchar eventos de login y logout
    window.addEventListener('usuarioLogueado', function() {
        console.log('Usuario ha iniciado sesión');
        document.body.classList.add('usuario-logueado');
    });

    window.addEventListener('usuarioDeslogueado', function() {
        console.log('Usuario ha cerrado sesión');
        document.body.classList.remove('usuario-logueado');
    });

    // Función para cargar módulos
    function cargarModulo(nombreModulo) {
        const contenedorPrincipal = document.getElementById('main-container');
        
        // Verificar si el usuario está logueado
        if (nombreModulo !== 'usuario' && !window.verificarUsuarioParaPedido()) {
            console.log('Usuario no logueado, redirigiendo al módulo de usuario');
            nombreModulo = 'usuario';
        }
        
        // Eliminar scripts y estilos previos del módulo
        document.querySelectorAll(`script[data-module="${nombreModulo}"]`).forEach(el => el.remove());
        document.querySelectorAll(`link[data-module="${nombreModulo}"]`).forEach(el => el.remove());

        fetch(`modules/${nombreModulo}/${nombreModulo}.html`)
            .then(response => response.text())
            .then(html => {
                contenedorPrincipal.innerHTML = html;
                
                // Cargar el CSS del módulo
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = `modules/${nombreModulo}/${nombreModulo}.css`;
                link.setAttribute('data-module', nombreModulo);
                document.head.appendChild(link);
                
                // Cargar el script del módulo
                const script = document.createElement('script');
                script.src = `modules/${nombreModulo}/${nombreModulo}.js`;
                script.setAttribute('data-module', nombreModulo);
                script.onload = function() {
                    console.log("cargando el modulo de " + nombreModulo);
                    if (nombreModulo === 'catalogo' && typeof renderizarCatalogo === 'function' && typeof window.datosGlobales !== 'undefined') {
                        renderizarCatalogo(window.datosGlobales);
                    }
                };
                document.body.appendChild(script);
            })
            .catch(error => console.error(`Error al cargar el módulo ${nombreModulo}:`, error));
    }

    // Configurar navegación
    document.querySelectorAll('[data-module]').forEach(enlace => {
        enlace.addEventListener('click', function(e) {
            e.preventDefault();
            const nombreModulo = this.getAttribute('data-module');
            cargarModulo(nombreModulo);
            //document.getElementById('section-title').textContent = this.textContent;
        });
    });

    // Configurar menú de usuario
    if (userMenuButton && userDropdown) {
        userMenuButton.addEventListener('click', function() {
            userDropdown.classList.toggle('show');
        });

        document.addEventListener('click', function(event) {
            if (!userMenuButton.contains(event.target) && !userDropdown.contains(event.target)) {
                userDropdown.classList.remove('show');
            }
        });
    }

    // Cargar el módulo inicial
    cargarModulo('catalogo');
}

// Esperar a que los datos globales estén disponibles
if (typeof window.datosGlobales !== 'undefined') {
    inicializarTienda();
} else {
    window.addEventListener('datosGlobalesDisponibles', inicializarTienda);
}

// function renderizarCatalogo(appState) {
//     console.log('Renderizando catálogo');
//     const catalogoContainer = document.getElementById('catalogo-productos');
//     if (!catalogoContainer) {
//         console.error('No se encontró el contenedor del catálogo');
//         return;
//     }
//     catalogoContainer.innerHTML = '';

//     appState.productos.forEach(producto => {
//         // Verificar si el producto tiene inventario
//         const inventarioProducto = appState.inventario.find(item => item.idProducto === producto.id);
        
//         if (inventarioProducto && inventarioProducto.cantidad > 0) {
//             const productoCard = document.createElement('div');
//             productoCard.className = 'producto-card';
//             const cantidadEnCarrito = obtenerCantidadEnCarrito(appState, producto.id);

//             productoCard.innerHTML = `
//                 <img src="${producto.imagen}" alt="${producto.nombre}" class="producto-imagen">
//                 <div class="producto-header">
//                     <div>
//                         <div class="producto-marca">${producto.marca}</div>
//                         <div class="producto-nombre">${producto.nombre}</div>
//                     </div>
//                     <button class="producto-favorito" aria-label="Agregar a favoritos">
//                         <i data-lucide="heart"></i>
//                     </button>
//                 </div>
//                 <div class="producto-precio-gramo">Gramo a $${producto.precioGramo}</div>
//                 <div class="producto-precio">$${producto.precio.toLocaleString()}</div>
//                 <div class="producto-inventario">Disponible: ${inventarioProducto.cantidad}</div>
//                 ${cantidadEnCarrito > 0 ? `
//                     <div class="producto-cantidad">
//                         <button class="btn-cantidad" data-id="${producto.id}" data-action="restar" aria-label="Disminuir cantidad">-</button>
//                         <input type="number" value="${cantidadEnCarrito}"
//                                class="input-cantidad"
//                                data-id="${producto.id}"
//                                aria-label="Cantidad del producto">
//                         <button class="btn-cantidad" data-id="${producto.id}" data-action="sumar" aria-label="Aumentar cantidad">+</button>
//                     </div>
//                 ` : `
//                     <button class="btn-agregar" data-id="${producto.id}">
//                         Agregar
//                     </button>
//                 `}
//             `;
//             catalogoContainer.appendChild(productoCard);
//         }
//     });

//     // Reinicializar los iconos de Lucide
//     lucide.createIcons();
// }

// function obtenerCantidadEnCarrito(appState, productoId) {
//     // Implementa la lógica para obtener la cantidad de un producto en el carrito
//     // Esta función es un placeholder y debe ser reemplazada con la lógica real
//     const productoEnCarrito = appState.carrito.find(item => item.id === productoId);
//     return productoEnCarrito ? productoEnCarrito.cantidad : 0;
// }

