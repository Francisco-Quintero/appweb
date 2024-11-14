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

    public void eliminar(Long id) {
        productoRepositorio.deleteById(id);
    }
}


