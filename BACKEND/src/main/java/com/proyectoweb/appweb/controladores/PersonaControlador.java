package com.proyectoweb.appweb.controladores;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.proyectoweb.appweb.entidades.Persona;
import com.proyectoweb.appweb.servicios.PersonaServicio;

import java.util.List;

@RestController
@RequestMapping("/api/personas")
public class PersonaControlador {

    @Autowired
    private PersonaServicio personaServicio;

    @GetMapping
    public List<Persona> listarTodas() {
        return personaServicio.listarTodos();
    }

    @GetMapping("/{id}")
    public Persona obtenerPorId(@PathVariable Long id) {
        return personaServicio.obtenerPorId(id);
    }

    @PostMapping
    public Persona guardar(@RequestBody Persona persona) {
        return personaServicio.guardar(persona);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        personaServicio.eliminar(id);
    }
}

