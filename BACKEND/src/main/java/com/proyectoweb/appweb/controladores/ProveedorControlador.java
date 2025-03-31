package com.proyectoweb.appweb.controladores;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.proyectoweb.appweb.entidades.Proveedor;
import com.proyectoweb.appweb.servicios.ProveedorServicio;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://127.0.0.1:5500")
@RequestMapping("/api/proveedores")
public class ProveedorControlador {

    @Autowired
    private ProveedorServicio proveedorServicio;

    @GetMapping
    public List<Proveedor> listarTodos() {
        return proveedorServicio.listarTodos();
    }

    @GetMapping("/{id}")
    public Proveedor obtenerPorId(@PathVariable Long id) {
        return proveedorServicio.obtenerPorId(id);
    }

    @PostMapping
    public Proveedor guardar(@RequestBody Proveedor proveedor) {
        return proveedorServicio.guardar(proveedor);
    }

    @PutMapping("/{id}")
    public Proveedor actualizar(@PathVariable Long id, @RequestBody Proveedor proveedor) {
        proveedor.setIdProveedor(id);
        return proveedorServicio.guardar(proveedor);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Proveedor> actualizarParcial(@PathVariable Long id, @RequestBody Proveedor proveedorParcial) {
        Proveedor proveedorActualizado = proveedorServicio.actualizarParcial(id, proveedorParcial);
        if (proveedorActualizado == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(proveedorActualizado);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        proveedorServicio.eliminar(id);
    }
}
