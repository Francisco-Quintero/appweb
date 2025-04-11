import config from './config.js';

/**
 * Servicio para realizar peticiones a la API REST
 */
const apiService = {
    /**
     * Realiza una petición GET a la API
     * @param {string} endpoint - Endpoint de la API (sin la URL base)
     * @param {object} params - Parámetros de la petición (opcional)
     * @returns {Promise} - Promesa con la respuesta
     */
    get: async function(endpoint, params = {}) {
        try {
            // Construir URL con parámetros
            let url = `${config.apiUrl}/${endpoint}`;
            if (Object.keys(params).length > 0) {
                const queryParams = new URLSearchParams(params);
                url += `?${queryParams.toString()}`;
            }
            
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    // Agregar token de autenticación si existe
                    ...this.getAuthHeader()
                }
            });
            
            if (!response.ok) {
                throw new Error(`Error en petición GET a ${endpoint}: ${response.status} ${response.statusText}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error en apiService.get:', error);
            throw error;
        }
    },
    
    /**
     * Realiza una petición POST a la API
     * @param {string} endpoint - Endpoint de la API (sin la URL base)
     * @param {object} data - Datos a enviar
     * @returns {Promise} - Promesa con la respuesta
     */
    post: async function(endpoint, data = {}) {
        try {
            const response = await fetch(`${config.apiUrl}/${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...this.getAuthHeader()
                },
                body: JSON.stringify(data)
            });
            
            if (!response.ok) {
                throw new Error(`Error en petición POST a ${endpoint}: ${response.status} ${response.statusText}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error en apiService.post:', error);
            throw error;
        }
    },
    
    /**
     * Realiza una petición PUT a la API
     * @param {string} endpoint - Endpoint de la API (sin la URL base)
     * @param {object} data - Datos a enviar
     * @returns {Promise} - Promesa con la respuesta
     */
    put: async function(endpoint, data = {}) {
        try {
            const response = await fetch(`${config.apiUrl}/${endpoint}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...this.getAuthHeader()
                },
                body: JSON.stringify(data)
            });
            
            if (!response.ok) {
                throw new Error(`Error en petición PUT a ${endpoint}: ${response.status} ${response.statusText}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error en apiService.put:', error);
            throw error;
        }
    },
    
    /**
     * Realiza una petición DELETE a la API
     * @param {string} endpoint - Endpoint de la API (sin la URL base)
     * @returns {Promise} - Promesa con la respuesta
     */
    delete: async function(endpoint) {
        try {
            const response = await fetch(`${config.apiUrl}/${endpoint}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    ...this.getAuthHeader()
                }
            });
            
            if (!response.ok) {
                throw new Error(`Error en petición DELETE a ${endpoint}: ${response.status} ${response.statusText}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error en apiService.delete:', error);
            throw error;
        }
    },
    
    /**
     * Obtiene los headers de autenticación
     * @returns {object} - Headers de autenticación
     */
    getAuthHeader: function() {
        const token = localStorage.getItem('authToken');
        return token ? { 'Authorization': `Bearer ${token}` } : {};
    }
};

export default apiService;