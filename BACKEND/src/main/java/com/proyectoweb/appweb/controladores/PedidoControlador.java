package com.proyectoweb.appweb.controladores;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.proyectoweb.appweb.entidades.Pedido;
import com.proyectoweb.appweb.servicios.PedidoServicio;

import java.util.List;
import java.util.Map;

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

    @PutMapping("/{id}/asignar-domiciliario")
    public ResponseEntity<Pedido> asignarDomiciliario(@PathVariable Long id, @RequestBody Map<String, Long> request) {
        Long idDomiciliario = request.get("idDomiciliario");
    
        // Validar que el ID del domiciliario no sea null
        if (idDomiciliario == null) {
            return ResponseEntity.badRequest().body(null); // Devuelve 400 si el ID es null
        }
    
        Pedido pedidoActualizado = pedidoServicio.asignarDomiciliario(id, idDomiciliario);
        if (pedidoActualizado == null) {
            return ResponseEntity.notFound().build(); // Devuelve 404 si no se encuentra el pedido
        }
        return ResponseEntity.ok(pedidoActualizado); // Devuelve 200 con el pedido actualizado
    }

    @GetMapping("/ventas-activas")
    public ResponseEntity<List<Pedido>> obtenerVentasActivas() {
        List<Pedido> ventasActivas = pedidoServicio
                .obtenerPedidosPorEstados(List.of("pendiente", "en proceso", "en camino"));
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
