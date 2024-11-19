// datosGlobales.js
const datosGlobales = {
    pedidos: [],
    productos: [],
    usuarios: [],
    proveedores: [
        { id: 1, nombre: 'Klarents', numeroContacto: 3502874505 },
        { id: 2, nombre: 'Coca Cola', numeroContacto: 3006742872 },
        { id: 3, nombre: 'Postobón', numeroContacto: 3217894576},
    ],
    inventario: [
        { 
            idInventario: 2,
            idProducto: 2,
            nombreProducto: 'Queso crema',
            stock: 15,
            puntoReorden: 25,
            fechaActualizacion: '2024-01-15',
            estado: 'Bajo stock'
        }
    ],

    guardarEnLocalStorage: function() {
        console.log('Guardando datos en localStorage:', this);
        localStorage.setItem('datosGlobales', JSON.stringify({
            pedidos: this.pedidos,
            productos: this.productos,
            usuarios: this.usuarios,
            inventario: this.inventario
        }));
    },

    cargarDesdeLocalStorage: function() {
        const datosAlmacenados = localStorage.getItem('datosGlobales');
        console.log('Datos cargados de localStorage:', datosAlmacenados);
        if (datosAlmacenados) {
            const datosParsed = JSON.parse(datosAlmacenados);
            this.pedidos = datosParsed.pedidos || [];
            this.productos = datosParsed.productos || [];
            this.usuarios = datosParsed.usuarios || [];
            this.inventario = datosParsed.inventario || this.inventario;
        }
        console.log('Datos después de cargar:', this);
    },

    // Métodos para manipular datos de pedidos
    agregarPedido: function(pedido) {
        this.pedidos.push(pedido);
        this.guardarEnLocalStorage();
    },

    actualizarPedido: function(id, pedidoActualizado) {
        const indice = this.pedidos.findIndex(p => p.id === id);
        if (indice !== -1) {
            this.pedidos[indice] = pedidoActualizado;
            this.guardarEnLocalStorage();
        }
    },

    eliminarPedido: function(id) {
        this.pedidos = this.pedidos.filter(p => p.id !== id);
        this.guardarEnLocalStorage();
    },

    // Métodos para manipular datos de productos
    agregarProducto: function(producto) {
        this.productos.push(producto);
        this.guardarEnLocalStorage();
    },

    actualizarProducto: function(id, productoActualizado) {
        const indice = this.productos.findIndex(p => p.id === id);
        if (indice !== -1) {
            this.productos[indice] = productoActualizado;
            this.guardarEnLocalStorage();
        }
    },

    eliminarProducto: function(id) {
        this.productos = this.productos.filter(p => p.id !== id);
        this.guardarEnLocalStorage();
    },

    // Métodos para manipular datos de usuarios
    agregarUsuario: function(usuario) {
        this.usuarios.push(usuario);
        this.guardarEnLocalStorage();
    },

    actualizarUsuario: function(id, usuarioActualizado) {
        const indice = this.usuarios.findIndex(u => u.id === id);
        if (indice !== -1) {
            this.usuarios[indice] = usuarioActualizado;
            this.guardarEnLocalStorage();
        }
    },

    eliminarUsuario: function(id) {
        this.usuarios = this.usuarios.filter(u => u.id !== id);
        this.guardarEnLocalStorage();
    },

    // Métodos para manipular datos de inventario
    agregarItemInventario: function(item) {
        this.inventario.push(item);
        this.guardarEnLocalStorage();
    },

    actualizarItemInventario: function(id, itemActualizado) {
        const indice = this.inventario.findIndex(i => i.idInventario === id);
        if (indice !== -1) {
            this.inventario[indice] = itemActualizado;
            this.guardarEnLocalStorage();
        }
    },

    eliminarItemInventario: function(id) {
        this.inventario = this.inventario.filter(i => i.idInventario !== id);
        this.guardarEnLocalStorage();
    },

    actualizarStockInventario: function(id, nuevoStock) {
        const indice = this.inventario.findIndex(i => i.idInventario === id);
        if (indice !== -1) {
            this.inventario[indice].stock = nuevoStock;
            this.inventario[indice].fechaActualizacion = new Date().toISOString().split('T')[0];
            this.inventario[indice].estado = nuevoStock <= this.inventario[indice].puntoReorden ? 'Bajo stock' : 'Normal';
            this.guardarEnLocalStorage();
        }
    }
};

// Cargar datos al iniciar
datosGlobales.cargarDesdeLocalStorage();

// Guardar datos iniciales si no hay nada en localStorage
if (datosGlobales.inventario.length === 0) {
    datosGlobales.guardarEnLocalStorage();
}

// Hacer datosGlobales disponible globalmente
window.datosGlobales = datosGlobales;