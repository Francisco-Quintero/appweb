// datosGlobales.js

const datosGlobales = {
    productos: [],
    categorias: [],
    proveedores: [],
    compras: [],
    inventario: [],


    agregarInventario: function(item) {
        item.id = this.generarId(this.inventario);
        this.inventario.push(item);
        this.guardarEnLocalStorage();
    },

    actualizarInventario: function(itemActualizado) {
        const index = this.inventario.findIndex(i => i.id === itemActualizado.id);
        if (index !== -1) {
            this.inventario[index] = itemActualizado;
            this.guardarEnLocalStorage();
        }
    },

    eliminarInventario: function(id) {
        this.inventario = this.inventario.filter(i => i.id !== id);
        this.guardarEnLocalStorage();
    },

    obtenerInventario: function() {
        return this.inventario;
    },


    inicializar: function() {
        this.cargarDesdeLocalStorage();
        console.log('Datos globales inicializados');
    },

    agregarProducto: function(producto) {
        producto.id = this.generarId(this.productos);
        this.productos.push(producto);
        this.guardarEnLocalStorage();
    },

    actualizarProducto: function(productoActualizado) {
        const index = this.productos.findIndex(p => p.id === productoActualizado.id);
        if (index !== -1) {
            this.productos[index] = productoActualizado;
            this.guardarEnLocalStorage();
        }
    },

    eliminarProducto: function(id) {
        this.productos = this.productos.filter(p => p.id !== id);
        this.guardarEnLocalStorage();
    },

    agregarCategoria: function(categoria) {
        categoria.id = this.generarId(this.categorias);
        this.categorias.push(categoria);
        this.guardarEnLocalStorage();
    },

    actualizarCategoria: function(categoriaActualizada) {
        const index = this.categorias.findIndex(c => c.id === categoriaActualizada.id);
        if (index !== -1) {
            this.categorias[index] = categoriaActualizada;
            this.guardarEnLocalStorage();
        }
    },

    eliminarCategoria: function(id) {
        this.categorias = this.categorias.filter(c => c.id !== id);
        this.guardarEnLocalStorage();
    },

    agregarProveedor: function(proveedor) {
        proveedor.id = this.generarId(this.proveedores);
        this.proveedores.push(proveedor);
        this.guardarEnLocalStorage();
    },

    actualizarProveedor: function(proveedorActualizado) {
        const index = this.proveedores.findIndex(p => p.id === proveedorActualizado.id);
        if (index !== -1) {
            this.proveedores[index] = proveedorActualizado;
            this.guardarEnLocalStorage();
        }
    },

    eliminarProveedor: function(id) {
        this.proveedores = this.proveedores.filter(p => p.id !== id);
        this.guardarEnLocalStorage();
    },

    agregarCompra: function(compra) {
        compra.id = this.generarId(this.compras);
        compra.fecha = compra.fecha || new Date().toISOString();
        compra.estado = compra.estado || 'Pendiente';
        
        // Ensure all required fields are present
        const camposRequeridos = ['proveedor', 'productos', 'subtotal', 'impuesto', 'total'];
        for (const campo of camposRequeridos) {
            if (!compra.hasOwnProperty(campo)) {
                throw new Error(`El campo '${campo}' es requerido para una compra.`);
            }
        }

        // Validate products array
        if (!Array.isArray(compra.productos) || compra.productos.length === 0) {
            throw new Error('La compra debe tener al menos un producto.');
        }

        this.compras.push(compra);
        this.guardarEnLocalStorage();
        return compra;
    },

    actualizarCompra: function(compraActualizada) {
        const index = this.compras.findIndex(c => c.id === compraActualizada.id);
        if (index !== -1) {
            this.compras[index] = compraActualizada;
            this.guardarEnLocalStorage();
            return true;
        }
        return false;
    },

    eliminarCompra: function(id) {
        const longitudAnterior = this.compras.length;
        this.compras = this.compras.filter(c => c.id !== id);
        if (this.compras.length < longitudAnterior) {
            this.guardarEnLocalStorage();
            return true;
        }
        return false;
    },

    obtenerCompras: function() {
        return this.compras;
    },

    generarId: function(array) {
        return array.length > 0 ? Math.max(...array.map(item => item.id)) + 1 : 1;
    },

    guardarEnLocalStorage: function() {
        localStorage.setItem('productos', JSON.stringify(this.productos));
        localStorage.setItem('categorias', JSON.stringify(this.categorias));
        localStorage.setItem('proveedores', JSON.stringify(this.proveedores));
        localStorage.setItem('compras', JSON.stringify(this.compras));
        localStorage.setItem('inventario', JSON.stringify(this.inventario));
    },

    cargarDesdeLocalStorage: function() {
        const productosGuardados = localStorage.getItem('productos');
        const categoriasGuardadas = localStorage.getItem('categorias');
        const proveedoresGuardados = localStorage.getItem('proveedores');
        const comprasGuardadas = localStorage.getItem('compras');
        const inventarioGuardado = localStorage.getItem('inventario'); 

        if (productosGuardados) this.productos = JSON.parse(productosGuardados);
        if (categoriasGuardadas) this.categorias = JSON.parse(categoriasGuardadas);
        if (proveedoresGuardados) this.proveedores = JSON.parse(proveedoresGuardados);
        if (comprasGuardadas) this.compras = JSON.parse(comprasGuardadas);
    },

    inicializar: function() {
        this.cargarDesdeLocalStorage();
        console.log('Datos globales inicializados');
    }
};

// Inicializar datos globales al cargar el script
datosGlobales.inicializar();

// Exponer datosGlobales al ámbito global
window.datosGlobales = datosGlobales;