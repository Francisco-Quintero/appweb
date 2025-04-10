package com.proyectoweb.appweb.servicios;

import com.proyectoweb.appweb.entidades.Producto;
import com.proyectoweb.appweb.repositorio.ProductoRepositorio;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class ProductoServicioTest {

    @Mock
    private ProductoRepositorio productoRepositorio;

    @InjectMocks
    private ProductoServicio productoServicio;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGuardarProducto() {
        Producto producto = new Producto();
        producto.setNombre("Arroz");

        when(productoRepositorio.save(producto)).thenReturn(producto);

        Producto resultado = productoServicio.guardar(producto);

        assertNotNull(resultado);
        assertEquals("Arroz", resultado.getNombre());
    }

    @Test
    void testObtenerProductoPorId() {
        Producto producto = new Producto();
        producto.setIdProducto(1L);

        when(productoRepositorio.findById(1L)).thenReturn(Optional.of(producto));

        Producto resultado = productoServicio.obtenerPorId(1L);

        assertNotNull(resultado);
        assertEquals(1L, resultado.getIdProducto());
    }

    @Test
    void testEliminarProducto() {
        Long id = 1L;
        productoServicio.eliminar(id);
        verify(productoRepositorio).deleteById(id);
    }

    @Test
    void testActualizarProductoExistente() {
        Producto existente = new Producto();
        existente.setIdProducto(1L);
        existente.setNombre("Viejo nombre");

        Producto actualizado = new Producto();
        actualizado.setNombre("Nuevo nombre");
        actualizado.setPrecioUnitario(2500.0);
        actualizado.setDescripcion("Actualizado");
        actualizado.setUnidadMedida("kg");
        actualizado.setCantidadMedida((int) 2.0);
        actualizado.setCategoria("Granos");
        actualizado.setImagenProducto("imagen.jpg");

        when(productoRepositorio.findById(1L)).thenReturn(Optional.of(existente));
        when(productoRepositorio.save(any(Producto.class))).thenAnswer(i -> i.getArgument(0));

        Producto resultado = productoServicio.actualizar(1L, actualizado);

        assertNotNull(resultado);
        assertEquals("Nuevo nombre", resultado.getNombre());
        assertEquals(2500.0, resultado.getPrecioUnitario());
        assertEquals("Granos", resultado.getCategoria());
    }

    @Test
    void testActualizarProductoNoExistenteLanzaExcepcion() {
        Producto actualizado = new Producto();
        actualizado.setNombre("Cualquiera");

        when(productoRepositorio.findById(999L)).thenReturn(Optional.empty());

        Exception excepcion = assertThrows(RuntimeException.class, () -> {
            productoServicio.actualizar(999L, actualizado);
        });

        assertTrue(excepcion.getMessage().contains("Producto no encontrado"));
    }
}
