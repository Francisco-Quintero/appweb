package com.proyectoweb.appweb.controladores;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.proyectoweb.appweb.entidades.DetalleProducto;
import com.proyectoweb.appweb.servicios.DetalleProductoServicio;

@RestController
@RequestMapping("/api/detalle-productos")
public class DetalleProductoControlador {

    @Autowired
    private DetalleProductoServicio detalleProductoServicio;

    @GetMapping
    public List<DetalleProducto> listarTodos() {
        return detalleProductoServicio.listarTodos();
    }

    @GetMapping("/{id}")
    public DetalleProducto obtenerPorId(@PathVariable Long id) {
        return detalleProductoServicio.obtenerPorId(id);
    }

    @PostMapping
    public DetalleProducto guardar(@RequestBody DetalleProducto detalleProducto) {
        return detalleProductoServicio.guardar(detalleProducto);
    }

    @PutMapping("/{id}")
    public DetalleProducto actualizar(@PathVariable Long id, @RequestBody DetalleProducto detalleProducto) {
        detalleProducto.setIdDetalle(id);
        return detalleProductoServicio.guardar(detalleProducto);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        detalleProductoServicio.eliminar(id);
    }
}
