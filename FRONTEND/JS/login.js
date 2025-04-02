document.getElementById('showRegister').addEventListener('click', () => {
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('registerSection').style.display = 'block';
});

document.getElementById('showLogin').addEventListener('click', () => {
    document.getElementById('registerSection').style.display = 'none';
    document.getElementById('loginSection').style.display = 'block';
});

// Manejar el formulario de login
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    const response = await fetch('http://localhost:26209/api/usuarios/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    if (response.ok) {
        const user = await response.json();
        localStorage.setItem('user', JSON.stringify(user));
        alert(`Bienvenido, ${user.username}`);
        if (user.rol === 'administrador') {
            window.location.href = 'indexGestion.html';
        } else if (user.rol === 'cliente') {
            window.location.href = 'indexTienda.html';
        } else if (user.rol === 'domiciliario') {
            window.location.href = 'indexDomiciliario.html';
        }
    } else {
        alert('Credenciales inválidas');
    }
});

// Manejar el formulario de registro
document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;

    const response = await fetch('http://localhost:26209/api/usuarios/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, rol: 'cliente' })
    });

    if (response.ok) {
        alert('Usuario registrado exitosamente. Ahora puedes iniciar sesión.');
        document.getElementById('registerSection').style.display = 'none';
        document.getElementById('loginSection').style.display = 'block';
    } else {
        alert('Error al registrar el usuario. Intenta nuevamente.');
    }
});