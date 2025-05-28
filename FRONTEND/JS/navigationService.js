import config from './config.js';

/**
 * Servicio para manejar la navegación entre páginas
 */
const navigationService = {
    /**
     * Navega a una URL específica
     * @param {string} url - URL a la que navegar
     */
    navegar: function(url) {
        window.location.href = url;
    },
    
    /**
     * Navega a la página de inicio
     */
    navegarAInicio: function() {
        this.navegar('index.html');
    },
    
    /**
     * Navega a la página de la tienda
     */
    navegarATienda: function() {
        this.navegar(config.routes.tienda);
    },
    
    /**
     * Navega a la página de gestión (admin)
     */
    navegarAGestion: function() {
        this.navegar(config.routes.gestion);
    },
    
    /**
     * Navega a la página de domiciliario
     */
    navegarADomiciliario: function() {
        this.navegar(config.routes.domiciliario);
    },
    
    /**
     * Navega a un módulo específico dentro de una página
     * @param {string} modulo - Nombre del módulo
     */
    navegarAModulo: function(modulo) {
        // Si estamos en la misma página, solo cambiamos el módulo
        if (window.cambiarModulo && typeof window.cambiarModulo === 'function') {
            window.cambiarModulo(modulo);
        } else {
            // Si no, añadimos el parámetro a la URL actual
            const url = new URL(window.location.href);
            url.searchParams.set('modulo', modulo);
            this.navegar(url.toString());
        }
    },
    
    /**
     * Obtiene el módulo actual de la URL
     * @returns {string|null} - Nombre del módulo o null si no hay
     */
    getModuloActual: function() {
        const params = new URLSearchParams(window.location.search);
        return params.get('modulo');
    }
};

export default navigationService;