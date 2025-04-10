package com.proyectoweb.appweb.servicios;

import com.proyectoweb.appweb.entidades.Proveedor;
import com.proyectoweb.appweb.repositorio.ProveedorRepositorio;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class ProveedorServicioTest {

    @Mock
    private ProveedorRepositorio proveedorRepositorio;

    @InjectMocks
    private ProveedorServicio proveedorServicio;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGuardarProveedor() {
        Proveedor proveedor = new Proveedor();
        proveedor.setNombreEmpresa("Empresa X");

        when(proveedorRepositorio.save(proveedor)).thenReturn(proveedor);

        Proveedor resultado = proveedorServicio.guardar(proveedor);

        assertNotNull(resultado);
        assertEquals("Empresa X", resultado.getNombreEmpresa());
    }

    @Test
    void testObtenerProveedorPorId() {
        Proveedor proveedor = new Proveedor();
        proveedor.setId(1L);

        when(proveedorRepositorio.findById(1L)).thenReturn(Optional.of(proveedor));

        Proveedor resultado = proveedorServicio.obtenerPorId(1L);

        assertNotNull(resultado);
        assertEquals(1L, resultado.getId());
    }

    @Test
    void testEliminarProveedor() {
        Long id = 1L;
        proveedorServicio.eliminar(id);
        verify(proveedorRepositorio).deleteById(id);
    }

    @Test
    void testActualizarParcialProveedor() {
        Proveedor existente = new Proveedor();
        existente.setId(1L);
        existente.setNombreEmpresa("Original");

        Proveedor parcial = new Proveedor();
        parcial.setNombreEmpresa("Nuevo Nombre");

        when(proveedorRepositorio.findById(1L)).thenReturn(Optional.of(existente));
        when(proveedorRepositorio.save(any(Proveedor.class))).thenAnswer(i -> i.getArgument(0));

        Proveedor resultado = proveedorServicio.actualizarParcial(1L, parcial);

        assertNotNull(resultado);
        assertEquals("Nuevo Nombre", resultado.getNombreEmpresa());
    }

    @Test
    void testActualizarParcialProveedorNoExiste() {
        Proveedor parcial = new Proveedor();
        parcial.setNombreEmpresa("Cualquiera");

        when(proveedorRepositorio.findById(999L)).thenReturn(Optional.empty());

        Proveedor resultado = proveedorServicio.actualizarParcial(999L, parcial);

        assertNull(resultado);
    }
}
