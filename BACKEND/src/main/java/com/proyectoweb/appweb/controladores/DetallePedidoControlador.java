package com.proyectoweb.appweb.controladores;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.proyectoweb.appweb.entidades.DetallePedido;
import com.proyectoweb.appweb.servicios.DetallePedidoServicio;

@RestController
@RequestMapping("/api/detalle-productos")
public class DetallePedidoControlador {

    @Autowired
    private DetallePedidoServicio detallePedidoServicio;

    @GetMapping
    public List<DetallePedido> listarTodos() {
        return detallePedidoServicio.listarTodos();
    }

    @GetMapping("/{id}")
    public DetallePedido obtenerPorId(@PathVariable Long id) {
        return detallePedidoServicio.obtenerPorId(id);
    }

    @PostMapping
    public DetallePedido guardar(@RequestBody DetallePedido detallePedido) {
        return detallePedidoServicio.guardar(detallePedido);
    }

    @PutMapping("/{id}")
    public DetallePedido actualizar(@PathVariable Long id, @RequestBody DetallePedido detallePedido) {
        detallePedido.setIdDetalle(id);
        return detallePedidoServicio.guardar(detallePedido);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        detallePedidoServicio.eliminar(id);
    }
}
