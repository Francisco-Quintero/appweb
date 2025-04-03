export function verificarSesion() {
    const user = localStorage.getItem('user');
    if (!user) {
        alert('Debes iniciar sesión para realizar un pedido.');
        window.location.href = 'login.html'; // Redirigir al login
        return null;
    }
    return JSON.parse(user); // Retornar el usuario autenticado
}

export const BASE_URL = 'http://localhost:26209/api';