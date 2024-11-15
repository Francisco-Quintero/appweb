package com.proyectoweb.appweb.controladores;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.proyectoweb.appweb.entidades.Domiciliario;
import com.proyectoweb.appweb.servicios.DomiciliarioServicio;

import java.util.List;

@RestController
@RequestMapping("/api/domiciliarios")
public class DomiciliarioControlador {

    @Autowired
    private DomiciliarioServicio domiciliarioServicio;

    @GetMapping
    public List<Domiciliario> listarTodos() {
        return domiciliarioServicio.listarTodos();
    }

    @GetMapping("/{id}")
    public Domiciliario obtenerPorId(@PathVariable Long id) {
        return domiciliarioServicio.obtenerPorId(id);
    }

    @PostMapping
    public Domiciliario guardar(@RequestBody Domiciliario domiciliario) {
        return domiciliarioServicio.guardar(domiciliario);
    }

    @PutMapping("/{id}")
    public Domiciliario actualizar(@PathVariable Long id, @RequestBody Domiciliario domiciliario) {
        domiciliario.setIdDomiciliario(id);
        return domiciliarioServicio.guardar(domiciliario);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        domiciliarioServicio.eliminar(id);
    }
}

