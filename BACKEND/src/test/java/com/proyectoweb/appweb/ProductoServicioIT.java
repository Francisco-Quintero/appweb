package com.proyectoweb.appweb;

import com.proyectoweb.appweb.entidades.Producto;
import com.proyectoweb.appweb.servicios.ProductoServicio;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;

@SpringBootTest
public class ProductoServicioIT {

    @Autowired
    private ProductoServicio productoServicio;

    @Test
    public void testGuardarYObtenerProducto() {
        Producto producto = new Producto();
        producto.setNombre("Arroz");
        producto.setPrecioUnitario(2500.0);
        producto.setDescripcion("Arroz blanco premium");
        producto.setUnidadMedida("kg");
        producto.setCantidadMedida(1);
        producto.setCategoria("Granos");
        producto.setImagenProducto("imagen.jpg");

        Producto guardado = productoServicio.guardar(producto);

        assertThat(guardado).isNotNull();
        assertThat(guardado.getIdProducto()).isNotNull();

        Producto obtenido = productoServicio.obtenerPorId(guardado.getIdProducto());

        assertThat(obtenido).isNotNull();
        assertThat(obtenido.getNombre()).isEqualTo("Arroz");
    }

    @Test
    public void testListarTodos() {
        List<Producto> productos = productoServicio.listarTodos();
        assertThat(productos).isNotNull();
    }

    @Test
    public void testActualizarProducto() {
        Producto producto = new Producto();
        producto.setNombre("Aceite");
        producto.setPrecioUnitario(8000.0);
        producto.setDescripcion("Aceite vegetal");
        producto.setUnidadMedida("lt");
        producto.setCantidadMedida(1);
        producto.setCategoria("Aceites");
        producto.setImagenProducto("aceite.jpg");

        Producto guardado = productoServicio.guardar(producto);

        Producto actualizado = new Producto();
        actualizado.setNombre("Aceite de girasol");
        actualizado.setPrecioUnitario(9000.0);
        actualizado.setDescripcion("Refinado");
        actualizado.setUnidadMedida("lt");
        actualizado.setCantidadMedida(1);
        actualizado.setCategoria("Aceites");
        actualizado.setImagenProducto("aceite-nuevo.jpg");

        Producto resultado = productoServicio.actualizar(guardado.getIdProducto(), actualizado);

        assertThat(resultado.getNombre()).isEqualTo("Aceite de girasol");
        assertThat(resultado.getPrecioUnitario()).isEqualTo(9000.0);
    }

    @Test
    public void testEliminarProducto() {
        Producto producto = new Producto();
        producto.setNombre("Sal");
        producto.setPrecioUnitario(1000.0);
        producto.setDescripcion("Sal fina");
        producto.setUnidadMedida("kg");
        producto.setCantidadMedida(1);
        producto.setCategoria("Condimentos");
        producto.setImagenProducto("sal.jpg");

        Producto guardado = productoServicio.guardar(producto);
        Long id = guardado.getIdProducto();

        productoServicio.eliminar(id);
        Producto eliminado = productoServicio.obtenerPorId(id);

        assertThat(eliminado).isNull();
    }
}
