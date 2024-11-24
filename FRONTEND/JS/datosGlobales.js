const datosGlobales = {
    productos: [],
    categorias: [],
    proveedores: [],
    compras: [],
    inventario: [],
    carrito: [],
    facturas: [],
    usuarios: [],
    usuariosSistema: [], 

    // Función para obtener usuario por credenciales
    obtenerUsuarioPorCredenciales: function(usuario, password) {
        return this.usuarios.find(u => 
            u.usuario === usuario && 
            u.password === password
        ) || null;
    },

    // Función para agregar usuario
    agregarUsuario: function(usuario) {
        // Verificar si ya existe un usuario con el mismo nombre de usuario
        if (this.usuarios.some(u => u.usuario === usuario.usuario)) {
            throw new Error('El nombre de usuario ya existe');
        }

        usuario.id = this.generarId(this.usuarios);
        this.usuarios.push(usuario);
        this.guardarEnLocalStorage();
        return usuario;
    },

    actualizarUsuario: function(usuarioActualizado) {
        const index = this.usuarios.findIndex(u => u.id === usuarioActualizado.id);
        if (index !== -1) {
            this.usuarios[index] = usuarioActualizado;
            this.guardarEnLocalStorage();
            return true;
        }
        return false;
    },

    eliminarUsuario: function(id) {
        const longitudAnterior = this.usuarios.length;
        this.usuarios = this.usuarios.filter(u => u.id !== id);
        if (this.usuarios.length < longitudAnterior) {
            this.guardarEnLocalStorage();
            return true;
        }
        return false;
    },

    generarId: function(array) {
        return array.length > 0 ? Math.max(...array.map(item => item.id)) + 1 : 1;
    },

    guardarEnLocalStorage: function() {
        localStorage.setItem('datosGlobales', JSON.stringify({
            productos: this.productos,
            categorias: this.categorias,
            proveedores: this.proveedores,
            compras: this.compras,
            inventario: this.inventario,
            carrito: this.carrito,
            facturas: this.facturas,
            usuarios: this.usuario,
            usuariosSistema: this.usuariosSistema
        }));
    },

    cargarDesdeLocalStorage: function() {
        const datosGuardados = localStorage.getItem('datosGlobales');
        if (datosGuardados) {
            const datos = JSON.parse(datosGuardados);
            this.productos = datos.productos || [];
            this.categorias = datos.categorias || [];
            this.proveedores = datos.proveedores || [];
            this.compras = datos.compras || [];
            this.inventario = datos.inventario || [];
            this.carrito = datos.carrito || [];
            this.facturas = datos.facturas || [];
            this.usuarios = datos.usuarios || [];
            this.usuariosSistema = datos.usuariosSistema || [];
            
        }
    },

    inicializar: function() {
        this.cargarDesdeLocalStorage();
        console.log('Datos globales inicializados');
        // Disparar evento de datos globales listos
        const evento = new Event('datosGlobalesListo');
        window.dispatchEvent(evento);
    }
};

// Inicializar datos globales al cargar el script
datosGlobales.inicializar();

// Exponer datosGlobales al ámbito global
window.datosGlobales = datosGlobales;

// Función para ver datos en localStorage
function verDatosLocalStorage(variableLocal) {
    console.log('Contenido de localStorage:');
    console.log('-------------------------');

    const datosGuardados = localStorage.getItem(variableLocal);
    if (datosGuardados) {
        const datos = JSON.parse(datosGuardados);
        Object.keys(datos).forEach(clave => {
            console.log(`${clave}:`);
            console.log(datos[clave]);
            console.log('-------------------------');
        });
    } else {
        console.log('No hay datos almacenados en datosGlobales');
    }
}

// Agregar esta función al objeto global window para poder llamarla desde la consola
window.verDatosLocalStorage = verDatosLocalStorage;

