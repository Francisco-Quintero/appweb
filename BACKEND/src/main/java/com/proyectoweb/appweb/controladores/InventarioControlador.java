package com.proyectoweb.appweb.controladores;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.proyectoweb.appweb.entidades.Inventario;
import com.proyectoweb.appweb.servicios.InventarioServicio;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://127.0.0.1:5500")
@RequestMapping("/api/inventarios")
public class InventarioControlador {

    @Autowired
    private InventarioServicio inventarioServicio;

    @GetMapping
    public List<Inventario> listarTodos() {
        return inventarioServicio.listarTodos();
    }

    @GetMapping("/{id}")
    public Inventario obtenerPorId(@PathVariable Long id) {
        return inventarioServicio.obtenerPorId(id);
    }

    @PostMapping
    public ResponseEntity<Inventario> guardar(@RequestBody Inventario inventario) {
        Inventario nuevoInventario = inventarioServicio.guardar(inventario);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoInventario);
    }

    
    @PatchMapping("/{id}")
    public ResponseEntity<Inventario> actualizarParcial(@PathVariable Long id, @RequestBody Inventario inventarioParcial) {
        Inventario inventarioActualizado = inventarioServicio.actualizarParcial(id, inventarioParcial);
        if (inventarioActualizado == null) {
            return ResponseEntity.notFound().build(); // Devuelve 404 si no se encuentra el inventario
        }
        return ResponseEntity.ok(inventarioActualizado); // Devuelve 200 con el inventario actualizado
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        inventarioServicio.eliminar(id);
    }
}
