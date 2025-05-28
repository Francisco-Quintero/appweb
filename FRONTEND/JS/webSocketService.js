import config from './config.js';

/**
 * Servicio para manejar la comunicación WebSocket
 */
export const websocketService = {
    stompClient: null,
    conectado: false,
    callbacks: {},
    intentosReconexion: 0,
    maxIntentosReconexion: 5,
    
    /**
     * Inicializa la conexión WebSocket
     * @param {string} url - URL del endpoint WebSocket (opcional)
     * @returns {Promise} - Promesa que se resuelve cuando la conexión se establece
     */
    conectar: function(url = config.wsUrl) {
        return new Promise((resolve, reject) => {
            try {
                // Verificar si SockJS y Stomp están disponibles
                if (typeof SockJS === 'undefined' || typeof Stomp === 'undefined') {
                    console.error('SockJS o Stomp no están disponibles. Asegúrate de incluir las bibliotecas.');
                    reject(new Error('SockJS o Stomp no están disponibles'));
                    return;
                }
                
                console.log('Iniciando conexión WebSocket a:', url);
                const socket = new SockJS(url);
                this.stompClient = Stomp.over(socket);
                
                // Desactivar logs de debug de Stomp
                this.stompClient.debug = null;
                
                this.stompClient.connect({}, 
                    // Callback de conexión exitosa
                    (frame) => {
                        console.log('Conectado a WebSocket:', frame);
                        this.conectado = true;
                        this.intentosReconexion = 0;
                        
                        // Suscribirse al canal de actualizaciones
                        this.stompClient.subscribe('/topic/actualizaciones', (mensaje) => {
                            try {
                                const datos = JSON.parse(mensaje.body);
                                console.log('Actualización recibida:', datos);
                                
                                // Notificar a todos los callbacks registrados
                                if (datos.tipo && this.callbacks[datos.tipo]) {
                                    this.callbacks[datos.tipo].forEach(callback => callback(datos.datos));
                                }
                                
                                // Notificar a callbacks generales
                                if (this.callbacks['todos']) {
                                    this.callbacks['todos'].forEach(callback => callback(datos));
                                }
                            } catch (error) {
                                console.error('Error al procesar mensaje WebSocket:', error);
                            }
                        });
                        
                        // Disparar evento de conexión establecida
                        document.dispatchEvent(new CustomEvent('websocket-conectado'));
                        
                        resolve(frame);
                    },
                    // Callback de error
                    (error) => {
                        console.error('Error de conexión WebSocket:', error);
                        this.conectado = false;
                        this.intentosReconexion++;
                        
                        if (this.intentosReconexion <= this.maxIntentosReconexion) {
                            // Intentar reconectar después de un tiempo
                            console.log(`Intentando reconectar WebSocket (intento ${this.intentosReconexion} de ${this.maxIntentosReconexion})...`);
                            setTimeout(() => {
                                this.conectar(url).then(resolve).catch(reject);
                            }, config.wsReconnectInterval);
                        } else {
                            console.error('Número máximo de intentos de reconexión alcanzado');
                            reject(error);
                        }
                    }
                );
            } catch (error) {
                console.error('Error al inicializar WebSocket:', error);
                reject(error);
            }
        });
    },
    
    /**
     * Desconecta el WebSocket
     */
    desconectar: function() {
        if (this.stompClient && this.conectado) {
            this.stompClient.disconnect();
            this.conectado = false;
            console.log('Desconectado de WebSocket');
        }
    },
    
    /**
     * Envía un mensaje al servidor
     * @param {string} destino - Destino del mensaje (ej: '/app/actualizacion')
     * @param {object} mensaje - Mensaje a enviar
     */
    enviar: function(destino, mensaje) {
        if (this.stompClient && this.conectado) {
            this.stompClient.send(destino, {}, JSON.stringify(mensaje));
        } else {
            console.warn('No se puede enviar mensaje: WebSocket no conectado');
        }
    },
    
    /**
     * Registra un callback para un tipo específico de actualización
     * @param {string} tipo - Tipo de actualización (ej: 'inventario', 'pedidos')
     * @param {function} callback - Función a llamar cuando se reciba una actualización
     */
    registrarCallback: function(tipo, callback) {
        if (!this.callbacks[tipo]) {
            this.callbacks[tipo] = [];
        }
        this.callbacks[tipo].push(callback);
        return callback; // Devolver el callback para poder eliminarlo después
    },
    
    /**
     * Elimina un callback
     * @param {string} tipo - Tipo de actualización
     * @param {function} callback - Callback a eliminar
     */
    eliminarCallback: function(tipo, callback) {
        if (this.callbacks[tipo]) {
            this.callbacks[tipo] = this.callbacks[tipo].filter(cb => cb !== callback);
        }
    },
    
    /**
     * Elimina todos los callbacks de un tipo
     * @param {string} tipo - Tipo de actualización
     */
    limpiarCallbacks: function(tipo) {
        if (tipo) {
            this.callbacks[tipo] = [];
        } else {
            this.callbacks = {};
        }
    }
};

export default websocketService;