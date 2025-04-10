package com.proyectoweb.appweb.servicios;

import com.proyectoweb.appweb.entidades.*;
import com.proyectoweb.appweb.repositorio.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class PedidoServicioTest {

    @Mock
    private PedidoRepositorio pedidoRepositorio;

    @Mock
    private UsuarioRepositorio usuarioRepositorio;

    @Mock
    private InventarioRepositorio inventarioRepositorio;

    @InjectMocks
    private PedidoServicio pedidoServicio;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    private Pedido crearPedidoDePrueba(int stockDisponible, int cantidadSolicitada) {
        Producto producto = new Producto();
        producto.setNombre("Producto Prueba");
        producto.setPrecioUnitario(100.0);

        DetallePedido detalle = new DetallePedido();
        detalle.setProducto(producto);
        detalle.setCantidad(cantidadSolicitada);

        Pedido pedido = new Pedido();
        pedido.setDetalles(Collections.singletonList(detalle));

        Inventario inventario = new Inventario();
        inventario.setProducto(producto);
        inventario.setStock(stockDisponible);

        when(inventarioRepositorio.findByProducto(producto)).thenReturn(Optional.of(inventario));
        when(pedidoRepositorio.save(any(Pedido.class))).thenReturn(pedido);

        return pedido;
    }

    @Test
    void testGuardarPedidoConStockSuficiente() {
        Pedido pedido = crearPedidoDePrueba(10, 5);

        Pedido resultado = pedidoServicio.guardar(pedido);

        assertNotNull(resultado);
        verify(inventarioRepositorio).save(any(Inventario.class));
        verify(pedidoRepositorio).save(pedido);
    }

    @Test
    void testGuardarPedidoSinInventario() {
        Producto producto = new Producto();
        producto.setNombre("SinInventario");

        DetallePedido detalle = new DetallePedido();
        detalle.setProducto(producto);
        detalle.setCantidad(2);

        Pedido pedido = new Pedido();
        pedido.setDetalles(Collections.singletonList(detalle));

        when(inventarioRepositorio.findByProducto(producto)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class, () -> pedidoServicio.guardar(pedido));
        assertTrue(ex.getMessage().contains("Inventario no encontrado"));
    }

    @Test
    void testGuardarPedidoConStockInsuficiente() {
        Pedido pedido = crearPedidoDePrueba(2, 5); // Solo hay 2 en inventario, se solicitan 5

        RuntimeException ex = assertThrows(RuntimeException.class, () -> pedidoServicio.guardar(pedido));
        assertTrue(ex.getMessage().contains("Stock insuficiente"));
    }
}
