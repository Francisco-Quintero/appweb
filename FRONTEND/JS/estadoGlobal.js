import apiService from './apiService.js';
import websocketService from './webSocketService.js';


export const API_URL = 'http://localhost:26209/api'; // URL de la API
/**
 * Estado global de la aplicación
 */
const estadoGlobal = {
    // Datos
    inventario: [],
    productos: [],
    proveedores: [],
    suministros: [],
    pedidos: [],
    usuarios: [],
    carrito: [],
    
    // Estado de usuario
    usuarioLogueado: false,
    
    // Observadores
    observadores: {},
    
    /**
     * Carga los datos iniciales necesarios
     */
    cargarDatosIniciales: async function() {
        try {
            console.log("Cargando datos iniciales...");
            
            // Cargar productos
            const productos = await apiService.get('productos');
            this.actualizarProductos(productos);
            
            // Cargar inventario
            const inventario = await apiService.get('inventarios');
            this.actualizarInventario(inventario);
            
            // Cargar proveedores
            const proveedores = await apiService.get('proveedores');
            this.actualizarProveedores(proveedores);

            //cargar suministros
            const suministros = await apiService.get('suministros');
            this.actualizarSuministros(suministros);
            
            // Registrar callbacks de WebSocket para actualizaciones
            this.registrarCallbacksWebSocket();
            
            console.log("Datos iniciales cargados correctamente");
            return true;
        } catch (error) {
            console.error("Error al cargar datos iniciales:", error);
            throw error;
        }
    },
    
    /**
     * Registra callbacks para actualizaciones vía WebSocket
     */
    registrarCallbacksWebSocket: function() {
        // Actualización de inventario
        websocketService.registrarCallback('inventario', (datos) => {
            console.log("Actualización de inventario recibida vía WebSocket:", datos);
            this.actualizarInventario(datos);
        });
        
        // Actualización de productos
        websocketService.registrarCallback('productos', (datos) => {
            console.log("Actualización de productos recibida vía WebSocket:", datos);
            this.actualizarProductos(datos);
        });
        
        // Actualización de pedidos
        websocketService.registrarCallback('pedidos', (datos) => {
            console.log("Actualización de pedidos recibida vía WebSocket:", datos);
            this.actualizarPedidos(datos);
        });
    },
    
    /**
     * Actualiza el inventario
     * @param {Array} inventario - Nuevo inventario
     */
    actualizarInventario: function(inventario) {
        this.inventario = inventario;
        this.notificarObservadores('inventarioActualizado', inventario);
    },
    
    /**
     * Actualiza los productos
     * @param {Array} productos - Nuevos productos
     */
    actualizarProductos: function(productos) {
        this.productos = productos;
        this.notificarObservadores('productosActualizados', productos);
    },
    
    /**
     * Actualiza los proveedores
     * @param {Array} proveedores - Nuevos proveedores
     */
    actualizarProveedores: function(proveedores) {
        this.proveedores = proveedores;
        this.notificarObservadores('proveedoresActualizados', proveedores);
    },
    
    /**
     * Actualiza los suministros
     * @param {Array} suministros - Nuevos suministros
     */
    actualizarSuministros: function(suministros) {
        this.suministros = suministros;
        this.notificarObservadores('suministrosActualizados', suministros);
    },
    
    /**
     * Actualiza los pedidos
     * @param {Array} pedidos - Nuevos pedidos
     */
    actualizarPedidos: function(pedidos) {
        this.pedidos = pedidos;
        this.notificarObservadores('pedidosActualizados', pedidos);
    },
    
    /**
     * Actualiza los usuarios
     * @param {Array} usuarios - Nuevos usuarios
     */
    actualizarUsuarios: function(usuarios) {
        this.usuarios = usuarios;
        this.notificarObservadores('usuariosActualizados', usuarios);
    },
    
    /**
     * Establece el estado de usuario logueado
     * @param {boolean} estado - Estado de login
     */
    setUsuarioLogueado: function(estado) {
        this.usuarioLogueado = estado;
        this.notificarObservadores('usuarioLogueadoActualizado', estado);
    },
    
    /**
     * Verifica si el usuario está logueado
     * @returns {boolean} - Estado de login
     */
    isUsuarioLogueado: function() {
        return this.usuarioLogueado;
    },
    
    /**
     * Registra un observador para un evento específico
     * @param {string} evento - Nombre del evento
     * @param {function} callback - Función a llamar cuando ocurra el evento
     */
    registrarObservador: function(evento, callback) {
        if (!this.observadores[evento]) {
            this.observadores[evento] = [];
        }
        this.observadores[evento].push(callback);
    },
    
    /**
     * Elimina un observador
     * @param {string} evento - Nombre del evento
     * @param {function} callback - Función a eliminar
     */
    eliminarObservador: function(evento, callback) {
        if (this.observadores[evento]) {
            this.observadores[evento] = this.observadores[evento].filter(cb => cb !== callback);
        }
    },
    
    /**
     * Notifica a todos los observadores de un evento
     * @param {string} evento - Nombre del evento
     * @param {any} datos - Datos a pasar a los observadores
     */
    notificarObservadores: function(evento, datos) {
        if (this.observadores[evento]) {
            this.observadores[evento].forEach(callback => {
                try {
                    callback(datos);
                } catch (error) {
                    console.error(`Error en observador de ${evento}:`, error);
                }
            });
        }
    }
};

export default estadoGlobal;