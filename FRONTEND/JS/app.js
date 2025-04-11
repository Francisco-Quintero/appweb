import config from './config.js';
import websocketService from './webSocketService.js';
import authService from './authService.js';
import navigationService from './navigationService.js';

/**
 * Clase principal de la aplicación
 */
class App {
    constructor() {
        this.initialized = false;
    }
    
    /**
     * Inicializa la aplicación
     */
    async init() {
        if (this.initialized) return;
        
        console.log('Inicializando aplicación...');
        
        try {
            // Inicializar Lucide icons si está disponible
            if (window.lucide) {
                window.lucide.createIcons();
            }
            
            // Verificar si el usuario está autenticado
            const usuarioAutenticado = authService.isAuthenticated();
            console.log('Usuario autenticado:', usuarioAutenticado);
            
            // Inicializar WebSocket si el usuario está autenticado
            if (usuarioAutenticado) {
                try {
                    await websocketService.conectar();
                    console.log('WebSocket inicializado correctamente');
                } catch (error) {
                    console.error('Error al inicializar WebSocket:', error);
                    // Continuar con la aplicación aunque falle el WebSocket
                }
            }
            
            // Configurar eventos globales
            this.configurarEventos();
            
            // Marcar como inicializado
            this.initialized = true;
            
            // Disparar evento de aplicación inicializada
            document.dispatchEvent(new CustomEvent('app-inicializada'));
            
            console.log('Aplicación inicializada correctamente');
        } catch (error) {
            console.error('Error al inicializar la aplicación:', error);
        }
    }
    
    /**
     * Configura los eventos globales de la aplicación
     */
    configurarEventos() {
        // Evento de login exitoso
        document.addEventListener('login-exitoso', (event) => {
            console.log('Login exitoso:', event.detail);
            
            // Inicializar WebSocket después del login
            websocketService.conectar().catch(error => {
                console.error('Error al conectar WebSocket después del login:', error);
            });
            
            // Redirigir según el rol
            authService.redirigirSegunRol();
        });
        
        // Evento de logout
        document.addEventListener('logout', () => {
            console.log('Logout realizado');
            
            // Desconectar WebSocket
            websocketService.desconectar();
            
            // Redirigir a la página de inicio
            navigationService.navegarAInicio();
        });
        
        // Evento de cierre de ventana
        window.addEventListener('beforeunload', () => {
            // Desconectar WebSocket al cerrar la página
            websocketService.desconectar();
        });
    }
}

// Crear instancia de la aplicación
const app = new App();

// Exportar la instancia
export default app;

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});