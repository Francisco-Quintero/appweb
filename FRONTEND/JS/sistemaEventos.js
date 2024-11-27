// sistemaEventos.js
(function() {
    console.log('Iniciando sistema de eventos');

    // Objeto para almacenar los suscriptores
    const suscriptores = {};

    // Sistema de eventos global
    window.sistemaEventos = {
        // Método para suscribirse a eventos
        suscribir: function(evento, callback) {
            console.log(`Suscribiendo a evento: ${evento}`);
            if (!suscriptores[evento]) {
                suscriptores[evento] = [];
            }
            suscriptores[evento].push(callback);
        },

        // Método para emitir eventos
        emitir: function(evento, datos) {
            console.log(`Emitiendo evento: ${evento}`, datos);
            if (suscriptores[evento]) {
                suscriptores[evento].forEach(callback => {
                    try {
                        callback(datos);
                    } catch (error) {
                        console.error(`Error en callback de evento ${evento}:`, error);
                    }
                });
            }
        },

        // Método para eliminar suscripciones
        desuscribir: function(evento, callback) {
            console.log(`Desuscribiendo de evento: ${evento}`);
            if (suscriptores[evento]) {
                suscriptores[evento] = suscriptores[evento].filter(cb => cb !== callback);
            }
        }
    };

    // Emitir evento cuando el sistema está listo
    document.addEventListener('DOMContentLoaded', () => {
        console.log('Sistema de eventos listo');
        window.sistemaEventos.emitir('sistemaEventosListo');
    });

    console.log('Sistema de eventos inicializado');
})();