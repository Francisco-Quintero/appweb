// Mostrar la sección correspondiente al cargar la página
import { BASE_URL } from "./auth";

document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        mostrarInformacionUsuario(user);
    } else {
        mostrarLogin();
    }
});

// Mostrar la sección de login
function mostrarLogin() {
    document.getElementById('loginSection').style.display = 'block';
    document.getElementById('registerSection').style.display = 'none';
    document.getElementById('userInfoSection').style.display = 'none';
}

// Mostrar la información del usuario logueado
function mostrarInformacionUsuario(user) {
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('registerSection').style.display = 'none';
    document.getElementById('userInfoSection').style.display = 'block';
    document.getElementById('userWelcome').textContent = user.username;
    document.getElementById('userRole').textContent = user.rol.nombre;
}

// Manejar el formulario de login
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    const response = await fetch(`${BASE_URL}/usuarios/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    if (response.ok) {
        const user = await response.json();
        localStorage.setItem('user', JSON.stringify(user));
        alert(`Bienvenido, ${user.username}`);
        mostrarInformacionUsuario(user);
    } else {
        alert('Credenciales inválidas');
    }
});

// Manejar el formulario de registro
document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;

    const response = await fetch(`${BASE_URL}/usuarios/registro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, rol: 'cliente' })
    });

    if (response.ok) {
        alert('Usuario registrado exitosamente. Ahora puedes iniciar sesión.');
        mostrarLogin();
    } else {
        alert('Error al registrar el usuario. Intenta nuevamente.');
    }
});

// Manejar el formulario de cambio de contraseña
document.getElementById('changePasswordForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem('user'));
    const newPassword = document.getElementById('newPassword').value;

    const response = await fetch(`${BASE_URL}/usuarios/${user.id}/cambiar-password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: newPassword })
    });

    if (response.ok) {
        alert('Contraseña cambiada exitosamente.');
    } else {
        alert('Error al cambiar la contraseña. Intenta nuevamente.');
    }
});

// Manejar el botón de cerrar sesión
document.getElementById('logoutButton').addEventListener('click', () => {
    localStorage.removeItem('user');
    alert('Has cerrado sesión.');
    mostrarLogin();
});

// Cambiar entre login y registro
document.getElementById('showRegister').addEventListener('click', () => {
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('registerSection').style.display = 'block';
});

document.getElementById('showLogin').addEventListener('click', () => {
    document.getElementById('registerSection').style.display = 'none';
    document.getElementById('loginSection').style.display = 'block';
});