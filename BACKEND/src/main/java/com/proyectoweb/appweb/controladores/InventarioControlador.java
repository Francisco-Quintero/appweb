package com.proyectoweb.appweb.controladores;

import org.springframework.beans.factory.annotation.Autowired;
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
    public Inventario guardar(@RequestBody Inventario inventario) {
        return inventarioServicio.guardar(inventario);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        inventarioServicio.eliminar(id);
    }
}

