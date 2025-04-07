package com.proyectoweb.appweb.servicios;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.proyectoweb.appweb.entidades.Inventario;
import com.proyectoweb.appweb.entidades.Producto;
import com.proyectoweb.appweb.entidades.Proveedor;
import com.proyectoweb.appweb.entidades.Suministro;
import com.proyectoweb.appweb.repositorio.InventarioRepositorio;
import com.proyectoweb.appweb.repositorio.ProveedorRepositorio;
import com.proyectoweb.appweb.repositorio.SuministroRepositorio;

@Service
public class SuministroServicio {

    @Autowired
    private SuministroRepositorio suministroRepositorio;

    @Autowired
    private InventarioRepositorio inventarioRepositorio;

    @Autowired
private ProveedorRepositorio proveedorRepositorio;

    public List<Suministro> listarTodos() {
        return suministroRepositorio.findAll();
    }

    public Suministro obtenerPorId(Long id) {
        return suministroRepositorio.findById(id).orElse(null);
    }

    public Suministro guardar(Suministro suministro) {
        Producto producto = suministro.getProducto();
        // Buscar el inventario del producto
        Inventario inventario = inventarioRepositorio.findByProducto(producto)
                .orElse(null);
        if (inventario != null) {
            // Si el inventario existe, aumentar el stock
            inventario.setStock(inventario.getStock() + suministro.getCantidad());
        } else {
            // Si no existe, crear un nuevo registro en el inventario
            inventario = new Inventario();
            inventario.setProducto(producto);
            inventario.setStock(suministro.getCantidad());
        }
        // Guardar el inventario actualizado o nuevo
        inventarioRepositorio.save(inventario);
        // Guardar el suministro
        return suministroRepositorio.save(suministro);
    }

    public List<Suministro> guardarTodos(List<Suministro> suministros) {
        // Procesar cada suministro individualmente
        suministros.forEach(this::guardar);
        return suministros;
    }

    public List<Suministro> procesarSuministroBatch(Map<String, Object> request) {
    List<Suministro> suministrosGuardados = new ArrayList<>();

    // Extraer datos del JSON
    Long idProveedor = Long.valueOf(request.get("idProveedor").toString());
    Proveedor proveedor = proveedorRepositorio.findById(idProveedor)
    .orElseThrow(() -> new RuntimeException("Proveedor no encontrado con ID: " + idProveedor));

    // Manejar la fecha del suministro
    LocalDateTime fechaSuministro = LocalDateTime.now(); // Usar la fecha actual por defecto
    if (request.get("fechaSuministro") != null) {
        String fechaSuministroStr = request.get("fechaSuministro").toString();
        DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE_TIME; // Formato ISO 8601
        fechaSuministro = LocalDateTime.parse(fechaSuministroStr, formatter);
    }

    @SuppressWarnings("unchecked")
    List<Map<String, Object>> productos = (List<Map<String, Object>>) request.get("productos");

    // Procesar cada producto
    for (Map<String, Object> productoData : productos) {
        Long idProducto = Long.valueOf(productoData.get("idProducto").toString());
        int cantidad = Integer.parseInt(productoData.get("cantidad").toString());
        Double precioCompraTotal = Double.valueOf(productoData.get("precioCompraTotal").toString());

        // Crear el producto
        Producto producto = new Producto();
        producto.setIdProducto(idProducto);

        // Crear el suministro
        Suministro suministro = new Suministro();
        suministro.setFechaSuministro(java.sql.Timestamp.valueOf(fechaSuministro)); // Convertir LocalDateTime a Timestamp
        suministro.setCantidad(cantidad);
        suministro.setPrecioCompra(precioCompraTotal);
        suministro.setProveedor(proveedor);
        suministro.setProducto(producto);

        // Guardar el suministro
        Suministro suministroGuardado = guardar(suministro);
        suministrosGuardados.add(suministroGuardado);

        // Actualizar el inventario
        Inventario inventario = inventarioRepositorio.findByProducto(producto).orElse(null);
        if (inventario != null) {
            inventario.setStock(inventario.getStock() + cantidad);
        } else {
            inventario = new Inventario();
            inventario.setProducto(producto);
            inventario.setStock(cantidad);
        }
        inventarioRepositorio.save(inventario);
    }

    proveedor.setFrecuenciaAbastecimiento(proveedor.getFrecuenciaAbastecimiento() + 1);
    proveedorRepositorio.save(proveedor); // Guardar el proveedor actualizado

    return suministrosGuardados;
}

    public void eliminar(Long id) {
        suministroRepositorio.deleteById(id);
    }
}