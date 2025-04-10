package com.proyectoweb.appweb;

import com.proyectoweb.appweb.entidades.Rol;
import com.proyectoweb.appweb.entidades.Usuario;
import com.proyectoweb.appweb.repositorio.RolRepositorio;
import com.proyectoweb.appweb.servicios.UsuarioServicio;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
public class UsuarioServicioIT {

    @Autowired
    private UsuarioServicio usuarioServicio;

    @Autowired
    private RolRepositorio rolRepositorio;

    private Rol rolPrueba;

    @BeforeEach
    void setup() {
        // Crear un rol de prueba si no existe
        rolPrueba = rolRepositorio.findByNombre("TEST_ROLE")
                .orElseGet(() -> {
                    Rol nuevoRol = new Rol();
                    nuevoRol.setNombre("TEST_ROLE");
                    return rolRepositorio.save(nuevoRol);
                });
    }

    @Test
    void guardarYBuscarUsuarioPorCredenciales() {
        // Arrange
        Usuario usuario = new Usuario();
        usuario.setUsername("lina_test");
        usuario.setPassword("clave123");
        usuario.setNombre("Lina");
        usuario.setApellido("Pérez");
        usuario.setTelefono("1234567890");
        usuario.setDireccion("Calle Falsa 123");
        usuario.setEmail("lina@test.com");
        usuario.setRol(rolPrueba);

        usuarioServicio.guardar(usuario);

        // Act
        Usuario resultado = usuarioServicio.obtenerPorUserYPassword("lina_test", "clave123");

        // Assert
        assertThat(resultado).isNotNull();
        assertThat(resultado.getUsername()).isEqualTo("lina_test");
    }

    @Test
    void validarSiExisteUsername() {
        // Arrange
        Usuario usuario = new Usuario();
        usuario.setUsername("carlos_test");
        usuario.setPassword("qwerty");
        usuario.setNombre("Carlos");
        usuario.setApellido("Sánchez");
        usuario.setTelefono("9876543210");
        usuario.setDireccion("Carrera 45");
        usuario.setEmail("carlos@test.com");
        usuario.setRol(rolPrueba);

        usuarioServicio.guardar(usuario);

        // Act
        boolean existe = usuarioServicio.existeUsername("carlos_test");

        // Assert
        assertThat(existe).isTrue();
    }
}
