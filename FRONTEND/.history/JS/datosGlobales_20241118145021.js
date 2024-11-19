
const datosGlobales = {
    pedidos: [],
    productos: [],
    usuarios: [],
    proveedores: [],
    inventario: [],

    guardarEnLocalStorage: function() {
        try {
            const datosAGuardar = {
                pedidos: this.pedidos,
                productos: this.productos,
                usuarios: this.usuarios,
                proveedores: this.proveedores,
                inventario: this.inventario
            };
            localStorage.setItem('datosGlobales', JSON.stringify(datosAGuardar));
            console.log('Datos guardados en localStorage:', datosAGuardar);
        } catch (error) {
            console.error('Error al guardar en localStorage:', error);
        }
    },

    cargarDesdeLocalStorage: function() {
        try {
            const datosAlmacenados = localStorage.getItem('datosGlobales');
            if (datosAlmacenados) {
                const datosParsed = JSON.parse(datosAlmacenados);
                this.pedidos = datosParsed.pedidos || [];
                this.productos = datosParsed.productos || [];
                this.usuarios = datosParsed.usuarios || [];
                this.proveedores = datosParsed.proveedores || [];
                this.inventario = datosParsed.inventario || [];
            }
            console.log('Datos cargados desde localStorage:', this);
        } catch (error) {
            console.error('Error al cargar desde localStorage:', error);
        }
    },

    // Métodos para manipular proveedores
    agregarProveedor: function(proveedor) {
        console.log('Agregando proveedor:', proveedor);
        if (!Array.isArray(this.proveedores)) {
            this.proveedores = [];
        }
        this.proveedores.push(proveedor);
        this.guardarEnLocalStorage();
    },

    actualizarProveedor: function(id, proveedorActualizado) {
        console.log('Actualizando proveedor:', id, proveedorActualizado);
        if (!Array.isArray(this.proveedores)) {
            return;
        }
        const indice = this.proveedores.findIndex(p => p.id === id);
        if (indice !== -1) {
            this.proveedores[indice] = proveedorActualizado;
            this.guardarEnLocalStorage();
        }
    },

    eliminarProveedor: function(id) {
        console.log('Eliminando proveedor:', id);
        if (!Array.isArray(this.proveedores)) {
            return;
        }
        this.proveedores = this.proveedores.filter(p => p.id !== id);
        this.guardarEnLocalStorage();
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
window.datosGlobales = datosGlobales;


// Verificar la inicialización
console.log('datosGlobales inicializado:', {
    disponible: !!window.datosGlobales,
    proveedores: Array.isArray(window.datosGlobales?.proveedores),
    metodosDisponibles: {
        guardarEnLocalStorage: typeof window.datosGlobales?.guardarEnLocalStorage === 'function',
        cargarDesdeLocalStorage: typeof window.datosGlobales?.cargarDesdeLocalStorage === 'function'
    }


    window.dispatchEvent(new Event('datosGlobalesListo'));
});


