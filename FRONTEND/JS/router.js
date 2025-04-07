
const routes = {
    '/gestion': 'modules/dashboard.html',
    '/tienda': 'modules/catalogo.html',
    '/usuarios': 'modules/usuarios.html',
    '/productos': 'modules/productos.html',
    '/proveedores': 'modules/proveedores.html',
};

function router() {
    const contenedorVista = document.getElementById('contenedorVista');
    const path = location.hash.slice(1) || '/gestion'; // Ruta por defecto
    const view = routes[path];

    if (view) {
        fetch(view)
            .then(response => response.text())
            .then(html => {
                contenedorVista.innerHTML = html; // Carga el contenido de la vista
            })
            .catch(err => {
                console.error('Error al cargar la vista:', err);
                contenedorVista.innerHTML = '<h1>Error al cargar la vista</h1>';
            });
    } else {
        contenedorVista.innerHTML = '<h1>404 - Página no encontrada</h1>';
    }
}

window.addEventListener('hashchange', router);
window.addEventListener('load', router);