package com.proyectoweb.appweb.controladores;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.proyectoweb.appweb.entidades.Producto;
import com.proyectoweb.appweb.servicios.ProductoServicio;

import java.util.List;

@RestController
@RequestMapping("/api/productos")
public class ProductoControlador {

    /*@GetMapping("/api/productos")
    public String obtenerProductos() {
        return "¡Hola! Aquí están los productos disponibles.";
    } */

    @Autowired
    private ProductoServicio productoServicio;

    @GetMapping
    public List<Producto> listarTodos() {
        return productoServicio.listarTodos();
    }

    @GetMapping("/{id}")
    public Producto obtenerPorId(@PathVariable Long id) {
        return productoServicio.obtenerPorId(id);
    }

    @PostMapping
    public Producto guardar(@RequestBody Producto producto) {
        return productoServicio.guardar(producto);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        productoServicio.eliminar(id);
    }
}
