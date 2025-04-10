package benchmark;

import com.proyectoweb.appweb.entidades.Producto;
import com.proyectoweb.appweb.servicios.ProductoServicio;
import org.openjdk.jmh.annotations.*;

import java.util.List;
import java.util.concurrent.TimeUnit;

@BenchmarkMode(Mode.AverageTime) // Mide el tiempo promedio
@OutputTimeUnit(TimeUnit.MILLISECONDS)
@State(Scope.Thread)
public class ProductoServicioBenchmark {

    private ProductoServicio productoServicio;

    @Setup(Level.Invocation)
    public void setup() {
        // Crear una instancia manualmente sin Spring (solo para pruebas)
        productoServicio = new ProductoServicio();
        productoServicio = new ProductoServicio() {
            @Override
            public List<Producto> listarTodos() {
                // Simula una lista de productos (sin base de datos)
                return List.of(
                        crearProducto(1L, "Café"),
                        crearProducto(2L, "Azúcar"),
                        crearProducto(3L, "Harina")
                );
            }
        };
    }

    @Benchmark
    public List<Producto> benchmarkListarTodos() {
        return productoServicio.listarTodos();
    }

    private Producto crearProducto(Long id, String nombre) {
        Producto producto = new Producto();
        producto.setIdProducto(id);
        producto.setNombre(nombre);
        return producto;
    }
}
