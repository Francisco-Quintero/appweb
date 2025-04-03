package com.proyectoweb.appweb.controladores;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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

    @GetMapping("/usuarios/{id}")
    public List<Pedido> obtenerPorIdUsuario(@PathVariable Long id) {
        return pedidoServicio.listarPorUsuario(id);
    }

        @GetMapping("/ventas-activas")
    public ResponseEntity<List<Pedido>> obtenerVentasActivas() {
        List<Pedido> ventasActivas = pedidoServicio.obtenerPedidosPorEstados(List.of("pendiente", "en proceso", "en camino"));
        return ResponseEntity.ok(ventasActivas);
    }

    @GetMapping("/historial-ventas")
    public ResponseEntity<List<Pedido>> obtenerHistorialVentas() {
        List<Pedido> historialVentas = pedidoServicio.obtenerPedidosPorEstados(List.of("completado"));
        return ResponseEntity.ok(historialVentas);
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

