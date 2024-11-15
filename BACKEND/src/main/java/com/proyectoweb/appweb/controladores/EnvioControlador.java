package com.proyectoweb.appweb.controladores;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.proyectoweb.appweb.entidades.Envio;
import com.proyectoweb.appweb.servicios.EnvioServicio;

import java.util.List;

@RestController
@RequestMapping("/api/envios")
public class EnvioControlador {

    @Autowired
    private EnvioServicio envioServicio;

    @GetMapping
    public List<Envio> listarTodos() {
        return envioServicio.listarTodos();
    }

    @GetMapping("/{id}")
    public Envio obtenerPorId(@PathVariable Long id) {
        return envioServicio.obtenerPorId(id);
    }

    @PostMapping
    public Envio guardar(@RequestBody Envio envio) {
        return envioServicio.guardar(envio);
    }

    @PutMapping("/{id}")
    public Envio actualizar(@PathVariable Long id, @RequestBody Envio envio) {
        envio.setIdEnvio(id);
        return envioServicio.guardar(envio);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        envioServicio.eliminar(id);
    }
}

