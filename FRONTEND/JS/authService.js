import apiService from './apiService.js';
import config from './config.js';
import navigationService from './navigationService.js';

/**
 * Servicio para manejar la autenticación y sesiones de usuario
 */
const authService = {
    /**
     * Inicia sesión con credenciales
     * @param {string} email - Email del usuario
     * @param {string} password - Contraseña del usuario
     * @returns {Promise} - Promesa con el resultado del login
     */
    login: async function(email, password) {
        try {
            const response = await apiService.post('auth/login', { email, password });
            
            if (response && response.token) {
                // Guardar token y datos de usuario
                localStorage.setItem('authToken', response.token);
                localStorage.setItem('userData', JSON.stringify(response.usuario));
                
                // Disparar evento de login exitoso
                document.dispatchEvent(new CustomEvent('login-exitoso', { 
                    detail: response.usuario 
                }));
                
                return response.usuario;
            } else {
                throw new Error('Respuesta de login inválida');
            }
        } catch (error) {
            console.error('Error en login:', error);
            throw error;
        }
    },
    
    /**
     * Cierra la sesión del usuario
     */
    logout: function() {
        // Eliminar datos de sesión
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        
        // Disparar evento de logout
        document.dispatchEvent(new CustomEvent('logout'));
        
        // Redirigir a la página principal
        navigationService.navegarAInicio();
    },
    
    /**
     * Verifica si el usuario está autenticado
     * @returns {boolean} - true si está autenticado, false en caso contrario
     */
    isAuthenticated: function() {
        return !!localStorage.getItem('authToken');
    },
    
    /**
     * Obtiene los datos del usuario actual
     * @returns {object|null} - Datos del usuario o null si no hay sesión
     */
    getUsuarioActual: function() {
        try {
            const userData = localStorage.getItem('userData');
            return userData ? JSON.parse(userData) : null;
        } catch (error) {
            console.error('Error al obtener datos de usuario:', error);
            return null;
        }
    },
    
    /**
     * Verifica si el usuario tiene un rol específico
     * @param {string|array} roles - Rol o array de roles a verificar
     * @returns {boolean} - true si tiene el rol, false en caso contrario
     */
    tieneRol: function(roles) {
        const usuario = this.getUsuarioActual();
        if (!usuario || !usuario.rol) return false;
        
        if (Array.isArray(roles)) {
            return roles.includes(usuario.rol);
        }
        
        return usuario.rol === roles;
    },
    
    /**
     * Redirige al usuario según su rol
     */
    redirigirSegunRol: function() {
        const usuario = this.getUsuarioActual();
        if (!usuario) {
            navigationService.navegarAInicio();
            return;
        }
        
        switch (usuario.rol) {
            case config.roles.ADMIN:
                navigationService.navegarAGestion();
                break;
            case config.roles.DOMICILIARIO:
                navigationService.navegarADomiciliario();
                break;
            case config.roles.CLIENTE:
            default:
                navigationService.navegarATienda();
                break;
        }
    }
};

export default authService;