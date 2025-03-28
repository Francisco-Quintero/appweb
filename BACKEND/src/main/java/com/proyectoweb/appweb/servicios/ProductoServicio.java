package com.proyectoweb.appweb.servicios;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.proyectoweb.appweb.entidades.Producto;
import com.proyectoweb.appweb.repositorio.ProductoRepositorio;

import java.util.List;

@Service
public class ProductoServicio {

    @Autowired
    private ProductoRepositorio productoRepositorio;

    public List<Producto> listarTodos() {
        return productoRepositorio.findAll();
    }

    public Producto obtenerPorId(Long id) {
        return productoRepositorio.findById(id).orElse(null);
    }

    public Producto guardar(Producto producto) {
        return productoRepositorio.save(producto);
    }

    public Producto actualizar(Long id, Producto productoActualizado) {
        java.util.Optional<Producto> productoExistente = productoRepositorio.findById(id);
        
        if (productoExistente.isPresent()) {
            Producto producto = productoExistente.get();
            producto.setNombre(productoActualizado.getNombre());
            producto.setPrecioUnitario(productoActualizado.getPrecioUnitario());
            producto.setDescripcion(productoActualizado.getDescripcion());
            producto.setUnidadMedida(productoActualizado.getUnidadMedida());
            producto.setCantidadMedida(productoActualizado.getCantidadMedida());
            producto.setCategoria(productoActualizado.getCategoria());
            producto.setImagenProducto(productoActualizado.getImagenProducto());
            return productoRepositorio.save(producto);
        } else {
            throw new RuntimeException("Producto no encontrado con ID: " + id);
        }
    }

    public void eliminar(Long id) {
        productoRepositorio.deleteById(id);
    }
}


