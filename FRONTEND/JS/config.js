/**
 * Configuración global de la aplicación
 */
const config = {
    // URLs del backend
    apiUrl: 'http://localhost:26209/api',
    wsUrl: 'http://localhost:8080/ws',
    
    // Tiempo de reintento para conexiones fallidas (en milisegundos)
    wsReconnectInterval: 5000,
    
    // Rutas de la aplicación
    routes: {
        tienda: 'indexTienda.html',
        gestion: 'indexGestion.html',
        domiciliario: 'indexDomiciliario.html'
    },
    
    // Roles de usuario
    roles: {
        CLIENTE: 'CLIENTE',
        ADMIN: 'ADMIN',
        DOMICILIARIO: 'DOMICILIARIO'
    }
};

export default config;