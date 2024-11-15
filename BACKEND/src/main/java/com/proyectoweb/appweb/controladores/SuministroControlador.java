package com.proyectoweb.appweb.controladores;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.proyectoweb.appweb.entidades.Suministro;
import com.proyectoweb.appweb.servicios.SuministroServicio;

import java.util.List;

@RestController
@RequestMapping("/api/suministros")
public class SuministroControlador {

    @Autowired
    private SuministroServicio suministroServicio;

    @GetMapping
    public List<Suministro> listarTodos() {
        return suministroServicio.listarTodos();
    }

    @GetMapping("/{id}")
    public Suministro obtenerPorId(@PathVariable Long id) {
        return suministroServicio.obtenerPorId(id);
    }

    @PostMapping
    public Suministro guardar(@RequestBody Suministro suministro) {
        return suministroServicio.guardar(suministro);
    }

    @PutMapping("/{id}")
    public Suministro actualizar(@PathVariable Long id, @RequestBody Suministro suministro) {
        suministro.setIdSuministro(id);
        return suministroServicio.guardar(suministro);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        suministroServicio.eliminar(id);
    }
}

