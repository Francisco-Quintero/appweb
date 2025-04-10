package com.proyectoweb.appweb.controladores;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.proyectoweb.appweb.entidades.Pedido;
import com.proyectoweb.appweb.servicios.PedidoServicio;

import java.util.List;

@RestController
@RequestMapping("/api/pedidos")
public class PedidoControlador {

    @Autowired
    private PedidoServicio pedidoServicio;

    @GetMapping
    public List<Pedido> listarTodos() {
        return pedidoServicio.listarTodos();
    }

    @GetMapping("/{id}")
    public Pedido obtenerPorId(@PathVariable Long id) {
        return pedidoServicio.obtenerPorId(id);
    }

    @GetMapping("/clientes/{id}")
    public List<Pedido> obtenerPorIdCliente(@PathVariable Long id) {
        return pedidoServicio.listarPorCliente(id);
    }
    
    @PostMapping
    public Pedido guardar(@RequestBody Pedido pedido) {
        return pedidoServicio.guardar(pedido);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        pedidoServicio.eliminar(id);
    }
}

