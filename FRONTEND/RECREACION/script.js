// Simulación de rol del usuario (puedes ajustar la lógica según tu implementación de autenticación)
const esAdmin = true; // Cambia a false para probar la versión sin acceso

window.onload = function() {
    const mantenimientoSection = document.getElementById('mantenimiento-section');
    
    // Muestra o esconde la sección de "Mantenimiento" según el rol del usuario
    if (esAdmin) {
        mantenimientoSection.style.display = 'block';
    } else {
        mantenimientoSection.style.display = 'none';
    }
};
