package com.proyectoweb.appweb.servicios;

import com.proyectoweb.appweb.entidades.Usuario;
import com.proyectoweb.appweb.repositorio.UsuarioRepositorio;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class UsuarioServicioTest {

    @Mock
    private UsuarioRepositorio usuarioRepositorio;

    @InjectMocks
    private UsuarioServicio usuarioServicio;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGuardarUsuario() {
        Usuario usuario = new Usuario();
        usuario.setUsername("test");
        usuario.setPassword("1234");

        when(usuarioRepositorio.save(usuario)).thenReturn(usuario);

        Usuario resultado = usuarioServicio.guardar(usuario);

        assertNotNull(resultado);
        assertEquals("test", resultado.getUsername());
        verify(usuarioRepositorio).save(usuario);
    }

    
}
