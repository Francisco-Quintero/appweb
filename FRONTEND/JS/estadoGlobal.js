const API_URL = 'http://localhost:26209/api'; // URL base de la API
const estadoGlobal = {
    usuarioLogueado: false,
    usuario: null,
    carrito: [],
    inventario: [],
    productos: [],
    pedidos: [],
    historialVentas: [],
    proveedores: [],
    suministros: [],
    usuarios: [],
    ventasActivas: [],

    // Indicador de carga de datos
    datosCargados: false,
    cargaDatosPromesa: null,

    // Observadores para notificar cambios
    observadores: {},

    // Método para registrar observadores
    registrarObservador(evento, callback) {
        if (!this.observadores[evento]) {
            this.observadores[evento] = [];
        }
        this.observadores[evento].push(callback);
    },

    // Método para notificar observadores
    notificar(evento, datos) {
        if (this.observadores[evento]) {
            this.observadores[evento].forEach(callback => callback(datos));
        }
    },

    // Métodos para actualizar datos y notificar cambios
    setUsuarioLogueado(logueado, usuario = null) {
        this.usuarioLogueado = logueado;
        this.usuario = usuario;
        this.notificar('usuarioLogueado', { logueado, usuario });
    },

    actualizarInventario(nuevoInventario) {
        this.inventario = nuevoInventario;
        this.notificar('inventarioActualizado', nuevoInventario);
    },

    actualizarProductos(nuevosProductos) {
        this.productos = nuevosProductos;
        this.notificar('productosActualizados', nuevosProductos);
    },

    actualizarPedidos(nuevosPedidos) {
        this.pedidos = nuevosPedidos;
        this.notificar('pedidosActualizados', nuevosPedidos);
    },

    actualizarHistorialVentas(nuevoHistorial) {
        this.historialVentas = nuevoHistorial;
        this.notificar('historialVentasActualizado', nuevoHistorial);
    },

    actualizarProveedores(nuevosProveedores) {
        this.proveedores = nuevosProveedores;
        this.notificar('proveedoresActualizados', nuevosProveedores);
    },

    actualizarSuministros(nuevosSuministros) {
        this.suministros = nuevosSuministros;
        this.notificar('suministrosActualizados', nuevosSuministros);
    },

    actualizarUsuarios(nuevosUsuarios) {
        this.usuarios = nuevosUsuarios;
        this.notificar('usuariosActualizados', nuevosUsuarios);
    },

    actualizarVentasActivas(nuevasVentas) {
        this.ventasActivas = nuevasVentas;
        this.notificar('ventasActivasActualizadas', nuevasVentas);
    },
    actualizarFacturas(nuevasFacturas) {
        this.facturas = nuevasFacturas;
        this.notificar('facturasActualizadas', nuevasFacturas);
    },

    // Función para cargar datos iniciales desde la API
    async cargarDatosIniciales() {
        // Si los datos ya están cargados, devolver la promesa existente
        if (this.datosCargados) {
            console.log('Datos ya cargados, devolviendo la promesa existente.');
            return this.cargaDatosPromesa;
        }

        // Si no están cargados, iniciar la carga y guardar la promesa
        this.cargaDatosPromesa = (async () => {
            try {
                
                const [inventario, pedidos, facturas, proveedores, usuarios, suministros, productos] = await Promise.all([
                    fetch(`${API_URL}/inventarios`).then(res => res.json()),
                    fetch(`${API_URL}/pedidos`).then(res => res.json()),
                    fetch(`${API_URL}/facturas`).then(res => res.json()),
                    fetch(`${API_URL}/proveedores`).then(res => res.json()),
                    fetch(`${API_URL}/usuarios`).then(res => res.json()),
                    fetch(`${API_URL}/suministros`).then(res => res.json()),
                    fetch(`${API_URL}/productos`).then(res => res.json())
                ]);

                this.actualizarInventario(inventario);
                this.actualizarPedidos(pedidos);
                this.actualizarProductos(productos); 
                this.actualizarFacturas(facturas);
                this.actualizarProveedores(proveedores);
                this.actualizarUsuarios(usuarios);
                this.actualizarSuministros(suministros);

                this.datosCargados = true; // Marcar como cargados
                console.log('Datos iniciales cargados desde la API');
            } catch (error) {
                console.error('Error al cargar datos iniciales desde la API:', error);
                throw error;
            }
        })();

        return this.cargaDatosPromesa;
    }
};

export default estadoGlobal;