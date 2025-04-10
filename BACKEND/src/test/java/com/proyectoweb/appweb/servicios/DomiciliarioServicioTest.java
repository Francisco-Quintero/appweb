package com.proyectoweb.appweb.servicios;

import com.proyectoweb.appweb.entidades.Domiciliario;
import com.proyectoweb.appweb.entidades.Usuario;
import com.proyectoweb.appweb.repositorio.DomiciliarioRepositorio;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class DomiciliarioServicioTest {

    @Mock
    private DomiciliarioRepositorio domiciliarioRepositorio;

    @InjectMocks
    private DomiciliarioServicio domiciliarioServicio;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testListarTodos() {
        Domiciliario d1 = new Domiciliario();
        d1.setDisponibilidad("Disponible");

        Domiciliario d2 = new Domiciliario();
        d2.setDisponibilidad("Ocupado");

        when(domiciliarioRepositorio.findAll()).thenReturn(Arrays.asList(d1, d2));

        List<Domiciliario> resultado = domiciliarioServicio.listarTodos();

        assertEquals(2, resultado.size());
        verify(domiciliarioRepositorio, times(1)).findAll();
    }

    @Test
    void testObtenerPorId() {
        Domiciliario d = new Domiciliario();
        d.setIdDomiciliario(1L);
        d.setDisponibilidad("Disponible");

        when(domiciliarioRepositorio.findById(1L)).thenReturn(Optional.of(d));

        Domiciliario resultado = domiciliarioServicio.obtenerPorId(1L);

        assertNotNull(resultado);
        assertEquals("Disponible", resultado.getDisponibilidad());
        verify(domiciliarioRepositorio, times(1)).findById(1L);
    }

    @Test
    void testGuardar() {
        Usuario usuario = new Usuario();
        usuario.setUsername("carlos123");

        Domiciliario d = new Domiciliario();
        d.setDisponibilidad("Disponible");
        d.setUsuario(usuario);

        when(domiciliarioRepositorio.save(d)).thenReturn(d);

        Domiciliario resultado = domiciliarioServicio.guardar(d);

        assertNotNull(resultado);
        assertEquals("Disponible", resultado.getDisponibilidad());
        assertEquals("carlos123", resultado.getUsuario().getUsername());
        verify(domiciliarioRepositorio, times(1)).save(d);
    }

    @Test
    void testEliminar() {
        Long id = 1L;

        domiciliarioServicio.eliminar(id);

        verify(domiciliarioRepositorio, times(1)).deleteById(id);
    }
}
