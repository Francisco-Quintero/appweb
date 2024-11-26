(function() {
    let listasFavoritos = [];

    function cargarFavoritos() {
        const favoritosGuardados = localStorage.getItem('listasFavoritos');
        if (favoritosGuardados) {
            listasFavoritos = JSON.parse(favoritosGuardados);
        }
        renderizarListas();
    }

    function guardarFavoritos() {
        localStorage.setItem('listasFavoritos', JSON.stringify(listasFavoritos));
    }

    function renderizarListas() {
        const contenedor = document.getElementById('listas-favoritos');
        contenedor.innerHTML = '';

        listasFavoritos.forEach((lista, index) => {
            const listaElement = document.createElement('div');
            listaElement.className = 'lista-favoritos';
            listaElement.innerHTML = `
                <div class="lista-header">
                    <span class="lista-titulo">${lista.nombre}</span>
                    <div class="lista-acciones">
                        <button class="btn-añadir-carrito" data-index="${index}">Añadir al Carrito</button>
                        <button class="btn-editar-lista" data-index="${index}">Editar</button>
                        <button class="btn-eliminar-lista" data-index="${index}">Eliminar</button>
                    </div>
                </div>
                <div class="lista-productos">
                    ${lista.productos.map(producto => `
                        <div class="producto-favorito">
                            <img src="${producto.imagenProducto}" alt="${producto.nombre}">
                            <span>${producto.nombre}</span>
                            <button class="btn-eliminar-producto" data-lista="${index}" data-producto="${producto.idProducto}">Eliminar</button>
                        </div>
                    `).join('')}
                </div>
            `;
            contenedor.appendChild(listaElement);
        });
    }

    function crearNuevaLista() {
        const nombreLista = prompt('Ingrese el nombre de la nueva lista:');
        if (nombreLista) {
            listasFavoritos.push({
                nombre: nombreLista,
                productos: []
            });
            guardarFavoritos();
            renderizarListas();
        }
    }

    function editarLista(index) {
        const nuevoNombre = prompt('Ingrese el nuevo nombre de la lista:', listasFavoritos[index].nombre);
        if (nuevoNombre) {
            listasFavoritos[index].nombre = nuevoNombre;
            guardarFavoritos();
            renderizarListas();
        }
    }

    function eliminarLista(index) {
        if (confirm('¿Está seguro de que desea eliminar esta lista?')) {
            listasFavoritos.splice(index, 1);
            guardarFavoritos();
            renderizarListas();
        }
    }

    function eliminarProducto(listaIndex, productoId) {
        listasFavoritos[listaIndex].productos = listasFavoritos[listaIndex].productos.filter(
            producto => producto.idProducto !== productoId
        );
        guardarFavoritos();
        renderizarListas();
    }

    function añadirAlCarrito(index) {
        const productosAñadir = listasFavoritos[index].productos;
        // Aquí deberías implementar la lógica para añadir estos productos al carrito
        // Por ejemplo, podrías emitir un evento personalizado que el módulo de carrito escuche
        const evento = new CustomEvent('añadirProductosAlCarrito', { detail: productosAñadir });
        document.dispatchEvent(evento);
        alert('Productos añadidos al carrito');
    }

    function inicializarEventListeners() {
        document.getElementById('crear-lista').addEventListener('click', crearNuevaLista);

        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('btn-añadir-carrito')) {
                añadirAlCarrito(parseInt(e.target.dataset.index));
            } else if (e.target.classList.contains('btn-editar-lista')) {
                editarLista(parseInt(e.target.dataset.index));
            } else if (e.target.classList.contains('btn-eliminar-lista')) {
                eliminarLista(parseInt(e.target.dataset.index));
            } else if (e.target.classList.contains('btn-eliminar-producto')) {
                eliminarProducto(parseInt(e.target.dataset.lista), parseInt(e.target.dataset.producto));
            }
        });
    }

    function init() {
        cargarFavoritos();
        inicializarEventListeners();
    }

    document.addEventListener('DOMContentLoaded', init);
})();

