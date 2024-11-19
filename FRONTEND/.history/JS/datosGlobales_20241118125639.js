// datosGlobales.js
const datosGlobales = {
    pedidos: [],
    productos: [],
    usuarios: [],
    inventario: [
        { 
            idInventario: 1,
            idProducto: 1,
            nombreProducto: 'Leche',
            stock: 100,
            puntoReorden: 20,
            fechaActualizacion: '2024-01-15',
            estado: 'Normal'
        },
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
    // Añade aquí más estructuras de datos según necesites

    // Método para guardar datos en localStorage
    guardarEnLocalStorage: function() {
        localStorage.setItem('datosGlobales', JSON.stringify({
            pedidos: this.pedidos,
            productos: this.productos,
            usuarios: this.usuarios,
            // Añade aquí más datos que quieras guardar
        }));
    },

    // Método para cargar datos desde localStorage
    cargarDesdeLocalStorage: function() {
        const datosAlmacenados = localStorage.getItem('datosGlobales');
        if (datosAlmacenados) {
            const datosParsed = JSON.parse(datosAlmacenados);
            this.pedidos = datosParsed.pedidos || [];
            this.productos = datosParsed.productos || [];
            this.usuarios = datosParsed.usuarios || [];
            this.inventario = datosParsed.inventario || [];
            // Carga aquí más datos según hayas guardado
        }
    },

    // Métodos para manipular datos
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
    }
};

// Cargar datos al iniciar
datosGlobales.cargarDesdeLocalStorage();